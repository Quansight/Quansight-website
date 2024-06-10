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

An impedance matrix for a linear circuit (which is a circuit comprised purely of resistors, capacitors, inductors, and the connections between them) with `N` ports is an `N ✕ N` matrix, with each entry representing the connection between two ports. Where no connection is present, the Z-matrix, as it is also known, has a value of infinity.

Due to physical limitations and also to keep the design simple, in a large circuit with many ports, the number of connections does not scale as `N²`, but usually as a much lower factor. Accordingly, this means that the larger the circuit, the sparser its impedance matrix will be, so long as we assume that the background value is taken to be infinity. In general, due to technologies such as multi-layer PCBs, there isn't usually a clear pattern as to which ports will be connected.

#### [Convolution](https://en.wikipedia.org/wiki/Convolution)

Convolution can be viewed as the smearing out of one signal, with the "shape" of the smearing depending on another signal called a kernel. Mathematically, each sample in a discrete signal would only affect its neighbors. Thus, if this relationship were to be expressed in a matrix, it would have samples concentrated along the diagonal. Except for long signals and short kernels, this matrix would tend to be very sparse.

#### NLP Use-case

Consider a natural-language processing use-case where we parse statements of the form `(subject, object, predicate)` (e.g., `(Hameer, this blog post, authored)`). This particular predicate would be true. On the other hand, `(Elephant, fish, is)` would be false. If we then consider the massive space of all predicates arranged into a 3-dimensional array, we would give them a value of `+1` for true, `-1` for untrue, and `0` for unknown (or to be predicted). Such an array would have a shape of `N ✕ N ✕ K`, where `N` is the number of entities and `K` is the number of predicates. Such a system would also be very sparse, as many triplets would be exceedingly unlikely.

### Exploiting sparsity

Sparsity can be exploited in many algorithms in two main ways. The first is storage. For example, by simply "not storing" the background value, we can save on a lot of storage. Of course, this means that one has to store information about what elements are actually not at the background value. This usually implies storing extra information beyond just the values of the present elements; we must also encode their position. This further implies two trade-offs that we must make. The first is, if the fraction of present values (often called simply the _density_ of a sparse array) is more than a certain threshold, it may be better to store the array as a simple dense array. The other trade-off is more subtle: what scheme should we use for encoding the positions of the present values? The presence of multiple schemes with their own benefits and drawbacks is presented below.

The second main way we can take advantage of sparsity is via compute. For example, if we consider the background scenario described above (see circuit use case), by "skipping over" the background values, one can exceed the speed of a dense algorithm, so long as we can once again assume that the density does not exceed some threshold. This is not as simple as it may seem at first glance. A sparse algorithm needs to combine values and their corresponding positions from different arrays and decide the value and presence of a corresponding element in the output array. We can thus see a common pitfall here when writing sparse algorithms. If at any point, we accidentally iterate over missing values, we risk losing many performance benefits of a sparse algorithm.

### Common Formats

In the last section, we hinted at different schemes for storing the positions of present values in sparse arrays. Such a scheme is known more commonly as a (sparse array) _format_. What format is best for storing a particular set of data is often determined by the pattern of present values in the data, the sparsity of the data, and some other considerations. Let's explore further by seeing two common example formats for illustrative purposes.

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

1. Iterating over values may be random, depending on the dictionary implementation. This creates problems when combining different arrays and when checking the presence of a given row or column (one can only check the presence of an element efficiently).
2. Because dictionaries take up more space than arrays, it suffers from higher memory usage than some other formats.
3. Retrieval of a single element may be fast, but it's slower than similar access into an array due to hashing.

### COOrdinate Format

This format is also relatively straightforward. The format stores one array of values and a corresponding array of positions.

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

However, the format has some disadvantages:

1. Random access using a coordinate isn't possible. One has to search for an existing coordinate. This may be easy if the coordinates are sorted and hard if they're not.
2. Random insertion causes the coordinates to be inserted out of order.
3. Sorting may be frequently required.

### Other Formats

There are many other formats, each with their own set of advantages and disadvantages:

- CSR/CSC are popular 2-dimensional formats, with fast row-major or column-major access respectively.
- Blocked formats are versions of formats which can store dense regions in a blocked structure.

Of course, it one can come up with their own way of encoding the positions, and therefore their own format. In this sense, it is important to recognize we aren't limited to the formats we mention here.

## Python Libraries for Sparse Arrays

While choosing the right format can be tricky, thankfully, Python has a number of libraries providing sparse array storage and compute capabilities. Some of these libraries have been around for some time, while others are relatively new to the scene. I'll briefly discuss a few of the major players.

### [`sparse`](https://sparse.pydata.org/)

`sparse` (also known as PyData/Sparse) is a library maintained by yours truly. Its aim is to provide perfomant sparse array operations following the Array API standard, though we are some time away from reaching that goal. The work on this library started in April 2017, with the author of this blog post taking over maintenance around January 2018. `sparse` provides a drop-in replacement for NumPy arrays, with support for **n-dimensional** arrays.

`sparse` provides a few main options for constructing arrays:

```python
# 1. with `sparse.asarray`
spx = sparse.asarray(x, [format=...])

# 2. Create a `sparse.DOK` and then convert
spy = sparse.DOK(shape=..., dtype=...)  # Instantiate
spy[...] = ...  # Assign repeatedly
spy = spy.asformat(...)  # Convert

# 3. By specifying the constituent arrays
spz = sparse.COO(shape=..., data=..., coords=...)
```

One current pain point for `sparse` is its performance: It's notably slower than equivalent SciPy operations. Work is ongoing to resolve this difference in performance while maintaining generality.

### [`scipy.sparse`](https://docs.scipy.org/doc/scipy/reference/sparse.html)

`scipy.sparse` is one of the original sparse matrix libraries. The library has existed since before SciPy was moved to GitHub, or even TRAC, with the earliest references pointing to 2006. It is built on NumPy matrices and has been limited to two dimensional sparse arrays. Work is underway to migrate `scipy.sparse` away from NumPy matrices (a discouraged corner of NumPy's API) and to conform to a more modern API. Details can be found here in [various discussion posts on the SciPy Discourse](https://discuss.scientific-python.org/tag/sparse-arrays).

One can do any of the following to create a `scipy.sparse` array:

```python
# Use `array_type(existing_arr)`
spx_arr_csr = scipy.sparse.csr_array(x)
spx_mat_coo = scipy.sparse.coo_matrix(x)
spx_mat_csc = scipy.sparse.csc_matrix(x)

# Use `dok_array` or `dok_matrix` and then `.asformat`
spy_arr_dok = scipy.sparse.dok_array(shape, dtype=...)  # Instantiate
spy_arr_dok[...] = ...  # Assign repeatedly
spy_arr_csr = spy_arr_dok.asformat("csr")  # Convert

# Use `array_type(tuple_of_constituent_arrays)`
spz_arr_csr = scipy.sparse.csr_array((data, indices, indptr), shape=...)  # NumPy arrays
spz_mat_csr = scipy.sparse.csr_array((data, indices, indptr), shape=...)  # NumPy arrays
```

The main pain points for this library are twofold:

1. They only support 2-D arrays or matrices.
2. Most of the existing work only exists for the deprecated `np.matrix` interface. SciPy has recently begun work to migrate away from `np.matrix`.

### [`cupyx.sparse`](https://docs.cupy.dev/en/stable/reference/scipy_sparse.html)

This member of the sparse array libraries follows an interface that closely mirrors SciPy's, while executing on Nvidia and AMD's GPUs. Work on `cupyx.sparse` started around 2017.

One can do any of the following to create a `cupyx.sparse` array:

```python
# Use `array_type(existing_arr)`
cpx_arr_csr = cupyx.sparse.csr_matrix(x)
cpx_mat_coo = cupyx.sparse.coo_matrix(x)
cpx_mat_csc = cupyx.sparse.csc_matrix(x)

# Use `array_type(tuple_of_constituent_arrays)`
cpz_arr_csr = cupyx.sparse.csr_matrix((data, indices, indptr), shape=...)  # Cupy arrays
cpz_mat_csr = cupyx.sparse.csr_matrix((data, indices, indptr), shape=...)  # CuPy arrays
```

CuPy also has some disadvantages:

1. They only support 2-D arrays or matrices.
2. The `np.matrix` interface remains the only option in `cupyx.sparse`.
3. There is no `cupyx.sparse.dok_matrix` type: One must use SciPy's DOK format.

### [`torch.sparse`](https://pytorch.org/docs/stable/sparse.html)

This submodule of PyTorch allows one to create and operate on mainly N-dimensional COO arrays on the CPU or GPU. Work on `torch.sparse` existed in early releases of PyTorch, starting around 2016.

To create a sparse array, one can:

```python
# Call `.to_sparse or .to_sparse_* methods`
spx = x.to_sparse([layout=...])
spx_csr = x.to_sparse_csr()

# Call constructors and use constituent arrays
spy_coo = torch.sparse.coo_tensor(coords, data, [shape, dtype=...])
spy_csr = torch.sparse.csr_tensor(indices, indptr, data, [shape, dtype=...])
```

The main pain points for `torch.sparse` is the lack of Array API support, with an API differing from most other libraries. For example, the library lacks an `asformat` method and various format-specific methods and lacks DOK support for constructing hyper-sparse tensors in an intuitive manner. On the flip side, `torch.sparse` is the only library to allow for N-dimensional GPU sparse arrays.

### Honorable Mentions

There are a number of honorable mentions that haven't managed to gain enough traction to be included in this list:

- [**`jax.experimental.sparse`**](https://jax.readthedocs.io/en/latest/jax.experimental.sparse.html): A forward-thinking sparse array module based on the [MLIR sparse tensor dialect](https://mlir.llvm.org/docs/Dialects/SparseTensorOps/).
- [**`pysparse`**](https://pysparse.sourceforge.net/): Not to be confused with `sparse`, this was a package that didn't take off, but has a rather common name.
- [**TACO**](http://tensor-compiler.org/): A C++ package with Python bindings by some of the brains behind performant sparse code generation.
- [**`finch-tensor` and `Finch.jl`**](https://willowahrens.io/Finch.jl/dev): A Julia package with respective Python bindings that's also showing promise and contains some novel research on performant sparse computing.

## Format Support

Support for many different formats can be important, especially as they usually represent differing patterns of sparsity, which in turn represent differing mathematical structures and patterns in nature. Native support for a wide variety of formats can be the key to unlocking significant memory and performance gains.

All formats have a number of read/write characteristics. For reading, they can be random access or sequential access. The same applies to writing data to a sparse array. Whether they are ordered sequentially in memory is important, as this improves performance and compactness of the format. We list these characteristics below, along with which library supports which format. We have also included a row for N-dimensional capabilities.

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

## Conclusion

The Sparse array ecosystem in Python is, in a word, _fragmented_. However, it's also relatively nascent, and a hard problem without a general solution. We would like to change that for the better. To that end, we at Quansight, along with Professor Samaringhe's group at MIT CSAIL, have received a grant from DARPA spanning two years of work to help move the ecosystem in a direction that would benefit the whole community, and to provide a truly general solution.
