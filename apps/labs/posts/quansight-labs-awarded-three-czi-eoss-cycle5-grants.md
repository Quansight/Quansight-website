---
title: "Quansight Labs awarded three CZI EOSS Cycle 5 Grants"
author: jaime-rodriguez-guerra
published: November 10, 2022
description: "We are delighted to share details about new grants to support the sustainability of SciPy, conda-forge, and CuPy"
category: [Funding, PyData Ecosystem, Packaging, Community]
featuredImage:
  src: /posts/quansight-labs-awarded-three-czi-eoss-cycle5-grants/blog_feature_czi5.png
  alt: ‘Logos of CZI, conda-forge, SciPy, and CuPy'
hero:
  imageSrc: /posts/quansight-labs-awarded-three-czi-eoss-cycle5-grants/blog_hero_czi5.svg
  imageAlt: 'Logos of CZI, conda-forge, SciPy, and CuPy'
---

We are proud and excited to write to you again about the [Chan Zuckerberg Initiative](https://chanzuckerberg.com)'s [Essential Open Source Software for Science](https://chanzuckerberg.com/rfa/essential-open-source-software-for-science/) (EOSS) program. As in previous rounds, this funding cycle supports open source software projects that are essential to biomedical research, by funding software maintenance, growth, development, and community engagement for these critical tools.

Quansight Labs spends a significant amount of time working on impactful and critical infrastructure and projects within the open source Scientific Ecosystem. As we work to sustain and grow community-driven open source projects and ecosystems, we have been fortunate to receive CZI support in previous cycles as well! In the previous cycle, we were a part of [five EOSS grants](https://labs.quansight.org/blog/czi-eoss4-grants-at-quansight-labs). [NumPy](https://numpy.org/) and [OpenBLAS](https://www.openblas.net/) were supported in [cycle 3](https://labs.quansight.org/blog/a-second-czi-grant-for-numpy-and-openblas) and in [the original cycle 1](https://labs.quansight.org/blog/numpy_CZI_grant). We were also involved with the [cycle 3 grant](https://chanzuckerberg.com/eoss/proposals/real-time-collaboration-in-jupyter/) supporting Saul Shanabrook, Eric Charles, Mars Lee, and Athan Reines for their contributions to [Jupyter](https://jupyter.org/), and the two grants supporting Gregory Lee work in [cycles 1](https://chanzuckerberg.com/eoss/proposals/scalable-storage-of-tensor-data-for-scientific-computing/) and [4](https://chanzuckerberg.com/eoss/proposals/gpu-acceleration-rapid-releases-and-biomedical-examples-for-scikit-image/), in his contributions to [zarr](https://zarr.readthedocs.io/en/stable/) and [scikit-image](https://scikit-image.org/).

Today, we are thrilled to announce that three new EOSS Cycle 5 grants were awarded, in which [Quansight Labs team members are taking a leading role](https://cziscience.medium.com/the-key-to-scientific-breakthroughs-improving-access-to-open-source-software-38f04c14accf).

## SciPy: Fundamental Tools for Biomedical Research
**PIs: [Matt Haberland](https://github.com/mdhaber) (Cal Poly), [Pamphile Roy](https://github.com/tupui) (Quansight)**

We partnered with [Cal Poly](https://www.calpolycorporation.org/) to improve the scientific Python library [SciPy](https://scipy.org/) towards helping the Biomedical community.

This project has four goals:
1. Improvement of functions used by biomedical software tools
2. Enhancement of functionality used directly by biomedical researchers
3. General maintenance, so that dependent projects and researchers can use SciPy with confidence
4. Dissemination of results to biomedical researchers

### Improvement and enhancement of functionalities

Out of 55 CZI EOSS grants for Python software projects, 40% involve projects that list SciPy as a dependency, therefore, making improvements to SciPy would directly benefit all these projects.

By surveying the biomedical community, we seek to better support their work directly by adding new features and addressing critical issues they are facing. Preparing for the proposal, the team began a literature review and sent a public survey to maintainers of Python packages depending on SciPy. This continuous effort helps the project maintainers to better understand this community’s needs, their current uses of SciPy, and improvements they expect from SciPy.

An associated, and paramount, objective is to build strong and long-lasting relationships with the biomedical community. Everyone is welcome to participate in this effort by providing feedback: head over to https://scipy.org/ to reach out.

### General maintenance

For more than 20 years, SciPy has been a reliable and stable library, trusted by millions of daily users. This implies a constant monitoring of bug reports and a willingness to listen to feedback coming from all user communities. The task by itself is challenging, and being an open source project means that such vital work stays largely unfunded, thus relying on volunteer work.

Only a handful of maintainers are willing to spend time on support tasks such as working on the continuous integration system, the documentation infrastructure or even issue triaging. Allocating some time to these tasks, will be a service to the volunteer maintainers, who will be able to dedicate more time to the heart of SciPy instead of support tasks.

### Dissemination of results

Although SciPy is well established in the scientific Python ecosystem, its broad scope makes it difficult for a user to notice all its functionalities. Examples of libraries duplicating some “hidden” features of SciPy are numerous. This is a general observation in Science, where things are sometimes forgotten for years, if not centuries. The Fast Fourier Transform was discovered by Gauss more than a century before Fourier, Cooley and Tukey re-discovered it.

The dissemination of scientific knowledge and tools is vital to the open source mission and sustainability of projects like SciPy. To achieve this, the team is making time for ongoing outreach activities such as community calls, and is active on community platforms like Slack and Discord. In addition, the team is planning to promote SciPy’s features at conferences and write specific tutorials targeting Biomedical researchers.

### Call for contributions

SciPy is open source, and as such, this grant work will also be done in the open and with the broaders community. It means that you can all contribute to help or provide feedback. Join [our community](https://scipy.org/community/), and help us shape SciPy for the next decade.

## Transparent, open & sustainable infrastructure for conda-forge and bioconda
**PIs: [Jaime Rodríguez-Guerra](https://github.com/jaimergp) (Quansight), [Wolf Vollprecht](https://github.com/wolfv) (QuantStack)**

This is a joint project with [QuantStack](https://quantstack.net/) to improve [conda-forge](https://conda-forge.org/) and [Bioconda's](https://bioconda.github.io/) sustainability and transparency by adopting vendor-agnostic and secure infrastructure practices. In addition, we will develop comprehensive maintenance metrics and dashboards. 🎉

This project has three main goals:
1. Reducing infrastructure technical debt
2. Adopting an OCI-based mirroring strategy
3. Development of a maintenance dashboard on Quetz

### 1. Reducing infrastructure technical debt

Conda-forge and Bioconda rely on infrastructure and tooling distributed across many GitHub repositories, external CI services, Heroku "dynos" and AWS instances. Many were built as ad-hoc fixes and currently lack documentation or risk mitigation plans. We plan to migrate the configuration and infrastructure provisioning to reproducible, vendor-agnostic tools such as Terraform, complemented with rigorous testing, vulnerability detection, and documentation strategies to enable better security, reliability, and recovery from adverse events.

### 2. Adopting an OCI-based mirroring strategy

[Anaconda.org](https://anaconda.org/) is the default and sole host for all published and installable scientific packages. Adopting vendor-neutral tooling and standards (such as [OCI, the Open Container Initiative](https://opencontainers.org/)) will ensure we uphold the core principles of open source and aid the project's long-term sustainability. We also believe that using and building an infrastructure that follows these open principles are the right foundation for more productive and impactful research and education.

### 3. Development of a maintenance dashboard on Quetz

There is no straightforward way to monitor the operational status of conda-forge or Bioconda’s infrastructure. The existing [conda-forge.org/status panel](https://conda-forge.org/status/) is far from giving a comprehensive view of ongoing maintenance tasks, bottlenecks or the overall health of the many bots and infrastructure pieces. Having a detailed picture of the infrastructure and automation tools will significantly improve the maintainers' workflow and aid with identifying critical risks. The dashboard will be built on top of [Quetz](https://quetz.readthedocs.io/en/latest/index.html), an open source server for hosting conda packages, allowing for increased transparency and extensibility.


## Enhancing High-Level Scientific Computing Support in CuPy
**PI: [Kenichi Maehashi](https://github.com/kmaehashi) (Preferred Networks)**

Led by [Preferred Networks](https://www.preferred.jp/en), Quansight Labs is proud to collaborate on this grant, which aims to provide a series of GPU accelerated routines for signal processing and interpolation in CuPy. The goal is to match SciPy’s `signal` and `interpolate` submodules,  as a foundation for the research community. 

This project has two main goals
1. Develop interpolation and signal processing modules
2. Maintain CuPy to continue supporting the latest platforms

### Develop interpolation and signal processing modules
The [CuPy project](https://cupy.dev/) aims to reach full [coverage of the NumPy and SciPy APIs](https://docs.cupy.dev/en/latest/reference/comparison.html). The developers will implement, profile, document, and add unit tests for each API in the targeted modules: `cupyx.scipy.interpolate` and `cupyx.scipy.signal`. This work includes:


* Careful analysis of the underlying algorithms will be carried out, and specialized GPU kernels (CUDA C/C++) will be written from scratch when needed.
* GPU & CPU elapsed implementation time profiling for a variety of GPU devices representing common research environments 
* Unit tests added to cover all possible input combinations and edge cases, e.g. overflows, exceptions, and warnings

### Maintain CuPy to continue supporting the latest platforms
As with other GPU applications, CuPy heavily relies on NVIDIA CUDA and AMD ROCm libraries. Currently, CuPy supports with CUDA versions (10.2, 11.0-11.6) and four ROCm versions (4.0, 4.2, 4.3, 5.0). GPU vendors generally release updates of these toolkits on a quarterly basis, and providing immediate support for them is essential to allow users to enjoy the latest features, performance enhancements, security, and bug fixes. This work includes:

* Implementing Python wrappers for new APIs added to the library to make them available to CuPy
* Supporting  new features from a new CUDA or ROCm release, when applicable 
* Setting up a continuous integration system to provide extensive coverage of the supported software combinations
* Building a delivery pipeline to provide binary packages for the supported versions of the library


<br />

# Want to join?

The projects mentioned in this blog post are open-source community-led projects across the PyData ecosystem. Thanks to this round of CZI funding, Quansight Labs will contribute more to SciPy, conda-forge and CuPy. We also welcome and encourage your help in this endeavor. If you have a particular interest in one of these projects, or are interested in the work we do at Quansight and Quansight Labs, have a look at our [open job postings](https://www.quansight.com/careers). We are a fully remote and globally distributed company. Please don't hesitate to contact us with questions regarding your application.
