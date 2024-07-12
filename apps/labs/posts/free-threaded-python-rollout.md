---
title: 'Free-threaded CPython is ready to experiment with!'
authors: [ralf-gommers]
published: July 11, 2024
description: 'An overview of the ongoing efforts to improve and roll out support for free-threaded CPython throughout the Python open source ecosystem'
category: [Community, PyData ecosystem]
featuredImage:
  src: /posts/packaging_painpoints_in_2021/blog_feature_org.png
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/packaging_painpoints_in_2021/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

First, a few announcements:

Yesterday, [py-free-threading.github.io](https://py-free-threading.github.io/) launched!
It's both a resource with documentation around adding support for free-threaded
Python, and a status tracker for the rollout across open source projects in the
Python ecosystem. We hope and expect both of these to be very useful, with the
status tracker providing a one-stop-shop to check the support status of the
dependencies of your project (e.g., "what was the first release of a package on
PyPI to support free-threaded Python?" or "are there nightly wheels and where
can I find them?") and get an overview of ecosystem-wide progress.

![Tracker for package compatibility with free-threaded CPython](/posts/py_free_threading_tracker.png)

Later today, the Birds-of-a-Feather session
["Supporting free-threaded Python"](https://cfp.scipy.org/2024/talk/HDR7WZ/)
will be held at the SciPy 2024 conference (co-organized by one of our team
members, Nathan Goldbaum, together with Madicken Munck), focusing on knowledge
and experience sharing.


## Free-threaded CPython - what, why, how?

You may be wondering by now what "free threading" or "free-threaded CPython"
is, and why you should care. In summary: it is a major change to CPython that
allows running multiple threads in parallel within the same interpreter. It is
becoming available as an experimental feature in CPython 3.13. A free-threaded
interpreter can run with the global interpreter lock (GIL) disabled - a
capability that is finally arriving as a result of the efforts that went into
[PEP 703 - Making the Global Interpreter Lock Optional in CPython](https://peps.python.org/pep-0703/).

Why? Performance. Multi-threaded performance. It makes it significantly easier
to write code that efficiently runs in parallel and will utilize multiple CPU
cores effectively. The core count in modern CPUs continue to grow, while clock
speeds do not grow, so multi-threaded performance will continue to grow in
importance.


## Sounds awesome - what's the catch?

Implementing free-threading in CPython itself is a massive effort already, and
worthy of its own (series of) blog post(s). For the wider ecosystem, there's
also a ton of work involved, mainly due to two problems:

1. Thread-safety. While pure Python code should work unchanged, code written in
   other languages or using the CPython C API may not. The GIL was implicitly
   protecting a lot of thread-unsafe C, C++, Cython, Fortran, etc. code - and
   now it no longer does. Which may lead to all sorts of fun outcomes (crashes,
   intermittent incorrect behavior, etc.).
2. ABI incompatibility between the default and free-threaded CPython builds.
   The result of a free-threaded interpreter having a different ABI is that
   each package that has extension modules must now build extra wheels.

Out of these two, the thread-safety one is the more hairy problem. Having to
implement and maintain extra wheel build jobs is not ideal, but the work itself
is well-understood - it just needs doing for each project with extension
modules. Thread-safety on the other hand is harder to understand, improve,
and even test reliably. Because multithreaded code is usually sensitive to the
timing of how multiple threads run and access shared state, bugs may manifest
rarely. And a crash or failure that is hard to reproduce locally is
harder to fix then one that is always reproducible.

Here are a couple of examples of such intermittent failures:

[numpy#26690](https://github.com/numpy/numpy/issues/26690) shows an example
where a simple call to the `.sum()` method of a numpy array fails with a
fairly mysterious
```
RuntimeError: Identity cache already includes the item.
```
when used with the Python `threading` and `queue` modules. This was noticed
in a scikit-learn CI job - it never failed in NumPy's own CI (scikit-learn has
more tests involving parallelism). After the bug report with a reproducer was
submitted, the fix to a numpy-internal cache wasn't that hard.

[pywavelets#758](https://github.com/PyWavelets/pywt/issues/758) was a report
of another fairly obscure failure in a test using `concurrent.futures`:
```
TypeError: descriptor '__enter__' for '_thread.RLock' objects doesn't apply to a '_thread.lock' object
```
That looked a lot like a problem in CPython, and after some investigating it
was found there as well [cpython#121368](https://github.com/python/cpython/issues/121368)
and fixed fairly quickly (the fix required some deep expertise in both CPython
internals and multithreaded programming in C though).

There are a fair amount of examples like that, e.g. [undefined behavior in
Cython code](https://github.com/PyWavelets/pywt/pull/753#issuecomment-2190335170) that
no longer worked due to changes in CPython 3.13, a [crash from C code in
`scipy.signal`](https://github.com/scipy/scipy/issues/21142) that hadn't been
touched for 24 years (it was always buggy, but the GIL offered enough
protection), and a [crash in Pillow](https://github.com/hugovk/Pillow/pull/123)
due to [Python C API usage that wasn't
supported](https://github.com/python/cpython/issues/121403).

It's encouraging though that issues like the ones above do get understood and
resolved fairly quickly. With a good test strategy, and over time also test
suites of libraries that cover Python-level threading better (such tests are
largely non-existent now in most packages), detecting or guarding against
thread-safety issues does seem doable. That test strategy will have to be
multi-pronged: from writing new tests and running tests in loops with `pytest-repeat` &
co., to getting [ThreadSanitizer](https://clang.llvm.org/docs/ThreadSanitizer.html)
to work in CI and doing integration-level and real-world testing with users.


## The road ahead & what our team will be working on

Free-threaded CPython becoming the default, and eventually the only, build of
CPython is several years away. What we're hoping to see, and help accomplish,
is that for Python 3.13 many projects will work on compatibility and start
releasing `cp313t` wheels on PyPI (and possibly nightly builds too, for projects
with a lot of dependencies), so users and packages further downstream can start
experimenting as well. After a full year of maturing support in the ecosystem
and further improvements in performance in CPython itself, we should have a
good picture of both the benefits and the remaining challenges with robustness.

Our team (currently [Nathan](https://github.com/ngoldbaum),
[Ken Jin](https://github.com/Fidget-Spinner),
[Lysandros](https://github.com/lysnikolaou/),
[Edgar](https://github.com/andfoy/), and
[myself](https://github.com/rgommers/)) has now been working on this topic for
a few months, starting at the bottom of the PyData stack (most effort so far
has gone to NumPy, Cython, and CPython), and slowly working our way up from
there.

For each package, the approach has been similar so far - and a lot of that can
be used as a template by others we think. The steps are roughly:

1. Add a first CI job, usually Linux x86-64 with the latest Python 3.13
   pre-release candidate, and ensure the test suite passes,
2. Based on knowledge from maintainers, fix known issues with thread-safety and
   shared/global state in native code,
3. Add free-threaded support to the wheel build CI jobs, and start uploading
   nightly wheels (if appropriate for the project),
4. Do some stress testing locally and monitor CI jobs, and fix failures that
   are observed (take the opportunity to add regression tests using `threading`
   or `concurrent.futures.ThreadPoolExecutor`)
5. Mark extension modules as supporting running without the GIL
6. Move on to a next package (e.g., a key dependency) and using its test suite
   to exercise the first package more, circling back to fix issues or address
   follow-up actions as needed.

Our main takeaway so far: it's challenging, but tractable! And fun as well:)

We've only just scratched the surface, there'll be a lot to do - from key
complex packages like PyO3 (of key importance for projects using Rust) and
PyTorch, to the sheer volume of smaller packages with extension modules.
The lessons we are learning, as far as they are reusable, are going into the
documentation at
[py-free-threading.github.io](https://py-free-threading.github.io).

Furthermore, we'd like to spend time on whatever may be impactful in helping
the ecosystem adopt free-threaded CPython, from answering questions
to helping with debugging - please don't hesitate to reach out or ping us on
GitHub!


## Conclusion & acknowledgements

We're really excited about what is becoming possible with free-threaded CPython!
While our team is busy with implementing CI jobs and fixing thread-safety issues,
we are as curious as anyone to see what performance improvements and
interesting experiments are going to show up with real-world code soon.

It's hard to acknowledge and thank everyone involved in moving free-threaded
CPython forward, because so much activity is happening. First of all we have
to thank Meta for funding the efforts of our team to help the ecosystem adopt
free-threaded CPython at the pace that will be needed to make this whole
endeavour a success, and Sam Gross and the whole Python Runtime team at Meta
for the close collaboration. Then the list is long - from the Python Steering
Council, for its thoughtful approach to (and acceptance of) PEP 703, to the
many library maintainers and community members who are proactively adding
support to their own projects or guide and review our contributions whenever we
work on projects we are not ourselves maintainers of.

