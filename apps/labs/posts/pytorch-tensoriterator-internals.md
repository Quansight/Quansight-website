---
title: 'PyTorch TensorIterator Internals'
published: April 13, 2020
author: sameer-deshmukh
description: 'This post is a deep dive into how TensorIterator works, and is an essential part of learning to contribute to the PyTorch codebase since iterations over tensors in the C++ codebase are extremely commonplace. This post is aimed at someone who wants to contribute to PyTorch'
category: [Machine Learning]
featuredImage:
  src: posts/pytorch-tensoriterator-internals/feature.png
  alt: 'Code snippet on creating a TensorIterator using a default constructor.'
hero:
  imageSrc: posts/pytorch-tensoriterator-internals/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

The history section of this post is still relevant, but `TensorIterator`'s
interface has changed significantly. For an update on the new API, please check
out [this new blog
post](https://labs.quansight.org/blog/2021/04/pytorch-tensoriterator-internals-update).

PyTorch is one of the leading frameworks for deep learning. Its core data
structure is `Tensor`, a multi-dimensional array implementation with many
advanced features like auto-differentiation. PyTorch is a massive
codebase (approx. [a million lines](https://www.openhub.net/p/pytorch) of
C++, Python and CUDA code), and having a method for iterating over tensors in a
very efficient manner that is independent of data type, dimension, striding and
hardware is a critical feature that can lead to a very massive simplification
of the codebase and make distributed development much faster and smoother. The
[`TensorIterator`](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/TensorIterator.cpp)
C++ class within PyTorch is a complex yet useful class that is used for
iterating over the elements of a tensor over any dimension and implicitly
parallelizing various operations in a device independent manner.

It does this through a C++ API that is independent of type and device of the
tensor, freeing the programmer of having to worry about the datatype or device
when writing iteration logic for PyTorch tensors. For those coming from the
NumPy universe, `NpyIter` is a close cousin of `TensorIterator`.

This post is a deep dive into how `TensorIterator` works, and is an essential
part of learning to contribute to the PyTorch codebase since iterations over
tensors in the C++ codebase are extremely commonplace. This post is aimed at
someone who wants to contribute to PyTorch, and you should at least be familiar
with some of the basic terminologies of the PyTorch codebase that can be found
in Edward Yang's excellent [blog post](http://blog.ezyang.com/2019/05/pytorch-internals)
on PyTorch internals.  Although `TensorIterator` can be used for both CPUs and
accelerators, this post has been written keeping in mind usage on the CPU.
Although there can be some dissimilarities between the two, the overall
concepts are the same.

# History of TensorIterator

## TH iterators

TensorIterator was devised to simplify the implementation of PyTorch's tensor
operations over the `TH` implementation. `TH` uses preprocessor macros to write
type-independent loops over tensors, instead of C++ templates. For example,
consider this simple `TH` loop for computing the product of all the numbers in
a particular dimension (find the code
[here](https://github.com/pytorch/pytorch/blob/master/aten/src/TH/generic/THTensorMoreMath.cpp#L350)):

``` C
TH_TENSOR_DIM_APPLY2(scalar_t, t, scalar_t, r_, dimension,
    accreal prod = 1;
    int64_t i;
    for(i = 0; i < t_size; i++)
        prod *= t_data[i*t_stride];
    *r__data = (scalar_t)prod;
);
```

The above loop works by following a particular convention for the naming of the
types and variables. You specify the input type and output type of your tensors in the first
and third arguments. `scalar_t` is a type that can generically be used for denoting a PyTorch
scalar type such as `float`, `double`, `long` etc. Internally, PyTorch uses the `scalar_t`
for compiling the file multiple times for different definitions of `scalar_t` (as in for different
data types like `float`, `int`, etc.). The input tensor and output tensors are
specified in the second and fourth arguments (in this case `t` and `r_`), and the dimension that
we want to iterate over is specified as the fifth argument (`dimension`).

We then follow these arguments with the main body of the iterator (which is accepted as the sixth
argument into the macro), and denote the data, stride and size of the particular tensor dimension
by using variables that are suffixed by `_data`, `_stride` and `_size` respectively after the
variable name that represents the tensor inside the iterator body. For example, the size of the
input tensor is denoted as `t_size` in the above example and the pointer to the data of the output
tensor is denoted as `r__data`. The `accreal` in the second line is custom type that specifies
a real number that is an accumulator (in this case for accumulating the product).

Internally, the `TH_TENSOR_DIM_APPLY2` macro is expanded for generating various dispatch calls
depending on the type of the tensor that needs to be iterated over. The implementation of
`TH_TENSOR_DIM_APPLY2` can be found [here](https://github.com/pytorch/pytorch/blob/master/aten/src/TH/THTensorDimApply.h#L138).

## Limitations of TH iterators

Apart from the obvious complication that arises due to maintaining a codebase that is so dependent
on such insanely complex macro expansions, TH iterators have some fundamental shortcomings. For
one thing, they cannot be used for writing iterators in a device independent manner - you will
need separate iterators for CPU and CUDA. Also, parallelization does not happen implicitly
inside the iterator, you need to write the parallel looping logic yourself. Moreover, at a deeper
level `TH` iterators do not collapse the dimensions of the tensor (as we'll see later in this
post) therefore leading to looping that might not be as cache-optimized as possible.

These limitations led to the creation of `TensorIterator`, which is used by the
`ATen` tensor implementation for overcoming some of the shortcomings of the previous `TH`
iterators.

# Basics of TensorIterator

A `TensorIterator` can be created using the default constructor. You must then add the tensors
that you want as inputs or outputs. A good example can be found from the `TensorIterator::binary_op()`
[method](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/TensorIterator.cpp#L652) that
allows you to create `TensorIterator` objects for performing point-wise binary operations
between two tensors. The important parts look like so:

``` cpp
auto iter = TensorIterator();

iter.add_output(out);
iter.add_input(a);
iter.add_input(b);

iter.build();
```
As you can see, you add a tensor called `out` as the output tensors and `a` and `b` as the
input tensors. Calling `build` is then mandatory for creating the object and letting
the class perform other optimizations like collapsing dimensions.

# Performing iterations

Broadly, iterations using `TensorIterator` can be classified as point-wise iterations
or reduction iterations. This plays a fundamental role in how iterations using `TensorIterator`
are parallelized - point-wise iterations can be freely parallelized along any dimension
and grain size while reduction operations have to be either parallelized along dimensions
that you're not iterating over or by performing bisect and reduce operations along the
dimension being iterated. Parallelization can also happen using vectorized operations.

## Iteration details

The simplest iteration operation can be performed using the
[`for_each`](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/TensorIterator.cpp#L525)
function. This function has two overloads: one takes a function object which iterates over a
single dimension (`loop_t`); the other takes a function object which iterates over two
dimensions simultaneously (`loop2d_t`). Find their definitions [here](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/TensorIterator.h#L166). The former can iterate over a loop
of a single dimension whereas the latter can do so over two dimensions. The simplest
way of using `for_each` is to pass it a lambda of type `loop_t` (or `loop2d_t`).
A code snippet using it this way would look like so:

``` cpp
auto iter = TensorIterator();
iter.add_output(out);
iter.add_input(a);
iter.dont_resize_outputs(); // call if out is allocated.
iter.dont_compute_common_dtype(); // call if inputs/outputs are of a different type.
iter.build();

auto loop = [&](char **data, const int64_t* strides, int64_t n) {
    auto * out_data_bytes = data[0];
    auto * in_data_bytes = data[1];

    // assume float data type for this example.
    for (int i = 0; i < n; i++) {
      *reinterpret_cast<float*>(out_data_bytes) +=
        *reinterpret_cast<float*>(in_data_bytes);

      out_data_bytes += strides[0];
      in_data_bytes += strides[1];
    }
}

iter.for_each(loop);
```
In the above example, the `char** data` gives a pointer to the data within the
tensor in the same order that you specify when you build the iterator. Note
that in order to make the implementation agnostic of any particular data type, you
will always receive the pointer typecast to `char` (think of it as a bunch of bytes).

The second argument is `int64_t* strides` which is an array containing the strides of
each tensor in the dimension that you're iterating over. We can add this stride to the
pointer received in order to reach the next element in the tensor. The last argument is
`int64_t n` which is the size of the dimension being iterated over.

`for_each` implicitly parallelizes the operation by executing `loop` in parallel
if the number of iterations is more than the value of `internal::GRAIN_SIZE`, which is a value
that is determined as the 'right amount' of data to iterate over in order to gain a significant
speedup using multi-threaded execution. If you want to explicitly specify that your
operation _must_ run in serial, then use the `serial_for_each` loop.

### Using kernels for iterations

Frequently we want to create a kernel that applies a simple point-wise function onto entire tensors.
`TensorIterator`
provides various such generic kernels that can be used for iterating over the elements
of a tensor without having to worry about the stride, data type of the operands or details
of the parallelism.

For example, say we want to build a function that performs the point-wise addition
of two tensors and stores the result in a third tensor, we can use the `cpu_kernel`
function. Note that in this example we assume a tensor of `float` but you can
use the `AT_DISPATCH_ALL_TYPES_AND2` macro.
``` cpp
TensorIterator iter;
iter.add_input(a_tensor);
iter.add_input(b_tensor);
iter.add_output(c_tensor);
iter.build();
cpu_kernel(iter, [] (float a, float b) -> float {
  return a + b;
});
```
Writing the kernel in this way ensures that the value returned by the lambda passed to
`cpu_kernel` will populate the corresponding place in the target output tensor.

### Setting tensor iteration dimensions

The value of the sizes and strides will determine which dimension of the tensor you will iterate over.
`TensorIterator` performs optimizations to make sure that at least
most of the iterations happen on contiguos data to take advantage of hierarchical cache-based
memory architectures (think dimension coalescing and reordering for maximum data locality).

Now a multi-dimensional tensor will have multiple stride values depending on the dimension
you want to iterate over, so `TensorIterator` will directly compute the strides that
get passed into the loop by
by itself within the `build()` function. How exactly it computes the dimension
to iterate over is something that should be properly understood in order to use `TensorIterator`
effectively.

If you're performing a reduction operation (see the sum code in [ReduceOps.cpp](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/ReduceOps.cpp#L384)),
`TensorIterator` will figure out the dimensions that will be reduced depending
on the shape of the input and output tensor, which determines how the input will be broadcast
over the output. If you're
performing a simple pointwise operation between two tensors (like a `addcmul` from
[PointwiseOps.cpp](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/PointwiseOps.cpp#L31))
the iteration will happen over the entire tensor, without providing a choice of the dimension.
This will allow TensorIterator to freely parallelize the computation, without guarantees of
the order of execution (since it does not matter anyway).

For something like a cumulative sum operation, where you want be able to choose the dimension
to reduce but iterate over multiple non-reduced dimensions (possibly in parallel), you
must first re-stride the tensors, and then use these tensors
for creating a `TensorIterator`. In order to understand how this bit works, lets go over
the code for the [kernel](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/cpu/ReduceOpsKernel.cpp#L21) that executes the [cumsum](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/cpu/ReduceOpsKernel.cpp#L71) function.

The important bits of this function are like so:

``` cpp
auto self_sizes = ensure_nonempty_vec(self.sizes().vec());
self_sizes[dim] = 1;

auto result_restrided = restride_dim(result, dim, self_sizes);
auto self_restrided = restride_dim(self, dim, self_sizes);

auto iter = TensorIterator();
iter.dont_compute_common_dtype();
iter.dont_resize_outputs();
iter.add_output(result_restrided);
iter.add_input(self_restrided);
iter.build();
```
You can see that we first change the size of the tensors to `1` on the
reduction dimension so that the dimension collapsing logic inside
`TensorIterator#build` will know which dimension to skip.
Setting the dimension in this way is akin to telling `TensorIterator`
to skip the dimension. We then restride the tensors using `restride_dim` and
then use the restrided tensors for building the `TensorIterator`. You can
set any size for inputs/outputs, then `TensorIterator` with check whether it
can come up with a common broadcasted size

# Conclusion

This post was a very short introduction to what `TensorIterator` is actually
capable of. If you want to learn more about how it works and what goes into
things like collapsing the tensor size for optimizing memory access, a good
place to start would be the `build()` function in
[TensorIterator.cpp](https://github.com/pytorch/pytorch/blob/master/aten/src/ATen/native/TensorIterator.cpp#L1030).
Also have a look at [this wiki page](https://github.com/pytorch/pytorch/wiki/How-to-use-TensorIterator)
from the PyTorch team on using `TensorIterator.`
