---
title: 'NASA ROSES E7 Grant: Reinforcing the Fondations of Scientific Python'
author: matti-picus
published: Aug 10, 2022
description: 'Announcing a 3-year program to improve NumPy, Scipy, pandas, and scikit-learn'
category: [Funding]
featuredImage:
  src: /posts/nasa-rose-grant-2020/scientific_python_ecosystem.png
  alt: 'River of scientific python projects, flowing from Python and Numpy, to
       Foundational projects, to technique-specific projects, to domain-specific
       projects, to applications.'
hero:
  src: /posts/nasa-rose-grant-2020/scientific_python_ecosystem.png
  alt: 'River of scientific python projects, flowing from Python and Numpy, to
       Foundational projects, to technique-specific projects, to domain-specific
       projects, to applications.'
---

### Announcement of the grant being awarded

We are happy and proud to announce that the [NASA Rose 2020](https://science.nasa.gov/researchers/sara/grant-solicitations/roses-2020/release-research-opportunities-space-and-earth-science-roses-2020)
program, specifically the [Support for Open Source Tools, Frameworks and Libraries](https://nspires.nasaprs.com/external/solicitations/summary.do?solId=%7B958CF134-D655-E512-B5AD-84501D14A0C1%7D&path=&method=init)
component, has accepted [a
proposal](/posts/nasa-rose-grant-2020/NASA_project_proposal.pdf)
from the Scientific Python community. The 
[selection](https://nspires.nasaprs.com/external/viewrepositorydocument?cmdocumentid=843923&solicitationId={958CF134-D655-E512-B5AD-84501D14A0C1}&viewSolicitationDocument=1)
(link broken) is for a 3-year, $385,385 per year grant, which will be split between the participating
projects: [scikit-learn](https://scikit-learn.org),
[Pandas](https://pandas.org/), [SciPy](https://scipy.org/) and
[NumPy](https://numpy.org/).

### Backstory

Once the [NASA Rose]()
funding proposal opened, the working group began creating a proposal that
answered the conditions of the program. The proposal was based on an earlier
[rejectd NSF
proposal](https://figshare.com/articles/journal_contribution/Mid-Scale_Research_Infrastructure_-_The_Scientific_Python_Ecosystem/8009441).
Many of the authors of the NSF proposal were also involved in the successful
NASA Rose proposal. The process of pulling the proposal together: laying out
the scope of the program, splitting the grant writing into sections, and
overall cooperation between the groups was in and of itself helpful to get many
of the people at the core of scientific python together.

###    Deliverables
The [Gantt chart](/posts/nasa-rose-grant-2020/NASA_project_workplan.pdf)
summarizes the primary deliverables of the project:
- Ongoing work with issue triaging & code review, maintenance, CI & packaging
  improvements
- Creating a joint infrastructure for running benchmarks and create both
  micro-benchmarks and more general benchmarks for the projects 
- Use NumPy's new dtype infrastructure to create a flexible Unicode string
  type, and integrate that into Pandas
- More NumPy SIMD performance improvements
- Move forward with Array API adoption
- Extend the use of Numba UDFs in Pandas
- Optimize Pandas' memory usage, and use more cython in sckit-learn
- Add support for CuPY and Dask to Scipy and scikit-learn via the Array API
- Add a framework for parallelization to SciPy
- Add large-scale optizmiation routines to SciPy

The goals are quite ambitious given the modest funding. They leverage synergy between the projects and underlying standards to move the entire scientific python community forward.

### Who will be doing the work

The work will be  executed by a mix of experienced maintainers and new talent
recruited specifically for the project. Due to restrictions from the funders,
research will be primarily executed by people in the USA, while the
international team will take on the engeneering and contributor tasks. Some of
the work will be subcontracted to LANL and Cal Poly.

The grant will be administered via a comittee. Dharhas Pothina, the CTO of
[Quansight](https://quansight.com/), will be the PI. Leaders of the
participating projects will advise and monitor activities and changes in scope
to make sure they are aligned with what the projects need most.

### Final thoughts

This is a significant milestone in the growing stream of funding flowing toward
OpenSource and Scientific Python projects. The grant is one of the first to
specifically fund cross-project collaboration, in a way that will leverage
common interests toward improving the entire ecosystem. Institutional funders
are realizing that we are indeed a web of interlinked projects supported by a
community of contributors, and we are thankful to NASA for the opportunity to
spearhead this new model.

We'll provide updates in future blog posts as we achieve significant progress
toward the goals of the grants.

These are exciting times, funding for core PyData projects is accelerating.
