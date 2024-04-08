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

There are many examples of loosely-connected systems that lend themselves well to an expression in terms of sparse arrays. Let's illustrate this claim with a few examples:

#### An [impedance matrix](https://en.wikipedia.org/wiki/Impedance_parameters) for a circuit

An impedance matrix for a linear circuit (which is a circuit comprising purely of resistors, capacitors, inductors, alongside connections between them) with `N` ports is an `N ✕ N` matrix, with each entry representing the connection between two ports. Where no connection is present, the Z-matrix, as it is also known, has a value of infinity.

Consider that in a large circuit with many ports, due to physical limitations and also to keep the design simple, the amount of connections do not scale as `N²`, but usually as a much lower factor. This means, in essence, that the larger the circuit; the sparser its impedance matrix will be, if the background value is taken to be infinity. Due to technologies such as multi-layer PCBs, there isn't usually a clear pattern as to which ports will be connected.

#### [Convolution](https://en.wikipedia.org/wiki/Convolution)

Convolution is simply the smearing out of one signal, with the "shape" of the smearing depending on another signal, called a kernel. Mathematically, each sample in a discrete signal would only affect its neighbours. Thus, if this relationship were to be expressed in a matrix, it would have samples concentrated along the diagonal, but for long signals and short kernels; this matrix would also be very sparse.

#### NLP Use-case

Consider an natural-language processing use-case where we parse statements of the form `(subject, object, predicate)`, such as, for example `(Hameer, this blog post, authored)`. This particular predicate would be true. On the other hand, `(Elephant, fish, is)` would be false. Now consider the massive space of all predicates arranged into a 3-dimensional array, we would give them a value of `+1` for true or `-1` for untrue, or `0` for unknown or to be predicted. Such an array would have a shape of `N ✕ N ✕ K` where `N` is the number of entities and `K` is the number of predicates. Such a system would also be very sparse.

### Exploiting sparsity

Sparsity can be exploited in many algorithms in two main ways. The first is storage: By simply "not storing" the background value, we can save on a lot of storage. Of course, this means that one has to store information about what elements are actually not at the background value. This usually implies storing extra information beyond just the values of the present elements; it implies we must also encode their position. This implies two trade-offs we must make. The first is, if the fraction of present values (often called simply the _density_ of a sparse array) is more than a certain threshold; it may simply be better to store the array as a simple dense array. The other trade-off is more subtle: What scheme should we use for encoding the positions of the present values? The presence of multiple schemes with their own benefits and drawbacks is presented below.

The second main way we can take advantage of sparsity is via compute. By "skipping over" the background values; one can exceed the speed of a dense algorithm; once again assuming that the density does not exceed some threshold. This is, once again, not as simple as it may seem at first glance: A sparse algorithm needs to combine present values and their corresponding positions from different arrays and decide the value and presence of a corresponding element in the output array. We see a common pitfall here when writing sparse algorithms: If at any point; we accidentally iterate over the missing values, we risk losing many performance benefits of a sparse algorithm.

### Common Formats

In the last section, we hinted at different schemes for storing the positions of present values in sparse arrays. Such a scheme is known more commonly as a (sparse array) _format_. What format is best for storing some data is often determined by the pattern of present values in the data, the sparsity of the data, and some other considerations. Let's explore further by seeing a two common example formats for illustrative purposes.

#### Dictionary-of-keys (DOK)

This is one of the simplest formats to explain, so we begin with this one. The idea is that we have a dictionary that stores the coordinates of present values as the key, with the value representing the value of the array at that coordinate. Let's illustrate with a small example using the `sparse` library.

```python
>>> import numpy as np
>>> import sparse
>>> import pprint
>>> eye_dok = sparse.DOK.from_numpy(np.eye(5))
>>> pprint.pp(eye_dok.data)
{(0, 0): 1.0, (1, 1): 1.0, (2, 2): 1.0, (3, 3): 1.0, (4, 4): 1.0}
```

This format has a number of advantages:

1. It's simple to implement.
2. It supports insertion into any coordinate by inserting the appropriate key-value pair into the dictionary.
3. Random access is possible by retrieving a key from the dictionary.

However, it also has a number of disadvantages:

1. Iterating over values may be random, depending on the dictionary implementation. This creates problems when combining different arrays; and checking the presence of a given row or column (one can only check the presence of an element efficiently).
2. It suffers from a higher memory usage than some other formats, as dictionaries take up more space than arrays.
3. Retrieval of a single element may be fast, but it's slower than a similar access from an array due to hashing.

### COOrdinate Format

This format is also extremely simple, it stores one array of values, and a corresponding array of positions.

```python
>>> eye_coo = sparse.COO.from_numpy(np.eye(5))
>>> eye_coo.coords
array([[0, 1, 2, 3, 4],
       [0, 1, 2, 3, 4]])
>>> eye_coo.data
array([1., 1., 1., 1., 1.])
```

The advantages for this one are the flip-side of DOK:

1. It's simple to implement.
2. If the constituent arrays are stored as lists, one can easily append a new coordinate. However, we risk working with out-of-order indices that way.
3. Storage is near-optimal (for hyper-sparse arrays).
4. Iterating in-order is possible if the constituent arrays are sorted.

Here are some disadvantages:

1. Random access using a coordinate isn't possible, one has to search for an existing coordiate. This may be easy if the coordinates are sorted or hard if they're not.
2. Random insertion makes the coordinates go out of order.
3. Sorting may be frequently required.

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

<sup>1</sup> Within same block if it exists, otherwise similar to CSC. <br />
✅ Available, with optimized loops for atomic operations <br />
🚧 Present, with intermediate conversions or sub-optimal iterations <br />
🚫 Unavailable

### Array Creation API

Here, we will compare how to create sparse arrays with the different libraries, as well as any kinks and notable pain points.

#### `sparse`

`sparse` provides two main options for constructing arrays:

1. From an existing array with [`sparse.asarray`](https://sparse.pydata.org/en/stable/generated/sparse.asarray.html).
2. By creating a [`sparse.DOK`](https://sparse.pydata.org/en/stable/generated/sparse.DOK.html) instance, populating it, then using [`sparse.DOK.asformat`](https://sparse.pydata.org/en/stable/generated/sparse.DOK.asformat.html).
3. By specifying the constituent data or arrays.

One current pain point for `sparse` is its performance: It's notably slower than equivalent SciPy operations. Work is ongoing to resolve this difference in performance while maintaining generality.

#### `cupyx.sparse` and `scipy.sparse`

One can do any of the following to create a `scipy.sparse` or `cupyx.sparse` array:

1. Use `array_type(existing_obj)`, as [an example CSR](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_array.html).
2. (Only for SciPy) Instantiate a [`scipy.sparse.dok_array`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.dok_array.html), populate it, and then use [`scipy.sparse.dok_array.asformat`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.dok_array.asformat.html#scipy.sparse.dok_array.asformat)
   - For `cupyx.sparse`, we can later move the array to the GPU.
3. Use `array_type(tuple_of_constituent_arrays)`.

The main pain points for this set of libraries are twofold:

1. They only support 2-D arrays or matrices.
2. Most of the existing work only exists for the old, deprecated `np.matrix` interface. SciPy has recently, however, begun work to migrate away from `np.matrix`.

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
