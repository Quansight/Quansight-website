---
title: 'Extending Numba Types for Clean, Fast Code'
published: November 13, 2020
author: dale-tovar
description: >
  The scientific Python ecosystem relies on compiled code for fast execution. While it is still common to see C++ and C code contributed to the internals of Python libraries, much of the new compiled code written today uses a Python library like Cython or Numba to speed up Python code. Both of these libraries center around working with NumPy arrays, although both, with a little work, can be extended to work with custom data structures. As there are a number of blog posts comparing Cython and Numba, I'd like to draw attention to the extension capabilities of Numba and how it can be used to make clean, readable code. Numba's extensibility has been beautifully demonstrated by the Awkward Array library, which copies the NumPy array interface and can be used inside of jitted functions.
category: [Optimization]
featuredImage:
  src: /posts/extending-numba-types-for-clean-fast-code/numba-logo.jpg
  alt: 'Numba logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

The scientific Python ecosystem relies on compiled code for fast execution.
While it is still common to see C++ and C code contributed to the internals of
Python libraries, much of the new compiled code written today uses a Python
library like [Cython][cython site] or [Numba][numba site] to speed up Python
code. Both of these libraries center around working with NumPy arrays, although
both, with a little work, can be extended to work with custom data structures.
As there are a number of blog posts comparing Cython and Numba, I'd like to draw
attention to the [extension capabilities of Numba][numba docs extending] and
how it can be used to make clean, readable code. Numba's extensibility has been
beautifully demonstrated by the [Awkward Array][awkward array docs] library,
which copies the NumPy array interface and can be used inside of jitted
functions.

If we teach Numba how to use a custom data structure, instead of passing
multiple related arguments, we can pass the whole data structure and use its
functionality inside of a Numba-jitted function. This is particularly useful
when we want to have access to a data structure in multiple algorithms. A case
came up for me when I was writing a sparse matrix multiplication kernel between
a sparse matrix a and a dense NumPy array b. Here's a simplified version of the
algorithm in plain Python. We iterate through each of the nonzeros in a and all
of the elements of b.

```python
def csc_ndarray_dot(a: csc_matrix, b: np.ndarray):
    out = np.zeros((a.shape[0], b.shape[1]))
    for j in range(b.shape[1]):
        for i in range(b.shape[0]):
            for k in range(a.indptr[i], a.indptr[i + 1]):
                out[a.indices[k], j] += a.data[k] * b[i, j]
    return out
```

With all of the nested loops, this is code in desperate need of some
acceleration. However, because we can't use sparse matrices inside of Numba or
Cython, we have to modify the function. In the case of Numba, we have to
separate out the attributes of the sparse matrix.

[awkward array docs]: https://awkward-array.readthedocs.io/en/latest/index.html
[cython site]: https://cython.org/
[numba docs extending]: https://numba.readthedocs.io/en/stable/extending/index.html
[numba site]: https://numba.pydata.org/
