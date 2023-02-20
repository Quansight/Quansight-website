---
title: 'Extending Numba Types for Clean, Fast Code'
published: November 13, 2020
author: dale-tovar
description: >
  The scientific Python ecosystem relies on compiled code for fast execution. While it is still common to see C++ and C code contributed to the internals of Python libraries, much of the new compiled code written today uses a Python library like Cython or Numba to speed up Python code. Both of these libraries center around working with NumPy arrays, although both, with a little work, can be extended to work with custom data structures. As there are a number of blog posts comparing Cython and Numba, I'd like to draw attention to the extension capabilities of Numba and how it can be used to make clean, readable code. Numba's extensibility has been beautifully demonstrated by the Awkward Array library, which copies the NumPy array interface and can be used inside of jitted functions.
category: [Optimization, Training]
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

```python
@numba.jit(nopython=True)
def numba_csc_ndarray_dot(a_shape, a_data, a_indices, a_indptr, b):
    ...
```

In the case of Cython, we have to separate out the attributes and add typing
information. In both cases, the function gets messier.

```python
%% cython
import cython
import numpy as np
cimport numpy as np

@cython.boundscheck(False)
@cython.wraparound(False)
def cython_csc_ndarray_dot(tuple a_shape,
    np.ndarray[double, ndim = 1] a_data,
    np.ndarray[long, ndim = 1] a_indices,
    np.ndarray[long, ndim = 1] a_indptr,
    np.ndarray[double, ndim = 2] b):
    cdef np.ndarray[double, ndim = 2] out = np.zeros(
        (a_shape[0], b.shape[1])
    )
    cdef int i, j, k
    for j in range(b.shape[1]):
        for i in range(b.shape[0]):
            for k in range(a_indptr[i], a_indptr[i + 1]):
                out[a_indices[k], j] += a_data[k] * b[i, j]
    return out
```

Fortunately, with a little work, we can teach Numba how to use sparse matrices
internally. First, we'll define a pure Python class for compressed sparse column
matrices. To do this, we need four attributes:

1. data, a NumPy array that stores the nonzero values of the matrix;
2. indices, a NumPy array that stores the rows of each of the nonzero values;
3. indptr, a NumPy array that stores pointers to the beginning of each column; and
4. shape, a tuple that stores the dimensions of the matrix.

```python
class csc_matrix:
    def __init__(self, data: np.array,
                 indices: np.array,
                 indptr: np.array,
                 shape: tuple):
        self.data = data
        self.indices = indices
        self.indptr = indptr
        self.shape = shape
```

Since Numba doesn't deal with native Python types directly, we need to specify
what the csc_matrix class looks like in Numba's types. To teach Numba to
recognize the csc_matrix class, we'll define a new class that extends Numba's
Type class. Here we specify the types of each of the attributes.

```python
from numba.core import types

class MatrixType(types.Type):
    def __init__(self, dtype):
        self.dtype = dtype
        self.data = types.Array(self.dtype, 1, 'C')
        self.indices = types.Array(types.int64, 1, 'C')
        self.indptr = types.Array(types.int64, 1, 'C')
        self.shape = types.UniTuple(types.int64, 2)
        super(MatrixType, self).__init__('csc_matrix')
```

For Numba to know that the csc_matrix should be typed as a MatrixType, we need
to register that relationship:

```python
from numba.extending import typeof_impl

@typeof_impl.register(csc_matrix)
def typeof_matrix(val, c):
    data = typeof_impl(val.data, c)
    return MatrixType(data.dtype)
```

The types that are used in nopython mode use data models (Numba-specific
representations of the class). In this case, we'll extend the StructModel which
is similar to a struct in C.

```python
from numba.extending import models

@register_model(MatrixType)
class MatrixModel(models.StructModel):
    def __init__(self, dmm, fe_type):
        members = [
            ('data', fe_type.data),
            ('indices', fe_type.indices),
            ('indptr', fe_type.indptr),
            ('shape', fe_type.shape)
        ]
        models.StructModel.__init__(self, dmm, fe_type, members)
```

We have to specify relationships using a Numba convenience function to enable
access to class attributes with the same identifiers within jitted functions.

```python
from numba.extending import make_attribute_wrapper

make_attribute_wrapper(MatrixType, 'data', 'data')
make_attribute_wrapper(MatrixType, 'indices', 'indices')
make_attribute_wrapper(MatrixType, 'indptr', 'indptr')
make_attribute_wrapper(MatrixType, 'shape', 'shape')
```

Almost there! All that's left to do is teach Numba how to make a native (Numba)
matrix into a Python matrix and vice versa. This is called boxing and unboxing.

```python
def make_matrix(context, builder, typ, **kwargs):
    return cgutils.create_struct_proxy(typ)(context, builder, **kwargs)

@unbox(MatrixType)
def unbox_matrix(typ, obj, c):
    data = c.pyapi.object_getattr_string(obj, "data")
    indices = c.pyapi.object_getattr_string(obj, "indices")
    indptr = c.pyapi.object_getattr_string(obj, "indptr")
    shape = c.pyapi.object_getattr_string(obj, "shape")
    matrix = make_matrix(c.context, c.builder, typ)
    matrix.data = c.unbox(typ.data, data).value
    matrix.indices = c.unbox(typ.indices, indices).value
    matrix.indptr = c.unbox(typ.indptr, indptr).value
    matrix.shape = c.unbox(typ.shape, shape).value
    for att in [data, indices, indptr, shape]:
        c.pyapi.decref(att)
    is_error = cgutils.is_not_null(
        c.builder, c.pyapi.err_occurred())

    return NativeValue(matrix._getvalue(), is_error=is_error)

@box(MatrixType)
def box_matrix(typ, val, c):
    matrix = make_matrix(c.context, c.builder, typ)
    classobj = c.pyapi.unserialize(
        c.pyapi.serialize_object(csc_matrix))
    data_obj = c.box(typ.data, matrix.data)
    indices_obj = c.box(typ.indices, matrix.indices)
    indptr_obj = c.box(typ.indptr, matrix.indptr)
    shape_obj = c.box(typ.shape, matrix.shape)
    matrix_obj = c.pyapi.call_function_objargs(
        classobj, (data_obj, indices_obj, indptr_obj, shape_obj))
    return matrix_obj
```

Okay, now we can use our csc_matrix class inside a Numba-jitted function and
just pass the two necessary arguments to function. All that's added is the jit
decorator.

```python
@numba.jit(nopython=True)
def numba_csc_ndarray_dot2(a: csc_matrix, b: np.ndarray):
    out = np.zeros((a.shape[0], b.shape[1]))
    for j in range(b.shape[1]):
        for i in range(b.shape[0]):
            for k in range(a.indptr[i], a.indptr[i + 1]):
                out[a.indices[k], j] += a.data[k] * b[i, j]
    return out
```

In conclusion, Numba offers some nice features that enable the use of custom
data types and structures inside of jitted functions. In the above case, all we
needed was access to class attributes for a single function. In the setting of a
large library, it can be very useful to be able to write fast compiled code
using pythonic code with access to properties and methods. Extending Numba in
this way can help keep codebases clean and maintainable.

[awkward array docs]: https://awkward-array.readthedocs.io/en/latest/index.html
[cython site]: https://cython.org/
[numba docs extending]: https://numba.readthedocs.io/en/stable/extending/index.html
[numba site]: https://numba.pydata.org/
