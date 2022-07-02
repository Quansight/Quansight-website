---
title: 'Conda and Grayskull, the Masters of Software Packaging'
published: January 19, 2022
author: mahe-iram-khan
description: 'Grayskull is an automatic conda recipe generator, with a focus on conda-forge.'
category: [Packaging]
featuredImage:
  src: ../public/posts/conda-grayskull-packaging/package_name_feature.png
  alt: "A flow diagram of a 'package name' being fed into a gray colored skull which represents the tool Grayskull and being converted into a curled up piece of paper which represents a recipe."
hero:
  imageSrc: ../public/posts/conda-grayskull-packaging/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

Python might be the most popular snake out there, but most of us have also heard of that other serpent: Conda. And some of us have wondered what it really is. In this post we’ll learn about Conda, software packages and package recipes. Most importantly we’ll learn about Grayskull — a conda recipe generator.

Hey! I’m [Mahe](https://twitter.com/IramMahe), a Computer Engineering student from India.
During the summer of 2021 I was an intern at Quansight Labs and I worked on a project called ‘Grayskull’.
Before we learn about Grayskull, as promised, I’ll talk about software packages and Conda.

## Software Packages
A software package is an installable piece of code that somebody wrote and published for others to use. In other words, you can install packages so you can benefit from the code others have written without reinventing the wheel.

```python
import numpy
```

That’s you ‘importing’ the package numpy into your code.

## Hosting packages
Once you have written a package you might want to publish it so that others can download it and use it. Depending on the packaging technology you are using, the online location where these packages are made available will receive a different name. Typically, users will know about hosting packages on [PyPI](https://pypi.org/). In the Conda world, packages are hosted on _channels_.
Channels are like warehouses of packages.

## Conda
[Conda](https://conda.io/en/latest/index.html) is an OS-agnostic package and environment manager with great popularity in the Python world and data science adjacent libraries. As such, it will allow you to manage the environments and dependencies of your packages and generate the needed context for your project to run successfully on a variety of machines.

Its companion project, Conda-build, is a set of commands and tools that lets you build your own packages for Conda. To create a package with Conda-build, you need to provide a _recipe_: the packaging metadata and build instructions for that specific package. Minimally, a recipe contains a `meta.yaml` file that describes:

- The package name and version
- Where to get its source code from
- Its dependencies
- How to build it
- Some other metadata

You can learn more about recipes [here](https://docs.conda.io/projects/conda-build/en/latest/resources/define-metadata.html#meta-yaml).

<p align="center">
    <img
     alt="An illustration of a curled up piece of paper with recipe contents on it. The items listed on it are the ones mentioned previously."
     src="../public/posts/conda-grayskull-packaging/recipe_animation.png" />
    <br />
    <i>Cute representation of a package recipe</i>
</p>


[Anaconda](https://anaconda.org/), the company behind the development of Conda and Conda-build, also provides the de-facto online platform where most Conda channels are hosted. This includes the official Anaconda channel, called ‘defaults’. There are several community driven channels as well, [conda-forge](https://conda-forge.org) being the most popular one.
From here onwards in this blog we’ll assume that we want to publish our package on the conda-forge channel.

## Publishing a package on conda-forge
Since conda-forge relies on Conda-build, publishing packages on the conda-forge channel requires creating recipes.

To publish your package, you need to write its recipe and then submit it through a pull request on the [staged-recipes](https://github.com/conda-forge/staged-recipes) repository of conda-forge. This pull request will be community reviewed and if approved, your package will become available on the conda-forge channel.

<p align="center">
    <img
     alt="A flow diagram of a curled up piece of paper (representing a recipe) passing through a thunder bolt (representing conda-build machinery) and being converted into a brown box (representing a package)."
     src="../public/posts/conda-grayskull-packaging/conda-build.png">
    <i><br>Internally, conda-forge uses Conda-build to transform recipes into packages</i>
</p>

## Grayskull — the automatic Conda recipe generator
The process to publish a package on conda-forge is simple and straight forward: write the recipe, create a pull request, wait for the community review. But writing recipes is not simple. It can be error prone and tiresome.
To alleviate this conda-forge provides a template recipe that can be used as a starting point and edited according to one’s needs. But even that could be too intimidating for someone new to packaging and recipes.

Grayskull solves this problem. Grayskull is an automatic conda recipe generator, with a focus on conda-forge. It generates concise and accurate recipes very quickly, provided the package is available on PyPI.
All you have to do is pass in the name of the Python package to Grayskull and it will generate its recipe for you.

<p align="center">
    <img
     alt="A flow diagram of a 'package name' being fed into a gray colored skull which represents the tool Grayskull and being converted into a curled up piece of paper which represents a recipe."
     src="../public/posts/conda-grayskull-packaging/package_name.png">
    <i><br>Grayskull automates recipe generation</i>
</p>

Now that you have the package recipe, you create a pull request on the staged-recipes repository and wait for someone from the conda-forge community to review it. You know the drill!

## But what if a package is not published on PyPI?
Yes. Unfortunately, that’s where Grayskull falls a little short. It only generates recipes for Python packages available on [PyPI](https://pypi.org/). This prerequisite leaves out a number of Python packages otherwise available online.

## My life’s purpose — making Grayskull more versatile
During my internship at Quansight Labs, I added the ability to generate recipes from GitHub repositories.
This way, a package that has not been published on PyPI but lives as a GitHub repository may have its recipe automatically generated with Grayskull.

Before my work, Grayskull would extract metadata of the package from two sources: PyPI and the source distribution (often abbreviated as ‘sdist’). It then merged the PyPI metadata and the sdist metadata and used the resulting information to generate the final recipe.
For Grayskull to accept packages coming from GitHub, I had to bypass some parts of that logic and patch others.

For a package not published on PyPI, the PyPI metadata doesn’t exist. So for a GitHub package, I made Grayskull skip the part where it extracts metadata from PyPI. This way, only the sdist metadata was used to generate the recipe.

Of course I found that some information in the recipe was missing when it was generated using only the sdist metadata. To overcome this limitation, I introduced additional ‘layers’ (requests to the GitHub API, SHA256 hash generation and more) in the mechanism to retrieve the missing information from GitHub and the package itself, thus generating a perfect and concise Conda recipe.

## Generating a recipe for a package from GitHub
<p align="center">
    <img
     alt="A screencast of the Grayskull CLI when it is being used to generate the recipe for a GitHub package called ensureconda."
     src="../public/posts/conda-grayskull-packaging/ensureconda.gif">
    <i><br>Grayskull generates the recipe for a package called ‘ensureconda’ which exists only as a GitHub repository and is not available on PyPI</i>
</p>

## Grayskull’s future
Grayskull is a very useful tool for conda packaging with a wide scope of enhancement.
Now Grayskull can generate recipes for GitHub repositories along with PyPI projects. In the future, we could also discuss how to make Grayskull work with:

- GitLab packages
- PyProject packages
- Other non Python packages such as R and C++ packages

I hope to continue working on this very interesting project that makes everybody’s life so much easier. :)

Do check out the [Grayskull GitHub repository](https://github.com/conda-incubator/grayskull).

PS: I want to thank my mentor [Jaime](https://twitter.com/jaime_rgp) for making this internship a memorable, fun learning experience for me. Head [here](https://maheiram.medium.com/my-godsent-god-lookalike-mentor-ee05b78c475b) to read a small note I wrote reflecting on my time working with and learning from Jaime.

PPS: I presented a lightning talk on Grayskull during [PackagingCon'21](https://packaging-con.org/). Check out the recording [here](https://youtu.be/BpRef4U-4sI?t=942).
