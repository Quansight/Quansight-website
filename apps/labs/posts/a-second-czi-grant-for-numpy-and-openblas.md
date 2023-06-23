---
title: 'A second CZI grant for NumPy and OpenBLAS'
published: November 19, 2020
authors: [melissa-mendonca, juanita-gomez]
description: 'This new grant totaling $140,000 will fund part of our efforts to improve usability and sustainability in both projects and is excellent news for the scientific computing community, which will certainly benefit from this work downstream.'
category: [Array API, Funding]
featuredImage:
  src: /posts/a-second-czi-grant-for-numpy-and-openblas/blog_feature_var1.svg
  alt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
hero:
  imageSrc: /posts/a-second-czi-grant-for-numpy-and-openblas/blog_hero_var2.svg
  imageAlt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs'
---

I am happy to announce that NumPy and OpenBLAS have once again been awarded a
grant from the Chan Zuckerberg Initiative through
[Cycle 3 of the Essential Open Source Software for Science (EOSS) program](https://chanzuckerberg.com/newsroom/czi-awards-4-7-million-for-open-source-software-and-organizations-advancing-open-science/).
This new grant totaling $140,000 will fund part of our efforts to improve
usability and sustainability in both projects and is excellent news for the
scientific computing community, which will certainly benefit from this work
downstream.

## Why this is important for NumPy and OpenBLAS

The Essential Open Source Software for Science program is visionary and unique.
The activities supported by this funding are not restricted to new technical
features. Rather, it supports maintenance, community engagement, and other types
of work that often go unrewarded in open source projects. And although
[its primary goal is to fund the computational foundations of biology](https://chanzuckerberg.com/eoss/), the benefits of the work done under the Chan
Zuckerberg Initiative's program extend well beyond specific scientific areas.

[This is the second grant from CZI that NumPy and OpenBLAS have received.](https://labs.quansight.org/blog/2019/11/numpy-openblas-CZI-grant/)
This past year, the funding has enabled several high-impact improvements to the
NumPy and OpenBLAS communities. For NumPy, this has meant
[a new website](https://numpy.org/), the establishment of the
[Documentation and Website Teams](https://numpy.org/teams/), and
mentorship and onboarding activities to grow and diversify the maintainers for
the project. For OpenBLAS, the focus has been on technical improvements (thread
safety, support for the 512-bit Advanced Vector Extensions (AVX-512) code, and
thread-local storage). The impacts of these developments extend throughout the
scientific Python ecosystem and beyond, and the increased activity has also
attracted several new contributors.

Our plans for 2021 include continuing with our efforts in documentation and
community building for NumPy and also working to modernize its integration with
Fortran tools via F2py, in addition to dedicating resources towards ensuring the
sustainability of both NumPy and OpenBLAS.
[You can read the full proposal here](https://figshare.com/articles/online_resource/Improving_usability_and_sustainability_for_NumPy_and_OpenBLAS/13269167).

### Documentation

The establishment of the NumPy documentation team has resulted not only in a
[restructuring of the documentation](https://numpy.org/neps/nep-0044-restructuring-numpy-docs.html)
and [a new repository for educational content](https://github.com/numpy/numpy-tutorials)
but has also created the opportunity for many new contributors to join the
project. Part of this new grant will enable us to continue that work, resulting
in a set of high-quality documents around NumPy while at the same time
diversifying opportunities for community contributions.

### F2py

As a part of NumPy, the F2py tool is used by numerous projects in the Python
scientific ecosystem, including SciPy itself, to automate the compilation of
Fortran code into Python modules, making it an essential piece of the
infrastructure for these projects.

However, Fortran has evolved over the years. Although considered by some as a
niche language, it is still [very popular](https://github.com/search?q=fortran)
among scientific computing and high-performance developers and is in
[active development](https://fortran-lang.org/). Due to a lack of dedicated
development work in the past years, [F2py does not support many current
features of the language](https://github.com/numpy/numpy/issues/14938). In
addition, because of limited resources dedicated to testing and maintenance,
regressions have been introduced in the F2py code that may result in a
propagation of bugs for many other projects. With this grant, we plan to address
the maintenance backlog and extend the functionality of F2py and bring back
Pearu Peterson, the original author for the F2py tool, to its development.

Currently, F2py supports wrapping Fortran 77 and Fortran 90 code, except for
derived types introduced in Fortran 90. To support modern use cases, we plan to
add support for derived types and work towards full Fortran 2003 compatibility.
While there have been
[attempts at resolving these issues in the past](https://github.com/pearu/f2py),
they were never integrated into NumPy, and at the moment, this would require a
larger refactor of F2py, which we propose to do. We are also writing a new F2py
user guide with comprehensive examples and feature descriptions.

### OpenBLAS

OpenBLAS is a highly optimized library for linear algebra computations. It
provides accelerated versions of BLAS (Basic Linear Algebra Subroutines and
LAPACK (Linear Algebra Package), which are the two universal interfaces to
perform linear algebra with. It is a key dependency of NumPy and SciPy, as well
as of R and Julia. While most users will not realize they are using it, it is
essential for the three leading scientific open-source programming ecosystems.

This grant will enable the OpenBLAS maintainers to continue addressing critical
technical issues. These include issues with Thread Local Storage, performance at
certain problem sizes, and the implementation of BLAS extensions already
provided by similar libraries.

## In practice

As part of the third cycle of the ​Essential Open Source Software for Science
(EOSS)​ program, CZI awarded $3 million for 17 new grants. These awards bring the
total number of funded proposals to 67 projects and the EOSS program's total
commitment to funding scientific open source to $11.8 million. View the
​[full list of grantees​](https://chanzuckerberg.com/eoss/proposals/).

As for our project, the funds will be again managed by NumFOCUS as a fiscal
sponsor. Of the total value (removing the overhead charges), about two-thirds
will go to NumPy. This will support me, as the PI of this proposal, and Pearu
Peterson part-time for a year, as a subcontract with Quansight. The remaining
funds will support Martin Kroeker part-time for a year.

## To work!

The actual work begins on January 1st, and I'm looking forward to this. Moving
from being a part of the grant project for NumPy in 2020 to being the PI in 2021
is exciting - I can't wait to see what we do next!
