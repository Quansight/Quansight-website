---
title: 'The first year of free-threaded Python'
authors: [nathan-goldbaum]
published: May 13, 2025
description: 'A recap of the first year of work on enabling support for the free-threaded build of CPython in community packages.'
category: [Community, PyData ecosystem]
featuredImage:
  src: /posts/free-threaded-one-year-recap/snake-cartoon.jpg
  alt: 'A cartoon of a Python wrapped around a thread, illustrating Python and threads getting along.'
hero:
  imageSrc: /posts/free-threaded-one-year-recap/snake-cartoon.jpg
  imageAlt: 'A cartoon of a Python wrapped around a thread, illustrating Python and threads getting along.'
---

Last week, the CPython developers rolled out CPython 3.14.0b1. This week, PyCon
2025 kicks off in Pittsburgh, PA. Both events mark a significant milestone for
the effort to ship and stabilize free-threaded Python.

This is the story of the first year of that effort and how our team at
Quansight played a key role in enabling experimental use of the free-threaded
build with real production workflows that depend on a complex set of
dependencies.

## Introduction: Why are we working on community support for free-threaded Python?

Support for free-threaded Python unlocks the full compute power of modern
hardware with multicore CPUs and GPUs now commonplace. In the GIL-enabled
build, making full use of parallel algorithms that exploit all available
compute resources in Python requires workarounds and careful tuning. The Python
`threading` module is often not used because the GIL prevents useful parallel
scaling. Instead, many reach for `multiprocessing`, but spawning processes is
expensive and communicating across processes often requires making expensive
copies of data that would not be necessary in a multithreaded program where
data is implicitly shared between threads.

Having said that, it is not possible for packages that ship compiled code in
their release distributions to support the free-threaded build out of the box.
Any package shipping native code (many Python packages do that) will need to be
audited to ensure the package builds and either fix or document the safety
guarantees provided by the package. Disabling the GIL required deep structural
changes to the CPython interpreter. Fully supporting the free-threaded build in
existing packages similarly requires fixing structural issues that until now
were not big problems. Things like use of global state in the implementation of
a C extension for convenience or for performance are no longer safe, since the
GIL does not protect simultaneous access from Python to the global state,
allowing undefined behavior via data races. While it is possible to trigger
thread safety issues like this using the `threading` module even with the GIL,
most of the time the GIL prevented these issues from surfacing. The
free-threaded build makes fixing these issues much more pressing.

## Major accomplishments

Alongside the Python runtime team at Meta, we made significant contributions to
enable support for free-threaded Python in a long list of packages and
projects, including:

  * Packaging and project workflow tools like meson, meson-python, the
    setup-python GitHub workflow, packaging, pip, and setuptools.
  * Bindings generators like Cython, pybind11, f2py, and PyO3.
  * Foundational packages in the PyData ecosystem like NumPy, SciPy, PyArrow,
    Matplotlib, pandas, scikit-learn, and scikit-image.
  * Top dependencies by PyPI downloads like Pillow, PyYAML, yarl, multidict,
    and frozenlist.

We are also currently looking at popular packages that don't yet ship support,
including CFFI, cryptography, PyNaCl, aiohttp, SQLAlchemy, and grpcio as well
as popular libraries for machine learning workflows like safetensors and
tokenizers.

CPython core developers on our team also contributed several major improvements
that will ship in CPython 3.14:

  * The Python `warnings` module is now thread-safe by default on the
    free-threaded build. It can be made thread-safe on the GIL-enabled build
    with a configuration option or runtime command-line flag.
  * Significant thread safety issues in `asyncio` have been fixed. Our
    benchmarks indicate substantially improved parallel scaling of code using
    asyncio with a thread pool runner as a function of thread count.
  * Thread safety overhaul in the `ctypes` module.
  * Substantial performance improvements for the free-threaded garbage collector.
  * Helped implement the deferred reference counting scheme used by the
    free-threaded interpreter in 3.14.
  * Implemented several specializations for the adaptive specializing
    interpreter and supported shipping optimizations that bring the
    single-threaded performance of free-threaded CPython 3.14 within spitting
    distance of the GIL-enabled build.
  * A huge number of smaller bugfixes and thread safety improvements.

We've also written a [comprehensive guide](https://py-free-threading.github.io)
for supporting free-threading in existing apps and packages gleaned from our
experiences. Our hope is that the documentation we've written can be a valuable
resource for the "long tail" of packages that people will want to update to
support free-threaded Python in the coming years.

You can also read more about this effort from the team at Meta on the
[Meta engineering blog](https://engineering.fb.com/2025/05/05/developer-tools/enhancing-the-python-ecosystem-with-type-checking-and-free-threading/).

## What is the state of the free-threaded Python ecosystem?

At this time last year, when Python 3.13.0b1 shipped, the wider ecosystem of
Python packages was more or less completely broken on the free-threaded build.
Trying to `pip install` anything but the simplest package with no dependencies
or only pure-Python dependencies would likely lead to build errors. Most of
these issues were not due to fundamental problems but because of unsupported
default options or minor assumptions broken on the free-threaded build.

We have fixed all of these issues and today things are much better. With the
release of Cython 3.1.0, which ships official support for the free-threaded
build, we also have fixed one of the most significant source of build issues.

We are currently working on packages that ship compiled code but still do not
yet ship free-threaded wheels. You can track our progress using our manually
updated [status tracking table](https://py-free-threading.github.io/tracking/)
or using Hugo van Kemenade's [automatically updated
tracker](https://hugovk.github.io/free-threaded-wheels/).

### Challenges

As of today, the free-threaded Python build is ready to experiment with. We
need more reports of bad performance and bugs from people with real-world
workflows. Significant performance improvements are possible, particularly in
workflows that make use of multiprocessing and are paying the costs inherent to
that approach. However, many packages still need detailed auditing to discover
thread safety issues. Many Python libraries ship mutable data structures that
will not behave correctly under shared mutating and with no or minimal
documentation on thread safety or multithreaded performance.

As in any change of this magnitude that affects an entire programming language
package ecosystem, we are hitting cases where popular packages do not have the
resources needed to deal with changes needed to support free-threading. This is
particularly true of large legacy packages where few people or even no one
fully understands the code. As a community, we need to understand these issues
in our dependency trees and work towards sustainable maintenance for critical
packages.

### How can you help?

Take a look at the [contribution guide](https://py-free-threading.github.io/contributing/)
we've added to the main free-threading guide. We're tracking ecosystem-wide
issues and writing the content of the free-threaded guide in the
[free-threaded-compatibility](https://github.com/Quansight-Labs/free-threaded-compatibility)
repository hosted on the Quansight-Labs GitHub org.

We also launched a [community Discord](https://discord.gg/rqgHCDqdRr) to host
discussions about supporting the free-threaded build. Come join us if you're
interested in helping out!

## Come to our talk at PyCon!

I will be giving [a talk at
PyCon](https://us.pycon.org/2025/schedule/presentation/42/) with my teammate
[Lysandros Nikolaou](https://github.com/lysnikolaou). If you'll be attending
the conference, please come and watch. We'll be sharing details from our
experiences porting packages to support the free-threaded build. We're hopeful
that the recording on YouTube will be a lasting valuable resource for the
visual learners of the world.

Personally, I believe the free-threaded build is the future of the language,
and am excited that I get to work full-time on enabling that. I'm also hopeful
that the work we're doing now will enable future work in the long tail of
packages used every day by millions of developers and dramatically improve the
performance of the language.
