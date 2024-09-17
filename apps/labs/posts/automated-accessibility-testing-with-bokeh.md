---
title: 'Automated Accessibility Testing with Bokeh'
authors: [chiemezuo-akujobi]
published: September 10, 2024
description: 'Data is only useful to the extent that people can access it.
  Let me walk you through one of several steps toward making Bokeh data
  visualizations more accessible.'
category: [Access-centered, Beyond PyData]
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
it. So, fasten your seatbelts for a fun ride. The best part about this story is
that neither my mentor nor I had previously worked with the codebase prior to
this internship.

## What is Bokeh?

Bokeh is a Python library for creating interactive visualizations for **modern**
web browsers. With Bokeh, you can build beautiful graphics with varying
complexity. From simple plots to complex dashboards with streaming datasets,
Bokeh can help handle that.
An important part of Bokeh is mentioned in the definition, and it's the word
"interactive". Data visualizations produced with Bokeh aren't static; they have
a built-in interaction layer that makes them suitable for situations where one
might try to deduce additional information, explore hypothetical scenarios, or
present to an audience. This makes Bokeh data visualizations perfect for web
pages, applications, Jupyter notebooks, dashboards, and much more.

## What is Accessibility?

Accessibility in this context refers to the practice of designing tools in ways
that people with disabilities would be able to perceive, understand, navigate,
and interact with them.
According to the [World Health Organization's study in
2023](https://www.who.int/news-room/fact-sheets/detail/disability-and-health),
roughly 16% of the world's population, or about 1.6 billion people experience
significant disability. This essentially means we have to do better by way of
building usable software for these people, and this starts with concerted
efforts towards accessibility.

## Proposed Work

The work I did was part of a many-fold proposal. It ran asynchronously (and
somewhat concurrently) with Bokeh's overall goal of making data visualizations
more accessible.
On one end, we had [Frank Elavsky](https://www.frank.computer/) conducting
accessibility research with help from the Bokeh maintainers and Quansight team.
On the other end, I was trying to set up a suitable test environment in the
codebase. The idea was the research was completed and an audit was performed,
and the teams from Bokeh and Quansight (as well as any interested contributor)
could start making fixes to the pertinent parts of Bokeh. For every fix, there
would need to be an accompanying test to avoid regression later on.
The problem, though, was that much of Bokeh runs on custom-built solutions. It
had its own setup for almost everything. It required specific types of
environments to match its use cases, it had a custom compilation, build & run
tooling, and they weren't as thoroughly documented. Bokeh itself has good
documentation for users, but the internal documentation of how things worked
wasn't really there. What this meant for my project was that it would be more of
research work, trying to come up with something to fit into what Bokeh had, with
the least amount of friction. This, while not sacrificing functionality.
I'll have to mention that prior to this project, there was no provision for
Accessibility testing in the Bokeh codebase, and the closest we had to that was
removed sometime in the past because it had been unused and unmaintained for so
long. The primary goal of my work would thus be to move Bokeh from 0 to 1 and
give feedback and findings that could be built upon. Essentially, the spark that
starts the fire.

## How Bokeh works under the hood

Talking about the scope of what I worked on and the accompanying complexities
wouldn't make as much sense if I didn't explain the mechanism behind Bokeh. To
the typical user who needs to get work done, you just install the package, type
some commands as instructed by the docs, and then run. In doing this, if you
look closely at your file directly you'll realize that a matching HTML file has
been created and automatically opens in your browser. Voila! You get an
interactive plot. With a few lines of Python code, you've done some apparent
magic.
This is where things start to get fun. At the end of the day, Javascript is what
gives interactivity to any HTML page, so the fact that you can interact with the
beautiful data visualization on an HTML page implies the existence of CSS and
Javascript. This means Python code is responsible for generating HTML, CSS, and
Javascript. For this to happen with any tool, there needs to be a shared data
model between what would be the backend (Python) and what would be client-side
(what you see on the browser). Bokeh has a brilliant way of doing this, and I'll
attach a picture from their [SciPy 2023
tutorial](https://www.youtube.com/watch?v=G0Yc3ck4lC8) to illustrate:

<img alt="Image of Bokeh data model flow represented as a flow chart moving from
Python to JSON, to Javascript, and then to final HTML output"
src="/posts/automated-accessibility-testing-with-bokeh/bokeh_bokehjs.jpg"
style={{padding: '10px 20px'}}/>

The implication of this is that virtually all things on the Python side should
be representable on a Javascript (for the most part).

## Testing tools

For the right blend of power, ease of use, and modernity, my mentor
[Gabriel](https://github.com/gabalafou) and I decided to use
[Playwright](https://playwright.dev/) for setting up the testing environment.

We also decided that it might be worthwhile having axe-core in the testing setup
to further simplify tests that the Axe API could detect, although due to the
very nature of Bokeh data visualizations, not many things would require
axe-core. This is because the visualizations end up getting wrapped in an HTML
canvas with some styling in the [Shadow
DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM),
which is something axe does not know how to work with. However, certain plots
(or documents) rely on extra components or widgets like sliders and dropdowns
which are done outside the canvas and are thus testable with the Axe API.

## Where we currently are

Before heading straight to where we are currently, it would be useful to mention
what we've tried so far. Remember the tool has a Python part (let's call it
"Bokeh") and a Javascript part (let's call that "Bokehjs"), and both components
need to match each other to avoid unpredictable errors. This means that in
practice, someone could write Playwright tests on the Python side that would be
compiled into Javascript, or write them on the Javascript side proper. The
maintainers of Bokeh very generously gave us over 100 example plots in the
documentation that we could test against.
Testing against the documentation came with a few challenges: one of which was
the fact that the documentation would always need to be built and served before
we could run axe-core tests against them. For this, I picked a subset of the
example plots to get the ball rolling. Due to the documentation build process,
it felt like running the [tests on the Python
side](https://github.com/bokeh/bokeh/pull/13998) would be a good start because
Playwright & Axe-core also had support for Python. While this was a good start,
it only helped in creating a mental model for how other things could be done.
None of the code in it would end up being used in the long run.
For a better setup, we felt that something closer to the client side would be
more ideal for tests. The reasons were somewhat simple: playwright would be more
efficient because of its first-class support for Javascript, and for the fact
that some accessibility tests could be integrated with the existing unit and
integrations test. Bokehjs had a custom setup with lots of moving parts, but we
were able to work on something with only a slight deviation from how things
would normally be run but within a tolerable margin. Bokehjs would have a
separate location for tests that required playwright and axe-core, while the
logic in the unit and integration directories could be built upon or
incrementally added. Our efforts towards going from 0 to 1 ended up looking like
this [PR on creating a playwright
environment.](https://github.com/bokeh/bokeh/pull/14032/files)

## Progressive work going forward

In the future, we could:

- Provision Integration snapshot tests to test against regression.
- Add CI checks for the tests.
- Couple things a little tighter with the existing convention.
- Have a labeling system to be able to run only "accessibility-focused" tests at
  will.
- Write more tests.

## Credits

Several collaborative efforts led to the success of my internship work. I'm
grateful to the following people for making the journey smoother:

- My mentor Gabriel.
- Tania and Pavithra for periodic information and pointers.
- Bokeh maintainers Mateusz and Bryan.
- Melissa for the periodic checkups and feedback loop.

And finally, I'm quite thankful to the Bokeh community for being welcoming, and
for Quansight for giving me an enabling environment to do some great work.
