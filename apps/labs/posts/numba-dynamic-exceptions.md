---
title: 'Numba Dynamic Exceptions'
published: June 27, 2023
author: guilherme-leobas
description: 'In the following blogpost, we will explore the newly added feature in Numba: Dynamic exception support. We will discuss the previous limitations and explain how Numba was enhanced to handle runtime exceptions.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/enhancements-to-numba-guvectorize-decorator/blog_feature_var1.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/enhancements-to-numba-guvectorize-decorator/blog_hero_org.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---


[Numba 0.57](https://numba.readthedocs.io/en/stable/release-notes.html#version-0-57-0-1-may-2023) was recently released, and it added an important feature: dynamic exceptions. Numba now supports exceptions with runtime arguments. Since [version 0.13.2](https://numba.readthedocs.io/en/stable/release-notes.html#version-0-13-2), Numba had limited support for exceptions: arguments had to be compile-time constants.

Although Numba's focus is on compiling Python into fast machine code, there is still value in providing better support for exceptions. Improving support means that exception messages can now include more comprehensive content - for example, an `IndexError` can now include the index in the exception message.

## Past, present and future

Before Numba 0.57, exceptions were limited to compile-time constants only. This means that users could only raise exceptions in the following form:

```python
from numba import njit

@njit
def getitem(lst: list[int], idx: int):
    if idx >= len(lst):
        raise IndexError('list index out of range')
    return lst[idx]
```

Attempting to raise an exception with runtime values in versions prior to 0.57 would result in a compilation error:

```python
from numba import njit

@njit
def getitem(lst: list[int], index: int):
    if index >= len(lst):
        raise IndexError(f'list index "{index}" out of range')
    return lst[index]
```

```bash
$ python -c 'import numba; print(numba.__version__)'
0.56.4

$ python example.py
Traceback (most recent call last):
  File "/Users/guilhermeleobas/git/blog/example.py", line 13, in <module>
    print(getitem(lst, index))
  File "/Users/guilhermeleobas/miniconda3/envs/numba056/lib/python3.10/site-packages/numba/core/dispatcher.py", line 480, in _compile_for_args
    error_rewrite(e, 'constant_inference')
  File "/Users/guilhermeleobas/miniconda3/envs/numba056/lib/python3.10/site-packages/numba/core/dispatcher.py", line 409, in error_rewrite
    raise e.with_traceback(None)
numba.core.errors.ConstantInferenceError: Failed in nopython mode pipeline (step: nopython rewrites)
Constant inference not possible for: $24build_string.6 + $const22.5

File "example.py", line 7:
def getitem(lst: list[int], index: int):
    <source elided>
    if index >= len(lst):
        raise IndexError(f'list index "{index}" out of range')
        ^
```

This example works just fine in the latest release.

```python
$ python -c 'import numba; print(numba.__version__)'
0.57.0

$ python example.py
Traceback (most recent call last):
  File "/Users/guilhermeleobas/git/blog/example.py", line 13, in <module>
    print(getitem(lst, index))
  File "/Users/guilhermeleobas/git/blog/example.py", line 7, in getitem
    raise IndexError(f'list index "{index}" out of range')
IndexError: list index "4" out of range
```

In the future, Numba users can expect better exception messages raised from Numba overloads and compiled code.

## How does it work?

Numba is a JIT compiler that translates a subset of Python into machine code. This translation step is done using [LLVM](https://llvm.org/). When Numba compiled code raises an exception, it must signal to the interpreter and propagate any required information back. The calling convention for **CPU** targets specifies how signaling is done:

```c
retcode_t (<Python return type>*, excinfo_t **, ... <Python arguments>)
```

The return code is one of the `RETCODE_*` constants in the [callconv.py](https://github.com/numba/numba/blob/main/numba/core/callconv.py#L47-L55) file.

<img
src="/apps/labs/public/posts/numba-dynamic-exceptions/diagram.png"
alt="Control flow of execution for an exception"
<figcaption align = "center">Figure contains a high-level illustration of the control flow when a Numba function raises an exception</figcaption>
/>

### Static Exceptions

When an exception is raised, the struct `excinfo_t**` is filled with a pointer to a struct describing the raised exception. Before Numba 0.57, this struct contained three fields:

- A pointer (`i8*`) to a pickled string
- String size (`i32`)
- Hash (`i8*`) of this same string

Take for instance the following snippet of code:

```python
@jit(nopython=True)
def func():
    raise ValueError('exc message')
```

The triple `(ValueError, 'exc message', location)` is pickled and serialized to the [LLVM module](https://llvm.org/docs/LangRef.html#module-structure) as a constant string. When the exception is raised, this same serialized string is unpickled by the interpreter and a frame is created for the exception. This is done in `_helperlib.c::numba_do_raise` ([ref](https://github.com/numba/numba/blob/39fc546dda0a21b90432e60f3c5e8c34f7892024/numba/_helperlib.c#L995-L1025)).

### Dynamic Exceptions

To support dynamic exceptions, we reuse all the existing fields and introduce two new ones. 

- A pointer (`i8*`) to a pickled string containing static information
- String size (`i32`)
- The third argument (`i8*`), which was previously used for hashing is now used to hold a list of native values
- A pointer to a function (`i8*`) that knows how to convert native values back to Python values. This is called [boxing](https://numba.pydata.org/numba-doc/dev/extending/interval-example.html#boxing-and-unboxing).
- A flag (`i32`) to signal whether an exception is static or dynamic. A value greater than zero not only indicates whether it is a dynamic exception, but also the number of runtime arguments

Using Python code, dynamic exceptions work as follow:

```python
@jit(nopython=True)
def dyn_exc_func(s: str):
    raise TypeError('error', s, len(s))
```

For each dynamic exception, Numba will generate a function that boxes native values into Python types. In the example above, `__exc_conv` will be generated automatically:

```c
def __exc_conv(s: native_string, i: int64):
    # convert
    # * native string -> Python string
    # * int64 -> Python int
    ...
```

The `excinfo` struct will be filled with:

- Pickled string of compile-time information: (exception type, static arguments, location)
- String size
- A list of dynamic arguments: `[native string, int64]`
- A pointer to `__exc_conv`
- Number of dynamic arguments: `2`

At runtime, before the control flow is returned to the interpreter, `__exc_conv` is called to convert native `string/int` values into Python `str/int` types.

I encourage anyone interested in further details to read the comments left on `callconv.py::CPUCallConv` ([ref](https://github.com/numba/numba/blob/c9cc06ba1410aff242764ffde8387a1bef2180ae/numba/core/callconv.py#L411-L444)).

## Limitations and future work

Numba has a [page](https://numba.readthedocs.io/en/stable/reference/pysupported.html#exception-handling) describing what is supported in exception handling. Some work still needs to be done to support exceptions to its full extent.

We would like to thank Bodo for sponsoring this work and the Numba core developers and community for reviewing this work and the useful insights given during code review.