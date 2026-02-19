---
title: 'Halfway on the path to community support for free-threaded Python'
authors: [nathan-goldbaum]
published: Feb 19, 2025
description: 'Marking the halfway point on community support in popular packages for free-threaded Python'
category: [Community, PyData ecosystem]
featuredImage:
  src: /posts/free-threaded-python-halfway/halfway.png
  alt: 'A screenshot of a stylized circular bar graph with yellow and green annular sectors and 180/360 in the middle.'
hero:
  imageSrc: /posts/free-threaded-python-halfway/halfway.png
  imageAlt: 'A screenshot of a stylized circular bar graph with yellow and green annular sectors and 180/360 in the middle.'
---

Here at Quansight we are celebrating a milestone in our work on community support for free-threaded Python. 180 out of the 360 most-downloaded packages on the [Python Package Index](https://pypi.org) (PyPI) that ship compiled wheels now ship wheels that support the free-threaded build.

Why care about the 360 most-downloaded packages? And what exactly is a compiled wheel and why does this milestone matter?

## Top 360 Projects Tracker

The first question is a little easier: 360 is a an arbitrary choice. The reason we care is it's used by a very nice [tracker](https://hugovk.github.io/free-threaded-wheels) CPython core developer [Hugo von Kemenade](https://github.com/hugovk) set up last year.

These sorts of automatically generated tracking pages serve as a community dashboard and temperature gauge. It tells us how compatible the ecosystem is and whether or not a build of Python is "ready" as judged by ecosystem maintainers feeling comfortable to ship wheels to PyPI.

## Native extensions

While this transition is comparable to the Python 2 to 3 transition, it is also directly affects a much smaller fraction of the community: packages that depend on compiled Rust, C, C++, or Fortran code and ship compiled binaries to PyPI. This is because the free-threaded build forces compiled code to carefully consider thread safety. The free-threaded build does not have a global lock that is held while executing code in extensions. While thread-unsafe extensions have always been possible, code that was perhaps questionable but definitely safe before is now definitely unsafe, and it is necessary to update extensions to support free-threaded Python. An example of code like this is a C extension that stores state in a global variable. We found that this is a common pattern for many C and C++ extensions.

## Quansight's role

As we've [discussed](https://labs.quansight.org/blog/free-threaded-python-rollout) [before](https://labs.quansight.org/blog/free-threaded-one-year-recap) on the Quansight blog, our team has been at the center of the effort to support free-threaded Python. That means we've developed a lot of know-how about porting packages to support the free-threaded build. While we've done a lot, helping to port packages in the scientific ecosystem like NumPy, SciPy and Pandas, bindings generators like Cython, CFFI, and PyO3, and this year general-purpose Python packages like sqlalchemy, cryptography, PyYAML, jupyterlab, and aiohttp.

Of course we have not been the only people contributing towards this effort. We've been delighted to see the number of packages gaining support for the free-threaded build with no direct help from our team. There are far more packages to port than any small group of developers could hope to port all by ourselves.

This is why we've been aiming to generate documentation and guides for future developers who need to port extensions to support the free-threaded build. We've published a rich set of documentation that we call the ["Free-threaded Python Guide"](https://py-free-threading.github.io). CPython core developer and team member Lysandros Nikolaou is also leading the process of [improving the CPython documentation](https://github.com/python/cpython/issues/142518) to more extensively cover multithreaded programming and describe the thread safety guarantees of built-in data structures, the standard library, and the CPython C API.

## Where things stand now.

When we first started this work there were many, _many_ rough edges to working with the free-threaded build. There are certainly still problems that need to be solved, but if you've been nervous about trying out the free-threaded build due to fears around single-threaded performance or stability: let me try to assuage them a little.

I've personally been using the free-threaded build for all my day-to-day Python development. While free-threaded 3.14 is slightly slower than GIL-enabled 3.14 in single-threaded use, I don't personally notice any difference.

If you commonly write Python code that uses multiprocessing and run into issues around serializing data to pickle files or another inter-process communication format, then multithreading lets you completely bypass that complexity. Ideally, you may also see improved performance over multiprocessing. It's still early days with free-threaded Python in community pacakges, so it's also possible you will see scaling issues. As a maintainer of several community packages that support the free-threaded build: these are my favorite reports from users.

## Looking towards the future

Recently in NumPy, I've been working with CPython core developer [Kumar Aditya](https://github.com/kumaraditya303) to improve the scaling of NumPy "universal function" (ufunc) operations. After a [report from a user on StackOverflow](https://stackoverflow.com/q/79851420/1382869) we identified and fixed a number of scaling issues in NumPy and in CPython. In the end, we expect multithreaded ufunc performance to be substantially improved in Python 3.15 and NumPy 2.5, due out later this year. Stay tuned for a blog post from Kumar with more detail about this optimization process.

Another team member, CPython core developer [Neil Schemenauer](https://github.com/nascheme), has been focusing on [free-threaded support](https://github.com/vllm-project/vllm/issues/28762) in [vLLM](https://vllm.ai). Our team has been actively working to add support for the free-threaded build in vLLM dependencies and it is now possible to begin experiments with the free-threaded build. We are hopefully that inference workflows that have high CPU overhead due to the need to execute Python code will see substantial improvements.

We are also working towards enabling support for building extensions on the free-threaded build that don't depend on the underlying Python version. This will require updating CPython's [Stable ABI](https://docs.python.org/3.15/c-api/stable.html#stable-application-binary-interface) to support the different ABI on the free-threaded build. Work is actively underway towards this in CPython, led by CPython core developer and PSF developer-in-residence [Petr Viktorin](https://github.com/encukou). We are supporting Petr by enabling [end-to-end tests](https://github.com/Quansight-Labs/stable-abi-testing) of the new stable ABI. Work is actively underway in [across the ecosystem](https://github.com/Quansight-Labs/free-threaded-compatibility/issues/310) to enable extension authors to streamline their release process and ease support for new platforms.

## How you can help

We need help from the community to bring the remaining 50% of the most popular packages and the even more daunting long tail of less-popular python packages to support the free-threaded build. If packages you depend on do not yet support the free-threaded build, now is a good time to look at enabling that support.

If you do not have knowledge of low-level programming languages, you can still help out by testing packages. If packages in your dependency tree re-enable the GIL, tun python with `python -Xgil=0` or with `PYTHON_GIL=0` set in your shell environment. This will prevent the GIL from being enabled and runtime. It may also lead to crashes or inconsistent results if you spawn threads and trigger some sort of issue, but in my experience, it is more likely that things will "just work" unless you are intentionally doing something unsafe to break a package. Workflows with no mutation of shared data structures will often work "out of the box".

If you discover problems in your testing, you can let the developers of packages you depend on know that you would like them to support the free-threaded build and give examples of real-world use-cases that might benefit. Reports where multithreaded parallelism is slower than multiprocessing or where multithreaded workflows lead to crashes or data corruption are always interesting to dive into and resolve.

Additionally, Python programming skills are very useful to improve support for multithreading. In our experience, most libraries that do not support the free-threaded build have zero or close to zero multithreaded testing coverage. This means many thread safety issues are possible, even with the GIL. Having test coverage and documentation for supported multithreaded use of a library makes porting the code to support the free-threaded build much easier.

If you _do_ have low-level programming knowledge, this is a great opportunity to contribute to community projects. Once multithreaded tests exists, you can try running with [LLVM's thread sanitizer](https://py-free-threading.github.io/thread_sanitizer/) to trigger races in extensions.

No matter your level of experience, please come and chat with us [on GitHub](https://github.com/quansight-labs/free-threaded-compatibility) or [on discord](https://discord.gg/rqgHCDqdRr) for help and advice.
