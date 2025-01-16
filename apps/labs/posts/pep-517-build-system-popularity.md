---
title: 'PEP 517 build system popularity'
published: TODO
authors: [michal-gorny]
description: 'A closer look at non-elementary group-by aggregations'
category: [Packaging]
featuredImage:
  src: /posts/pep-517-build-system-popularity/featured.jpg
  alt:
hero:
  imageSrc: /posts/pep-517-build-system-popularity/hero.jpg
  imageAlt:
---

# PEP 517 build system popularity

In 2017, [PEP 517](https://peps.python.org/pep-0517/) changed the Python
packaging landscape forever. Prior to it, the setuptools build system
held a de facto monopoly. If you were to publish a Python package
on PyPI, it was the build system to go to. If you really wanted to
create another build system, you had to either extend setuptools,
or simulate its interface. And since it built quite an baroque
interface over the years, and different tools used different portions of
it, the latter usually meant trouble.

PEP 517 changed that by enabling a ‘black box’ approach to build
systems. A released Python package would declare what build backend it
wished to use, and a frontend would call into a few predefined methods
provided by it, and obtain a source or binary distribution.
The interface is well-defined and relatively simple.

Unsurpringly, PEP 517 gave a rise to quite a few different build
systems. Some focused on pure Python packages, others on integration
with non-Python build systems such as CMake, Meson or Cargo. While it is
clear that there is a choice between the new build systems, how
popular did they become after all? In this post, I would like to explore
the landscape 7 years after the adoption of PEP 517.

## Methodology

In order to determine the popularity of PEP 517 build systems, I
decided to investigate the build systems used in the most popular PyPI
packages. I used [the monthly dumps of top PyPI
packages](https://hugovk.github.io/top-pypi-packages/) that are
graciously provided by Hugo van Kemenade, specifically the list
provided on 2024-12-01. I attempted to download the source
distributions for these packages, using a modified version of
[download_pypi_packages.py](https://github.com/python/cpython/blob/3.12/Tools/peg_generator/scripts/download_pypi_packages.py)
script from the CPython repository. The downloaded files corresponded
to the newest available on 2025-01-08. Then I unpacked `pyproject.toml`,
`setup.cfg` and `setup.py` files from them.

Out of 8000 projects listed in the dump, two were not available anymore,
and 561 did not feature source distributions at all. Furthermore,
out of the resulting 7437 source distributions, two lacked build system
files entirely and one incorrectly capitalized filenames, preventing it
from working on case-sensitive systems. This left me with 7434 valid
data points. However, as noted further on, clearly not all of these
packages had a functional build system either.

I ran a number of analyses on these files:

1. Obtaining the raw values of `build-system.build-backend` key
   to determine the popularity of individual build backends.

2. Matching these values into the published build systems, particularly
   combining multiple backends corresponding to the same build system.

3. Matching custom build backends into the public build systems that
   they utilize, using the `build-system.requires` key.

4. Determining which of the different configuration formats supported
   by setuptools are used by the project:

   - `pyproject.toml` by the presence of the `[project]` table
   - `setup.cfg` by the presence of the `[metadata]` section
   - `setup.py` by the presence of the file itself

5. Running the `get_requires_for_build_wheel()` build backend hook
   to obtain the build dependencies of the package.

6. Analyzing the build dependencies, both on their own and in specific
   combinations.

The scripts used to perform all these actions are available
in the [pep517-stats](https://github.com/mgorny/pep517-stats/)
repository.

## Most popular build systems

<div style={{textAlign: 'center'}}>

<table style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <caption>Table 1. Cumulative backend use counts</caption>
  <tr><th>Backend / family</th><th>Count</th></tr>
  <tr style={{ background: '#fef' }}><td style={{ height: '4em' }}>setuptools</td><td align='right'>5854</td></tr>
  <tr style={{ background: '#eff' }}><td style={{ height: '4em' }}>poetry</td><td align='right'>625</td></tr>
  <tr style={{ background: '#ffe' }}><td style={{ height: '4em' }}>hatchling</td><td align='right'>480</td></tr>
  <tr style={{ background: '#eef' }}><td style={{ height: '4em' }}>flit</td><td align='right'>285</td></tr>
  <tr><td style={{ height: '2.5em' }}>`maturin`</td><td align='right'>85</td></tr>
  <tr style={{ background: '#efe' }}><td style={{ height: '4em' }}>pdm</td><td align='right'>42</td></tr>
  <tr style={{ background: '#fee' }}><td style={{ height: '4em' }}>scikit-build-core</td><td align='right'>30</td></tr>
  <tr><td style={{ height: '2.5em' }}>`mesonpy`</td><td align='right'>16</td></tr>
  <tr><td style={{ height: '2.5em' }}>`whey`</td><td align='right'>4</td></tr>
  <tr><td style={{ height: '2.5em' }}>(custom)</td><td align='right'>3</td></tr>
  <tr><td style={{ height: '2.5em' }}>`sphinx_theme_builder`</td><td align='right'>3</td></tr>
  <tr><td style={{ height: '2.5em' }}>`sipbuild.api`</td><td align='right'>3</td></tr>
  <tr><td style={{ height: '2.5em' }}>`pbr.build`</td><td align='right'>2</td></tr>
  <tr><td style={{ height: '2.5em' }}>`jupyter_packaging.build_api`</td><td align='right'>2</td></tr>
</table>
<table style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <caption>Table 2. Detailed counts for common families</caption>
  <tr><th>Family / backend</th><th>Count</th></tr>
  <tr style={{ background: '#fef' }}><th>setuptools</th><th></th></tr>
  <tr style={{ background: '#fef' }}><td>`None`</td><td align='right'>4178</td></tr>
  <tr style={{ background: '#fef' }}><td>`setuptools.build_meta`</td><td align='right'>1642</td></tr>
  <tr style={{ background: '#fef' }}><td>`setuptools.build_meta:__legacy__`</td><td align='right'>19</td></tr>
  <tr style={{ background: '#fef' }}><td>(custom)</td><td align='right'>15</td></tr>
  <tr style={{ background: '#eff' }}><th>poetry</th><th></th></tr>
  <tr style={{ background: '#eff' }}><td>`poetry.core.masonry.api`</td><td align='right'>553</td></tr>
  <tr style={{ background: '#eff' }}><td>`poetry.masonry.api`</td><td align='right'>51</td></tr>
  <tr style={{ background: '#eff' }}><td>`poetry_dynamic_versioning.backend`</td><td align='right'>21</td></tr>
  <tr style={{ background: '#ffe' }}><th>hatchling</th><th></th></tr>
  <tr style={{ background: '#ffe' }}><td>`hatchling.build`</td><td align='right'>477</td></tr>
  <tr style={{ background: '#ffe' }}><td>(custom)</td><td align='right'>2</td></tr>
  <tr style={{ background: '#ffe' }}><td>`hatchling.ouroboros`</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eef' }}><th>flit</th><th></th></tr>
  <tr style={{ background: '#eef' }}><td>`flit_core.buildapi`</td><td align='right'>276</td></tr>
  <tr style={{ background: '#eef' }}><td>`flit.buildapi`</td><td align='right'>4</td></tr>
  <tr style={{ background: '#eef' }}><td>`flit_scm:buildapi`</td><td align='right'>3</td></tr>
  <tr style={{ background: '#eef' }}><td>(custom)</td><td align='right'>1</td></tr>
  <tr style={{ background: '#eef' }}><td>`flit_gettext.scm`</td><td align='right'>1</td></tr>
  <tr style={{ background: '#efe' }}><th>pdm</th><th></th></tr>
  <tr style={{ background: '#efe' }}><td>`pdm.backend`</td><td align='right'>37</td></tr>
  <tr style={{ background: '#efe' }}><td>`pdm.pep517.api`</td><td align='right'>4</td></tr>
  <tr style={{ background: '#efe' }}><td>`pdm.backend.intree`</td><td align='right'>1</td></tr>
  <tr style={{ background: '#fee' }}><th>scikit-build-core</th><th></th></tr>
  <tr style={{ background: '#fee' }}><td>`scikit_build_core.build`</td><td align='right'>28</td></tr>
  <tr style={{ background: '#fee' }}><td>(custom)</td><td align='right'>2</td></tr>
</table>

</div>

In the data set, setuptools was used as a build system for almost 79%
of packages. 7 out of 10 packages using this build system do so without
explicitly declaring a build backend, via the implicit fallback to
`setup.py`.

The three next build system families are Poetry (8.4% packages),
Hatchling (6.5% packages) and Flit (3.8%). The remaining build systems
amount for 2.6% of packages, and include both generic Python build
systems (such as `pdm-backend`), as well as more specialized tools
such as Maturin that is used for Rust packages (1.1%), scikit-build-core
that provide CMake integration (0.40%) and mesonpy that provides Meson
integration (0.22%).

Setuptools, Poetry and Hatchling both support plugins, making their
consumers almost uniformly use the provided backends. The exception
to this is the `poetry_dynamic_versioning` plugin that uses a custom
backend. Conversely, the `flit_core` package does not support plugins.
Instead, it is extended via subclassing, in `flit_scm` and
`flit_gettext` packages.

It should be noted that some of the listed PEP 517 backends are derived
from earlier setuptools plugins. This is particularly the case for
`scikit-build-core` (derived from `scikit-build`) and `pbr` (with
the same package providing both the plugin and the backend). Therefore,
the numbers for these backends are likely to raise once packages switch
from the earlier approach of using the plugin to the newer approach
of using the PEP 517 backend.

23 packages in total declared a custom (local) backend, with all but 3
being based on some other build system. Setuptools accounted for 15
custom build backend uses.

Aside from the overwhelming implicit use of the legacy setuptools
backend, there are 19 packages declaring the use of this backend
explicitly, which is arguably incorrect. 51 packages still use
the deprecated `poetry.masonry.api` backend. The deprecated
`flit.buildapi` and `pdm.pep517.api` backends are used by 4 packages
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
as part of these packages.

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
use wheels or use the sources consciously

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

[…]
