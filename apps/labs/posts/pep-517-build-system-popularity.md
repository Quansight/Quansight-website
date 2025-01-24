---
title: 'PEP 517 build system popularity'
published: January 24, 2025
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

Setuptools support three different configuration formats right now:
`setup.py`, `setup.cfg` and `pyproject.toml`.

Configuring via `setup.py` is the oldest approach. It follows the format
originally used by the earlier `distutils` build system. When the package
is built, the `setup.py` script is executed with specific commands to
build a wheel. The script eventually calls the `setup()` function
provided by setuptools, passing the package metadata and build
configuration as arguments.

This configuration method is the most flexible, as it permits executing
any Python code during the build. However, this comes at a price — it is
easy to make mistakes such as:

```python
install_requires = []
# WRONG!
if sys.version_info < (3, 11):
    install_requires.append("exceptiongroup")
```

With the above snippet, if a wheel is built with Python 3.10, it will
install the `exceptiongroup` dependency on all Python versions. Conversely,
a wheel built with Python 3.11 or newer will never install `exceptiongroup`,
not even on Python 3.10 or older.

[Declarative configuration via
`setup.cfg`](https://setuptools.pypa.io/en/latest/userguide/declarative_config.html)
was added in 30.3.0. It supports most of the common configuration options
but not all. For example, Python extensions written in C can only be
declared via `setup.py`. However, it also supports some new features,
such as automatically extracting the version from a Python file or reading
the package description from a README file:

```ini
[metadata]
version = attr: frobnicate.__version__
long_description = file: README.rst
```

Finally, support for [`pyproject.toml`
configuration](https://setuptools.pypa.io/en/latest/userguide/pyproject_config.html)
was added in 61.0.0. It is based on [PEP
621](https://peps.python.org/pep-0621/), and therefore makes the common
part of the configuration compatible with other PEP 517 build backends
such as Hatchling.

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

`setup.py` still remains the most popular of the configuration formats.
It is used by 89% of the analyzed packages, with 64% not using any other
format. One out of five packages would declare the project
metadata in `setup.cfg`, and around 15% in `pyproject.toml`.

Note the significant overlap in these numbers. Only 87 packages used
`setup.cfg` exclusively, while 1104 combined it with `setup.py`.
The numbers are more even for `pyproject.toml`. 541 packages used it
exclusively for metadata, and 330 combined with `setup.py`.

Perhaps it is most curious that 17 packages used all three formats
simultaneously, and 14 used the pair of `setup.cfg` with `pyproject.toml`.
In all these cases, the project probably repeated the same information
in multiple formats.

11 packages did not provide any metadata. Half of them have only
a generated `setup.cfg` file that does not contain package metadata,
and the other half used a configuration format specific to Poetry build
system while incorrectly declaring setuptools as the build backend.
These source distributions could not be installed correctly.

All these numbers are only approximate. `setup.py` can contain any Python
code, and I counted all the packages containing `setup.py` as using it.
However, some packages used it only as a compatibility script without
actually declaring any metadata in it. `setup.cfg` and `pyproject.toml`
were counted if they actually contained a package metadata section.

## Build system dependencies

PEP 517 specifies that the packages that need to be installed for the build
process come from two sources:

- the values declared in `build-system.requires` key of `pyproject.toml`, and

- the values returned by `get_requires_for_build_wheel()` function
  of the PEP 517 build backend.

The packages listed in `pyproject.toml` are installed first. It often lists
all build requirements for the project, but it must at least include all
packages that are required to invoke the build backend (e.g. `setuptools`
and all packages imported in `setup.py`).

The packages provided by the backend function usually include the dependencies
of the build backend itself, and dynamic dependencies of the project.
For example, the scikit-build-core backend uses it to request installing `cmake`
and `ninja` packages if the respective tools are not present on the system.

Out of 7434 source distributions analyzed, 8 used top-level directories
that did not match their filenames. Some of them used normalized
directory names but non-normalized filenames (e.g. `pyre-check-0.9.23.tar.gz`
contained `pyre_check-0.9.23` directory), others the other way around
(`PyICU-2.14.tar.gz` contained `pyicu-2.14`). A few packages used even
more arbitrary directories, e.g. `Distance-0.1.3.tar.gz` used `distance`,
while `kuzu-0.7.1.tar.gz` used `sdist`.

306 source distributions raised an exception while calling their
`get_requires_for_build_wheel()` function. This means that these
distributions could not be intalled on my system. Out of these:

- 95 belonged to `pyobjc-framework` that supports macOS only

- 19 failed due to missing system packages that cannot be installed
  from PyPI

- two represented deprecated package aliases that weren't meant to be
  installed, and only inform the user to use another package

- one was a backport that supports Python 2 only

- one failed while building a C extension (it shouldn't have started
  building anything yet)

I discounted these packages as having special requirements, and focused
on the remaining 188 source distributions. These clearly failed because
of bugs. This number included:

- 90 packages missing some required files (such as README or requirement
  files specified in `setup.py`)

- 64 missing Python dependencies in `build-system.requires` key

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

Table 5 provides some interesting data.

Firstly, there were over two dozen packages that required setuptools
while using another PEP 517 build backend. Most likely, these packages
used a backend that did not provide direct support for building C
extensions, and used setuptools to provide that function. In fact,
some build backends officially support that.

Secondly, over half of the packages depending on `setuptools`
additionally depended on the `wheel` package. Sometimes `wheel` is actually
used by the `setup.py` script, but most often this is copied from
[a historical mistake in setuptools documentation that listed `wheel`
dependency unnecessarily](https://github.com/pypa/setuptools/commit/f7d30a9529378cf69054b5176249e5457aaf640a).

Finally, we can look at the popularity of different plugins
for the hatchling, pdm, poetry and setuptools. Plugins obtaining the version
from a Version Control System (such as git)
were the most popular, with `setuptools_scm` being used by approximately
8% of all packages, and `hatch-vcs` by over a hundred projects. There
were also other plugins serving the same purpose, such as `versioneer`,
`setuptools-git-versioning`, `versioningit` and more. `versioneer` is
often vendored, so it is probably used by more packages than the numbers
suggest.

We can also note that `setuptools-scm-git-archive` plugin was still
used in 12 packages, though `setuptools_scm >= 8` supersedes it.

Plugins related to extension builds were the next most
popular category. Cython was used by 178 packages. 45 packages used pybind11,
while its competitor nanobind featured 5 uses. 32 packages declared a build
dependency on CFFI. However, this only captured some of the CFFI use
cases, as others use CFFI at runtime only. 17 packages used
`setuptools-rust`, and further 12 used `scikit-build` (also note that 30
projects used `scikit-build-core`, per table 1).

32 packages declared a dependency on `cmake`, and 16 on `ninja`. These
PyPI packages provide precompiled executables for systems where system
tools are not available. Some projects add these dependencies only
if they cannot find the required tool. Since these tools were present
on my system, the numbers here represent packages adding
the dependencies unconditionally. This indicates that they will use
a local copy instead of the system tools.

Note that the number of `cmake` dependencies is much higher than
the number of `scikit-build` dependencies, indicating that many projects
implemented their own CMake support rather than using the existing tools.

82 packages used `pytest-runner`, a plugin that provided a custom test
command for setuptools. 71 packages used `pbr` with setuptools build
backend, while as noted in table 1, two were using the `pbr` backend
directly. Jupyter-related packages were perhaps the most diverse,
with 16 packages using `hatch-jupyter-builder`, 6 using
`jupyter-packaging` with setuptools and two with its own backend.

32 packages used `hatch-fancy-pypi-readme` plugin that aids providing
package descriptions. 11 used `hatch-requirements-txt` to read
requirements from files.

Interesting enough, there was a large number of plugins that were used
only by a handful of packages in the set — some clearly written
with a single package in mind.

## Conclusion

I attempted to analyze the popularity of different Python build
systems using data obtained from the 8000 most popular PyPI packages,
according to download counts. While this certainly is not the most
precise measure of popularity, and you could argue that the result
is biased, I think the sample is large enough to be representative.
Unfortunately, while the data can give a general impression of what
people do, it can't answer why they do that.

It is surprising how many packages do not provide source distributions
at all; they account for 7% of the packages on the list. Sometimes this
could be an accidental mistake, such as a buggy release workflow.
However, sometimes it is deliberate, and I have seen people mention a few
reasons for that. To list a few examples:

- Some maintainers believe that wheels are sufficient for pure Python
  packages, and do not publish source distributions.

- Some projects are proprietary, and do not distribute sources at all.

- Some open source projects stopped providing source distributions,
  because their build process was complex and it often failed when
  `pip` attempted to build the package from source. Their maintainers
  prefer that users either use wheels, or manually build from source
  when they know what they're doing.

Many packages also could not be installed due to a variety of bugs.
Over half of them involved files missing from source distribution
archives. Others needed adjustments for newer Python standards,
and newer build system versions. If we combine this number with packages
not providing source distributions at all, we discover that over 9%
packages from the list cannot be installed from source. However, I
did not start actually building the package — if I did, I would probably
discover many more packages failing. I did note that some packages
actually started building their sources prematurely, though.

Setuptools remain the most frequently used build system. It is derived
from the old distutils build system, and therefore predates PEP 517 quite
a lot — it should not be surprising that many projects use it.
However, we can ask a few interesting questions. How often are
setuptools chosen for new projects? How often is this just a matter
of copying an existing solution from another project (recently coined
as [the Makefile
effect](https://blog.yossarian.net/2025/01/10/Be-aware-of-the-Makefile-effect))?
If there is no build backend specified in `pyproject.toml`, does that
mean that the author is not aware of PEP 517?

All major build systems share basic features. They also support a common
way of specifying package metadata in `pyproject.toml`. How often do people
select a backend based on its extra features? And how often the actual
backend does not make much of a difference to them?

Many backends were developed as part of some packaging tool. In my experience,
many people choose `hatchling`, because they use Hatch. They choose
`flit_core` when they use Flit, `poetry-core` when they use Poetry,
`pdm-backend` when they use PDM. Some of them think they cannot use
another backend with their chosen tool. Some people probably choose
Hatchling, because it is the default option in [‘Choosing a build
backend’ part of the Python Packaging User
Guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/#choosing-a-build-backend).

Over half of the packages using setuptools still rely on `setup.py`.
People often manually write code to read version from a Python file,
or description from a README file, even though newer setuptools can
do that for them. Many packages declaring metadata in `setup.cfg`
or `pyproject.toml`, also use `setup.py` in addition to these files.

Some PEP 517 backends provide means to run arbitrary Python code during
the build process. Some can be extended by plugins. Some also can
internally use setuptools to build C extensions. If neither of these
is sufficient, you can always create your own backend.

A few setuptools plugins were superseded by PEP 517 backends. For example,
`pbr` started providing a backend in addition to a plugin,
and `scikit-build-core` backend replaced `scikit-build` plugin.
I think we can assume that packages using these plugins will eventually
switch to the corresponding backends.

Some of the plugins are very popular — particularly the plugins that
obtain the version number from a Version Control System. On the other
hand, there are also many plugins that are only used by a few packages.

PEP 517 was adopted seven years ago, and a lot of progress was made.
On one hand, we have multiple alternatives to setuptools. On the other,
setuptools also became more modern. However, the overall ecosystem
does not seem to be moving fast. Many old packages did not embrace new
build systems. Some new packages are still created without PEP 517
build backend declaration, or using older setuptools configuration
formats. Unfortunately, numbers alone tell us very little — to understand
the situation better, we need to talk to individual maintainers and learn
their reasons.
