---
title: 'Review: `torch.func` Contribution'
published: September 22, 2023
author: kshiteej-kalambarkar
description: '`torch.func` (previously `functorch`) is a PyTorch module to
provide JAX-like transforms. This module exposes higher order functions like
`grad`, `vmap` and `vjp`. These functional transforms allow the user to compute
in a functional way transformations on the whole model at once. And being
composable, one can compute per-sample gradients simply by using `vmap(grad(model))`.'
---

<base target="_blank" />

`torch.func` (previously `functorch`) is a PyTorch module to provide JAX-like
transforms. This module exposes higher order functions like `grad`, `vmap` and
`vjp`. These functional transforms allow the user to compute in a functional
way transformations on the whole model at once. These transforms can compose
arbitrarily. This makes computing per-sample gradients as simple as using
`vmap(grad(model))`.

Below are some of the things that we got to work on:

## Adding Batching Rule for `vmap`
`vmap` is a transform which takes a function `func` that runs on a single
datapoint and returns a function which can handle a batch of data effectively
vectorizing it. Semantically, it runs a `for`-loop over all data points and
stacks all the results together. It does so efficiently by pushing the `for`-loop
into the PyTorch operations, effectively vectorizing the computation. Consider the
following example:

Example:
```python
import torch

# Written to handle only single sample.
# Calling it with batched input, will
# result in incorrect output.
def my_simple_model(input, weight, bias):
    return input @ weight + bias

batched_inputs = torch.randn(3, 3, 3, 3)
weight = torch.randn(3, 1) * 5
bias = torch.randn([])

# For Loop version
expected = []
for input in batched_inputs:
    expected.append(my_simple_model(input, weight, bias))
expected = torch.stack(expected)

# Vmap
# `in_dims` specifies the dimension that should be mapped over.
# In this case, we map only over 0-dim of `batched_inputs`.
actual = torch.vmap(my_simple_model, in_dims=(0, None, None))(batched_inputs, weight, bias)

# Verify that the results match.
torch.testing.assert_close(expected, actual)

```

To support `vmap` for PyTorch operators, we need to specify the batching rule
i.e. how to apply the given operator for a batched input. This is similar to how
PyTorch internally specifies the rule for gradient computation for operators.
Batching rule is essentially a function which takes one or multiple batched
inputs and computes the batched operation. In the above example to support
`vmap` for `my_simple_model`, we need to know the batching rule for `torch.sum`,
`@`/`torch.matmul` and `+`/`torch.add` to be able to vectorize our model.
PyTorch has a lot of operators and we need to have coverage for all the
operators to seamlessly support optimized `vmap`. There is a `for`-loop
fallback in case an operator is not supported so as not to crash the code.

PyTorch operators can be roughly categorized as primitive (internally
`CompositeExplicitAutograd`) vs composite (internally `CompositeImplicitAutograd`).
Composite operators are derived from the primitive operators. To have
complete coverage, we need to have batching rules for all the primitive operators
and we get the rules for composite operators for free.

To add a batching rules for a primitive operator, we can
* Manually write the batching rule. See for example the [batching rule for torch.dot](https://github.com/pytorch/pytorch/blob/b30ee35a6f141d3247a24fd09f96ea50a7e2b3c7/aten/src/ATen/functorch/BatchRulesLinearAlgebra.cpp#L25-L34)
* Decompose operators using other operators for which we already have a
batching rule. See for example the [batching rule for torch.vdot](https://github.com/pytorch/pytorch/blob/b30ee35a6f141d3247a24fd09f96ea50a7e2b3c7/aten/src/ATen/functorch/BatchRulesLinearAlgebra.cpp#L35-L37)

## Composite Compliance

Above we mentioned that we get batching rules for free for composite operators.
But that is true only if the operator follows [a few constraints](https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/README.md#composite-compliance)
like they should not access the data pointer of the tensor, they should not call
`out=` variants of the operators, etc. Unfortunately, operators which claim to
be composite can sometimes not follow these constraints and that works when you
are using plain eager PyTorch but can lead to problems with `torch.func` transforms
(eg. what does accessing `item` or `data_ptr` on BatchedTensor mean?).

### Testing for Composite Compliance

The idea is to write extensive tests to verify that the constraints are met.
This is achieved by having a new subclass and with `__torch_dispatch__` mechanism,
we error on the non-compliant behaviour. We run the test on the actual
[operator](https://github.com/pytorch/pytorch/blob/40b2c796dcae5768ff5de279b13914d5948fd414/test/test_ops.py#L1446), their [backward formula](https://github.com/pytorch/pytorch/blob/40b2c796dcae5768ff5de279b13914d5948fd414/test/test_ops.py#L1459) and their [forward formula](https://github.com/pytorch/pytorch/blob/40b2c796dcae5768ff5de279b13914d5948fd414/test/test_ops.py#L1476). The reason for having the test on backward and forward formula is
because we can have `vmap(vjp(fn))` or `vmap(jvp(fn))` which requires them to be
Composite Compliant.

### Fixing the operators on case by case basis.

Once we had the tests and the list of failing operators, it was a matter of
going through the list, verifying what was the cause of the operator being
non-compliant and devising a fix for the same. The issue tracker can be found
[here](https://github.com/pytorch/pytorch/issues/69991).

## Support for `chunk_size` in `vmap` and `jacrev`
Computing the Jacobian can require a lot of memory and related
[issue](https://github.com/pytorch/functorch/issues/680) were raised by the users.
To mitigate this, we added support to compute the `jacrev` and `vmap` in smaller
chunks decided based on `chunk_size` argument to reduce the peak memory usage
during the computation. Using this argument user can specify the number of rows
of the Jacobian to be computed at once. Same argument was added to `vmap` for
similar purpose. This feature was added in [jacrev PR](https://github.com/pytorch/pytorch/pull/89376)
and [vmap PR](https://github.com/pytorch/pytorch/pull/91157).

## Support for `linearize` transform

`jvp` transform computes both `f(x)` and jacobian-vector product. So, even if
one wants to compute `jvp` for fixed inputs, `jvp` transform ends up repeating
the evaluation of `f(x)`. For such scenarios, one can use `linearize` which is
useful if `jvp` is to be computed multiple times at fixed `primals`. However,
to achieve this, linearize saves intermediate computation and has higher memory
requrements than directly applying `jvp`. `linearize` was added in this
[PR](https://github.com/pytorch/pytorch/pull/94173)

## Supporting transforms for `torch.compile`

PyTorch 2.0 provided a new compilation stack `torch.compile`. `torch.func` was
missing `jit` transform compared to JAX, so this is opened the ability to compile
the present transforms. To understand, how we can compile these transforms. We
need to understand the three layers of the compilation stack namely `dynamo`,
`aot_autograd`, `inductor`. `dynamo` and `aot_autograd` deal mainly with graph
capture and lowering of the captured operators into more primitive operators.
`inductor` is more like a compiler which takes the captured graph and actually
applies fusion and other optimisations before generating specialized code.

To get an idea of what happens at different stages of the stack, let's compile
a simple program with debug mode.

```python
# Run this file with `TORCH_COMPILE_DEBUG=1` env flag.

import torch

def fn(x):
    return torch.sin(x) + torch.square(x)

torch.compile(fn)(torch.randn(3, 3))
```

dynamo: dynamo's job is to capture the PyTorch program being traced and
represent it in the FX graph format. The FX graph captured by Dynamo captures
the PyTorch operations at public API level (eg. `torch.sin`). Below is the graph
capture by dynamo.

```python=
class GraphModule(torch.nn.Module):
    def forward(self, L_x_ : torch.Tensor):
        l_x_ = L_x_

        # File: test/test_scratch.py:334, code: return torch.sin(x) + torch.square(x)
        sin = torch.sin(l_x_)
        square = torch.square(l_x_);  l_x_ = None
        add = sin + square;  sin = square = None
        return (add,)
```

aot_autograd: aot_autograd traces through all the PyTorch operations to generate
a FX graph but this time with the `aten` operators. It also decomposes composite
operations into more primitive ones (eg. `torch.square` which is composite will
get traced down to `torch.pow(x, 2)`). `aot_autograd` also handles generating the
`backward` graph if requested. That is where the name comes from ahead of time
autograd / `aot_autograd`.

```python
def forward(self, arg0_1: f32[3, 3]):
    # File: test/test_scratch.py:334, code: return torch.sin(x) + torch.square(x)
    sin: f32[3, 3] = torch.ops.aten.sin.default(arg0_1)
    pow_1: f32[3, 3] = torch.ops.aten.pow.Tensor_Scalar(arg0_1, 2);  arg0_1 = None
    add: f32[3, 3] = torch.ops.aten.add.Tensor(sin, pow_1);  sin = pow_1 = None
    return (add,)

```

inductor: As discussed above, it is inductor's job to apply optimisations and
generate specialised code. In this case, it has fused `sin` and `square` to run
within the same `for`-loop. This allows the generated program to do more compute
per read/write effectively improving the memory bandwith utilization.

```python
from ctypes import c_void_p, c_long
import torch
import math
import random
import os
import tempfile
from math import inf, nan
from torch._inductor.hooks import run_intermediate_hooks
from torch._inductor.utils import maybe_profile

from torch import empty_strided, device
from torch._inductor.codecache import AsyncCompile
from torch._inductor.select_algorithm import extern_kernels

aten = torch.ops.aten
assert_size_stride = torch._C._dynamo.guards.assert_size_stride
reinterpret_tensor = torch.ops.inductor._reinterpret_tensor
async_compile = AsyncCompile()


cpp_fused_add_cos_sin_0 = async_compile.cpp('''
#include "/tmp/torchinductor_kshiteej/ib/cibrnuq56cxamjj4krp4zpjvsirbmlolpbnmomodzyd46huzhdw7.h"
extern "C" void kernel(const float* in_ptr0,
                       float* out_ptr0)
{
    {
        for(long i0=static_cast<long>(0L); i0<static_cast<long>(8L); i0+=static_cast<long>(8L))
        {
            auto tmp0 = at::vec::Vectorized<float>::loadu(in_ptr0 + static_cast<long>(i0));
            auto tmp1 = tmp0.sin();
            auto tmp2 = tmp0.cos();
            auto tmp3 = tmp1 + tmp2;
            tmp3.store(out_ptr0 + static_cast<long>(i0));
        }
        #pragma omp simd simdlen(4) 
        for(long i0=static_cast<long>(8L); i0<static_cast<long>(9L); i0+=static_cast<long>(1L))
        {
            auto tmp0 = in_ptr0[static_cast<long>(i0)];
            auto tmp1 = std::sin(tmp0);
            auto tmp2 = std::cos(tmp0);
            auto tmp3 = tmp1 + tmp2;
            out_ptr0[static_cast<long>(i0)] = tmp3;
        }
    }
}
''')


async_compile.wait(globals())
del async_compile

def call(args):
    arg0_1, = args
    args.clear()
    assert_size_stride(arg0_1, (3, 3), (3, 1))
    buf0 = empty_strided((3, 3), (3, 1), device='cpu', dtype=torch.float32)
    cpp_fused_add_cos_sin_0(c_void_p(arg0_1.data_ptr()), c_void_p(buf0.data_ptr()))
    del arg0_1
    return (buf0, )
```

With basic idea of how `torch.compile` works, we can now talk about how we can
support transforms. Given that `aot_autograd` is able to trace through the transforms,
we only need to teach `dynamo` to verify if the user function to be transformed
doesn't have side-effects or graph breaks. In that case, we can just put the
`torch.func` transform in the graph and let the lower part of the stack handle the
rest. However, if the function can't be traced successfully due to not satisfying
the above constraints, we just fallback to the eager implementation and this
part of the code is not compiled.

Let us have a look what `dynamo` and `aot_autograd` generates when we compile
program with `vmap`.
Example
```python
# Run this file with `TORCH_COMPILE_DEBUG=1` env flag.

import torch

# function to be vmapped.
def fn(x):
    return torch.sum(x, dim=0)

def wrapper_fn(x):
    return torch.func.vmap(fn)(x)

B = 2
torch.compile(wrapper_fn)(torch.randn(B, 3))

```

`dynamo` output is as follows. The first `GraphModule` is the current program
and it calls `vmap` on the traced representation of user passed function. The
second `GraphModule` corresponds to the user passed function.

```python
class GraphModule(torch.nn.Module):
    def forward(self, L_x_ : torch.Tensor):
        l_x_ = L_x_
        
        # File: torch/_functorch/apis.py:182, code: _check_randomness_arg(randomness)
        _check_randomness_arg = torch._functorch.vmap._check_randomness_arg('error')
        
        # File: torch/_functorch/apis.py:188, code:
        # return vmap_impl(func, in_dims, out_dims, randomness, chunk_size, *args, **kwargs)
        select = l_x_.select(0, 0)  # implementation detail
        vmap_body_0 = self.vmap_body_0
        vmap_proxy = torch.func.vmap(vmap_body_0, (0,), 0, 'error');  vmap_body_0 = None
        call = vmap_proxy.__call__(l_x_);  vmap_proxy = l_x_ = None
        return (call,)
        
class GraphModule(torch.nn.Module):
    def forward(self, select):
        # File: test/test_scratch.py:334, code: return torch.sum(x, dim=0)
        sum_1 = torch.sum(select, dim = 0);  select = None
        return sum_1
            
```

`aot_autograd` is traces through the transformed graph that is the graph generated
after `vmap` has been applied. That is why, the call to `sum` has `dim=1` instead
of `dim=0` as we did in user passed function (because with `vmap`, we have a
leading batch dimension in this case).

```python
def forward(self, arg0_1: f32[2, 3]):
    # File: torch/_functorch/apis.py:188, code:
    # return vmap_impl(func, in_dims, out_dims, randomness, chunk_size, *args, **kwargs)
    sum_1: f32[2] = torch.ops.aten.sum.dim_IntList(arg0_1, [1]);  arg0_1 = None
    return (sum_1,)
```

Currently for PyTorch 2.1, we support compiling `grad` and `vmap` with some
[limitations](https://pytorch.org/docs/main/torch.compiler_faq.html#limitations).
In future, we plan to support all transforms with minimum limitations.

## Closing Remarks
All the work has been made possible with help and guidance from amazing folks at
PyTorch team at Quansight, Mario Lezcano (my team-lead) and Richard Zou and
Horace He (from Meta).
