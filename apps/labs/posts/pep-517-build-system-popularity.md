---
title: 'PEP 517 buil system popularity'
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

5. Determining which packages using setuptools build system still
   specify the `wheel` dependency explicitly (based on a past error
   in setuptools documentation).

6. Determining which packages combine other public build systems
   with setuptools (e.g. to build extensions).

The scripts used to perform all these actions are available
in the [pep517-stats](https://github.com/mgorny/pep517-stats/)
repository.

## Most popular build systems

<table style={{width: 'auto', margin: 'auto'}}>
<caption>Table 1. PEP 517 backends ordered by frequency of use in packages</caption>

<tr>
<th>Family</th>
<th>Backend</th>
<th>Count</th>
</tr>

<tr>
<td rowspan="5" valign="top">setuptools</td>
<td>(total)</td>
<td>5854</td>
</tr>
<tr>
<td>(none)</td>
<td>4178</td>
</tr>
<tr>
<td>`setuptools.build_meta`</td>
<td>1642</td>
</tr>
<tr>
<td>`setuptools.build_meta:__legacy__`</td>
<td>19</td>
</tr>
<tr>
<td>(custom)</td>
<td>15</td>
</tr>
<tr>
<td rowspan="4" valign="top">poetry</td>
<td>(total)</td>
<td>625</td>
</tr>
<tr>
<td>`poetry.core.masonry.api`</td>
<td>553</td>
</tr>
<tr>
<td>`poetry.masonry.api`</td>
<td>51</td>
</tr>
<tr>
<td>`poetry_dynamic_versioning.backend`</td>
<td>21</td>
</tr>
<tr>
<td rowspan="4" valign="top">hatchling</td>
<td>(total)</td>
<td>480</td>
</tr>
<tr>
<td>`hatchling.build`</td>
<td>477</td>
</tr>
<tr>
<td>(custom)</td>
<td>2</td>
</tr>
<tr>
<td>`hatchling.ouroboros`</td>
<td>1</td>
</tr>
<tr>
<td rowspan="6" valign="top">flit</td>
<td>(total)</td>
<td>285</td>
</tr>
<tr>
<td>`flit_core.buildapi`</td>
<td>276</td>
</tr>
<tr>
<td>`flit.buildapi`</td>
<td>4</td>
</tr>
<tr>
<td>`flit_scm:buildapi`</td>
<td>3</td>
</tr>
<tr>
<td>(custom)</td>
<td>1</td>
</tr>
<tr>
<td>`flit_gettext.scm`</td>
<td>1</td>
</tr>
<tr>
<td>maturin</td>
<td>`maturin`</td>
<td>85</td>
</tr>
<tr>
<td rowspan="4" valign="top">pdm</td>
<td>(total)</td>
<td>42</td>
</tr>
<tr>
<td>`pdm.backend`</td>
<td>37</td>
</tr>
<tr>
<td>`pdm.pep517.api`</td>
<td>4</td>
</tr>
<tr>
<td>`pdm.backend.intree`</td>
<td>1</td>
</tr>
<tr>
<td rowspan="3" valign="top">scikit-build-core</td>
<td>(total)</td>
<td>30</td>
</tr>
<tr>
<td>`scikit_build_core.build`</td>
<td>28</td>
</tr>
<tr>
<td>(custom)</td>
<td>2</td>
</tr>
<tr>
<td>mesonpy</td>
<td>`mesonpy`</td>
<td>16</td>
</tr>
<tr>
<td>whey</td>
<td>`whey`</td>
<td>4</td>
</tr>
<tr>
<td>(custom)</td>
<td>(custom)</td>
<td>3</td>
</tr>
<tr>
<td>sphinx-theme-builder</td>
<td>`sphinx_theme_builder`</td>
<td>3</td>
</tr>
<tr>
<td>sipbuild</td>
<td>`sipbuild.api`</td>
<td>3</td>
</tr>
<tr>
<td>pbr</td>
<td>`pbr.build`</td>
<td>2</td>
</tr>
<tr>
<td>jupyter-packaging</td>
<td>`jupyter_packaging.build_api`</td>
<td>2</td>
</tr>

</table>

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

At the time of writing, setuptools support three different configuration
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

## The wheel dependency

## Setuptools use with other build systems

## Summary
