---
title: 'BLAS/LAPACK packaging'
published: September 16, 2025
authors: [michal-gorny]
description: 'An overview of differences between BLAS / LAPACK implementations and their packaging.'
category: [Packaging]
featuredImage:
  src: /posts/blas-lapack-packaging/featured.jpeg
  alt: Edvard Munch's "The Scream", except that there's a bubble with LAPACK logo in it, suggesting that the person in question is screaming over LAPACK packaging.
hero:
  imageSrc: /posts/blas-lapack-packaging/hero.jpeg
  imageAlt: Edvard Munch's "The Scream", except that there's a bubble with LAPACK logo in it, suggesting that the person in question is screaming over LAPACK packaging.
---

# BLAS/LAPACK packaging

<abbr title="Basic Linear Algebra Subprograms">BLAS</abbr>
and <abbr title="Linear Algebra Package">LAPACK</abbr> are the standard
libraries for linear algebra. The original implementation, often called
[Netlib LAPACK](https://netlib.org/lapack/),
developed since the 1980s, nowadays serves primarily as the origin
of the standard interface, the reference implementation and a conformance
test suite. The end users usually use optimized implementations of the same
interfaces. The choice ranges from generically tuned libraries such as [OpenBLAS](http://www.openmathlib.org/OpenBLAS/)
and [BLIS](https://github.com/flame/blis),
through libraries focused on specific hardware such as [Intel®
oneMKL](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl-download.html),
[Arm Performance Libraries](https://developer.arm.com/Tools%20and%20Software/Arm%20Performance%20Libraries)
or the [Accelerate framework](https://developer.apple.com/documentation/accelerate) on macOS,
to [ATLAS](https://math-atlas.sourceforge.net/) that aims to automatically
optimize for a specific system.

The diversity of available libraries, developed in parallel with
the standard interfaces, along with vendor-specific extensions and further
downstream changes, adds quite a bit of complexity around using these
libraries in software, and distributing such software afterwards. This problem entangles
implementation authors, consumer software authors, build system
maintainers and distribution maintainers. Software authors generally
wish to distribute their packages built against a generically optimized
BLAS/LAPACK implementation. Advanced users often wish to be able to use
a different implementation, more suited to their particular needs.
Distributions wish to be able to consistently build software against
their system libraries, and ideally provide users the ability to switch
between different implementations. Then, build systems need to provide
the scaffolding for all of that.

I have recently taken up the work to provide such a scaffolding
for the [Meson](https://mesonbuild.com/) build system; to [add support
for BLAS and LAPACK dependencies to Meson](https://github.com/mesonbuild/meson/pull/14773).
While working on it, I had to learn a lot about BLAS/LAPACK packaging:
not only how the different implementations differ from one another,
but also what is changed by their respective downstream packaging.
In this blog post, I would like to organize and share what I have learned.

## Interfaces and libraries

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/lapack-libs.png"
    width="893" height="198" alt="A diagram showing correspondence
    between Netlib LAPACK, BLIS and OpenBLAS libraries. Netlib BLAS
    consists of four libraries: blas, cblas, lapack and lapacke. cblas
    is the C API to blas, whereas lapacke is the C API to lapack.
    Additionally, lapack uses blas. BLIS is a single library that
    corresponds both to blas and cblas. lapack can optionally use it
    instead of blas. OpenBLAS is a single library that corresponds
    to all four Netlib libraries." />
  <figcaption>Fig. 1. Library correspondence between Netlib LAPACK, BLIS and OpenBLAS</figcaption>
</figure>
</div>

The modern version of the Netlib LAPACK
implementation features five libraries: `blas`, `cblas`, `lapack`,
`lapacke` and `tmglib`. The `blas` library provides low-level routines
for linear algebra, such as vector and matrix arithmetic. The `lapack`
library builds on these routines to provide higher-level functionality,
for example solving systems of linear equations. Both of these
libraries are written in the Fortran programming language, and therefore
provide a programming interface specific to Fortran. The `cblas`
and `lapacke` libraries provide C-style interfaces to these routines.
Finally, `tmglib` is a library of routines used for testing, far less
known and rarely used outside the project.

Netlib LAPACK splits not only the actual libraries, but also the related
development files (headers, `pkg-config` files), therefore encouraging
distributions to split the relevant packages as well. Other
implementations often combine all the provided interfaces into a single
library, such as `openblas`.

Sometimes invidual interfaces are optional or not implemented at all.
In OpenBLAS builds, CBLAS, LAPACK and LAPACKE interfaces can
be disabled, though doing that is discouraged to avoid introducing
compatibility issues. BLIS
does not implement LAPACK at all, while providing BLAS and CBLAS
interfaces (the latter being optional). It is usually combined
with Netlib LAPACK; [libflame](https://github.com/flame/libflame)
is being developed as a LAPACK counterpart to BLIS, but it is
not commonly used at the time of writing.

## LP64 and ILP64 interfaces

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/lapack-lp64-ilp64.png"
    width="746" height="173" alt="A diagram illustrating different
    approaches to LP64 and ILP64 libraries. It is split into LP64,
    ILP64 and 'both' parts. The Netlib lapack and openblas libraries
    represent the pure LP64 libraries. The Netlib lapack (w/ ILP64)
    and mkl_intel_lp64 libraries provide both LP64 and ILP64 interfaces.
    The Netlib lapack64, openblas64, openblas64_ (with underscore)
    and mkl_intel_ilp64 libraries provide only ILP64 interface." />
  <figcaption>Fig. 2. Different approaches to LP64 and ILP64 interfaces</figcaption>
</figure>
</div>

While the BLAS and LAPACK libraries are primarily concerned with
floating-point numbers, integer types need to be used for vector and matrix
sizes and indices. Originally, 32-bit signed integers were used, even on 64-bit platforms,
limiting the maximum array size to 2<sup>31</sup>−1 elements. This
interface is often called the <abbr title="long and pointerare are 64-bit">LP64</abbr>
interface, or simply “32-bit BLAS”. Modern packages provide support
for building with 64-bit signed integers instead; this interface is called
<abbr title="int, long and pointers are 64-bit">ILP64</abbr>, “64-bit
BLAS”, or “index64”.

The exact details on how these two interfaces are implemented varies
from package to package, and from distribution to distribution. In some
cases, the ILP64 routines are installed as a separate library such
as `openblas64`; in other cases, the ILP64 library is installed in place
of the LP64 library, or combined with it into a single library.
Sometimes, the ILP64 routines are suffixed to make them distinct
from LP64 routines; for example the ILP64 counterpart to `sgesv_`
could be called `sgesv_64_`. There could be separate headers for the ILP64
interface, or a preprocessor directive such as `-DLAPACK_ILP64` may
be used to switch the interfaces.

The CMake build system for Netlib LAPACK 3.12.1 supports two variants
of ILP64 support: either the `-DBUILD_INDEX64` option can be used
to build separate libraries (such as `lapack64`) without symbol suffixes,
or the `-DBUILD_INDEX64_EXT_API` option can be used to include ILP64
symbols in the LP64 library, with a `_64` suffix appended
to the subroutine name.

The build system for OpenBLAS permits quite a lot customization,
and this historically resulted in distributions providing ILP64
support in inconsistent ways. Perhaps the best relic of this
are the Fedora packages, as they provide both a `openblas64` library that
provides ILP64 symbols without suffixes, and a `openblas64_` (with
an underscore) library, that uses a `64_` suffix appended to the symbol
name, as [recommended
OpenBLAS upstream ILP64
convention](https://www.openmathlib.org/OpenBLAS/docs/distributing/#ilp64-interface-builds).

Intel MKL 2025.2 uses a hybrid convention. Its LP64 library and its “Single
Dynamic Library” (`mkl_rt`) both combine LP64 with suffixed ILP64 symbols, while
its separate ILP64 library provides both unsuffixed and suffixed ILP64
symbols. In both cases, a `_64` subroutine suffix is used, following
the same convention as Netlib LAPACK.

The way that suffixes are added means that the symbols are the same
for Fortran subroutines (for example, all three libraries provide `dgemm_64_`),
but not for the C routines (there is a `cblas_dgemm_64` symbol in Netlib
BLAS and MKL, and a `cblas_dgemm64_` symbol in OpenBLAS).

## Threading models

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/lapack-thread.png"
    width="889" height="199" alt="A diagram illustrating different
    approaches to threading. It is split into serial, pthread / TBB
    and OpenMP parts. Conda-forge's OpenBLAS library may correspond
    to either variant, defaulting to pthread. Fedora features split
    serial openblas library, pthread-based openblasp library
    and OpenMP-based openblaso library. Intel MKL features four
    libraries: serial mkl_sequential, TBB-based intel_tbb_thread,
    and two OpenMP-based libraries: mkl_gnu_thread and mkl_intel_thread.
    All of these libraries are multiplexed by the mkl_rt library." />
  <figcaption>Fig. 3. Different approaches to threading models</figcaption>
</figure>
</div>

As providers of computationally intensive routines, the BLAS and LAPACK libraries can
often benefit from parallelization. The optimized implementations
such as OpenBLAS, BLIS or MKL
feature support for multiple threading models to take advantage of that.
All these libraries come in at least three variants: a serial
(or “sequential”) variant that runs computations using a single thread,
a variant using POSIX threads or TBB (in case of MKL), and a variant
using OpenMP. MKL comes precompiled for the GNU OpenMP and the Intel OpenMP
libraries.

Again, the exact details differ across distributions. Some support
installing only a single library for the selected threading model,
so `openblas` may either represent the serial, the POSIX threads or the OpenMP
variant. Others install multiple variants; on Fedora, there is
a serial `openblas`, a threaded `openblasp` and an OpenMP-enabled
`openblaso`. MKL goes even further, with its “Single Dynamic Library”
permitting switching between different threading models at runtime.

## API and ABI compatibility

BLAS / LAPACK is a living specification, and its interface is defined
by Netlib LAPACK releases. For example, LAPACK 3.12.0 introduced
a `dgedmd_` function, and its implementation was added to OpenBLAS in 0.3.24. In addition
to new interfaces being added, functions are also occasionally deprecated.
Netlib LAPACK can be configured not to include deprecated symbols.
The resulting differences can introduce incompatibilities between
applications and different BLAS / LAPACK implementations.

Besides additions and deprecations, API and ABI incompatibilities could also be
caused by disabling optional components (such as the CBLAS or LAPACKE
interfaces), by using different symbol suffixes (for example, while
building the ILP64 interface) or Fortran calling conventions (this particularly
affects callbacks and complex numbers). Perhaps the most extreme case of this
issue is the Apple's Accelerate library, in which modern LAPACK interfaces all use
a custom `$NEWLAPACK` suffix. More information on compatibility issues can be found in [Ralf Gommers's notes on Apple
Accelerate](https://gist.github.com/rgommers/e10c7cf3ebd88883458544e535d7e54c#apple-accelerate)
and [BLAS, LAPACK and OpenMP documentation from pypackaging-native](https://pypackaging-native.github.io/key-issues/native-dependencies/blas_openmp/).

If BLAS / LAPACK is used in a shared library, things become even more
complex. When multiple binaries that link dynamically to different
implementations are loaded into the same program, the program may end up
using the routines from a different implementation than it was compiled
against, or even mixing routines from different implementations (if they
implement a different subset of functions). This is particularly
problematic if both LP64 libraries and ILP64 libraries
that do not use a symbol suffix are used simultaneously, as the symbols
from one of them will clobber the symbols from the other and parts
of the code may call the wrong functions.

## Alternative-based approaches to switching implementations

Advanced users and distributions often find it desirable to be able
to choose between different BLAS / LAPACK implementations for a given package.
The simplest approach to achieve that is to provide an option to select
the library used to build the package. Such an option could be afterwards
exposed to the users, for example by publishing different variants
of Conda-forge packages, or by exposing the choice via USE flags in Gentoo Linux.

However, such an approach is suboptimal, as it requires that the package
is built separately against every supported provider, even if it
would be ABI-compatible with all of them. Therefore, such
an approach is generally used only for packages that take advantage
of vendor-specific extensions to a specific implementation. For example,
[conda-forge's PyTorch
packages](https://anaconda.org/conda-forge/pytorch/files) provide
“generic” and “mkl” variants, the former compatible with
any LAPACK implementation, the latter using additional MKL
functionality.

A better interchangeability can be achieved through a solution such
as the packages built from [Conda-forge's `blas` feedstock](https://github.com/conda-forge/blas-feedstock)
(see: [Conda-forge's Knowledge Base: Switching BLAS implementation](https://conda-forge.org/docs/maintainer/knowledge_base/#switching-blas-implementation)),
Debian's alternatives system (see: [Debian: Handle different versions of BLAS and LAPACK, as of December 2022](https://wiki.debian.org/DebianScience/LinearAlgebraLibraries?action=recall&rev=38))
or Gentoo's historical eselect modules. These approaches replace the libraries
originally provided by Netlib LAPACK with symbolic links or wrappers,
referencing another implementation. For example, installing
the `openblas` variant of the `liblapack` Conda-forge package creates a `liblapack.so.3`
symbolic link to the OpenBLAS library.

This approach makes it possible to avoid rebuilding other packages
while switching implementations; it is sufficient to replace
the wrappers. Unfortunately, it is rather complex. In particular, one
needs to ensure that the built packages link to the generic library
names and use compatible API and ABI. This is usually
achieved by building them against the reference implementation rather
than the symbolic links, which is not always trivially possible. Furthermore,
resolving symbol name and other ABI differences requires creating
complex wrappers, such as Conda-forge's wrapper libraries
for Accelerate.

[Gentoo's eselect-ldso system](https://wiki.gentoo.org/index.php?title=Blas-lapack-switch&oldid=1271681)
is an elaboration on this scheme. Rather
than symbolic links, the system library directory contains the reference
Netlib libraries, and packages are built against these libraries.
Wrappers for other implementations are installed into dedicated
directories, and they can be activated by adding these directories
into the dynamic linker search paths (using the `ld.so.conf` file
or the `LD_LIBRARY_PATH` environment variable).

An interesting side effect of many of these approaches is that
the reference library names are no longer guaranteed to refer
to the Netlib LAPACK implementation. On Debian, the Netlib libraries
are installed into the `blas` and `lapack` subdirectories of the library
directory. On the experimental port of Gentoo to FlexiBLAS, they are renamed
to use a `-reference` suffix (for example, the `lapack64` library is renamed
to `lapack64-reference`).

## One FlexiBLAS to rule them all

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/flexiblas.png"
    width="873" height="195" alt="A diagram illustrating using FlexiBLAS.
    First, on Gentoo there are four wrappers for blas, cblas,
    lapack and lapacke libraries. These all link to the FlexiBLAS
    multiplexing library. FlexiBLAS dispatches into the actual
    implementations, such as Netlib LAPACK, BLIS, OpenBLAS or MKL.
    It is noted that BLIS is combined with Netlib LAPACK implementation." />
  <figcaption>Fig. 4. The FlexiBLAS approach</figcaption>
</figure>
</div>

The limitations of alternative-based approaches, in particular
concerning API and ABI compatibility, make it desirable to use a multiplexing
library to abstract over different implementations. One such a library
is [FlexiBLAS](https://www.mpi-magdeburg.mpg.de/projects/flexiblas).
It is already used in Fedora (see: [Fedora documentation: Linear Algebra
Libraries](https://docs.fedoraproject.org/en-US/packaging-guidelines/BLAS_LAPACK/)),
and it is being tested in Gentoo (see: [[gentoo-dev] Redoing
BLAS/LAPACK in Gentoo, using
FlexiBLAS](https://archives.gentoo.org/gentoo-dev/d7783d1b18c3daba15aa78f8c3a64c43bc4dc9b7.camel@gentoo.org/T/)).

With this approach, the individual packages aren't built against any particular BLAS /
LAPACK implementation, but rather against the multiplexing library
and the programming interface provided by FlexiBLAS. At runtime, FlexiBLAS dispatches
the function calls to the provider library selected by the user at runtime, or to a fallback
implementation if said provider does not implement the requested
function. This makes it possible to even up the API and ABI differences
between providers, while respecting the user preference as much
as possible. According to upstream, this comes with <q>no notable
overhead</q>.

Again, there are some minor implementation differences between
distributions. In Fedora, packages are built and linked directly
to FlexiBLAS, while Gentoo is experimenting with using a layer of wrappers
for backwards compatibility.

## Summary

BLAS and LAPACK started as Fortran libraries, and evolved into the standard
interfaces for linear algebra, with multiple implementations conforming
to them. However, their historical evolution combined with downstream
customizations has resulted in quite a complex landscape of libraries
and wrappers. Even targeting a very specific provider requires
awareness of build configuration and packaging differences.

The Netlib LAPACK distribution installs separate libraries, while other
implementations combine the interfaces into a single library. Individual
interfaces are optional and can be disabled. The libraries can provide
the LP64 interface, the ILP64 interface or both. The ILP64 interface can
use different symbol suffixes (or none); either separate headers or preprocessor
definitions can be used to use it. The Accelerate library uses suffixed symbols
for the modern LAPACK interface in general. Many implementations feature
sequential and multiple multithreaded variants; these can be either
packaged interchangeably or installed simultaneously.

Furthermore, the different implementations can be ABI-compatible with one another
and therefore interchangeable; API-compatible without ABI compatibility,
requiring rebuilding; or they can feature API incompatibilities that require
explicit code-level support. A dispatching library such as FlexiBLAS
can be used to provide API and ABI compatibility.

All these aspects may be further customized by distributions,
and change over time. Sometimes the base libraries
traditionally used by Netlib LAPACK are replaced by symbolic links
or wrappers to facilitate switching between different implementations.
A different provider library may be used while building the package,
and at its runtime.

This system largely works for downstream packaging, but it is not
necessarily easy for software authors to navigate in. A package aiming
to use only a specific BLAS / LAPACK implementation needs to account
for all the variation in how it is packaged, possibly using elaborate discovery
methods: searching for the correct library, the correct headers,
the correct symbol suffix. At the same time, it is often desirable
to provide advanced users and distribution packagers with a choice
of the implementation, which necessitates extending this discovery to the different providers
and their variations. Build systems such as Meson are caught
in the middle of this, often being in the best position to provide
the abstraction needed for that.
