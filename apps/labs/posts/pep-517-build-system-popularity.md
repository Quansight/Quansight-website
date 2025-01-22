---
title: 'PEP 517 build system popularity'
published: TODO
authors: [michal-gorny]
description: 'A closer look at non-elementary group-by aggregations'
category: [Packaging]
featuredImage:
  src: /posts/pep-517-build-system-popularity/featured.jpeg
  alt: A tabby cat in a carton box, with a slightly surprised look on its face. Photograph by kaylaflam, https://pixabay.com/photos/cat-feline-animal-kitty-box-5453535/.
hero:
  imageSrc: /posts/pep-517-build-system-popularity/hero.jpeg
  imageAlt: A tabby cat in a carton box, with a slightly surprised look on its face. Photograph by kaylaflam, https://pixabay.com/photos/cat-feline-animal-kitty-box-5453535/.
---

# PEP 517 build system popularity

In 2017, [PEP 517](https://peps.python.org/pep-0517/) changed the Python
packaging landscape forever. Prior to it, the setuptools build system
held a de facto monopoly. If you were to publish a Python package
on PyPI, you either used setuptools, extended it or had to create
something reasonably compatible with it. And given how many different
options setuptools provided, and how various users used different
combinations of these options, you were likely to spend a lot of effort
implementing what you believed to be necessary, and still learn that someone's
workflow does not work.

PEP 517 enabled a ‘black box’ approach to building Python packages.
A package needed only to name the backend it wished to use, and the backend
implemented a few predefined functions to run the build process and create
a source or binary distribution. This interface is well-defined
and relatively simple. There are only two mandatory functions, and currently
up to five optional — compared to 28 commands in setuptools (each with
its own list of options).

Unsurpringly, many new build systems were created. Some of them focused
on pure Python packages, others on integration with other build systems
such as CMake, Meson or Cargo. It is clear that you can now choose
between many new build systems. But how popular are they today? In this
post, I would like to explore that.

## Methodology

For my research, I decided to investigate the build systems used
in the most popular PyPI packages. I used [the monthly dumps of top PyPI
packages](https://hugovk.github.io/top-pypi-packages/) that are
graciously provided by Hugo van Kemenade, specifically the list
provided for 2024-12-01. I attempted to download the source
distributions for these packages, using a modified version of
[download_pypi_packages.py](https://github.com/python/cpython/blob/3.12/Tools/peg_generator/scripts/download_pypi_packages.py)
script from the CPython repository. The downloaded files corresponded
to the newest versions available on 2025-01-08. Then I unpacked `pyproject.toml`,
`setup.cfg` and `setup.py` files from them.

Out of 8000 projects listed in the dump:

- two were not available anymore,

- 561 did not feature source distributions at all,

- two did not have any build system files,

- one had incorrectly capitalized filenames, preventing it from working
  on Linux.

I performed the analysis on the remaining 7434 source distributions.
However, I must note that not all of these distributions could actually
be installed, as I explain in detail further on.

I wrote a few scripts to analyze these distributions and process
the results, creating tables that are included in this post. The scripts
are available in the [pep517-stats](https://github.com/mgorny/pep517-stats/)
repository. They perform the following actions:

1. Obtain the raw values of `build-system.build-backend` key from `pyproject.toml`
   to determine the popularity of individual build backends.

2. Match these values to known build systems, combining multiple backends
   corresponding to the same or closely related packages.

3. Look at the `build-system.requires` key in packages using a custom build
   backend to determine which package it is based on.

4. Determine which of the different configuration formats supported
   by setuptools are used by the project:

   - `pyproject.toml` — if `[project]` table exists in said file
   - `setup.cfg` — if `[metadata]` section exists in said file
   - `setup.py` — if said file exists

5. Run the `get_requires_for_build_wheel()` hook
   to obtain all build requirements of the package.

## The most popular build systems

<div style={{textAlign: 'center'}}>

<table style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <caption>Table 1. Cumulative backend use counts</caption>
  <tr><th>Family or backend</th><th>Count</th></tr>
  <tr style={{ background: '#fef' }}><td style={{ height: '4em' }}>setuptools</td><td align='right'>5854</td></tr>
  <tr style={{ background: '#eff' }}><td style={{ height: '4em' }}>poetry</td><td align='right'>625</td></tr>
  <tr style={{ background: '#ffe' }}><td style={{ height: '4em' }}>hatchling</td><td align='right'>480</td></tr>
  <tr style={{ background: '#eef' }}><td style={{ height: '4em' }}>flit</td><td align='right'>285</td></tr>
  <tr><td style={{ height: '3em' }}>`maturin`</td><td align='right'>85</td></tr>
  <tr style={{ background: '#efe' }}><td style={{ height: '4em' }}>pdm</td><td align='right'>42</td></tr>
  <tr style={{ background: '#fee' }}><td style={{ height: '4em' }}>scikit-build-core</td><td align='right'>30</td></tr>
  <tr><td style={{ height: '3em' }}>`mesonpy`</td><td align='right'>16</td></tr>
  <tr><td style={{ height: '3em' }}>`whey`</td><td align='right'>4</td></tr>
  <tr><td style={{ height: '3em' }}>(custom)</td><td align='right'>3</td></tr>
  <tr><td style={{ height: '3em' }}>`sphinx_theme_builder`</td><td align='right'>3</td></tr>
  <tr><td style={{ height: '3em' }}>`sipbuild.api`</td><td align='right'>3</td></tr>
  <tr><td style={{ height: '3em' }}>`pbr.build`</td><td align='right'>2</td></tr>
  <tr><td style={{ height: '3em' }}>`jupyter_packaging.build_api`</td><td align='right'>2</td></tr>
</table>
<table style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <caption>Table 2. Detailed counts for common families</caption>
  <tr><th colspan='2'>Family and backend</th><th>Count</th></tr>
  <tr style={{ background: '#fef' }}><th colspan='2'>setuptools</th><th></th></tr>
  <tr style={{ background: '#fef' }}><td style={{ width: '1em' }}></td><td>(none)</td><td align='right'>4178</td></tr>
  <tr style={{ background: '#fef' }}><td></td><td>`setuptools.build_meta`</td><td align='right'>1642</td></tr>
  <tr style={{ background: '#fef' }}><td></td><td>`setuptools.build_meta:__legacy__`</td><td align='right'>19</td></tr>
  <tr style={{ background: '#fef' }}><td></td><td>(custom)</td><td align='right'>15</td></tr>
  <tr style={{ background: '#eff' }}><th colspan='2'>poetry</th><th></th></tr>
  <tr style={{ background: '#eff' }}><td></td><td>`poetry.core.masonry.api`</td><td align='right'>553</td></tr>
  <tr style={{ background: '#eff' }}><td></td><td>`poetry.masonry.api`</td><td align='right'>51</td></tr>
  <tr style={{ background: '#eff' }}><td></td><td>`poetry_dynamic_versioning.backend`</td><td align='right'>21</td></tr>
  <tr style={{ background: '#ffe' }}><th colspan='2'>hatchling</th><th></th></tr>
  <tr style={{ background: '#ffe' }}><td></td><td>`hatchling.build`</td><td align='right'>477</td></tr>
  <tr style={{ background: '#ffe' }}><td></td><td>(custom)</td><td align='right'>2</td></tr>
  <tr style={{ background: '#ffe' }}><td></td><td>`hatchling.ouroboros`</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eef' }}><th colspan='2'>flit</th><th></th></tr>
  <tr style={{ background: '#eef' }}><td></td><td>`flit_core.buildapi`</td><td align='right'>276</td></tr>
  <tr style={{ background: '#eef' }}><td></td><td>`flit.buildapi`</td><td align='right'>4</td></tr>
  <tr style={{ background: '#eef' }}><td></td><td>`flit_scm:buildapi`</td><td align='right'>3</td></tr>
  <tr style={{ background: '#eef' }}><td></td><td>(custom)</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eef' }}><td></td><td>`flit_gettext.scm`</td><td align='right'>1</td></tr>
  <tr style={{ background: '#efe' }}><th colspan='2'>pdm</th><th></th></tr>
  <tr style={{ background: '#efe' }}><td></td><td>`pdm.backend`</td><td align='right'>37</td></tr>
  <tr style={{ background: '#efe' }}><td></td><td>`pdm.pep517.api`</td><td align='right'>4</td></tr>
  <tr style={{ background: '#efe' }}><td></td><td>`pdm.backend.intree`</td><td align='right'>1</td></tr>
  <tr style={{ background: '#fee' }}><th colspan='2'>scikit-build-core</th><th></th></tr>
  <tr style={{ background: '#fee' }}><td></td><td>`scikit_build_core.build`</td><td align='right'>28</td></tr>
  <tr style={{ background: '#fee' }}><td></td><td>(custom)</td><td align='right'>2</td></tr>
</table>

</div>

Setuptools was used as a build system for almost 79%
of the tested packages. Seven out of ten packages using setuptools do not
declare a build backend in `pyproject.toml` — they rely on the tools
running `setup.py` when no backend is declared.

The three next top ranking build system families are Poetry (8.4% packages),
Hatchling (6.5% packages) and Flit (3.8%). Build systems other than the four
already mentioned amount for 2.6% of packages. They include both generic Python build
systems (such as `pdm-backend`), as well as more specialized tools such as:

- Maturin — used to build Rust packages (1.1%)

- scikit-build-core — used to integrate with CMake build system (0.40%)

- mesonpy — used to integrate with Meson build system (0.22%)

All of setuptools, Poetry and Hatchling support plugins. Packages that
need to extend their behavior usually use the same standard build backend
and enable plugins in their configuration. The exception to that
is the `poetry_dynamic_versioning` plugin that uses a separate backend.
Conversely, `flit_core` does not support plugins and is extended
by creating new backends based on it. Two examples of such backends
are `flit_scm` and `flit_gettext`.

Some of the listed PEP 517 backends are derived
from earlier setuptools plugins. For example, `scikit-build-core` replaces
the earlier `scikit-build` plugin, and `pbr` provides a setuptools
plugin along with the newer PEP 517 backend. We can expect the numbers
corresponding to these backends to grow once packages are updated
from the older approach of using plugins to the newer approach of using
the respective backend.

23 source distributions provided a custom backend as a Python module
inside the distribution. However, only three were truly custom
and the remainder simply extended another build system. In three out of
four cases, that build system were setuptools.

19 packages declared the use of `setuptools.build_meta:__legacy__`
backend. Arguably, [using the legacy backend explicitly is incorrect](https://github.com/pypa/setuptools/issues/1689). 51 packages still used
the deprecated `poetry.masonry.api` backend, and the deprecated
`flit.buildapi` and `pdm.pep517.api` backends were used by four packages
each.

## Different setuptools configuration formats

At the time of writing, setuptools supported three different configuration
formats: functional configuration via `setup.py`, declarative
configuration via `setup.cfg` and the modern `pyproject.toml` files.

Configuring via `setup.py` is the oldest approach, and it has been
inherited from the original `distutils` build system provided by Python.
In this approach, different configuration options are passed
as arguments to the `setup()` function invocation. This method provides
the widest functionality and most flexibility. However, the latter also
comes at a price: some packages still make mistakes such as declaring
the metadata conditionally to Python version, e.g.:

```python
install_requires = []
# WRONG: "py3" wheel will either contain an unconditional dependency
# or none at all
if sys.version_info < (3, 11):
    install_requires.append("exceptiongroup")
```

[Declarative configuration via
`setup.cfg`](https://setuptools.pypa.io/en/latest/userguide/declarative_config.html)
was added in 30.3.0. It supports the most of the commonly used metadata
keys and build options, but e.g. it does not support extension builds.
Interestingly, it also provides streamlined ways of obtaining dynamic
metadata, such as extracting the version from a Python file or reading
long description from a file — replacing the need to code the logic
explicitly.

Finally, support for [`pyproject.toml`
configuration](https://setuptools.pypa.io/en/latest/userguide/pyproject_config.html)
was added in 61.0.0. It is based on [PEP
621](https://peps.python.org/pep-0621/), and therefore brings setuptools
in line with other PEP 517 build backends.

<div style={{textAlign: 'center'}}>

<table style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <caption>Table 3. Counts for setuptools configuration format combinations</caption>
  <tr><th>Formats</th><th>Count</th></tr>
  <tr><td>`setup.py`</td><td align='right'>3750</td></tr>
  <tr><td>`setup.cfg` + `setup.py`</td><td align='right'>1104</td></tr>
  <tr><td>`pyproject.toml`</td><td align='right'>541</td></tr>
  <tr><td>`pyproject.toml` + `setup.py`</td><td align='right'>330</td></tr>
  <tr><td>`setup.cfg`</td><td align='right'>87</td></tr>
  <tr><td>`pyproject.toml` + `setup.cfg` + `setup.py`</td><td align='right'>17</td></tr>
  <tr><td>`pyproject.toml` + `setup.cfg`</td><td align='right'>14</td></tr>
  <tr><td>(no configuration — broken distribution)</td><td align='right'>11</td></tr>
</table>
<table style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <caption>Table 4. Cumulative counts for every configuration format</caption>
  <tr><th>Format</th><th>Total</th></tr>
  <tr><td>(all packages)</td><td align='right'>5854</td></tr>
  <tr><td>`setup.py`</td><td align='right'>5201</td></tr>
  <tr><td>`setup.cfg`</td><td align='right'>1222</td></tr>
  <tr><td>`pyproject.toml`</td><td align='right'>902</td></tr>
</table>

</div>

`setup.py` still remains the most popular of the configuration formats,
being used by 89% of the analyzed packages, with 64% relying exclusively
on this format. One out of five packages would declare the project
metadata in `setup.cfg`, and around 15% in `pyproject.toml`.

Note the significant overlap in these numbers. Only 87 packages would
declare their metadata in `setup.cfg` exclusively, while 1104 would
combine it with `setup.py`. The numbers are more even for `pyproject.toml` —
with 541 packages using it exclusively for metadata, and 330 with `setup.py`.
Perhaps the most curious combinations are 17 packages using all three formats
and 14 declaring the project metadata using the two declarative formats —
the way the analysis was done, such an overlap clearly indicates that the
project metadata would be specified redundantly.

Perhaps the most surprising number are the 11 packages that did not provide
any metadata. A detailed analysis revealed that half of them feature
only a `setup.cfg` file without metadata, and the other half featured
Poetry metadata while declaring setuptools as a build backend. Needless
to say, in both cases the source distributions would not be installed
correctly.

Note that these numbers are only approximate. Because of the functional
nature of `setup.py`, its sole presence was counted towards its use —
meaning that even an empty `setup()` call would increase the number.
On the other hand, `setup.cfg` and `pyproject.toml` files would be counted
only if they actually contained the respective metadata sections.

## Build system dependencies

According to PEP 517, the build-time dependencies are combined from two
sources: the explicit `build-system.requires` key in `pyproject.toml`,
and an invocation to `get_requires_for_build_wheel()` method on the build
backend. The former must specify all dependencies needed to invoke
the latter (most notably, the build backend itself) and generally
is preferred for all explicit non-dynamic dependencies. Conversely,
the latter is generally used for implicit dependencies of the build
system, and for dependencies that need to be declared dynamically.
For example, it could pull in PyPI packages for `cmake` and `ninja`
if these tools are not provided by the system. It is also used to
handle build-system specific build dependency metadata, such as
the deprecated setuptools `setup_requires` key.

Out of 7434 source distributions analyzed, 8 used top-level directories
that did not match their filenames. Some of them used normalized
directory names but non-normalized filenames (e.g. `pyre-check-0.9.23.tar.gz`
contained `pyre_check-0.9.23` directory), others the other way around
(`PyICU-2.14.tar.gz` contained `pyicu-2.14`). Other packages used even
more arbitrary directories, e.g. `Distance-0.1.3.tar.gz` used `distance`,
while `kuzu-0.7.1.tar.gz` used `sdist`).

306 source distributions raised an exception while attempting
to obtain the metadata, indicating that the source distribution cannot
be installed. Out of these, 95 belonged to `pyobjc-framework` that
cannot be installed on non-macOS systems, 19 failed due to missing
non-Python dependencies, 2 represented non-installable deprecated
package aliases, one a Python 2-only backport and one failed while
building a C extension prematurely.

This leaves us with 188 source distributions that are not installable
due to upstream bugs. Notably, this includes 90 distributions that were
missing some required files (such as README or requirement files read
by `setup.py` scripts) and 64 failing due to missing Python dependencies
(that would need to be specified in `build-system.requires` key).
The remaining packages were either failing due to incorrect metadata,
use of removed setuptools API, code incompatible with Python 3.11
or expecting being built from a git checkout.

<table>
  <caption>Table 5. Selected build requirements (P = `pyproject.toml`, H = via hook)</caption>
  <tr><th rowspan='2'>Package</th><th colspan='2' align='center'>hatchling</th><th colspan='2' align='center'>mesonpy</th><th colspan='2' align='center'>pdm</th><th colspan='2' align='center'>poetry</th><th colspan='2' align='center'>scikit-build-core</th><th colspan='2' align='center'>setuptools</th><th rowspan='2' style={{ textAlign: 'center', width: '3.2em'}}>Total</th></tr>
  <tr><th style={{ textAlign: 'center', width: '3.2em'}}>P</th><th style={{ textAlign: 'center', width: '3.2em'}}>H</th><th style={{ textAlign: 'center', width: '3.2em'}}>P</th><th style={{ textAlign: 'center', width: '3.2em'}}>H</th><th style={{ textAlign: 'center', width: '3.2em'}}>P</th><th style={{ textAlign: 'center', width: '3.2em'}}>H</th><th style={{ textAlign: 'center', width: '3.2em'}}>P</th><th style={{ textAlign: 'center', width: '3.2em'}}>H</th><th style={{ textAlign: 'center', width: '3.2em'}}>P</th><th style={{ textAlign: 'center', width: '3.2em'}}>H</th><th style={{ textAlign: 'center', width: '3.2em'}}>P</th><th style={{ textAlign: 'center', width: '3.2em'}}>H</th></tr>
  <tr><td>`setuptools`</td><td align='right'>4</td><td align='right'>2</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>24</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>1808</td><td align='right'>83</td><td align='right'>1890</td></tr>
  <tr style={{ background: '#eee' }}><td>`wheel`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>10</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>937</td><td align='right'>134</td><td align='right'>979</td></tr>
  <tr><td>`setuptools-scm`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>9</td><td align='right'>487</td><td align='right'>196</td><td align='right'>611</td></tr>
  <tr style={{ background: '#eee' }}><td>`cython`</td><td align='right'>1</td><td align='right'>0</td><td align='right'>8</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>8</td><td align='right'>0</td><td align='right'>3</td><td align='right'>0</td><td align='right'>138</td><td align='right'>34</td><td align='right'>178</td></tr>
  <tr><td>`hatch-vcs`</td><td align='right'>116</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>116</td></tr>
  <tr style={{ background: '#eee' }}><td>`pytest-runner`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td><td align='right'>80</td><td align='right'>82</td></tr>
  <tr><td>`pbr`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>71</td><td align='right'>73</td></tr>
  <tr style={{ background: '#eee' }}><td>`pybind11`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>3</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>11</td><td align='right'>0</td><td align='right'>27</td><td align='right'>5</td><td align='right'>45</td></tr>
  <tr><td>`cffi`</td><td align='right'>2</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>15</td><td align='right'>13</td><td align='right'>32</td></tr>
  <tr style={{ background: '#eee' }}><td>`cmake`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>31</td><td align='right'>1</td><td align='right'>32</td></tr>
  <tr><td>`hatch-fancy-pypi-readme`</td><td align='right'>31</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>32</td></tr>
  <tr style={{ background: '#eee' }}><td>`poetry-dynamic-versioning`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>30</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>30</td></tr>
  <tr><td>`versioneer`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>20</td><td align='right'>0</td><td align='right'>21</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-rust`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>14</td><td align='right'>4</td><td align='right'>17</td></tr>
  <tr><td>`hatch-jupyter-builder`</td><td align='right'>1</td><td align='right'>15</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>16</td></tr>
  <tr style={{ background: '#eee' }}><td>`ninja`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>14</td><td align='right'>2</td><td align='right'>16</td></tr>
  <tr><td>`scikit-build`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>12</td><td align='right'>1</td><td align='right'>12</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-scm-git-archive`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>11</td><td align='right'>2</td><td align='right'>12</td></tr>
  <tr><td>`hatch-requirements-txt`</td><td align='right'>11</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>11</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-git-versioning`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>10</td><td align='right'>1</td><td align='right'>11</td></tr>
  <tr><td>`versioningit`</td><td align='right'>2</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>8</td><td align='right'>0</td><td align='right'>10</td></tr>
  <tr style={{ background: '#eee' }}><td>`hatch-nodejs-version`</td><td align='right'>9</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>9</td></tr>
  <tr><td>`jupyter-packaging`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>6</td><td align='right'>0</td><td align='right'>8</td></tr>
  <tr style={{ background: '#eee' }}><td>`nanobind`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>3</td><td align='right'>0</td><td align='right'>2</td><td align='right'>0</td><td align='right'>5</td></tr>
  <tr><td>`py-cpuinfo`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>5</td><td align='right'>0</td><td align='right'>5</td></tr>
  <tr style={{ background: '#eee' }}><td>`hatch-regex-commit`</td><td align='right'>4</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>4</td></tr>
  <tr><td>`poetry-plugin-tweak-dependencies-version`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>3</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>3</td></tr>
  <tr style={{ background: '#eee' }}><td>`setupmeta`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>3</td><td align='right'>3</td></tr>
  <tr><td>`setuptools-dso`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>3</td><td align='right'>0</td><td align='right'>3</td></tr>
  <tr style={{ background: '#eee' }}><td>`incremental`</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td><td align='right'>2</td></tr>
  <tr><td>`poetry-plugin-drop-python-upper-constraint`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-changelog-shortener`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td><td align='right'>0</td><td align='right'>2</td></tr>
  <tr><td>`setuptools-git`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td><td align='right'>2</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-golang`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>2</td><td align='right'>2</td></tr>
  <tr><td>`calver`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`changelog-chug`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>1</td></tr>
  <tr><td>`cppy`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`git-versioner`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr><td>`hatch-cython`</td><td align='right'>1</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`hatch-docstring-description`</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td></tr>
  <tr><td>`pdm-build-locked`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-declarative-requirements`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr><td>`setuptools-download`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-lint`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr><td>`setuptools-markdown`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`setuptools-pipfile`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>1</td></tr>
  <tr><td>`setuptools-twine`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eee' }}><td>`vcversioner`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>1</td></tr>
  <tr><td>`versioneer-518`</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>0</td><td align='right'>1</td><td align='right'>0</td><td align='right'>1</td></tr>
</table>

There are some interesting data that can be seen in table 5.
Firstly, in the examined set there were over two dozen packages that
depended on `setuptools` while using another PEP 517 build backend.
Except for the cases where mesonpy and scikit-build-core were involved
(these two were determined to be mistakes), these are cases of using
setuptools to build extensions. In fact, pdm-backend has an explicit
option to call into setuptools for the purpose of extension building.

Secondly, you can note that over half of the packages depending
on `setuptools` additionally depend on the `wheel` package. While
in a few cases this is justified, most often this results from
[a historical mistake in setuptools documentation that listed `wheel`
dependency unnecessarily](https://github.com/pypa/setuptools/commit/f7d30a9529378cf69054b5176249e5457aaf640a).

Finally, we can look at the popularity of different plugins
for the hatchling, pdm, poetry and setuptools build systems. The most
popular category are VCS versioning plugins, with `setuptools_scm` being
used by approximately 8% of all packages, and `hatch-vcs` by over
a hundred projects. There were also other plugins serving the same purpose,
such as `versioneer` (this one was probably undercounted, as it is often
vendored inside packages), `setuptools-git-versioning`, `versioningit`
and more. We can also note the `setuptools-scm-git-archive` plugin
that was still recorded in 12 packages, though it is no longer necessary
with `setuptools_scm >= 8`.

The next most popular category were plugins focused on building
extensions. Cython was used by 178 packages. 45 packages used pybind11,
while its competitor nanobind featured 5 uses. 32 packages declared a build
dependency on CFFI (this is not representative of CFFI popularity,
as the majority of consumers use it as runtime dependency only). 17 packages
used `setuptools-rust`, and further 12 used `scikit-build` (also note that
30 projects used `scikit-build-core`, per table 1).

It should also be noted that 32 packages declared a dependency on `cmake`
package, and 16 more on `ninja` package. These PyPI packages provide
precompiled executables for systems where system tools are not available.
Some projects, notably these using scikit-build-core backend, add these
dependencies only if they cannot find the required tool. The packages
counted here added the dependency and therefore required installing a local
copy of the tool, even though system tools were available. Furthermore,
some packages explicitly rely on helper Python modules that are installed
as part of these packages. Note that the number is two and a half times
higher than the use of `scikit-build`, indicating custom CMake handlers.

82 packages used `pytest-runner` to provide a test command via PyTest.
71 packages used `pbr` extensions to setuptools. As noted in table 1,
two were using its backend directly. The Jupyter ecosystem featured
16 uses of `hatch-jupyter-builder` and 8 uses of the older `jupyter-packaging`.

The next popular Hatch plugins were related to README files (represented
primarily by `hatch-fancy-pypi-readme`, used by 32 packages)
and requirement-reading plugins (`hatch-requirements-txt` with 11 uses).

Interesting enough, there was a large number of plugins that were used
only by a handful of packages in the set — some clearly written
with a single package in mind.

## Summary

I have attempted to analyze the popularity of different Python build
systems based on the data obtained from the 8000 most popular packages,
according to download counts. While this certainly is not the most
precise measure of popularity, and one could argue that choosing this
particular set of packages will yield a biased result, I think
the sample is large enough to be representative. Unfortunately, while
the data can give general impressions of the ecosystem, it cannot
provide the rationale for the decisions made by package maintainers.

The first surprising number are the packages that do not provide source
distributions at all; they account for 7% of the packages on the list.
While in some cases this could be an incidental, for example due to
a buggy release workflow, it is also clear that sometimes this is
a deliberate decision. In the past, I have experienced a few reasons
for that. Some maintainers did not publish source distributions,
because they believed that the wheels are sufficient for their pure Python
packages. Some projects are proprietary, and therefore provide only
binaries. And some open source projects
stopped providing source distributions, because their build process
was complex and it often failed when tools such as `pip` attempted
to build the package from source — preferring their users to either
use wheels or use the sources consciously.

A somewhat relevant problem are the packages that cannot be installed
due to a variety of bugs — over half of them involving files missing
from source distribution archives, the rest mostly needed adjustments
for newer standards and build system versions. By adding both numbers,
we discover that over 9% packages from the list clearly cannot
be installed from source. The actual number is likely to be higher,
since my research was limited to attempting to obtain build requirements.
Proceeding to actually build a wheel would likely yield further problems,
including further missing source files and incompatibilities with newer
compiler or dependency versions.

The second significant observation is that setuptools remain the most
frequently used build system. While this is not exactly surprising
given its head start, it raises some questions that could justify
further research. Particularly, how frequently setuptools is chosen
as a build system for new projects? How frequently it is chosen
as a new build system, rather than being copied from another project
(recently coined as [the Makefile
effect](https://blog.yossarian.net/2025/01/10/Be-aware-of-the-Makefile-effect))?
Does neglecting to specify the build backend in `pyproject.toml`
indicate lack of PEP 517 awareness, or merely the fact that it is not
strictly necessary?

All major PEP 517 build systems share a common base subset of features,
and with PEP 621 also the way of specifying most of the project
metadata. How often do people choose a specific backend because of
the features it offers, and how often is the decision
semi-incidental? At least part of the popularity of some of the backends
comes from the accompanying tools — Flit for the `flit_core` package,
Poetry for `poetry-core`, Hatch for `hatchling` and PDM for `pdm-backend`.
In fact, in my experience some maintainers do not realize that they
do not actually have to match backend to the tooling they use.
It is also quite probable that some projects choose Hatchling because
it is the default option in [‘Choosing a build backend’ part
of the Python Packaging User Guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/#choosing-a-build-backend).

On top of that, over a half of the packages using setuptools
still rely on functional way of declaring package metadata, often
manually reimplementing features that are integrated into the newer
formats, such as reading version from Python files or a README file.
Even those using a newer metadata format provide `setup.py` for one
reason or another. It can be added that other PEP 517 backends,
such as Hatchling and poetry-core, often also provide the run additional
Python code throughout build process.

The last part of the post was primarily focused on build system plugins
and other build dependencies.
Some of the packages still used setuptools plugins that grew into their
own backends, such as `pbr` and `scikit-build`, meaning that they are
likely to switch in the future. Other packages combined different
PEP 517 backends with setuptools to facilitate extension builds.

It indicated that some of the plugins are very popular — particularly
VCS-based versioning plugins. On the other hand, it also indicated
that there is a fair number of plugins that are used by a few packages
only. A fair number of packages used deprecated plugins as well.

PEP 517 was adopted seven years ago, and a lot of progress was made
since. On one hand, multiple alternatives to setuptools were developed.
On the other, setuptools themselves changed too, reshaping themselves
to fit better into the PEP 517 workflow and deprecating many of their
baroque features in the process. However, it seems that the wider
ecosystem was not moving that fast. Many packages either did not decide
to move their build systems forward, or even were started using older
approaches and configuration formats. The most important point
illustrated by this post is that numbers alone provide little insight —
what would be really interesting is a research on the actual causes
and motivations.
