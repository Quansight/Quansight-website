---
title: "`uarray`: A Generic Override Framework for Methods"
author: hameer-abbasi
published: April 30, 2019
description: 'The problem is, stated simply: How do we use all of the PyData libraries in tandem, moving seamlessly from one to the other, without actually changing the API, or even the imports?'
category: [PyData ecosystem]
featuredImage:
  src: /posts/hello-world-post/blog_hero_var1.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/hello-world-post/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

`uarray` is an override framework for methods in Python. In the
scientific Python ecosystem, and in other similar places, there has been
one recurring problem: That similar tools to do a job have existed, but
don't conform to a single, well-defined API. `uarray` tries to solve
this problem in general, but also for the scientific Python ecosystem in
particular, by defining APIs independent of their implementations.

## Array Libraries in the Scientific Python Ecosystem

When SciPy was created, and Numeric and Numarray unified into NumPy, it
jump-started Python's data science community. The ecosystem grew
quickly: Academics started moving to SciPy, and the Scikits that popped
up made the transition all the more smooth.

However, the scientific Python community also shifted during that time:
GPUs and distributed computing emerged. Also, there were old ideas that
couldn't really be used with NumPy's API, such as sparse arrays. To
solve these problems, various libraries emerged:

-   Dask, for distributed NumPy
-   CuPy, for NumPy on Nvidia-branded GPUs.
-   PyData/Sparse, a project started to make sparse arrays conform to
    the NumPy API
-   Xnd, which extends the type system and the universal function
    concept found in NumPy

There were yet other libraries that emerged: PyTorch, which mimics NumPy
to a certain degree; TensorFlow, which defines its own API; and MXNet,
which is another deep learning framework that mimics NumPy.

## The Problem

The problem is, stated simply: How do we use all of these libraries in
tandem, moving seamlessly from one to the other, without actually
changing the API, or even the imports? How do we take functions written
for one library and allow it to be used by another, without, as Travis
Oliphant so eloquently puts it, \"re-writing the world\"?

In my mind, the goals are (stated abstractly):

1.  Methods that are not tied to a specific implementation.

-   For example `np.arange`

1.  Backends that implement these methods.

-   NumPy, Dask, PyTorch are all examples of this.

1.  Coercion of objects to other forms to move between backends.

-   This means converting a NumPy array to a Dask array, and vice versa.

In addition, we wanted to be able to do this for arbitrary objects. So
`dtype`s, `ufunc`s etc. should also be dispatchable and coercible.

## The Solution?

With that said, let's dive into `uarray`. If you're not interested in
the gory details, you can jump down to
`<a href="#how-to-use-it">`{=html}this section`</a>`{=html}.

``` python
import uarray as ua

# Let's ignore this for now
def myfunc_rd(a, kw, d):
    return a, kw

# We define a multimethod
@ua.create_multimethod(myfunc_rd)
def myfunc():
    return () # Let's also ignore this for now

# Now let's define two backends!
be1 = ua.Backend()
be2 = ua.Backend()

# And register their implementations for the method!
@ua.register_implementation(myfunc, backend=be1)
def myfunc_be1(): # Note that it has exactly the same signature
    return "Potato"

@ua.register_implementation(myfunc, backend=be2)
def myfunc_be2(): # Note that it has exactly the same signature
    return "Strawberry"
```

``` python
with ua.set_backend(be1):
    print(myfunc())
```

    Potato

``` python
with ua.set_backend(be2):
    print(myfunc())
```

    Strawberry

As we can clearly see: We have already provided a way to do (1) and (2)
above. But then we run across the problem: How do we decide between
these backends? How do we move between them? Let's go ahead and
register both of these backends for permanent use. And see what happens
when we want to implement both of their methods!

``` python
ua.register_backend(be1)
ua.register_backend(be2)
```

``` python
print(myfunc())
```

    Potato

As we see, we get only the first backend's answer. In general, it's
indeterminate what backend will be selected. But, this is a special
case: We're not passing arguments in! What if we change one of these to
return `NotImplemented`?

``` python
# We redefine the multimethod so it's new again
@ua.create_multimethod(myfunc_rd)
def myfunc():
    return ()

# Now let's redefine the two backends!
be1 = ua.Backend()
be2 = ua.Backend()

# And register their implementations for the method!
@ua.register_implementation(myfunc, backend=be1)
def myfunc_be1(): # Note that it has exactly the same signature
    return NotImplemented

@ua.register_implementation(myfunc, backend=be2)
def myfunc_be2(): # Note that it has exactly the same signature
    return "Strawberry"

ua.register_backend(be1)
ua.register_backend(be2)
```

``` python
with ua.set_backend(be1):
    print(myfunc())
```

    Strawberry

Wait\... What? Didn't we just set the first `Backend`? Ahh, but, you
see\... It's signalling that it has *no* implementation for `myfunc`.
The same would happen if you simply didn't register one. To force a
`Backend`, we must use `only=True` or `coerce=True`, the difference will
be explained in just a moment.

``` python
with ua.set_backend(be1, only=True):
    print(myfunc())
```

    ---------------------------------------------------------------------------
    BackendNotImplementedError                Traceback (most recent call last)
    <ipython-input-8-ec856cf7c88b> in <module>
          1 with ua.set_backend(be1, only=True):
    ----> 2     print(myfunc())

    ~/Quansight/uarray/uarray/backend.py in __call__(self, *args, **kwargs)
        108 
        109         if result is NotImplemented:
    --> 110             raise BackendNotImplementedError('No selected backends had an implementation for this method.')
        111 
        112         return result

    BackendNotImplementedError: No selected backends had an implementation for this method.

Now we are told that no backends had an implementation for this function
(which is nice, good error messages are nice!)

## Coercion and passing between backends

Let's say we had two `Backend`s. Let's choose the completely useless
example of one storing a number as an `int` and one as a `float`.

``` python
class Number(ua.DispatchableInstance):
    pass

def myfunc_rd(args, kwargs, dispatchable_args):
    # Here, we're "replacing" the dispatchable args with the ones supplied.
    # In general, this may be more complex, like inserting them in between
    # other args and kwargs.
    return dispatchable_args, kwargs

@ua.create_multimethod(myfunc_rd)
def myfunc(a):
    # Here, we're marking a as a Number, and saying that "we want to dispatch/convert over this"
    # We return as a tuple as there may be more dispatchable arguments
    return (Number(a),)

Number.register_convertor(be1, lambda x: int(x))
Number.register_convertor(be2, lambda x: str(x))
```

Let's also define a \"catch-all\" method. This catches all
implementations of methods not already registered.

``` python
# This can be arbitrarily complex
def gen_impl1(method, args, kwargs, dispatchable_args):
    if not all(isinstance(a, Number) and isinstance(a.value, int) for a in dispatchable_args):
        return NotImplemented
    
    return args[0]

# This can be arbitrarily complex
def gen_impl2(method, args, kwargs, dispatchable_args):
    if not all(isinstance(a, Number) and isinstance(a.value, str) for a in dispatchable_args):
        return NotImplemented
    
    return args[0]

be1.register_implementation(None, gen_impl1)
be2.register_implementation(None, gen_impl2)
```

``` python
myfunc('1') # This calls the second implementation
```

    '1'

``` python
myfunc(1) # This calls the first implementation
```

    1

``` python
myfunc(1.0) # This fails
```

    ---------------------------------------------------------------------------
    BackendNotImplementedError                Traceback (most recent call last)
    <ipython-input-13-8431c1275db5> in <module>
    ----> 1 myfunc(1.0) # This fails

    ~/Quansight/uarray/uarray/backend.py in __call__(self, *args, **kwargs)
        108 
        109         if result is NotImplemented:
    --> 110             raise BackendNotImplementedError('No selected backends had an implementation for this method.')
        111 
        112         return result

    BackendNotImplementedError: No selected backends had an implementation for this method.

``` python
# But works if we do this:

with ua.set_backend(be1, coerce=True):
    print(type(myfunc(1.0)))

with ua.set_backend(be2, coerce=True):
    print(type(myfunc(1.0)))
```

    <class 'int'>
    <class 'str'>

This may seem like too much work, but remember that it's broken down
into a lot of small steps:

1.  Extract the dispatchable arguments.
2.  Realise the types of the dispatchable arguments.
3.  Convert them.
4.  Place them back into args/kwargs
5.  Call the right function.

Note that `only=True` does not coerce, just enforces the backend
strictly.

With this, we have solved problem (3). Now remains the grunt-work of
actually retrofitting the NumPy API into `unumpy` and extracting the
right values from it.

## How To Use It Today

`unumpy` is a set of NumPy-related multimethods built on top of
`uarray`. You can use them as follows:

``` python
import unumpy as np # Note the changed import statement
from unumpy.xnd_backend import XndBackend

with ua.set_backend(XndBackend):
    print(type(np.arange(0, 100, 1)))
```

    <class 'xnd.array'>

And, as you can see, we get back an Xnd array when using a NumPy-like
API. Currently, there are three back-ends: NumPy, Xnd and PyTorch. The
NumPy and Xnd backends have feature parity, while the PyTorch backend is
still being worked on.

We are also working on supporting more of the NumPy API, and dispatching
over dtypes.

Feel free to browse the source and open issues at:
<https://github.com/Quansight-Labs/uarray> or shoot me an email at
`<a href="mailto:habbasi@quansight.com">`{=html}habbasi@quansight.com`</a>`{=html}
if you want to contact me directly. You can also find the full
documentation at <https://uarray.readthedocs.io/en/latest/>.

