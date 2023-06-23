---
title: "Enhancements to Numba's guvectorize decorator"
published: February 25, 2021
authors: [guilherme-leobas]
description: 'Starting from Numba 0.53, Numba will ship with an enhanced version of the @guvectorize decorator. Similar to the @vectorize decorator, @guvectorize now has two modes of operation: Eager, or decoration-time compilation and Lazy, or call-time compilation'
category: [PyData ecosystem]
featuredImage:
  src: /posts/enhancements-to-numba-guvectorize-decorator/blog_feature_var1.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/enhancements-to-numba-guvectorize-decorator/blog_hero_org.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Starting from Numba 0.53, Numba will ship with an enhanced version of the `@guvectorize` decorator. Similar to the [@vectorize](https://numba.pydata.org/numba-doc/dev/user/vectorize.html#the-vectorize-decorator) decorator, [@guvectorize](https://numba.pydata.org/numba-doc/dev/user/vectorize.html#the-guvectorize-decorator) now has two modes of operation:

- Eager, or decoration-time compilation and
- Lazy, or call-time compilation

Before, only the eager approach was supported. In this mode, users are required to provide a list of concrete supported types beforehand as its first argument. Now, this list can be omitted if desired and as one calls it, Numba dynamically generates new kernels for previously unsupported types.

## NumPy Universal Functions

NumPy has functions called Universal functions or ufuncs. Ufuncs are functions that operate on `ndarrays` element-by-element. [Examples](https://numpy.org/doc/stable/reference/ufuncs.html#available-ufuncs) of universal functions are `np.log` and `np.log2`, which compute the natural and base-2 logarithms, respectively. Alongside ufuncs, NumPy also has the notion of generalized ufuncs or gufuncs. While the former is limited to element-by-element operations, the latter supports subarray-by-subarray operations.

Creating new NumPy ufuncs is not an easy process and may require one to [write some C code](https://numpy.org/doc/stable/user/c-info.ufunc-tutorial.html). Numba extends the NumPy mechanism for registering and using (generalized) universal functions with two decorators: `@vectorize` and `@guvectorize`. Those decorators allow one to easily create universal functions from Python, leaving the grunt work to Numba.

For instance, consider the function `guvec`, which adds a scalar to every element in an array:

```python
from numba import guvectorize, int64
import numpy as np

@guvectorize([(int64[:], int64, int64[:])], '(n),()->(n)')
def guvec(x, y, res):
    for i in range(x.shape[0]):
        res[i] = x[x > i].sum() + y

>>> x = np.arange(10).reshape(5, 2)
>>> y = 10
>>> res = np.zeros_like(x)
>>> guvec(x, y, res)
>>> res
array([[ 4,  3],
       [ 8,  8],
       [12, 12],
       [16, 16],
       [20, 20]])
```

Notice that `guvectorize` functions don't return their result value. Instead, they have to have the return array passed as an argument.

Previously, to use this decorator, one would have to declare the argument types in advance. One can inspect the supported types through the `.types` property.

```python
>>> guvec
<ufunc 'guvec'>

>>> guvec.types
['ll->l']  # l is a shorthand for int64
```

The commands above also show that `guvec` is a NumPy ufunc and behaves like it. If one attempts to call it with non-supported argument types, it will fail with the following error message:

```python
>>> x, y = np.arange(10, dtype=np.float), 10
>>> res = np.zeros_like(x)
>>> guvec(x, y, res)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: ufunc 'guvec' not supported for the input types, and the inputs could not be safely coerced to any supported types according to the casting rule ''safe''
```

## Dynamic compilation

In Numba 0.53, one can omit the first argument to build a dynamic generalized universal function. For instance, consider the function `dyn_gufunc` below:

```python
@guvectorize('(n),()->(n)')
def dyn_guvec(x, y, res):
    for i in range(x.shape[0]):
        res[i] = x[x > i] + y

>>> dyn_guvec
<numba._GUFunc 'dyn_guvec'>
>>> dyn_guvec.ufunc.types
[]
```

As one makes calls to `dyn_guvec`, new kernels will be generated for previously unsupported input types. The following set of interactions will illustrate how dynamic compilation works for a dynamic generalized ufunc:

```python
>>> x = np.arange(10).reshape(5, 2)
>>> y = 10
>>> res = np.zeros_like(x)
>>> dyn_guvec(x, y, res)
>>> res
array([[ 4,  3],
       [ 8,  8],
       [12, 12],
       [16, 16],
       [20, 20]])
>>> dyn_guvec.types
['ll->l']
```

If this was a normal guvectorize function, one would have seen an exception complaining that the gufunc could not handle the given input. One can add additional loops by calling `dyn_guvec` with new types:

```python
>>> x_f = np.arange(5, dtype=np.float)
>>> y_f = 10.0
>>> res_f = np.zeros_like(x_f)
>>> dyn_guvec(x_f, y_f, res_f)
>>> dyn_guvec.types  # shorthand for dyn_guvec.ufunc.types
['ll->l', 'dd->d']
```

## Current limitations

In NumPy, it is fine to omit the output argument when calling a generalized ufunc.

```python
>>> a = np.arange(10).reshape(5, 2)
>>> b = 10
>>> guvec(a, b)
array([[ 4,  3],
       [ 8,  8],
       [12, 12],
       [16, 16],
       [20, 20]])
```

The same is not possible in a dynamic ufunc. Numba would have to guess the output type and shape to correctly generate code based on the input and signature.

```python
>>> dyn_guvec(a, b)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "path/to/numba/np/ufunc/gufunc.py", line 134, in __call__
    raise TypeError(msg)
TypeError: Too few arguments for function 'dyn_guvec'. Note that the pattern `out = gufunc(Arg1, Arg2, ..., ArgN)` is not allowed. Use `gufunc(Arg1, Arg2, ..., ArgN, out) instead.
```

## Next steps

In the future we would like to bring the `@guvectorize` capabilities closer to the `@vectorize` ones. For instance, currently it is not possible to call a guvectorize function from a jitted (`@jit`) function. Some work needs to be done in this direction.

We would like to thank the [D. E. Shaw group](https://www.deshaw.com/) for sponsoring this work. The D. E. Shaw group collaborates with Quansight on numerous open source projects, including Numba, Dask and Project Jupyter.
