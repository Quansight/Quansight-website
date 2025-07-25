---
title: 'Python Wheels: from Tags to Variants'
published: August 1, 2025
authors: [michal-gorny]
description: 'The story of how the Python Wheel Variants were developed'
category: [Packaging]
featuredImage:
  src: /posts/python-wheels-from-tags-to-variants/featured.jpeg
  alt:
hero:
  imageSrc: /posts/python-wheels-from-tags-to-variants/hero.jpeg
  imageAlt:
---

# Python Wheels: from Tags to Variants

Many Python distributions are uniform across different Python versions
and platforms. For these distributions, it is sufficient to publish
a single binary package that can be installed everywhere. However, some
packages are more complex than that — they include compiled Python
extensions, binaries or even Python code that differs across systems.
In order to robustly deploy these software on different platforms,
you need to publish multiple binary packages, with the installers
being able to select the one best fit the platform used.

For a long time,
<a rel="external"
href="https://packaging.python.org/en/latest/specifications/binary-distribution-format/">Python
Wheels</a> made do with a relatively simple mechanism
of providing the needed variance: <a rel="external"
href="https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/">
Platform Compatibility Tags</a>. Tags identified different Python implementation and versions,
operating systems, CPU architectures. Over time, they were extended
to facilitate new use cases. To list a few: <a rel="external"
href="https://peps.python.org/pep-0513/">PEP 513</a> added
<code>manylinux</code> tags to standardize the dependency on GNU/Linux
systems, <a rel="external"
href="https://peps.python.org/pep-0656/">PEP 656</a> added
<code>musllinux</code> tags to facilitate Linux systems with musl libc.

However, not all new use cases could be handled effectively within
the framework of tags. The advent of GPU-backed computing made distinguishing
different acceleration frameworks such as CUDA or ROCm important.
As many distributions have set baselines for their binary packages
to x86-64 v2, Python packages also started looking at the opportunity
to express the same requirement. Numerical libraries support different
BLAS/LAPACK, MPI, OpenMP providers — and wish to enable the users to choose
the build using their desired provider.
While technically tags could be bent to facilitate all these use cases,
they would grow quite baroque. Perhaps most importantly, every change
to tags need to be implemented in all installers and package-related
tooling separately, making the adoption difficult.

Facing these limitations, software vendors employed different solutions to work
around the lack of appropriate mechanism. Eventually,
as part of the <a rel="external" href="https://wheelnext.dev/">WheelNext</a>
initiative, we have started working on a more robust solution: Variant
Wheels. In this blog post, I would like to tell the story behind
the solution that emerged.

## The limits of platform compatibility tags

Platform compatibility tags are pretty powerful and cover a surprisingly wide
range of use cases, perhaps even beyond what they were initially meant
to support. Each wheel features three Platform Tags:

- Python tag specifying the required Python implementation and version

- ABI tag specifying the required Python implementation ABI (usually used with
  extensions)

- Platform tag specifying the compatible platform (usually operating system
  and CPU architecture)

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/tag-combo.png"
    width="648" height="108" alt="A visualization of a wheel filename with
interchangeable tags. The filename consists of 'example-1.2.3', followed
by three dash-separated tags, followed by '.whl'. The examples for the first
tag list 'py3', 'py312', 'cp311', 'pp311', 'cp313'. The examples for the second
tag list 'none', 'abi3', 'pypy311_pp73' and 'py313t'. The examples for the third
tag list 'macosx_14_0_arm64', 'any', 'manylinux_2_34_x86_64', 'musllinux_1_2_aarch64'
and 'win_amd64'." />
  <figcaption>Fig. Different tag combinations</figcaption>
</figure>
</div>

Where it gets really interesting is how different projects make use of various
tag combinations. For example, a single package could combine the following
conventions:

- `cp311-abi3-manylinux_2_34_x86_64` uses CPython's stable ABI (`abi3`),
  in the version compatible with CPython 3.11 or newer (`cp311`).
  It is compatible with GNU/Linux systems with glibc 2.34 or newer,
  on x86-64 architecture (all that encoded in the `manylinux_2_34_x86_64`
  platform tag). This is the primary wheel targeting most of the CPython
  versions.

- `pp311-pypy311_pp73-manylinux_2_34_x86_64` designates a wheel built
  for PyPy3.11 (`pp311`) versions using `pypy311_pp73` ABI on the same
  platform. Wheels like these can be used for Python implementations that
  do not support the stable ABI, such as PyPy or freethreading CPython
  versions.

- `py3-none-any` designates a wheel compatible with any Python 3.x
  version, on any platform. It means a pure Python wheel, and it can
  be provided as a fallback when there is no other wheel compatible
  with the user's system.

You can find some unorthodox uses too, such as:

- A pure Python package including dedicated code for every Python
  version, for example using `py312-none-any` to designate a wheel
  dedicated to Python 3.12 (or newer — though in this case newer Python
  versions have their own wheels).

- A pure executable package (that does not link to the Python library),
  for example using `py3-none-macosx_11_0_arm64` to designate a wheel
  compatible with any Python 3 implementation on a macOS 11.0+ system
  with ARM64 CPU.

Tags clearly provide some degree of flexibility. The existing code can usually
account for future Python versions, operating system versions, libc versions,
and to some degree for new implementations, ABI changes, new architectures
and so on. But can it manage entirely novel tags?

Well, technically yes. Some use cases would fit well within the current platform
tags. Say, we could replace the plain `manylinux_2_28_x86_64` tag with a more
fine-grained `manylinux_2_28_x86_64_v3`. Properties that aren't exclusive
to existing platforms could be appended to them — say,
`manylinux_2_28_x86_64_cuda129`, `manylinux_2_28_aarch64_openblas_openmpi`
and so on. However, there are two major problems with that.

Firstly, the existing [pip](https://pypi.org/project/pip/) code, based
on the [packaging](https://pypi.org/project/packaging/) library, relies entirely
on enumerating all tag combinations compatible with the specific system
and comparing the tags found in wheels to that list. For example,
on a GNU/Linux system with Python 3.14 and glibc 2.41, this means almost 1300
combinations. While this is not that much, once we start adding multiple
additional suffixes, the number of possible combinations is going to explode.
Of course, this really isn't a blocker — it is entirely possible to rewrite
the logic to be more algorithmic and avoid generating all possible combinations.

Secondly, tags are implemented entirely within the package manager. This implies
that for every new set of tags, all package managers must implement them,
and then the users must upgrade. And ideally, the tags should be defined in such
a way so that the implementation will be able to determine the support
for future tags. Otherwise, we're talking about having to update all the package
managers every time a new CPU or GPU architecture version is defined, or a new
CUDA version is released, and so on.

In other words, while tags serve their primarily purpose well, they don't scale.

## How did projects manage without new tags?

Still, it's not like the problem cropped up overnight. Packages needed more
variants for a while now, and managed somehow without new tags. So, how did they
do that?

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/pytorch.png"
    width="907" height="286" alt="A grid-based chooser for PyTorch versions.
Individual rows provide the choice of PyTorch Build (stable or nightly),
operating system (Linux, Mac, Windows), Package (Pip, LibTorch, Source),
Language (Python, C++ / Java) and Compute Platform (CUDA 11.8, CUDA 12.6,
CUDA 12.8, ROCM 6.3, CPU). Below it provides an install command." />
  <figcaption>Fig. PyTorch version chooser</figcaption>
</figure>
</div>

If you enter [PyTorch's "Start Locally"](https://pytorch.org/get-started/locally/)
document, you are welcomed with a interactive chooser. Once you select
a specific build, operating system and compute platform, you are given
a specific pip instruction. Most of these instructions include an `--index-url`
parameter — and that's the answer, different variants of PyTorch wheels
are published on separate package indexes.

Surely, this isn't the most optimal solution. For a start, it requires manual
action. In the first place, you need to realize that you can't just
`pip install torch` and necessarily get what they expect. You need to find
the instructions, and follow them. And if you wish your PyTorch installation
to be correctly updated in the future, they also need to make sure to continue
using the custom index.

And this assumes you are actually installing PyTorch directly. If PyTorch
is only a dependency of something else, you may not even notice it being
installed!

Furthermore, the more packages use similar approaches, the more custom indexes
you end up using. And if different indexes start providing different versions
of the same packages, the results can get pretty surprising. In fact, this lead
to work on [PEP 766](https://peps.python.org/pep-0766/) that attempts
to improve the security over using multiple indexes (currently in draft).

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/jax.png"
    width="790" height="342" alt="A table listing supported JAX versions.
The rows are CPU, NVIDIA GPU, Google Cloud TPU, AMD GPU, Apple GPU
and Intel GPU. The columns are x86_64 and aarch64 Linux, aarch64 Mac
and x86_64 Windows and Windows WSL2. The table cells indicate either 'yes'
or 'experimental' with links, 'no' or 'n/a'." />
  <figcaption>Fig. JAX version chooser</figcaption>
</figure>
</div>

Let's look at another example. [JAX's "Supported Platforms" matrix](https://docs.jax.dev/en/latest/installation.html#supported-platforms) provides links to instructions for different installation options.
Most of them suggest installing the [jax package](https://pypi.org/project/jax/)
with an extra, e.g.: `jax[cuda12]`. And indeed, JAX publishes support
for different variants as plugins that can be pulled in automatically
via dependencies. This avoids using additional indexes, but still requires
manual action from the user.

Other variations of the same solution are possible. Rather than using plugins,
one could publish different package variants using separate package names
and use a metapackage with extras to select between them. Or simply ask the user
to install the correct package. However, this has the unfortunate side effect
that once multiple different variants end up being installed, they may overwrite
one another.

Or one can just publish a single package with all possible variants inside —
except it may end up being huge.

## Plugins to the rescue!

As I have already pointed out, the solutions putting variant selection entirely
within the package manager weren't very flexible. They could really work only
if either the list of valid variants was largely fixed or at least predictable.
To sidestep this limitation, we need a more distributed architecture, one where
each package can independently devise how to select between its variants.
This is how we reached an architecture based on plugins.

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/variant-flow.png"
    width="683" height="577" alt="A flow chart showing interaction between
wheel-related software and provider plugins. A PEP 517 backend (such
as flit_core, hatchling, meson-python…) produces a Wheel Variant, which is
then consumed by a wheel installer (pip, uv, pdm…). Alongside them, variant
providers (CUDA, ROCm, x86_64, AArch64, BLAS / LAPACK, MPI, OpenMP…) are shown.
PEP 517 backends communicate with them to validate variants, wheras installers
do to get supported properties." />
  <figcaption>Fig. Interaction between wheel software and provider plugins</figcaption>
</figure>
</div>

While PEP 517 backends remain responsible for building wheels, and installers
for selecting and installing wheels, they both defer variant-related tasks
to external variant providers. These are regular Python packages that can
be maintained and updated independently of the installers, and therefore
are able to deal with rapidly developing variant landscape better. Everyone
can create their own provider, and every package can declare which providers
they precisely need — and installers automatically pull them in as necessary.

Now, this kind of flexibility also required a slightly different approach
than tags. After all, a single variant can be described using a number
of properties: CUDA or ROCm runtime version, compatible GPU architectures,
compatible CPU architectures, required instruction sets, selected libraries.
While some variants could be described using tag-style short strings, making
them fully scalable required using more general property lists.

Expressing these properties in a key-value form seemed like a good idea.
That is, rather than having a dozen property tags such as `cuda_lower_12_5`,
`cuda_lower_12_6`, `cuda_lower_12_7` and so on, we'd rather have a single
feature name `cuda_version_lower_bound` and the version as a value. And since
we expect variant providers to be developed largely independently, putting
these features in namespaces makes it possible to organize them logically
and avoid name collisions. Consider the following example:

<pre>nvidia :: cuda_version_lower_bound :: 12.6
nvidia :: cuda_version_upper_bound :: 13
x86_64 :: level :: v3
x86_64 :: sha_ni :: on</pre>

Yes, the syntax was~inspired by [trove classifiers](https://pypi.org/classifiers/)!
Every property is a 3-element tuple consisting of the namespace (one per plugin
used), feature name and value.

Here, two providers are used: one representing CUDA installation (`nvidia`
namespace) and one representing x86_64 CPU properties (`x86_64` namespace).

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/property-examples.png"
    width="761" height="313" alt="A diagram showing example properties from two plugins.
The nvidia plugin provides 'cuda_version_lower_bound' with values of 12.8, 12.7, 12.6, 12.5, …
and 'cuda_version_upper_bound' with values of …, 12.12, 12.11, 12.10, 12.9. The x86_64 plugin
provides a level property with values of v3, v2 and v1, and a bunch of instruction set
properties named 'aes', 'pclmuldqd', 'rdseed', 'sha_ni' — all of them having the value 'on'." />
  <figcaption>Fig. Example supported properties reported by plugins</figcaption>
</figure>
</div>

The CUDA plugin detects the local CUDA installation and determines which version
is installed. Then, it transforms this version into set of compatible
constraints that can be used to determine whether a given wheel variant
can be installed — and if multiple variants fit, which one should be used.

For example, if you have CUDA 12.8, then all wheels with lower bound that
is not higher than that are installable — but a wheel built specifically
for CUDA 12.8 will be preferred. So we support wheels with a lower bound
of 12.8, 12.7, 12.6, 12.5… And the upper bound is handled in a similar way.

The x86_64 plugin detects the local CPU and determines what instruction sets
it supports. Then it returns all supported x86_64 architecture levels,
and all supported instruction sets. So if you were running a x86_64 v3 CPU,
it would return v3, v2 and v1 as compatible, with a long list of supported
instruction set flags.

## From exhaustive enumeration to JSON

Much like with tags, the installer needs to know the wheel variant's properties
in order to be able to choose a wheel to install. However, these properties
can both be more numerous and more complex than tags — and therefore are
not a good fit to be included in the filename.

Fetching all the wheels is not an option — as they can be quite large. Now,
technically the Zip format allows for relatively optimal partial fetching,
so we could just fetch the relatively small amount of data related variant
properties. Still, fetching data from a possibly large number of wheel
variants could hardly be considered an optimal solution.

At the same time, variant wheels do need unique filenames, and at the same
time we wanted to avoid making them too long — as some existing wheel filenames
are already reaching the length at which they are causing issues for less
permissive systems.

Here, the inspiration came from [Conda's build strings](https://docs.conda.io/projects/conda-build/en/latest/resources/define-metadata.html#build-number-and-string).
Much like Conda packages usually include a hash of build variables
in their build string, we have decided to use a hash of variant properties
to uniquely identify variants.

What was really useful here is that the hashing algorithm provided
a reproducible mapping from properties to wheel filenames. The first demo
implementation of variant wheels used this to be able to select variants
without actually fetching their properties. Instead, the installer would query
all plugins found installed for their supported properties, then enumerate
all possible combinations, compute their hashes and match them against available
variant wheels.

Unfortunately, this solution had a number of disadvantages. Most importantly,
with growing number of supported properties, the number of possible combinations
grew exponentially. With more complex plugins, hash computation quickly
became a bottleneck. On top of that, it assumed that the user needs to know
which plugins to install first. So while it was an interesting idea, it did
not scale well.

Instead, we did the next best thing — added an explicit file with variant
information that is published alongside variant wheels. And from this point,
a bunch of interesting really changes around the design started happening.

If I may jump the chronology a bit at this point, one interesting fact was how
this file affected variant information and configuration format. As the design
evolved, it was only natural that `variants.json` would contain not only
a mapping of available variants to their properties, but also other information
needed to use variants: how to install and load the plugins, and how to sort
the properties. Some of this information was also needed to build wheel
variants, and it only seemed natural that rather than expecting `variants.json`
to be maintained separately, we'd include all these details in project's sources
and pass them through while making `variants.json` entirely autogenerated.

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/variant-info-transit.png"
    width="881" height="392" alt="A diagram showing transit of variant
information from pyproject.toml through a wheel to variants.json. pyproject.toml
features a single 'variant' table, within which there are 'default-priorities'
and 'providers' subtables, and the latter has 'aarch64' and 'x86_64' subtables.
This structure is transferred to a '*.dist-info/variant.json' file in the wheel,
with the same objects as subtables of the 'variant' table, plus an additional
'variants' object with a single 'x8664v3' subobject. This is in turn converted
into '*-variants.json' file with the same structure, except that the 'variants'
objects contains additional 'armv8.2' and 'armv9.0' keys." />
  <figcaption>Fig. Variant information transit between file formats</figcaption>
</figure>
</div>

This is how we arrived at a three step pipeline: with developers putting
the baseline variant information in `pyproject.toml`, this information being
then copied to the wheel itself, along with the information about the wheel's
variant, and eventually the information from all wheel variants being combined
into a single `variants.json`. Over time, we also realized we could make things
simpler by aligning the structure along all three files. We started with
a `pyproject.toml` file being transformed into a horrid form of Core Metadata
fields, and then again into `variants.json`. We ended with a `pyproject.toml`
table that's converted 1:1 into a `variant.json` file inside the wheel (with
variant properties added), and then `variant.json` files from different wheels
being merged into a single `variants.json`.

At this point, it is also worth noting that as we realized that the provider
information can change across package versions, we should replace a single
`variants.json` file with per-version `{distribution}-{version}-variants.json`
files, whose names match the initial parts of wheel names.

## The opt-in/opt-out debate, plugin installation and discovery

## The null variant

## Static and dynamic plugins
