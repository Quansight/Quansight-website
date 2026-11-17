---
title: 'Large scale linear algebra'
published: November 17, 2026
authors: [evgeni-burovski]
description: 'Linear algebra for extra-large problem sizes.'
category: [PyData ecosystem, Numerical Computing]
featuredImage:
  src: /posts/large-scale-linear-algebra/ilp64-lapack-style.png
  alt: "a 5x5 matrix filled with ILP64 letters"
hero:
  imageSrc: /posts/large-scale-linear-algebra/ilp64-lapack-style.png
  imageAlt: "a 5x5 matrix filled with ILP64 letters"
---


Linear algebra underpins numerical computations. Problems in a wide variety of domains,
from data analysis to quantum computation, rely on solving linear algebra problems.
The sizes of problems encountered in real-world applications continue growing, and the
standard numerical Python stack, based on NumPy and SciPy,
faces has an unexpected limitation on the problem size.

# Large-scale linear algebra in SciPy

Consider an illustrative example. Let's compute the norm of a unit vector (which must
equal one because it's a unit vector): 

```python
>>> import numpy as np
>>> from scipy import linalg

>>> ndim = 2**31 - 1
>>> x = np.zeros(ndim)
>>> x[-1] = 1.0

>>> linalg.norm(x)
1.0    # as expected

>>> ndim = 2**31
>>> x = np.zeros(ndim)
>>> x[-1] = 1.0
>>> linalg.norm(x)
0.0    # oh no, this is wrong!
```

So `scipy` starts giving wrong answers once the size of the array exceeds some threshold,
and, moreover, this threshold is $2^{31}$, which is a maximum value of a 32-bit C integer
type. This is a smoking gun sign of an integer overflow somewhere in the scipy internals.
What's going on here?


# BlAS and LAPACK

Linear algebra operations use two low-level libraries called BLAS (short for "Basic Linear Algebra Subpackage") and LAPACK ("Linear Algebra Package"). 
In fact, each of these is not a single library, but rather an interface specification which
multiple low-level implementations of linear algebra primitives follow. The most commonly
used implementations are OpenBLAS, MKL (fine-tuned for Intel hardware) and Accelerate
(fine-tuned for the Apple hardware), to name a few.

A user-facing Python library like SciPy is linked to one of these LAPACK provider
libraries and delegates linear algebra computations (`linalg.norm` above) to
LAPACK. [BLAS/LAPACK packaging article](https://labs.quansight.org/blog/blas-lapack-packaging)
gives an overview of a recent effort that went into packaging different LAPACK providers
so that they are usable for user-facing Python libraries.

The relevant feature of BLAS and LAPACK functions is that their integer arguments (for example, array sizes) are by default 32-bit. This is exactly the underlying source of the error we saw above.

Why are 32-bit integers used in BLAS and LAPACK? This is an artifact of history: when these interfaces were being developed (well in the 1980s or even 1970s), $2^{31}$ elements was a safely generous upper limit for anything of practical value. Who would need to operate with vectors of $2^{31}$ elements or square matrices exceeding the linear size of $\sqrt{2^{31}} \approx 46340$? You would need 16Gb of memory to just store this large object! The limitation was safe at the time, but nowadays matrices of this size do appear in multiple applications, from data science to quantum computing.


# LP64 vs ILP64 BLAS and LAPACK specifications

To overcome the 32-bit integer width limit, all you need to do is to use 64-bit integers instead (and $2^{63}$ should be enough for everybody, right?).
This way, BLAS and LAPACK specifications come in two flavors depending on the integer bit width (the formal name for these "flavors" is ABI=application binary interface).
Confusingly, the "classic", 32-bit integer variant is known as `LP64`, and the 64-bit integer variant is referred to as `ILP64`.

So, we just link Python libraries to the `ILP64` flavored LAPACK and problem is solved, right? Almost---the "just" part presents several technical difficulties to overcome. The ABI difference of LP64 vs ILP64 is at the C level. Getting somewhat deeper into the weeds, in the `linalg.norm` example above, eventully the work is done by the low-level function with one of two signatures [^1]

```c
double dnrm2_(int *n, double *x, int *incx);   # LP64 variant
double dnrm2_64_(int64_t *n, double *x, int64_t *incx);  # ILP64 variant
```

Here the `x` argument is the pointer to the array data, `n` is the array size, and `incx` is the stride (which equals one for a contiguous array).

[^1] The naming of BLAS/LAPACK functions reflects their origins from 1970s. The first letter "d" in `dnrm2` means "double precision"; its single-precision version is called `snrm2`; the **sy**mmetric **m**atrix **m**ultiply routine is called `dsymm`, the **ge**neral matrix multiply is `dgemm`, the complex eigenvalue solver is `zgeev`, you get the idea. The trailing underscore may or may not be there, and is a remnant of the Fortran ancestry of BLAS and L

The difference between LP64 and ILP64 variants is twofold. First, the integer arguments are 32-bit `int`s in the LP64 variant, and `int64_t` in the ILP64 variant; this difference is the same for all LAPACK libraries. Second---and this is a messy part---the names of the functions *may* differ. Adding suffixes to distinguish LP64 and ILP64 variants is not standard, and different LAPACK providers use different naming strategies (renaming functions is typically referred to as _name mangling_): some use the same name for both variants, some add a `64_` suffix, and Apple Accelerate even uses `$NEWLAPACK` and `$NEWLAPACK$ILP64` suffixes. Moreover, different LAPACKs package the functions differently: some may provide a single dynamic library with two sets of symbols, while others package two separate dynamic libraries (which may also export either mangled or unmangled symbols). The [BLAS/LAPACK packaging](https://labs.quansight.org/blog/blas-lapack-packaging) article gives an overview from the packaging perspective, and describes ways to manage this complexity in the low-level code.

A user-facing Python library which links to a LAPACK provider needs to ensure it internally uses correct calling conventions. Mismatches between 32-bit and 64-bit integer ABIs lead to all sorts of problems: wrong answers as in the `linalg.norm` example above, crashes or silent data corruption (e.g. imagine caller library that provides a buffer of `N` 32-bit integers to the LAPACK library, and the latter fills a twice larger buffer of `N` 64-bit integers).


# Symbol clashes: The importance of name mangling

Mangling LAPACK names, `dgemm_` vs `dgemm_64_`, may sound as a minor implementation detail, but is however quite important and the state of the LAPACK packaging ecosystem makes common numeric stacks brittle in presense of ILP64 libraries. The key problem is the ABI of an unmangled symbol, `dgemm_`? Since this is a C object, there is no runtime introspection. The ABI is in the hands of the packager, and is completely out of control of a Python user.
In the real world,
[different LAPACK providers make different decisions](https://labs.quansight.org/blog/blas-lapack-packaging): some OpenBLAS builds only provide ILP64 symbols with no name mangling, and so does some Intel MKL variants. 

The problem is exarberated by the way the Python runtime interacts with dynamic libraries: it loads them into the same OS process.

To illustrate the problem, consider two Python packages, `A` and `B`. Suppose that `A`
defines a function, `foo_A`, which internally solves a system of linear equations.
To solve it, it invokes a LAPACK function `dgesv_` from the LAPACK library it links to, `lapack_A.so`. When user code imports `A`, python runtime loads the `lapack_A.so` library, and calling `foo_A` resolves to invoking `dgesv_` from `lapack_A` and all works as expected.

Suppose further that the user now imports a different package, `B`, which links to a different LAPACK library `lapack_B.so` [^2]. Importing `B` makes the runtime load the
`lapack_B.so` dynamic library.

Now, depending on the order of imports of `A` and `B`, a function `foo_A` finds the `dgesv_` symbol from either `lapack_A.so` or `lapack_B.so`. If the two LAPACK libraries have different ABIs, calling `foo_A` may either work fine or crash depending on the import order of `A` and `B` in the user program.
Note that what crashes is a python function from package `A`, and the real cause of the problem is an unrelated package `B`.

[^2] Having two load two different LAPACK libraries is not hypothetical. For example, NumPy wheels from PyPI link to `scipy-openblas64`, and official PyTorch wheels link to MKL.

These kinds of problems are very hard to debug, and are even harder to work around at the user level. 
The most robust way to avoid name clashes is to make sure that the whole stack of Python packages conistently uses properly mangled ILP64 symbols. In practice, the might require building the whole stack yourself, and making sure that all C extensions of all Python packages only link to the same ILP64-enabled LAPACK library.


# ILP64 support in SciPy and beyond

As of version 1.18, SciPy supports three build options:
- ILP64 only
- LP64 only (this is backwards compatible)
- ILP64 internally + LP64 `cython_lapack` ABI (see below for details)

Previous SciPy versions also supported a "dual" build option, where the SciPy wheel
carried two LAPACK libraries, one for each ABIs variant. This option is prone to causing
name clashes in downstream packages, and is no longer supported.

The default SciPy wheel that you get from PyPI uses the LP64 ABI and is backwards compatible.
Using ILP64 requires an opt-in during the from-source build.

Here's an example, using MKL as the LAPACK provider. First, install MKL---you can
use `pip`, `conda` or Intel OneAPI installers.
Now that you have MKL, install [the SciPy build dependencies](https://scipy.github.io/devdocs/dev/building/index.html)
(omit `openblas` since we are using MKL instead), and build SciPy itself:


```sh
$ python -m build -Csetup-args="-Duse-ilp64=true" -Csetup-args="-Dblas=mkl-dynamic-ilp64-seq" -wnx
```

Note the setup arguments: first, the key argument is `-Duse-ilp64=true` argument to specify the ILP64 build mode,
and the additional MKL-specific ingredient is `-Dblas=<pkg-config-name>`. Here we use the ILP64 MKL variant with no threading layer,
`mkl-dymamic-ilp64-seq`, and the value of the `-Dblas=` argument is the name of the `pkg-config` file for the
chosen MKL variant (if you are using `conda`, look into the `<CONDA_ENV_PATH/lib/pkg-config>` directory). If `pkg-config` files are not found automatically, set the `PKG_CONFIG_PATH` environment variable.

If you are on MacOS and want to use the Apple Accelerate library, the stanza is

```sh
$ python -m build -Csetup-args="-Duse-ilp64=true" -Csetup-args="-Dblas=accelerate" -Csetup-args=-Dblas-symbol-suffix='$NEWLAPACK$ILP64' -wnx
```

After the build succeeds, install the wheel you just built via `$ pip install dist/<TAB>`.

## How to check if the SciPy build uses ILP64 ABI

<a name="show-config"></a>

The build configuration is available from the `show_config` function. Look for the
`"has ilp64"` entry in its output:

```python
>>> from scipy import show_config
>>> show_config()
Build Dependencies:
  blas:
    cython blas ilp64: true
    detection method: extraframeworks
    found: true
    has ilp64: true
    name: Accelerate

... snip ...
```

Alternatively, the ABI information is available from the low-level `linalg.blas` and
`linalg.lapack` submodules: 

```python
>>> from scipy import linalg
>>> linalg.blas.HAS_LP64
False
>>> linalg.blas.HAS_ILP64
True
```

The output above is for SciPy build as above; the wheel from PyPI will have `HAS_LP64`
and `HAS_ILP64` values `True` and `False`, respectively. 

With this build of SciPy, let's check the `linalg.norm` example we started with:

```python
>>> x = np.zeros(2**31)
>>> x[-1] = 1.0
>>> linalg.norm(x)
1.0
```

which is the correct aswer now.

This behavior is indicative of the rest of SciPy linear algebra functionality in the
ILP64 build: all
[high-level linear algebra functions](https://docs.scipy.org/doc/scipy-1.18.0/reference/linalg.html)
will automatically 64-bit integer LAPACK ABI.


## Cython API and ABI

The `show_config()` excerpt above showed a mysteriously looking entry: `cython blas ilp64: true`
in addition to the `has ilp64: true` entry.
The story is this: In addition to Python APIs, SciPy also exports low-level Cython API for
BLAS and LAPACK functions via
[scipy.linalg.cython_blas](https://docs.scipy.org/doc/scipy/reference/linalg.cython_blas.html)
and 
[scipy.linalg.cython_lapack](https://docs.scipy.org/doc/scipy/reference/linalg.cython_lapack.html)
submodules.

These submodules export function pointers to raw BLAS/LAPACK functions for use from Cython, see
[[Hendriksen 2015]](https://proceedings.scipy.org/articles/Majora-7b98e3ed-008).
Several downstream packages (for example, `scikit-learn` consume these pointers).

Since these objects are very low-level, they are subject to the same ABI constraints as the original C
symbols: in the default LP64 build they accept and return 32-bit integers, and in the ILP64 build
they accept and return 64-bit integers, as the `show_config` displays.
Therefore, to be usable with an ILP64-enabled SciPy, downstream packages which consume the
`cython_lapack` APIs must be rebuilt.

If rebuilding a downstream package is not an option, SciPy provides an alternative,
backwards compatible approach: a "mixed" build mode, where the LAPACK is internally
ILP64 but the exported Cython API is LP64. To build SciPy in this mode, use an additional
`cython-blas-abi` argument when building SciPy

```sh
$ python -m build -Csetup-args="-Duse-ilp64=true" -Csetup-args="-Dcython-blas-abi=lp64" -Csetup-args="-Dblas=mkl-dynamic-lp64-seq" -wnx
```

Note the name of the MKL variant: `mkl-dynamic-lp64-seq` is not a typo! To use this "mixed" mode
with LP64 cython ABI you have to use the `-lp64-` variant with `cython-blas-abi=lp64`.
This is due to the organization of MKL internals, and the BLAS/LAPACK will actually use
the ILP64 ABI under the hood, while only the Cython exported symbols will consume 32-bit integers.


# Enabling ILP64 support in your package

For both end user code and downstream packages, you typically want to make it work correctly with both LAPACK ABI variants, LP64 and ILP64.
The level of effort required to enable this depends on whether the downstream code relies on a high-level Python API, Cython API or has manually written C extensions.
Consider these options in turn.

## Pure python APIs

If all you use is high-level functions from [`scipy.linalg`](https://docs.scipy.org/doc/scipy-1.18.0/reference/linalg.html), you do not need to do anything, as long as you use an ILP64-enabled `scipy >= 1.8.0`. High-level SciPy functions will select the correct LAPACK routines automatically.


If you additionally use low-level Python wrappers of individual BLAS or LAPACK functions from `scipy.linalg.blas` or `scipy.linalg.lapack` namespaces, the recommended pattern is to use the `get_{blas,lapack}_funcs` helpers, which select the dtype-appropriate and ABI-compatible variant, and carry a convenience `.int_dtype` attribute:

```python
>>> from scipy.linalg.blas import get_blas_funcs
>>> daxpy = get_blas_funcs('axpy', (np.ones(3),), ilp64='preferred')
>>> daxpy.int_dtype
>>> dtype('int64')       # depends on the build option
```

For functions which accept integer arrays (for example, [`?gesv`](https://netlib.org/lapack/explore-html/d8/da6/group__gesv_ga831ce6a40e7fd16295752d18aed2d541.html), which accepts an array of pivots), these arrays need to be allocated with the appropriate dtype, `np.int32` or `np.int64` depending on the LAPACK ABI.

It is best to avoid using bare symbols:

```python
>>> from scipy.linalg.blas import daxpy as bare_daxpy  # avoid this
```

The difference is that `bare_daxpy` function does not have the `.int_dtype` attribute,
and thus to tell whether it is using LP64 or ILP64 ABI you will need to separately
check either `scipy.show_config()` or `linalg.HAS_ILP64` variables, as shown [above](#show-config).

For more details, see the [SciPy documentation](https://scipy.github.io/devdocs/dev/building/blas_lapack.html#bit-integer-ilp64-blas-lapack).


## Cython `linalg_{blas,lapack} APIs

To account for both Cython LAPACK ABIs, downstream users should use the `blas_int` Cython
type for all LAPACK-adjacent integer variables, which is available via
`from scipy.linalg.cython_blas cimport blas_int`. It tracks the Cython BLAS ABI build mode
and has the bit width of 32 or 64, as appropriate for `cython_blas` and `cython_lapack`.

For more details, see the
[relevant page](https://scipy.github.io/devdocs/dev/building/blas_lapack.html#cython-blas-lapack-integer-abi)
from the SciPy documentation, and a
[worked example](https://github.com/scipy/scipy/tree/main/scipy/linalg/tests/_cython_examples/ilp64_test_package)
of a how downstream Cython-using package can adapt to the SciPy build modes.


## Handwritten C extensions

This is the most complicated situation, which requires support from the build system and source code changes.

The build system will need to be able to detect the LAPACK library, supply the necessary build/link flags, and
account for its [packaging details](https://labs.quansight.org/blog/blas-lapack-packaging). Typically, you would need to
whitelist supported LAPACK providers. As an example, SciPy currently (as of November 2026) supports
Apple Accelerate, MKL and a specific build of OpenBLAS, `scipy-openblas64`. Other LAPACK providers may work as well,
but are not extensively tested.
[Here is the LAPACK detection code](https://github.com/scipy/scipy/blob/v1.18.1/scipy/meson.build#L238-L437) for
the meson build system.
The detection will become simpler when [mesonbuild#14773](https://github.com/mesonbuild/meson/pull/14773) pull request
is merged to meson itself.

For the source code changes, the two main ingredients are integer types and name mangling. `SciPy` provides a
convenience [header file](https://github.com/scipy/scipy/blob/main/scipy/_build_utils/src/scipy_blas_defines.h)
which defines
- the typedef for the integer type, `BLAS_INT`, which resolves to either plain C `int` or `int64_t`
- a convenience macro, `BLAS_FUNC`, which assembles the LAPACK name according to the name mangling rules.

A typical [C function prototype](https://github.com/scipy/scipy/blob/v1.18.1/scipy/linalg/src/_common_array_utils.hh#L70) then reads

```c
void BLAS_FUNC(strtri)(char *uplo, char *diag, CBLAS_INT *n, float* a, CBLAS_INT *lda, CBLAS_INT *info);
```

and the call sites use the mangled name `BLAS_FUNC(strtri)` in a usual way. 

Using this sort of machinery ensures that the C extensions work correctly for both LP64 and ILP64 LAPACK providers using the information supplied by the build system. Of course, detecting integer overflows in the LP64 builds remains a responsibility of the extension author.



# The state of the ecosystem

So, SciPy versions 1.18 and above supports from-source ILP64 builds. What about other packages in the numeric python ecosystem?
The default across the ecosystem is still LP64 ABI. Multiple packages start supporting the ILP64 LAPACK variants, in a similar way to SciPy: enabling the support requires building from source.

As far as downstream packages go,

- `scikit-learn` and `statsmodels` and rely on SciPy's Cython API. To use ILP64, they need a rebuild. No special build flags are needed,
just a regular rebuild, in an environment which contains an ILP64-enabled SciPy.
This functionality is available in `scikit-learn` versions `>= 1.9.0` and `statsmodels >=0.15.0`.

- `numba` also relies on the SciPy Cython API at JIT compile time. To enable ILP64 linear algebra, you need to build `numba` itself with an environment variable set, `NUMBA_LAPACK_ILP64=1`, and make sure ILP64-enabled SciPy is available at runtime.
The support is available starting in Numba versions `0.68` and requires `scipy >= 1.18.0`.

- `cvxopt` does not support ILP64 in a released version as of November 2026. The last released version, `1.3.3`, only supports LP64 LAPACK variants, and will segfault if linked against an ILP64 LAPACK. A patched `cvxopt` version, available in a [pending pull request](https://github.com/cvxopt/cvxopt/pull/272), allows linking `cvxopt` to an ILP64 LAPACK library, but the sizes of actual computation will be limited by $2^{31}$.

For completeness, we also mention that NumPy has been supporting ILP64 LAPACK since at least version `2.0.0`, released in 2024. Details are spelled out in the [NumPy documentation](https://numpy.org/devdocs/building/blas_lapack.html).

The support for the 64-bit integer LAPACK ABIs is growing across the ecosystem. The default remains to be LP64 however, and using ILP64 functionality remains to be opt-in and requires building from source---At least until [PEP 825 Wheel variants](https://peps.python.org/pep-0825/) become mainstream and Python packages start providing ILP64-enabled wheels.


_The work on implementing ILP64 support in SciPy and downstream packages was enabled by the finantial support from DEShaw, which we thankfully acknowledge._
