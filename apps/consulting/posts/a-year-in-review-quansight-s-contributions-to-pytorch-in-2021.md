---
title: 'A Year in Review: Quansight’s Contributions to PyTorch in 2021'
published: April 13, 2022
author: ralf
description: 'PyTorch is a very popular open source deep learning framework, primarily developed by Meta AI. If you are making deep learning models, chances are you are using PyTorch. Not only is Quansight a major contributor to the development of PyTorch, but we also use it in applied data science consulting projects as our go-to framework for building deep learning models.  '
category: [Artificial Intelligence]
featuredImage:
  src: /posts/a-year-in-review-quansight-s-contributions-to-pytorch-in-2021/pytorch_logo_large.png
  alt: 'The PyTorch logo, above the "PyTorch" project name in sans serif font. A stylized flame made from a single, thick orange line, with round bottom and single pointed top. There is a gap in the upper right of the line containing a circle with diameter equal to the line thickness.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

This post was co-written between Mario Lezcano & Ralf Gommers.

&nbsp;

PyTorch is a very popular open source deep learning framework, primarily
developed by Meta AI. If you are making deep learning models, chances are you
are using PyTorch. Not only is Quansight a major contributor to the development
of PyTorch, but we also use it in applied data science consulting projects as
our go-to framework for building deep learning models.

PyTorch draws on many of the battle-tested concepts introduced by NumPy, and
adds new features used in modern deep learning such as GPU and TPU acceleration;
forward, backward, and higher-order automatic differentiation; automatic
mixed-precision; distributed training; CNNs; building blocks for neural
networks, and more.

We have been involved in the development of PyTorch for the last three years,
bringing in our 10+ years of experience in open source software (OSS) work in
the PyData world.

PyTorch is a particularly large library, with more than 2 million lines of code
(LOC), mostly C++ with Python bindings on top. To put the size of the project in
perspective, this is 10 times the LOC in NumPy. It is also a very fast-paced
project, with 800+ active contributors totaling over 20k commits just in the
last year.

## Quansight Contributions

We have a team of 15+ engineers involved in the various aspects of PyTorch
development. We distinguish the following as our main topic areas:

- [Python Array API and NumPy Compatibility][h2-array-api-numpy]
- [Scientific PyTorch][h2-scientific-pytorch]
- [Maintainability][h2-maintainability]
- [Torchvision][h2-torchvision]
- [Research Topics][h2-research-topics]

## Python Array API and NumPy Compatibility

In 2010, if a user needed to perform some numerical computations using
multidimensional data, they would import [NumPy][numpy homepage] or its
extension [SciPy][scipy homepage], store their data in an array, and start
taking advantage of the speed of the operations implemented in C from the
comfort of the Python language. Nowadays, the landscape is rather different. We
have libraries with autograd, GPU, and TPU support oriented towards deep
learning. This includes [PyTorch][pytorch homepage],
[Tensorflow][tensorflow homepage], [JAX][jax docs], or [MXNet][mxnet homepage],
libraries that provide a [CUDA][cuda @ wik] extension for NumPy-like code, such
as [CuPy][cupy homepage] or cluster-level parallelism, like
[Dask][dask homepage].

At the same time, not only are these libraries used by millions, but they also
serve as the basic building blocks for the lion's share of tools in the PyData
world. Most libraries for data science in Python, such as
[pandas][pandas homepage], [scikit-learn][scikit-learn homepage], or
[Matplotlib][matplotlib homepage] use and consume arrays, and build on top of
them to implement higher-level functionality.

The [Python Array API standard][array api docs] aims to serve as a bridge
between these two realities. It is a standard that aims to provide a common API.
Then, if libraries write their code in terms of this API, their code becomes
library-agnostic. This means that the user could choose the backend library that
is used to manage the arrays internally depending on their use case. For this to
be possible, the Python Array API is largely based on (a curated subset of)
NumPy’s API, which is the gold standard that most other libraries follow.

From a user perspective, if they have a large codebase written in NumPy they
want to migrate to another library, and the other library implements the Python
Array API, doing so should be as easy as changing the imports.

PyTorch decided to implement the Python Array API in May 2021. As of version
1.12, PyTorch implements >90% of its functionality. Quansight has been
instrumental in the process in both directions: by extending the functionality
that PyTorch provides to cover that specified in the API, and by improving and
fine-tuning the API standard itself based on the knowledge acquired during years
of developing PyTorch core alongside NumPy and SciPy.

## Scientific PyTorch

Scientific computing was the branch of knowledge that first inspired data
analysis. PyTorch, although a deep learning library at heart, is also widely
used in the scientific community, where there is a growing trend of boosting
classical numerical methods and algorithms with the parallelism of GPUs and the
information given by autograd.

Quansight has a number of global experts in this area coming from the SciPy
community, or more generally, the PyData community. As such, many of the
contributions of Quansight within PyTorch have been in this realm. Mostly driven
by Quansight efforts, PyTorch 1.12 includes a number of popular modules from
SciPy, together with CUDA and autograd support.

### Linear Algebra: torch.linalg

[PyTorch 1.9][pytorch blog linalg.autograd] included a
[_linalg_ module][pytorch docs linalg] that implemented all the functionality
from _numpy.linalg_ in a NumPy-compatible way, together with CUDA acceleration
and autograd support. Since its release, this module has been expanded to also
include a number of popular functions from _scipy.linalg_ and more. This module
was created and is actively maintained by a group of Quansight engineers.

### Forward and Backward AD

[Automatic differentiation (AD)][automatic diff @ wik] is arguably the main
feature that deep learning frameworks bring to the table over traditional array
libraries. Quansight is actively involved in the support and implementation of
correct and efficient derivatives. In particular, it has helped in implementing
many of the forward AD formulas to make possible the release of the [support for
forward AD mode in PyTorch 1.11][pytorch tutorial fwd auto diff].

### Complex Numbers

PyTorch 1.10 came out with
[complex numbers support][pytorch docs complex numbers], and optimization over
complex tensors. This feature was requested [since the beginning of PyTorch][pytorch gh complex numbers issue], and
has deep applications in fields ranging from signal processing to quantum
mechanics. Quansight helped generalize the formulas for many functions and their
derivatives to the complex case. The foundations of how to do so are not
well-understood by the community, so a number of people from Quansight are
currently working on publishing a paper formalizing the ideas and semantics that
drive PyTorch’s design from a theoretical point of view.

### Mathematical Functions: torch.special

PyTorch 1.9 introduced the [_torch.special_ module][pytorch docs special],
modeled after the _scipy.special_ module. This module contains special functions
used in mathematics such as the Riemann zeta function or the gamma function.
These functions are paramount in fields like physics, mathematics, and
statistics, but they also appear when modeling complex systems in biology and
mechanics. This module expands on SciPy’s by adding GPU and autograd support to
its functions. This module was implemented and is currently maintained by
engineers at Quansight.

### Fast Fourier Transforms: torch.fft

PyTorch 1.8 introduced the [_torch.fft_ module][pytorch docs fft] implementing
fast Fourier transforms fully compatible with _numpy.fft_. All functions support
CPU or GPU acceleration and complex autograd. There are plans to expand this
module with discrete sine and cosine transform algorithms, compatible with
_scipy.fft_. This module is written and maintained by Quansight engineers.

### Interpolation

Up/down sampling algorithms are at the core of many algorithms in the field of
computer vision. They are used both for preprocessing the data, but also as
components to assess the quality of a given model.
[A paper published in 2021][interpolation scaling paper] showed that most major
deep learning libraries suffered from poor scaling issues in their interpolation
algorithms, giving vastly incorrect results. All these issues have been
addressed and corrected by Quansight engineers, implementing new stable and
efficient algorithms and their derivatives on CPU and GPU in PyTorch 1.11.

## Maintainability

Given the speed of development of PyTorch, with 100+ people working full-time on
the project, usual software engineering practices like testing, integration,
benchmarking, and documentation are fundamental to providing a seamless user
experience. The main challenge here is that textbook solutions often do not
scale to projects of the size and complexity of PyTorch. By leveraging years of
experience developing and maintaining many other large OSS projects, Quansight
has been able to help in the sustainable growth of PyTorch.

### Automated Testing

In 2021, PyTorch started to find a way to reduce and standardize its 100K+ lines
of tests into what’s referred to as _OpInfos_ and _ModuleInfos_. Given the
number of subsystems within PyTorch (forward AD, backward AD, strided tensors,
different JIT backends…) and its extensive API (2,000+ functions), it was not
sustainable to manually write tests for each function against all subsystems.
The solution was to create objects that encapsulate each PyTorch function
together with its characteristics and a way to generate valid inputs for that
function. Then, a test for a subsystem would process these objects and know
whether it makes sense to test that function against the subsystem, and if so,
how. Quansight engineers have been involved in the implementation of generic
tests and in adding support for more and more operations to increase the test
coverage. While doing this, the engineers at Quansight have also been involved
in fixing bugs that were found in the process.

### Testing utilities: torch.testing

Internally, PyTorch developed elaborate utilities needed for testing, e.g.
creating random tensors for a given specification and comparing the results of
tensor operations. With the ever-growing ecosystem, the demand for having these
utilities publicly accessible also grew. Starting in 2021, Quansight engineers
started to flesh out and implement a system that is able to handle the complex
internal needs of the PyTorch project while providing downstream libraries the
tools they need. Soon after its inception, _torch.testing_ has seen adoption by
other projects. In early 2022, not even a year after the beginning of the
project, the module reached a stable state.

### Structured Kernels

Even though the API surface of PyTorch is remarkably large, there are a few
properties that most, if not all, functions within PyTorch share. A PyTorch
function is fed one or more tensors and perhaps more arguments, and returns some
new tensors. This simple remark allows us to factorize any PyTorch operation by
first creating the output tensors given the input tensors, and then computing
the values of the operation and filling the output tensors. This factorization
allows us to, for example, skip the actual computation, figuring out the size
and other properties of all the inner tensors of a neural network without really
running the model. Quansight engineers have been involved in the design and
implementation of parts of this mechanism, and are actively involved in the
migration of PyTorch functions to this more flexible model.

### Build Time Improvements

Editing any PyTorch operator often required rebuilding thousands of C++ and CUDA
files and was highly disruptive to the development cycle. Quansight engineers
have profiled and eliminated bottlenecks in PyTorch’s parallel builds, as well
as fixed structural issues in PyTorch’s core C++ codebase, that led to thousands
of files being rebuilt unnecessarily. Typical build times when switching
branches went from 20 minutes to 5 or fewer minutes.

### Docs and Docs Infrastructure

From a usability perspective, a library is as good as its documentation.
Quansight engineers have been and currently are involved in rewriting major
sections of the documentation of PyTorch. We have also been involved in updating
and maintaining the infrastructure that runs and hosts the documentation pages
within PyTorch, improving the formatting of the docs and the overall user
experience.

### Type Annotations

Type annotations for PyTorch were an oft-requested feature by users. They help
with catching errors and with code completion in IDEs. Two Quansight engineers
improved type annotation support significantly by adding a testing framework,
running Mypy in CI, moving existing type annotations in stubs inline, and fixing
a large number of issues. By April 2021, type annotation support in PyTorch was
declared complete.

### Port Legacy Code From C to C++

PyTorch originally started as a Python port of the Lua library, Torch, which
itself was a C library with Lua bindings. From its start, PyTorch decided to
rewrite its backend completely in terms of two in-house C++ libraries. The
process of migrating the macro-based C backend to the higher level C++ one
started in 2016, and it was just completed at the end of 2021, with a final push
from an engineer from Quansight, who helped migrate a large amount of highly
non-trivial functionality.

### High Priority Issues

From our initial involvement in the project in 2019, Quansight has been actively
involved in helping Meta deal with high-priority issues. These are bugs reported
by users that are considered critical, or feature requests that got enough
attention from the community to be deemed of particular interest. During the
last year, Quansight engineers closed 116 high-priority issues.

## Torchvision

### Datasets & Transforms

_torchvision.datasets_ and _torchvision.transforms_ have been part of
_torchvision_ since the initial release in 2016. Their original purpose was to
assist image classification scenarios, and for this use case they work well.
Quickly after the beginning, though, demand grew for other vision tasks like
object detection, video classification, and optical flow.

The original API was able to partially support these use cases as well, but
there was never a general way. Starting in mid-2021, Quansight and Meta
engineers started completely redesigning the API to achieve convergence between
the different tasks. This work is still ongoing and can be found in the
_torchvision.prototype_ namespace.

Although the revamp brings a plethora of improvements, the most important change
to highlight here is that datasets now return everything they have to offer, and
transforms now handle that without any need for manual interference. For
example, if a dataset provides a bounding box together with the image, all
transformations that alter the shape of the image are also applied to the
bounding box to keep them in sync.

### Video Reading

We have seen widespread adoption of Torchvision video backends and datasets
in 2021. Quansight engineers, in collaboration with community developers and Meta
engineers, have continued to push the performance, reliability, and accuracy of
video infrastructure in Torchvision to match the new demand. We refactored and
updated the existing API to support the latest versions of FFmpeg system
libraries and resolved numerous issues related to video modules. We have also
worked closely with engineers from Meta and NVIDIA to bring the support for GPU
decoding, one of the most-requested features, to Torchvision and have integrated
it into the existing infrastructure.

## Research Topics

Engineers at Quansight are also actively involved in the research aspect of
PyTorch. This involves features that are expected to either be used by
researchers or are implemented as a proof of concept for promising ideas, and do
not necessarily have equivalents in other deep learning frameworks. These topics
require strong design capabilities, together with a good knowledge of the
current research literature on these topics, which fit well with the academic
background of many of the engineers at Quansight.

### Sparse Tensors

Sparse data appears naturally in fields with high-dimensional data points, like
vision, chemistry and drug synthesis, or analysis of time sequences in geology
or biology. While sparse tensors have been around for as long as data analysis,
the semantics for sparse operations in the context of autograd are still far
from well-understood. A team of Quansight engineers is involved in both the
design and the implementation of sparse operations and their derivatives within
PyTorch. The current goal is to have PyTorch match the capabilities of
_scipy.sparse_, together with GPU support and sparse gradients when possible.

### Functorch

With its release in 2019, [JAX][jax docs] introduced a new way of thinking about
machine learning. JAX showed what many programming languages researchers had
theorized for years: It was not only possible but sound to implement an
efficient ML framework based on functional programming principles.
[Functorch][functorch repo] (for Functional PyTorch) is an approach to marry the
benefits and simplicity of the higher-order functional transformations from JAX
with the simplicity of use of the eager mode and class-based approach from
PyTorch. Quansight has a number of engineers participating in this project,
which will be released as an external library for PyTorch 1.12. This library is
intended to stay as an out-of-tree project until its design is stable. Then, it
is planned to be merged into core PyTorch.

### Parametrizations

In the same way that data is often preprocessed and cleaned up before being
analyzed, preprocessing weights of layers by transforming them before being used
within a layer can be used as a regularizer to [stabilize the training of a
network][training stabilization paper]. PyTorch 1.9 added a way to [parametrize
parameters of neural networks][pytorch docs stabilization] in a composable and
extensible way. The design of this feature stemmed from the research carried out
by one of the engineers at Quansight during their doctoral studies, who then
went on to implement this feature in PyTorch core.

## Closing Remarks

This turned into a very long post, which reflects the huge amount of effort put
in by our team of 15+ engineers. This was a true team effort, with contributions
from: Ivan Yashchuk, Peter Bell, Mario Lezcano, Ralf Gommers, Nikita Vedeneev,
Kurt Mohler, Kshiteej Kalambarkar, Thomas Fan, Philip Meier, Yukio Siraichi,
Victor Fomin, Pearu Peterson, Kushashwa Shrimali, Sameer Deshmukh, Hameer
Abbasi, Bruno Korbar, Nikita Karetnikov, Matti Picus, Antonio Cuni, Guilherme
Leobas, Alexander Ocsa, Edgar Margffoy, and Anirudh Dagar.

All of this work wouldn't have been possible without the excellent collaboration
with, and support from, PyTorch and Torchvision maintainers at Meta. We'd like
to thank Mike Ruberry, Natalia Gimelschein, Edward Yang, Alban Desmaison, Anjali
Chourdia, Christian Pursch, Joel Schlosser, Nikita Shulga, Richard Zou, Joe
Spisak, and Joe Isaacson (PyTorch) and Vasilis Vryniotis, Francisco Massa,
Prabhat Roy and Nicolas Hug (Torchvision) in particular.

[array api docs]: https://data-apis.org/array-api/latest/
[automatic diff @ wik]: https://en.wikipedia.org/wiki/Automatic_differentiation
[cuda @ wik]: https://en.wikipedia.org/wiki/CUDA
[cupy homepage]: https://cupy.dev/
[dask homepage]: https://dask.org/
[functorch repo]: https://github.com/pytorch/functorch
[h2-array-api-numpy]: #python-array-api-and-numpy-compatibility
[h2-maintainability]: #maintainability
[h2-research-topics]: #research-topics
[h2-scientific-pytorch]: #scientific-pytorch
[h2-torchvision]: #torchvision
[interpolation scaling paper]: https://github.com/GaParmar/clean-fid
[jax docs]: https://jax.readthedocs.io/
[matplotlib homepage]: https://matplotlib.org/
[mxnet homepage]: https://mxnet.apache.org/
[numpy homepage]: https://numpy.org/
[pandas homepage]: https://pandas.pydata.org/
[pytorch blog linalg.autograd]: https://pytorch.org/blog/torch-linalg-autograd/
[pytorch docs complex numbers]: https://pytorch.org/docs/master/complex_numbers.html
[pytorch docs fft]: https://pytorch.org/docs/stable/fft.html
[pytorch docs linalg]: https://pytorch.org/docs/stable/linalg.html
[pytorch docs stabilization]: https://pytorch.org/docs/master/_modules/torch/nn/utils/parametrizations.html
[pytorch docs special]: https://pytorch.org/docs/stable/special.html
[pytorch gh complex numbers issue]: https://github.com/pytorch/pytorch/issues/755
[pytorch homepage]: https://pytorch.org/
[pytorch tutorial fwd auto diff]: https://pytorch.org/tutorials/intermediate/forward_ad_usage.html
[scikit-learn homepage]: https://scikit-learn.org/
[scipy homepage]: https://scipy.org/
[tensorflow homepage]: https://www.tensorflow.org/
[training stabilization paper]: https://arxiv.org/abs/1802.05957
