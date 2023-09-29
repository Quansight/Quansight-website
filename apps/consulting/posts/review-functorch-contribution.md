---
title: 'Review: `torch.func` Contribution'
published: September 22, 2023
author: kshiteej-kalambarkar
description: '`torch.func` (previously known as `functorch`) is a PyTorch module
designed to offer JAX-like transforms. Within this module, various higher-order
functions, such as `grad`, `vmap`, and `vjp` are made accessible. These
transforms help users to easily compute gradients for the parameters of their model
or write batch-size agnostic code. The beauty of these transformations lies in
their ability to compose with one another. Thanks to this, the process of
calculating per-sample gradients becomes the straightforward application of
`vmap(grad(model))`.'
---

<base target="_blank" />

`torch.func` (previously known as `functorch`) is a PyTorch module designed to
offer JAX-like transforms. Within this module, various higher-order
functions, such as `grad`, `vmap`, and `vjp` are made accessible. These
transforms help users to easily compute gradients for the parameters of their model
or write batch-size agnostic code. The beauty of these transformations lies in
their ability to compose with one another. Thanks to this, the process of
calculating per-sample gradients becomes the straightforward application of
`vmap(grad(model))`.

Here are a few of the tasks we had the opportunity to tackle:

## Adding Batching Rules for `vmap`
`vmap` is a transformation that accepts a function that operates on non-batched
tensors and returns a new function that operates on batched tensors.
When processing a batched input, an additional
dimension, denoted by `in_dims`, is introduced to indicate which dimension to
apply the function over. Conceptually, it emulates a `for` loop that iterates
through all the data points and stacks the results. Importantly, it performs this
operation efficiently by pushing the `for` loop into the PyTorch operations,
allowing the batches to run in parallel.

Consider the following example:
```python
import torch

# Written to handle only single sample.
def my_simple_model(feature_vec, weight):
    return torch.dot(feature_vec, weight).relu()

batch_size = 4
batched_inputs = torch.randn(batch_size, 3)
weight = torch.randn(3)

# For Loop version
expected = []
for input in batched_inputs:
    expected.append(my_simple_model(input, weight))
expected = torch.stack(expected)

# Vmap
# `in_dims` specifies the dimension that should be mapped over.
# In this case, we map only over 0-dim of `batched_inputs`.
actual = torch.vmap(my_simple_model, in_dims=(0, None))(batched_inputs, weight)

# Verify that the results match.
torch.testing.assert_close(expected, actual)
```

To support `vmap` for PyTorch operators, we need to specify the batching rule
i.e. how to map the given function over a batched input.
A batching rule is essentially a function which takes one or multiple batched
inputs and computes the batched operation. In the above example to support
`vmap` for `my_simple_model`, we need to know the batching rule for `torch.dot`
and `torch.relu` to be able to vectorize our model.
PyTorch has more than [2000 operators](https://dev-discuss.pytorch.org/t/where-do-the-2000-pytorch-operators-come-from-more-than-you-wanted-to-know/373)
and we need to have coverage for all of them
to support `vmap`. That being said, there is a `for`-loop
fallback in case an operator is not supported so as not to crash the code.

From the point of view of adding batch rule, PyTorch operators can be roughly
categorised as primitive or composite.
Primitive operators are the ones for which we specify the batching and
gradient rules. Composite operators are implemented using these primitive operators
and other simpler composite operators. If we implement batching rules for every
primitive operator, we automatically get the batching rules for composite operators.

There are two ways to add batching support for an operator:
* Manually write the batching rule. See for example the [batching rule for torch.dot](https://github.com/pytorch/pytorch/blob/b30ee35a6f141d3247a24fd09f96ea50a7e2b3c7/aten/src/ATen/functorch/BatchRulesLinearAlgebra.cpp#L25-L34)
* Decompose operators using other operators for which we already have a
batching rule. See for example the [batching rule for torch.vdot](https://github.com/pytorch/pytorch/blob/b30ee35a6f141d3247a24fd09f96ea50a7e2b3c7/aten/src/ATen/functorch/BatchRulesLinearAlgebra.cpp#L35-L37)

## Composite Compliance

As mentioned earlier, we obtain batching rules effortlessly for composite operators
but this holds true only under certain constraints. These constraints include
refraining from accessing the tensor's data pointer and avoiding the use of
`out=` variants of the operators.
For the full list of constraints, see [this documentation](https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/README.md#composite-compliance).
When all these hold for an operator, we say that it is composite compliant.

Unfortunately, operators that claim to be composite may occasionally deviate
from these constraints. While such deviations may not pose issues when utilizing
plain eager PyTorch, they can lead to complications when using `torch.func`
transformations.

### Testing for Composite Compliance

We have tests to ensure that operators tagged as composite are indeed composite
compliant. We test this by creating a new subclass `CompositeCompliantTensor`
that utilizes the `__torch_dispatch__` mechanism. This mechanism is invoked for
all operators in the testing, enabling us to detect any non-compliant behavior
exhibited by an operator.

Our testing approach involves running tests on the actual [operator](https://github.com/pytorch/pytorch/blob/40b2c796dcae5768ff5de279b13914d5948fd414/test/test_ops.py#L1446),
as well as their [backward formula](https://github.com/pytorch/pytorch/blob/40b2c796dcae5768ff5de279b13914d5948fd414/test/test_ops.py#L1459)
and [forward AD formula](https://github.com/pytorch/pytorch/blob/40b2c796dcae5768ff5de279b13914d5948fd414/test/test_ops.py#L1476).
Testing both the backward and forward formulas is crucial because we may encounter
scenarios involving `vmap(vjp(fn))` or `vmap(jvp(fn))`.

## Support for `chunk_size` in `vmap` and `jacrev`

The computation of the Jacobian can be memory-intensive, and users have raised
concerns about related issues, (e.g., [this one](https://github.com/pytorch/functorch/issues/680)).
In response to these concerns, we have introduced a feature that allows for the
calculation of `jacrev` and `vmap` in smaller, user-defined chunks, determined
by the `chunk_size` argument. This adjustment serves to reduce the peak memory
usage during the computation process. With this argument, users can specify the
number of rows of the Jacobian to be computed at once. This enhancement was
incorporated into the [jacrev PR](https://github.com/pytorch/pytorch/pull/89376)
and the [vmap PR](https://github.com/pytorch/pytorch/pull/91157).

## Support for `linearize` transform

The "jvp" transform is designed to calculate both `f(x)` and the Jacobian-vector
product. Consequently, even when one intends to compute the Jacobian-vector
product for fixed inputs, the `jvp` transform still redundantly evaluates `f(x)`.
To address such scenarios, the `linearize` transform comes into play. This
transform proves valuable when multiple `jvp` computations are needed for
constant inputs.

Note that, in order to implement this efficiently, `linearize` stores some
intermediate computations, which can result in higher memory requirements compared
to directly applying `jvp`. The `linearize` transform was implemented in this
[PR](https://github.com/pytorch/pytorch/pull/94173).

## Support of `torch.func` transforms within `torch.compile`

PyTorch 2.0 introduced a JIT compiler under `torch.compile`, similar to `jax.jit`.
This opened up the possibility of compiling the existing transforms to enhance
their performance. To understand how these transforms can be compiled, it is
essential to discuss the workings of the three layers within the compilation
stack, namely `dynamo`, `aot_autograd`, and `inductor`.

The `dynamo` and `aot_autograd` layers primarily focus on capturing the
computation graph and converting the captured operations into more basic operations.
This captured graph is then passed to `inductor`, the compiler. `inductor` then applies
various optimizations passes before generating specialized code.

To gain insight into the different stages of this stack,
let us compile a simple program in debug mode.

```python
# Run this file with `TORCH_COMPILE_DEBUG=1`

import torch

def fn(x):
    return torch.sin(x) + torch.square(x)

torch.compile(fn)(torch.randn(4, 4))
```

**dynamo**: The primary responsibility of dynamo is to trace the Python program
and convert it into the FX graph format. The FX graph generated by `dynamo`
represents PyTorch operations from the public API, such as `torch.sin`.
Below, you can observe the graph captured by `dynamo`.

```python
class GraphModule(torch.nn.Module):
    def forward(self, L_x_ : torch.Tensor):
        l_x_ = L_x_

        # File: test/test_scratch.py:334, code: return torch.sin(x) + torch.square(x)
        sin = torch.sin(l_x_)
        square = torch.square(l_x_);  l_x_ = None
        add = sin + square;  sin = square = None
        return (add,)
```

**aot_autograd**: `aot_autograd` retraces all PyTorch operations to
produce a lower-level FX graph using `aten` functions (from the private API).
Additionally, `aot_autograd` decomposes composite operations into primitive
operations. For instance, a composite operation like `torch.square` is traced
down to `torch.pow(x, 2)`.

Moreover, `aot_autograd` also manages the creation of the backward graph when
requested. This is useful for transforms like `grad`, `vjp`, etc. Below, you can see the
graph generated by `aot_autograd` for the above program.

```python
def forward(self, arg0_1: f32[4, 4]):
    # File: test/test_scratch.py:334, code: return torch.sin(x) + torch.square(x)
    sin: f32[4, 4] = torch.ops.aten.sin.default(arg0_1)
    pow_1: f32[4, 4] = torch.ops.aten.pow.Tensor_Scalar(arg0_1, 2);  arg0_1 = None
    add: f32[4, 4] = torch.ops.aten.add.Tensor(sin, pow_1);  sin = pow_1 = None
    return (add,)

```

**inductor**: As discussed above, it is inductor's job to apply optimizations and
generate specialized code. In this case, it has fused `sin` and `square` to run
within the same `for`-loop. This allows the generated program to do more compute
per read/write effectively improving the memory bandwidth utilization.

```c++
extern "C" void kernel(const float* in_ptr0, float* out_ptr0) {
  for (long i0 = 0L; i0 < 16L; i0 += 8L) {
    auto tmp0 = at::vec::Vectorized<float>::loadu(in_ptr0 + i0);
    auto tmp1 = tmp0.sin();
    auto tmp2 = tmp0 * tmp0;
    auto tmp3 = tmp1 + tmp2;
    tmp3.store(out_ptr0 + i0);
  }
}
```

### Teaching `dynamo` about `torch.func` transforms

Now that we have a basic understanding of how `torch.compile` works, let us
delve into how we extended the support for `torch.func` transforms. Given that
`aot_autograd` is already capable of tracing through the transforms, our task is
to teach `dynamo` to validate whether the user-defined function intended for
transformation is free of side effects affecting the global state or graph-breaks.
In cases where the function meets these criteria, we can put
the `torch.func` transform into the FX graph and delegate the remaining
processing to the lower layers of the stack.

However, if the function cannot be successfully traced due to its failure to
meet the above constraints, we fallback to the eager implementation, and this
particular portion of the code remains uncompiled.

Let us have a look what `dynamo` and `aot_autograd` generates when we compile
program with `grad`.

```python
# Run this file with `TORCH_COMPILE_DEBUG=1`

import torch

def user_fn(x):
    return torch.sin(x)

def wrapper_fn(x):
    return torch.func.grad(user_fn)(x)

torch.compile(wrapper_fn)(torch.randn(()))

```

The output from `dynamo` is presented below. The initial `GraphModule` pertains
to the `wrapper_fn`, clearly indicating a call to `grad` on the traced representation
of the user's function intended for transformation. Subsequently, the second
`GraphModule` corresponds to the function provided by the user. In this instance,
our function didn't have side effects and graph-breaks. Thus, we were able to
successfully trace through this program in one graph.

```python
class GraphModule(torch.nn.Module):
    def forward(self, L_x_ : torch.Tensor):
        l_x_ = L_x_
        
        # File: torch/_functorch/apis.py:363, code:
        # return eager_transforms.grad_impl(func, argnums, has_aux, args, kwargs)
        grad_body_0 = self.grad_body_0
        grad_proxy = torch.func.grad(grad_body_0, 0, False);  grad_body_0 = None
        call = grad_proxy.__call__(l_x_);  grad_proxy = l_x_ = None
        contiguous = call.contiguous();  call = None
        return (contiguous,)
        
    class GraphModule(torch.nn.Module):
        def forward(self, l_x_):
            # No stacktrace found for following nodes
            _set_grad_enabled = torch._C._set_grad_enabled(True)

            # File: test/test_scratch.py:382, code: return torch.sin(x)
            sin = torch.sin(l_x_);  l_x_ = None

            # No stacktrace found for following nodes
            _set_grad_enabled_1 = torch._C._set_grad_enabled(True)
            return sin
```

The graph shown above is handed over to `aot_autograd` for the subsequent phase
of the compilation process. `aot_autograd` performs a trace through the
transformation, resulting in the generation of the transformed graph. This
explains why we observe a call to `cos` instead of `sin`. `aot_autograd`
has traced through the forward and backward graph, as we have applied the `grad` transform,
then optimized away the forward computation as `grad` discards that value.

```python
def forward(self, arg0_1: f32[]):
    # File: torch/_functorch/apis.py:363,
    # code: return eager_transforms.grad_impl(func, argnums, has_aux, args, kwargs)
    full: f32[] = torch.ops.aten.full.default([], 1, dtype = torch.float32,
                                              layout = torch.strided,
                                              device = device(type='cpu'),
                                              pin_memory = False)
    cos: f32[] = torch.ops.aten.cos.default(arg0_1);  arg0_1 = None
    mul: f32[] = torch.ops.aten.mul.Tensor(full, cos);  full = cos = None
    return (mul,)
```

The inclusion of `torch.func` support within `torch.compile` is currently under
active development. At present, our support extends
to the compilation of `grad` and `vmap`. However, it is important to note that
there are certain [limitations](https://pytorch.org/docs/main/torch.compiler_faq.html#limitations)
that restrict the range of cases we can compile.

Looking ahead, our roadmap aims to extend the support for all transforms with
minimal limitations, providing a more comprehensive compilation support for `torch.func`
transforms

## Closing Remarks
This project was yet another instance of the tight collaboration between Quansight
and Meta within PyTorch. In particular, we would like to thank Richard Zou and
Horace He, the `torch.func` creators, for all the design discussions and
guidance throughout these years.
