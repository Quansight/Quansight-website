---
title: 'A step towards educating with Spyder'
published: April 11, 2021
author: juanita-gomez
description: 'As a community manager in the Spyder team, I have been looking for ways of involving more users in the community and making Spyder useful for a larger number of people. With this, a new idea came: Education. For the past months, we have been wondering with the team whether Spyder could also serve as a teaching-learning platform, especially in this era where remote instruction has become necessary.'
category: [Community, IDEs]
featuredImage:
  src: /posts/a-step-towards-educating-with-spyder/blog_feature_var2.svg
  alt:  'An illustration of a brown and white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/a-step-towards-educating-with-spyder/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---


As a community manager in the Spyder team, I have been looking for ways of
involving more users in the community and making Spyder useful for a larger
number of people. With this, a new idea came: Education.

For the past months, we have been wondering with the team whether Spyder
could also serve as a teaching-learning platform, especially in this era
where remote instruction has become necessary. We submitted a proposal to the
Essential Open Source Software for Science (EOSS) program of the Chan
Zuckerberg Initiative, during its third cycle, with the idea of providing a
simple way inside Spyder to create and share interactive tutorials on topics
relevant to scientific research. Unfortunately, we didn’t get this funding,
but we didn’t let this great idea die.

We submitted a second proposal to the [Python Software Foundation](https://www.python.org/psf/)
from which we were awarded $4000. For me, this is the perfect opportunity for
us to take the first step towards using Spyder for education.

## What the project is about

The goal of this project is to create specialized Python online training
content that uses Spyder as the main platform to deliver it. The grant will
cover the development of three practical workshops:

1. Python for Financial Data Analysis with Spyder
2. Python for Scientific Computing and Visualization with Spyder
3. Spyder 5 Plugin Development

They will be included as part of [Spyder’s documentation](https://docs.spyder-ide.org/current/index.html)
for remote learning, but they will also be used as hands-on materials for talks and workshops.

These materials are meant for users to learn how Spyder can accelerate their
workflow when working with Python in scientific research and data analysis.
The idea is for us to provide a way in which we can help people get the most
out of Spyder by applying it in their day-to-day jobs.

The first two workshops will cover aspects such as data exploration and
visualization with Spyder’s variable explorer and plots panes, getting
documentation through Spyder’s help pane, writing good quality and efficient
code using Spyder’s code analysis and profiler, etc.

Our last workshop will demonstrate how to create a plugin for Spyder, which,
thanks to our new API in [Spyder 5](https://github.com/spyder-ide/spyder/releases/tag/v5.0.0),
released in April 2021, will allow users to easily customize and
extend Spyder’s interface with new menus, toolbars, widgets or panes in order
to adapt it to their own needs...

## Why it is important

This project will benefit the international community of Spyder users
(around 500,000, we estimate) to discover new capabilities of Spyder in order
to take advantage of all its resources. It will also provide testing
materials for potential users who will be able to adopt Spyder as a tool for
their work in Financial Data Analysis, Scientific research and Spyder plugin
development.

For the past months, our [documentation tutorials](https://youtube.com/playlist?list=PLPonohdiDqg9epClEcXoAPUiK0pN5eRoc)
have had a great impact in our community, with more than 20,000 views in our
YouTube channel. We expect these workshops to be a great input to our
documentation and help us continue building a community around Spyder.

## What is next?

This project is just the first step towards making Spyder an educational
tool. In the future, we hope that we can develop the infrastructure necessary
to support in-IDE tutorials, by improving the tools like [Jupyter Book](https://github.com/executablebooks/jupyter-book),
[sphinx-thebe](https://github.com/executablebooks/sphinx-thebe), [MyST-Parser](https://github.com/executablebooks/MyST-Parser)
which will provide better integration to write educational tutorials.

The final goal is to enable researchers, educators and experts that don’t
necessarily have a software engineering background to build scientific
programming tutorials easily and provide them as online learning materials
in Spyder. Once the infrastructure is built, we can develop several examples
to demonstrate Spyder capabilities and teach basic scientific programming
concepts applicable to a variety of fields.
