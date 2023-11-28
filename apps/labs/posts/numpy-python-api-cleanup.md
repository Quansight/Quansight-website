---
title: "Refining NumPy's Python API for its 2.0 release"
published: November 8, 2023
authors: [mateusz-sokol]
description: "A journey through NumPy's Python API from a maintenance perspective."
category: [PyData ecosystem]
featuredImage:
  src: /posts/numpy-python-api-cleanup/numpy-python-api-cleanup-logo.png
  alt: 'NumPy logo.'
hero:
  imageSrc: /posts/numpy-python-api-cleanup/numpy-python-api-cleanup-hero.png
  imageAlt: 'NumPy logo.'
---

To ensure the vitality of well-established libraries, periodic cleanups play an important
role in maintenance efforts. This is also the case for NumPy, which plays a central role in
the Scientific Python ecosystem. In this blog post, I describe the purpose and key
achievements of the [NEP 52](https://numpy.org/neps/nep-0052-python-api-cleanup.html)
workstream, which aimed to clean up NumPy's Python API.

---

Hi! I'm [Mateusz Sokół](https://github.com/mtsokol) and for the last three months,
I've had the pleasure of participating in the Quansight Labs internship program and
contributing in multiple ways to the Scientific Python ecosystem. My mentors were
[Ralf Gommers](https://github.com/rgommers) and [Nathan Goldbaum](https://github.com/ngoldbaum)
who supervised my work and assisted with planning my tasks.

During the program, I mainly focused on working on one of the Numpy Enhancement Proposals
(NEP), specifically NEP 52. This proposal, with its name "Python API cleanup for NumPy
2.0", was nondistinctive at first glance, but once explored it had a multitude of
interesting technical challenges and required to make impactful design decisions. It was
a solid introduction to the internals of NumPy and closely related scientific libraries.
This NEP also allowed me to collaborate with many engineering teams from other libraries,
such as JAX, pybind11, and pandas.

In this short article, I would like to briefly outline the motivation behind NEP 52 and
its scope. I will then take this opportunity to explain some of the technical issues we
solved, covering both Python and C code.

As of this moment, NEP 52 has been accepted and most of the goals have been achieved,
but the work is still ongoing!

---

## NumPy, briefly

Numpy is a fundamental package for scientific computing used by scientists and engineers
around the world. It emerged from numerical libraries, namely Numeric and Numarray, in
the early 2000s. It allows the manipulation of high-dimensional arrays implemented in C
while staying in a comfortable Python realm.
Python enables rapid prototyping without needless hurdles, while providing an enormous
ecosystem for building reliable and production-level software. These unique traits
resulted in worldwide adoption of NumPy in many scientific and engineering domains.

Additionally, what makes NumPy stand out from commercial numerical software products,
such as MATLAB, is the fact that NumPy is fully open-source software distributed under
the BSD 3-Clause license.

---

## NEP 52 - motivation & scope

Over the course of two decades NumPy's Python API has continually evolved and adapted to
the evolution of the Python language. As we all know, over time, software often becomes
obsolete and public APIs grow larger as new features arrive.

NEP 52 was meant to identify obsolete, duplicated, and deprecated members of Python API
and remove/rearrange them. This NEP had a few principles in mind:

- Each public function should be available from only one place.
- Redundant or misleading aliases for dtypes and functions should be removed.
- There should be a clear distinction between what is private and what is public
  (the concept of a "semi-private" API member should be avoided).
- Concretely define the NumPy API and remove internal usages of `import *`.

The desired result was to end up with a well-defined, unambiguous public API,
that is easy for learning and searching through it, with ideally only one way to do
a specific thing.

Changes that we merged vary in terms of disruption - from aliases removal, which can be
fixed by a script, to substantial changes, such as a package name change.
The top-level list of changes is:

- Clarified NumPy's submodule structure and made all submodules accessible through
  lazy imports,
- Cleaned `numpy.lib` namespace and establish well-defined submodules for it,
- Settled on canonical data type names and documented those,
- Removed redundant aliases, such as these that point to `np.inf`: `np.Infinity`,
  `np.Inf`, `np.INF` and `np.infty`,
- Removed niche functions and internal constants from the main namespace,
- Rename `numpy.core` to `numpy._core` to clearly indicate that this is a private and
  internal submodule,
- Remove niche and misleading data type aliases, such as `int0`, `uint0`, `float_`.

To ensure a smooth migration to NumPy 2.0 we provide several areas where changes are
communicated/addressed:

- Clear and succinct release notes for each relevant PR.
- Migration guide containing all changes with migration instructions (what has changed
  and how it should be addressed in the codebase).
- Meaningful error messages and deprecation warnings, which can also provide migration
  instructions.
- Tool for automatic application of changes (originally a `sed` script was considered,
  but eventually a new `ruff` rule was implemented).

---

## Selected achievements & technical challenges

In this section, I will discuss significant milestones and more notable technical
challenges that we tackled along the way.

Cleaning up the main NumPy namespace included identifying "keep" and "remove" lists.
It took quite a few iterations to determine them and clear out the "tentative" list.
The main namespace members removed were mainly: internal enums (likely exposed by
accident), aliases for already existing constants and functions, already deprecated
items, and functions that were moved to other submodules. We managed to reduce the number
of entries in `np.*` by over 80:

```python
>>> import numpy as np
>>> np.__version__
'1.26.1'
>>> len(dir(np))
594
```

And now:

```python
>>> import numpy as np
>>> len(dir(np))
511
```

Each removed item was replaced by an `AttributeError` that contains a migration
guideline for end users:

```python
>>> np.byte_bounds
Traceback (most recent call last):
...
AttributeError: `np.byte_bounds` was removed in the NumPy 2.0 release. Now it's available under `np.lib.array_utils.byte_bounds`
```

### Guaranteeing backward compatibility

We've already touched on several types of Python API changes, such as removing aliases,
adding a new member to a namespace, or moving an existing item to a new location.
Each one of them have different repercussions in downstream libraries that heavily
depend on NumPy.

Downstream libraries that required modifications to adjust to the API changes were:
SciPy, Matplotlib, pandas, JAX, scikit-learn and CuPy. Also, there were some one-time
contributions to pybind11, joblib, and hypothesis libraries. For each one of them we had
to ensure that we do not narrow applicable NumPy versions down. We had to maintain a
compatibility with them:

**Backward compatibility** means that downstream library containing code written for
previous NumPy versions can be executed with a newer version - this type of compatibility
is the most desirable because it allows downstream users to just "bump" dependency
version number in e.g. `pyproject.toml` and call it a day.

**Forward compatibility** makes it possible to write code with a new NumPy version and
execute it with a previous one. This is often being broken with any new API entry as,
by definition, this entry isn't available in the old versions.

In our efforts we paid attention to backward compatibility. Libraries, such as SciPy,
run CI stages with both stable and nightly NumPy releases. It is required that we
continue to support several NumPy releases back, given the latest version of SciPy.

A backward incompatible change required us to, e.g., branch on the dependency version:

```python
AxisError: Type[Exception]

if np.lib.NumpyVersion(np.__version__) >= "1.25.0":
	from numpy.exceptions import AxisError
else:
	from numpy import AxisError
```

### Clearing out the `numpy.lib` namespace

One of the goals of NEP 52 was to enforce each function/constant to only be available
from one location, if possible. It especially concerns `numpy.lib`, whose
contents were almost fully exported to the main namespace. We did an analysis of
the module and split its members into:

- Main namespace exports - members exported to the `numpy` namespace.
- Local exports - members available only from the `numpy.lib` or `numpy.lib.<submodule>`.

Members exported to the main namespace ended up in private files, such as
`numpy.lib._array_utils_impl`, whereas ones exported locally received dedicated
submodules, e.g. `numpy.lib.array_utils`.

As a result, the number of members in `numpy.lib` reduced from:

```python
>>> import numpy as np
>>> np.__version__
'1.26.1'
>>> len([s for s in dir(np.lib) if not s.startswith('_')])
192
```

To:

```python
>>> import numpy as np
>>> len([s for s in dir(np.lib) if not s.startswith('_')])
13
```

Now `numpy.lib` hosts only a handful of functions and submodules with well-defined
purposes.

### Renaming `numpy.core` to `numpy._core`

In my opinion, the most challenging task was renaming the `numpy.core` submodule to
`numpy._core`. `numpy/core` contained most of NumPy's source code, and this change
affected both downstream libraries and NumPy-internal C code.

In terms of C-level code, it is worth emphasizing that not only does Python use C
functions through compiled extension modules, but also C code in NumPy accesses
functionality implemented in Python directly via `PyImport_XXX`.

For the source code that is compiled into extension modules, we only had to rename
`core` imports to `_core`. A more complex issue appeared for header files that are
included in third party objects. We wanted to make sure that library/executable
compiled with numpy 2.0 will work with numpy 1.x installed (and vice versa). For this
purpose, we used two simple mechanisms:

|                     | Built with numpy 1.x   | Built with numpy 2.0            |
| ------------------- | ---------------------- | ------------------------------- |
| numpy 1.x installed | standard execution     | falls back to second C's import |
| numpy 2.0 installed | uses `numpy.core` stub | standard execution              |

**Stubs** - After renaming `numpy.core` submodule to `numpy._core` we did not completely
remove the former. Instead, we replaced it with a stub module that replicates
`numpy._core` by importing it, but also generates an appropriate warning when accessed.
This was necessary to ensure that objects compiled with numpy 1.x will continue to work
with the numpy 2.0 release.

**Fallback imports** - An object compiled with numpy 2.0 headers should anticipate
different versions of locally available NumPy in the runtime. Therefore, a simple
"import fallback" mechanism has been implemented to cover both cases:

```c
PyObject *numpy = PyImport_ImportModule("numpy._core._multiarray_umath");
if (numpy == NULL && PyErr_ExceptionMatches(PyExc_ModuleNotFoundError)) {
  PyErr_Clear();
  numpy = PyImport_ImportModule("numpy.core._multiarray_umath");
}

if (numpy == NULL) {
  PyErr_SetString(PyExc_ImportError, "_multiarray_umath failed to import");
  return -1;
}
```

**Pickle files compatibility** - Inside pickled arrays there's a `numpy.core.multiarray._reconstruct`
path which has changed with the rename. To make old pickles loadable for NumPy 2.0
we rely on `numpy/core` stubs to ensure that relevant functions can be imported.
To make NumPy 2.0 pickles also loadable for NumPy 1.26.x, we backported `numpy/_core`
stubs to the maintenance branch. As a result, pickle files can be used without worrying
about NumPy or pickle versions.

Other libraries have also followed our lead and started working on renaming `core`
submodule to `_core`, such as Pandas - [(Pandas PR)](https://github.com/pandas-dev/pandas/pull/55429).

### Data type aliases analysis

NEP 52 was also an opportunity to spend some time revisiting dtype aliases that are
available in the main namespace `np.*` (1) and through `np.dtype(...)` (2).
The debate on the final form is still ongoing (specifically `np.int_` and `np.uint`) but
there are several groups of names that are available through (1) or (2):

- words: `float`, `cdouble`, `uint`, `bool`, `object`, `long` ...
- words+bits: `int16`, `uint8`, `float64`, ...
- symbols: `p`, `L`, `i`, ...
- symbols+bytes: `c8`, `i1`, `i2`, ...
- abstract types: `numeric`, `inexact`, `integer`, ...

The canonical names, that are available in the main namespace and should be used as
a first choice, are "words+bits". These names are unambiguous about which type we're
referring to, and we make an explicit declaration about precision, leaving no room for
platform-specific behavior. "Words" that refer to C types should be used when
interacting with C code outside of NumPy.

### A Ruff plugin for NumPy 2.0 migration rules

Ruff is a new Python linter that can outperform other well-known linting tools.
During one of the discussions on Scientific Python Discord server, we came up with
the idea of writing a dedicated Ruff rule to address NumPy 2.0 changes. The rule offers
an automated way to fix a large part of changes - migrating to retained aliases or
flagging lines that require manual intervention to be compatible with NumPy 2.0.

This assignment gave me the opportunity to write a bit of Rust code, since it is
the core language for Ruff. As of today, the PR is merged, but the rule is still
available in the "preview" mode only. In the local setup it managed to correctly fix
over a hundred of lines of code for the latest SciPy release source code.

The command for running the Ruff linter:

```sh
ruff check scipy/ --no-cache --fix
```

And here's a small passage from `git diff`:

```diff
-     	a = toarray(a, dtype=np.float_)
+     	a = toarray(a, dtype=np.float64)
...
-	elif (b == Inf and a == -Inf):
+	elif (b == np.inf and a == -np.inf):
...
-	math_dtypes = [np.int_, np.float_, np.complex_]
+	math_dtypes = [np.int_, np.float64, np.complex128]
```

Ruff rules open more robust ways to apply systematic changes to large codebases,
compared to regular expression searches, because they offer AST analysis rather
than a text-based search only.

---

## Wrapping up

My development and maintenance efforts on NumPy will continue, most notably around
Array API Standard support, where full compatibility is still being implemented.
The release of NumPy 2.0 is planned for early next year, and only then will the official
adoption of the new, major version begin.

---

## Acknowledgements

I would like to thank my mentors [Ralf Gommers](https://github.com/rgommers) and
[Nathan Goldbaum](https://github.com/ngoldbaum) for their advice and guidance during
the whole internship, [Melissa Weber Mendonça](https://github.com/melissawm) for
organising and conducting intern cohort meetings, and [Sebastian Berg](https://github.com/seberg)
for PR reviews and explaining NumPy internals. The time spent on NEP 52 was a perfect
primer to the Scientific Python ecosystem!

I look forward to continuing working on NumPy and other libraries within the community!

---

## References

- [NEP 52](https://numpy.org/neps/nep-0052-python-api-cleanup.html)
- [NumPy 2.0 migration guide](https://numpy.org/devdocs/numpy_2_0_migration_guide.html)
- [Main namespace cleanup tracking issue](https://github.com/numpy/numpy/issues/24306)
- [`numpy.lib` cleanup tracking issue](https://github.com/numpy/numpy/issues/24507)
- [`core` to `_core` refactor PR](https://github.com/numpy/numpy/pull/24634)
- [Ruff NumPy 2.0 rule PR](https://github.com/astral-sh/ruff/pull/7702)
