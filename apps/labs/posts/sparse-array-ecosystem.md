---
title: 'An overview of the Sparse Array Ecosystem for Python'
authors: [hameer-abbasi]
published: March 19, 2024
description: 'An overview of the different options available for working with sparse arrays in Python'
category: [PyData ecosystem, OSS Experience]
featuredImage:
  src: /posts/sparse-array-ecosystem/title.png
  alt: 'A mind-map of the main components of the sparse array ecosystem'
hero:
  imageSrc: /posts/sparse-array-ecosystem/title.png
  imageAlt: 'A mind-map of the main components of the sparse array ecosystem'
---

# An overview of the Sparse Array Ecosystem for Python

## Why Sparse Arrays?

### Sparsity in nature

We live in a locally-connected universe. What this means is every particle in the universe can only influence its local neighbourhood of particles (or at least a small number of particles compared to what's out there) at a given time. For this reason, most arrays that show up in nature as adjacency arrays representing connections between particles are sparse. One might also say they are hypersparse, due to the sheer amount of difference between the non-background-value elements and the total elements. Many other arrays, representing connections between components of a circuit, perhaps, or a mechanical system, will also be sparse. What's more, these arrays typically become sparser as the system becomes more complex.

### Exploiting sparsity

We can exploit the natural sparsity of these arrays in two main ways: storage and compute. By recognizing patterns in the data, one can reduce the storage required to store such arrays. Additionally, one can also reduce the time required to perform operations on such arrays. Sometimes (depending on the exact patterns, and also on the sparsity) one can reduce the time required from being brazenly impossible even on a large supercomputer; to being lightning fast on your cell phone. Many algorithms take advantage of sparsity without advertising it, but by providing a solid framework, many of these algorithms can be expressed using the more natural language of array computing.

## What tools can I use?

### [`sparse`](https://sparse.pydata.org/)

Also known as PyData/Sparse, this is a library maintained by yours truly. Its original aim was to provide a NumPy-like API for working with N-dimensional sparse arrays. With the emergence of the [Array API standard](https://data-apis.org/array-api/latest/) and research into Sparse array computing, the aim has shifted to providing perfomant sparse array operations following the Array API standard, though we are some time away from reaching that goal.

### [`scipy.sparse`](https://docs.scipy.org/doc/scipy/reference/sparse.html)

This is one of the original/popular sparse matrix libraries. For a long time, it followed a discouraged corner of NumPy's API and was also limited to exactly two dimensional matrices. Work is underway to make it conform to a more modern API. Details can be found here in [various discussion posts on the SciPy Discourse](https://discuss.scientific-python.org/tag/sparse-arrays).

### [`cupyx.sparse`](https://docs.cupy.dev/en/stable/reference/scipy_sparse.html)

This member of the sparse array libraries follows an interface that closely mirrors SciPy's, while executing on Nvidia and AMD's GPUs.

### [`torch.sparse`](https://pytorch.org/docs/stable/sparse.html)

This submodule of PyTorch allows one to create and operate on mainly N-dimensional COO arrays on the CPU or GPU.

### Honorable Mentions

There are a number of honorable mentions that never managed to gain enough traction to be included in this list:

- [**`jax.experimental.sparse`**](https://jax.readthedocs.io/en/latest/jax.experimental.sparse.html): A forward-thinking sparse array module based on the [MLIR sparse tensor dialect](https://mlir.llvm.org/docs/Dialects/SparseTensorOps/).
- [**`pysparse`**](https://pysparse.sourceforge.net/): Not to be confused with `sparse`, this was a package that didn't take off, but has a rather common name.
- [**TACO**](http://tensor-compiler.org/): A C++ package with Python bindings by some of the brains behind performant sparse code generation.
- [**`finch-tensor` and `Finch.jl`**](https://willowahrens.io/Finch.jl/dev): A Julia package with respective Python bindings that's also showing promise and contains some novel research on performant sparse computing.

## Conclusion

The Sparse array ecosystem in Python is, in a word, _fragmented_. The meme below illustrates the options available to users. We would like to change that for the better. To that end, we at Quansight along with Professor Samaringhe's group at MIT CSAIL have received a grant from DARPA spanning two years of work to help move the ecosystem in a direction that would benefit the whole commpunity.

![Meme describing sparse array choices](/posts/sparse-array-ecosystem/meme.jpg 'The State of Sparse Array Computing in Python')
