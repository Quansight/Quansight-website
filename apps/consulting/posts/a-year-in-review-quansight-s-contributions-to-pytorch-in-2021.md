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

## Maintainability

## Torchvision

## Research Topics

## Closing Remarks

[array api docs]: https://data-apis.org/array-api/latest/
[cuda @ wik]: https://en.wikipedia.org/wiki/CUDA
[cupy homepage]: https://cupy.dev/
[dask homepage]: https://dask.org/
[h2-array-api-numpy]: #python-array-api-and-numpy-compatibility
[h2-maintainability]: #maintainability
[h2-research-topics]: #research-topics
[h2-scientific-pytorch]: #scientific-pytorch
[h2-torchvision]: #torchvision
[jax docs]: https://jax.readthedocs.io/
[matplotlib homepage]: https://matplotlib.org/
[mxnet homepage]: https://mxnet.apache.org/
[numpy homepage]: https://numpy.org/
[pandas homepage]: https://pandas.pydata.org/
[pytorch homepage]: https://pytorch.org/
[scikit-learn homepage]: https://scikit-learn.org/
[scipy homepage]: https://scipy.org/
[tensorflow homepage]: https://www.tensorflow.org/
