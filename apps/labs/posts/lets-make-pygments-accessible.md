---
title: '"Let's make Pygments accessible!"'
author: stephannie-jimenez
published: November 15, 2022
description: 'accessible-pygments hosts curated WCAG-compliant themes for all your syntax highlighting needs.'
category: [Access-centered]
featuredImage:
  src: /posts/lets-make-pygments-accessible/featured_themes.png
  alt: 'An animation of different accessible syntax highlighting themes being applied to the same example code.'
hero:
  imageSrc: /posts/lets-make-pygments-accessible/hero_themes.png
  imageAlt: 'An animation of different accessible syntax highlighting themes being applied to the same example code.'
---

Additional authors: Isabela Presedo-Floyd

Themes… everyone has their personal preferences when it comes to colors and fonts. Because let’s face it, we all have spent some time trying to change or create our own theme for our operating system, terminals, and IDEs. But what happens when preferences create inaccessible tools? And how do you fix it?

Creating themes is HARD enough, and checking whether a theme has proper contrast may be unfamiliar to people less aware of accessibility needs and standards. Additionally, there is no “correct” answer, so we need multiple theming options.

[Pygments](https://pygments.org/) is a very popular package for syntax highlighting and is the default backend for a lot of packages. Within the Jupyter ecosystem, a community [we have worked to improve a breadth of accessibility issues](https://jupyter-a11y.netlify.app/) in, also uses Pygments as its syntax highlighting backend for projects like [Jupyter Book](https://jupyterbook.org/en/stable/intro.html). This means that in interacting with code cells and blocks, you are interacting with potential color issues inherited throughout the ecosystem. Knowing that Jupyter projects are far from the only ones that could benefit from accessibility-considerate syntax highlighting, we created our own package named `accessible-pygments` to host themes that already had accessible and WCAG compliant colors. To date, this includes [Eric Bailey’s a11y-syntax-highlighting themes](https://github.com/ericwbailey/a11y-syntax-highlighting) and [Tania Allard’s pitaya smoothie theme](https://github.com/trallard/pitaya_smoothie).

Best of all, `accessible-pygments` is ready to use! While this package is at an early stage, it builds on wider community knowledge and aims to bring more inclusive options to our ecosystem bit by bit. We hope that it starts to be used and powers multiple sphinx sites, syntax highlighting in IDEs and more! 

[Explore the themes in use at any time using our demo.](https://quansight-labs.github.io/accessible-pygments/)✨

## What makes a theme accessible?

So what? Even if accessible theming sounds good on the surface, let’s talk about the motivation behind more accessible syntax highlighting and how you can review this (or any) theme in the future.

At its foundation, ensuring that syntax highlighting considers accessibility matters for [the same reasons any accessibility effort does](https://www.w3.org/WAI/fundamentals/accessibility-intro/#context). Given that syntax highlighting is already a visual support for people handling code, this is more about extending the benefits to people of all abilities rather than only the fully sighted. Syntax highlighting may fail people with low vision, all types of color blindness, and anyone working in bright areas with a big glare on their screen.

To address this, we’ll need some color theory language. All colors can be described by these three properties:
- Hue, or “what color is it?” 🖍
- Value, or “how light or dark is it?” 🌞🌚
- Saturation, or “how much of that color is present?” You can also ask yourself if it looks like it’s mixed with other colors, white, black, or grey. ⚖️

The most common issues in syntax highlighting—where each color has a certain meaning—will be sufficient color contrast (an issue of value) and using distinct hues. 

The themes we’ve added to `accessible-pygments` so far follow [WCAG AA color contrast requirements](https://www.w3.org/TR/WCAG22/#contrast-minimum). This means that there is a good amount of difference in value between a given color and the other colors it overlaps with, usually the background color. Because syntax highlighting is mostly text based, we need to follow guidelines for text contrast at normal text sizes. There are a few ways you could review this, but a quick way to dive in is to plug colors into an [online contrast checker](https://webaim.org/resources/contrastchecker).

Distinct hues refers to reviewing that themes maintain their visible differences even if their colors cannot be fully perceived. For example, a theme using all different shades of blue would have no distinct hues; they are all blue! If you have limited vision, they may all blend together like there is no syntax highlighting at all. Colors that are close together on the color wheel can also be difficult for some people to distinguish. For example, blue and purple can easily look like one color. But if someone decides to lean into their differences—like a true blue and a more red purple— these hues may be easier to distinguish. A good example of a distinct color combination would be blue and orange. Not only are these opposite hues from each other on the color wheel, they have different innate values, and do not have large amounts of red or green (hues that can be especially tricky to distinguish in the most common cases of color blindness). For now, the authors are not aware of a good single test for ensuring that hues are distinct. Sometimes color blindness simulators, like the [A11y Color Blindness Empathy browser extension](https://vinceumo.github.io/A11Y-Color-Blindness-Empathy-Test/), can help you pinpoint these issues when you turn on a simulation.

The best accessibility experiences are often ones with strong defaults that welcome customization. In `accessible-pygments`, we are still focused on the strong defaults portion of that statement. Because we do not support customization, our goal is to [provide a growing list of curated accessible themes](https://github.com/Quansight-Labs/accessible-pygments/issues/2) for people to choose from. Having options so that everyone can choose what works best for them allows people to have agency and limit how disabling their environment is.

## What can you do?

Most of all, we encourage you to [try `accessible-pygments` for yourself!](https://quansight-labs.github.io/accessible-pygments/) 🔍

If you have any application or web page that is using `pygments` under the hood, you can add this package as a dependency and use one of our themes.
We have installers available in both `pip` and `conda` using the `conda-forge` channel. For more information about installation, please visit [the project repo](https://github.com/Quansight-Labs/accessible-pygments).

If you experience any bugs or want us to include a new theme, reach out in the [issue tracker](https://github.com/Quansight-Labs/accessible-pygments/issues) of the project. We will also love to know how you are using this package, so any screenshots or links to your project will be amazing as a resource not only for `accessible-pygments` but also for the broader accessibility community.

And remember, even if this project isn’t for you, evaluating the syntax highlighting you use in public-facing work is a great way to dive into making your work more accessible. Every step helps us make a more inclusive internet.

## What are next steps for the project?

`accessible-pygments` just released its first version, so naturally, we still have plenty to do for future versions! 

Our main areas of focus inside the project include,
- Adding more accessible themes 🎨
- Increase the demo site with more languages 🆙
- Address your feedback 👀

We also have plans that involve interactions with other popular packages,

- Create a theme extension for JupyterLab 👩🏼‍🎨
- Create a sphinx tutorial ✍️
