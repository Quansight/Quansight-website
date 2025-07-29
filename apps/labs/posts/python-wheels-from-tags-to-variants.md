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

For a long time, [Python Wheels](https://packaging.python.org/en/latest/specifications/binary-distribution-format/)
made do with a relatively simple mechanism
of providing the needed variance: [Platform Compatibility Tags](https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/).
Tags identified different Python implementation and versions,
operating systems, CPU architectures. Over time, they were extended
to facilitate new use cases. To list a few: [PEP 513](https://peps.python.org/pep-0513/)
added <code>manylinux</code> tags to standardize the dependency on GNU/Linux
systems, [PEP 656](https://peps.python.org/pep-0656/) added
<code>musllinux</code> tags to facilitate Linux systems with musl libc.

However, not all new use cases could be handled effectively within
the framework of tags. The advent of GPU-backed computing made distinguishing
different acceleration frameworks such as CUDA or ROCm important.
As many distributions have set baselines for their binary packages
to x86-64 v2, Python packages also started looking at the opportunity
to express the same requirement. In fact, the [manylinux_2_34 images are
blocked on x86-64 v2 becoming the default compiler
target](https://github.com/pypa/manylinux/issues/1585#issuecomment-3094469339).
Numerical libraries support different
BLAS/LAPACK, MPI, OpenMP providers — and wish to enable the users to choose
the build using their desired provider.
While technically tags could be bent to facilitate all these use cases,
they would grow quite baroque. Perhaps most importantly, every change
to tags need to be implemented in all installers and package-related
tooling separately, making the adoption difficult.

Facing these limitations, software vendors employed different solutions to work
around the lack of appropriate mechanism. Eventually,
as part of the [WheelNext](https://wheelnext.dev/)
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

If you enter [PyTorch's “Start Locally”](https://pytorch.org/get-started/locally/)
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

Let's look at another example. [JAX's “Supported Platforms” matrix](https://docs.jax.dev/en/latest/installation.html#supported-platforms) provides links to instructions for different installation options.
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
wheel-related software and provider plugins. A build backend (such
as flit_core, hatchling, meson-python…) produces a Wheel Variant, which is
then consumed by a wheel installer (pip, uv, pdm…). Alongside them, variant
providers (CUDA, ROCm, x86_64, AArch64, BLAS / LAPACK, MPI, OpenMP…) are shown.
Build backends communicate with them to validate variants, wheras installers
do to get supported properties." />
  <figcaption>Fig. Interaction between wheel software and provider plugins</figcaption>
</figure>
</div>

While build backends (as defined by [PEP 517]("https://peps.python.org/pep-0517/)) remain responsible for building wheels, and installers
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

Yes, the syntax was inspired by [trove classifiers](https://pypi.org/classifiers/)!
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
it would return v3, v2 and v1 as compatible, plus a long list of supported
instruction set flags that can be used to indicate specific requirements
above the baseline implied by level.

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
a bunch of really interesting changes around the design started happening.

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
    width="881" height="417" alt="A diagram showing transit of variant
information from pyproject.toml through a wheel to variants.json. pyproject.toml
features a single 'variant' table, within which there are 'default-priorities'
and 'providers' subtables, and the latter has 'aarch64' and 'x86_64' subtables.
This structure is transferred to a '*.dist-info/variant.json' file in the wheel,
with the same objects as subtables of the 'variant' table, plus an additional
'variants' object with a single 'x8664v3' subobject. This is in turn converted
into '*-variants.json' file with the same structure, except that the 'variants'
objects contains additional 'armv8.2' and 'armv9.0' keys from two other wheels." />
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

Another useful advantage of statically defining the variant mapping is that
it enable more arbitrary variant labels — the identifiers found in wheel
filenames. Since they no longer needed to be predictable from variant
properties, we could permit custom labels, and just store them inside
`variants.json` instead of the hash.

## The opt-in/opt-out debate, plugin installation and discovery

Perhaps the hottest discussion point during the work on wheel variants
was whether the architecture should be opt-in or opt-out. In other words,
whether the users should be required to perform some explicit action before
having a wheel variant installed, or whether the installer should take care
of everything, including installing the plugins as needed and running them.

The very first version of the proposal used a kind of opt-in mechanism.
Variantlib, our reference implementation, discovered and used plugins
from the environment where the package installer was run. In order to install a variant,
the user had to manually install all the required plugins first. Therefore,
having the plugin installed worked as a gating mechanism.

Why would we want an opt-in solution? The most important reason is security.
The variant plugin is a Python package that executes arbitrary code
during dependency resolution, possibly with elevated privileges. In fact,
[the rationale of PEP 427](https://peps.python.org/pep-0427/#rationale),
the original specification of the wheel format, pointed out this very problem
with installing from source distributions: <q>running arbitrary code to
build-and-install</q>.

Unfortunately, an opt-in solution like that poses a few problems. For a start,
it is quite inconvenient to users. You have to realize that you need
to do something special, you need to find the instructions and you need
to install the plugins. And it won't always be obvious — you won't always
be directly installing PyTorch or NumPy, but you will be getting them installed
as an indirect dependency. You may not even realize they've gotten installed,
let alone that you missed an important step required to get an optimized
variant. Besides, it is easy to install an incompatible version, two conflicting
plugins or even reach an unsolvable situation where two different packages you
need to install have conflicting provider dependencies.

At the same time, plugin discovery was done via [entry
points](https://packaging.python.org/en/latest/specifications/entry-points/).
They were quite convenient throughout the development and testing, since they
enabled us to discover and query installed plugins without having to actually
interact with any source trees or wheels. However, other found this implicit
discovery opaque.

The next step was therefore to switch to a more explicit, opt-out design.
We have introduced provider information in the variant information pipeline,
largely inspired by PEP 517, with a `requires` key specifying how to install
the variant provider, and a `plugin-api` key specifying how to use it.
Over time, we also added a `enable-if` key to support installing plugins
only in specific environments (for example, the x86-64 plugin is only needed
on x86-64 systems), and an `optional` key to make some plugins opt-in
(for example, for variants used only in obscure configurations that should
not be used by default). This also implied that the installer would now install
plugins automatically, in isolated environments.

With plugin installation and discovery taken care of, one problem remained:
variant sorting. Let's take a closer look at it next.

## Variant sorting

Variant providers have two main purposes in aiding installers. Firstly, they
are used to filter variants — tell which of the wheels are supported. Secondly,
they are used to sort variants — tell which of the supported variants should
be installed.

In the simplest cases, sorting is easy. If you have a bunch of variants
for different CPU baselines, you sort them from the highest to the lowest,
and therefore install the most optimized variant available. If you have variants
for different lower CUDA runtime bounds, you choose the one that is the highest
— say, if you have CUDA 12.8, you'd rather take a `>=12.8,<13` wheel
than a `>=12.6,<13` one, as it is more likely to benefit from newer API.
And if you have two wheels built for the same CUDA version, but one of them
also carries CPU optimizations, you'd take the latter.

The problems start when you have two different wheels that cannot be trivially
compared — say, a CUDA-optimized wheel and a CPU-optimized wheel. You may have
a gut feeling that CUDA wins, but this is not a general rule. Things become
even harder when you have to choose between a CUDA and a ROCm wheel (presumably
having two GPUs).

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/sorted-property-examples.png"
    width="761" height="313" alt="A diagram showing example sorted properties from two plugins:
'nvidia' plugin with index 1 and 'x86_64' plugin with index 2.
The nvidia plugin provides 'cuda_version_lower_bound' (index 1.1) whose subsequent values
have indices 1.1.1, 1.1.2 and so on; and 'cuda_version_upper_bound' with indices growing to 1.2.n.
The x86_64 plugin provides a 'level' property with index 2.1, whose values have indices 2.1.1,
2.1.2 and 2.1.3. It also defines a instruction set properties with indices 2.2,
2.3 and so on, with their only value 'on' having index '2.n.1'." />
  <figcaption>Fig. Example sort order of properties</figcaption>
</figure>
</div>

What we implemented is pretty much sorting on multiple layers. First,
the supported values for every feature are sorted from the most preferred
to the least preferred — so that a higher CUDA runtime version is considered
better than a lower one, and a higher CPU architecture version likewise.
Then, the features themselves are sorted within every namespace —
e.g. indicating that a specific architecture version is more important
than an individual feature, so you'd rather take an x86-64 v3 wheel with
no additional instruction sets declared over one declaring AVX support
but using x86-64 v2. As the next step, namespaces are ordered. This way,
we reach the point where every property has a corresponding index in the general
order: determined by its namespace, feature name and value ordering.

Let's return to our initial example and add sort keys to it:

<pre>(1.1.3) nvidia :: cuda_version_lower_bound :: 12.6
(1.2.m) nvidia :: cuda_version_upper_bound :: 13
(2.1.1) x86_64 :: level :: v3
(2.3.1) x86_64 :: sha_ni :: on</pre>

We sort variants according to the properties they have. While this may
seem complex at first, it effectively follows a single rule: a variant having
a more preferable property is better than one that does not have said property.
And that's it!

Let's say we have three properties, most preferred to least preferred:
P<sub>1</sub>, P<sub>2</sub>, P<sub>3</sub>. A variant having [P<sub>3</sub>]
is better than variant having no properties at all, since it has P<sub>3</sub>
and the other does not. A variant [P<sub>2</sub>] is better than [P<sub>3</sub>],
since it has P<sub>2</sub> and the other does not. And [P<sub>2</sub>, P<sub>3</sub>]
is better than all of the above since it has both these properties, and they
are missing at least one of them. And then [P<sub>1</sub>] is better than all
of them, since they are missing the most preferred property — and so on,
up to the variant having all possible properties.

What does this imply in practice? Say, if the `nvidia` namespace is given higher
priority than the `x86_64` namespace, then a `CUDA` variant will be preferred over
an `x86-64 v3` variant, and a `CUDA + x86-64 v3` variant will preferred over a plain
`CUDA` variant — provided both have matching CUDA properties. However,
a `CUDA >=12.8` wheel will be preferred over a `CUDA >=12.6 + x86-64 v3` wheel;
though such mismatched combinations are unlikely to be published in reality.

## Where do sort keys come from

We have covered sorting variants based on a specific namespace, feature name
and value ordering. However, what we didn't cover is how these bits are ordered
themselves. To skip a bit ahead, we settled on a layout that uses three layers
of sorting configuration:

1. Sorting defined by the provider plugin itself.

2. Sorting defined by the package (in variant information).

3. Sorting defined by the user.

<div style={{ textAlign: "center" }}>
<figure style={{width: 'auto', margin: '0 2em', display: 'inline-block', verticalAlign: 'top'}}>
  <img src="/posts/python-wheels-from-tags-to-variants/sorting.png"
    width="828" height="197" alt="A diagram showing variant property sort keys.
It specifies three rows: namespaces, features and values, and three columns:
provider plugin, package, user. Namespaces are shown to be ordered by the package
and optionally reordered by the user. Both features and their values are shown
to be ordered by the plugin, then optionally reordered by the package and the
user. Finally, all three keys combine into a sort key." />
  <figcaption>Fig. Example sort order of properties</figcaption>
</figure>
</div>

Unsurprisingly, plugins provide the initial ordering of features and their
values. After all, given that the plugin defines these lists in the first place,
it is quite reasonable for it to order it as well, rather than expecting
consumers to keep repeating that `12.8` > `12.7` > `12.6` > …, and updating that
list whenever they are about to use a new property value.
However, plugins are scoped to themselves and can only order feature names
and values. They cannot provide namespace ordering — as that would effectively
mean one plugin deciding how important another plugin is.

This leaves us with two possibilities: either the package author or the user
needs to define namespace ordering. Originally, we went with the latter idea —
after all, the users know best whether they prefer CUDA or ROCm, or perhaps CPU
optimization. However, this actually implied that the user had to jump through
the hoops of configuring variant usage first, and once again things could not
work out of the box. So we went with the next best thing: requiring package
configuration to specify namespace ordering; after all, package authors
are also in good position to tell which variants are the most beneficial.

However, no reason to stop at namespace. After all, a specific package may
want to point out, say, that their AES-NI variant is more beneficial than
a fallback implemented using other instruction sets. Or reorder values — while
I immediately can't think of a reason for that, let's have the option
for symmetry anyway. So while the plugins specify the initial order of features
and their values, packages are allowed to override it.

On top of that, user configuration can be applied. After all, there is still
a valid use case for the user to override the sort order defined by plugins
and packages. And since it's no longer obligatory, having that is not a problem.

## The null variant

## Static and dynamic plugins
