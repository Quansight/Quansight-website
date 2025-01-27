---
title: 'Enhancing Developer Experience at SciPy - Intel oneAPI/MSVC Support and Migrating to spin'
published: December 19, 2024
authors: [gagandeep-singh]
description: 'Highlights the work done to improve developer experience at SciPy, specifically on supporting Intel oneAPI/MSVC and spin'
category: [Developer workflows]
featuredImage:
  src: /posts/intel-oneapi-msvc-spin-scipy/scipy_logo_img_featured.png
  alt: 'SciPy logo'
hero:
  imageSrc: /posts/intel-oneapi-msvc-spin-scipy/scipy_logo_img_hero.png
  imageAlt: 'SciPy logo'
---

In this blog post, we will be sharing the work we did to enhance developer experience at SciPy. We worked on two major things,

1. Intel oneAPI and MSVC Support in SciPy
2. Moving away from `dev.py` and migrating to `spin`.

First, let me share the motivation behind these.

Intel offers a complete toolkit for high performance computing (HPC), numerical computing use cases. It goes by the name of [oneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/overview.html). It provides, ICX (for C), ICPX (for C++), IFX (for Fortran) and Math Kernal Library (MKL for optimized math routines like BLAS, LAPACK, fast FFT, etc.) [[1]](https://en.wikipedia.org/wiki/Math_Kernel_Library). Since, SciPy caters to HPC and numerical computing use cases, so supporting building SciPy with Intel oneAPI is a natural requirement. In fact, users reported segmentation fault in `arpack` with `ifx` [[gh-20728]](https://github.com/scipy/scipy/issues/20728) and `scipy.linalg.solve` crash when used with Intel oneAPI on Windows 11 [[gh-21997]](https://github.com/scipy/scipy/issues/21997) are two such examples. Therefore we decided to work on this to enhance the experience of SciPy users who use Intel oneAPI as their toolkit. Regarding MSVC, since it is the de-facto compiler for C/C++ on Windows. So adding support for it is again a natural requirement and also a must.

Now let's see why we decided to spin from `dev.py` to `spin` (pun inteded). `dev.py` (or `do.py` [[2]](https://labs.quansight.org/blog/the-evolution-of-the-scipy-developer-cli)) was added to improve the experience for SciPy developers. Basically, it offers better documentation for the various commands needed (like, `build`, `test`, `shell`) while working on SciPy codebase. It has better looking CLI outputs. However, with time several issues with `dev.py` were reported. For example, in some cases, doit based dev interface interferes with pdb command history [[gh-16452]](https://github.com/scipy/scipy/issues/16452), `dev.py` giving problems in a Windows CI environment because of emojis usage in dev.py [[gh-18046]](https://github.com/scipy/scipy/issues/18046), and dev.py unable to resolve homebrew installed Python correctly [[gh-18998]](https://github.com/scipy/scipy/issues/18998). `spin` easily fixes this issues. [[3]](https://github.com/scipy/scipy/pull/21674), especially those issues arising due to `doit`. `dev.py` depends on `doit` but `spin` doesn't. Also, since `spin` is used by many other projects, so all the improvements in `spin` due to the issues reported by their maintainers will directly benefit SciPy.

#### Intel oneAPI Support in SciPy

Intel offers oneAPI - a complete toolkit for HPC use cases. It has ICX (for C), ICPX (for C++), IFX (for Fortran) and MKL (an OpenBLAS alternative). We targeted two operating systems, Windows and Linux. `CI: adding a Windows CI job with MSVC + MKL + Intel Fortran (ifx)` [[gh-20878](https://github.com/scipy/scipy/issues/20878)] was the starting point. Solving this issue meant, avoiding regressions with MSVC and Intel oneAPI in SciPy. This issue also links [gh-20728](https://github.com/scipy/scipy/issues/20728). The author of this issue is building SciPy with `icx`, `icpx`, `ifx` and using MKL for BLAS and LAPACK. So a complete usage of Intel oneAPI. In addition, failure to build scipy with msvc [[gh-20860]](https://github.com/scipy/scipy/issues/20860) is related to build failure of SciPy with MSVC. We started off by fixing these two.

One major issue with MSVC is that its support for handling arrays on stack (with runtime sizes) is limited. Expressions like, `std::complex<double> cwrk[n];` fail to compile with MSVC unless `n` is a constant. So we did runtime allocation on heap (using `new`) and performed `delete` at the end to free memory. This is a manual approach of handling memory, however this is the only solution which works with MSVC. It was the only option that we went ahead with. On a side note, Clang due to LLVM backend doesn't have this limitation. After fixing this issue we added a CI job with MSVC + `ifx` + OpenBLAS combination. This helped in avoiding future regression with MSVC build of SciPy. It was also a first step towards supporting Intel oneAPI toolkit entirely.

Now coming on to the `arpack` issue. Fixing this issue required supporting building SciPy with Intel oneAPI. On Linux the `arpack` issue was already resolved. However, there were some other issues with `ifx`. For example, `test_equal_bounds` test in `scipy/optimize/tests/test_optimize.py` failed due to floating point issues with `ifx`. Also tolerances for other tests had to be increased (i.e., slight lesser accuracy/precision in order to make things with `ifx`). All of this was done in `BUG/CI: Compile and run tests with `ifx`+`MKL` on Linux` [[gh-21173]](https://github.com/scipy/scipy/pull/21173). I also added a CI job in this PR with `gcc` + `g++` +`ifx` + `MKL` combination. A second steps towards supporting Intel oneAPI with SciPy.

The final checkpoint for Intel oneAPI was `CI: Test icx + icpx + ifx + MKL build of SciPy` [[gh-21254]](https://github.com/scipy/scipy/pull/21254). Here we replaced `gcc` with `icx` and `g++` with `icpx` and TADA, it worked on Linux. Regarding Windows, we are still at `MSVC` + `ifx` + `OpenBLAS` combination because of the `arpack` import error. We tried several ways to fix it but all resulted in a dead end. We tried to build NumPy with `icx`, `icpx` but `icx` is unable to compile NumPy code as is. Some workarounds had to be made. However, still it didn't work for us.

#### Moving away from `dev.py` and migrating to `spin`

Before diving into the details of this work, I would first share some information (for context) related to `meson`. Basically,`meson` builds a project in three steps,

1. First step is that it calls `meson setup` which does configuration for building the project. If you are a CMake user then its just like calling, `cmake .` in a project.
2. Second step involves calling `meson compile` which executes the compiler commands and creates libraries. Again if you are `cmake` + `make` user then its like calling, `make` or `make -j8`.
3. Third step is finally calling, `meson install` which installs the libraries, source files (for python) in the installation directory.

Now it would be easy to understand our work below.

We decided to shift to `spin` because of the several issues reported in `dev.py`. For example, [doit interfering with command history of pdb] [[gh-16452]](https://github.com/scipy/scipy/issues/16452), usage of emojis giving issues in a Windows CI environment [[gh-18046]](https://github.com/scipy/scipy/issues/18046), and dev.py unable to resolve homebrew installed Python [[gh-18998]](https://github.com/scipy/scipy/issues/18998). A bunch of those are due to `doit` being a dependency of `dev.py`. One nice feature of `spin` is it has lesser dependencies. This means, lesser bugs because more dependencies means more points of failure. The tradeoff here is to compromise looks and feel of the output a little bit to avoid problems while developing SciPy.

One can ask this question, "Why not just update `dev.py` to fix the above issues? Why not just make `dev.py` lite weight instead of moving to a new third party tool?". Well, `spin` is being used by many scientific computing projects like, `numpy`, `scikit-image`, `solcore5`, `skmisc`, `PyFVS`, `sktree`, `dipy` and the list is still updating (refer, [[scientific-python/spin#62]](https://github.com/scientific-python/spin/issues/62)). Therefore, improvements made in `spin` will be automatically beneficial to SciPy. In addition, whatever limitations we find in `spin`, we will make improvements to it via Pull Requests. So, its a two way connection, SciPy benefiting from other projects (via `spin`) and other projects receiving enhancements from SciPy (via `spin`).

Let me share three signifcant examples to show case this two way connection I talked about,

1. `spin` didn't have support for passing arguments to `meson compile` and `meson install` - `spin` used to pass all `meson` arguments (via `--` in `spin build` command) only to `meson setup` step. SciPy passes arguments to `meson install` as well (for example, `--tags` - see, [gh-20712](https://github.com/scipy/scipy/pull/20712)). So we needed a way to forward arguments from SciPy to `meson` via `spin`. I opened, a PR to accept CLI arguments for `meson compile` and `meson install` [[scientific-python/spin#256]](https://github.com/scientific-python/spin/pull/256) (merged now), we added two keyword arguments `meson_compile_args` and `meson_install_args` in `build` subcommand. These two are empty by default (for backwards compatibility). If specified then will go to their respective `meson` build steps. This is one example where `spin` was enhanced due to a requirement of SciPy.

2. With `spin` we are able to use lesser code to implement the `dev.py` functionality - `spin` has `spin.util.extend_command` decorator. This helps in extending `spin` commands (like, `spin build`, `spin test`, etc) in the user project (in our case SciPy). The idea is to use this decorator in SciPy and implement checks needed for SciPy. Then call `spin`'s implementation to execute the common logic. This addition in `spin` reduced the code size by 44% (as compared to `dev.py`). This reduces the code surface area - meaning lesser bugs. This is one example where SciPy got benefitted due to an improvement in `spin`. Also, another good reason to shift to `spin`.

3. Corrupt linker path of shared library on macOS due to specification `--destdir` in `meson install` step - We were facing this issue when we used `spin` to build SciPy (after implementing the prototype in [gh-21674](https://github.com/scipy/scipy/pull/21674)). When we did, `spin test`, then it was unable to load, `libsf_error_state.dylib` on macOS. One cause for this issue is that `spin` sets `/usr` or `C:\` as default value for `--prefix`. It also specifies `--destdir` in `meson` install step. `--destdir` is meant for packaging, as an actual staging area, while for spin the final install directory is `build-install` (by default), and therefore there is no intent to later put this package into /usr`or`C:\`. Hence we removed `--destdir` usage and set `--prefix` to installation directory. Here's the pull request, [scientific-python/spin#257](https://github.com/scientific-python/spin/pull/257) which fixes this issue.

`DEV: use `spin` (prototype)` [[gh-21674]](https://github.com/scipy/scipy/pull/21674) is close to merging. We are waiting for [scientific-python/spin#257](https://github.com/scientific-python/spin/pull/257) to be merged. Once in, we are ready to start using `spin` in SciPy. The SciPy CI is using `spin` in the above PR. So our work is completely tested. Here's the current status of how `spin` usage looks like,

**SciPy build experience with `spin` and `dev.py`**

**With `dev.py`**

<script src="https://asciinema.org/a/RrtqCRlxIaA6pNS6BQchJyUmN.js" id="asciicast-RrtqCRlxIaA6pNS6BQchJyUmN" async="true"></script>

**With `spin`**

<script src="https://asciinema.org/a/FJzWyQun71g796n5kFI1l6dxv.js" id="asciicast-FJzWyQun71g796n5kFI1l6dxv" async="true"></script>

As you can see there is no difference between look and feel of `python dev.py build` and `spin build`. It works exactly the same. However, the issues which were there with `dev.py` are not observed with `spin`. Take a look at the following videos,

**`spin` keeps pdb command history intact while `dev.py` interferes with it [[gh-16452]](https://github.com/scipy/scipy/issues/16452)**

**With `dev.py`**

<script src="https://asciinema.org/a/shvsE0PfbGMsviuthoKfIQlI6.js" id="asciicast-shvsE0PfbGMsviuthoKfIQlI6" async="true"></script>

**With `spin`**

<script src="https://asciinema.org/a/wcwYTiPQzey2uYt1082w63Rgz.js" id="asciicast-wcwYTiPQzey2uYt1082w63Rgz" async="true"></script>

As you can see `spin` usage doesn't interfere with PDB's history. This issue was there with `dev.py`.

**Using homebrew installed Python to build SciPy [[gh-18998]](https://github.com/scipy/scipy/issues/18998) - `dev.py` vs `spin`**

<script src="https://asciinema.org/a/aZstdaf6B6nlkW9JFccT7z7Dr.js" id="asciicast-aZstdaf6B6nlkW9JFccT7z7Dr" async="true"></script>

The above video showcases how `spin` works fine with Homebrew installed Python 3.10. The build completes. However, `dev.py` fails because it is unable to resolve paths correctly.
