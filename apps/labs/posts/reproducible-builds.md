---
title: 'IPython reproducible builds'
published: August 24, 2020
author: matthias-bussonnier
description: 'Starting with IPython 7.16.1 (released in June 2020), you should be able to recreate the sdist (.tar.gz) and wheel (.whl), and get byte for byte identical result to the wheels published on PyPI. This is a critical step toward being able to trust your computing platforms, and a key component to improve efficiency of build and packaging platforms. It also potentially impacts fast conda environment creation for users. The following goes into some reasons for why you should care.'
category: [Developer workflows]
featuredImage:
  src: /posts/reproducible-builds/blog_feature_var2.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/reproducible-builds/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Starting with IPython 7.16.1 (released in June 2020), you _should_ be able to recreate the sdist (`.tar.gz`) and wheel
(`.whl`), and get byte for byte identical result to the wheels published on PyPI. This is a critical step toward being able
to _trust_ your computing platforms, and a key component to improve efficiency of build and packaging platforms. It also
potentially impacts fast conda environment creation for users. The following goes into some reasons for why you should care.

Since the cornerstone paper [Refections on trusting Trust][1], there have always been advocates of reproducible builds. In
today's highly interconnected world, and with the speed at which new software is released and deployed, being able to confirm
the provenance of build artifacts and verify that the supply chain has not been affected by a malicious actor is often critical. To help in this
endeavour, the movement of [reproducible builds][2], attempts to push software toward a deterministic and reproducible
build process.

[1]: https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf
[2]: https://reproducible-builds.org/

While information security practitioners were one of the earliest groups who advocated for reproducible builds, there
are a number of other advantages to ensure the same artifacts can be reproduced identically.

For the users of the Scientific Python ecosystem, the notion of reproducibility/replicability is not new, and is one of
the critical ideas behind the scientific process. Given some instructions from an author, you should be able to perform some
experiments or proof, and reach the same conclusion. When you see the opposite, your instructions or hypothesis are missing
some variable elements and your model is incomplete; having a complete model, reproducibility, is one of the necessary
component to be able to trust the results and build upon it. We are not going to enter into the exact distinction
between reproducible and replicable, both have their goals and uses.

# Aren't computers reproducible by design?

One of the prerequisites for reproducibility is to have a deterministic process, and while we tend to think about computers
as deterministic things, they often are not, and on purpose. Mainly driven by security concerns, a number of processes in
a computer use pseudo-randomness to prevent an attacker from gaining control over a system. Thus by default, many of the
typical actions you may do in a software (iterating over a set in Python, the hash value of strings), will have _some_ randomness in them,
which impact the determinism of a process.

There are of course a number of sources of involuntary randomness due to the practicality of computer systems. These
include: the current date and time, your user name and uid, hostname, order of files on your hard drive and in which
order they may be listed.

To obtain a reproducible result, one thus often needs to make sure each step is deterministic and that all the variables
influencing that process are either controlled or recorded.

# Reproducible artifact build

In IPython 7.16.1 we have tried to removed all sources of variability, by controlling the order in which the files are
generated, archived in the sdists, their metadata, timestamps, etc. Thus you should be able to go from the commit in the
source repository to the sdist/wheel and obtain an identical result. This should help you to trust that no backdoor has
been introduced in the released packages. It is also critically useful for efficiency in package managers.

Of course you have to trust that the IPython source itself and its dependencies are devoid of backdoors, but let's move
one step at a time. Reproducible build artifacts can also have impact on the build and installation process of packages.

# Efficient rebuilds of dependencies

Currently IPython depends on many packages: `prompt_toolkit`, `traitlets`, `setuptools`, and more. We also have a number of
downstream packages, like `ipykernel`, then `jupyter notebook`. When a dependency tree is rebuilt for one reason or another, a change of a
single bit could trigger the rebuild of the whole chain. When a package like IPython is not reproducible, this means a
rebuild of IPython – whether it has changed or not – could trigger a rebuild of all downstream elements.

With a reproducible build, you can trust that the artifact will not change after a rebuild. For the functional programmer
around you: it indicates that the process of building from source is a pure function. Therefore it can safely be part
of a distributed system (rebuilding on two different places will give the same result, so you can avoid costly data
movement), and we can also do caching of results, so for identical input we know the output will be identical.

This can allow breaking rebuild chains by stopping as soon as a dependency rebuild has no effect.

Thus, reproducible builds are a necessary but not sufficient condition to decrease the time spent by platforms like conda-forge on rebuilding the ecosystem
for a new version of Python; making new packages available faster.

# Deduplication

One rarely mentioned advantage is deduplication. In many cases there are no reasons why artifacts produced by a build
step would depend on _all_ of their inputs. For example IPython has currently no reason to build differently on Python 3.7,
3.8, and the soon-to-be-released 3.9, or on Linux/macOS/Windows. Nevertheless Conda provides no less than 10 downloads for each
release of IPython.

```bash
$ diff -U0  <(cd ipython-7.17.0-py37hc6149b9_0/ ; fd -tf --full-path  | xargs -L1 md5)  <(cd ipython-7.17.0-py38h1cdfbd6_0/ ; fd --full-path  -t f | xargs -L1 md5)
--- /dev/fd/63	August 24, 2020
+++ /dev/fd/62	August 24, 2020
@@ -316 +316 @@
-MD5 (Lib/site-packages/ipython-7.17.0.dist-info/RECORD) = 0ebe6e43ae9dcfc29b86338605fc9065
+MD5 (Lib/site-packages/ipython-7.17.0.dist-info/RECORD) = 16f820e051e75462d970be438fbd2b0a
@@ -319 +319 @@
-MD5 (Lib/site-packages/ipython-7.17.0.dist-info/direct_url.json) = 2c37570ef1bd3eadd669649da321b69f
+MD5 (Lib/site-packages/ipython-7.17.0.dist-info/direct_url.json) = b55d0dcd87b11218d41c34d8ee0a5016
@@ -331 +331 @@
-MD5 (info/files) = d24cc180f95193be847116340f1af63a
+MD5 (info/files) = 0161e68902cb78c6b1aec564c0a9e808
@@ -333,2 +333,2 @@
-MD5 (info/hash_input.json) = d25b93fadc7421a297daf02f9a04584f
-MD5 (info/index.json) = 0fb13436b493433c08c9b29c23b76180
+MD5 (info/hash_input.json) = b7c843bd4a6cef64080e893a939e95bd
+MD5 (info/index.json) = 6283e83efc554f9f5b4d4e2330d8ec4e
@@ -336,3 +336,3 @@
-MD5 (info/paths.json) = 06e6ba2378d6eecdfcf08e1c602d392b
-MD5 (info/recipe/conda_build_config.yaml) = 1a98301b552bde7a25c99a39711c9fe2
-MD5 (info/recipe/meta.yaml) = 1a823d7c8c2dac394617482c596f26f0
+MD5 (info/paths.json) = 0a82a812984f98660fbf0244eddeed38
+MD5 (info/recipe/conda_build_config.yaml) = e1c3ae7827bd7003e9034720c7b0f76c
+MD5 (info/recipe/meta.yaml) = 08d5f54df6083bfb834b24b9ae4c4e0f
@@ -342 +342 @@
-MD5 (info/test/test_time_dependencies.json) = a66ce3a62bd757ceede3ad5ef4c2c4b6
+MD5 (info/test/test_time_dependencies.json) = ca1e35258bf3ce4719b090a90f886cd6
```

I'm sure _some_ of these changes are necessary as they are related to which Python version the package refers to; but let's
look in more detail at one of those:

```bash
$ fd test_time_dependencies.json | xargs diff -U2
--- ipython-7.17.0-py37hc6149b9_0/info/test/test_time_dependencies.json	August 24, 2020
+++ ipython-7.17.0-py38h1cdfbd6_0/info/test/test_time_dependencies.json	August 24, 2020
@@ -1 +1 @@
-["matplotlib", "nbformat", "pygments", "ipykernel", "nose >=0.10.1", "trio", "numpy", "pip", "testpath", "requests"]
+["requests", "numpy", "matplotlib", "trio", "testpath", "pip", "pygments", "nbformat", "ipykernel", "nose >=0.10.1"]
```

Here the changes are minor and completely inconsequential for the use of the package; those changes prevent us from
detecting that two builds are actually identical.

This could allow to decrease precious disk space, bandwidth, and time spent waiting for software to install.

If you'd like to learn more about this topic, I'd recommend talking to some [Nix][Nix] users to see how a purely functional package manager works and
which other advantages this brings.

But in the meantime, please go track the various sources of randomness in your favorite library or build system, and
let's work together to change things so that things never change!


[Nix]: https://nixos.org/
