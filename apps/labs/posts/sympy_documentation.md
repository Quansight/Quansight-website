# Improving SymPy's Documentation

The Chan Zuckerberg Initiative (CZI) has funded
[SymPy](https://www.sympy.org/) as part of Cycle 4 of its [Essential Open
Source Software for Science (EOSS)](https://chanzuckerberg.com/eoss/) grant
program. As part of this work, Aaron Meurer worked on improving the SymPy
documentation, with a focus on writing new narritave documentation guides.

SymPy is a mature project, and has over 1000 functions and classes. Most of
these functions and classes have API reference documentation in the form of
docstrings, but the SymPy documentation has historically been lacking in
long-form narrative documentation to supplement these reference docs.

In this post, I will go over some of the key documentation improvements that
were made over the course of the 2-year grant period. Note that the
documentation improvements were only one part of the CZI grant to improve
SymPy. Other SymPy developers were funded to improve the performance of SymPy,
and to improve its code generation capabilities. These improvements are
discussed in other blog posts.
<!-- TODO: Link the other posts -->

## Documentation Survey

To start the project, from November 29, 2021 to January 5, 2022 we ran a short
survey on the SymPy community, to get a feel for SymPy's documentation needs.
The results of this survey are summarized
[here](https://www.sympy.org/sympy-docs-survey/2021-docs-survey.html). The
three main takeaways of the survey were:

1. The main SymPy documentation site (https://docs.sympy.org) is overwhelmingly
  the most popular resource that people use to get help with SymPy. This is
  true across all levels of experience, compared to other resources like the
  SymPy website, StackOverflow, and community sites (note: this survey was
  given in 2021, before the popularity of LLM tools like ChatGPT).
  Consequently, we decided that it would be most impactful to spend efforts on
  improving the documentation site over those other resources.

<!-- TODO: Insert graph here-->

2. Survey respondents identified many deficiencies in the SymPy docs which
   made it clear that certain improvements needed to be made to the overall
   layout and organization of SymPy documentation site In particular, we
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
   runs on [JupyterLite](https://jupyter.org/try-jupyter/lab/index.html), that
   is, it runs entirely in the browser using
   [Pyodide](https://pyodide.org/en/stable/). We are hopeful that the
   JupyterLite community can come up with an equivalent SymPy Live-like
   extension that so that we can re-enable similar functionality in the SymPy
   documentation.

3. We were been able to identify some primary areas of documentation that
   to prioritize for writing new documentation guides.

## Improved Sphinx Theme - Furo

<!-- TODO: organize these pictures so that the text is a caption -->

![](/posts/sympy-documentation/sympy-112-docs-odes.png)
![](/posts/sympy-documentation/sympy-17-docs-odes.png)

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
the page, but this was hard to navigate. Additionally green color scheme used,
while giving the SymPy docs a distinctive flavor, had some poor contrast in
some places such as the left sidebar, meaning some people may have had
difficulty reading the text. It cannot be seen from these screenshots, but the
classic Sphinx theme additionally does not work well on mobile (the components
do scale to smaller screen sizes at all), and it does not have native support
for dark modes.

In order to pick a replacement theme, we ran a second survey from February
5-19, 2022. The results of that survey are summarized
[here](https://www.sympy.org/sympy-docs-survey/2022-theme-survey.html). The
candidate themes were [Readthedocs](https://sphinx-rtd-theme.readthedocs.io/en/stable/), [PyData Sphinx Theme](https://pydata-sphinx-theme.readthedocs.io/en/stable/index.html), [Book](https://sphinx-book-theme.readthedocs.io/en/stable/), and [Furo](https://pradyunsg.me/furo/)

Based on the results of the survey, we decided to use the Furo theme. The Furo
theme was ranked the highest by survey respondents. In particular, they liked
the improved sidebar navigation, the dark mode, and mobile support.
Additionally, Furo has good accessibility and the CSS is easy to customize.

The result is a documentation site that has navigable sidebars. We spent
considerable time retheming the default Furo colors to match the traditional
SymPy green theme. This included adding a dark mode set of colors (this can be
accessed by clicking the circle icon at the top of a docs page, or by setting
your device to use dark mode). We took care to make sure all color
combinations used throughout the documentation were that at least WCAG level
AA color contrast so that text would always be readable. This included
modifying the [Pygments syntax highlighting
styles](https://github.com/sympy/sympy/blob/master/doc/src/_pygments/styles.py)
to have better color contrast.

# Improved Organization - Diataxis

![](/posts/sympy-documentation/sympy-112-docs-main-page.png)
![](/posts/sympy-documentation/sympy-17-docs-main-page.png)

Docs for the main SymPy documentation landing page
[now](https://docs.sympy.org/latest/index.html) vs. in [early 2021](https://web.archive.org/web/20210225051926/https://docs.sympy.org/latest/index.html)
(courtesy of [Wayback Machine](https://archive.org/web/)).
