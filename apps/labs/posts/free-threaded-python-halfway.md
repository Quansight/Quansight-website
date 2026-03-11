---
title: 'Halfway on the path to community support for free-threaded Python'
published: March 11, 2026
authors: [nathan-goldbaum]
description: 'Marking the halfway point on community support in popular packages for free-threaded Python'
category: [Community, PyData ecosystem]
featuredImage:
  src: /posts/free-threaded-python-halfway/halfway.png
  alt: 'A screenshot of a stylized circular bar graph with yellow and green annular sectors and 180/360 in the middle.'
hero:
  imageSrc: /posts/free-threaded-python-halfway/halfway.png
  imageAlt: 'A screenshot of a stylized circular bar graph with yellow and green annular sectors and 180/360 in the middle.'
---

Here at Quansight we are celebrating a milestone in our work on community
support for free-threaded Python. 180 out of the 360 most-downloaded packages on
the [Python Package Index](https://pypi.org) (PyPI) that ship compiled wheels
now ship wheels that support the free-threaded build.

Why care about the 360 most-downloaded packages? What exactly is a compiled
wheel? Why does this milestone matter?

## Top 360 Projects Tracker

The first question is a little easier: 360 is an arbitrary choice. The reason we
care is it's used by a very nice
[tracker](https://hugovk.github.io/free-threaded-wheels) CPython core developer
[Hugo von Kemenade](https://github.com/hugovk) set up last year.

These sorts of automatically generated tracking pages serve as a community
dashboard and temperature gauge. It tells us how compatible the ecosystem is and
whether or not a build of Python is "ready" as judged by ecosystem maintainers
feeling comfortable to ship wheels to PyPI. As of February 19th, Hugo's tracker
officially passed the 50 percent mark: 180/360 tracked packages upload
free-threaded wheels to PyPI. While this blog post was being edited and sitting
in the queue a few more packages have been published: at time of writing 183 out
of the 360 most-downloaded packages that ship native wheels have free-threaded
wheels on PyPI.

## Quansight's role

As we've
[discussed](https://labs.quansight.org/blog/free-threaded-python-rollout)
[before](https://labs.quansight.org/blog/free-threaded-one-year-recap) on the
Quansight blog, our team has been at the center of the effort to support
free-threaded Python. That means we've developed a lot of know-how about porting
packages to support the free-threaded build. While we've done a lot, helping to
port packages in the scientific ecosystem like NumPy, SciPy and Pandas, bindings
generators like Cython, CFFI, and PyO3, and this year general-purpose Python
packages like sqlalchemy, cryptography, PyYAML, jupyterlab, and aiohttp.

Of course, we have not been the only people contributing towards this
effort. We've been delighted to see the number of packages gaining support for
the free-threaded build with no direct help from our team. There are far more
packages to port than any small group of developers could hope to port all by
themselves.

This is why we've been aiming to generate documentation and guides for future
developers who need to port extensions to support the free-threaded build. We've
published a rich set of documentation that we call the ["Free-threaded Python
Guide"](https://py-free-threading.github.io). CPython core developer and team
member Lysandros Nikolaou is also leading the process of [improving the CPython
documentation](https://github.com/python/cpython/issues/142518) to more
extensively cover multithreaded programming and describe the thread safety
guarantees of built-in data structures, the standard library, and the CPython C
API.

## Native extensions

This transition affects packages that depend on compiled Rust, C, C++, or
Fortran code and ship compiled binaries to PyPI. This is because the
free-threaded build forces compiled code to carefully consider thread
safety. The free-threaded build does not have a global lock that is held while
executing code in extensions. Many latent thread safety issues in extensions
are masked by limited use of multithreaded parallelism in the ecosystem and
the low probability of a GIL thread switch happening in such a way as to trigger
thread safety issues. In the free-threaded build, multithreaded parallelism is
much more likely to be used and unlucky thread switches are no longer necessary
to trigger latent races.

An example of code like this is a C extension that stores a cache that gets
initialized at runtime. Many extensions do this, and assume it is safe to store
cached values in global variables because the GIL is held while building a
cache. To make this pattern safe on the free-threaded build, caches need to be
initialized [using
APIs](https://doc.rust-lang.org/nightly/std/sync/struct.OnceLock.html) that
ensure the cache is filled by exactly one thread, with other threads blocked
until the cache is filled.

This is just one thread-unsafe pattern we've found in native extensions. We've
also documented several other patterns that we've come across and accompanying
suggested fixes. Additionally, we've published a porting guide focusing on
[patterns to make native code
thread-safe](https://py-free-threading.github.io/porting-extensions/).

For people writing new extensions: we encourage you to consider the
free-threaded build and take thread safety into account in the design of your
native code. If you use a bindings generator like pybind11, nanobind, Cython, or
PyO3, this is already taken care of for you. Additionally with PyO3, you can
rely on the safety guarantees of the Rust programming language to write code
that cannot lead to data races by construction.

## Where things stand now

When we first started this work, there were many, _many_ rough edges to working
with the free-threaded build. There are certainly still problems that need to be
solved, but if you've been nervous about trying out the free-threaded build due
to fears around single-threaded performance or stability: let me try to assuage
them a little. I've personally been using the free-threaded build for all my
day-to-day Python development. While free-threaded 3.14 is slightly slower than
GIL-enabled 3.14 in single-threaded use, I don't personally notice any
difference in my day-to-day work.

If you commonly write Python code that uses multiprocessing and run into issues
around serializing data to pickle files or another inter-process communication
format, then multithreading lets you completely bypass that complexity. Ideally,
you may also see improved performance over multiprocessing.

It's still early days with free-threaded Python in community packages, so it's
also possible you will see scaling issues. As a maintainer of several community
packages that support the free-threaded build: these are my favorite reports
from users.

## Our work in 2026 so far

Recently in NumPy, I've been working with CPython core developer [Kumar
Aditya](https://github.com/kumaraditya303) to improve the scaling of NumPy
"universal function" (ufunc) operations. After a [report from a user on
StackOverflow](https://stackoverflow.com/q/79851420/1382869), we identified and
fixed several scaling issues in NumPy and in CPython. In the end, we expect
multithreaded ufunc performance to be substantially improved in Python 3.15 and
NumPy 2.5, due out later this year. See [the NumPy
issue](https://github.com/numpy/numpy/issues/30494) about this topic for more
detail about this work and stay tuned for a blog post from Kumar with more
details about this optimization process.

Another team member, CPython core developer [Neil
Schemenauer](https://github.com/nascheme), has been focusing on [free-threaded
support](https://github.com/vllm-project/vllm/issues/28762) in
[vLLM](https://vllm.ai). Our team has been actively working to add support for
the free-threaded build in vLLM dependencies. Experiments have begun with
running vLLM under free-threaded Python. For inference workflows that have high
CPU overhead due to the need to execute Python code, free-threading should
provide performance benefits. It should allow multiple CPU cores to execute that
Python code concurrently. There may also be some significant memory savings if
large data structures can be shared between threads, rather than needing a copy
for each process.

We are also working towards enabling support for building extensions on the
free-threaded build that don't depend on the underlying Python version. This
will require updating CPython's [Stable
ABI](https://docs.python.org/3.15/c-api/stable.html#stable-application-binary-interface)
to support the different ABI on the free-threaded build. Work is actively
underway towards this in CPython, led by CPython core developer and PSF
developer-in-residence [Petr Viktorin](https://github.com/encukou). Gentoo
Developer [Michał Górny](https://github.com/mgorny/) and I are supporting Petr
by enabling automated [end-to-end
tests](https://github.com/Quansight-Labs/stable-abi-testing) of the new stable
ABI. Work is actively underway in [across the
ecosystem](https://github.com/Quansight-Labs/free-threaded-compatibility/issues/310)
to enable extension authors to streamline their release process and ease support
for new platforms. Kumar Aditya is also working on [enabling support for the
free-threaded stable ABI in NumPy](https://github.com/numpy/numpy/issues/30704),
so that projects that depend on the NumPy C API can ship wheels using the new
ABI tag.

## How you can help

We need help from the community to bring the remaining 50% of the most popular
packages and the long tail of less-popular Python packages to support the
free-threaded build. If packages you depend on do not yet support the
free-threaded build, now is a good time to look at enabling that support.

If you do not know low-level programming languages, you can still help out by
testing packages. If packages in your dependency tree re-enable the GIL, run
Python with `python -Xgil=0` or with `PYTHON_GIL=0` set in your shell
environment. This will prevent the GIL from being enabled and runtime. It may
also lead to crashes or inconsistent results if you spawn threads and trigger
some sort of issue, but in my experience, it is more likely that things will
"just work" unless you are intentionally doing something unsafe to break a
package. Multithreaded workflows with no mutation of shared data structures will
often work "out of the box".

If you discover problems in your testing, you can let the developers of packages
you depend on know that you would like them to support the free-threaded build
and give examples of real-world use cases that might benefit. Reports with
instructions how to trigger data corruption, crashes, or set up situations
where multithreaded parallelism is slower than multiprocessing are particularly
useful.

Although some work to support the free-threaded build involves touching C, C++,
or Rust code, pure Python programming skills are all you need for many
libraries. In our experience, most libraries that do not support the
free-threaded build have zero or close to zero multithreaded testing
coverage. This means many thread safety issues are possible, even with the
GIL. Having test coverage and documentation for supported multithreaded use of a
library makes porting the code to support the free-threaded build much easier.

That means if you use, contribute to, or maintain a Python library and it does
not yet have multithreaded tests or continuous integration test coverage on the
free-threaded build, you can help out by adding tests and adding the
free-threaded build to testing matrices. This includes pure-python libraries,
particularly if you have packages that ship native code in your dependency tree.

If you _do_ have low-level programming knowledge, this is a great opportunity to
contribute to community projects. Once multithreaded tests exist, you can try
running with [LLVM's thread
sanitizer](https://py-free-threading.github.io/thread_sanitizer/) to trigger
races in extensions and report issues you find. Note that some libraries [like
NumPy](https://numpy.org/devdocs/reference/thread_safety.html#thread-safety) do
not enforce thread-safety for mutable data structures, so it is possible to
trigger races with incorrect use. That is one reason it is so helpful to have
multithreaded tests in test suites: it gives us correct code to run with thread
sanitizer.

No matter your level of experience, please come and chat with us [on
GitHub](https://github.com/quansight-labs/free-threaded-compatibility) or [on
discord](https://discord.gg/rqgHCDqdRr) for help and advice.
