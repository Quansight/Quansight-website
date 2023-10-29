---
title: 'The \'eu\' in eucatastrophe -- Why SciPy builds for Python 3.12 on Windows are a minor miracle'
published: November 5, 2023
authors: [axel-obermeier]
description: 'Moving SciPy to Meson meant finding a different Fortran compiler
on Windows, which was particularly tricky to pull off for conda-forge. This
blog tells the story about how things looked pretty grim for the Python 3.12
release, and how things ended up worked out just in the nick of time.'
category: [Developer workflows]
featuredImage:
  src: /posts/building-scipy-with-flang/scipy_indy.jpg
  alt: 'An object-labelling meme showing Indiana Jones (labelled "SciPy") running away in a tight space from a rolling boulder labelled "distutils removal", while carrying something labelled "Fortran code".'
hero:
  imageSrc: /posts/building-scipy-with-flang/hero.png
  imageAlt: ' collage of the logos of SciPy, Meson, Fortran & LLVM. Some graphical elements on a white background surround the illustration.'
---

You've probably heard already that Python 3.12 was released recently.
For a while already, we've been getting new feature releases every year,
so perhaps this wasn't big news to you (though there's lots of interesting
stuff in there!).

It would appear even more "ordinary" that key packages (think `pandas`,
`matplotlib` etc.) in the ecosystem would have a release compatible with the
new Python version pretty soon after, and broadly speaking, you would be right.
Not that there isn't a huge amount of dedicated maintainers (mostly
volunteers!) working tirelessly behind the scenes to make that happen,
but overall, it's a pretty routine situation.

However, behind all the ordinary-seeming "SciPy released builds compatible with
Python 3.12" hides an extraordinary story worth telling, because of how several
unrelated, multi-decade-long timelines happened to clash in a way that could
have very easily led to no Python 3.12-compatible releases for a long time.

To understand why this was such a lucky coincidence (though we tried our best
to tip the scales, _a lot_ of luck was necessary), we need to zoom out a bit
and explore the big players involved in this situation.
In the interest of brevity, the following recap is going to be incomplete and
opinionated.
From our perch on the shoulders of giants, let's take a quick look at the
landscape.

We'll briefly shed some light on the following:
  * Why is Fortran still used in so many places?
  * How is that relevant to Python?
  * Why progress in Python packaging standardisation throws a wrench in the works.
  * What role conda-forge plays in this context.

If you feel you have a good-enough understanding of all this, or not much time,
[skip](#The-situation) right past the background. 😉

## Fortran

… is almost unfathomably old in our day and age.
Started in 1953, first appearing in 1958, it quickly became the most important
programming language of its time, in an age when computing made several
important evolutionary leaps. Most importantly for our story:
  * A lot of scientific code was written in Fortran (meaning often: the
    accumulated math knowledge of many decades got crystallised into code), and:
  * There was a huge number of Fortran compilers, and in the age before Open
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

<table>
    <thead>
        <tr>
            <th>👉 OS<br/>👇CPU Arch.</th>
            <th>Linux</th>
            <th>MacOS</th>
            <th>Windows</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>x86_32</td>
            <td rowspan=6>GCC</td>
            <td rowspan=3>Apple Clang</td>
            <td rowspan=3>MSVC<br/>(arm64 added recently)</td>
        </tr>
        <tr>
            <td>x86_64</td>
        </tr>
        <tr>
            <td>arm64</td>
        </tr>
        <tr>
            <td>aarch64</td>
            <td>➖</td>
            <td>➖</td>
        </tr>
        <tr>
            <td>ppc64le</td>
            <td>➖</td>
            <td>➖</td>
        </tr>
        <tr>
            <td>...</td>
            <td>➖</td>
            <td>➖</td>
        </tr>
    </tbody>
</table>


Of course, GCC remains usable on MacOS (due to shared Unix roots), and there
are ways to make it work on Windows (through cygwin or MinGW), and the whole
truth is way more [complicated](https://www.flother.is/til/llvm-target-triple/)
still.
But as a first-order approximation, this shouldn't raise too many eyebrows.

Alright, after almost a full page about compilers, we can hear you thinking:
"What does all this have to do with Python?!".
And you're right, but just one last thing:

Once a program in C/C++/Fortran/etc. has been compiled, there are _a lot_ of
expectations built into that so-called "binary", which will expect very
explicitly-sized inputs, read things from – and load things into – very
specific CPU registers etc.
Basically, at this point, the training wheels come off, and if you use said
binary under different circumstances (different sized inputs, other CPU type
etc.), you're going to have a bad time.
This is the so-called Application Binary Interface
([ABI](https://pypackaging-native.github.io/background/binary_interface)),
and any compiled program is subject to this.

## Python

I won't bore you with the history here, but the immediate thing to note is:
you don't need a compiler to use Python. That's a blessing as well as a curse,
because on the one hand, it dramatically lowers the difficulty of using it,
and on the other hand, this makes Python slow compared to compiled languages.

Python's duck-typing means it will go through many layers of wrapping and
fall-backs, before anything actually is executed.
Sidenote: this process is taken care of by Python's interpreter, which – uh oh…
– has itself been compiled.
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
functions and other mathematical tools like interpolation & integration (it's
not like those definitions had changed since the 70s…).

However, this came with a terrible price:
Users needed a compiler to install the package.
In the early Python days where many people were on Linux distributions (which
comes with GCC pre-installed), this was less of an issue.
But it made it extraordinarily difficult to do this in a cross-platform way;
particularly on Windows, it's not common for users to have a compiler
installed, much less know how to use it.

It's even worse on the maintainer-side, because now suddenly you need to become
an expert in the vagaries of different compilers, linkers and runtime libraries
necessary on different platforms, and with sometimes wildly varying behaviour.

## Python packaging

This situation also happens to be _the_ fundamental problem in Python packaging.
There's so much complexity hiding under the surface, that actually dealing with
it in any kind of sane way is really difficult.
For example, the C & C++ ecosystems never managed to standardise any sort of
build & distribution mechanism, and since Python is wrapping around a lot of
C & C++ code, the problems in Python packaging are a _superset_ of what's
already a hugely pressing issue in C/C++.

The packaging world in Python has had to continually reinvent itself in order
to solve these issues.
Here's a good [historical](https://www.youtube.com/watch?v=AQsZsgJ30AE&t=200s)
overview of the many iterations this had gone through.
One of the biggest problems that did get solved through the "wheel" format,
was to avoid users having to compile anything to install a package.

!['A meme about a difficult choice in Python packaging, with a man unable to decide between two buttons labeled "ABI Hell" and "Users need a compiler"'](/posts/building-scipy-with-flang/ABI_meme.jpg)

This again comes with substantial maintenance trade-offs, because there are
still many very involved things that maintainers have to take care of when
preparing a wheel for their users.
In terms of the necessary tooling, there was a point in this long evolution
where `distutils` emerged as the "one way" to solve things, so much so that it
even got adopted into the standard library.

However, this was not enough for the Scientific Python community, which had
bigger problems.
This [blog](http://technicaldiscovery.blogspot.com/2013/12/why-i-promote-conda.html)
by one of the founding contributors of NumPy and SciPy is full of relevant
anecdotes; here's one quote:

> We in the scientific python community have had difficulty and a rocky history
> with just waiting for the Python.org community to solve the [packaging]
> problem. With `distutils` for example, we had to essentially re-write most of
> it (as `numpy.distutils`) in order to support compilation of extensions that
> needed Fortran-compiled libraries.

Despite being the product of heroic efforts by many very bright people,
`numpy.distutils` is generally regarded as a pile of hacks, and has been in
minimal maintenance mode for years.
In many ways, this is what led to the creation of conda.
Again from that blog post:

> Therefore, you can't really address the problem of Python packaging without
> addressing the core problems of trying to use `distutils` (at least for the
> NumPy stack). The problems for us in the NumPy stack started there and have
> to be rooted out there as well. This was confirmed for me at the first PyData
> meetup at Google HQ, where several of us asked Guido [van Rossum; Python's
> BDFL at the time] what we can do to fix Python packaging for the NumPy stack.
> Guido's answer was to "solve the problem ourselves".

## conda & conda-forge

Conda was designed to take a more holistic view of all the things that are
required for packaging – including the non-Python bits.
This introduced an unfortunate bifurcation in the Python world, because other
Python tools like pip cannot install conda-packages, yet what conda had done
did not easily fit into the standardisation-by-consensus model, especially
because many things essential to conda were considered "out of scope" by the
wider Python packaging community.

However, for users and maintainers of packages that are affected by some of the
deep-seated [issues](https://pypackaging-native.github.io/) in Python packaging,
it provided a much more powerful solution and got adopted widely, though by far
not everywhere.
One key necessity in controlling the interaction of various bits (like ensuring
the ABI is kept, or packages are recompiled where necessary), is that each
package has to be integrated into the conda world, by creating a "recipe" that
will build the package from the sources.

Given the size of the ecosystem, not even a company like Anaconda (which grew
around the needs conda addresses, and is the main driver behind the tool) could
hope to integrate everything that users wanted, and over time, the community-
driven conda-forge channel became the place to do this integration work.
Anyone can submit "recipes" for a package that is missing, or provide fixes for
those that are already being built on so-called "feedstocks".

One of the things that complicates matters is that conda-forge – as a
philosophy – is aiming to support all common platforms, and even some less
common ones.
This multiplies the kind of problems a Linux distribution might have by at
least ~three, because a different set of problems will also appear for MacOS
and Windows.
To have any chance at success, conda-forge uses the platform defaults
(compiler, stdlib, ABI, etc.) wherever possible.

Conda-forge is almost 100% volunteer-run, and dependent on public CI resources
like those provided by Azure Pipelines, as well as Anaconda footing the bill
for the hosting and download traffic of all the hosted artefacts.
On top of that, conda-forge cannot arbitrarily package things where the licence
does not allow it.
There is no hidden layer for build tools; anyone can download and install
packages (or some underlying docker images), and that means conda-forge cannot
use proprietary compilers, but must use what's freely available.

Remember how we discussed above that all Fortran compilers are proprietary
(except gfortran as part of GCC), and how GCC is not (easily) usable on Windows?
This has been a huge issue for conda-forge, especially as the expectation of
general support on Windows became more and more wide-spread.
For a very long time, conda-forge was not able to build SciPy at all due to this.
Instead it had to rely on packages from the Anaconda channels (which doesn't
have a fully public build infrastructure, and can enter into contracts with
compiler vendors), until some particularly talented contributors hacked
together an unholy amalgamation of MSVC (c.f. the default ABI on Windows)
and gfortran, first in SciPy
[itself](https://web.archive.org/web/20210616203153/https://pav.iki.fi/blog/2017-10-08/pywingfortran.html)
and later on the
[feedstock](https://github.com/conda-forge/scipy-feedstock/pull/146)
in conda-forge.

## The situation

To recap:
  * SciPy uses a lot of Fortran code, having incorporated existing and standard
    implementations (like BLAS & LAPACK) for mathematical computations.
  * This did not play well with Python's native build tools, leading to the
    creation of `numpy.distutils`, which is considered a bandaid and in minimal
    maintenance mode.
  * The Python packaging world has been continually reinventing itself to
    overcome burning problems that are due to the immense complexity being
    wrapped by Python packages.
  * A parallel ecosystem has arisen around conda & conda-forge, for packages
    and users that were underserved by the standard tools for Python packaging.

This is where our story starts in earnest.
Going back for many years already, the situation around `distutils` and
`setuptools` had been a source of great pain in the Python packaging world.
The two (in close interaction) represented the de-facto standard way of
building Python packages, and changing anything about them was extremely hard
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
Unbeknownst to most, we are benefitting from the great level of foresight and
involvement in the general ecosystem of the SciPy and NumPy developers in doing
this far in advance, rather than having an "uh oh" moment once Python 3.12 is
released.

It's necessary to note that Meson as a build tool has a much broader audience
than Python developers – it is used widely for C & C++ projects for example (if
you're on Linux, much of your graphic stack is being built by Meson nowadays).
As part of an overall design ideology to bring some much-needed sanity to this
space (and especially the world of C/C++ where no uniform solution exists),
Meson will not let you do things that are sure to go wrong in all but the most
expert hands.

In particular, Meson was going to refuse to accept the MSVC+gfortran
combination that was in use in conda-forge.
In fact, it looked like we were going to be completely boxed in.
As of Python 3.12:
  * distutils would be gone, and setuptools incompatible with numpy.distutils.
  * Meson would refuse to work with the hack we had until now.
  * There were no free (and ABI-compatible) Fortran compilers on Windows _at all_.

## Fortran, the revival

While Fortran has long been the butt of the joke in IT departments the world
over, in a curious twist of fate, it has seen a dramatic resurgence in the last
decade.
While the reasons for this are not exactly obvious (at least to us!), a few
possible explanations are:
  * It has relatively simple syntax, and maps well to the structure of
    mathematical formulae.
  * It produces performant code, especially in combination with parallelisation
    frameworks like OpenMP.
  * Due to the large amount of Fortran code in scientific computing, and the
    promised performance gains through GPUs, it became an attractive target for
    supporting GPU computations.

As such, there was renewed vigour in the Fortran compiler space, and several
important developments happened in short succession.
For example, PGI / NVidia open sourced a version of pgfortran with a new
backend based on LLVM (more on that below), which later turned into what's now
known as "classic" Flang.
In the process of trying to upstream this into LLVM itself, the compiler got
rewritten completely as f18, which later turned into "new" Flang.
Pretty much at the
[same time](https://fortran-lang.discourse.group/t/what-is-the-exact-difference-between-llvm-flang-and-lfortran/901/17),
another group started developing a Fortran-compiler based on LLVM: LFortran.

## LLVM & Clang

Further up we had looked at a matrix of Operating Systems versus CPU
architectures, and how most compilers tended to only cover 1-2 "cells", whereas
GCC covered essentially all possible architectures on Linux (i.e. a whole
column of the matrix).

As it happened, the last dimension of universality was tackled by another large
project that grew from a research project into a fully cross-architecture and
cross-platform compiler infrastructure (not least because Apple hired its
founder, with the ostensible goal of having a compiler that was not subject to
GCC's GPL): LLVM, and it's flagship compiler Clang.
This was an absolutely massive undertaking, but due to its cross-platform
nature, permissive licensing, and modular infrastructure, has become _the_
focal point of efforts around all kinds of compiler development.

Without going into the technical details, LLVM provides several so-called
"Intermediate Representations" (IR), which are somewhere in between machine
code and the code that most programmers write, but in a way that is
language-agnostic.
In particular, it would be possible to target the LLVM IR from Fortran, and
then automatically benefit from all the "backends" that do most of the heavy
optimization work between the IR and the actual architecture.

This made LLVM an attractive foundation for these new Fortran compiler efforts,
and both the "new" Flang, as well as LFortran followed this approach, though
with different aims in what they build on top.

## Compiler bingo

Together with "classic" Flang, all of these FOSS Fortran compilers attracted
great hope to unblock the general situation regarding the lack of free Fortran
compilers on Windows.
Classic Flang already had preliminary support for Windows, but this never fully
took off, not least as the lion's share of resources behind Flang was
refocussed on getting the rewritten version (formerly f18) merged into LLVM itself.

But these were not the only changes happening in this space.
For example, Intel also did a major overhaul of their Fortran compiler, and
started making it freely available, though not open source (which precludes
conda-forge from using it, unless Intel themselves packages the compilers for us;
we [asked](https://github.com/conda-forge/intel-compiler-repack-feedstock/issues/15),
but there was no timeline).

Furthermore, through the mingw-w64 project, it slowly started to become possible
to use gfortran with Microsoft's "Universal C Runtime" (UCRT), which would
essentially ensure ABI-compatibility on Windows.
Switching out the underlying C library however would represent a major overhaul
in the MinGW stack for windows within conda-forge, and was also not something
we could count on to be ready in time.

For people on the sidelines like ourselves, this turned into something akin to
"Waiting for Godot" – a seemingly endless period as things kept stretching and
stretching and stretching out further into the future.
To give some perspective, things already seemed not "too far out" 3-4 years
[ago](https://github.com/conda-forge/conda-forge.github.io/issues/961#issuecomment-597094501).

At this point you may be asking yourself:
"wait a second… how did SciPy actually switch to Meson, if there are no Fortran
compilers for Windows?"

## How upstream SciPy does it (for now)

While SciPy has some amount of funding through grants and such, and could
conceivably pay for a compiler licence to use for producing wheels, the
requirements of building things in CI regularly (to avoid the otherwise
inevitable bitrot) would cost a lot and not be a judicious use of the limited
funds available.

What ended up happening is that one lone developer managed to custom-build a
MinGW-based toolchain (in other words, GCC on Windows), carefully adapted to
use the right-sized integers and to conform to the MSVC ABI.
This is enough to pass through Meson's sanity checks (after all, it is a
consistent toolchain), but as explained above, this approach would not have
been feasible for conda-forge as a whole, at least not without some more heroic
efforts.

## conda-forge and the migration problem

One final aspect in the whole saga is that conda-forge has some additional
constraints in terms of how large-scale maintenance efforts work, e.g.
something like rolling out a new Python version.
Essentially, this means rebuilding all Python-related feedstocks in the order
how they depend on each other, and the only reasonable way to do it at scale is
to do all OSes and architectures at the same time (as they're all built
simultaneously per package).

So it looked conceivable that we'd end up in a situation where:
  * We have no Windows builds for SciPy, because there's no Fortran compiler
    we can use.
  * Not being able to rebuild SciPy for Python 3.12 on Windows would either
    hold up the migration for at least ~1000 packages that depend on SciPy on
    all platforms, or we would have to drop Windows from the Python migration
    completely, which would be similarly disruptive and a lot of effort to fix
    later.

## A pious hope

So while the `distutils` removal was coming down the line like an oncoming
freight train, all we could try to do is cross our fingers that _a_ Fortran
compiler would be ready in time (most likely either llvm-flang or LFortran),
and be as prepared as possible in terms of having all the other pieces ready to
go – LLVM is a big baby, and keeping the compiler stack up to date consistently
is a non-negligible effort.

In addition to that, there are the normal FOSS constraints at play – no-one can
keep all the required knowledge in their head, so we need other people's
feedback, but everyone's a volunteer, people have lives and other interests, or
they're just plain busy with other things.

As it happened, LLVM 17 was coming up, and it was the first release where Flang
had matured enough to remove the `-flang-experimental-exec` flag, and was
[estimated](https://discourse.llvm.org/t/proposal-rename-flang-new-to-flang/69462/33)
to be roughly "0.8 level maturity".
As soon as we had the release candidates built in conda-forge, we tried to throw
it at SciPy, only to realise that Meson did not support the new Flang yet.

Even worse, it wasn't clear which ABI Flang was using (as mentioned above,
conda-forge uses the MSVC ABI on Windows everywhere), not least because the
Clang driver that Flang uses can use two different modes.
There's also two different standard libraries, two different runtime libraries
and two different linkers to consider in all this.
At this point, we still hadn't compiled more than a "Hello World!" example with
Flang yet, so it wasn't even clear that it could compile all of SciPy, much
less pass the test suite.

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

!['Screenshot of the first passing test suite with the new flang-built SciPy'](/posts/building-scipy-with-flang/scipy_flang_first_green_CI.png)

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
the final result (SciPy, Meson, Flang, LLVM, etc.).
We cannot realistically thank everyone, but a few call-outs nevertheless:
  * Ralf Gommers, for tirelessly positive support and for outstanding
    stewardship of NumPy and SciPy, and driving the massive effort to move
    SciPy to Meson.
  * Isuru Fernando, for building & maintaining some of the trickiest pieces in
    conda-forge, and consistently helping out with keeping them running or
    building on top of them, as well as reviewing with incredible expertise.
  * The Meson developers, for a clean build system with a solid design philosophy.
  * The Flang developers, for providing the world with an open source Fortran
    compiler that also works on Windows.

PS. In case you're still wondering what the "eu" in eucatastrophe
[means](https://tolkiengateway.net/wiki/Eucatastrophe), it's a neologism coined
by J. R. R. Tolkien from Greek ευ- "good" and καταστροφή "sudden turn".
Quoting from the link above: "In essence, a eucatastrophe is a massive turn in
fortune from a seemingly unconquerable situation to an unforeseen victory,
usually brought by grace rather than heroic effort.
Such a turn is catastrophic in the sense of its breadth and surprise and
positive in that a great evil or misfortune is averted."
