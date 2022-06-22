---
title: 'Creating a Portable Python Environment from Imports'
published: June 30, 2020
author: kim-pevey
description: A demonstration of a method to create a copy an exact dev environment on
one machine, and transfering it to a another machine. 
category: [Developer workflows]
featuredImage:
  src: /posts/2020/06/portable-python-env/blog_feature_var1.svg
  alt: 'A brown and a black coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/2020/06/portable-python-env/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

Python environments provide sandboxes in which packages can be added.
Conda helps us deal with the requirements and dependencies of those packages.
Occasionally we find ourselves working in a constrained remote machine which
can make development challenging. Suppose we wanted to take our exact dev
environment on the remote machine and recreate it on our local machine.
While conda relieves the package dependency challenge, it can be hard to
reproduce the exact same environment.

# Creating a Portable Python Environment

This walkthrough will demonstrate a method to copy an exact environment on
one machine and transfer it to a another machine. We'll start by collecting
the package requirements of a given set of python files, create an environment
based on those requirements, then export it as a tarball for distribution on a
target machine.

## Setup

### Sample files

For this walkthrough we'll assume you have a folder with some python files
as a rudimentary "package".

If you want to create some example files, run the following commands:

`mkdir -p ./test_package`
`echo "import scipy" >> ./test_package/first_file.py`
`echo "import numpy" >> ./test_package/first_file.py`

`echo "import pandas" >> ./test_package/second_file.py`
`echo "import sklearn" >> ./test_package/second_file.py`

Each file has a few import statements - nothing fancy.

## Extracting the required packages

In order to roll up the environment for the package, we first need to know what
the package requires. We will collect all the dependencies and create an environment file.

### Get direct dependencies

The first step is to collect dependencies. We'll do this using
[depfinder](http://ericdill.github.io/depfinder/). It can be installed into your
environment: `conda install -c conda-forge depfinder`

This will be as simple as calling `depfinder` on our `test_package` directory.
We add the `-y` command to return yaml format.

`depfinder -y ./test_package`

This command returns a YAML formatted list with our dependencies. We are interested
in the `required` dependencies, which are the external package requirements.

```yaml
required:
  - numpy
  - pandas
  - scikit-learn
  - scipy
  - ipython
```

### Create a temporary environment

Now we have a list of the direct dependencies but what about all the sub-dependencies?
To capture these, we'll create a temporary environment.

Copy the yaml formatted dependencies into an environment file named `environment.yml`.

```yaml
name: my_env
channels:
  - conda-forge
dependencies:
  - python>=3.7
  - numpy
  - pandas
  - scikit-learn
  - scipy
  - ipython
  - conda-pack
```

Notice that we've added two extra packages to our `environment.yml`.
In this example, we'll set a minimum python version to include in the package.
We could also have explicitly set the Python version. You may notice that we
have also added an additional package called called `conda-pack`. This will be used
for wrapping up the environment for distribution - more on that later.

Create a conda environment from this yaml that will include all of the necessary
dependencies.

`conda env create -f environment.yml`

Activate the temporary conda env:

`conda activate my_env`

## Wrap up the environment into a tarball

At this point, we're ready to wrap up our environment into a single tarball.
To do this, we'll use a package called `conda-pack`. `Conda-pack` is going to help us
wrap up our exact environment, including python itself. This means that the target machine
is not required to have python installed for this environment to be utilized. Much of what
follows is taken directly from the `conda-pack` docs.

Pack environment my_env into out_name.tar.gz

`conda pack -n my_env -o my_env.tar.gz`

## Unpacking the environment on the target machine

At this point you will have a portable tarball that you can send to a different
machine. Note that the tarball you've created must only be used on target machines
with the same operating system.

Now we'll go over how to unpack the tarball on the target machine and utilize this
environment.

Unpack environment into directory `my_env`:

`$ mkdir -p my_env`
`$ tar -xzf my_env.tar.gz -C my_env`

We could stop here and start using the python environment directly. Note that most
Python libraries will work fine, but things that require prefix cleanups (since
we've built it in one directory and moved to another) will fail.

`$ ./my_env/bin/python`

Alternatively we could activate the environment. This adds `my_env/bin` to your path

`$ source my_env/bin/activate`

And then run python from the activated environment

`(my_env) $ python`

Cleanup prefixes from inside the active environment.
Note that this command can also be run without activating the environment
as long as some version of python is already installed on the machine.

`(my_env) $ conda-unpack`

At this point the environment is exactly as if you installed it here
using conda directly. All scripts should be fully functional, e.g.:

`(my_env) $ ipython --version`

When you're done, you may deactivate the environment to remove it from your path

`(my_env) $ source my_env/bin/deactivate`

## Conclusion

We've successfully collected the Python package requirements for a set of Python files.
We've created the environment to run those files and wrapped that environment into a
tarball. Finally, we distributed the tarballed environment onto a different machine and
were immediately able to utilize an identical copy of Python environment from the
original machine.

making-gpus-accessible-to-pydata-ecosystem-via-array-api
https://labs.quansight.org/blog/2021/11/pydata-extensibility-vision/)
no llc links found
what-do-we-need-to-write
no labs links found
no llc links found
the-evolution-of-the-scipy-developer-cli
no labs links found
no llc links found
jupyter-czi-accessibility-roadmap-announcement
no labs links found
no llc links found
conda-grayskull-packaging
no labs links found
no llc links found
ipython-8.0-lessons-learned-maintaining-software
no labs links found
no llc links found
whats-new-in-sympy-14
no labs links found
no llc links found
joining*labs
no labs links found
https://www.quansight.com/post/welcoming-ralf-gommers-as-director-of-quansight-labs) welcoming me, Travis set out his vision for pushing forward the Python ecosystem for scientific computing and data science, and how to fund it. In this post I'll add my own perspectives to that. Given that Quansight Labs' purpose, it seems fitting to start with how I see things as a community member and organizer.
labs-status-update
https://labs.quansight.org/blog/2019/04/uarray-intro/)
no llc links found
release-spyder-4beta2
no labs links found
no llc links found
python-library-function-usage
no labs links found
no llc links found
community-opensource-funded-development
no labs links found
no llc links found
uarray-attempting-to-move-the-ecosystem-forward
no labs links found
no llc links found
numpy_CZI_grant
no labs links found
no llc links found
Spyder4-variable-explorer
no labs links found
no llc links found
Files-Improvements
no labs links found
no llc links found
quansight-labs-work-update-for-september-2019
no labs links found
no llc links found
quansight-at-scipy2019
no labs links found
no llc links found
ruby-wrappers-for-the-xnd-project
no labs links found
no llc links found
spyder-40-beta4-kite-integration-is-here
no labs links found
no llc links found
labs-dask-update
no labs links found
no llc links found
tdk-partners-with-quansight-labs
no labs links found
no llc links found
labs-status-update-may
https://labs.quansight.org/blog/2019/05/community-driven-opensource-funded-development/)
no llc links found
metadsl-talk
https://labs.quansight.org/blog/2019/05/metadsl-dsl-framework/
no llc links found
accessibility-whos-responsible
no labs links found
no llc links found
pytorch-tensoriterator-internals-update
no labs links found
no llc links found
spot-the-differences
no labs links found
no llc links found
a-step-towards-educating-with-spyder
no labs links found
no llc links found
rethinking-jupyter-documentation
no labs links found
no llc links found
putting-out-the-fire
no labs links found
no llc links found
enhancements-to-numba-guvectorize-decorator
no labs links found
no llc links found
pydata-extensibility-vision
https://labs.quansight.org/blog/2021/10/array-libraries-interoperability/),
no llc links found
numpy_benchmarking_blog
no labs links found
no llc links found
array-libraries-interoperability
no labs links found
no llc links found
jupyter-community-calls
no labs links found
no llc links found
dataframe-interchange-protocol-and-the-vaex-library
no labs links found
no llc links found
re-engineering-cicd-pipelines-for-scipy
https://labs.quansight.org/blog/2021/07/moving-scipy-to-meson/) describes the migration process in detail and sets the future course for SciPy developers to look forward to faster builds.
no llc links found
cxx-numba-interoperability
no labs links found
no llc links found
interchange-dataframe-protocol-for-cudf
no labs links found
no llc links found
introducing-code-generator-v020
no labs links found
no llc links found
moving-scipy-to-meson
no labs links found
no llc links found
better-interractive-jupyter-session-with-pyflyby
no labs links found
no llc links found
numpy-accessibility-guidelines
no labs links found
no llc links found
not-a-checklist
https://labs.quansight.org/blog/2021/03/accessibility-whos-responsible/),
no llc links found
low-code-workshop
no labs links found
no llc links found
github-actions-benchmarks
no labs links found
no llc links found
czi-eoss4-grants-at-quansight-labs
https://labs.quansight.org/blog/2021/05/rethinking-jupyter-documentation/) ways to improve the Jupyter documentation experience.
no llc links found
welcome-tania-allard-as-labs-codirector
no labs links found
no llc links found
scipy-ndimage-interpolation
no labs links found
no llc links found
packaging_painpoints_in_2021
https://labs.quansight.org/blog/2020/08/ipython-reproducible-builds/) for more on this topic.*
no llc links found
uarray-gsoc-participation
no labs links found
no llc links found
documentation-as-a-way-to-build-community
https://labs.quansight.org/blog/2019/11/numpy-openblas-CZI-grant/). As a former professor in mathematics, this seemed like an interesting project both because of its potential impact on the NumPy (and larger) community and because of its relevance to me, as I love writing educational material and documentation. Having official high-level documentation written using up-to-date content and techniques will certainly mean more users (and developers/contributors) are involved in the NumPy community.
no llc links found
pytorch-tensoriterator-internals
no labs links found
no llc links found
Spyder-4-acknowledgements
https://labs.quansight.org/blog/2019/11/variable-explorer-improvements-in-Spyder-4/) [blog](https://labs.quansight.org/blog/2019/11/File-management-improvements-in-Spyder4/) [posts](https://labs.quansight.org/blog/2019/08/spyder-40-beta4-kite-integration-is-here/), and in detail in our [Changelog](https://github.com/spyder-ide/spyder/blob/master/CHANGELOG.md#version-400-April 28, 2020
no llc links found
my-unexpected-dive-into-open-source-python
no labs links found
no llc links found
whats-next-for-pydatasparse
no labs links found
no llc links found
Spyder-terminal
no labs links found
no llc links found
manylinux1-manylinux2010
no labs links found
no llc links found
a-second-czi-grant-for-numpy-and-openblas
https://labs.quansight.org/blog/2019/11/numpy-openblas-CZI-grant/)
no llc links found
design*in_open_source
no labs links found
no llc links found
the-ibis-backends
https://labs.quansight.org/blog/2020/06/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/
no llc links found
nixos-rpi-wifi-router
no labs links found
no llc links found
Three-months-and-having-fun
no labs links found
no llc links found
writing-docs-is-not-just-writing-docs
https://labs.quansight.org/blog/2020/03/documentation-as-a-way-to-build-community/), I learned writing documentation is also a way of building community.
no llc links found
versioned-hdf5-performance
https://labs.quansight.org/blog/2020/08/introducing-versioned-hdf5/), we introduced the Versioned HDF5 library, which implements a mechanism for storing binary data sets in a versioned way that feels natural to users of other version control systems, and described some of its features. In this post, we'll show some of the performance analysis we did while developing the library, hopefully making the case that reading and writing versioned HDF5 files can be done with a nice, intuitive API while being as efficient as possible. The tests presented here show that using the Versioned HDF5 library results in reduced disk space usage, and further reductions in this area can be achieved with the use of HDF5/[h5py](https://www.h5py.org)-provided compression algorithms. That only comes at a cost of <10x file writing speed.
no llc links found
reproducible-builds
no labs links found
no llc links found
designing-with-and-for-developers
no labs links found
no llc links found
but-what-are-traitlets
no labs links found
no llc links found
introducing-versioned-hdf5
no labs links found
no llc links found
portable-python-env
no labs links found
no llc links found
jupyterlab-winter-theme
no labs links found
no llc links found
making-gpus-accessible-to-pydata-ecosystem-via-array-api
https://labs.quansight.org/blog/2021/11/pydata-extensibility-vision/)
no llc links found
what-do-we-need-to-write
no labs links found
no llc links found
the-evolution-of-the-scipy-developer-cli
no labs links found
no llc links found
jupyter-czi-accessibility-roadmap-announcement
no labs links found
no llc links found
conda-grayskull-packaging
no labs links found
no llc links found
ipython-8.0-lessons-learned-maintaining-software
no labs links found
no llc links found
whats-new-in-sympy-14
no labs links found
no llc links found
joining_labs
no labs links found
https://www.quansight.com/post/welcoming-ralf-gommers-as-director-of-quansight-labs) welcoming me, Travis set out his vision for pushing forward the Python ecosystem for scientific computing and data science, and how to fund it. In this post I'll add my own perspectives to that. Given that Quansight Labs' purpose, it seems fitting to start with how I see things as a community member and organizer.
labs-status-update
https://labs.quansight.org/blog/2019/04/uarray-intro/)
no llc links found
release-spyder-4beta2
no labs links found
no llc links found
python-library-function-usage
no labs links found
no llc links found
community-opensource-funded-development
no labs links found
no llc links found
uarray-attempting-to-move-the-ecosystem-forward
no labs links found
no llc links found
numpy_CZI_grant
no labs links found
no llc links found
Spyder4-variable-explorer
no labs links found
no llc links found
Files-Improvements
no labs links found
no llc links found
quansight-labs-work-update-for-september-2019
no labs links found
no llc links found
quansight-at-scipy2019
no labs links found
no llc links found
ruby-wrappers-for-the-xnd-project
no labs links found
no llc links found
spyder-40-beta4-kite-integration-is-here
no labs links found
no llc links found
labs-dask-update
no labs links found
no llc links found
tdk-partners-with-quansight-labs
no labs links found
no llc links found
labs-status-update-may
https://labs.quansight.org/blog/2019/05/community-driven-opensource-funded-development/)
no llc links found
metadsl-talk
https://labs.quansight.org/blog/2019/05/metadsl-dsl-framework/
no llc links found
accessibility-whos-responsible
no labs links found
no llc links found
pytorch-tensoriterator-internals-update
no labs links found
no llc links found
spot-the-differences
no labs links found
no llc links found
a-step-towards-educating-with-spyder
no labs links found
no llc links found
rethinking-jupyter-documentation
no labs links found
no llc links found
putting-out-the-fire
no labs links found
no llc links found
enhancements-to-numba-guvectorize-decorator
no labs links found
no llc links found
pydata-extensibility-vision
https://labs.quansight.org/blog/2021/10/array-libraries-interoperability/),
no llc links found
numpy_benchmarking_blog
no labs links found
no llc links found
array-libraries-interoperability
no labs links found
no llc links found
jupyter-community-calls
no labs links found
no llc links found
dataframe-interchange-protocol-and-the-vaex-library
no labs links found
no llc links found
re-engineering-cicd-pipelines-for-scipy
https://labs.quansight.org/blog/2021/07/moving-scipy-to-meson/) describes the migration process in detail and sets the future course for SciPy developers to look forward to faster builds.
no llc links found
cxx-numba-interoperability
no labs links found
no llc links found
interchange-dataframe-protocol-for-cudf
no labs links found
no llc links found
introducing-code-generator-v020
no labs links found
no llc links found
moving-scipy-to-meson
no labs links found
no llc links found
better-interractive-jupyter-session-with-pyflyby
no labs links found
no llc links found
numpy-accessibility-guidelines
no labs links found
no llc links found
not-a-checklist
https://labs.quansight.org/blog/2021/03/accessibility-whos-responsible/),
no llc links found
low-code-workshop
no labs links found
no llc links found
github-actions-benchmarks
no labs links found
no llc links found
czi-eoss4-grants-at-quansight-labs
https://labs.quansight.org/blog/2021/05/rethinking-jupyter-documentation/) ways to improve the Jupyter documentation experience.
no llc links found
welcome-tania-allard-as-labs-codirector
no labs links found
no llc links found
scipy-ndimage-interpolation
no labs links found
no llc links found
packaging_painpoints_in_2021
https://labs.quansight.org/blog/2020/08/ipython-reproducible-builds/) for more on this topic.*
no llc links found
uarray-gsoc-participation
no labs links found
no llc links found
documentation-as-a-way-to-build-community
https://labs.quansight.org/blog/2019/11/numpy-openblas-CZI-grant/). As a former professor in mathematics, this seemed like an interesting project both because of its potential impact on the NumPy (and larger) community and because of its relevance to me, as I love writing educational material and documentation. Having official high-level documentation written using up-to-date content and techniques will certainly mean more users (and developers/contributors) are involved in the NumPy community.
no llc links found
pytorch-tensoriterator-internals
no labs links found
no llc links found
Spyder-4-acknowledgements
https://labs.quansight.org/blog/2019/11/variable-explorer-improvements-in-Spyder-4/) [blog](https://labs.quansight.org/blog/2019/11/File-management-improvements-in-Spyder4/) [posts](https://labs.quansight.org/blog/2019/08/spyder-40-beta4-kite-integration-is-here/), and in detail in our [Changelog](https://github.com/spyder-ide/spyder/blob/master/CHANGELOG.md#version-400-April 28, 2020
no llc links found
my-unexpected-dive-into-open-source-python
no labs links found
no llc links found
whats-next-for-pydatasparse
no labs links found
no llc links found
Spyder-terminal
no labs links found
no llc links found
manylinux1-manylinux2010
no labs links found
no llc links found
a-second-czi-grant-for-numpy-and-openblas
https://labs.quansight.org/blog/2019/11/numpy-openblas-CZI-grant/)
no llc links found
design_in_open_source
no labs links found
no llc links found
the-ibis-backends
https://labs.quansight.org/blog/2020/06/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/
no llc links found
nixos-rpi-wifi-router
no labs links found
no llc links found
Three-months-and-having-fun
no labs links found
no llc links found
writing-docs-is-not-just-writing-docs
https://labs.quansight.org/blog/2020/03/documentation-as-a-way-to-build-community/), I learned writing documentation is also a way of building community.
no llc links found
versioned-hdf5-performance
https://labs.quansight.org/blog/2020/08/introducing-versioned-hdf5/), we introduced the Versioned HDF5 library, which implements a mechanism for storing binary data sets in a versioned way that feels natural to users of other version control systems, and described some of its features. In this post, we'll show some of the performance analysis we did while developing the library, hopefully making the case that reading and writing versioned HDF5 files can be done with a nice, intuitive API while being as efficient as possible. The tests presented here show that using the Versioned HDF5 library results in reduced disk space usage, and further reductions in this area can be achieved with the use of HDF5/[h5py](https://www.h5py.org)-provided compression algorithms. That only comes at a cost of <10x file writing speed.
no llc links found
reproducible-builds
no labs links found
no llc links found
designing-with-and-for-developers
no labs links found
no llc links found
but-what-are-traitlets
no labs links found
no llc links found
introducing-versioned-hdf5
no labs links found
no llc links found
