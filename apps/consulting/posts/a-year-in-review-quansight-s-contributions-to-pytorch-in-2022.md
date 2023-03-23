---
title: 'A Year in Review: Quansight’s Contributions to PyTorch in 2022'
published: March 17, 2023
author: mario-lezcano
description: '2022 was an exciting year for the PyTorch ecosystem. The PyTorch project joining the Linux Foundation was a major milestone, and PyTorch 2.0 was announced with loads of informative talks from the maintainers explaining new features. Additionally, there was marked progress on areas including sparse tensors, JAX-like transformations in PyTorch were released, and TorchVision announced a new Transforms API. In this post, we will review how Quansight has been working hand-in-hand with the PyTorch team at Meta to enhance the PyTorch Project in regards to the above, and beyond.'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/logos/pytorch_logo_large.png
  alt: 'The PyTorch logo, above the "PyTorch" project name in sans serif font. A stylized flame made from a single, thick orange line, with round bottom and single pointed top. There is a gap in the upper right of the line containing a circle with diameter equal to the line thickness.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

**Co-Author:** Andrew James

2022 was an exciting year for the PyTorch ecosystem. The [PyTorch project
joining the Linux Foundation][pytorch joins linux foundation] was a major
milestone, and [PyTorch 2.0 was announced][pytorch 2.0 announcement] with loads
of informative [talks from the maintainers][pytorch 2.0 maintainer talks]
explaining new features. Additionally, there was marked progress on areas
including sparse tensors,
[JAX-like transformations in PyTorch][pytorch jax-like transforms] were
released, and TorchVision announced a
[new Transforms API][torchvision new transforms api].

In this post, we will review how Quansight has been working hand-in-hand with
the PyTorch team at Meta to enhance the PyTorch Project in regards to the above,
and beyond.

## PyTorch 2.0

The biggest PyTorch announcement in 2022 was, without a doubt, the release of
PyTorch 2.0. The main feature this release adds is a more powerful and
user-friendly compiler for PyTorch programs. This compiler is executed via the
function/decorator `torch.compile` and it wraps a PyTorch program or model and
turns it into a compiled version of it. What makes this different from other ML
frameworks, among other things, is that `torch.compile` works with arbitrary
Python programs, even in the presence of data-dependent control flow. This way,
the user gets all the speed from a compiled framework, with the flexibility that
characterizes PyTorch. Even more, for this reason, this release has the
remarkable property of being fully backwards-compatible.

Of course, features of this caliber are composed of a number of subsystems.
Quansight helped in the development of a few of these.

### Decompositions: `PrimTorch`

One of the first steps towards building any compiler that is worth its salt is
to desugar the language in question. In the case of PyTorch, this meant
implementing PyTorch operations in terms of simpler operations. This seems like
a simple task at first sight, until you realize the amount of subtle features
that PyTorch supports like type promotion, broadcasting, `out` kwarg, inplace
and view operations, and more. For more about this, see [this post on Tracing
with Primitives][tracing with primitives post].

Quansight engineers helped design and implement many of these, as well as helped
build the testing infrastructure to make sure they are all correct.

### Compiler: `TorchInductor`

Another big part of a compiler is… well, the compiler itself. The PyTorch 2.0
compiler is called `TorchInductor`, and it takes as input an
[FX graph][pytorch fx graph] and returns a compiled and optimized function that
can be executed from Python. For CPU tensors, it compiles against C++ with
OpenMP and SIMD instructions. On CUDA, it compiles against
[Triton][triton repo].

We were involved in the implementation of a number of optimization passes to
generate faster code.

### Dynamic Shapes

Another feature that PyTorch 2.0 brings to the table is dynamic shapes. Consider
a model to which you want to feed batches of different sizes as, perhaps, your
data comes from a stream of data. You would not want to recompile the model
repeatedly, as a program that is optimized to run on inputs of shape
`[2, 512, 512]` will probably do just fine on inputs of shape `[3, 512, 512]`.

Dynamic shapes allow for tracing a program and also tracing the size of some
dimensions symbolically. For example, we know if inputs to `matmul` have shapes
`[m, k]` and `[k, n]`, the output will have shape `[m, n]`. By tracking these
shapes symbolically, we save on plenty of recompilations on language models and
we are able to export generic models that work for arbitrary lengths and
batches.

We were—and continue to be—involved in fixing some correctness issues
related to dynamic shapes across the PyTorch 2.0 stack.

### NumPy With PyTorch as Its Backend

The PyTorch 2.0 tracer currently just knows how to trace Python programs that
have PyTorch calls in them. But what if you have NumPy calls as well? Even more,
what if you want to compile and run your good old NumPy model with autograd and
CUDA acceleration? In PyTorch 2.X you will be able to do that right out of the
box without having to change one line of code! Just stamp the entry point to
your model with a `@torch.compile` and you’re ready to go.

We are in the process of implementing an interface that translates NumPy to
PyTorch. You could think of it as having PyTorch as a backend for your NumPy
computations without having to change one file in your project!

### SciPy And scikit-learn With PyTorch as Their Backend: Python Array API

In 2021-22, Quansight’s team did <a
href="/post/a-year-in-review-quansight-s-contributions-to-pytorch-in-2021#python-array-api-and-numpy-compatibility"
target="_self">a fair amount of work</a> to implement the [Python Array
API][array api 2022.12] within PyTorch. For 2023, we are taking this one step
further.

In parallel, a number of PyData maintainers within Quansight have started
migrating parts of their codebase to use the Python Array API. These two
together will allow users to run their programs that use NumPy, SciPy, or
scikit-learn with PyTorch as their backend. In particular, you could create a
compiled CUDA version of your favorite scikit-learn algorithms and even
differentiate through them! What a time to be alive.

### Additional Compiler Backends

It should be clear by now that the main feature of PyTorch 2.0 is its compiler.
The compiler itself is built to be flexible and support multiple backends.
Options are limited at launch, but we have been working to deliver alternatives.

There is ongoing work towards delivering a transpiler that translates a PyTorch
program written in Python into a PyTorch program written in C++. This means that
you can get all the performance improvements of writing your model using
[PyTorch’s C++ API][pytorch c++ api], without having to write one line of C++!
Further down the road, this will be integrated within TorchInductor, and we will
intermix Triton kernels with hand-written CUDA fallbacks for those operations
that are not supported by the compiler yet. This compiler backend will allow for
compiled functions to stay fully in C++ without ever having to come back to
sluggish Python-land.

## Scientific PyTorch

PyTorch is designed and primarily targeted at deep learning applications, but
scientific communities are also part of the vast user base. The wealth of
numerical tools, autograd, and interfaces to powerful computing hardware
backends such as CUDA make it an attractive choice for those working in these
domains.

Our team is comprised of SciPy community veterans, and we have a wealth of
expertise in various scientific domains. Quansight has been instrumental in
expanding PyTorch to cover functionality from popular SciPy modules (in some
cases going beyond SciPy) and we have continued to do so in 2022.

### Sparse Tensors

The `torch.sparse` team has focused on enabling key workflows and developing a
path toward stability. We have expanded support for data types and layouts in
sparse-sparse and sparse-dense matrix multiplication, which has enabled PyTorch
Linear layers to carry sparse weights. Specialized kernels have been added using
[Triton][triton open.ai site] to support half-precision data types while
continuing to utilize the newest features from NVIDIA’s cuSPARSE as they become
available. While matrix multiplication represents the area where sparsity offers
the largest potential performance gains, performance improvements have also been
realized for point-wise multiplications, layout validations, and masking
operations. Autograd integration has been steadily improving with more and more
operators supporting sparse layouts on the backward path.

The next year is set to be an exciting one for sparsity in PyTorch. Experiments
with new backends are showing promising performance in the realm of sparsity
realistic for deep learning, with tensors that are 50-80% zero, where
performance gains have only been seen previously when tensors are 90% zero or
more. Integration with `torch.compile` is also high on the list of priorities as
that technology stack offers a route to solving problems like determining the
best layouts for outputs in a sequence of operations. First, we need to get
sparse to the “stable feature” designation.

### JAX-like Function Transforms: `torch.func`

One of PyTorch’s big releases this year was that of `torch.func` (prev.
`functorch`) being [merged into core][pytorch 2.0 docs: func]. This module
provides higher order functions that allow you to vectorize your computation by
calling `vmap`, to compute forward and backward vector products via `jvp` and
`vjp`, or to compute per-sample gradients, as popularized by JAX.

In order for this to become a thing, PyTorch maintainers needed to implement
these operations for each and every one of the operators that PyTorch has. That
is well over 2,600 operators. To make this task bearable, Quansight engineers
helped implement many of the PyTorch operators in a composite way. A composite
operator then inherits the implementation of `vmap`, `vjp` and all these from
the operators that compose it. This is a similar idea to the PrimTorch approach
we discussed above. Quansight engineers also helped implement many other
features now available in this shiny new PyTorch module.

### Complex Half: `torch.complex32`

Once you have complex numbers, <a
href="/post/a-year-in-review-quansight-s-contributions-to-pytorch-in-2021#complex-numbers"
target="_self">as we helped deliver in 2021</a>, and accelerators, the next
thing you want is complex numbers in half precision. The issue, as always, is
that PyTorch has **thousands** of operations. Each of them implemented in CPU
and CUDA. And, for each device, implemented for each datatype. And each of those
contributes to the size of the executable. And each of those needs to be
compiled every time you compile PyTorch. And each of those takes a little bit of
time to load whenever you run `import torch`. And at some point you start
wondering whether it is worthwhile to deliver half-precision complex numbers.

To solve this issue, Meta engineers put together a JIT compiler—yes, another
compiler, different from the two we discussed above—that allows compiling
`torch.complex32` versions of operators just as they are used for the first time
in the program. This allows us to get fast compilation times, and smaller
binaries at the cost of a tiny perf hit the first time we execute a function.
Quansight engineers then helped expand the `torch.complex32` coverage throughout
PyTorch.

### `torch.signal.windows`

With the help of the OSS community, Quansight engineers have helped design and
implement SciPy’s `signal.windows` module in PyTorch. This module is of
particular interest for digital signal processing, and it couples particularly
well with the previous work of Quansight engineers in bringing
[complex numbers][pytorch 2.0 docs: complex numbers] and
[FFTs][pytorch blog: fft] to PyTorch.

### Performance Optimizations

One of the areas of specialization of Quansight engineers is code optimization.
A faster PyTorch means less money spent on cloud services, less energy spent in
the world, and less time waiting for your model to finish training. Win, win,
win!

A few highlights from 2022 are:

- `torch.matmul`: [2x speedup on the 2D x 3D case][pytorch gh: 2x speedup 2d-3d]

- `torch.matmul`:
  [prevent OOMs in the backward][pytorch gh: no ooms in backward], reducing its
  memory footprint

- Unary operators:
  [29x speedup on discontiguous CPU tensors][pytorch gh: discontiguous cpu tensors]

- Type conversions: [2x speedup on CPU][pytorch gh: type conversions]

- `torch.flip`: 1.5-10x speedups on CPU for any
  [dtype][pytorch gh: torch.flip dtype] and
  [contiguity][pytorch gh: torch.flip contiguity].
  [Really][pytorch gh: torch.flip really]. [Any][pytorch gh: torch.flip any].

- `torch.norm`:
  [100x speedup on double inputs on CPU][pytorch gh: torch.norm double]. [2x
  speedup on complex inputs][pytorch gh: torch.norm complex].
  [2x on][pytorch gh: torch.norm ord-fro] `ord='fro'`

- `torch.sort(dim)`: [1.5x speedup on CUDA][pytorch gh: torch.sort(dim)] for
  `dim <= 128`

## Maintainability

It is great to talk about the flashy new features and performance improvements
we have worked on, but every project needs to be maintained at a level that most
users will never see. When the project is as large and complex as PyTorch, this
work is even more important, but often harder to see. Quansight engineers are
constantly at work refactoring sub-systems to reduce technical debt and making
improvements to PyTorch that allow the entire project to continue marching
forward.

### Build Time Improvements

In a project the size of PyTorch, keeping build times reasonable is paramount.
<a
href="/post/a-year-in-review-quansight-s-contributions-to-pytorch-in-2021#build-time-improvements"
target="_self">Last year</a>, Quansight engineers helped reduce the average
fresh build time from 20 minutes to five minutes. This year, we continued
working on recompilations. A huge number of compilation sources are generated at
build time from specification files, such as all of the C++ to Python bindings,
which are found in a single file. The generation system does not have a notion
of what has changed, and what has not, between compilations so all of the
generated sources are re-generated, and subsequently recompiled, any time that
single file is edited in any way—even if the edit is a comment.

Our work entailed making recompilation more granular. If one signature is
modified, you will just need to recompile the relevant files.

### Typeless Storage

In 2021, the classes managing the memory where tensor data is stored, called
“storage,” were modified such that all data was stored as raw bytes without a
data type. This change made tensor storage more flexible and easier to maintain.
The change was not duplicated to the Python interface for these classes to
maintain backward compatibility. In 2022, we continued this work to begin the
deprecation cycle and re-unify the two interfaces under the type-free storage
system. This delicate task required diligent work to maintain the correctness of
lower-level functionality such as serialization, but our team was equal to the
task and typed storage is officially deprecated, and will be completely removed
in PyTorch 2.1!

### Maintenance of `torch.linalg` and `torch.fft`

In 2021, a number of Quansight and Meta engineers designed and implemented the
`linalg` and `fft` modules based on their NumPy and SciPy counterparts. One year
later, these modules are now completely stable, but we still provide guidance to
users that find [the sharper corners][pytorch 2.0 docs: accuracy] of the
mathematically-involved functions in them.

### Testing

Another front where Quansight spent a reasonable amount of time in 2022 was
helping to set up a scalable and reliable testing infrastructure in the PyTorch
project. At this time, the main structure and the tests are rather stable and
provide a reliable way to test new features that are added to the library. Now,
as any system that sets itself to tackle such a humongous task, it needs
maintaining to stop it from growing out of control.

In 2022, Quansight engineers helped refactor the new testing infrastructure to
keep parts of it more manageable and implemented a number of quality of life
improvements for it, which helped find and fix a number of bugs it had.

## TorchVision

PyTorch core provides critical functionality that is generally applicable to
learning workflows, but it is not intended to cover all applications on its own.
Domain specific extension libraries like TorchVision fill the gaps with
specialized tools for a particular problem space. Not to be outshined by the
PyTorch 2.0 release, we have worked to deliver some exciting new features in
TorchVision as well.

### Transforms API 2.0

One of the most tiring parts of doing real-world Machine Learning is data
pre-processing. TorchVision offers a set of functions to help you in this task
when you want to classify images. The issue is that image classification is
so 2016. Modern Deep Learning deals with segmentation tasks with masks, object
detection with bounding boxes, videos and more. This means that when you rotate
an image, you may also need to rotate the annotations, cropping and all other
transformations in general.

Quansight engineers designed and developed a more flexible API for these
transforms that allows you to have more heterogeneous data and annotations, to
go with modern vision tasks. This new API is not only backwards compatible, but
actually faster than the previous one and will be released in a beta state with
TorchVision 0.15. You can read more about it in this very nice blog post,
[Extending TorchVision’s Transforms to Object Detection, Segmentation & Video tasks][pytorch blog: torchvision transforms].

### Video Codecs Support

As discussed above, image preprocessing is annoying. Now, this is difficult to
deal with when images are static. But when they move… that’s a whole different
level.

One particular pain point when dealing with videos is [the different formats
they come in][xkcd standards]. We have been working on putting together a robust
video reader that deals with these different codecs and prepares the data to be
able to be processed by a neural network.

## Closing Remarks

Yearly reviews are great! They help you see how much you moved forward in the
last twelve months in one go. We also can’t hope to cover everything our team of
20 engineers have done in over 18,000 hours of work in 2022. These highlights
show it was a truly impressive group effort together with Meta! Whether you are
looking to get started or are already using PyTorch, Quansight has the experts
to help you.

All this would not have been possible without the contributions from our
fantastic team of PyTorch and TorchVision contributors: Peter Bell, Mario
Lezcano, Andrew James, Nikita Vedeneev, Pearu Peterson, Kshiteej Kalambarkar,
Philip Meier, Victor Fomin, Yukio Siraichi, Kurt Mohler, Evgeni Burovski, Aaron
Meuer, Matthew Barber, Fabio Rocha, Aleksandar Samardžić, Bruno Korbar, Nikita
Karetnikov, Sean Ross-Ross, Ralf Gommers, and Matti Picus.

The other part of the story comes from the great team of PyTorch and TorchVision
engineers at Meta. Without their dedication and openness to collaboration this
work would not be possible. In particular, we would like to thank Alban
Desmaison, Natalia Gimelschein, Edward Yang, Anjali Chourdia, Christian Pursch,
Jane Xu, Joel Schlosser, Nikita Shulga, Richard Zou, Brian Hirsh, Horace He,
Jason Ansel, Joe Isaacson, and Soumith Chintala (PyTorch) and Vasilis Vryniotis,
Prabhat Roy, and Nicolas Hug (TorchVision). Thank you all for making this
collaboration so fruitful and enjoyable.

[array api 2022.12]: https://data-apis.org/array-api/2022.12/
[pytorch 2.0 announcement]: https://pytorch.org/blog/getting-started-with-pytorch-2.0/
[pytorch 2.0 docs: complex numbers]: https://pytorch.org/docs/stable/complex_numbers.html
[pytorch 2.0 docs: func]: https://pytorch.org/docs/2.0/func.html
[pytorch 2.0 docs: accuracy]: https://pytorch.org/docs/2.0/notes/numerical_accuracy.html#linear-algebra-torch-linalg
[pytorch 2.0 maintainer talks]: https://pytorch.org/get-started/pytorch-2.0/#ask-the-engineers-20-live-qa-series
[pytorch blog: fft]: https://pytorch.org/blog/the-torch.fft-module-accelerated-fast-fourier-transforms-with-autograd-in-pyTorch/
[pytorch blog: torchvision transforms]: https://pytorch.org/blog/extending-torchvisions-transforms-to-object-detection-segmentation-and-video-tasks/
[pytorch c++ api]: https://pytorch.org/cppdocs/
[pytorch fx graph]: https://pytorch.org/docs/stable/fx.html
[pytorch gh: 2x speedup 2d-3d]: https://github.com/pytorch/pytorch/pull/76828
[pytorch gh: discontiguous cpu tensors]: https://github.com/pytorch/pytorch/pull/91963
[pytorch gh: no ooms in backward]: https://github.com/pytorch/pytorch/pull/95261
[pytorch gh: torch.flip any]: https://github.com/pytorch/pytorch/pull/88989
[pytorch gh: torch.flip contiguity]: https://github.com/pytorch/pytorch/pull/91806
[pytorch gh: torch.flip dtype]: https://github.com/pytorch/pytorch/pull/90013
[pytorch gh: torch.flip really]: https://github.com/pytorch/pytorch/pull/89414
[pytorch gh: torch.norm complex]: https://github.com/pytorch/pytorch/pull/81761
[pytorch gh: torch.norm double]: https://github.com/pytorch/pytorch/pull/91502
[pytorch gh: torch.norm ord-fro]: https://github.com/pytorch/pytorch/pull/81761
[pytorch gh: torch.sort(dim)]: https://github.com/pytorch/pytorch/pull/79627
[pytorch gh: type conversions]: https://github.com/pytorch/pytorch/pull/80905
[pytorch jax-like transforms]: https://pytorch.org/docs/2.0/func.html
[pytorch joins linux foundation]: https://pytorch.org/blog/PyTorchfoundation/
[torchvision new transforms api]: https://pytorch.org/blog/extending-torchvisions-transforms-to-object-detection-segmentation-and-video-tasks/
[tracing with primitives post]: https://dev-discuss.pytorch.org/t/tracing-with-primitives-update-0/577
[triton open.ai site]: https://openai.com/research/triton
[triton repo]: https://github.com/openai/triton
[xkcd standards]: https://xkcd.com/927/
