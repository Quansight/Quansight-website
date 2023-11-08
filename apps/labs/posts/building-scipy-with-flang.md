---
title: >
  The 'eu' in eucatastrophe – Why SciPy builds for Python 3.12 on Windows are a minor miracle
published: November 5, 2023
authors: [axel-obermeier]
description: 'Moving SciPy to Meson meant finding a different Fortran compiler
on Windows, which was particularly tricky to pull off for conda-forge. This
blog tells the story about how things looked pretty grim for the Python 3.12
release, and how things ended up working out just in the nick of time.'
category: [Developer workflows]
featuredImage:
  src: /posts/building-scipy-with-flang/scipy_indy.jpg
  alt: >
    An object-labelling meme showing Indiana Jones (labelled "SciPy") running away in a tight space from a rolling boulder labelled "distutils removal", while carrying something labelled "Fortran code".
hero:
  imageSrc: /posts/building-scipy-with-flang/hero.png
  imageAlt: 'A collage of the logos of SciPy, Meson, Fortran & LLVM. Some graphical elements on a white background surround the illustration.'
---

You've probably heard already that Python 3.12 was released recently.
For a while already, we've been getting new feature releases every year,
so perhaps this wasn't big news to you – though there's lots of interesting
stuff in there!

It would appear even more "ordinary" that key packages (think `pandas`,
`matplotlib` etc.) in the ecosystem would have a release compatible with the
new Python version shortly after[^5], and broadly speaking, you would be right.
Not that there isn't a huge amount of dedicated maintainers (mostly
volunteers!) working tirelessly behind the scenes to make that happen,
but overall, it's a pretty routine situation.

However, behind the ordinary-seeming "SciPy released builds compatible with
Python 3.12" hides an extraordinary story worth telling, because of how several
unrelated, multi-decade-long timelines happened to clash in a way that could
have very easily led to no Python 3.12-compatible releases for a long time.

To understand why this was such a lucky coincidence (though we tried our best
to tip the scales, _a lot_ of luck was necessary), we need to zoom out a bit
and explore the big players involved in this situation.
Fair warning: In the interest of brevity, the following recap is going to be
incomplete and opinionated.
From our perch on the shoulders of giants, let's take a quick look at the
landscape.

We'll briefly shed some light on the following:

- Why is Fortran still used in so many places?
- How is that relevant to Python?
- Past struggles of NumPy/SciPy with vanilla Python packaging.
- What role conda-forge plays in this context.

If you feel you have a good-enough understanding of all this, or not much time,
[skip](#the-situation) right past the background. 😉

## Fortran

… is almost unfathomably old in our day and age.
Started in 1953, first appearing in 1958, it quickly became the most important
programming language of its time, in an age when computing made several
important evolutionary leaps. Most importantly for our story:

- A lot of scientific code was written in Fortran (meaning often: the
  accumulated math knowledge of many decades got crystallised into code), and:
- There was a huge number of Fortran compilers, and in the age before Open
  Source Software, all of those were proprietary.

## Compilers

Depending on how far behind the curtains you've dared to venture, you've
probably at least heard of the concept of a compiler.
Basically, computers have an exceptionally limited amount of operations at
their disposal, and it's agonisingly painful to write anything in those
primitives directly.
The job of the compiler is to translate whatever the programmer is writing in a
given compiled language, and turn it into something the computer can execute.

In many ways they're the closest to the hardware, which is why they often were
hyper-specific to one CPU architecture, or one operating system – not least
because you cannot write an operating system without a compiler, so the two
were often tightly coupled.
For example, Microsoft, from very early on, used its own compiler to create
Windows and all the bits on top of it.

This coupling further compounded the tendencies towards closed source
compilers, because the compiler source code might not only reveal secrets of
the compiler itself, but also of the architecture or the operating system
built with it.
And since vendors were keen to capitalise on every advantage in an intensely
competitive market, there was no incentive to share sources at all.

The pioneer to break that mould was the GNU compiler collection (GCC), which
became one of the key pillars of the nascent Free & Open-Source Software (FOSS)
movement in the 80s and 90s.
The coupling to the operating system still stayed – in this case various
flavours of Unix, most prominently Linux of course – but GCC became a truly
universal compiler when it came to CPU architectures.

Let's visualise this quickly – we have a matrix of Operating Systems (OS) vs.
CPU Architectures; often compilers were specific not just to one OS, but also
1-2 specific architectures (for a long time the most dominant architecture has
been x86, but that has been changing in recent times).
What GCC did was essentially cover an entire column of that matrix, rather than
just 1-2 cells.

<div class="flex flex-row justify-center">
  <table class="w-[750px] bg-gray-200">
    <thead class="border border-solid border-gray-700 bg-indigo-900">
      <tr class="text-left">
        <th class="w-1/4 px-2 text-white">👉 OS<br />👇CPU Arch.</th>
        <th class="w-1/4 px-2 align-top text-white">Linux</th>
        <th class="w-1/4 px-2 align-top text-white">Windows</th>
        <th class="w-1/4 px-2 align-top text-white">macOS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-solid border-gray-700 px-2">x86_32</td>
        <td rowspan="6" class="border border-solid border-gray-700 bg-lime-600 px-2 align-middle">GCC</td>
        <td rowspan="2" class="border-t border-solid border-gray-700 bg-sky-600 px-2 align-middle">MSVC</td>
        <td rowspan="3" class="border border-solid border-gray-700 bg-sky-600 px-2 align-middle">Apple Clang</td>
      </tr>
      <tr>
        <td class="border border-solid border-gray-700 px-2">x86_64</td>
      </tr>
      <tr>
        <td class="border border-solid border-gray-700 px-2">arm64</td>
        <td class="border-t-[1.5px] border-dashed border-gray-700 bg-sky-600 px-2">(added recently)</td>
      </tr>
      <tr>
        <td class="border border-solid border-gray-700 px-2">aarch64</td>
        <td class="border border-solid border-gray-700 px-2">➖</td>
        <td class="border border-solid border-gray-700 px-2">➖</td>
      </tr>
      <tr>
        <td class="border border-solid border-gray-700 px-2">ppc64le</td>
        <td class="border border-solid border-gray-700 px-2">➖</td>
        <td class="border border-solid border-gray-700 px-2">➖</td>
      </tr>
      <tr>
        <td class="border border-solid border-gray-700 px-2">...</td>
        <td class="border border-solid border-gray-700 px-2">➖</td>
        <td class="border border-solid border-gray-700 px-2">➖</td>
      </tr>
    </tbody>
  </table>
</div>

This matrix would be _a lot_ larger if it included historical OSes and less
common architectures, where support with the respective compiler was often in
a 1:1 relationship (i.e. that combination would cover a single cell in the matrix).
The matrix also does not cover which programming languages a given compiler is
able to process, but for simplicity, you can picture C/C++ here.

Of course, GCC remains usable on macOS due to shared Unix roots, there are ways
to make it work on Windows (through cygwin or MinGW), and the whole truth is
way more [complicated](https://www.flother.is/til/llvm-target-triple/) still.
But as a first-order approximation, this shouldn't raise too many eyebrows.

Alright, after a full page about compilers, we can hear you thinking:
"What does all this have to do with Python?!".
And you're right, but just one last thing:

Once a program in C/C++/Fortran/etc. has been compiled, there are _a lot_ of
expectations built into that so-called "binary", which will expect very
explicitly-sized inputs, read things from – and load things into – very
specific CPU registers etc.
Basically, at this point, the training wheels come off, and if you use said
binary under even slightly different circumstances (different sized inputs,
changed order of function arguments, different in-memory layout of some
structure etc., much less another CPU type), you're going to have a bad time.
This is the so-called Application Binary Interface
([ABI](https://pypackaging-native.github.io/background/binary_interface)),
and any compiled program is subject to this.

## Python

We won't bore you with the history here, but the immediate thing to note is:
you don't need a compiler to use Python. That's a blessing as well as a curse,
because on the one hand, it dramatically lowers the difficulty of using it,
and on the other hand, this makes Python slow compared to compiled languages.

Python's duck-typing means it will go through many layers of wrapping and
fall-backs, before anything actually is executed.
Sidenote: this process is taken care of by Python's interpreter, which – uh oh…
– has itself been compiled[^1].
Unsurprisingly this approach is slower than a compiled program that will just
run with whatever instructions you've given it (and fail, if any part of the
ABI is violated).

This slow-down doesn't matter so much for prototyping, or general scripting,
but it becomes immensely limiting once there's medium-sized or larger amounts
of data involved.
The best-of-both-worlds solution to this problem was to have performant
compiled code under the hood, but a nice, pythonic "wrapper" around it as the
interface towards the programmer.

Remember all that scientific code that had been written in Fortran?
Things like BLAS and LAPACK were already well-established standards for dealing
with common problems in linear algebra, and so it was an obvious choice to
reuse that when libraries like NumPy and SciPy wanted to expose such
functionality to the Python world.
SciPy additionally also used Fortran code to provide special mathematical
functions and other mathematical tools like interpolation & integration – it's
not like the basic math had changed since the 70s…

However, this came with a terrible price:
Users needed a compiler to install the package.
In the early Python days, when many people were on Linux distributions (which
comes with GCC pre-installed), this was less of an issue.
But it made it extraordinarily difficult to do this in a cross-platform way –
particularly on Windows, it's not common for users to have a compiler
installed, much less know how to use it.

It's even worse on the maintainer-side, because they suddenly need to become
experts in the vagaries of different compilers, linkers and runtime libraries
necessary on different platforms, and with sometimes wildly varying behaviour.

## Python packaging

This situation also happens to be _the_ fundamental problem in Python packaging.
There's so much complexity hiding under the surface, that actually dealing with
it in any kind of sane way is really difficult.
For example, the C & C++ ecosystems never managed to standardise any sort of
build & distribution mechanism, and since Python is wrapping around basically
any flavour of C & C++ code, the problems in Python packaging are a _superset_
of what's already a hugely pressing issue in C/C++.

The packaging world in Python has had to continually reinvent itself in order
to solve these issues.
It's instructive to check out this
[historical](https://www.youtube.com/watch?v=AQsZsgJ30AE&t=200s)
overview, to get a feeling of the many iterations things have gone through.

!['A meme about a difficult choice in Python packaging, with a cartoon man sweating under the stress of being unable to decide between two buttons labeled "ABI Hell" and "Users need a compiler"'](/posts/building-scipy-with-flang/ABI_meme.jpg)

One of the biggest problems over the course of this evolution has been
the question about the right way to distribute a package.
Letting users just download the sources is problematic, because:

- packages can take a lot of time to build.
- if the packages is not just pure Python, the user needs a working compiler
  setup (and the source code needs to be compatible with that setup!), which is
  a huge usability hurdle.
- there's no reliable metadata, because even something as fundamental as the
  necessary third-party dependencies used to get populated only through running
  `setup.py`.

The alternative – distributing pre-compiled artefacts – is problematic for many
reasons too, and especially fragile in the face of the above-mentioned ABI.
Given the impact of breaking the ABI (random crashes, heisenbugs, etc.), doing
"binary" distribution haphazardly is not an option.

Eventually, a feasible approach for such distribution emerged in the form of
the "wheel" format, which essentially creates a bubble for each package that
brings along all the required libraries, but hides them from others through a
clever mechanism.
While wheels still have some downsides (especially on the maintainer-side),
they are a massive improvement over the situation that existed before, and
nowadays, most Python packages are installable through wheels from PyPI.

But wheels were not around yet at the time when the Scientific Python community
needed to solve some problems they were facing (as well as not versatile enough
conceptually for solving all the key issues involved).
This [blog post](http://technicaldiscovery.blogspot.com/2013/12/why-i-promote-conda.html)
by one of the founding contributors of NumPy and SciPy is full of relevant
anecdotes:

> We in the scientific python community have had difficulty and a rocky history
> with just waiting for the Python.org community to solve the [packaging]
> problem. With `distutils` for example, we had to essentially re-write most of
> it (as `numpy.distutils`) in order to support compilation of extensions that
> needed Fortran-compiled libraries.

Despite being the product of heroic efforts by many very bright people,
`numpy.distutils` is generally regarded as a bandaid, and has been in minimal
maintenance mode for years.
This is largely due to fundamental limitations inherent in only having a build
script (e.g. `setup.py`), without a way to precisely control in advance the
conditions under which a package gets built.
Again from that blog post:

> [...] `numpy.distutils` replaces most of the innards of `distutils` but is
> still shackled by the architecture and imperative approach to what should
> fundamentally be a declarative problem.

In many ways, this is what led to the creation of conda:

> Therefore, you can't really address the problem of Python packaging without
> addressing the core problems of trying to use `distutils` (at least for the
> NumPy stack). The problems for us in the NumPy stack started there and have
> to be rooted out there as well. This was confirmed for me at the first PyData
> meetup at Google HQ, where several of us asked Guido [van Rossum; Python's
> BDFL at the time] what we can do to fix Python packaging for the NumPy stack.
> Guido's answer was to "solve the problem ourselves".

## conda & conda-forge

Conda was designed to take a more holistic view of all the things that are
required for packaging – including the non-Python bits – and unsurprisingly,
done in a declarative way. The basis for this is a "recipe" that explicitly
defines relevant quantities (e.g. what needs to be present in the build
environment), before the first line of any build script is ever run.

This introduced an unfortunate bifurcation in the Python world, because other
Python tools like pip cannot install conda-packages, yet what conda had done
did not easily fit into the standardisation-by-consensus model[^2], primarily
because many things essential to conda were considered "out of scope" by the
wider Python packaging community.

However, for users and maintainers of packages that are affected by some of the
[deep-seated issues](https://pypackaging-native.github.io/) in Python packaging,
it provided a much more powerful solution and got adopted widely – especially
in scientific computing, though by far not everywhere.
While the recipes conda uses are the basis for many key features (e.g. having
enough control to ensure that the ABI is kept consistent, or that packages are
recompiled where necessary), this means in turn that integrating a given
package into the conda world requires creating such a recipe in the first place.

Given the size of the ecosystem, not even a company like Anaconda[^6] could
hope to integrate everything that users wanted, and over time, the
community-driven conda-forge channel became _the_ place to do this integration
work.
Anyone can [submit](https://github.com/conda-forge/staged-recipes/) recipes
for a package that is missing, or provide fixes for those that are already
being built on so-called "feedstocks".

One of the things that complicates matters is that conda-forge – as a
philosophy – is aiming to support all common platforms, and even some less
common ones.
This multiplies the kind of problems a Linux distribution might have by at
least ~three, because very often a _different_ set of problems will appear
for macOS and Windows.
To have any chance at success, conda-forge uses the platform defaults
(compiler, standard library, ABI, etc.) wherever possible.

Conda-forge is almost 100% volunteer-run, and dependent on public CI resources
like those provided by Azure Pipelines, as well as Anaconda footing the bill
for the hosting and download traffic of all the hosted artefacts.
On top of that, conda-forge cannot arbitrarily package things where the licence
does not allow it.
There is no hidden layer for build tools; anyone can download and install the
packages that the infrastructure is made of (or the underlying docker images),
and that means conda-forge cannot use proprietary compilers[^9], but must use
what's freely available.

Remember how we discussed above that all Fortran compilers are proprietary
(except gfortran as part of GCC), and how GCC is not directly usable on Windows?
This has been a huge issue for conda-forge, especially as the expectation of
general support on Windows became more and more wide-spread.
For a very long time, conda-forge was not able to build SciPy at all due to this.
Instead it had to rely on packages from the Anaconda channels[^7], until some
particularly talented contributors hacked together an unholy amalgamation of
MSVC (c.f. the default ABI on Windows) and gfortran, first in SciPy
[itself](https://web.archive.org/web/20210616203153/https://pav.iki.fi/blog/2017-10-08/pywingfortran.html)
and later on the
[feedstock](https://github.com/conda-forge/scipy-feedstock/pull/146)
in conda-forge.

## The situation

To recap:

- SciPy uses a lot of Fortran code, having incorporated existing and standard
  implementations (like BLAS & LAPACK) for mathematical computations.
- This did not play well with Python's native build tools, leading to the
  creation of `numpy.distutils`, which is however considered a bandaid and in
  minimal maintenance mode.
- The Python packaging world has been continually reinventing itself to
  overcome burning problems that are due to the immense complexity being
  wrapped by Python packages.
- A parallel ecosystem has arisen around conda & conda-forge, for packages
  and users that were underserved by the standard tools for Python packaging.

This is where our story starts in earnest.
Going back for many years already, the situation around `distutils` and
`setuptools` had been a source of great pain in the Python packaging world.
The two (in close interaction) represented the de-facto standard way of
building Python packages, but changing anything about them was extremely hard
because of how many use-cases had to be considered, how much everything had
grown organically, and so on.

The next evolutionary step turned out to be the combination of PEP517 / PEP518,
which promised a level playing field between various possible build tools, and
a way to specify the required information through a new interface
(`pyproject.toml`).
This eventually gained enough traction that `distutils` got scheduled for
removal from the Python standard library per version 3.12.

However, this had far-reaching consequences for all the things in Python-land
which had grown around `distutils`, and even more so for things layered on top.
The maintainers of `numpy.distutils` took the decision that they're not going
to maintain this layer going forward – even though `setuptools` ingested much
of the `distutils` interface, it did so in ways that were subtly incompatible
with what `numpy.distutils` did, and ultimately no-one wanted to keep
maintaining this old pile of hacks any longer than absolutely necessary.

This kicked off a flurry of work – already years ago, because NumPy and SciPy
are under excellent stewardship – to find a better solution.
SciPy in particular took a long, hard look at the landscape, and
[decided](https://labs.quansight.org/blog/2021/07/moving-scipy-to-meson)
to go with Meson as a build tool, which had a nice Python-style feel to it, and
less of the historic baggage or cumbersome DSL of CMake.
This was a far-reaching and forward-looking decision at the time, not least
because Meson did not yet support all the things that would be necessary to
pull things off.

To put this effort into context, all this required many, many engineering
months of highly talented people over the last ~2.5 years.
Unbeknownst to most, we are benefitting from the great foresight of the SciPy
and NumPy developers in tackling the issue this far in advance, rather than
having an "uh oh" moment once Python 3.12 is released.

It's necessary to note that Meson as a build tool has a much broader audience
than Python developers – it is used widely for C & C++ projects for example[^8].
As part of an overall design ideology to bring some much-needed sanity to this
space (and especially the world of C/C++ where no uniform solution exists),
Meson will not let you do things that are sure to go wrong in all but the most
expert hands.

In particular, Meson was going to refuse to accept the MSVC+gfortran
combination that was in use in conda-forge.
In fact, it looked like we were going to be completely boxed in.
As of Python 3.12:

- `distutils` would be gone, and contemporary `setuptools` incompatible with
  `numpy.distutils`.
- Meson would refuse to work with the hack conda-forge was using.
- There were no free (and ABI-compatible) Fortran compilers on Windows _at all_.

## Fortran, the revival

While Fortran has long been the butt of the joke in IT departments the world
over, in a curious twist of fate, it has seen a dramatic resurgence over the
last few years.
While the reasons for this are not exactly obvious (at least to us!), a few
possible explanations are:

- It has relatively simple syntax, and maps well to the structure of
  mathematical formulae.
- It produces performant code, especially in combination with parallelisation
  frameworks like OpenMP.
- Due to the large amount of Fortran code in scientific computing, and the
  promised performance gains through GPUs, it became an attractive target for
  supporting GPU computations.

As such, there was renewed vigour in the Fortran compiler space, and several
important developments happened in short succession.
For example, PGI / NVIDIA open sourced a version of their compiler called
pgfortran with a new backend based on LLVM (more on that below), which later
turned into what's now known as "classic" Flang.
In the process of trying to upstream this into LLVM itself, the compiler got
rewritten completely under the name f18, which later turned into "new" Flang
that eventually got merged into LLVM itself.
Pretty much at the
[same time](https://fortran-lang.discourse.group/t/what-is-the-exact-difference-between-llvm-flang-and-lfortran/901/17),
another group started developing a Fortran compiler based on LLVM: LFortran.

## LLVM & Clang

Further up we had looked at a matrix of Operating Systems versus CPU
architectures, and how most compilers tended to only cover 1-2 "cells", whereas
GCC covered essentially all possible architectures on Linux – i.e. a whole
column of the matrix.

As it happened, the last dimension of universality was tackled by another large
project that grew from a research project into a fully cross-architecture and
cross-platform compiler infrastructure[^10]: LLVM, and its flagship compiler Clang.
This was an absolutely massive undertaking, but due to its cross-platform
nature, permissive licensing, and modular infrastructure, has become _the_
focal point of efforts around all kinds of compiler development.

Without going into the technical details, LLVM provides several so-called
"Intermediate Representations" (IRs), which are somewhere in between machine
code and the code that most programmers write, but in a way that is
language-agnostic.
In particular, it would be possible to target the LLVM IRs from Fortran, and
then automatically benefit from all the "backends" that do most of the heavy
optimization work between the IRs and the actual CPU architecture.

This made LLVM an attractive foundation for these new Fortran compiler efforts,
and both incarnations of Flang as well as LFortran followed this approach,
though with different aims in what they built on top.

## Compiler bingo

All of these FOSS Fortran compilers attracted great hope to unblock the general
situation regarding the lack of free Fortran compilers on Windows.
Classic Flang already had preliminary support for Windows, but this never fully
took off, not least as the lion's share of resources behind Flang was
refocussed on getting the rewritten version merged into LLVM itself.

But these were not the only changes happening in this space.
For example, Intel did a major overhaul of their Fortran compiler (also basing
it on LLVM), and started making it freely available, though not open source.
Unfortunately this precludes conda-forge from using it, unless Intel themselves
packages the compilers for us;
we [asked](https://github.com/conda-forge/intel-compiler-repack-feedstock/issues/15),
but there was no timeline.

Furthermore, through the Mingw-w64 project, it slowly started to become possible
to use gfortran with Microsoft's "Universal C Runtime" (UCRT), which is
essentially the biggest hurdle in achieving ABI-compatibility on Windows.
However, switching out the underlying C standard library would represent a
[major](https://github.com/conda-forge/conda-forge.github.io/issues/1654)
overhaul in the MinGW stack for windows within conda-forge, and was also not
something we could count on to be ready in time.

For people on the sidelines like ourselves, this turned into something akin to
"Waiting for Godot" – a seemingly endless period as things kept stretching and
stretching and stretching out further into the future.
To give some perspective, things already seemed "not too far out" 3-4 years
[ago](https://github.com/conda-forge/conda-forge.github.io/issues/961#issuecomment-597094501).

At this point you may be asking yourself:
"wait a second… how did SciPy actually switch to Meson, if there are no Fortran
compilers for Windows?"

## How upstream SciPy does it (for now)

While SciPy has some amount of funding through grants and such, and could
conceivably pay for a compiler licence to use for producing wheels, the
requirements of building things in CI regularly – to avoid the otherwise
inevitable bitrot – would cost a lot and not be a judicious use of the limited
funds available.

What ended up happening is that one lone developer managed to custom-build a
MinGW-based toolchain, carefully adapted to use the right-sized integers and to
conform to the MSVC ABI.
This is enough to pass through Meson's sanity checks (after all, GCC is a
consistent toolchain), however it is again subtly-yet-crucially different from
the requirements that would be necessary for wide-spread use in conda-forge.

## conda-forge and the migration problem

One final aspect in the whole saga is that conda-forge has some additional
constraints in terms of how large-scale maintenance efforts work, e.g.
something like rolling out a new Python version.
Essentially, this means rebuilding all Python-related feedstocks in the order
how they depend on each other, and the only reasonable way to do it at scale is
to do all OSes and architectures at the same time, as they're all built
simultaneously per feedstock.

So it looked conceivable that we'd end up in a situation where:

- We have no Windows builds for SciPy, because there's no Fortran compiler
  conda-forge can use.
- Not being able to rebuild SciPy for Python 3.12 on Windows would either
  hold up the migration for at least ~1000 packages that depend on SciPy on
  all platforms, or we would have to drop Windows from the Python migration
  completely, which would be similarly disruptive and a lot of effort to fix
  later.

## A pious hope

So while the `distutils` removal was coming down the line like an oncoming
freight train, all we could try to do was cross our fingers that _one_ Fortran
compiler would be ready in time (most likely either llvm-flang or LFortran), and
be as prepared as possible in terms of having all the other pieces ready to go.
LLVM is a big baby, and keeping all the pieces involved up-to-date is a
non-trivial exercise already[^3], but we put extra effort into trying to
identify potential problems with Flang early on, both in our own
[infrastructure](https://github.com/conda-forge/flang-feedstock/pull/27),
[as well as](https://github.com/llvm/llvm-project/issues/60730)
[upstream](https://github.com/llvm/llvm-project/issues/63712).

But no matter how motivated we were to pursue this, the iron-clad constraints
of FOSS remain at play: no-one can take care of everything, much less keep all
the required knowledge in their head.
That means we need other people's input & feedback – and when everyone's a
volunteer[^4], things can take a while.

As it happened, the release of LLVM 17.0 was coming up, which would be the first
release where Flang had matured enough to remove the `-flang-experimental-exec`
flag, and was [estimated](https://discourse.llvm.org/t/proposal-rename-flang-new-to-flang/69462/33)
to be roughly "0.8 level maturity".
As soon as we had the release candidates built in conda-forge, we tried to throw
it at SciPy, only to realise that Meson did not support the new Flang yet.

Even worse, it wasn't clear which ABI Flang was using (as mentioned above,
conda-forge uses the default ABI on Windows everywhere), not least because the
Clang driver which Flang uses under the hood can target both modes.
Unfortunately, it wasn't clear which mode was being chosen, and generally it
looked like Windows support was (as often happens in FOSS) the least mature
platform.

To top it off, there are also two different standard libraries, two different
runtime libraries and two different linkers to consider in all this – all of
which had the potential to lead to subtle breakage.
At this point, we still hadn't compiled more than a "Hello World!" example with
Flang, so it wasn't even clear that it could compile all of SciPy, much less
pass the test suite...

## Eucatastrophe

The final push came once SciPy got [ready](https://github.com/scipy/scipy/pull/19317)
to remove support for `setup.py`, the last link to the "old world" before the
removal of `distutils`.
With some kind hints from the Meson devs and a bit of persistence, we managed to
teach Meson to be able to handle llvm-flang just enough to compile something.
We eventually passed the first build, and after some more wrangling with Meson,
the first installation too.

What happened next felt like nothing short of magical – while we were expecting
test failures, hangs or even crashes, the test suite… just passed 100%?!

```
 ........................................................................ [ 99%]
 .................................................s.......                [100%]
 = 54987 passed, 2866 skipped, 245 xfailed, 11 xpassed, 1 warning in 979.88s (0:16:19) =

 Resource usage statistics from testing scipy-tests:
    Process count: 43
    CPU time: Sys=0:01:20.6, User=0:29:59.3
    Memory: 1.7G
    Disk usage: 1.8K
    Time elapsed: 0:16:24.6
```

55'000 tests, and not a single failure? When does that ever happen on the first
try after major surgery?

Somehow, armed only with a pre-release of a still-experimental compiler and a
hastily patched-up build system, we managed to dodge the freight train, and the
migration in conda-forge could progress past SciPy with no more than a few days
delay, rather than being stuck for months.
In the end, the respective SciPy builds in conda-forge were available two days
after the release of Python 3.12.0.

## Epilogue

At the end of this journey, we can only marvel at how long and winding the ways
have been that lead us here.
Depending on where you draw the line, hundreds or even thousands of person
years of effort went into the ingredients that were necessary for us to achieve
the final result (SciPy, Meson, Flang, LLVM, LAPACK etc.).
We cannot realistically thank everyone, but a few call-outs nevertheless:

- Ralf Gommers, for tirelessly positive support and for outstanding
  stewardship of NumPy and SciPy, and driving the massive effort to move
  SciPy to Meson.
- Isuru Fernando, for building & maintaining some of the trickiest pieces in
  conda-forge, and consistently helping out with keeping them running or
  building on top of them, as well as reviewing with incredible expertise.
- The Meson developers, for a clean build system with a solid design philosophy.
- The Flang developers, for providing the world with an open source Fortran
  compiler that also works on Windows.

_We are also very grateful that this work was supported in part by a grant from
NASA to SciPy, scikit-learn, pandas and NumPy under the NASA ROSES 2020 program._

PS. In case you're still wondering what the "eu" in eucatastrophe
[means](https://tolkiengateway.net/wiki/Eucatastrophe), it's a neologism coined
by J. R. R. Tolkien from Greek ευ- "good" and καταστροφή "sudden turn".
Quoting from the link above: "In essence, a eucatastrophe is a massive turn in
fortune from a seemingly unconquerable situation to an unforeseen victory,
usually brought by grace rather than heroic effort.
Such a turn is catastrophic in the sense of its breadth and surprise and
positive in that a great evil or misfortune is averted."

------

[^5]: or even before, based on Python release candidates!

[^1]: and thus also has an ABI, if you want to speak to Python from another
compiled language.

[^2]: coupled with fears (at least initially) that a single company would
"take over" such a critical piece of the ecosystem.

[^6]: which grew around the needs conda addresses, and is the main driver
behind the tool.

[^9]: because their licenses forbid redistribution – which conda-forge wouldn't
be able to prevent from happening.

[^7]: Anaconda can afford to have their own build infrastructure, and is able
to enter into contracts with compiler vendors.

[^8]: if you're on Linux, much of your graphics stack is being built with Meson
nowadays.

[^10]: not least because Apple hired its founder, with the ostensible goal of
having a compiler that was not subject to GCC's license.

[^3]: aside from the fact that conda-forge cannot build the whole enchilada in
one go within the 6h time limit on the relatively modest CI agents that Azure
provides for free, any substantial change in our LLVM setup needs a lot of care
due to the sheer number of packages that can be affected by something so deep
in the stack.

[^4]: i.e. people who have lives and their own interests, or who're just plain
busy with other urgencies or things they care about more.
And even though there are people employed to work on some of these projects,
they almost always aren't paid to solve _your_ problem.
