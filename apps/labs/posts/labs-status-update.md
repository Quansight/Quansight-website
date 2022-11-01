---
title: 'Labs update and April highlights'
published: May 3, 2019
author: ralf-gommers
description: "It has been an exciting first month for me at Quansight Labs. It's a good time for a summary of what we worked on in April and what is coming next."
category: [Funding, PyData ecosystem]
featuredImage:
  src: /posts/labs-status-update/blog_feature_org.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/labs-status-update/blog_hero_org.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

It has been an exciting first month for me at Quansight Labs. It's a good time
for a summary of what we worked on in April and what is coming next.

## Progress on array computing libraries

Our first bucket of activities I'd call "innovation". The most prominent
projects in this bucket are [XND](https://xnd.io/),
[uarray](https://uarray.readthedocs.io/en/latest/),
[metadsl](https://github.com/Quansight-Labs/metadsl),
[python-moa](https://github.com/Quansight-Labs/python-moa),
[Remote Backend Compiler](https://github.com/xnd-project/rbc) and
[arrayviews](https://github.com/xnd-project/arrayviews).
XND is an umbrella name for a set of related array
computing libraries: `xnd`, `ndtypes`, `gumath`, and `xndtools`.

Hameer Abbasi made some major steps forward with `uarray`: the backend and
coercion semantics are now largely worked out, there is
good [documentation](https://uarray.readthedocs.io/en/latest/), and the
`unumpy` package (which currently has `numpy`, `XND` and `PyTorch` backends)
is progressing well. This [blog post](https://labs.quansight.org/blog/2019/04/uarray-intro/)
gives a good overview of the motivation for `uarray` and its main concepts.

Saul Shanabrook and Chris Ostrouchov worked out how best to put `metadsl`
and `python-moa` together: `metadsl` can be used to create the API for
`python-moa` to simplify the code base of the latter a lot. Chris 
also wrote an interesting [blog post](https://labs.quansight.org/blog/2019/04/python-moa-tensor-compiler/)
explaining the MoA principles.

The work on XND over the last month consisted mostly of "under the hood"
improvements and fixes in `xnd` and `ndtypes` by Stefan Krah. We did create
a new [xnd-benchmarks](https://github.com/xnd-project/xnd-benchmarks) repository
and had some interesting discussions on performance. One thing I learned is that
XND has automatic multithreading and has very similar performance to NumPy + MKL
for basic arithmetic operations (at least for array sizes above ~1e4 elements, the
overhead for small arrays is larger). The `xnd.array` interface, which is a higher
level interface than `xnd.xnd` and can be used similarly to `numpy`, is taking
shape as well. One user-visible new feature worth mentioning is that xnd containers
can now be serialized and pickled.


## Work on PyData core projects

Most people in the team are maintainers of or contributors to one or more core
projects in the PyData or SciPy stacks. Helping maintain and evolve those
projects is our second bucket of activities.

Aaron Meurer did a lot of work on [SymPy](https://www.sympy.org), both
maintenance on the SymPy internals and managing the SymPy 1.4 release. He
wrote a nice blog post on the highlights in that release
[here](http://labs.quansight.org/blog/2019/04/whats-new-in-sympy-14/).

Gonzalo Pena-Castellanos is working full-time on [Spyder](https://www.spyder-ide.org/),
with guidance from Carlos Cordoba. Together they have been working very hard to get
the first beta of Spyder 4 ready. Some exciting new features are also in the
works, however Gonzalo will be blogging about those soon so I won't steal his
thunder.

Ivan Ogasawara is spending some time each week on maintenance of
[Ibis](https://docs.ibis-project.org/). If you're a Pandas or scikit-learn user
and need to interact with SQL databases or HDFS/Spark, Ibis is worth looking into.

I myself have enjoyed having a little more bandwidth for NumPy and SciPy.
On the technical front, this allowed me to contribute to the design discussion
about an [addition](https://mail.python.org/pipermail/numpy-discussion/2019-April/079317.html)
to NEP 18 (the `__array_function__` override mechanism),
do the [numpydoc](https://github.com/numpy/numpydoc) 0.9 release, deal
with several build issues, and review a number of PRs
(the one
allowing to specify [BLAS and LAPACK link order](https://github.com/numpy/numpy/pull/13132)
was particularly nice). On the organizational front, I fixed the description
of how donations are handled on numpy.org, finalized the
[Tidelift](https://tidelift.com/) agreement for NumPy (see the
[announcement](https://mail.python.org/pipermail/numpy-discussion/2019-April/079370.html)
for details), helped NumPy and SciPy get accepted for the
[Google Season of Docs](https://developers.google.com/season-of-docs/) program,
and did everything needed to finalize the fiscal sponsorship agreement between
SciPy and NumFOCUS.

## Jupyter and JupyterLab improvements

Jupyter is a key part of the PyData ecosystem. It extends well beyond that though, so I'm
giving it its own bucket here. At Quansight we have a number of Jupyter core developers
and contributors. Ian Rose, Saul Shanabrook, Grant Nestor and others have been very busy
with both maintenance tasks and adding new features to Jupyter and JupyterLab.

JupyterLab is about to get support for printing (not inside the notebook, but the old-fashioned
`Ctrl-P` variant). [This pull request](https://github.com/jupyterlab/jupyterlab/pull/5850)
by Saul has nice screenshots showing the feature in action for whole notebooks,
 images, the JSON viewer and the inspector.

Ian worked on the third alpha release of JupyterLab 1.0, on testing and CI infrastructure,
and other general maintenance tasks. He also improved PDF preview in JupyterLab, so it
now [works as expected](https://github.com/jupyterlab/jupyterlab/pull/6264) in Firefox
and Chrome (at least).

Saul added support for the [nteract Data Explorer](https://github.com/nteract/nteract/tree/master/packages/data-explorer) to the JupyterLab data registry as a plugin.
[This pull request](https://github.com/jupyterlab/jupyterlab-data-explorer/pull/10) shows it
in action on a pandas DataFrame.

Other interesting features are in progress and will make their way into the main
repositories soon.

## Starting to shape Labs

There is a lot of work to do to figure out for ourselves exactly what Labs
will be, and then to communicate that clearly to the outside world. We have
a rough idea (see [my first blog post](https://labs.quansight.org/blog/2019/04/joining-labs/)
and [Travis' blog post](https://www.quansight.com/single-post/2019/04/02/Welcoming-Ralf-Gommers-as-Director-of-Quansight-Labs)), but there's a long way
to go from there to having an compelling elevator pitch, a website that tells
our story well, people and projects organized, a funding stream, and more.

One of the first things we did do is start this blog, to start communicating
about the technical work we're doing. We're also going through the roadmaps
published at [quansight.com/projects](https://www.quansight.com/projects),
to ensure they're up-to-date and to make clear that those are for _community
driven projects_ that Quansight is aiming to obtain industry support for.

## Funding

We reached about 20% of our funding goal for 2019 so far, primarily with contributions
from [DE Shaw](https://www.deshaw.com/), [OmniSci](https://www.omnisci.com/) and
[TDK](https://www.tdk.com/).

Both DE Shaw and OmniSci are supporting a significant amount of work on
JupyterLab, which highlights how important Jupyter and JupyterLab have become
in the data science ecosystem. DE Shaw is also supporting work on projects
like Dask, Numba and XND that is starting at the moment. OmniSci supports work
on Ibis and Remote Backend Compiler. Finally, Quansight is working with Cal Poly
(one of the [Jupyter lead institutes](https://calpolynews.calpoly.edu/news_releases/2018/May/Jupyter),
together with UC Berkeley) to execute on the Project Jupyter roadmap for JupyterLab.

TDK is sponsoring the Spyder work I talked about above. Supporting both general
maintenance for the Spyder 4 release and some interesting new features is an
important contribution that helps the many engineers and scientists that use
Spyder as their main development and data science interface.

The above is direct funding from companies for work on open source projects.
Quansight also offers open-source support and consulting, as well as training
around the PyData stack. Those activities also yield funds that we then use to
fund the efforts of Quansight Labs. To learn more about those offerings,
contact Travis (`travis@quansight.com`), myself (`rgommers@quansight.com`) or
`sales@quansight.com`.

Besides funding from companies, we are also applying for grants. So far we have
submitted two proposals to the NSF and three to NASA, on topics ranging from
JupyterLab extensions for high performance computing to improving Xarray's array
backend system. For most of these proposals we expect the verdict in the next
1-2 months. In April we got a rejection from the NSF for a
[proposal](https://figshare.com/articles/Mid-Scale_Research_Infrastructure_-_The_Scientific_Python_Ecosystem/8009441)
titled "Accelerated Development of the Scientific Python Ecosystem", which we
wrote together with NumFOCUS and Columbia, with the latter as lead
institute (thanks goes especially to Andreas Mueller and Andy Terrel for a lot
of the hard work on that proposal). The discussions triggered by that
rejection have been very useful and generated a number of new ideas and
contacts to follow up on in the coming months.

One idea that came up more than once is to clearly express the needs of these
projects in public, ideally in fundable chunks and with an effort estimate attached,
and then approaching both funding bodies and companies with that. This is likely
to be more effective than responding to solicitations that may not be a perfect
match. Quansight Labs is positioned well to either participate in or help lead such
a process, and to work with companies that rely on the PyData stack in particular.

However we look for funding, it will be important to be clear in our messaging
and transparent with the community about the ways we look for funding. I will be
actively soliciting feedback on this as well, both via blog posts like these
(please email me at `rgommers@quansight.com` if you have ideas, questions or
concerns!) and in person.

Finally, we are finalizing and signing a preferred partnership with NumFOCUS,
where 5% of Quansight Labs funds or projects referred from NumFOCUS will be
provided to NumFOCUS to sustain their efforts. NumFOCUS is an important fundament
of the PyData ecosystem, and we would like to contribute to keeping it on a sound
financial footing and growing NumFOCUS further.
