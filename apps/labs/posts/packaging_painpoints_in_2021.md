---
title: 'Python packaging in 2021 - pain points and bright spots'
published: January 24, 2021
authors: [ralf-gommers]
description: 'This blog post contains the raw
output of the 30-minute brainstorm (only cleaned up for textual issues) and
my annotations on it (in italics) which capture some of the discussion during
the session and links and context that may be helpful.'
category: [Packaging]
featuredImage:
  src: /posts/packaging_painpoints_in_2021/blog_feature_org.png
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/packaging_painpoints_in_2021/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

At Quansight we have a weekly "Q-share" session on Fridays where everyone can
share/demo things they have worked on, recently learned, or that simply seem
interesting to share with their colleagues. This can be about anything, from
new utilities to low-level performance, from building inclusive communities
to how to write better documentation, from UX design to what legal &
accounting does to support the business. This week I decided to try something
different: hold a brainstorm on the state of Python packaging today.

The ~30 participants were mostly from the PyData world, but not exclusively -
it included people with backgrounds and preferences ranging from C, C++ and
Fortran to JavaScript, R and DevOps - and with experience as end-users,
packagers, library authors, and educators. This blog post contains the raw
output of the 30-minute brainstorm (only cleaned up for textual issues) and
my annotations on it (in italics) which capture some of the discussion during
the session and links and context that may be helpful. I think it sketches a
decent picture of the main pain points of Python packaging for users and
developers interacting with the Python data and numerical computing ecosystem.

The main intended audience for this post is maintainers working on
packaging and distribution tools, and library authors needing to package
their projects. Readers newer to Python packaging may want to start with the
blog posts linked in the Conclusion section.


## Topic 1: The pip/wheel/PyPI world

- PyPI file size limit .deep learning, CUDA 11

_RG: the default file size limit on PyPI is (I believe) 60 MB currently, which is not enough for many libraries with heavy dependencies. You must file an issue to ask for an exemption, which can take quite a while to be resolved because PyPI has only a few volunteers. See, e.g., [this issue where MXNet asks for a 1 GB limit](https://github.com/pypa/pypi-support/issues/243). The issue will get significantly worse with CUDA 11, which is several times larger than CUDA 10. Looking at for example [PyTorch wheels](https://pypi.org/project/torch/#files), which are already 776 MB now, that simply won't fit. When I asked one of the PyPI maintainers recently, the answer was "interesting - that will be a problem"._

- Native dependencies for wheels
    - two proposed solutions: pynativelib, or spec to interface with outside packages

_RG: what projects do with non-Python dependencies today is simply don't declare the dependency, and use either static linking or put the needed shared libraries into the wheel with name mangling. The [pynativelib](https://mail.python.org/pipermail/wheel-builders/2016-April/000090.html) idea is technically feasible for simple scenarios, but will always be limited because of how pip, wheels and PyPI work. It's not in use today. The more sensible route seems to be to work out how to let packages interact with external package managers, and figure out what's out of scope completely. I'm not aware of significant work happening on this topic._

- ABI tags are limited: multi-CUDA options, multi-SIMD options

_RG: for packages with compiled code, ABI tags in the wheel filename can be used to specify certain properties, like what Python version, operating system or set of base libraries like glibc the wheel is for. Anything that doesn't have an ABI tag cannot be supported, though. Examples of unsupported features are CUDA version and CPU capabilities for SIMD instruction sets. Therefore projects can only make a single choice there for what they upload to PyPI; everything else must be hosted elsewhere._

- The rise of new (and old) architectures: Linux on ARM64, macOS M1, PowerPC, AIX, Z/OS

_RG: this is mostly a problem for library authors, who typically rely on public CI for each supported platform. When users clamour for macOS M1 support so they can make optimal use of their shiny new hardware, this puts maintainers in a difficult position - CI support appearing is likely to take many months still._

- Uniform install instructions for venv's cannot be given.

_RG: using virtual environments is good practice, but writing install instructions for them is very difficult because (a) there are too many tools and (b) activating environments is clunky and platform-specific (see, e.g., [this section of the Python Packaging User Guide](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments))._

- Setuptools incorporating distutils with a TBD new build API

_RG: `distutils` will be deprecated in Python 3.10 and removed in Python 3.12. This is likely good news in the long term, but for now it means building packages with nontrivial compiled dependencies is going to be unstable. See for example [this issue about `numpy.distutils` and `setuptools` interaction](https://github.com/pypa/setuptools/issues/2372)._

- manylinux: Alpine Linux, and (maybe) the death of CentOS
    - Is musl compatible yet?

_RG: I'm not sure if this is a major isssue. Right now Alpine Linux doesn't work with the `manylinux1/2010/2014` wheels on PyPI, because Alpine uses musl libc rather than glibc. The manylinux standard is based on CentOS, which is being discontinued. If that leads to growth of Alpine (perhaps not likely) then we'll be getting more users asking for wheels. Right now all we can say is "that's unsupported, sorry"._

- Isolated builds with `pyproject.toml` are quite complicated to spec, and still unclear how that will hold up in the real world

_RG: Isolated builds are a good idea, but with ABI compatibility constraints one needs to deal with like when building against the NumPy C API, getting `pyproject.toml` right is complicated. See for example [the `oldest-supported-numpy` meta-package](https://github.com/scipy/oldest-supported-numpy/blob/master/setup.cfg) to help with this._

- Filling out configuration is tedious
- Which freaking tool should I use!
- Reproducible builds! (practically impossible) – IPython is reproducible for both `.tar.gz` anf `.zip`, but needs custom post-process.

_RG: See [this blog post from Matthias Bussonnier](https://labs.quansight.org/blog/2020/08/ipython-reproducible-builds/) for more on this topic._

- `setup.py` is dynamic making downstream packaging/automation much harder (including for conda) 
    - Use [flit](http://flit.readthedocs.org/) – completely static! 

_RG: For pure Python packages Flit is great indeed. For packages with compiled code, we'll be stuck with `setup.py` for a while longer, I'm afraid. It is what it is - this has gotten better already with `pyproject.toml` and it's not one of the biggest issues anymore imho._

- Lack of relocation tools in Windows, i.e., mangling a DLL name and change it on DLLs that depend on it

_RG: Probably a gap indeed, not 100% sure. [Mach-O Mach-O mangler](https://github.com/njsmith/machomachomangler) supports Windows, but a Windows equivalent of [auditwheel](https://github.com/pypa/auditwheel) and [delocate](https://github.com/matthew-brett/delocate) seems to be missing._

- This world does not know that the conda world exists.

_RG: yeah, kinda. Devs do know conda and conda-forge exist, but as far as I can tell they do see the world as centered around PyPI, wheels and pip, and conda as one of many other package managers (next to Homebrew, Linux distros, Chocolatey, and so on). Which isn't quite right - PyData users now represent over half of all Python users, and the Conda ecosystem has specific capabilities related to that stack that are (and may remain) missing from PyPI/pip._

- Shipping JupyterLab 3.0 extensions without Node.js is kinda cool.
- Rust/Maturin to develop Python packages is nice.
    - The relocation of depending binaries must be done manually in some cases.


## Topic 2: The conda world

- Conda itself is almost unmaintained

_RG: a quick peek at [the conda repo](https://github.com/conda/conda/pulse) indeed shows declining activity. Hopefully the new Conda Community organization will help generate new energy for `conda` contributions._

- Mamba is still a little tricky/slow to install

_RG: this is definitely true if you start with conda; it can take minutes for conda to do the solve to install mamba and its dependencies from conda-forge. With the recently added [Mambaforge](https://github.com/conda-forge/miniforge#mambaforge) installer that problem should be mostly solved now._

- No TensorFlow 
    - Does conda-forge count?

_RG: this is actually no longer true, the TensorFlow package in `defaults` is reasonably but not completely up to date (2.3.0 CPU and GPU packages at the moment, missing 2.3.1-2.4.1). In general it's a problem indeed that important packages like TensorFlow and PyTorch in `defaults` may be one or even more versions behind._

- Conda-forge is growing too large
    - In which respect?

_RG: As discussed in [this blog post on conda performance](https://www.anaconda.com/blog/how-we-made-conda-faster-4-7), the more packages there are in a channel, the slower the conda solves get. Given the ever-growing size of conda-forge, conda is getting slower and slower when used with conda-forge._

- Why oh why are defaults and conda-forge still not using a 100% compatible toolchain??

_RG: This would be so helpful. Not being able to mix `defaults` and `conda-forge`, and users doing it anyway because they need packages from both, is a long-standing issue._

- Conda solves in CI often get really bogged down
    - Also conda is never the default in CI so you need to do quite a bit of manipulation on some platforms
- Confusion in the community over the new Anaconda ToS

_RG: Anaconda has done the right thing here imho: make large institutional users pay if they use the `defaults` channel. Packaging is hard and labour-intensive, and having a sustainable revenue stream to offset the cost of packaging difficult libraries, maintaining core tooling like `conda-build`, and serving packages to millions of users is important. Conda-forge and all other channels are still completely free. Unfortunately Anaconda communicated that very poorly, which led to unnecessary confusion. See [this blog posts from the conda-forge team](https://conda-forge.org/blog/posts/2020-11-20-anaconda-tos/)

- There's no way to distinguish packages that provide the same binaries, e.g., `turbojpeg` vs. `libjpeg`, both package `libjpeg`
- Need to separate metadata (especially dependencies) from packages.

_RG: this to me seems like a much smaller issue than with PyPI. The comment was about the ability to patch metadata of published conda packages more easily._

- R community seems slow to adopt it

_RG: I've heard from R users before that conda felt a bit "foreign". In the discussion it was suggested that part of that is that conda is Python-based which can still bubble up to the surface on occasion. And that Mamba, which is written in C++, may find a more positive reception in the R community._

- End-to-end security?

_RG: [Purism](https://puri.sm/) and [this blog post from its devs about security in the software supply chain](https://puri.sm/posts/the-future-of-software-supply-chain-security/) were mentioned._

## Topic 3: Other

- The Conda and PyPA worlds still aren't talking to each other much.

_RG: It's great to see that both the PyPA team and the Conda community are getting better organized. There's now more funding for work on PyPI, Warehouse and Pip; the teams working on it have grown, there's good project management, roadmapping and even Pip user experience research going on. And the Conda community has set up a new organization to align on standards, incubate promising new projects. The next step will hopefully be more productive interactions between those two somewhat separate groups._

- `pip` and `conda` interaction still not great
    - I'd like a way to have "safe" (e.g., pure Python) packages so you can confidently mix them. `+100`
    - The pip dependency resolver is not great yet and it also ends up with conflicts with conda.

_RG: True. For doing serious scientific computing, data science and ML type work, you often need the combination, using `conda` for the core libraries, and filling in the gaps with `pip` for packages that are not packaged for conda or installing things from source._


## Topic 4: There's always good news too

- [The death of `easy_install`](https://github.com/pypa/setuptools/pull/2544)!!!
- Mambaforge
- macos-arm64 support in conda-forge

_RG: It'll be a while before we get wheels for core PyData packages, but conda-forge already has support, see [this blog post](https://conda-forge.org/blog/posts/2020-10-29-macos-arm64/)

- The new conda community umbrella org
- Pip and PyPI are now well-managed and have a nontrivial amount of funding
- Pip has a solver :) ; the solver is a "backtracking solver" because metadata on PyPI is incomplete :(


## Bonus topic: A puzzle

A challenge with a prize for who posts the most concise correct solution by
tomorrow (note, you do need a very fast internet connection for this): create
a concise recipe for installing the latest versions of NumPy, TensorFlow,
PyTorch, CuPy, Dask, JAX and MXNet in a single environment.

👆🏼 This is a trick question I am sure 

_RG: everyone had till the end of the next day to submit a solution. It turns out to be not so simple, the winning entry (with six out of seven packages, JAX is missing) came from Chris Ostrouchov - our local Nix evangelist:_

```bash
$ nix-shell -I nixpkgs=https://github.com/nixos/nixpkgs/archive/986cf21c45b798c97f2424e17b819af3ecf8083e.tar.gz
 -p python3Packages.numpy
 python3Packages.tensorflow python3Packages.pytorch python3Packages.cupy python3Packages.dask python3Packages.mxnet
```

_My solution:_

```bash
# To create an environment with the most recent version of all mainstream
# Python array/tensor libraries installed:
$ conda create -n many-libs python=3.7
$ conda activate many-libs
$ conda install cudatoolkit=10.2
$ pip install numpy torch jax jaxlib tensorflow mxnet cupy-cuda102 dask toolz sparse  # you may need to turn off the resolver if you're on pip >= 20.3.1

# Conda doesn't manage to find a winning combination here; pip has a hard time
# too and probably not all constraints are satisfied, but nothing crashes
# and basic tests work as they are supposed to.
```

## Conclusion

A lot of good things are happening in various places in the Python packaging world. We're in a better situation than several years ago. As the brainstorm content above shows there are challenges as well, but that has always been the case. If I could have just one wish, I'd wish for good program management across and coordination between the PyPA and Conda communities.

This is my blog post though, so I get a few more wishes:

- Merging Conda and Mamba so they share a single installer and UX with two modes ('fast' and 'stable/legacy').
- Strictly enforced metadata correctness and manylinux compliance for new PyPI uploads. The stricter the better, see [packaging-problems #264](https://github.com/pypa/packaging-problems/issues/264).
- GPU hardware for conda-forge so it can test its GPU packages in CI.
- Consolidate the zoo of virtual environment tools (`venv`, `virtualenv`, `poetry`, `pipenv`, `pyenv`, `pyflow` - probably there are even more) so we can actually recommend one to users of our projects.
- Not having to think about problems around Fortran on Windows ever again.

While I'm at it, let me also link to some of the most informative blog posts on the topic I know of and enjoyed reading over the years:

- [Tarek Ziadé - The fate of Distutils - Pycon Summit + Packaging Sprint detailed report (2010)](https://tarekziade.wordpress.com/2010/03/03/the-fate-of-distutils-pycon-summit-packaging-sprint-detailed-report/)
- [Travis Oliphant - Why I promote conda (2013)](http://technicaldiscovery.blogspot.com/2013/12/why-i-promote-conda.html)
- [Jake VanderPlas - Conda: Myths and Misconceptions (2016)](https://jakevdp.github.io/blog/2016/08/25/conda-myths-and-misconceptions/)
- [Wes McKinney - conda-forge and PyData's CentOS moment (2016)](https://wesmckinney.com/blog/conda-forge-centos-moment/)
- [Donald Stufft - Powering the Python Package Index (2016)](https://caremad.io/posts/2016/05/powering-pypi/)
- [Pauli Virtanen - Building Python wheels with Fortran for Windows (2017)](https://web.archive.org/web/20210616203153/https://pav.iki.fi/blog/2017-10-08/pywingfortran.html)
- [Uwe Korn - How we build Apache Arrow's manylinux wheels (2019)](https://uwekorn.com/2019/09/15/how-we-build-apache-arrows-manylinux-wheels.html)
- [Pradyun Gedam - Testing the next-gen pip dependency resolver (2020)](https://pradyunsg.me/blog/2020/03/27/pip-resolver-testing/)
- [Sumana Harihareswara - Releasing pip 20.3, featuring new dependency resolver (2020)](https://pyfound.blogspot.com/2020/11/pip-20-3-new-resolver.html)


I hope this sketches a useful picture of where we are today. If we missed any major issues (I'm sure we did), I'd love to hear them!