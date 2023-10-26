---
title: "Improving SymPy's Documentation"
authors: [aaron-meurer]
published: October 25, 2022
description: 'SymPy's documentation has received many significant improvements over the past two years thanks to funding by the Chan Zuckerberg Initiative.'
category: [Community, Developer Workflows, OSS Experience]
---

The Chan Zuckerberg Initiative (CZI) has funded
[SymPy](https://www.sympy.org/) as part of Cycle 4 of its [Essential Open
Source Software for Science (EOSS)](https://chanzuckerberg.com/eoss/) grant
program. As part of this work, Aaron Meurer worked on improving the SymPy
documentation, with a focus on writing new narrative documentation guides.

SymPy is a mature project, and has over 1000 functions and classes. Most of
these functions and classes have API reference documentation in the form of
docstrings, but the SymPy documentation has historically been lacking in
long-form narrative documentation to supplement these reference docs.

In this post, I will go over some of the key documentation improvements that
were made over the course of the 2-year grant period. Note that the
documentation improvements were only one part of the CZI grant to improve
SymPy. Other SymPy developers were funded to [improve the performance of
SymPy](https://oscarbenjamin.github.io/blog/czi/index.html), and to improve
its code generation capabilities.
<!-- TODO: Link the codegen post when https://github.com/mechmotum/mechmotum.github.io/pull/138 is merged -->

# Documentation Survey

To start the project, from November 29, 2021 to January 5, 2022 we ran a short
survey on the SymPy community, to get a feel for SymPy's documentation needs.
The three main takeaways of the survey were:

1. The main SymPy documentation site (https://docs.sympy.org) is overwhelmingly
  the most popular resource that people use to get help with SymPy. This is
  true across all levels of experience, compared to other resources like the
  SymPy website, StackOverflow, and community sites (note: this survey was
  given in 2021, before the popularity of LLM tools like ChatGPT, so this was
  not included as an option for respondents).
  Consequently, we decided that it would be most impactful to spend efforts on
  improving the documentation site over those other resources.

  ![Plot showing results of SymPy documentation question "which of the
  following resources do you use when getting help with SymPy (select all that
  apply)?" The choice "SymPy Docs Website" has the most responses at
  91%.](/posts/sympy-documentation/sympy-survey-results.svg)

2. Survey respondents identified many deficiencies in the SymPy docs which
   made it clear that certain improvements needed to be made to the overall
   layout and organization of SymPy documentation site. In particular, we
   identified 4 major improvements that could be made:

   - Better top-level organization.
   - A better Sphinx theme that provides better sidebar navigation.
   - The docs have many large pages which would benefit from being split into smaller pages.
   - There were several issues with the SymPy Live extension. This was a
     Sphinx extension that allowed users to execute the example code blocks in
     the SymPy documentation directly in their browser.

   Of these, all except the third, splitting large pages, were done as part of
   the CZI grant work. See below for more details. Splitting large pages
   hasn't been done yet due to technical difficulties with the Sphinx autodoc
   extension, as well as due to the fact that the large pages are now much
   easier to navigate with the new Sphinx theme (see below).

   The SymPy Live extension in the documentation was removed, as it was
   considered too much of a maintenance burden for the SymPy community to
   maintain. There is a new [SymPy Live](https://live.sympy.org/) shell that
   runs on [JupyterLite](https://jupyter.org/try-jupyter/lab/index.html)—that
   is, it runs entirely in the browser using
   [Pyodide](https://pyodide.org/en/stable/). We are hopeful that the
   JupyterLite community can come up with an equivalent SymPy Live-like
   extension that so that we can re-enable similar functionality in the SymPy
   documentation.

3. We were been able to identify some primary areas of documentation that
   to prioritize for writing new documentation guides.

Click if you wish to read the [full survey results](https://www.sympy.org/sympy-docs-survey/2021-docs-survey.html).

# Improved Sphinx Theme - Furo

<!-- TODO: organize these pictures so that the text is a caption -->

![Documentation page for the SymPy ODE module for SymPy 1.12 (October 2023)](/posts/sympy-documentation/sympy-112-docs-odes.png)
![Documentation page for the SymPy ODE module from SymPy 1.7 (May 2021)](/posts/sympy-documentation/sympy-17-docs-odes.png)

Docs for the SymPy documentation page for the ODE submodule
[now](https://docs.sympy.org/latest/modules/solvers/ode.html ) vs. in [early
2021](https://web.archive.org/web/20210502170201/https://docs.sympy.org/latest/modules/solvers/ode.html)
(courtesy of [Wayback Machine](https://archive.org/web/)).



Prior to this project, the SymPy documentation used the "classic" Sphinx
theme. This is the same theme that is used by the [official Python
documentation](https://docs.python.org/), but it is outdated in many ways. It
lacks interactive navigation. As can be seen from the above screenshot, the
layout of the page in the context of the rest of the documentation is only
shown by a small breadcrumb at the top of the page. The overall layout of the
subheadings on the page was given by a table of contents on the left side of
the page, but this was hard to navigate. SymPy's green color scheme,
while giving the docs a distinctive flavor, had poor contrast in some
places such as the left sidebar, making it difficult or impossible to read
for people with low vision. It cannot be seen from these screenshots, but the
classic Sphinx theme does not work well on mobile (the components
do not scale to smaller screen sizes at all), and it does not have native support
for dark modes.

In order to pick a replacement theme, we ran a second survey from February
5-19, 2022. The results of that survey are summarized
[here](https://www.sympy.org/sympy-docs-survey/2022-theme-survey.html). The
candidate themes were [Read the Docs](https://sphinx-rtd-theme.readthedocs.io/en/stable/), [PyData Sphinx Theme](https://pydata-sphinx-theme.readthedocs.io/en/stable/index.html), [Book](https://sphinx-book-theme.readthedocs.io/en/stable/), and [Furo](https://pradyunsg.me/furo/)

Based on the results of the survey, we decided to use the Furo theme. The Furo
theme was ranked the highest by survey respondents. In particular, they liked
the improved sidebar navigation, the dark mode, and mobile support.
Additionally, Furo has good accessibility and the CSS is easy to customize.

The result is a documentation site that has navigable sidebars. We spent
considerable time retheming the default Furo colors to match the traditional
SymPy green theme. This included adding a dark mode set of colors (this can be
accessed by clicking the circle icon at the top of a docs page, or by setting
your device to use dark mode). We took care to make sure all color
combinations used throughout the documentation were at least WCAG level
AA color contrast so that text can be perceived by a wide audience
of readers, including many with low vision. This included
modifying the [Pygments syntax highlighting
styles](https://github.com/sympy/sympy/blob/master/doc/src/_pygments/styles.py)
to have better color contrast.

# Improved Organization - Diataxis

![Main page of the SymPy documentation from SymPy 1.12 (October 2023)](/posts/sympy-documentation/sympy-112-docs-main-page.png)
![Main page of the SymPy documentation from SymPy 1.7 (May 2021)](/posts/sympy-documentation/sympy-17-docs-main-page.png)

Docs for the main SymPy documentation landing page
[now](https://docs.sympy.org/latest/index.html) vs. in [early 2021](https://web.archive.org/web/20210225051926/https://docs.sympy.org/latest/index.html)
(courtesy of [Wayback Machine](https://archive.org/web/)).

A related project was reorganizing the top-level organization of the
documentation. As you can see from the screenshot above from early 2021, the
SymPy documentation main page used to just consist of a long list of every
page in the documentation. The new Furo theme makes this list unnecessary, but
it also gave us an opportunity to explore how these pages could be explored
in a more logical way.

We decided to adopt the [Diátaxis](https://diataxis.fr/) framework for documentation
organization. Diátaxis splits documentation pages into one of
four categories, depending on whether the reader is interested in practical or
theoretical knowledge, and on whether they have study or work oriented goals.
As can be seen from the current documentation main page, the docs are now
organized into four categories: tutorials, how-to guides, explanations, and
API reference. We additionally added "installation" and "contributing" (see
below) as separate top-level categories. Installation is important enough to
warrant calling out documentation for it separately. Contribution documentation
is separate because it serves a separate audience, people who want to
contribute to SymPy, rather than people who are interested in using it.

<!-- TODO: Add Diátaxis framework diagram here -->

In addition to this, we reorganized the dozens of [API reference
pages](https://docs.sympy.org/latest/reference/index.html) into eight
sub-categories: Basics, Code Generation, Logic, Matrices, Number Theory,
Physics, Utilities, and Topics.

# Contribution Documentation

One of the most important things  an open source project can do to attract new
contributors is to have good contributor documentation. SymPy has historically
had a wealth of contributor documentation, but much of it was outdated.
It was also stored on SymPy's
[wiki](https://github.com/sympy/sympy/wiki), which made it less accessible and
harder to maintain in the context of SymPy's full documentation.

Consequently, we decided to move all contributor documentation from the wiki
to the main [SymPy documentation
pages](https://docs.sympy.org/latest/contributing/index.html). Additionally,
we rewrote the [main guide for new
contributors](https://docs.sympy.org/dev/contributing/new-contributors-guide/index.html)
to be more inline with modern SymPy contribution practices, and to reduce the
parts that only explain details on how to use Git and GitHub, which are now
explained better in other sources on the internet.

# Live Documentation Previews on Pull Requests

A live documentation preview build was added to the SymPy CI so that people
can easily view how it looks as HTML. While this
is a relatively minor change compared to some of the other things mentioned
here, this has made things significantly easier for SymPy developers to review
documentation changes.

To view a preview of the documentation, reviewers just need to click the
button in the status checks for the pull request

![Link saying "Click here to see a preview of the documentation." from a SymPy
pull request CI checks listing](/posts/sympy-documentation/sympy-docs-preview-link.png)

and they will be shown a rendered page like


![header on the page that says "This is a preview build from SymPy pull request #25512. It was built against a9765f6. If you aren't looking for a PR preview, go to the main SymPy documentation."](/posts/sympy-documentation/sympy-docs-preview-page.png)

# New Top-level Documentation Guides

In addition to these organizational cleanups, the project involved writing new
documentation on deprecation, custom functions, best practices, and a glossary.

## New Deprecation Policy

SymPy as a symbolic mathematics system is designed not just as an interactive
piece of software, but also as a library, which can be used as a dependency in
other Python projects. Consequently, we in the SymPy community take backwards
compatibility breakages in our API very seriously. Any time the API changes in
a backwards incompatible way, downstream users of that API are forced to
update their code before they can update SymPy, which can be disruptive.

Previously, SymPy's actual policies on backwards compatibility breaks were
vague, and sometimes developers would make breaks that ended up being
unnecessarily disruptive to SymPy's end-users. A [new deprecation
guide](https://docs.sympy.org/dev/contributing/deprecations.html) has been
written that outlines a deprecation policy. This guide brings three new things
to SymPy:

- A clear policy on when backwards compatibility breaks should be made. The
  gist is that [deprecations should be
  avoided](https://docs.sympy.org/dev/contributing/deprecations.html#try-to-avoid-backwards-incompatible-changes-in-the-first-place),
  and only done if absolutely necessary. There is also now a policy that all
  such public compatibility breaks should come with a deprecation when
  possible, and this deprecation should [last at least a
  year](https://docs.sympy.org/dev/contributing/deprecations.html#how-long-should-deprecations-last)
  before being removed.

- A new `SymPyDeprecationWarning` class used for deprecation warnings, which
  gives much more user friendly error messages. For example

  ```py
  >>> import sympy.core.compatibility
  <stdin>:1: SymPyDeprecationWarning:

  The sympy.core.compatibility submodule is deprecated.

  This module was only ever intended for internal use. Some of the functions
  that were in this module are available from the top-level SymPy namespace,
  i.e.,

      from sympy import ordered, default_sort_key

  The remaining were only intended for internal SymPy use and should not be used
  by user code.

  See https://docs.sympy.org/latest/explanation/active-deprecations.html#deprecated-sympy-core-compatibility
  for details.

  This has been deprecated since SymPy version 1.10. It
  will be removed in a future version of SymPy.
  ```

  These warning messages give detailed information on what is deprecated, what
  users can replace their code with, what version the deprecation was added
  in, and a link to an even more detailed page of [deprecation explanations](https://docs.sympy.org/latest/explanation/active-deprecations.html#deprecated-sympy-core-compatibility).

- [All activate deprecations](https://docs.sympy.org/latest/explanation/active-deprecations.html) are listed in a single page.
  This page gives more details about each deprecation than would be appropriate
  to put in the deprecation message, including details on why each deprecation
  was made. The page also gives helpful
  information on [how to silence deprecation warnings](https://docs.sympy.org/dev/explanation/active-deprecations.html#silencing-sympy-deprecation-warnings).

## Guide on Writing Custom Functions

SymPy comes with hundreds of mathematical functions built-in. But it also
comes with a standard functionality for users to define their own custom
functions. This is achieved by subclassing `sympy.Function` and defining
various methods to specify the symbolic behavior. For example,

```py
class log(Function):
    """
    Simplified version of sympy.log that supports basic evaluation and
    differentiation.
    """
    @classmethod
    def eval(cls, x):
        if x == 1:
            return 0

    def fdiff(self, argindex=1):
        return 1/self.args[0]
```

```py
>>> x = sympy.Symbol('x')
>>> log(1)
0
>>> log(x).diff(x)
1/x
```

SymPy now includes an extensive [how-to guide on defining custom symbolic
functions](https://docs.sympy.org/latest/guides/custom-functions.html). This
guide is useful to advanced users, but also this exact same
method is used to define the functions that are included in
SymPy itself. So this guide serves as both a guide to advanced end-users as
well as a guide to SymPy developers looking to define or extend one of the
functions that comes with SymPy.

## Guide on SymPy Best Practices

SymPy has many pitfalls, both for new users and advanced users. The new guide
on [best
practices](https://docs.sympy.org/dev/explanation/best-practices.html) goes
over some of the best practices that should be applied to avoid these
pitfalls.

For example, one pitfall that many new SymPy users run into is using strings
as inputs to SymPy functions, like

```py
>>> from sympy import expand
>>> expand("(x**2 + x)/x")
x + 1
```

It's much better to define symbolic variables and create expressions directly,
like

```
>>> from sympy import symbols
>>>> x = symbols('x')
>>> expand((x**2 + x)/x)
x + 1
```

The [best practices
page](https://docs.sympy.org/dev/explanation/best-practices.html#avoid-string-inputs)
outlines why this is a bad idea, as well as dozens of other best practices
surrounding both basic and advanced usage of SymPy.

## Glossary of SymPy Terminology

As a technical library, SymPy makes use of many terms which have a specific
meaning. If you are not already familiar with SymPy, you might not know what
these specific terms mean, or not realize that they have a specific meaning in
the context of SymPy.

For example, the term "solve" is often used generically in mathematics to
refer to any sort of problem solving. But [in the context of
SymPy](https://docs.sympy.org/latest/explanation/glossary.html#term-Solve),
"solve" always refers to the act of isolating a variable or set of variables
in an equation, like "solve for $x$ in $x^2 = 1$."

The new [glossary](https://docs.sympy.org/latest/explanation/glossary.html)
page in the SymPy documentation defines various terms as used in the context
of SymPy. This is useful not only as a standalone guide, but it is now easy for
other places in the SymPy documentation to cross-reference these specific
terms in the glossary so that readers of those documents can understand what
those terms mean.
