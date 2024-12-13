---
title: "lib_sf_error_state: SciPy's first shared library"
authors: [albert-steppi]
published: December 4, 2024
description: The story of the first shared library to make it into the world of low level code that lies beneath SciPy's surface.
category: [PyData ecosystem]
featuredImage:
  src: /posts/lib-sf-error-state/featured.png
  alt: The text "SciPy" along with the SciPy logo superimposed over a computer generated image of a circuitboard.
hero:
  imageSrc: /posts/lib-sf-error-state/hero.png
  imageAlt: The text "SciPy" along with the SciPy logo superimposed over a computer generated image of a circuitboard.
---

## Introduction

This is the story of the first shared library to make it into the low level code that lies beneath SciPy's surface. It
offers a glimpse at some of the complexity we try to hide from users, while briefly previewing some exciting
developments in `scipy.special`.

Python has become wildly popular as a scripting language for scientific and other data intensive applications. It owes
much of its success to an exemplary execution of the "compiled core, interpreted shell" principle. One can orchestrate
simulation pipelines, preprocess and munge data, set up and use explanatory or predictive statistical models, make plots
and tables, and more, in an expressive high level language—while delegating computationally intensive tasks to compiled
libraries.

The default CPython interpreter was designed specifically to make it easy to extend Python programs with efficient
native code. The Python C API is well thought out and straightforward to work with. The controversial global interpreter
lock or GIL, a barrier to free threading within Python, has the benefit of making it much easier to call out to native
code, since one need not worry about the thread-safety of wrapped compiled libraries.

By wrapping, filling in gaps, and providing user friendly Python APIs to a wide range of battle tested permissively
licensed and public domain scientific software tools from places like NETLIB [^1]; NumPy and SciPy's founding developers
[^2] were able to kickstart the growth of the Scientific Python ecosystem. There is now a world of ecosystems of
scientific and data intensive software available in Python. Users who spend their time in the "interpreted shell" may
have little idea of the complexity that can arise in the "compiled core". Journeying deeper into the stack, it can be
surprising to see the level of work that can go into making even a relatively simple feature work smoothly. I will
try to keep all explanations self contained, so that this article can be followed by Python programmers without
C or C++ programming experience.

## NumPy Universal functions

NumPy `ndarray`s represent arbitrary dimensional arrays of elements of the same type, stored in a continguous buffer
[^2] at the machine level. A universal function or `ufunc` for short is a Python level function which applies a
transform to each element of an `ndarray` by calling out to native code which operates elementwise over the underlying
contiguous buffer.

Here's the ufunc `np.sqrt` in action

```python
In  [1]: import numpy as np

In  [2]: A = np.arange(1, 11, dtype=float)

In  [3]: A
Out [3]: array([ 1.,  2.,  3.,  4.,  5.,  6.,  7.,  8.,  9., 10.])

In  [4]: np.sqrt(A)
Out [4]:
array([1.        , 1.41421356, 1.73205081, 2.        , 2.23606798,
       2.44948974, 2.64575131, 2.82842712, 3.        , 3.16227766])

```

For large arrays, the speedup from by applying `np.sqrt` over an
`ndarray` rather than `math.sqrt` over each element of a list is substantial.
On my laptop:

```python
In  [1]: import numpy as np

In  [2]: A = np.arange(1, 1000000, dtype=float)

In  [3]: %timeit np.sqrt(A)
1.35 ms ± 49 µs per loop (mean ± std. dev. of 7 runs, 1,000 loops each)

In  [4]: B = [float(t) for t in range(1, 1000000)]

In  [5]: %timeit [math.sqrt(t) for t in B]
103 ms ± 1.18 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

## Error handling

Consider for a moment what should happen if one gives invalid input to a `ufunc`. If we pass a negative `float` to
`math.sqrt` a `ValueError` is raised.

```python
In  [1]: import math

In  [2]: math.sqrt(-1.0)
ValueError                                Traceback (most recent call last)
Cell In[2], line 1
----> 1 math.sqrt(-1.0)

ValueError: math domain error
```

What if one applies a ufunc over a large array and only a small number of inputs are invalid? Would it be reasonable to
raise a `ValueError` even though almost every calculation succeeded and produced a useful result? Fortunately that's not
what happens.

```python
In  [1]: import numpy as np

In  [2]: A = np.arange(-1, 1000, dtype=float)

In  [3]: np.sqrt(A)
<ipython-input-3-d44c5e97424e>:1: RuntimeWarning: invalid value encountered in sqrt
  np.sqrt(A)
Out[3]:
array([        nan,  0.        ,  1.        , ..., 31.57530681,
       31.591138  , 31.60696126])
```

Instead a warning is raised, and `-1.0` is mapped to `NaN`, a special floating point number representing an undefined
result; `NaN`s propagate sanely through most calculations [^3], making them useful in these situations.

What if we want to suppress the warning? Perhaps we're applying a ufunc within an inner loop and getting buried in
unhelpful warning output? NumPy provides an API for controlling [floating point error
handling](https://numpy.org/doc/stable/reference/routines.err.html) which is very helpful in such situations. Here's the
[np.errstate](https://numpy.org/doc/stable/reference/generated/numpy.errstate.html#numpy.errstate) context manager in
action:

```python
In  [1]: import numpy as np

In  [2]: A = np.arange(-1, 1000, dtype=float)

In  [3]: with np.errstate(invalid="ignore"):
    ...:     B = np.sqrt(A)
    ...:

In  [4]: B

Out [5]:
array([        nan,  0.        ,  1.        , ..., 31.57530681,
       31.591138  , 31.60696126]
```

or what if we genuinely want to raise if any kind of floating point error occurs? Maybe negative inputs imply a sensor
failure in a latency insensitive [^4] robot which will ping its handlers upon an exception and hibernate until it can be
physically recovered.

`np.errstate` has us covered there too.

```python
In  [1]: import numpy as np

In  [2]: A = np.arange(-1, 1000, dtype=float)

In  [3]: with np.errstate(all="raise"):
    ...:     B = np.sqrt(A)
    ...:
---------------------------------------------------------------------------
FloatingPointError                        Traceback (most recent call last)
Cell In[3], line 2
      1 with np.errstate(all="raise"):
----> 2     B = np.sqrt(A)

FloatingPointError: invalid value encountered in sqrt

```

## scipy.special

NumPy has over 60 [available ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html#available-ufuncs) for a range of
mathematical functions and operations, but more specialized functions useful in the sciences and engineering are out of
scope. `ufunc`s for many such functions can be found instead in
[`scipy.special`](https://docs.scipy.org/doc/scipy/reference/special.html) [^5].

Here is an example using the `ufunc` `special.gamma` for the [Gamma
function](https://en.wikipedia.org/wiki/Gamma_function), to reproduce a plot from the Wikipedia article [_Volume of an
n-ball_](https://en.wikipedia.org/wiki/Volume_of_an_n-ball). The plot shows how the volume of a solid multi-dimensional
sphere depends on the dimension `n` when the radius `R` is one of 0.9, 1.0, or 1.1.

```python
import matplotlib.pyplot as plt
import numpy as np
import scipy.special as special

N = np.arange(0, 26)  # dimension
R = np.array([0.9, 1.0, 1.1])  # radius
# meshgrid makes it convenient to evaluate formula over the grid N x R
N, R = np.meshgrid(N, R)

# Formula for volume of an n-ball in terms of radius R and dimension N.
V = np.pi**(N/2)/special.gamma(N/2 + 1) * R**N

fig, ax = plt.subplots(1, 1)
ax.scatter(N[0], V[0], color='cadetblue', alpha=0.6, label="$R = 0.9$")
ax.scatter(N[1], V[1], color='indianred', alpha=0.6, label="$R = 1.0$")
ax.scatter(N[2], V[2], color='darkseagreen', alpha=0.6, label="$R = 1.1$")
ax.set_xlim(0, 25)
ax.set_ylim(0, 10)
ax.set_xticks([5, 10, 15, 20, 25])
ax.set_yticks([2, 4, 6, 8, 10])
ax.grid()
ax.legend()
plt.show()
```

which outputs:

<p align="center">
  <img
    src="/posts/lib-sf-error-state/n_sphere_volume.png"
	alt="Plot showing how the volume of an n-ball depends on the
		dimension n for radius R = 0.9, 1.0, and 1.1"
   />
</p>

There are currently ufuncs for over 230 mathematical functions in `scipy.special`.

## scipy.special error handling

What if one of the `ufunc`s in `scipy.special` recieves an array with some invalid
elements?

```python
In  [1]: import numpy as np

In  [2]: import scipy.special as special

In  [3]: x = np.linspace(-4, 4, 5)

In  [4]: special.gamma(x)

Out [4]: array([nan, nan, inf,  1.,  6.])

In  [5]: with np.errstate(all="raise"):
    ...:     _ = special.gamma(x)
	...:

```

Just like for the `ufunc`s included in NumPy, by default invalid entries will be mapped to `NaN`, however no warning is
raised, and `np.errstate` has no impact on error handling. What's going on? Well, NumPy's `ufunc`s are provided in a C
[extension module](https://docs.python.org/3/extending/extending.html) that's bundled into NumPy. Within this extension
module, there's a library of compiled code and an interface for interacting with this code from Python. Some of compiled
code in the extension module manages the current state for error handling policies. The `ufunc`s in `scipy.special` are
bundled into a different extension module in SciPy. Typically, extension modules are like separate worlds, and one
cannot access another except through its Python interface. Instead, SciPy includes its own means of controlling error
handling, [scipy.special.errstate](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.errstate.html),
which mirrors `np.errstate`.

```python
In  [1]: import numpy as np

In  [2]: import scipy.special as special

In  [3]: x = np.linspace(-4, 4, 5)

In  [4]: with special.errstate(all="raise"):
    ...:     _ = special.gamma(x)
	...:
---------------------------------------------------------------------------
SpecialFunctionError                      Traceback (most recent call last)
Cell In[4], line 2
      1 with special.errstate(all="raise"):
----> 2     _ = special.gamma(x)

SpecialFunctionError: scipy.special/Gamma: singularity
```

But is there a way to _share_ state between extension modules without going through Python?
_(hint: the title of this article)._

## Some exciting developments

To create a `ufunc` for a mathematical function, one needs a scalar implementation of this function in a compiled
language that can be called from C. These scalar implementations are known as scalar kernels. Until recently,
`scipy.special` had scalar kernels written in all of C, C++, Fortran 77, and Cython. In August of 2023, Irwin Zaid (izaid)
at Christ Church College Oxford proposed rewriting all of the scalar kernels in header files which could be included in
both C++ and CUDA programs. This would allow these special functions to be used not just in SciPy, but also GPU-aware
array libraries like CuPy and PyTorch, improving special function support across array library backends. I was supported
by the 2020 NASA ROSES grant, _Reinforcing the Foundations of Scientific Python_ (with travel and compute costs covered
by the 2023 NumFocus SDG _Streamlined Special Function Development in SciPy_), to work together with Irwin to put this
plan in action. With additional help from SciPy maintainer Ilhan Polat (ilayn), who made a heroic effort to translate over
twenty thousand lines of Fortran scalar kernel code to C, and contributions from other volunteers, substantial progress
has been made, and we are in the process of splitting these headed into a separate library called
[xsf](https://github.com/scipy/xsf/). This is a story for another time. Until then, to learn more, see
[xsf/#1](https://github.com/scipy/xsf/issues/1).

While working on this project, it became apparent to everyone involves that the infrastructure used in SciPy for
creating `ufunc`s was greatly complicated by the need to work with scalar kernels from so many languages. Standardizing
on C++ offered a chance to simplify things considerably. Irwin found that existing infrastructure was not flexible
enough for work he had planned involving [Generalized universal
functions](https://numpy.org/doc/stable/reference/c-api/generalized-ufuncs.html), or `gufuncs` for short, so he wrote
new machinery from scratch. `ufunc`s and `gufunc`s created with the new machinery live in a separate extension module
from those created with the old machinery [^6]. What problem could this cause?

## Error handling redux

Just as before, when `ufunc`s are split across multiple extension modules, the error policy state can no longer be
easily shared between them. We noticed something was wrong due to a failure in the following doctest for
[special.seterr](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.seterr.html#scipy.special.seterr).

```
    Examples
    --------
    >>> import scipy.special as sc
    >>> from pytest import raises
    >>> sc.gammaln(0)
    inf
    >>> olderr = sc.seterr(singular='raise')
    >>> with raises(sc.SpecialFunctionError):
    ...     sc.gammaln(0)
    ...
    >>> _ = sc.seterr(**olderr)
```

`gammaln`, for the log of the absolute value of the Gamma function, was one of a handful of ufuncs moved to the new
extension module.

Both extension modules contained a separate copy of the state for managing error handling policies and
a Python interface for managing this state, but the user facing `special.seterr`, `special.errstate`, and
`special.geterr` in SciPy all came from the first extension module. We then saw two options:

1. Update `special.seterr`, `special.errstate`, `special.geterr` to access and update the state in each extension
   module, taking care that the state remains synchronized.

2. Extract the error handling state and primitives for managing it into a shared library that each extension
   module would be dependent on.

We chose to create a shared library because it seemed like the more principled option [^7].
As the saying goes: we do things not because they are easy, but because we thought they would be easy [^8].

## Static vs dynamic linking

Now for some background information. I'll try to make things self contained enough that the remainder of the article can
be followed by Python programmers without much or any experience working directly with compiled code. Let's review the
structure of C programs. Below I've annotated the classic hello world program [^9]. Every C program must have a single
function `main` where execution begins.

### hello_world.c

<section style={{ backgroundColor: '#eaeae1', padding: '10px' }}>

First, an include directive tells the C preprocessor to insert the contents of the standard library
header file "stdio.h" so we can use the function `printf` below.

```c
#include <stdio.h>
```

The signature `int main(void)` says that function `main` takes no arguments and returns an `int` [^10].

```c
int main(void) {
```

Use the function standard library function `printf` from to output `"Hello World!"` to the terminal.

```c
    printf("Hello World!\n");
```

Return status code zero signaling successful execution.

```c
	return 0;
}
```

</section>

For C programs with multiple files, each file is compiled separately into an object file of machine instructions which
give explicit commands directly to the CPU [^9]. A program called a linker is responsible for combining the generated
object files into a single program. A library is a collection of code containing functions and datatypes which can be
used in programs. There are two ways library code can be linked into a program. The simplest way is _static linking_,
where the library code is bundled directly into the program. Two programs [^10] statically linked with the same library
will each have their own separate copy of the library. Special function error handling broke because the code
responsible for it was statically linked into each separate extension module. By contrast, when library code is
dynamically linked, it is not included in the executable binary file for the program at compile time. It instead lives
in a separate binary file, called a shared library, which can be loaded into the program at runtime.

In addition to executable machine instructions, each object file contains a _symbol table_ mapping each identifier used
in the original source file (e.g. a function name) to either the position in the executable code where the identifier is
defined (e.g. the function's definition) or a placeholder if there's no definition in the source file. When combining
object files into a single program through static linking, the linker fills these placeholders by searching the symbol
tables of the other object files being linked into the program.

Object files from a statically linked library are treated no differently from object files generated from the program's
source code. For dynamic linking, at compile time, the linker only checks the shared library's symbol table for entries
that could fill placeholders, but does not link the shared library into the program. Shared libraries are instead loaded
by programs at runtime. Function names, variable names, and other identifiers a shared library makes available to
programs are referred to as symbols exported by the library.

Some benefits of shared libraries are that:

- Separate programs can load and use the same library, rather than having separate copies bundled into each program,
  reducing code duplication.
- Updates can be made to a shared library without requiring dependent programs to be recompiled, so long as the library's
  interface doesn't change.

For these reasons, the C standard library mentioned above is almost always linked dynamically.

There are tradeoffs. A small amount of overhead may be added to function calls, since the process of function
lookups is more involved, and the need to locate and load the shared libray into memory at runtime can incur a fixed
amount of startup overhead.

## Sharing global state

Shared libraries cannot share global state between programs running in separate processes; each process has its own
separate address space of memory it can access, and interprocess communication requires special protocols. Nevertheless,
a shared library _can_ be used to share global state between separate Python extension modules that were dynamically
loaded by a Python interpreter running in the same process, since only a single copy of the library is loaded into
memory. This is the means we chose for sharing special function error handling state between extension modules.

Note that the title of this article isn't entirely accurate. A Python extension module is itself a shared library which
is loaded by the Python interpreter at runtime. Thus SciPy actually ships many shared libaries and has done so from its
earliest days. What we mean is the first regular shared library that's not a Python extension module.

## lib_sf_error_state

Let's take a look at the contents of this shared library.

We extracted out the global variable containing error handling state and functions to work with it into an
implementation file `sf_error_state.c` with corresponding header file `sf_error_state.h` [^11].

Let's look at the header first. The header defines the interface for the code living in its companion file, including
definitions of datatypes which should be available outside the companion file.

### sf_error_state.h

<section style={{ backgroundColor: '#eaeae1', padding: '10px' }}>

```c
#pragma once
```

The `#pragma once` directive guards against the possibility of the header accidentally
being included multiple times in the same implementation (e.g. some file includes both
sf_error_state.h and another header file which also includes sf_error_state.h).

```c
#include "xsf/error.h"
```

The header file `"xsf/error.h"` is included to get the definition for the type `sf_error_t`.

`sf_error_t` is an `enum`.

```c
typedef enum {
    SF_ERROR_OK = 0,    /* no error */
    SF_ERROR_SINGULAR,  /* singularity encountered */
    SF_ERROR_UNDERFLOW, /* floating point underflow */
    SF_ERROR_OVERFLOW,  /* floating point overflow */
    SF_ERROR_SLOW,      /* too many iterations required */
    SF_ERROR_LOSS,      /* loss of precision */
    SF_ERROR_NO_RESULT, /* no result obtained */
    SF_ERROR_DOMAIN,    /* out of domain */
    SF_ERROR_ARG,       /* invalid input parameter */
    SF_ERROR_OTHER,     /* unclassified error */
    SF_ERROR__LAST
} sf_error_t;
```

It defines a mapping between human readable special function error code variable names to integers.
The integers are arranged in increasing order, so `SF_ERROR_OK = 0`, `SF_ERROR_SINGULAR = 1` and so
on. By writing `#include "xsf/error.h"`, it's as if we included this `enum` definition directly in
`sf_error_state.h`.

The following block uses what is known as conditional compilation. In this case we're letting C++ compilers know that
the code within the `extern "C"` block should be linked as C code [^10]. This allows the functions in the block to
be called in C and C++ code.

```c
#ifdef __cplusplus
extern "C" {
#endif
```

Another `enum`, `sf_action_t`, gives human readable names for integer codes representing the different error handling
policies.

```c
    typedef enum {
        SF_ERROR_IGNORE = 0,  /* Ignore errors */
        SF_ERROR_WARN,        /* Warn on errors */
        SF_ERROR_RAISE        /* Raise on errors */
    } sf_action_t;
```

There are then two _declarations_. Again, each file is compiled in isolation and it is only after the files are compiled
that the linker stitches the generated object files into a program. Still, functions from other files can still be
called even though the compiler is not aware of their definitions when compiling a particular file. The compiler only
needs to know the type signature of an external functio and this is communicated to the compiler through a declaration.
Header files can be used to provide a single source of truth [^11] for declarations. In the Hello World example from
earlier, the header file `stdio.h` was included to insert the declaration for the `printf` function.

```c
    void scipy_sf_error_set_action(sf_error_t code, sf_action_t action);

    sf_action_t scipy_sf_error_get_action(sf_error_t code);

#ifdef __cplusplus
}
#endif
```

</section>

Just from the declarations, you may have correctly guessed that the function `scipy_sf_error_set_action` is used to
update and `scipy_sf_error_get_action` is used to query for the error handling policy associated to a given special
function error type. If a user runs the following in an IPython session

```python
In  [1]: import scipy.special as special

In  [2]: special.seterr(loss="warn")
```

then somewhere down in the stack, there will be a call

```c
scipy_sf_error_set_action(SF_ERROR_LOSS, SF_ERROR_WARN)
```

that updates the error state. Using the terminology from earlier, `scipy_sf_error_set_action` and `scipy_sf_error_get_action`
are the two symbols exported by this shared library.

Now let's turn to the corresponding `.c` file. This is where the function definitions for these two symbols live.

### sf_error_state.c

<section style={{ backgroundColor: '#f5f5f0', padding: '10px' }}>

First, we include the `sf_error_state.h` header file. This provides access to definitions of the `sf_action_t` and `sf_error_t`
`enum` types.

```c
#include "sf_error_state.h"
```

The we define an array named `sf_error_actions` for storing the current special function error handling policy for each
error type.

```c
/* If this isn't volatile clang tries to optimize it away */
static volatile sf_action_t sf_error_actions[] = {
    SF_ERROR_IGNORE, /* SF_ERROR_OK */
    SF_ERROR_IGNORE, /* SF_ERROR_SINGULAR */
    SF_ERROR_IGNORE, /* SF_ERROR_UNDERFLOW */
    SF_ERROR_IGNORE, /* SF_ERROR_OVERFLOW */
    SF_ERROR_IGNORE, /* SF_ERROR_SLOW */
    SF_ERROR_IGNORE, /* SF_ERROR_LOSS */
    SF_ERROR_IGNORE, /* SF_ERROR_NO_RESULT */
    SF_ERROR_IGNORE, /* SF_ERROR_DOMAIN */
    SF_ERROR_IGNORE, /* SF_ERROR_ARG */
    SF_ERROR_IGNORE, /* SF_ERROR_OTHER */
    SF_ERROR_IGNORE  /* SF_ERROR__LAST */
};
```

1. `sf_action_t` is the value type of the array. Entries contain error policy codes with the default being `SF_ERROR_IGNORE`.

2. Indices into the array correspond to special function error types from the `sf_error_t` `enum`. The array
   stores the error handling policy for each error type, with comments making it clear which is which.

3. The `static` keyword makes this use of the identifier `sf_error_actions` local to only this file.
   `sf_error_actions` can only be modified and accessed through `scipy_sf_error_set_action` and
   `scipy_sf_error_get_action` respectively, encapsulating the state in the array.

4. The `volatile` keyword informs the compiler that a variable's value may change unexpectedly without the programs
   knowledge. I'm not sure exactly what was going on or why, but it appears some version of the `clang` compiler may
   have been replacing all accesses to `sf_error_actions` with the constant `SF_ERROR_IGNORE` under the assumption that
   `sf_error_actions` would not be modified. Compilers are free to change code to make it more efficient if they believe
   the observed behavior will remain the same.

Finally we have the definitions of `scipy_sf_error_set_action` and `scipy_sf_error_get_action`.`(int)code` is a cast
which converts an `sf_error_t` `enum` value to the corresponding `int` so that it can be used as an index into the array.

```c
void scipy_sf_error_set_action(sf_error_t code, sf_action_t action)
{
    sf_error_actions[(int)code] = action;
}

sf_action_t scipy_sf_error_get_action(sf_error_t code)
{
    return sf_error_actions[(int)code];
}
```

</section>

## Shipping it

`lib_sf_error_state`'s contents are fairly simple, but how _does_ one ship a shared library as part of a Python package
like SciPy? The process of creating and using shared libraries varies based on operating system and compiler toolchain.
Since SciPy aims to support a wide range of platforms in aid of its goal to democratize access to scientific computing
tools, things were not as straightforward as we expected. Several times, just as we thought everything was finally
working, another quirk would pop up that needed to be addressed.

SciPy is a Python package, but contains a large amount of compiled code in several different languages.

Getting this to work on Linux and Mac OS wasn't too bad. We just had to find the right invocations to give
the [Meson build system](https://labs.quansight.org/blog/2021/07/moving-scipy-to-meson) used by SciPy.
Looking at the [meson.build](https://github.com/steppi/scipy/blob/57de94e36602dda9efafa054ecc6f03308d76341/scipy/special/meson.build)

The [shared_library](https://mesonbuild.com/Reference-manual_functions.html#shared_library)

```meson
sf_error_state_lib = shared_library('sf_error_state',
  ['sf_error_state.c'],
  include_directories: ['../_lib', '../_build_utils/src'],
  cpp_args: ['-DSP_SPECFUN_ERROR'],
  install: true,
  install_dir: py3.get_install_dir() / 'scipy/special',
)
```

[^1]: footnote 1
[^2]: footnote 2
[^3]: footnote 3
[^4]: footnote 4
[^5]: footnote 5
[^6]: footnote 6
[^7]: footnote 7
[^8]: footnote 8
[^9]: https://godbolt.org/z/rqv5Y7489
[^10]: footnote 10
[^11]:
    The code in `sf_error_state.c` and `sf_error_state.h` was originally written by SciPy maintainer Josh Wilson
    (person142) who first implemented the error handling context manager for `scipy.special` in the PR
    [scipy/gh-6753](https://github.com/scipy/scipy/pull/6753) in response to the issue
    [scipy/gh-6681](https://github.com/scipy/scipy/issues/6681).
