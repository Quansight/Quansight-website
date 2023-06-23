---
title: 'Manylinux1 is obsolete, manylinux2010 is almost EOL, what is next?'
published: November 12, 2020
author: [matti-picus]
description: 'The basic installation format for users who install packages via pip is the wheel format. But what about Linux? The first manylinux standard, manylinux1, was based on CentOS5 which has been obsolete since March 2017. So what is next for manylinux, and what manylinux should users and package maintainers use?'
category: [Beyond PyData, Developer workflows]
featuredImage:
  src: /posts/manylinux1-manylinux2010/blog_feature_org.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/manylinux1-manylinux2010/blog_hero_org.svg
  imageAlt: 'An illustration of a light brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

The basic installation format for users who install packages via `pip` is
the wheel format. Wheel names are composed of four parts: a
package-name-and-version tag (which can be further broken down), a Python tag,
an ABI tag, and a platform tag. More information on the tags can be found in
[PEP 425](https://www.python.org/dev/peps/pep-0425).  So a package like NumPy
will be available on PyPI as `numpy-1.19.2-cp36-cp36m-win_amd64.whl` for 64-bit
windows and `numpy-1.19.2-cp36-cp36m-macosx_10_9_x86_64.whl` for macOS. Note
that only the plaform tag `win_amd64` or `macosx_10_9_x86_64` differs. 

But what about Linux? There is no single, vendor controlled, "Linux platform"
e.g., Ubuntu, RedHat, Fedora, Debian, FreeBSD all package software at slightly
different versions. What most Linux distributions do have in common is the
glibc runtime library, and a smattering of various additional system libraries.
So it is possible to define a least common denominator (LCD) of software
expected to be on a Linux platform (exceptions apply, e.g. non-glibc
distributions).

The decision to converge on a LCD common platform gave birth to the
[manylinux1](https://www.python.org/dev/peps/pep-0513/) standard. Going back
to our example, numpy is available as
`numpy-1.19.2-cp36-cp36m-manylinux1_x86_64.whl`.

The first manylinux standard, manylinux1, was based on CentOS5 which has [been
obsolete](https://endoflife.software/operating-systems/linux/centos) since
March 2017. The subsequent manylinux2010 standard is based on CentOS6, which
will hit end-of-life in December 2020. The manylinux2014 standard still has some
breathing room. Based on CentOS7, it will reach end-of-life in July 2024.

So what is next for `manylinux`, and what `manylinux` should users and package
maintainers use?

## If `manylinux1` is obsolete, why are there still manylinux1 wheels?

Wheels are typically consumed by Pip via `pip install`. Manylinux wheels are
used for projects that require compilation, otherwise they would ship
pure Python wheels with the "none" platform tag, meaning they are compatible with
any platform. So say you are a library author and want to make it convenient
for users to install your package. If you ship a manylinux2014 wheel, but the
version of Pip your users have is too old to support manylinux2014 wheels, Pip
will happily download the source package and compile it for them. Havoc ensues:
Windows users typically cannot compile, prerequisites will be missing. Pip has
a `--only-binary` option to prevent it from downloading source code and
compiling, and a `--prefer-binary` option to prefer older binary packages over
compiling from source, but neither is on by default.

Pip began supporting manylinux2010 wheels with [version
19.0](https://github.com/pypa/pip/blob/master/NEWS.rst#190-2019-01-22)
released in Jan 2019. The version of Pip that is officially shipped with Python 3.6, via
the [ensurepip](https://docs.python.org/3.6/library/ensurepip.html) module, is
version 18. Python 3.7 ships pip 20. It is easy enough to upgrade, but to be on
the safe side, and prevent havoc, library authors will ship a manylinux1 wheel
for Python 3.6 support.

## What happens now that Python 3.6 is falling out of favor?
[Python 3.6 is no longer in active
development](https://www.python.org/dev/peps/pep-0494). In fact, the scientific
Python community has decided to stop actively supporting Python 3.6 [from
July 2020](https://numpy.org/neps/nep-0029-deprecation_policy.html#support-table).
So I would expect to see projects begin to drop the older manylinux1 format,
and drop support for Python 3.6 sooner rather than later, meaning that
**`manylinux2014` may soon become the only option** for new versions.

## What about Conda packages?
Conda does not use the same kind of wheel format provided by PyPI and Pip. Conda's
build system is internally consistent, and Conda packagers build a binary
package for each supported OS, thus they are not bound to the manylinux
designation. Conda does not have a declared policy around deprecating Python
3.6 yet. Conda does support `pip` (but try not to mix `conda` and `pip`
usage!), and the Pip provided should be version 20 or later. If needed,
`conda upgrade pip` should get you a modern version, so here too
`manylinux2014` will soon become the only option.

## What comes after manylinux2014?
The glibc used in manylinux2014 is defined as the one used by CentOS7. This OS
was released in June 2014. This manylinux standard, for the first time,
declared support for non-x86 hardware systems like ARM64 (aarch64), Power
(ppc64) and S390X.  However the ARM platform has grown greatly since 2014, and
glibc has moved from version 2.17 to 2.31, fixing many bugs. Since the real
driver for platform compatibility is glibc, [PEP
600](https://www.python.org/dev/peps/pep-0600/) defined a "perennial manylinux
spec" that is based on the glibc version number. A lot of work has [already
taken place](https://github.com/pypa/manylinux/issues/542) to support the next
version. Now we need to take the dive: decide what the base OS for the next
manylinux tag will be, roll out a Docker image and tooling around it, and
convince library packaging teams to adopt it. This is needed to allow libraries
like NumPy to confidently use the glibc routines fixed after 2014. For
instance, [this issue](https://github.com/numpy/numpy/issues/15763) is
preventing NumPy from properly supporting `np.float128` on Power and S390X.

## What about non-x86 machines and Linux?

As mentioned before, starting with manylinux2014 `pip` and `wheel` supports
non-x86 architectures like ARM64. Many packages are just now starting to roll
out support for these architectures, as the CI systems that support open source
projects (like TravisCI) have only recently made those platforms available.
It might be easier for users to adopt Conda and the `conda-forge` channel
since conda-forge has support for non-x86 architectures today.

## OK, so what is the bottom line?

- Use pip v20 or later to make it easier on libarary packagers: modern pip
  versions will take the latest manylinux package they can support and will be
  forward-compatible with the PEP 600 perennial manylinux standard.
- Manylinux1 and Python 3.6 are going away. Update your systems.
- For people looking to move PEP 600 forward, the next step is to dive into the
  [auditwheel](https://github.com/pypa/auditwheel) repo to define and support
  the next manylinux version. 
