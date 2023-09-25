---
title: 'Doctesting for PyData Libraries'
authors: [sheila-kahwai]
published: September 30, 2023
description: 'The journey of a PyData Newbie'
category: [Developer workflows]
featuredImage:
    src: /posts/doctesting-for-pydata-libraries/quansight-pydata.png
    alt: 'Image featuring the Quansight logo alongside the PyData logo in close proximity'
hero:
  imageSrc: /posts/doctesting-for-pydata-libraries/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

## Discovering the PyData World
Hey there, my name is [Sheila Kahwai](https://github.com/Sheila-nk), and before this internship, I was a [PyData](https://pydata.org/) newbie! Yes,  I hadn't dipped my toes into the world of [NumPy](https://numpy.org/), and my first time locally building [SciPy](https://scipy.org/) happened to be a month into my internship.

Even though I had no experience working with SciPy or NumPy,  I knew I had the potential to create something valuable for the PyData community. So, when I was assigned the task of building a pytest plugin, something I am all too familiar with, I thought, "Maybe a month tops, right? Quick operation, in and out!" Lol, was I in for a surprise!

It was a journey filled with unexpected roadblocks. There were moments I thought I was seeing the light at the end of the tunnel only to realize that the tunnel had light wells. But through it all, I remained positive because my primary goal was to learn and grow, and this internship was an endless source of knowledge and personal growth.

## Navigating the Doctesting Landscape
Let's dive into the technical stuff now. The "[refguide-check](https://github.com/scipy/scipy/blob/main/tools/refguide_check.py)" tool is a SciPy and NumPy module that deals with docstrings. One of its essential functions is doctesting, which involves testing docstring examples to ensure they are accurate and valid. Docstring examples are critical because they serve as documentation to show users how to use your code. However, having them is not enough; they must also be accurate. 

NumPy and SciPy use a modified form of doctesting in their refguide-check utilities. My mentor, [Evgeni Burovski](https://github.com/ev-br), managed to isolate this functionality into a separate package called "[scpdt](https://github.com/ev-br/scpdt)". Scpdt is not your ordinary doctesting tool. It has the following capabilities:
- **Floating-Point Awareness**: Scpdt is acutely aware of floating-point intricacies. E.g: It recognizes that 1/3 isn't precisely equal to 0.333 due to floating-point precision. It incorporates a core check using `np.allclose(want, got, atol=..., rtol=...)`, allowing users to control absolute and relative tolerances.
    ```python
    >>> 1 / 3
    0.333
    ```
- **Human-Readable Skip Markers**: Scpdt introduces user-friendly skip markers like `# may vary` and `# random`. These markers differ from the standard `# doctest: +SKIP` in that they selectively skip the output verification while ensuring the example source remains valid Python code.
    ```python
    >>> np.random.randint(100)
    60     # may vary
    ```
- **Handling Numpy's Output Formatting**: Numpy has a unique output formatting style, such as array abbreviation and often adding whitespace that can confound standard doctesting, which is whitespace-sensitive. Scpdt ensures accurate testing even with Numpy's quirks.
    ```python
    >>> import numpy as np
    >>> np.arange(10000)
    array([0, 1, 2, ..., 9997, 9998, 9999])
    ```
- **User Configurability**: Through a `DTConfig` instance, users can tailor the behavior of doctests to meet their specific needs.
    ```python
    #If an example contains any of these stopwords, do not check the output
    # (but do check that the source is valid python).
    config = DTConfig()
    config.stopwords = {'plt.', '.hist', '.show'}
    ```
- **Flexible Doctest Discovery**: One can use `testmod(module, strategy='api')` to assess only public module objects, which is ideal for complex packages. The default `strategy=None` mirrors standard doctest module behavior.
    ```python
    >>> from scipy import linalg
    >>> from scpdt import testmod
    >>> res, hist = testmod(linalg, strategy='api')
    >>> res
    TestResults(failed=0, attempted=764)
    ```

But here's the twist: Scpdt could only perform doctesting on SciPy's and NumPy's public modules through a helper script, and that wasn't ideal. So, guess who stepped in to bridge the gap?

## Bridging the Gap with Pytest
[Pytest](https://docs.pytest.org/en/stable/index.html) already has a [doctesting module](https://github.com/pytest-dev/pytest/blob/main/src/_pytest/doctest.py), but unfortunately, it doesn't meet the specific needs of the PyData libraries. Therefore, the crucial task was to ensure pytest could leverage the power of Scpdt for doctesting. This involved overriding some of doctest's functions and classes to incorporate scpdt's alternative doctesting objects. It also meant modifying pytest's behavior by implementing hooks, primarily for initialization and collection.

Once all the technical juggling was done, it was time for what my mentor called "[dogfooding](https://www.forbes.com/sites/michaeldefranco/2014/03/04/not-eating-your-own-dog-food-you-probably-should-be-2/?sh=69c002d0692e)" (a term he picked up from Joel Spolsky's [essay](https://www.joelonsoftware.com/2001/05/05/what-is-the-work-of-dogs-in-this-country/)). The term simply means putting your own product to the test by using it, and I had to make sure that the plugin functioned as expected. I did this by locally running doctests on SciPy's modules. It was an eye-opener, exposing issues like faulty collection – for example, the plugin wasn't collecting compiled and NumPy universal functions for doctesting.

With the bugs and vulnerabilities exposed during this process, I was able to refine the plugin further. I then created a [pull request](https://github.com/scipy/scipy/pull/19242) to demonstrate how the pytest plugin could be seamlessly integrated into SciPy. The process is fairly straightforward:

1. **Installation**: Install the plugin via pip.
2. **Configuration**: Customize your doctesting through a `conftest.py` file.
3. **Running Doctests in SciPy**: If you're running doctests on SciPy, execute the command `python dev.py test --doctests` in your shell.
4. **Running Doctests on Other Packages**: If you're not working with SciPy, use the command `pytest --pyargs <your-package> --doctest-modules` to run your doctests.

Voila! 🎉

<p align="center">
    <img
     alt="An image featuring Kamala Harris on a phone call, with the phrase 'We did it, Joe' displayed at the bottom of the image. Adjacent to the image are the pytest logo, a plus sign, and the text representing the doctesting package 'SCPDT'."
     src="/posts/doctesting-for-pydata-libraries/we-did-it.png" />
</p>

## Future Goals
I am currently in the process of integrating the plugin into SciPy; for more details, you can check out [the PR](https://github.com/scipy/scipy/pull/19242). Looking ahead, our goal is to publish the plugin on [PyPI](https://pypi.org/) and extend its integration to NumPy and other PyData libraries. 

If you run into challenges with floating-point arithmetic, face output issues related to whitespace and array abrreviations, need to validate example source code without output testing, or simply desire a customized doctesting experience, consider giving this [plugin](https://github.com/ev-br/scpdt) a try.

## The Journey's End
Throughout this incredible journey, I cherished every moment spent working, learning from my mentors: [Evgeni Burovski](https://github.com/ev-br) and [Melissa Weber Mendonça](https://github.com/melissawm), and being part of the Quansight team. I'm incredibly grateful for this opportunity, and I look forward to continuing my contributions to the pytest plugin even after the internship.

Curious? Check out the [plugin repository on GitHub](https://github.com/ev-br/scpdt). Feel free to contribute – the more, the merrier! 🚀🐍

Stay tuned for more exciting developments! 