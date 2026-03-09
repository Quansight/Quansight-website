---
title: 'Support for ABI3 packages in conda!'
authors: [isuru-fernando]
published: August 8, 2025
description: 'See how Point72 teamed up with Quansight to fund support for ABI3 packages in the conda ecosystem.'
category: [Packaging]
featuredImage:
  src: /posts/conda-abi3/forge.jpg
  alt: 'A wheel with ABI3 text in the middle placed on top of an anvil being forged with a hammer'
hero:
  imageSrc: /posts/conda-abi3/forge.jpg
  imageAlt: 'A wheel with ABI3 text in the middle placed on top of an anvil being forged with a hammer'
---

See how Point72 teamed up with Quansight to fund support for ABI3 packages
in the conda ecosystem. A few ABI3 packages are now available in conda-forge
and are compatible with existing solver tools like conda/mamba/pixi.

## Motivation

When building python extensions, they are usually minor version specific.
At the time of writing, CPython supports five minor versions `3.9-3.13`
and conda-forge supports them as well. This means together with the six
operating system/architecture combinations, we create 30 jobs per feedstock
that compiles a python extension. Reducing the build matrix to just one
python version will reduce the burden on conda-forge CI, volunteer time
of the maintainers and storage and bandwidth costs of the hosting services.

First let us understand why the extensions are usually minor version specific.
Each Python minor version adds and removes symbols in the Python C API.
If an extension uses a symbol (directly or indirectly via a macro) that is
removed later on, the extension does not work outside of the minor
version. Therefore extensions are identified by a unique extension suffix.
For example, `foo.cpython-310-x86_64-linux-gnu.so` is an extension that
supports only CPython 3.10 on the `x86_64-linux-gnu` platform.

However, some symbols are available in all Python major.minor versions with some
lower bound on the Python version. These symbols are part of the
[limited C API][c_api_stability]. It is guaranteed that the symbols in limited C API
introduced in Python 3.X are available in Python 3.Y for any `Y >= X`.
Extensions using only these symbols are identified by the extension suffix
`abi3.so`. For example, `foo.abi3.so`.

These extensions only support the platform it was built for (e.g.
`x86_64-linux-gnu`), but this is not specified in the extension suffix.

Note that the stable ABI is only specific to CPython and is not compatible with
PyPy or other Python implementations. Python with free-threading support also does
not support the stable ABI. For a Python implementation independent
ABI, see the [HPy project][hpy].

## Support in the upstream package

In order to support ABI3, the upstream package should only use symbols marked
as Stable ABI supported only. To make sure that only those symbols are visible
from the Python headers, the preprocessor macro `Py_LIMITED_API` needs to be set.
This ensures that symbols not marked as stable ABI are invisible.

CPython also supports setting `Py_LIMITED_API` to a specific python version, so
that it is possible, for example, to build an ABI3 package for Python 3.11 that supports
Python 3.9+. For conda-build support we decided that we would build the package
with the minimum version possible (i.e. 3.9 in the above example) since installing
an older version is easy.

The second and final requirement from the upstream package is that the build
system (setuptools, meson, maturin, etc) builds an extension with `.abi3.so`
suffix instead of the usual `.cpython-310-x86_64-linux-gnu.so` suffix for example.
In setuptools, this looks like:

```python
setup(
    ext_modules=[
        Extension(
            "spam",
            sources=["spam.c"],
            define_macros=[("Py_LIMITED_API", "0x03060000")],
            py_limited_api=True,
        )
    ]
)
```

With PyO3/maturin, this looks like:

```yaml
[dependencies.pyo3]
version = "0.24.0"
# "abi3-py38" tells pyo3 (and maturin) to build using the stable ABI with minimum Python version 3.8
features = ["abi3-py38"]
```

For other build systems, please refer their documentation. Note that Cython
has only limited support for ABI3.

## Support in conda install tools

We inspected conda install tools which included conda, mamba, micromamba and pixi
and found out that we can support ABI3 packages without any changes to those tools.
There were some differences between the tools, so we codified the requirements
of a conda install tool to support ABI3 packages in [CEP 20][cep20].

## Support in conda build tools

Next, we added support in conda-build to support building ABI3 packages.
[CEP 20][cep20] also codified the requirements of recipe authors to support
building ABI3 packages. For v0 recipes, a typical change to the
`meta.yaml` file looks like:

```diff

 build:
   number: 0
+  python_version_independent: true   # [is_abi3]
   script: {{ PYTHON }} -m pip install . -vv
+  skip: True                         # [is_abi3 and not is_python_min]

 requirements:
   build:
     - {{ compiler('c') }}
     - {{ stdlib('c') }}
   host:
+    - python-abi3                    # [is_abi3]
     - python
     - pip
     - setuptools
@@ -26,8 +29,11 @@
     - spam
   requires:
     - pip
+    - abi3audit                      # [is_abi3]
   commands:
     - pip check
+    - abi3audit $SP_DIR/spam.abi3.so -s -v --assume-minimum-abi3 {{ python_min }}   # [unix and is_abi3]
+    - abi3audit %SP_DIR%/spam.pyd -s -v --assume-minimum-abi3 {{ python_min }}      # [win and is_abi3]
```

A sample recipe can be found [here][abi3_example]. Note that
this generates one package per platform typically, but when freethreading
is enabled, it produces the ABI3 package and the Python 3.13 freethreading
build. When python 3.14 freethreading build is supported, we will
produce 3 packages per platform and so on.

Some packages use newer stable ABI symbols if the python version is
recent enough (say 3.12), but provide a slower code path for older python
version. In that case, we can create two variants, one that has a
`python>=3.9,<3.12` constraint and one that has a `python>=3.12` constraint.

Support for ABI3 packages was also added to `rattler-build` by Wolf Vollprecht.

## Summary

Thanks to funding provided by Point72, it is now possible to build ABI3
packages on conda-forge and this makes it possible to support bleeding
edge python versions faster and also reduces the burden on conda-forge
CI systems and maintainers.

[c_api_stability]: https://docs.Python.org/3/c-api/stable.html
[hpy]: https://hpyproject.org
[cep20]: https://github.com/conda/ceps/blob/main/cep-0020.md
[abi3_example]: https://github.com/conda-forge/python-abi3-feedstock/blob/main/recipe/example-meta.yaml
