---
title: >
  lib_sf_error_state – The story of SciPy's first shared library
published: December 4, 2024
authors: [albert-steppi]
description: 'lorem ipsum'
category: [PyData ecosystem]
featuredImage:
  src: /posts/lib-sf-error-state/featured.png
  alt: >
    The text "SciPy" along with the SciPy logo superimposed over an elaborate computer generated image of a circuitboard in the style of Francisco Goya, intended to evoke a sense of great complexity beneath a simple surface.
hero:
  imageSrc: /posts/lib-sf-error-state/hero.png
  imageAlt: 'The text "SciPy" along with the SciPy logo superimposed over an elaborate computer generated image of a circuitboard in the style of Francisco Goya, intended to evoke a sense of great complexity beneath a simple surface.'
---

### Intro to scipy.special

[`scipy.special`](https://docs.scipy.org/doc/scipy/reference/special.html) offers
implementations of a wide collection of [special
functions](https://en.wikipedia.org/wiki/Special_functions). Though not a
precise term, a loose definition of a special function is a mathematical
function which cannot be expressed in terms of well known [elementary
functions](https://en.wikipedia.org/wiki/Elementary_function) (think
polynomials,`log`, `exp`, `sin`, etc.), but which arises in applications
frequently enough that it is worthy of its own name.

Most of the functions in `scipy.special` are NumPy [Universal
functions](https://numpy.org/doc/stable/reference/ufuncs.html) - ufuncs for
short. A ufunc operates on NumPy
[`ndarrays`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html#numpy.ndarray),
looping over the elements and evaluating a function in efficient native code [^1], avoiding Python
function call overhead.

Here is an example using the [Gamma
function](https://en.wikipedia.org/wiki/Gamma_function), a continuous extension
of the factorial, to reproduce a plot from the Wikipedia article [_Volume of an
n-ball_](https://en.wikipedia.org/wiki/Volume_of_an_n-ball). The plot shows how
the volume of a solid multi-dimensional sphere depends on the dimension `n` when
the radius `R` is one of 0.9, 1.0, or 1.1.

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

which outputs

<p align="center">
  <img
    src="/posts/lib-sf-error-state/n_sphere_volume.png"
	alt="Plot showing how the volume of an n-ball depends on the
		dimension n for radius R = 0.9, 1.0, and 1.1"
   />
</p>

Beyond the performance benefit from getting to loop and evaluate over arrays in
low level native code, ufuncs also let us write more readable Python code
by allowing us to work directly with arrays without having to write our own loops.

### Error handling for ufuncs

Having ufuncs which operate over entire arrays poses a question. What should
be done if errors occur for some of the scalar function evaluations performed
when looping over the input arrays? The scalar function `gamma`
in the [`math`](https://docs.python.org/3/library/math.html) module from the
Python standard library raises an exception when the input is a non-positive
integer, since these points, known as poles, are outside the domain of the Gamma
function

```
In [1]: import math

In [2]: math.gamma(-2)
---------------------------------------------------------------------------
ValueError                                Traceback (most recent call last)
Cell In[2], line 1
----> 1 math.gamma(-2)

ValueError: math domain error
```

But consider the example below where we evaluate the Gamma function over many
points to produce a graph. Would it make sense to raise an exception because
5 of the 5,000,001 inputs are outside of the domain?

```python
import matplotlib.pyplot as plt
import numpy as np
import scipy.special as special

x = np.linspace(-5, 5, 5000001)
y = special.gamma(x)

fig, ax = plt.subplots(1, 1)
ax.plot(x, y, color="blue")
ax.set_xlim(-5, 5)
ax.set_ylim(-5, 5)
ax.minorticks_on()
ax.grid(which="major", linestyle="-", linewidth="0.75", color="black")
ax.grid(which="minor", linestyle=":", linewidth="0.5", color="gray")
plt.show()
```

If we run it, we see that it produces the correct result without issue

<p align="center">
  <img
    src="/posts/lib-sf-error-state/gamma_function_plot.png"
	alt="Plot of the Gamma function for x in the interval from -5 to  5."
   />
</p>

The errors were ignored. There may be situations where one
actually cares about errors though, therefore `scipy.special`
provides [`seterr`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.seterr.html#scipy.special.seterr), [`geterr`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.geterr.html#scipy.special.geterr) and
[`errstate`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.errstate.html#scipy.special.errstate) for controlling how
special-function errors are handled. These tools mirror those used in
NumPy for controlling [floating point error handling](https://numpy.org/devdocs/reference/routines.err.html). By default, all special-function errors are ignored.
Below we use the `special.seterr` context manager to raise warnings instead,
observing 5 warnings corresponding to the 5 poles of the Gamma function within the
array `x`.

```
In [1]: import numpy as np

In [2]: import scipy.special as special

In [3]: x = np.linspace(-5, 5, 5000001)

In [4]: with special.errstate(all="warn"):
   ...:     y = special.gamma(x)
   ...:
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
```

### Error handling internals

Let's take a moment to look into how this error handling works.
Every ufunc is based on a _scalar kernel_ written in a compiled language.
In most cases, a scalar kernel is a function which takes either a scalar
floating point or integer value for each of its inputs and returns a
single scalar. Historically, `scipy.special` featured scalar kernels written
in C, C++, Fortran, and Cython, mostly taken from existing permissively licensed
special function implementations, with some custom implementations written
by SciPy's maintainers and contributors to fill in gaps.

The scalar kernel for `special.gamma` was, until recently, written in C with
signature

```c
double Gamma(double x)
```

taking one double precision floating point value and returning another. A
C function, `sf_error`, is used for error handling. Below is an example where
`sf_error` is used at poles of the Gamma function to signal an overflow.
The three arguments are the name of the function, an error code, and an
optional message (`NULL` here specifies that no message is supplied.)[^2]

```c
    q = fabs(x);

    if (q > 33.0) {
	    if (x < 0.0) {
	        p = floor(q);
	        if (p == q) {
	    gamnan:
		        sf_error("Gamma", SF_ERROR_OVERFLOW, NULL);
		        return (INFINITY);
```

Internally, `sf_error` consults a global array, `sf_error_actions`, which
is initialized as

```C
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

Each entry of the array corresponds to a different special function error code,
and we see that by default, all errors are ignored.

When `special.seterr` is called from within Python, a C function
`scipy_sf_error_set_action` is used to update the `sf_error_actions` array. When
`sf_error` is called within a scalar kernel with a particular error code,
it checks the `sf_error_actions` array for the desired behavior, and either
ignores, warns, or raises depending on what it finds.

### Some recent developments in scipy.special

This system worked smoothly for over 20 years until recent developments
unearthed a limitation. We mentioned that historically, the scalar kernels
for ufuncs in `scipy.special` were written in C, C++, Fortran, and Cython.
This is changing. In 2023,
Dr. Irwin Zaid ([@izaid](https://github.com/izaid)) of Christ Church College, Oxford reached out to some of
SciPy's maintainers and proposed a plan to write special function scalar kernels
in C++ headers in such a way that they could be used either on CPU or on NVIDIA
GPU's with CUDA [^3]. This would make it possible to use SciPy's implementations
in other array libraries such as [CuPy](https://cupy.dev/) and
[PyTorch](https://pytorch.org/), improving special function availability
in libraries seeking to conform to the
[Python Array API standard](https://data-apis.org/array-api/latest/) and
opening up the possibility for a
[special function array API extension](https://github.com/data-apis/array-api/issues/725). This proposal was enthusiastically accepted and a great effort t
o translate all of `scipy.special` into such C++ began.

Now the ufuncs in `scipy.special` are defined in what is known as a
[C extension module](https://docs.python.org/3/extending/extending.html). One
of the great strength's of the [CPython](https://github.com/python/cpython)
interpreter is that it offers a powerful [C API](https://docs.python.org/3/c-api/index.html) that makes it straightforward to extend Python with efficient native
code [^4].

The need for supporting scalar kernels written in each of C, C++, Cython, and
Fortran lead to a somewhat convoluted design for `scipy.special`'s `_ufuncs`
extension module, which is created through a
[sophisticated code generation process](https://github.com/scipy/scipy/blob/main/scipy/special/_generate_pyx.py) that few understand completely. Having all scalar
kernels written in C or C++ allows for simplifying `scipy.special`'s ufunc
infrastructure, a possibility which was
[first suggested](https://github.com/scipy/scipy/issues/19964)
by SciPy maintainer Ilhan Polat ([@ilayn](https://github.com/ilayn)),
who helped translate _all_ of the Fortran scalar kernels in `scipy.special`
into C [^5]. [@izaid](https://github.com/izaid) eventually followed up with
a pull request, [scipy/#20260](https://github.com/scipy/scipy/pull/20260),
offering a streamlined means of defining the ufuncs in `scipy.special` which
works for scalar kernels written in C and C++.

### A problem with error handling

Since not all scalar kernels
are translated and ready to use with the new infrastructure, the ufuncs
in `scipy.special` have become split between two different extension modules, one
using the old infrastructure and the other the new infrastructure. There were
challenges getting this to work correctly. When the ufuncs were first split
between separate extension modules, a lone doctest began to fail:

```
    >>> import scipy.special as sc
    >>> from pytest import raises
    >>> sc.gammaln(0)
    inf
    >>> olderr = sc.seterr(singular='raise')
    >>> with raises(sc.SpecialFunctionError):
    ...     sc.gammaln(0)
    ...
```

After the call to `seterr` , the call to `gammaln(0)` should raise
an exception because
0 is a pole of the Gamma function [^6] but the doctest was failing because
no exception was raised. What changed is that `gammaln` had been moved to
the new extension module using the new ufunc definition infrastructure.

Recall that error handling behavior is
encoded in a global array `sf_error_actions`; this was, until recently, defined in
the C file, `sf_error.c`. An extension module can be built up from multiple C
source files which are compiled and linked together into a library which can
be called from the Python interpreter. When the ufuncs were first split between
two extension modules, each had a separate copy of `sf_error.c` compiled into it.
This means that each had a separate copy of the array `sf_error_actions` and
updates to one were not reflected in the other. The Python function `seterr` and
the context manager `errstate` are defined in the old ufuncs
extension module, and therefore could only modify the `sf_error_actions` array
for the old extension module. Error handling thus couldn't be controlled for
ufuncs defined in the new extension module.

[@izaid](https://github.com/izaid) suggested we fix
this by making an `sf_error` [shared library](https://en.wikipedia.org/wiki/Shared_library)
which is shared between the two extension modules [^7], [^8].
A shared library contains executable code which can be loaded into different programs at runtime,
as opposed to a [static library](https://en.wikipedia.org/wiki/Static_library)
with code which is directly linked into other programs at compile time. @izaid and I
initially thought this would be straightforward [^9].

### The challenges of shipping a cross platform shared library

At least for Linux and Mac OS, it was fairly straightforward to get the shared library
working. The shared library contains only a single source file `sf_error_state.c`
which defines the global `sf_error_actions` array and provides two functions,
`scipy_sf_error_set_action` and `scipy_sf_error_get_action` for modifying and
inspecting this array respectively. This entire file is reproduced below.

```C
#include <stdlib.h>

#include "sf_error_state.h"


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


void scipy_sf_error_set_action(sf_error_t code, sf_action_t action)
{
    sf_error_actions[(int)code] = action;
}


sf_action_t scipy_sf_error_get_action(sf_error_t code)
{
    return sf_error_actions[(int)code];
}
```

In recent years, SciPy has moved to using the
[Meson build system](https://mesonbuild.com/) [^10]. Setting up
the shared library in `scipy.special`'s
[meson.build](https://github.com/scipy/scipy/blob/main/scipy/special/meson.build) file
is fairly straightforward.

```
sf_error_state_lib = shared_library('sf_error_state',
  ['sf_error_state.c'],
  include_directories: ['../_lib', '../_build_utils/src'],
  cpp_args: ['-DSP_SPECFUN_ERROR'],
  install: true,
  install_dir: py3.get_install_dir() / 'scipy/special',
)
```

In the meson syntax for creating an extension module, one specifies that
one wants to link with the `sf_error_state_lib`. It's also required to
specify that `install_rpath` is `$ORIGIN`. This instructs meson to look
for shared library object files in the same folder where this `meson.build`
file is located. Here is how the extension module for ufuncs using the new
infrastructure is defined.

```
py3.extension_module('_special_ufuncs',
  ['_special_ufuncs.cpp', '_special_ufuncs_docs.cpp', 'sf_error.cc'],
  include_directories: ['../_lib', '../_build_utils/src'],
  cpp_args: ['-DSP_SPECFUN_ERROR'],
  dependencies: [np_dep],
  link_with: [sf_error_state_lib],
  link_args: version_link_args,
  install: true,
  subdir: 'scipy/special',
  install_rpath: '$ORIGIN'
)
```

[^1]:
    A program known as a compiler converts code written
    in a higher level language like C or Fortran to instructions which
    tell the processor specifically what to do in concrete detail. Such instructions
    are referred to as machine code or native code.

[^2]:
    One can also see here one of the oldest still living "bugs" in SciPy. In
    the plot of the Gamma function in this article, one can see that `gamma(x)`
    tends to either +∞ or -∞ depending on the direction in which it approaches a
    non-positive integer. Rather than returning `INFINITY` for positive infinity, it
    would make more sense to return `NAN` to specify an indeterminate result.

[^3]:
    See [scipy/#19404](https://github.com/scipy/scipy/issues/19404) for the
    start of the discussion,
    [scipy/#19601](https://github.com/scipy/scipy/pull/19601) for the first instance
    of a special function scalar kernel in SciPy that can work on both CPU and GPU,
    and [cupy/#8140](https://github.com/cupy/cupy/pull/8140) for the first special
    function added to CuPy following [@izaid](https://github.com/izaid)'s plan.

[^4]:
    This enables what is known as the "compiled core, interpreted shell"
    design philosophy, where performance critical components are written in
    efficient low level code and intuitive interfaces are provided in a user
    friendly high level language. This "two language solution" is what allows Python
    to be so effective in fields like scientific computing and data science despite
    the performance drawbacks of pure Python.

[^5]:
    Nearly 20,000 lines of code within 101 files between the
    [amos](https://github.com/scipy/scipy/pull/19587),
    [cdflib](https://github.com/scipy/scipy/pull/19560), and
    [specfun](https://github.com/scipy/scipy/pull/19824) libraries.

[^6]:
    `gammaln` computes the natural logarithm of the absolute value of the
    Gamma function.

[^7] https://github.com/scipy/scipy/pull/20316

[^8]:
    Another potential solution would be to have separate private
    `_seterr` functions defined in each of the extension
    modules, each working with the `sf_error_actions` array from its extension
    module. The public `seterr` and `errstate`, could then be written
    in Python and use the private extension module specific `_seterr`s to control
    error handling, taking care to ensure that the multiple copies of
    `sf_error_actions` remain consistent.

[^9]:
    From experience, SciPy steering council chair and Quansight Labs co-director
    Ralf Gommers knew it would be difficult to get this working on Windows
    https://github.com/scipy/scipy/pull/20316#issuecomment-2016533133

[^10]: See https://labs.quansight.org/blog/2021/07/moving-scipy-to-meson
