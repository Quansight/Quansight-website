---
title: 'BLAS/LAPACK packaging'
published: September 16, 2025
authors: [michal-gorny]
description: 'TODO'
category: [Packaging]
featuredImage:
  src: /posts/blas-lapack-packaging/featured.jpeg
  alt:
hero:
  imageSrc: /posts/blas-lapack-packaging/hero.jpeg
  imageAlt:
---

# BLAS/LAPACK packaging

<abbr title="Basic Linear Algebra Subprograms">BLAS</abbr>
and <abbr title="Linear Algebra Package">LAPACK</abbr> are the standard
libraries for linear algebra. The original implementation, often called
[Netlib LAPACK](https://netlib.org/lapack/)
developed since the 1980s, nowadays serves primarily as the provider
of the standard interface, the reference implementation and a conformance
test suite. Users more commonly use optimized implementations of the same
interfaces, ranging from generically optimized
[OpenBLAS](http://www.openmathlib.org/OpenBLAS/)
and [BLIS](https://github.com/flame/blis),
through libraries focused on specific hardware such as [Intel®
oneMKL](https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl-download.html),
[Arm Performance Libraries](https://developer.arm.com/Tools%20and%20Software/Arm%20Performance%20Libraries)
or [Accelerate framework](https://developer.apple.com/documentation/accelerate) on macOS,
to [ATLAS](https://math-atlas.sourceforge.net/) that aims to automatically
optimize for a specific system.

The diversity of available libraries, developed in parallel with
the standard interfaces, vendor-specific extensions, and further
downstream changes, adds quite a bit of complexity around using these
libraries and packaging their consumers. This problem entangles
implementation authors, consumer software authors, build system
maintainers and distribution maintainers. Software authors generally
wish to distribute their packages built against a generally optimized
BLAS/LAPACK implementation. Advanced users often want to be able to use
a different implementation, more suited for their workflows.
Distributions wish to be able to consistently build software against
their system libraries, and ideally provide users the ability to switch
between different implementations. And build systems then need
to provide the scaffolding for all of that.

I have recently taken up the work to provide such a scaffolding
for the [Meson](https://mesonbuild.com/) build system; to [add support
for BLAS and LAPACK dependencies to Meson](https://github.com/mesonbuild/meson/pull/14773).
While working on it, I had to learn more about BLAS/LAPACK packaging:
not only how providers differ from one another, but also how their
respective downstream packaging makes it different. In this blog post,
I would like to organize and share what I have learned.

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
libraries are written in Fortran programming language, and therefore
provide a programming interface specific to Fortran. The `cblas`
and `lapacke` libraries provide C-style interfaces to these routines.
Finally, `tmglib` is a library of routines used for testing, far less
known and rarely used outside the project.

Netlib LAPACK splits not only the actual libraries, but also the related
development files (headers, pkg-config files), therefore encouraging
distributions to split the relevant packages as well. Other
implementations often combine all the provided interfaces into a single
library, such as `openblas`.

Sometimes invidual interfaces are optional or not implemented at all.
In OpenBLAS builds, CBLAS, LAPACK and LAPACKE interfaces can
be disabled, though it is discouraged for compatibility reasons. BLIS
does not implement LAPACK at all, providing only BLAS and CBLAS
interfaces (the latter being optional) that can be combined with Netlib
LAPACK.

## LP64 and ILP64 interfaces

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/lapack-lp64-ilp64.png"
    width="702" height="121" alt="A diagram illustrating different
    approaches to LP64 and ILP64 libraries. It is split into LP64 and
    ILP64 parts. Netlib lapack library represented by lapack in the LP64
    area, lapack (w/ ILP64) on the split line and lapack64 in the ILP64
    area. OpenBLAS is represented by openblas in the LP64 area, and
    openblas64 and openblas64_ in the ILP64 area. MKL i represented
    by mkl_intel_lp64 on the dividing line, and mkl_intel_ilp64 in the
    ILP64 area." />
  <figcaption>Fig. 2. Different approaches to LP64 and ILP64 interfaces</figcaption>
</figure>
</div>

While BLAS and LAPACK libraries are primarily concerned with
floating-point numbers, integer types are used for vector and matrix
sizes and indices.

Originally, 32-bit signed integers were used, even on 64-bit platforms,
limiting the maximum array size to 2<sup>31</sup>−1 elements. This
interface is often called the <abbr title="long and pointerare are 64-bit">LP64</abbr>
interface, or simply "32-bit BLAS". Modern packages also support
building with 64-bit signed integers instead; this interface is called
<abbr title="int, long and pointers are 64-bit">ILP64</abbr>, "64-bit
BLAS", or "index64".

The exact details on how these two interfaces are implemented varies
from package to package, and from distribution to distribution. In some
cases, the ILP64 routines are installed as a separate library such
as `openblas64`; in other cases, the ILP64 library is installed in place
of the LP64 library, or combined with it into a single library.
Sometimes, the ILP64 routines are suffixed to make them distinct
from LP64 routines, for example the ILP64 counterpart to `sgesv_`
is called `sgesv_64_`; when using separate libraries, they often
use regular LP64 names. There could be separate headers for the ILP64
interface, or a preprocessor directive such as `-DLAPACK_ILP64` may
be used to switch the interfaces.

The CMake build system for Netlib LAPACK 3.12.1 supports two variants
of ILP64 support: either the `-DBUILD_INDEX64` option can be used
to build separate libraries such as `lapack64` without symbol suffixes,
or the `-DBUILD_INDEX64_EXT_API` option can be used to include ILP64
symbols with `64_` suffix in the LP64 library.

The build system for OpenBLAS has quite a lot customization options
that historically have been used to provide ILP64 support across
distributions in inconsistent ways. Perhaps the best relic of this
are Fedora packages that provide both a `openblas64` library that
provides ILP64 symbols without suffixes, and a `openblas64_` (with
an underscore) library, using prefixed symbols per the [recommended
OpenBLAS upstream ILP64
convention](https://www.openmathlib.org/OpenBLAS/docs/distributing/#ilp64-interface-builds).

Intel MKL 2025.2 uses a hybrid convention. Its LP64 library and "Single
Dynamic Library" both combine LP64 with suffixed ILP64 symbols, while
its separate ILP64 library provides both unsuffixed and suffixed ILP64
symbols.

## Threading models

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/lapack-thread.png"
    width="901" height="213" alt="A diagram illustrating different
    approaches to threading. It is split into serial, multithreaded
    and OpenMP parts. Conda-forge's OpenBLAS library may correspond
    to either variant. Fedora features split serial openblas library,
    multithreaded pthread-based openblasp library and OpenMP-based
    openblaso library. Intel MKL features four libraries: serial
    mkl_sequential, multithreaded TBB-based intel_tbb_thread,
    and two OpenMP-based libraries: mkl_gnu_thread and mkl_intel_thread.
    All of these libraries are combined by the mkl_rt library." />
  <figcaption>Fig. 3. Different approaches to threading models</figcaption>
</figure>
</div>

As computationally intensive routines, BLAS and LAPACK libraries can
often benefit from parallelization. The optimized implementations
such as OpenBLAS, BLIS or MKL
feature support for multiple threading models to take advantage of that.
All these libraries come in serial (or "sequential"), threaded
and OpenMP-enabled variants. MKL comes precompiled for GNU OpenMP
and Intel OpenMP libraries.

Again, the exact details differ across distributions. Some support
installing only a single library for selected threading model,
so `openblas` may either represent the serial, the POSIX threads or the OpenMP
variant. Others install multiple variants; so on Fedora, there is
a serial `openblas`, a threaded `openblasp` and an OpenMP-enabled
`openblaso`. MKL goes even further, with its "Single Dynamic Library"
permitting switching between different threading models (and LP64/ILP64
interfaces) at runtime.

## API compatibility

BLAS / LAPACK is a living specification, with the interface defined
by Netlib LAPACK releases. For example, LAPACK 3.12.0 introduced
a `dgedmd_` function, that was added to OpenBLAS in 0.3.24. In addition
to adding new interfaces, functions are also occasionally deprecated.
Netlib LAPACK can be configured to build without deprecated symbols.
The resulting differences can introduce incompatibilities between
applications and different BLAS / LAPACK implementations.

Besides additions and deprecations, API incompatibilities could also be
caused by disabling optional components (such as CBLAS or LAPACKE
interfaces), and by using different suffixes (for example, while
building the ILP64 interface). Perhaps the most extreme case of this
is Apple's Accelerate library, where modern LAPACK interfaces all use
a custom `$NEWLAPACK` suffix, as noted in [Ralf Gommers's notes on Apple
Accelerate](https://gist.github.com/rgommers/e10c7cf3ebd88883458544e535d7e54c#apple-accelerate).

## Alternative-based approaches to switching implementations

Advanced users and distributions often find it desirable to be able
to use different BLAS / LAPACK implementations for a given package.
The simplest approach to achieve that is to provide an option to select
the library used to build the package. Such an option could be afterwards
exposed to users, for example by publishing different variants
in Conda-forge packages, or by exposing the choice via USE flags in Gentoo Linux.

However, such an approach is suboptimal, as it requires building the package
separately against every supported provider, even if the package
in question only uses API that is common to all of them. Therefore, such
an approach is generally used only for packages that benefit
from functions unique to a given implementation. For example,
[conda-forge's PyTorch
packages](https://anaconda.org/conda-forge/pytorch/files) provide
"generic" and "mkl" LAPACK variants, the former compatible with
any LAPACK implementation, the latter using additional MKL
functionality.

A better interchangeability can be achieved using a solution such
as the packages from [Conda-forge's `blas` feedstock](https://github.com/conda-forge/blas-feedstock) (see: [Conda-forge's Knowledge Base: Switching BLAS implementation](https://conda-forge.org/docs/maintainer/knowledge_base/#switching-blas-implementation), Debian's alternatives system
(see: [Debian: Handle different versions of BLAS and LAPACK, as of December 2022](https://wiki.debian.org/DebianScience/LinearAlgebraLibraries?action=recall&rev=38))
or Gentoo's historical eselect modules. These approaches replace the libraries
originally provided by Netlib LAPACK with symbolic links or wrappers,
referencing another implementation. For example, installing
the `openblas` variant of `liblapack` creates a `liblapack.so.3`
symbolic link to the OpenBLAS library.

This approach makes it possible to avoid rebuilding other packages,
limiting the effort needed to switch between providers to replacing
the wrappers. Unfortunately, it is rather complex. In particular, one
needs to ensure that the built packages link to the generic library
names and use compatible API and ABI. This is usually
achieved by building them against the reference implementation rather
than the symlinks, which is not always trivially possible. Furthermore,
resolving symbol name and other ABI differences requires creating
complex wrappers, such as Conda-forge's wrapper libraries
for Accelerate.

[Gentoo's eselect-ldso system](https://wiki.gentoo.org/index.php?title=Blas-lapack-switch&oldid=1271681)
is an elaboration on this scheme. Rather
than symbolic links, the system library directory contains the reference
Netlib libraries, and these libraries are used for package builds.
Wrappers for other implementations are installed into dedicated
directories, and they can be activated by adding these directories
into the dynamic linker search paths (using the `ld.so.conf` file
or the `LD_LIBRARY_PATH` environment variable).

An interesting side effect of many of these approaches is that
the reference library names are no longer guaranteed to refer
to the Netlib LAPACK implementation. On Debian, the netlib libraries
are installed into `blas` and `lapack` subdirectories of the library
directory. On the upcoming port of Gentoo to FlexiBLAS, they are renamed
to use `-reference` suffixes (for example, `lapack64-reference`).

## One FlexiBLAS to rule them all

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/blas-lapack-packaging/flexiblas.png"
    width="873" height="195" alt="A diagram illustrating using FlexiBLAS.
    First, on Gentoo there are four symbolic links for blas, cblas,
    lapack and lapacke libraries. These all link to the FlexiBLAS
    wrapper library. FlexiBLAS dispatches into the actual
    implementations, such as Netlib LAPACK, BLIS, OpenBLAS or MKL.
    It is noted that BLIS is combined with Netlib LAPACK implementation." />
  <figcaption>Fig. 4. The FlexiBLAS approach</figcaption>
</figure>
</div>

The limitations of alternative-based approaches, in particular
concerning API and ABI compatibility, make it desirable to use a wrapper
library to abstract over different implementations. One such a library
is [FlexiBLAS](https://www.mpi-magdeburg.mpg.de/projects/flexiblas).
It is already used in Fedora (see: [Fedora documentation: Linear Algebra
Libraries](https://docs.fedoraproject.org/en-US/packaging-guidelines/BLAS_LAPACK/)),
and it is being considered in Gentoo (see: [[gentoo-dev] Redoing
BLAS/LAPACK in Gentoo, using
FlexiBLAS](https://archives.gentoo.org/gentoo-dev/d7783d1b18c3daba15aa78f8c3a64c43bc4dc9b7.camel@gentoo.org/T/)).

With this approach, packages aren't built against any particular BLAS /
LAPACK implementation, but rather against the wrapper library
and interface provided by FlexiBLAS. At runtime, FlexiBLAS dispatches
these calls to the selected provider library or to a fallback
implementation if the provider does not implement the requested
function. This makes it possible to even up the API and ABI differences
between providers, while respecting the user preference as much
as possible. According to upstream, this comes with <q>no notable
overhead</q>.

Again, there are some minor implementation differences between
distributions. In Fedora, packages are built and linked directly
to FlexiBLAS, while Gentoo is considering using a layer of symbolic
links for backwards compatibility.

## Summary

BLAS and LAPACK started as Fortran libraries, and evolved into standard
interfaces for linear algebra, with multiple implementations conforming
to them. However, their historical evolution along with downstream
customizations has resulted in quite a complex landscape of libraries
and wrappers. Even when targeting a very specific provider, one needs
to be aware of different build configurations and packaging differences.

Netlib LAPACK distribution installs separate libraries, while other
implementations combine the interfaces into a single library. Individual
interfaces are optional and can be disabled. The libraries can provide
the LP64 interface, the ILP64 interface or both. The ILP64 interface can
use suffixed symbols; either separate headers or preprocessor
definitions can be used to enable it. Accelerate uses suffixed symbols
for the modern LAPACK interface in general. Many implementations feature
sequential, multithreaded and OpenMP variants; these can be either
packaged interchangeably or installed simultaneously.

All these aspects may be further customized by distributions,
and change over time. Furthermore, sometimes the base libraries
traditionally used by Netlib LAPACK are replaced by symbolic links
or wrappers to facilitate switching between different implementations.
A different provider library may be used at build time and at runtime.
A dispatching library such as FlexiBLAS can be used.

This system largely works for downstream packaging, but it is not
necessarily easy for software authors to navigate in. If one aims to use
a very specific BLAS / LAPACK implementation, one needs to account
for all the variation in how it is packaged, using elaborate discovery
methods: searching for the correct library, the correct headers,
the correct symbol suffix. At the same time, it is often desirable
to provide advanced users and distribution packagers with a choice
of the implementation, extending this discovery to different providers
and their variations. Build systems such as Meson are caught
in the middle of this, often being in the best position to provide
the routines needed for discovery.
