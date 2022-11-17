---
title: 'CZI EOSS4 Grants at Quansight Labs'
published: August 31, 2021
author: chris-ostrouchov
description: 'We are thrilled to announce that the team at Quansight Labs has been awarded five EOSS Cycle 4 grants to work on several projects within the PyData ecosystem. This post will introduce the successful grantees and their objectives for these two-year long grants.'
category: [Custom Local, Jupyter]
featuredImage:
  src: /posts/czi-eoss4-grants-at-quansight-labs/blog_feature_org.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/czi-eoss4-grants-at-quansight-labs/blog_hero_org.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Here, at Quansight Labs, our goal is to work on sustaining the future of Open Source. We make sure we can live up to that goal by spending a significant amount of time working on impactful and critical infrastructure and projects within the Scientific Ecosystem.

As such, our goals align with those of the [Chan Zuckerberg Initiative](https://chanzuckerberg.com) and, in particular, the [Essential Open Source Software for Science](https://chanzuckerberg.com/rfa/essential-open-source-software-for-science/) (EOSS) program that supports tools essential to biomedical research via funds for software maintenance, growth, development, and community engagement.

CZI’s Essential Open Source Software for Science program supports software maintenance, growth, development, and community engagement for open source tools critical to science. And the Chan Zuckerberg Initiative was founded in 2015 to help solve some of society’s toughest challenges — from eradicating disease and improving education, to addressing the needs of our local communities. Their mission is to build a more inclusive, just, and healthy future for everyone.

Today, we are thrilled to announce that the team at Quansight Labs [has been awarded](https://chanzuckerberg.com/newsroom/czi-awards-16-million-for-foundational-open-source-software-tools-essential-to-biomedicine/) five EOSS Cycle 4 grants to work on several projects within the PyData ecosystem. This post will introduce the successful grantees and their objectives for these two-year long grants.

## Maintenance & Extension of Scikit-learn: Machine Learning in Python

**PI: Thomas Fan**

This proposal aims to decrease the maintenance backlog of scikit-learn and increase responsiveness to issues and new pull-requests. The team expects that reducing the number of open issues and response and pull-request review timelines will increase community and contributor engagement in the long run.

In addition to day-to-day maintenance, this grant will also enable the scikit-learn team to focus on adding new features, such as:

- Column name consistency
- `ColumnTransformer` outputting pandas DataFrames
- All transformers outputting pandas DataFrames
- Target encoding
- Infrequent categories in one-hot-encoder
- Missing value support in trees and random forest

As part of the project's commitment to Diversity, Equity and Inclusion, the team will guide contributors from different backgrounds and experiences to learn about scikit-learn. They will continue to work with [Data Umbrella](https://www.dataumbrella.org/), holding programming sprints to inspire and encourage people from under-represented groups to participate in open-source development.

[CZI proposal page](https://chanzuckerberg.com/eoss/proposals/maintenance-extension-of-scikit-learn-machine-learning-in-python/)

## SymPy: Improving Foundational Open Source Symbolic Mathematics for Science

**PIs: Aaron Meurer, Jason Moore, and Oscar Benjamin**

This proposal focuses on [SymPy](https://www.sympy.org/) maintenance and improvements in three critical areas:

- Improving the performance of SymPy
- Expanding the popular numerical code generation features
- Overhauling SymPy's documentation

SymPy is a very powerful library capable of doing many advanced calculations. Still, in real applications, SymPy's usefulness is often limited by poor performance. Oscar Benjamin will be working on this project, primarily attacking it from two directions:

- Making use of better data structures and algorithms
- Interfacing with fast libraries written in C and C++, such as FLINT and SymEngine.

In SymPy, code generation refers to converting symbolic expressions into equivalent high-performance code in another language. Many languages are supported, including C, Fortran, Julia, Rust, TensorFlow, and PyTorch. Jason Moore (TU Delft) will be hiring a postdoc to improve the numerical stability of generated code and expand code generation to more complex expressions.

Lastly, Aaron Meurer will focus on improving the high-level documentation of SymPy. He will write tutorials and user guides and improve the existing documentation to lower the barrier of entry for new users.

[CZI proposal page](https://chanzuckerberg.com/eoss/proposals/sympy-improving-foundational-open-source-symbolic-mathematics-for-science/)

## Advancing an inclusive culture in the scientific Python ecosystem

**PI: Melissa Mendonça**

This joint proposal from [NumPy](https://numpy.org/), [SciPy](https://scipy.org/), [Matplotlib](https://matplotlib.org/), and [Pandas](https://pandas.pydata.org/) was submitted as part of a supplemental program called [Essential Open Source Software Diversity & Inclusion](https://cziscience.medium.com/advancing-diversity-and-inclusion-in-scientific-open-source-eaabe6a5488b).
Melissa Mendonça will lead this effort as the PI and include 1-2 maintainers of each project to help set priorities and guide the work, targeted towards Diversity, Equity and Inclusion (DEI).

This grant will help create two Contributor Experience Lead positions, which will involve a mixture of technical and community work with a particular focus on DEI.
Some of the technical activities that will fall under the Contributor Experience Leads' responsibilities are:

- Onboarding new contributors
- Monitoring first-time contributors' PRs and ensure they receive feedback
- Help with the projects' maintenance activities
- Identifying and fixing common developer pain-points

There will also be organizational activities, including organizing regular community meetings, sprints, mentoring activities across projects, maintaining a public calendar of events, etc.

Another goal of this project is to align documentation across the involved projects, including themes and layouts where possible, coordinating the internationalization of websites, and improving translation workflows.

[CZI proposal page](https://chanzuckerberg.com/eoss/proposals/advancing-an-inclusive-culture-in-the-scientific-python-ecosystem/)

## Inclusive and Accessible Scientific Computing in the Jupyter Ecosystem

**PI: Tania Allard**

A critical aspect of open-source Scientific Computing is to enable projects to be accessible to all users. This grant was awarded to Jupyter with Tania as PI and Isabela Presedo-Floyd and Tony Fast as other named Quansight Labs members on the proposal to address existing accessibility issues within the Jupyter Ecosystem.

This grant aims to build tools and standards to boost accessibility across the PyData ecosystem for disabled users during the next two years. The team aims to achieve this by setting an example with [JupyterLab](https://github.com/jupyterlab/jupyterlab) in three ways:

- Ensuring Jupyter compliance with accessibility standards through manual and automated accessibility audits
- Addressing Web Content Accessibility Guidelines (WCAG) violations in core Jupyter ecosystem projects (such as the Lumino library JupyterLab relies on or the PyData Sphinx documentation theme).
- Developing new documentation on best practices for development, documentation, design, and community guidelines with accessibility at the core

By improving accessibility for everyone, the team aspires to broaden the Jupyter and PyData communities and positively impact diversity in science and open-source communities.

[CZI proposal page](https://chanzuckerberg.com/eoss/proposals/inclusive-and-accessible-scientific-computing-in-the-jupyter-ecosystem/)

## Papyri: Better documentation for the Scientific Ecosystem in Jupyter

**PI: Matthias Bussonnier**

This proposal focuses on a significant overhaul of the Jupyter and IPython interactive documentation framework with many features currently only available in hosted websites (inline graphs, search, navigation). Such an approach will provide a less distractive coding experience for Jupyter users while making documentation more accessible.

The current framework is limited to displaying raw docstrings. It does not support the complete set of features a website builder like Sphinx exposes. These limitations negatively impact documentation and library authors' ability to write in docstrings to be still understandable and, at the same time, pushes libraries to complex performance issues affecting solutions like dynamic docstrings.

The team has already [prototyped and presented previously](https://labs.quansight.org/blog/2021/05/rethinking-jupyter-documentation/) ways to improve the Jupyter documentation experience.
Therefore, through this grant, the team will make this implementation possible across the PyData ecosystem so that everyone can have access to rich documentation directly from Jupyter and other IDEs.

[CZI proposal page](https://chanzuckerberg.com/eoss/proposals/papyri-better-documentation-for-the-scientific-ecosystem-in-jupyter/)

# Join us

All of the projects mentioned in this blogpost are open-source community-led projects across the PyData ecosystem. Thanks to the CZI funding, the Quansight Labs team will enable more contributions, but we welcome and encourage your help. If you have a particular interest in any of these projects or are interested in the work we do at Quansight and Quansight Labs, have a look at our [jobs posting](https://www.quansight.com/careers) (Most of our positions are Remote OK and worldwide) and feel free to contact us.
