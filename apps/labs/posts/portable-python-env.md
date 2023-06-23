---
title: 'Creating a Portable Python Environment from Imports'
published: June 30, 2020
authors: [kim-pevey]
description: |
  A demonstration of a method to create a copy an exact dev environment on
  one machine, and transfering it to a another machine.
category: [Developer workflows]
featuredImage:
  src: /posts/portable-python-env/blog_feature_var1.svg
  alt: 'A brown and a black coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/portable-python-env/blog_hero_var1.svg
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

```sh
mkdir -p ./test_package
echo "import scipy" >> ./test_package/first_file.py
echo "import numpy" >> ./test_package/first_file.py
echo "import pandas" >> ./test_package/second_file.py
echo "import sklearn" >> ./test_package/second_file.py
```

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
