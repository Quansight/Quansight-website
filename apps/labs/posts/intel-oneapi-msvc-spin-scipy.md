---
title: 'Enhancing Developer Experience at SciPy - Intel oneAPI/MSVC Support and Migrating to spin'
published: March 20, 2025
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

Over the past year, we worked on enhancing the development experience of SciPy. We focused on two key areas:

1. Intel oneAPI and MSVC Support in SciPy
2. Transitioning from `dev.py` to `spin`

First, let’s explore the motivation behind these updates.

Intel provides a comprehensive toolkit for high-performance computing (HPC) and numerical computing use cases, known as [oneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/overview.html).
SciPy is heavily used in HPC and numerical computing.
Adding support for SciPy builds with Intel oneAPI was a natural and important step to improve the experience for SciPy users who rely on Intel oneAPI as their primary toolkit.
Additionally, since MSVC is the de facto compiler for C/C++ on Windows, we added continuous integration (CI) jobs to test SciPy compilation with MSVC, further expanding the compatibility of SciPy across platforms.

Now, let’s talk about the transition from `dev.py` to `spin`.
`dev.py` (also known as `do.py`, learn more in [The evolution of the SciPy developer CLI](https://labs.quansight.org/blog/the-evolution-of-the-scipy-developer-cli)) was a significant step forward in improving the development workflow.
However, `spin` builds on `dev.py`, taking inspiration from its design while generalizing the interface to work with a wider range of projects without the need for heavy customization.
As a result, SciPy will directly benefit from the improvements made in `spin` and vice versa.
Moreover, `spin` offers an additional benefit: contributors familiar with `numpy` will find it easier to navigate, thanks to the shared foundation and streamlined approach.

Through these updates, we aim to provide a smoother and more flexible development experience for both current and new contributors to SciPy.

#### Intel oneAPI Support in SciPy

Intel offers oneAPI, a comprehensive toolkit designed for high-performance computing (HPC) applications.
It includes essential components such as `icx` (for C), `icpx` (for C++), `ifx` (for Fortran), and [MKL (Math Kernel Library)](https://en.wikipedia.org/wiki/Math_Kernel_Library), which provides optimized mathematical routines like BLAS, LAPACK, and fast FFTs.
For our efforts, we targeted both Windows and Linux operating systems.

Our journey began with the task of adding a Windows CI job to support MSVC + MKL + `ifx` [[gh-20878](https://github.com/scipy/scipy/issues/20878)].
This was critical to ensure that SciPy could compile correctly with Intel oneAPI and MSVC, preventing any regressions.
This issue also references [gh-20728](https://github.com/scipy/scipy/issues/20728), where the author is building SciPy using `icx`, `icpx`, `ifx`, and MKL, leveraging the full Intel oneAPI toolkit.
Additionally, the failure to build SciPy with MSVC [[gh-20860]](https://github.com/scipy/scipy/issues/20860) pointed to specific build challenges with MSVC.
We began by addressing these two issues.

One notable challenge with MSVC is its limited support for handling runtime-sized arrays on the stack.
For example, expressions like `std::complex<double> cwrk[n];` fail to compile unless `n` is a constant.
To work around this, we opted for dynamic memory allocation on the heap, using `new`, ensuring proper memory deallocation with `delete` at the end.
While this approach is manual, it remains the only viable solution with MSVC.
Interestingly, Clang (due to its LLVM backend) does not have this limitation, making it more flexible in this regard.

Once we addressed this issue, we added a CI job to test SciPy's compilation with MSVC + `ifx` + OpenBLAS, which helped prevent future regressions in the MSVC build.
This also marked an early step toward supporting Intel oneAPI within SciPy.

The next major hurdle involved the [`arpack`](https://github.com/opencollab/arpack-ng) issue (learn more in [gh-20728](https://github.com/scipy/scipy/issues/20728)), which required full Intel oneAPI support to resolve.
On Linux, the issue was already fixed. However, there were still some challenges when using `ifx`, such as the failure of the `test_equal_bounds` test in `scipy/optimize/tests/test_optimize.py` due to floating-point discrepancies.
To address this, we increased tolerances for several tests to accommodate the slightly reduced accuracy/precision when using `ifx`.
This was all handled in the PR, `BUG/CI: Compile and run tests with ifx + MKL on Linux` [[gh-21173]](https://github.com/scipy/scipy/pull/21173), where I also added a CI job to test the combination of `gcc` + `g++` + `ifx` + MKL on Linux, marking another important step toward full Intel oneAPI support for SciPy.

The final milestone for Intel oneAPI support was the CI job for testing SciPy with `icx`, `icpx`, `ifx`, and MKL [[gh-21254]](https://github.com/scipy/scipy/pull/21254).
In this step, we replaced `gcc` with `icx` and `g++` with `icpx`, and the build successfully passed on Linux.

However, on Windows, we were unable to proceed further due to an unresolved import error with `arpack`.
Despite several attempts to fix the issue, all solutions led to dead ends. As it was turning into an unbounded amount of work, we decided to pause the effort on Windows and focus on more scoped tasks.

Through these efforts, we’ve made significant strides in integrating Intel oneAPI with SciPy, ensuring better support for both Linux and Windows platforms.
While there are still challenges ahead, the progress made provides a solid foundation for future development.

#### Moving away from `dev.py` and migrating to `spin`

Before diving into the details of our work, it’s important to provide some context on **Meson** — the build system we’re using. Meson builds a project in three main steps:

1. **Configuration**: The first step involves running `meson setup`, which configures the project for building. If you’re familiar with CMake, this is similar to calling `cmake .` in a project.

2. **Compilation**: Next, we run `meson compile`, which executes the compiler commands and generates the necessary libraries. For users familiar with `make`, this step is equivalent to running `make` or `make -j8`.

3. **Installation**: Finally, `meson install` installs the compiled libraries and source files (for Python) into the installation directory.

With this context in place, let's dive into the specifics of the work we did.

We decided to transition from `dev.py` to `spin` due to a series of issues reported with `dev.py`. For example:

- [doit interfering with the command history of pdb](https://github.com/scipy/scipy/issues/16452)
- Emoji rendering issues in the Windows CI environment [[gh-18046](https://github.com/scipy/scipy/issues/18046)]
- Inability of `dev.py` to resolve Homebrew-installed Python [[gh-18998](https://github.com/scipy/scipy/issues/18998)]

Many of these problems stem from `doit`, which is a dependency of `dev.py`.
One of the advantages of `spin` is that it has fewer dependencies, which in turn means fewer points of failure.
While this trade-off sacrifices some of the output’s polish, it greatly improves the reliability of the development process for SciPy.

You might wonder, "Why not just update `dev.py` to fix these issues? Why switch to a new third-party tool like `spin`?"

One of the key reasons is that **`spin` is already widely used by other scientific computing projects** such as `numpy`, `scikit-image`, `solcore5`, `skmisc`, `PyFVS`, `sktree`, `dipy`, and many more (refer to [scientific-python/spin#62](https://github.com/scientific-python/spin/issues/62)).
This means improvements made to `spin` will automatically benefit SciPy.
Additionally, any limitations we encounter in `spin` will be addressed through upstream contributions to the project, making it a two-way connection: SciPy benefits from other projects contributing to `spin`, and those projects benefit from improvements made by the SciPy team to `spin`.

Let me share four significant examples of this two-way connection,

**Passing Arguments to `meson compile` and `meson install`**

Initially, `spin` didn’t support passing arguments to `meson compile` or `meson install`.
It only forwarded arguments to the `meson setup` step. Since SciPy requires passing certain arguments (like `--tags`) to `meson install` [[gh-20712](https://github.com/scipy/scipy/pull/20712)], we needed a way to forward those arguments through `spin`.
I contributed a PR to `spin` to allow for CLI arguments to be passed to `meson compile` and `meson install` steps [[scientific-python/spin#256]](https://github.com/scientific-python/spin/pull/256), which was merged.
This enhancement allows SciPy to seamlessly pass the necessary arguments, further improving its integration with `spin`.

**Reducing Code Complexity**

`spin` allowed us to simplify the implementation of `dev.py` functionality.
It offers a decorator, `spin.util.extend_command`, which enables the extension of `spin` commands (e.g., `spin build`, `spin test`) within a user project (in our case, SciPy).
By using this decorator, we implemented SciPy-specific checks while leveraging `spin`'s core functionality.
As a result, the code size was reduced by 44% compared to `dev.py`.
This reduction in code complexity means a smaller surface area for bugs — another strong reason for adopting `spin`.

**Fixing a linker path issue on macOS**

While building SciPy with `spin`, we encountered an issue on macOS where the linker path for shared libraries became corrupted due to the `--destdir` specification in the `meson install` step.
This issue arose because `spin` sets `/usr` or `C:\` as the default value for `--prefix`, but it also used `--destdir` during installation.
`--destdir` is typically used for packaging, not for final installations.
To resolve this, we removed the `--destdir` usage and set the `--prefix` directly to the installation directory.
The fix was submitted as a PR to `spin` [[scientific-python/spin#257]](https://github.com/scientific-python/spin/pull/257), ensuring smoother installation behavior for SciPy on macOS.

**Supporting `--no-build` option in `spin test`**

We encountered this issue during the final stages of our work.
The `dev.py` script uses the `--no-build` flag in the [Prerelease deps & coverage report](https://github.com/scipy/scipy/blob/b31d8dadf2a43696d5183302b6f7d49e14f5cca9/.github/workflows/linux.yml#L362-L366) CI job.
The purpose of this check is to ensure that NumPy 1.25.x remains ABI-compatible at runtime with SciPy built against the latest NumPy version.
Previously, since `spin` did not support the `--no-build` flag, this critical check could not be performed.
To address this, the `--no-build` option was added to `spin test` via [scientific-python/spin#272](https://github.com/scientific-python/spin/pull/272).
We now leverage this new functionality (see [this snippet](https://github.com/scipy/scipy/blob/63f69604a63e1ed80d5c41f8540e1b5ef6ddb9d3/.github/workflows/linux.yml#L362-L366)).

Another nice example of how SciPy's needs help improve `spin`.

### Current Status of `spin` in SciPy

The `DEV: use spin` pull request [[gh-21674](https://github.com/scipy/scipy/pull/21674)] has been merged into SciPy.
Our contributions have been fully tested through the SciPy CI system, confirming their stability.
Currently, both `spin` and `dev.py` exist in the codebase, but the CI system now uses `spin` to build and test code changes in pull requests.
Follow-up tasks related to this update are tracked in [[gh-22887](https://github.com/scipy/scipy/issues/22887)].

Here’s a quick comparison of the SciPy build experience with `dev.py` versus `spin`:

**SciPy Build Experience with `dev.py`**

[![asciicast](https://asciinema.org/a/fn1JP6ZNPpw6rKh8oAusk34Xr.svg)](https://asciinema.org/a/fn1JP6ZNPpw6rKh8oAusk34Xr)

This video shows building SciPy with `dev.py`.

**SciPy Build Experience with `spin`**

[![asciicast](https://asciinema.org/a/TdMa1hSSy3MTPnFcYKHvP0pvm.svg)](https://asciinema.org/a/TdMa1hSSy3MTPnFcYKHvP0pvm)

This video shows building SciPy with `spin`.

As you can see there is no difference between the look and feel of `python dev.py build` and `spin build`.
It works exactly the same. Moreover, the issues which were there with `dev.py` are not observed with `spin`.
Take a look at the following videos,

**`spin` keeps pdb command history intact while `dev.py` interferes with it [[gh-16452]](https://github.com/scipy/scipy/issues/16452)**

**With `dev.py`**

[![asciicast](https://asciinema.org/a/jtTP2xty4popJ1GVL0PZQBsvz.svg)](https://asciinema.org/a/jtTP2xty4popJ1GVL0PZQBsvz)

This video shows `dev.py` interfering with `pdb` command history.

**With `spin`**

[![asciicast](https://asciinema.org/a/uOT0cp0WJSKnDZPmRqdm0vREC.svg)](https://asciinema.org/a/uOT0cp0WJSKnDZPmRqdm0vREC)

This video shows `spin` keeps `pdb` command history intact.

As you can see `spin` usage doesn't interfere with PDB's history, which was an issue with `dev.py`.

**Using homebrew installed Python to build SciPy [[gh-18998]](https://github.com/scipy/scipy/issues/18998) - `dev.py` vs `spin`**

[![asciicast](https://asciinema.org/a/zp8nTTvEwB8YFrrnZQeFiGC9r.svg)](https://asciinema.org/a/zp8nTTvEwB8YFrrnZQeFiGC9r)

This video showcases how `spin` works fine with Homebrew installed Python 3.10. The build completes.
However, `dev.py` fails because it is unable to resolve paths correctly.

In summary, the move from `dev.py` to `spin` has brought notable improvements in code simplicity, build reliability, and alignment with other scientific computing projects.
As `spin` continues to evolve, SciPy will benefit from its enhancements while also contributing to its development.

#### Funding acknowledgements

This work was supported by the 2020 NASA ROSES grant, Reinforcing the Foundations of Scientific Python.
