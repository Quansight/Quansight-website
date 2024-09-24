---
title: 'Automated Accessibility Testing with Bokeh'
authors: [chiemezuo-akujobi]
published: September 10, 2024
description: 'Data is only useful to the extent that people can access it.
  Let me walk you through one of several steps toward making Bokeh data
  visualizations more accessible.'
category: [Access-centered, Beyond PyData, Internship]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: 'Excellent alt-text describing the featured image which appears as a
    small image in our main blog page. This image needs to be 391x174 pixels
    in size.'
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: 'Excellent alt-text describing the hero image which appears as a
    large image at the top of your post page. This image needs to be 1440x696
    pixels in size'
---

My name is Chiemezuo, and I got to do some amazing work as a Quansight Labs
intern this summer. My project was on developing Automated Accessibility Testing
for the [Bokeh](https://bokeh.org/) project, and I'm here to tell you all about
it. The best part about this story is that neither my mentor nor I had
previously worked with the codebase prior to this internship.

## What is Bokeh?

Bokeh is a Python library for creating interactive visualizations for modern web
browsers. It lets you build beautiful graphics, from plots to dashboards. An
important part of Bokeh is mentioned in the definition, and it's the word
"interactive". Bokeh visualizations have a built-in interaction layer that makes
them suitable for situations where one might try to deduce additional
information, explore hypothetical scenarios, or present to an audience. This
makes Bokeh data visualizations perfect for web pages, applications, Jupyter
notebooks, and dashboards.

## What is Accessibility?

Accessibility in this context refers to the practice of designing tools in ways
that people with disabilities would be able to perceive, understand, navigate,
and interact with them. According to the [World Health Organization's study in
2023](https://www.who.int/news-room/fact-sheets/detail/disability-and-health),
roughly 16% of the world's population, or about 1.6 billion people experience
significant disability. This essentially means we have to do better by way of
building usable software for these people, and this starts with concerted
efforts towards accessibility.

## Starting Point

I mentioned earlier that my mentor and I had never worked with the Bokeh library
before, but that was only one half of this story. The other half of the story
was that we were somehow supposed to help make it more accessible than it was.
To be honest, we weren't even sure what it meant to make a data visualization
tool more accessible let alone test for accessibility. The word "visualization"
itself had an implicit reference to "needing to see it" but for some reason, I
thought to myself: "Making a data visualization library accessible shouldn't be
so difficult so testing for it should be a breeze". Well, a few weeks into the
internship, I realized I couldn't have been more wrong. Right away, there were
so many questions about what to do, what to look out for, how to test, what
would be an acceptable baseline for "success". These were conceptual questions,
but the biggest one of them ended up being "How does Bokeh even work?"

## How Bokeh works under the hood

After about 6 Wednesdays of knowledge share sessions with Bokeh maintainers, ~7
pair programming sessions with my mentor, 2
fresh repo installations, 10's of hours spent reading documentation & consulting
tutorial materials, and weeks of asking myself "what is going on in this
codebase?", I can finally say I have a somewhat decent idea of how Bokeh works
under the hood.

The Bokeh codebase is huge, and the library was created at a time where lots of
modern tools like bundlers and compilers weren't as good, so a lot of the
components of the codebase are custom-built. Paraphrasing; "a lot of answers to
questions can only be found in the minds of the maintainers" because you can
only document so much at the early stages of a project. To the user who only
wants to create a visualization, there isn't a need for more than surface-level
understanding of how Bokeh works, no more than a phone user needs to know about
how a phone works when trying to make a phone call. However, for someone who
wants to contribute, you need a good understanding of things. It was at this
point in time my internship took a slight turn, and I realized I would spend
more time doing research and gathering feedback than I would pushing code into
the codebase. My mentor and I went back to the drawing board to define what the
project goals would be, and we decided that a successful internship would be
(and I quote him literally): "taking things from 0 to 1." We would focus on
creating an environment to run accessibility tests.

For how Bokeh actually works, picture a language translator helping two people
converse. For proper communication, each speaker needs to use vocabulary that
the translator understands, else there would be a mistranslation. In this case,
the translator is JSON, and the speakers are Python and Javascript. Javascript
is the driver behind the interaction on the browser, Python is the tool for the
backend, and the complexities of the codebase come from transferring data,
keeping things balanced, and rendering.

Here's a picture from their [SciPy 2023
tutorial](https://www.youtube.com/watch?v=G0Yc3ck4lC8) to illustrate how data
flows:

<img alt="Image of Bokeh data model flow represented as a flow chart moving from
Python to JSON, to Javascript, and then to final HTML output"
src="/posts/automated-accessibility-testing-with-bokeh/bokeh_bokehjs.jpg"
style={{padding: '10px 20px'}}/>

Now that I knew the inner workings and where things fit, I had an idea of how
to start the testing. This, however, brought up the question of "what" to test
things with.

## Accessibility testing tools

For the right blend of power, ease of use, and modernity, my mentor
[Gabriel](https://github.com/gabalafou) and I decided to use
[Playwright](https://playwright.dev/) for setting up the testing environment.

I had hoped that using Playwright would help me wriggle out of a particular
problem. You see, sometimes when I'm uncertain of a direction to go, I let
someone/something else be the deciding factor. Remember I mentioned that Bokeh
had both Javascript and Python equivalents for the same thing? Well, I hoped
Playwright would be opinionated about whether to test with Javascript or Python.
In an interesting series of events, I realized that it had support for both.

We also decided that having axe-core in the tests might prove useful. I also
fancied the idea that it would be more opinionated than Playwright. Yet again,
even more hilariously, it had support for both Javascript and Python. I was
going to have to play "Dora the explorer".

I ended up starting with Python, but after about a week, we decided Javascript
had first-class support for the testing tools and ported to that. It was just
before switching to Javascript equivalents that I made an important discovery:
Due to the very nature of Bokeh, axe-core would be useless for lots of plots.
This is because the visualizations end up getting wrapped in an HTML canvas with
some styling in the [Shadow
DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM),
which is something axe does not know how to work with. This is a half-truth. The
complete truth is that certain plots (or documents) rely on extra components or
widgets like sliders and dropdowns which are rendered outside the canvas and are
thus testable with the Axe API. This put me in a situation where I would have to
report [my
findings](https://github.com/bokeh/bokeh/discussions/14057#discussioncomment-10674506)
and ask the larger Bokeh community whether they felt leaving axe-core was
worthwhile.

All of this was happening while I was simultaneously facing my biggest stumbling
block yet: "the python in the room".

## The Python in the room

This was no elephant, and it certainly wasn't python-related, but it was a big
problem for me. Owing to the custom nature of all things Bokeh, I had a problem
with getting the environment to allow axe-core run. Axe-core required core
modules from Node, and Bokeh had a stripped away version of node for the most
part. I tend to like solving problems by myself with minimal hand-holding, but
this was one of those scenarios that I just couldn't seem to fix. The ways
around the problem looked even more problematic, and I found myself questioning
my abilities.

This was one of those moments where experience makes all the difference, and my
mentor helped me with some other parts of the codebase we could draw inspiration
from. He found something in one of our pair programming sessions, we built
something that worked, tested it, pushed, and he even stood guard at the GitHub
PR comment section, answering questions he knew I might struggle to answer, and
giving me tips on how to implement the suggestions from reviewers. It was at
that point in time I could really say: "We'd done something truly amazing for
Bokeh."

## Where we currently are

A testing environment needs tests, and to test what we'd done, we needed a
variety of valid data visualizations. Luckily, Bokeh very generously had over
100 example plots in the documentation that we could test against. Testing
against the documentation came with a few challenges: one of which was the fact
that the documentation would always need to be built and served locally before
we could run axe-core tests against them. Bokeh also had certain commands we
would have to model new ones after.

Overall, our efforts towards going from 0 to 1 ended up looking like this [PR on
creating a playwright
environment.](https://github.com/bokeh/bokeh/pull/14032/files)

## Challenges

Momentarily keeping aside "the python in the room", I had a problem with not
producing as much code. For some reason, I always equated productivity with
having lots of lines of code and PRs waiting to be reviewed. At some point,
there was some internal conflict within myself because I thought I wasn't doing
enough. The idea of slow research was new to me and it took some getting used
to, but thankfully I got around to doing more studying than coding for the
purpose of this internship. It also paid off because I read so many things and
got new knowledge in my repertoire.

## Progressive work going forward

Going from 0 to 1 was a good start, but to go from 1 to n, there are more things
that can be done in Bokeh. In the future, we could:

- Provision Integration snapshot tests to test against regressions and known
  failures.
- Add CI checks for accessibility tests.
- Couple things a little tighter with the existing convention.
- Have a labeling system to be able to run only "accessibility-focused" tests at
  will.
- Write more tests.

## Acknowledgement

Several collaborative efforts led to the success of my internship work. I'm
grateful to the following people for making the journey smoother: My mentor
Gabriel, Tania and Pavithra for periodic information and pointers,  Melissa for the periodic checkups and feedback
loop, Bokeh
maintainers Mateusz and Bryan, the Bokeh community for being welcoming, and Quansight for giving me an
enabling environment to do some great work.
