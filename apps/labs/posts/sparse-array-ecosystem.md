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

## API and Performance Comparison

### Format Support

Support for many different formats can be important, especially as they usually represent differing patterns of sparsity, which in turn represent differing mathematical structures and patterns in nature. Native support for a wide variety of formats can be the key to unlocking a lot of performance and/or saving memory.

All formats have a number of read/write characteristics. For reading, they can be random access or sequential access, similarly with adding data to a sparse array. Whether they are ordered sequentially in memory is important, as this improves performance and compactness of the format. We list these characteristics below together with which library supports a format. We have also included a row for N-dimensional capabilities.

|                   | **Random Read** | **Random Write** | **Cache Optimized** | **`sparse`** | **`scipy.sparse`** | **`cupyx.sparse`** | **`torch.sparse`** |
| ----------------- | --------------- | ---------------- | ------------------- | ------------ | ------------------ | ------------------ | ------------------ |
| **COO**           | 🚫              | 🚫               | ✅                  | 🚧           | 🚧                 | 🚧                 | ✅                 |
| **DOK**           | ✅              | ✅               | 🚫                  | 🚧           | 🚧                 | 🚧                 | 🚫                 |
| **CSR/CSC**       | 🚫              | 🚫               | ✅                  | 🚧           | ✅                 | ✅                 | 🚧                 |
| **LIL**           | 🚫              | ✅               | 🚫                  | 🚫           | 🚧                 | 🚫                 | 🚫                 |
| **DIA**           | ✅              | 🚫               | ✅                  | 🚫           | 🚧                 | 🚧                 | 🚫                 |
| **BSR**           | ✅<sup>1</sup>  | ✅<sup>1</sup>   | ✅                  | 🚫           | 🚧                 | 🚫                 | 🚧                 |
| **N-dimensional** |                 |                  |                     | ✅           | 🚫                 | 🚫                 | ✅                 |

<sup>1</sup> Within same block if it exists <br>
✅ Available, with optimized loops for atomic operations <br>
🚧 Present, with intermediate conversions or sub-optimal iterations <br>
🚫 Unavailable

### Array Creation API

Here, we will compare how to create sparse arrays with the different libraries, as well as any kinks and notable pain points.

#### `sparse`

`sparse` provides two main options for constructing arrays:

1. From an existing array with [`sparse.asarray`](https://sparse.pydata.org/en/stable/generated/sparse.asarray.html).
2. By creating a [`sparse.DOK`](https://sparse.pydata.org/en/stable/generated/sparse.DOK.html) instance, populating it, then using [`sparse.DOK.asformat`](https://sparse.pydata.org/en/stable/generated/sparse.DOK.asformat.html).
3. By specifying the constituent data or arrays.

One notable pain point for `sparse` is its performance: It's notably slower than equivalent SciPy operations.

#### `cupyx.sparse` and `scipy.sparse`

One can do any of the following to create a `scipy.sparse` or `cupyx.sparse` array:

1. Use `array_type(existing_obj)`, as [an example CSR](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html).
2. (Only for SciPy) Instantiate a [`scipy.sparse.dok_array`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.dok_array.html), populate it, and then use [`scipy.sparse.dok_array.asformat`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.dok_array.asformat.html#scipy.sparse.dok_array.asformat)
   - For `cupyx.sparse`, we can later move the array to the GPU.
3. Use `array_type(tuple_of_constituent_arrays)`.

The main pain points for this set of libraries are twofold:

1. They only support 2-D arrays or matrices.
2. Most of the existing work only exists for the old, deprecated `np.matrix` interface. SciPy is trying to move away from that, but progress there is slow.

#### `torch.sparse`

To create a sparse array, one can:

1. Call the [`torch.Tensor.to_sparse`](https://pytorch.org/docs/stable/generated/torch.Tensor.to_sparse.html) on an existing `Tensor` (or any of the `to_sparse_*` format-specific methods).
2. By calling the format-specific constructors, for example [`torch.sparse_coo_tensor`](https://pytorch.org/docs/stable/generated/torch.sparse_coo_tensor.html), to create a format from its constituent arrays.

The main pain points for `torch.sparse` is the differing API from most other libraries, and lack of DOK support to construct hyper-sparse tensors intuitively.

### Honorable Mentions

There are a number of honorable mentions that haven't managed to gain enough traction to be included in this list:

- [**`jax.experimental.sparse`**](https://jax.readthedocs.io/en/latest/jax.experimental.sparse.html): A forward-thinking sparse array module based on the [MLIR sparse tensor dialect](https://mlir.llvm.org/docs/Dialects/SparseTensorOps/).
- [**`pysparse`**](https://pysparse.sourceforge.net/): Not to be confused with `sparse`, this was a package that didn't take off, but has a rather common name.
- [**TACO**](http://tensor-compiler.org/): A C++ package with Python bindings by some of the brains behind performant sparse code generation.
- [**`finch-tensor` and `Finch.jl`**](https://willowahrens.io/Finch.jl/dev): A Julia package with respective Python bindings that's also showing promise and contains some novel research on performant sparse computing.

## Conclusion

The Sparse array ecosystem in Python is, in a word, _fragmented_. The meme below illustrates the options available to users. We would like to change that for the better. To that end, we at Quansight along with Professor Samaringhe's group at MIT CSAIL have received a grant from DARPA spanning two years of work to help move the ecosystem in a direction that would benefit the whole commpunity.

![Meme describing sparse array choices](/posts/sparse-array-ecosystem/meme.jpg 'The State of Sparse Array Computing in Python')
