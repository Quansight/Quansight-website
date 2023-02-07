---
title: "uarray update: API changes, overhead and comparison to __array_function__"
author: hameer-abbasi
published: July 3, 2019
description: 'uarray is a generic override framework for objects and methods in
Python. In this blog post, wel'll walk-through of the current feature set and API, and then move on to current developments and how it compares to __array_function__.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/uarray-update-api-changes-overhead-and-comparison-to-__array_function__/blog_hero_var1.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/uarray-update-api-changes-overhead-and-comparison-to-__array_function__/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

`uarray` is a generic override framework for objects and methods in
Python. Since [my last `uarray`
blogpost](https://labs.quansight.org/blog/2019/04/uarray-intro/), there
have been plenty of developments, changes to the API and improvements to
the overhead of the protocol. Let's begin with a walk-through of the
current feature set and API, and then move on to current developments
and how it compares to
[`__array_function__`](www.numpy.org/neps/nep-0018-array-function-protocol.html).
For further details on the API and latest developments, please see [the
API page for
`uarray`](https://uarray.readthedocs.io/en/latest/generated/uarray.html).
The examples there are doctested, so they will always be current.

## Motivation

### Other array objects

NumPy is a simple, rectangular, dense, and in-memory data store. This is
great for some applications but isn't complete on its own. It doesn't
encompass every single use-case. The following are examples of array
objects available today that have different features and cater to a
different kind of audience.

-   Dask is one of the most popular ones. It allows distributed and
    chunked computation.
-   CuPy is another popular one, and allows GPU computation.
-   PyData/Sparse is slowly gaining popularity, and is a sparse,
    in-memory data store.
-   XArray includes named dimensions.
-   Xnd is another effort to re-write and modernise the NumPy API, and
    includes support for GPU arrays and ragged arrays.
-   Another effort (although with no Python wrapper, only data
    marshalling) is xtensor.

Some of these objects can be composed. Namely, Dask both expects and
exports the NumPy API, whereas XArray expects the NumPy API. This makes
interesting combinations possible, such as distributed sparse or GPU
arrays, or even labelled distributed sparse or CPU/GPU arrays.

Also, there are many other libraries (a popular one being scikit-learn)
that need a back-end mechanism in order to be able to support different
kinds of array objects. Finally, there is a desire to see SciPy itself
gain support for other array objects.

### `__array_function__` and its limitations {#__array_function__-and-its-limitations}

One of my motivations for working on `uarray` were the limitations of
the `__array_function__` protocol, defined in [this
proposal](https://www.numpy.org/neps/nep-0018-array-function-protocol.html).
The limitations are threefold:

-   It can only dispatch on array objects.
-   Consequently, it can only dispatch on functions that *accept* array
    objects.
-   It has no mechanism for conversion and coercion.
-   Since it conflates arrays and backends, only a single backend type
    per array object is possible.

These limitations have been
[partially](https://github.com/numpy/numpy/issues/11129)
[discussed](http://numpy-discussion.10968.n7.nabble.com/Allowing-broadcasting-of-code-dimensions-in-generalized-ufuncs-td45589.html)
[before](http://numpy-discussion.10968.n7.nabble.com/Proposal-to-accept-NEP-18-array-function-protocol-td46001.html).

## `uarray` --- The solution? {#uarray--the-solution}

With that out of the way, let's explore `uarray`, a library that hopes
to resolve these issues, and even though the original motivation was
NumPy and array computing, the library itself is meant to be a generic
multiple-dispatch mechanism.

``` python
# Enable __array_function__ for NumPy < 1.17.0
!export NUMPY_EXPERIMENTAL_ARRAY_FUNCTION=1
```

``` python
import uarray as ua
import numpy as np
```

In `uarray`, the fundamental building block is a multimethod.
Multimethods have a number of nice properties, such as automatic
dispatch based on backends. It is important to note here that
multimethods will be written by API authors, rather than implementors.
Here's how we define a multimethod in `uarray`:

``` python
my_multimethod = ua.generate_multimethod(
    # This is the argument extractor, it also defines the signature.
    lambda a, b=None: (),
    # This is the reverse dispatcher, it is important for conversion/coercion.
    # It is optional and can be set to None.
    lambda a, kw, d: (a, kw),
    # This is the domain, it separates the multimethods into clean parts.
    "ql_blogpost",
    # This is the default implementation. It is also optional, which means
    # "error if no backend is found/set".
    default=lambda a, b=None: (a, b)
)
```

We will explore the function of each of the parts of this multimethod
later. Let's try calling this multimethod.

``` python
my_multimethod(1, 2)
```

    (1, 2)

As we can see, it remains faithful to its purpose. It has a default
implementation that it can execute nicely. However, the real power comes
when overriding this multimethod. To do this, we must consider the
concept of a backend, which is separate. This is different from the view
of `__array_function__`, in which array objects themselves define the
backend. Here, we have applied the principle of [separation of
concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) to
separate the multimethod, the objects it operates on, as well as the
backend. Note as well that backend authors provide the implementation of
a given API.

Let's see how one would define a backend in `uarray`.

``` python
class Backend:
    # A backend can only override methods from its own domain
    __ua_domain__ = "ql_blogpost"
    
    # This is the main protocol a backend must have in order to work.
    @staticmethod
    def __ua_function__(
        func,  # It gets the multimethod being called,
        args, kwargs  # And the arguments the method is called with.
    ):
        # Here we have the implementation
        return func.__name__, args, kwargs
```

Now, let's go about overriding the function. Note here that
`set_backend` will typically be used by consumers of the API.

``` python
with ua.set_backend(Backend):
    print(my_multimethod(1, 2))
```

    ('<lambda>', (1, 2), {})

As you can see, the function's return value magically changed. Note
that this propagates all the way down the call stack. With that, let's
get into some of the more magical features of `uarray`, starting with
the function of the argument extractor, the argument replacer, and the
`__ua_convert__` protocol.

## The argument extractor and argument-based dispatch

The argument extractor (equivalent to a dispatcher in
`__array_function__`) is more than just a dummy that returns an empty
tuple. It can also return the arguments needed for dispatch. Let's go
ahead and see this in action.

``` python
import numbers
my_multimethod_with_dispatch = ua.generate_multimethod(
    # a is dispatchable, and it's supposed to be some kind of number
    lambda a, b=None: (ua.Dispatchable(a, numbers.Number),),
    lambda a, kw, d: (a, kw),
    "ql_blogpost"
)
```

Just to illustrate what happens when a multimethod doesn't have a
default implementation, let's call this multimethod.

``` python
my_multimethod_with_dispatch(1, 2)
```

    ---------------------------------------------------------------------------
    BackendNotImplementedError                Traceback (most recent call last)
    <ipython-input-8-14d7909bfa3d> in <module>
    ----> 1 my_multimethod_with_dispatch(1, 2)

    BackendNotImplementedError: No selected backends had an implementation for this function.

It raises an error, as is expected, with a message explaining the
situation. Now, let's explore dispatch.

``` python
class DispatchBackendInt:
    # A backend can only override methods from its own domain
    __ua_domain__ = "ql_blogpost"
    
    @staticmethod
    def __ua_function__(func, args, kwargs):
        return "int", func.__name__, args, kwargs
    
    @staticmethod
    def __ua_convert__(
        dispatchables,  # The list of dispatchables
        coerce # Whether or not to forcibly coerce them to the required form, if possible
    ):
        converted = []
        for d in dispatchables:
            # Check if it's a number, we only support ints
            if d.type is numbers.Number and isinstance(d.value, int):
                converted.append(d.value)
            else:
                return NotImplemented
        
        return converted

class DispatchBackendFloat:
    # A backend can only override methods from its own domain
    __ua_domain__ = "ql_blogpost"
    
    @staticmethod
    def __ua_function__(func, args, kwargs):
        return "float", func.__name__, args, kwargs
    
    @staticmethod
    def __ua_convert__(dispatchables, coerce):
        converted = []
        for d in dispatchables:
            # This one only supports floats
            if d.type is numbers.Number and isinstance(d.value, float):
                converted.append(d.value)
            else:
                return NotImplemented
        
        return converted
```

``` python
with ua.set_backend(DispatchBackendInt), ua.set_backend(DispatchBackendFloat):
    print(my_multimethod_with_dispatch(1, 2))
    print(my_multimethod_with_dispatch(1.0, 2))
    print(my_multimethod_with_dispatch("1", 2))
```

    ('int', '<lambda>', (1, 2), {})
    ('float', '<lambda>', (1.0, 2), {})

    ---------------------------------------------------------------------------
    BackendNotImplementedError                Traceback (most recent call last)
    <ipython-input-10-cdc811a82346> in <module>
          2     print(my_multimethod_with_dispatch(1, 2))
          3     print(my_multimethod_with_dispatch(1.0, 2))
    ----> 4     print(my_multimethod_with_dispatch("1", 2))

    BackendNotImplementedError: No selected backends had an implementation for this function.

As we can see, the method dispatches fine on `int` and `float` to the
correct implementation but raises an error for strings. Let's make a
small modification to make even working with `str` possible:

``` python
# The argument replacer is supposed to replace the args/kwargs
# with the right dispatchables
def my_ar(args, kwargs, dispatchables):
    def replacer(a, b=None):
        return dispatchables, {'b': b}
    
    return replacer(*args, **kwargs)

my_multimethod_with_dispatch = ua.generate_multimethod(
    lambda a, b=None: (ua.Dispatchable(a, numbers.Number),),
    my_ar,  # We put the right thing here.
    "ql_blogpost"
)
```

``` python
class DispatchBackendInt:
    # A backend can only override methods from its own domain
    __ua_domain__ = "ql_blogpost"
    
    @staticmethod
    def __ua_function__(func, args, kwargs):
        return "int", func.__name__, args, kwargs
    
    @staticmethod
    def __ua_convert__(dispatchables, coerce):
        converted = []
        for d in dispatchables:
            if d.type is numbers.Number:
                if isinstance(d.value, int):
                    converted.append(d.value)
                # If we're allowed to coerce it
                elif coerce and d.coercible:
                    try:
                        converted.append(int(d.value))
                    # Make sure unsupported conversions are caught
                    except TypeError:
                        return NotImplemented
                else:
                    return NotImplemented
            else:
                # Handle the base case
                return NotImplemented
        
        return converted
```

``` python
with ua.set_backend(DispatchBackendInt, coerce=True):
    print(my_multimethod_with_dispatch("1", 2))
```

    ('int', '<lambda>', (1,), {'b': 2})

Note that we must pass the `coerce=True` parameter to make this work,
otherwise the method will return `NotImplemented` and fail. Note also
that the string has been correctly converted before being passed into
the function. I previously
[mentioned](https://github.com/numpy/numpy/issues/12974#issuecomment-467197477)
[the
possibility](https://github.com/dask/dask/pull/4567#issuecomment-471630100)
of adding a reverse dispatcher to `__array_function__`, but it was
rejected. I have added it to `uarray`, but it is optional.

## Meta-backends: Backends which may rely on others

One other thing easily possible in `uarray` not easily possible in other
frameworks is the possibility of meta backends. These are backends which
could rely on other backends. Suppose, that a backend wraps other
objects and needs to get data out, and then call other backends:

``` python
class CustomNumber(numbers.Number):
    def __init__(self, n):
        self.n = n
```

``` python
class DispatchBackendCustom:
    # A backend can only override methods from its own domain
    __ua_domain__ = "ql_blogpost"
    
    @staticmethod
    def __ua_function__(func, args, kwargs):
        with ua.skip_backend(DispatchBackendCustom):
            return ("Custom",) + func(*args, **kwargs)
            
    @staticmethod
    def __ua_convert__(dispatchables, coerce):
        converted = []
        for d in dispatchables:
            if d.type is numbers.Number and isinstance(d.value, CustomNumber):
                # Access the internal value, no conversion going on
                converted.append(d.value.n)
            else:
                # Handle the base case
                return NotImplemented
        
        return converted
```

``` python
with ua.set_backend(DispatchBackendCustom), ua.set_backend(DispatchBackendInt):
    print(my_multimethod_with_dispatch(CustomNumber(1), 2))
```

    ('Custom', 'int', '<lambda>', (1,), {'b': 2})

## Permanent registration of backend

`uarray` provides permanent registration for backends, after which the
backend will be automatically tried every time. This is user-facing
code, and we recommend that no libraries register themselves
permanently, apart from reference implementations. This can be done via
the
[`register_backend`](https://uarray.readthedocs.io/en/latest/generated/uarray.register_backend.html)
method.

## Comparison with `__array_function__`

### Replacement and dispatching based on different objects

In this section, let's define a function with `__array_function__`, its
`uarray` equivalent and explore the limitations of `__array_function__`
and how `uarray` attempts to resolve them. You can see the [NumPy
enhancement proposal defining `__array_function__`
here](https://www.numpy.org/neps/nep-0018-array-function-protocol.html).
Here's a snippet from NumPy showing roughly how `np.sum` would be
defined ([current code as of writing
here](https://github.com/numpy/numpy/blob/02c8e80d5f65c7870f71c989c425d1bad24bd312/numpy/core/fromnumeric.py#L2040-L2182)):

``` python
def _sum_dispatcher(a, axis=None, dtype=None, out=None, keepdims=None,
                    initial=None, where=None):
    return (a, out)

@array_function_dispatch(_sum_dispatcher)
def sum(a, axis=None, dtype=None, out=None, keepdims=np._NoValue,
        initial=np._NoValue, where=np._NoValue):
    # Default implementation
```

Here's the equivalent `uarray` code:

``` python
def _sum_ar(a, kw, d):
    def replacer(a, axis=None, dtype=None, out=None, **kwargs):
        return (d[0],), {'out': d[1], 'axis': d[3], 'dtype': d[2], **kwargs}

axis_type = object()

@ua.create_multimethod(_sum_ar, "numpy", default=np.add.reduce)
def sum(a, axis=None, dtype=None, out=None, keepdims=None,
        initial=None, where=None):
    return (
        ua.Dispatchable(a, np.ndarray),
        ua.Dispatchable(out, np.ndarray),
        ua.Dispatchable(dtype, np.dtype),
        ua.Dispatchable(axis, axis_type),
    )
```

This shows the power of `uarray` in a simple example:

-   Not only can you dispatch based on `ndarray`s, you can convert and
    replace them too.
-   You can dispatch based on `dtype`, so (for example),
    [`ndtypes`](https://github.com/xnd-project/ndtypes) can be
    supported.
-   You can dispatch based on `axis`, so XArray could take over when the
    axes were named.
-   It allows you to have a fallback *in terms of other multimethods*.
-   Default keywords are dropped automatically, so one doesn't need to
    worry about missing kwargs that will be added later.

### Replacement of functions without any dispatchables

One of the biggest drawbacks of `__array_function__` was the need for
what I call a \"protocol soup\". For example, examine [this
issue](https://github.com/numpy/numpy/issues/13831) which shows the
number of extra functions that are required simply because NumPy can
only perform dispatch on functions which accept `array_like` objects.

`uarray` solves this in two ways: The first is by allowing the use of a
context manager which sets the backend. So, for example, you could do
the following:

``` python
with ua.set_backend(dask.array):
    x = np.array(...)  # x becomes a Dask array
```

The second is allowing for dispatch on more object types, so more
functions can be dispatched on.

## Complete example: `np.ones` using `uarray` {#complete-example-npones-using-uarray}

Here is a complete example of how one would override `np.ones` using
`uarray`, with backends for NumPy, Dask, and XArray as examples. I will
mention some advanced features one could use but won't implement them
myself. For reference, let's see how `np.ones` would work with
`__array_function__`: In any codebase using `np.ones`, someone would
first have to replace it with `np.ones_like`, and then dispatch using
`__array_function__`, which is a bit of a hack, and sort of undesirable.
What's more, it would need to be done throughout the codebase. Let's
first begin by defining the multimethod.

``` python
shape_type = object()

def ones_ar(a, kw, d):
    def replacer(shape, dtype=None, order='C'):
        return (d[0],), dict(dtype=d[1], order=order)
    return replacer(*a, **kw)

@ua.create_multimethod(ones_ar, domain="numpy")
def ones(shape, dtype=None, order='C'):
    return ua.Dispatchable(shape, shape_type), ua.Dispatchable(dtype, np.dtype)
```

Now, we'll go on to define the NumPy backend, and register it:

``` python
import collections.abc as collections

class NumpyBackend:  # Ideally, this would be the numpy module itself.
    __ua_domain__ = "numpy"
    
    @staticmethod
    def __ua_function__(f, a, kw):
        return getattr(np, f.__name__)(*a, **kw)
    
    @staticmethod
    def __ua_convert__(dispatchables, coerce):
        converted = []
        
        for d in dispatchables:
            if d.type is np.ndarray:
                try:
                    # We ONLY want to coerce if coercion is true.
                    if not hasattr(d.value, '__array_interface__') and not (coerce and d.coercible):
                        return NotImplemented
                    converted.append(np.asarray(d.value))
                except (TypeError, ValueError):
                    return NotImplemented
            elif d.type is shape_type:
                if not (isinstance(d.value, numbers.Integral)
                        or isinstance(d.value, collections.Iterable)
                        and all(isinstance(dim, numbers.Integral) for dim in d.value)):
                    return NotImplemented

                converted.append(tuple(int(dim) for dim in d.value)
                        if isinstance(d.value, collections.Iterable)
                        else (int(d.value),))
            elif d.type is np.dtype:
                try:
                    converted.append(np.dtype(d.value))
                except (TypeError, ValueError):
                    return NotImplemented
            else:
                # Handle the base case, pass through everything else
                converted.append(d.value)
        return converted
    
ua.set_global_backend(NumpyBackend)
```

Since we have set NumPy to be a global backend, it will always work.

``` python
ones((3, 4))
```

    array([[1., 1., 1., 1.],
           [1., 1., 1., 1.],
           [1., 1., 1., 1.]])

Let's now move forward to Dask, and how its backend would be defined:

``` python
import dask.array as da

class DaskBackend:  # Ideally, this would be the dask.array module itself.
    __ua_domain__ = "numpy"
    
    @staticmethod
    def __ua_function__(f, a, kw):
        return getattr(da, f.__name__)(*a, **kw)
    
    @staticmethod
    def __ua_convert__(dispatchables, coerce):
        converted = []
        
        for d in dispatchables:
            if d.type is np.ndarray:
                try:
                    # We ONLY want to coerce if coercion is true.
                    if not hasattr(d.value, '__array_interface__') and not (coerce and d.coercible):
                        return NotImplemented
                    converted.append(da.asarray(d.value))
                except (TypeError, ValueError):
                    return NotImplemented
            else:
                # Pass through everything else, we only want to dispatch on arrays.
                converted.append(d.value)
        return converted
```

``` python
with ua.set_backend(DaskBackend):
    print(ones((3, 4)))
```

    dask.array<ones, shape=(3, 4), dtype=float64, chunksize=(3, 4)>

Note how a simple context manager allows things to magically work,
unlike in `__array_function__` where array creation functions are not
supported at all.

Here are a few things that could be done by Dask:

1.  It could depend on `unumpy` and become a true, agnostic, meta-array.
2.  It could define a backend factory, which automatically inserts the
    chunk sizes into functions.

Next, let's move on to XArray.

``` python
import xarray

def xarray_ones(shape, dtype=None):
    data = ones(tuple(shape.values()), dtype=dtype)
    return xarray.DataArray(data, dims=tuple(shape.keys()))

class XarrayBackend:  # Ideally, this would be the xarray module itself.
    __ua_domain__ = "numpy"
    
    @staticmethod
    def __ua_function__(f, a, kw):
        with ua.skip_backend(XarrayBackend):
            if f is ones:
                return xarray_ones(*a, **kw)
        
        return NotImplemented
    
    @staticmethod
    def __ua_convert__(dispatchables, coerce):
        converted = []
        
        for d in dispatchables:
            if d.type is np.ndarray:
                try:
                    # We ONLY want to coerce if coercion is true.
                    if not hasattr(d.value, '__array_interface__') and not (coerce and d.coercible):
                        return NotImplemented
                    converted.append(xarray.Dataset(d.value))
                except (TypeError, ValueError):
                    return NotImplemented
            elif d.type is shape_type:
                if not (isinstance(d.value, dict)
                        and all(
                            isinstance(k, str)
                            and isinstance(v, numbers.Integral)
                            for k, v in d.value.items()
                        )):
                    return NotImplemented

                converted.append({k: int(v) for k, v in d.value.items()})
            elif d.type is np.dtype:
                try:
                    converted.append(np.dtype(d.value))
                except (TypeError, ValueError):
                    return NotImplemented
            else:
                # Handle the base case, pass through everything else
                converted.append(d.value)
        return converted
```

``` python
with ua.set_backend(XarrayBackend):
    print(ones({'t': 3, 'x': 5}))
```

    <xarray.DataArray (t: 3, x: 5)>
    array([[1., 1., 1., 1., 1.],
           [1., 1., 1., 1., 1.],
           [1., 1., 1., 1., 1.]])
    Dimensions without coordinates: t, x

Note here how a shape as a dictionary was automatically intercepted by
XArray, and creates a suitable `DataArray`. This would simply not be
possible in `__array_function__`. Let's explore a more exotic case:

``` python
with ua.set_backend(DaskBackend), ua.set_backend(XarrayBackend):
    print(ones({'t': 3, 'x': 5}))
```

    <xarray.DataArray 'ones-c74937aa1cf5a1e9c9dd0ca4c337fd2c' (t: 3, x: 5)>
    dask.array<shape=(3, 5), dtype=float64, chunksize=(3, 5)>
    Dimensions without coordinates: t, x

And just like that, you can compose the two, without either having to be
aware of the other!

## The overhead of `uarray`

One of the limiting factors in the adoption of `uarray` has been its
overhead. This is currently [being brought
down](https://github.com/Quansight-Labs/uarray/pull/170) by [Peter
Bell](https://github.com/peterbell10), a GSoC student working on
`uarray`, who is working on a C++ implementation of the protocol. As of
the last version, the overhead on my machine was about 449 ns per call
(or about 12.4 Python function calls) for a simple function with no
parameters that returns nothing, and this is still being worked on. You
can follow the [updates on Peter's work
here](https://blogs.python-gsoc.org/en/blogs/peterbell10s-blog/). It is
also being [merged into
`scipy.fft`](https://github.com/scipy/scipy/pull/10383) as part of his
ongoing GSoC work.

## Conclusion

`uarray` provides a strong contender for a multiple-dispatch solution
for array computing, and an alternative to `__array_function__`. While
it is more feature-complete, it also needs a bit more boilerplate and
has higher overhead than `__array_function__`. Here's to hoping for
more options in the array computing space, and to separating the API
from the implementation, which always opens more pathways to future
improvement.
