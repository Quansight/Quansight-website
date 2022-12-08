---
title: 'Measuring API usage for popular numerical and scientific libraries'
published: May 27, 2019
author: christopher-ostrouchov
description: 'Developers of open source software often have a difficult time understanding how others utilize their libraries. Having better data of when and how functions are being used has many benefits.'
category: [Developer workflows]
featuredImage:
  src: /posts/python-library-function-usage/blog_feature_var2.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/python-library-function-usage/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Developers of open source software often have a difficult time
understanding how others utilize their libraries. Having better data of
when and how functions are being used has many benefits. Some of these
are:

  - better API design
  - determining whether or not a feature can be deprecated or removed.
  - more instructive tutorials
  - understanding the adoption of new features

# Python Namespace Inspection

We wrote a general tool
[python-api-inspect](https://github.com/Quansight-Labs/python-api-inspect)
to analyze any function/attribute call within a given set of
namespaces in a repository. This work was heavily inspired by a blog
post on inspecting method usage with
[Google BigQuery](https://galeascience.wordpress.com/2016/08/10/top-10-pandas-numpy-and-scipy-functions-on-github/)
for [pandas](https://pandas.pydata.org/),
[NumPy](https://www.numpy.org/), and
[SciPy](https://www.scipy.org/). The previously mentioned work used
regular expressions to search for method usage. The primary issue with
this approach is that it cannot handle `import numpy.random as rand;
rand.random(...)` unless additional regular expressions are
constructed for each case and will result in false
positives. Additionally,
[BigQuery](https://cloud.google.com/bigquery/) is not a free resource.
Thus, this approach is not general enough and does not scale well with
the number of libraries that we would like to inspect function and
attribute usage.

A more robust approach is to inspect the Python abstract syntax tree
(AST). Python comes with a performant method from the [ast
module](https://docs.python.org/3/library/ast.html) `ast.parse(...)`
for constructing a Python AST from source code. A [node
visitor](https://docs.python.org/3/library/ast.html#ast.NodeVisitor)
is used to traverse the AST and record `import` statements, and
function/attribute calls. This allows us to catch any absolute
namespace reference. The following are cases that
[python-api-inspect](https://github.com/Quansight-Labs/python-api-inspect)
catches:

```python
import numpy
import numpy as np
import numpy.random as rnd
from numpy import random as rand

numpy.array([1, 2, 3])
numpy.random.random((2, 3))
np.array([1, 2, 3])
rnd.random((2, 3))
rand.random((2, 3))
```

There are limitations to this approach since Python is a heavily
duck-typed language. To understand this see the following two
examples.

```python
def foobar(array):
    return array.transpose()

a = numpy.array(...)

a.transpose()
foobar(a)
```

How is one supposed to infer that `a.transpose()` is a numpy
`numpy.ndarray` method or `foobar` is a function that takes a
`numpy.ndarray` as input? These are open questions that would allow
for further inspection of how libraries use given functions and
attributes. It should be noted that dynamically typed languages in
general [have this
problem](https://softwareengineering.stackexchange.com/questions/221615/why-do-dynamic-languages-make-it-more-difficult-to-maintain-large-codebases). Now
that the internals of the tool have been discussed, the usage is quite
simple. The repository
[Quansight-Labs/python-api-inspect](https://github.com/Quansight-Labs/python-api-inspect)
comes with two command line tools (Python scripts). The important tool
`inspect_api.py` has heavy caching of downloaded repositories and
source files that have been analyzed. Inspecting a file the second
time is a sqlite3 lookup. Currently, this repository inspects 17
libraries/namespaces and around 10,000 repositories (100 GB
compressed). It has been designed to have no other dependencies than
the Python [stdlib](https://docs.python.org/3/library/) and easily run
from the command line. Below is the command that is run when
inspecting all the libraries that depend on numpy.

```shell
python inspect_api.py data/numpy-whitelist.ini \
  --exclude-dirs test,tests,site-packages \
  --extensions ipynb,py \
  --output data/inspect.sqlite
```

The command comes with several options that can be useful for
filtering the results. `--exclude-dirs` is used to exclude directories
from counts (e.g. `tests` directory or `site-packages` directory)
within a repository. This option reveals the use of a given namespace
in tests as opposed to within the library. `--extensions` is by
default all Python files `*.py` but can also include Jupyter notebooks
`*.ipynb` showing us how users use a namespace in an interactive
context. Unsurprisingly this work found that many Jupyter notebooks in
repositories have syntax errors.

While not the focus of this post, an additional script is provided in
the repository `dependant-packages.py`. This script is used to
populate the `data/numpy-whitelist.ini` file with repositories that
depend on numpy. This would not be possible without the [libraries.io
API](https://libraries.io/api). It is a remarkable project which
deserves more attention.

# Results

The table below summarizes the findings of namespace usage within all
`*.py` files, all `*.py` in only test directories, all `*.py` files
excluding ones within test directories (`tests`, `test`), and only
Jupyter notebook `*.ipynb` files. All of the results are provided as
`csv` files. It is important to note that the `inspect_api.py` script
gets much more detail than is included in the `csv` files and there is
plenty of additional work that could be done with this tool for
general Python ast analysis.

<table>
<tr>
  <th>Library</th>
  <th>Whitelist</th>
  <th>Summary only `.py`</th>
  <th>Summary only `.py` tests</th>
  <th>Summary only `.py` without tests</th>
  <th>Summary only `.ipynb`</th>
</tr>
<tr>
  <td>astropy</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/astropy-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/astropy-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/astropy-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/astropy-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/astropy-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>dask</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/dask-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/dask-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/dask-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/dask-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/dask-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>ipython</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/ipython-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipython-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipython-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipython-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipython-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>ipywidgets</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/ipywidgets-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipywidgets-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipywidgets-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipywidgets-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/ipywidgets-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>matplotlib</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/matplotlib-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/matplotlib-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/matplotlib-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/matplotlib-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/matplotlib-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>numpy</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/numpy-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/numpy-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/numpy-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/numpy-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/numpy-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>pandas</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/pandas-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pandas-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pandas-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pandas-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pandas-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>pyarrow</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/pyarrow-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pyarrow-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pyarrow-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pyarrow-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pyarrow-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>pymapd</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/pymapd-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymapd-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymapd-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymapd-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymapd-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>pymc3</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/pymc3-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymc3-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymc3-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymc3-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pymc3-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>pytorch</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/pytorch-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pytorch-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pytorch-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pytorch-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/pytorch-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>requests</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/requests-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/requests-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/requests-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/requests-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/requests-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>scikit-image</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/scikit-image-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-image-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-image-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-image-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-image-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>scikit-learn</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/scikit-learn-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-learn-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-learn-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-learn-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scikit-learn-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>scipy</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/scipy-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scipy-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scipy-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scipy-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/scipy-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>statsmodels</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/statsmodels-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/statsmodels-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/statsmodels-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/statsmodels-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/statsmodels-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>sympy</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/sympy-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/sympy-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/sympy-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/sympy-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/sympy-summary-notebooks.csv"/>csv</a></td>
</tr>
<tr>
  <td>tensorflow</td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/whitelist/tensorflow-whitelist.ini"/>ini</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/tensorflow-summary.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/tensorflow-summary-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/tensorflow-summary-without-tests.csv"/>csv</a></td>
  <td><a href="https://github.com/costrouc/python-api-inspect/blob/master/data/csv/tensorflow-summary-notebooks.csv"/>csv</a></td>
</tr>
</table>

Since many namespaces were checked we will highlight only some of the
results. First for [NumPy](https://github.com/numpy/numpy) the
unsurprising function calls: `numpy.array`, `numpy.zeros`,
`numpy.asarray`, `numpy.arange`, `numpy.sqrt`, `numpy.sum`, and
`numpy.dot`. There are
[plans](https://docs.scipy.org/doc/numpy/reference/generated/numpy.matrix.html#numpy.matrix)
to deprecate `numpy.matrix` and this seem possible since it
[`numpy.matrix`](https://github.com/Quansight-Labs/python-api-inspect/blob/master/data/csv/numpy-summary-without-tests.csv#L515)
is not in the top 150 functions calls. Numpy testing functions were
the expected `testing.assert_allclose`, `testing.assert_almost_equal`,
and `testing.assert_equal`.

[SciPy](https://www.scipy.org/) acts as a glue for many algorithms
needed for scientific and numerical work. The usage of `scipy` is
surprising and also possibly the most accurate results of the
following analysis. This is due to the fact that `scipy` tends to be
function wrappers over lower level routines and less class instance
methods which are harder to detect as discussed above. The `sparse`
methods are heavily used along with several high level wrappers for
`scipy.interpolate.interp1d` and `scipy.optimize.minimize`. I was
surprised to find out one of my favorite SciPy methods,
`scipy.signal.find_peaks`, is rarely used! Only a small fraction of the
`scipy.signal` functions are used and these include:
`scipy.signal.lfilter`, `scipy.signal.fftconvolve`,
`scipy.signal.convolve2d`, `scipy.signal.lti`, and
`scipy.signal.savgol_filter`.

[scikit-learn](https://scikit-learn.org/stable/) is a popular library
for data analysis and offers some of the traditional machine learning
algorithms. Interestingly here we order the most used models.

1. `sklearn.linear_model.LogisticRegression`
2. `sklearn.decomposition.PCA`
3. `sklearn.ensemble.RandomForestClassifier`
4. `sklearn.cluster.KMeans`
5. `sklearn.svm.SVC`

[pandas](https://pandas.pydata.org/) is another popular data analysis
library for tabular data that helped drive the popularity of
Python. One of the huge benefits of `pandas` is that it allows reading
many file formats to a single in memory `pandas.DataFrame`
object. Unsurprisingly the most popular `pandas` functions are
`pandas.DataFrame` and `pandas.Series`. Here we rank the most popular
`pandas.read_*` functions.

1. `pandas.read_csv`
2. `pandas.read_table`
3. `pandas.read_sql_query`
4. `pandas.read_json`
5. `pandas.read_pickle`

[requests](https://github.com/kennethreitz/requests) makes working
with HTTP requests easier to work with than the stdlib
[urllib.request](https://docs.python.org/3/library/urllib.request.html)
and is one of the [most downloaded
packages](https://hugovk.github.io/top-pypi-packages/). Looking at the
data for usage of `requests`, three functions are primarily used
(everything else is used 3-5x less): `requests.get`, `requests.post`,
and `requests.Session` with `headers` being the most common argument.

Overall it is clear that libraries are being used differently within
either a package, tests, or notebooks. Notebooks tend to prefer high
level routines such as `scipy.optimize.minimize`, `numpy.linspace`,
`matplotlib.pyplot.plot` which can be used for demos. Additionally
notebook function usage would be a good metric for material that is
worthwhile to include in introduction and quick-start
documentation. The same goes for testing and development documentation
that is equally informed as to what functions are used in tests and in
packages. Further work is necessary to generalize this tool as it
could be useful for the Python ecosystem to better understand through
analytics how the language is being used.
