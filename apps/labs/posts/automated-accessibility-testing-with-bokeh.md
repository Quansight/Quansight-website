---
title: 'Automated Accessibility Testing with Bokeh'
authors: [chiemezuo-akujobi]
published: September 30, 2024
description: 'Data is only useful to the extent that people can access it.
  Let me walk you through one of several steps toward making Bokeh data
  visualizations more accessible.'
category: [Access-centered, Beyond PyData, Internship]
featuredImage:
  src: /posts/automated-accessibility-testing-with-bokeh/featured_image.png
  alt: 'An image of the Bokeh visualization library logo with a plus symbol directly beneath it, and the logo of the playwright testing tool beneath the plus symbol. They are arranged vertically on a white background.'
hero:
  imageSrc: /posts/automated-accessibility-testing-with-bokeh/featured_image.png
  imageAlt: 'An image of the Bokeh visualization library logo with a plus symbol directly beneath it, and the logo of the playwright testing tool beneath the plus symbol. They are arranged vertically on a white background.'
---

My name is Chiemezuo, and I got to do some amazing work as a Quansight Labs
intern this summer. My project was on developing Automated Accessibility Testing
for the [Bokeh](https://bokeh.org/) project, and I'm here to tell you all about
it. Interestingly, neither my mentor nor I had previously worked with the
codebase prior to this internship.

## What is Bokeh?

To quote [Bokeh's documentation website](https://docs.bokeh.org/en/latest/):

> Bokeh is a Python library for creating interactive visualizations for modern
> web browsers. It helps you build beautiful graphics, ranging from simple plots
> to complex dashboards with streaming datasets.

An important part of Bokeh is mentioned in the definition, and it's the word
"interactive". This means the plots aren't static and will respond to user
actions/events in the browser (for example: clicking, dragging, or keystrokes).
Bokeh visualizations have a built-in interaction layer that makes them suitable
for situations where one might try to deduce additional information, explore
hypothetical scenarios, or present to an audience.

## What is Accessibility?

Accessibility in this context refers to the practice of designing tools in ways
that people with disabilities would be able to perceive, understand, navigate,
and interact with them. According to the [World Health Organization's study in
2023](https://www.who.int/news-room/fact-sheets/detail/disability-and-health),
roughly 16% of the world's population, or about 1.6 billion people experience
significant disability. For software to be usable for people with disabilities,
concerted efforts towards accessibility have to be made. The more accessible a
website is, the more people have a chance to use it.

## Starting Point

I mentioned earlier that my mentor and I had never worked with the Bokeh library
before. For testing to be meaningful, we needed to know what could be tested,
and to know what could be tested, we needed to understand the experience of
using Bokeh. The first step was to install Bokeh and follow the [user
guide](https://docs.bokeh.org/en/latest/docs/user_guide.html) to get a sense for
what the existing flow was. This was my first task: using Bokeh. On spending my
first week completing the tutorial, I felt confident enough with my usage of
Bokeh to take my first swing at the [project's
objectives](https://github.com/Quansight-Labs/open-source-internships/issues/31).

Now, to be honest, we weren't entirely sure what it meant to make a data
visualization tool more accessible let alone test for accessibility. The word
"visualization" itself had an implicit reference to "needing to see it". Coming
from a web development background, I approached things with a similar mindset
I'd use when trying to make a website more accessible and thought to myself:
"Making a data visualization library accessible shouldn't be so difficult so
testing for it should be a breeze" because with web accessibility, issues could
be fixed by changing the colors, adding labels or values to elements, or
swapping out some elements for more compatible ones. Well, a few weeks into the
internship, I realized I couldn't have been more wrong. The fact that Bokeh code
generated `html` files with plots that opened in a browser didn't mean the plots
could be treated like a web page. I'll explain better in the section on
"accessibility testing tools". Right away, there were so many questions about
what to do, what to look out for, how to test, what would be an acceptable
baseline for "success". These were conceptual questions, but the biggest one of
them ended up being "How does Bokeh even work?"

## How Bokeh works under the hood

After about 6 Wednesdays of recorded knowledge share sessions with Bokeh
maintainers, ~7 pair programming sessions with my mentor, 2 fresh repo
installations, 10's of hours spent reading documentation & consulting tutorial
materials, and weeks of asking myself "what is going on in this codebase?", I
can finally say I have a somewhat decent idea of how Bokeh works under the hood.

The Bokeh codebase is huge, and the library was created at a time where lots of
modern tools like bundlers and compilers weren't as good, so a lot of the
components of the codebase are custom-built. To the user who only wants to
create a visualization, there isn't a need for more than surface-level
understanding of how Bokeh works, no more than a phone user needs to know about
how a phone works when trying to make a phone call. However, for someone who
wants to contribute, you need a good understanding of things. It was at this
point in time my perspective of the internship took a slight turn, and I
realized I would spend more time doing research and gathering feedback than I
would pushing code into the codebase. My mentor and I went back to the drawing
board to define what the project goals would be, and we decided that a
successful internship would start with (and I quote him literally): "taking
things from 0 to 1." The Bokeh codebase didn't have tests for accessibility, so
that would be the "0", and "1" would be to create an environment to run
accessibility tests. Subsequently, the next step would be to actually write some
tests and further refinements could follow.

For how Bokeh actually works, picture a language translator helping two people
converse. For proper communication, each speaker needs to use vocabulary that
the translator understands, else there would be a mistranslation. In this case,
the translator is JSON, and the speakers are Python and Javascript. Javascript
is the driver behind the interaction on the browser, Python is the tool for the
backend, and the complexities of the codebase come from transferring data,
keeping things balanced, and rendering.

Here's a picture from the Bokeh docs on [contributing to
BokehJs](https://docs.bokeh.org/en/latest/docs/dev_guide/bokehjs.html#contributor-guide-bokehjs)
to illustrate how data flows:

<img alt="Image of Bokeh data model flow represented as a flow chart moving from
Python to JSON, to Javascript, and then to final HTML output"
src="/posts/automated-accessibility-testing-with-bokeh/bokeh_bokehjs.jpg"
style={{padding: '10px 20px'}}/>

Now that I knew the inner workings and where things fit, I had an idea of how to
start the testing. This, however, brought up the question of "what" to test
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

We also decided that having [axe-core](https://github.com/dequelabs/axe-core) in
the tests might prove useful. Axe-core is a tool that takes in a HTML node and
scans it against the [Axe
API](https://www.deque.com/axe/core-documentation/api-documentation/) for known
Accessibility issues.

I ended up starting with Python because it was closer to the intended usage of
Bokeh (as a Python tool) and had little friction for me, but after about a week
of development, there were doubts on if it would be the better approach going
forward. This was because generated plots and visualizations would be rendered
in the browser and the code responsible for that would be in Javascript.
Additionally, although the testing tools had Python equivalents, Python wasn't a
first-class candidate for Playwright.

Javascript had first-class support for the testing tools and it was the language
responsible for interactive rendering on the browser, so we ported to that. It
was just before switching to Javascript equivalents that I made an important
discovery: Due to the very nature of Bokeh, axe-core would be useless for lots
of plots. Remember I mentioned that despite generating HTML, Bokeh plots could
not be treated in the same way as web pages? Well, web pages tend to have a
structure, and elements with semantic meaning. However, most Bokeh data
visualizations end up getting wrapped in an HTML `<canvas>`, which is something
axe does not know how to work with. The Bokeh data visualizations that do in
fact break out of this norm rely on extra components or widgets like sliders and
dropdowns which are rendered outside the canvas and are thus testable with the
Axe API. Let's look at some images:

1. An [image URL
   scatter](https://docs.bokeh.org/en/latest/docs/examples/basic/scatters/image_url.html)
   from Bokeh's docs showing a visualization wrapped in a `<canvas>` element
   <img alt="Image of a URL scatter data visualization from Bokeh's
   documentation. It shows a series of bokeh logos scattered across the plot."
   src="/posts/automated-accessibility-testing-with-bokeh/url_scatter.png"
   style={{padding: '10px 20px'}}/>

2. A [colour
   scatter](https://docs.bokeh.org/en/latest/docs/examples/basic/scatters/color_scatter.html)
   from Bokeh's docs with a toolbar and a highlighted accessibility issue. <img
   alt="Image of a colour scatter data visualization from Bokeh's documentation.
   It shows a series of coloured dots and has a toolbar on the right side with a
   bokeh logo highlighted for triggering an accessibility issue."
   src="/posts/automated-accessibility-testing-with-bokeh/color_scatter.png"
   style={{padding: '10px 20px'}}/>

3. A [callback
   slider](https://docs.bokeh.org/en/latest/docs/examples/interaction/js_callbacks/slider.html)
   from Bokeh's docs and its highlighted accessibility issue. <img alt="Image of
   a js callback data visualization from Bokeh's documentation. It shows a
   curved line in a plot and some interactive elements on the right side, one of
   which is a slider that has been highlighted for triggering an accessibility
   issue."
   src="/posts/automated-accessibility-testing-with-bokeh/callback_slider.png"
   style={{padding: '10px 20px'}}/>

Axe-core cannot check anything in a `<canvas>` so the first image would not
produce any problems whatsoever, whereas the other two would produce
accessibility errors. This led me to writing a more detailed report of [my
findings](https://github.com/bokeh/bokeh/discussions/14057#discussioncomment-10674506)
and asking the larger Bokeh community whether they felt adding axe-core was
worthwhile, or whether fixing the identified issues was a good enough action.

All of this was happening while I was simultaneously facing some challenges.

## Challenges

The first challenge I faced was internal (within myself). I had a problem with
not producing as much code. I have always equated productivity with having lots
of lines of code and PRs waiting to be reviewed. At some point, I thought I
wasn't doing enough. The idea of slow research was new to me and it took some
getting used to, but thankfully I got around to doing more studying than coding
for the purpose of this internship. It also paid off because I read so many
things and got new knowledge in my repertoire. This leads me to the bigger
challenge.

Owing to the custom nature of all things Bokeh, I had a problem with getting the
environment to allow axe-core to run. Axe-core required core modules from Node,
and Bokeh had a stripped away version of node for the most part. I tend to like
solving problems by myself with minimal hand-holding, but this was one of those
scenarios that I just couldn't seem to fix without asking for help. The ways
around the problem looked even more problematic, and I found myself questioning
my abilities. For this problem, experience did make all the difference and my
mentor helped me with a part of the codebase we could draw inspiration from. In
one of our pair programming sessions, he said for us to look more closely at all
the directories within the Javascript test directory.

We found out that I had been looking at the test setup the wrong way. The bokeh
test folder has the following [sub
folders](https://docs.bokeh.org/en/latest/docs/dev_guide/testing.html#select-specific-bokehjs-tests):
`baselines`, `codebase`, `defaults`, `devtools`, `integration`, and `unit`. The
`unit`, `defaults`, and `integration` categories of tests were designed to be
able to both run in the terminal, and on the devtools server. The `unit` and
`integration` tests looked the most like tests that one would normally see
and/or write in different projects because they had `describe` blocks and
`assert` statements. Basing this assumption on just those two facts, I felt the
location for `playwright` tests would have to model either of those two, to run
on both terminal & devtools (which is Bokeh's server for running tests and
viewing output in a browser), as well as with assertions. It was on closer
inspection with my mentor in a pair programming session that we discovered that
the `codebase` sub-directory used core node modules, and we decided to base
playwright off that, but followed the pattern of written tests from `unit` and
`integration` that would let the assertions and descriptions work as planned. We
tested to see if things worked, and they did. We cleaned up the code, committed,
pushed, and both stood by the GitHub PR comment section.

On occasion, a question would come up in the PR comment section that would seem
a bit confusing to me, so I would ask my mentor and he would clarify what the
person was trying to ask/communicate, giving me tips on how to implement the
suggestions from reviewers. The feedback brought about some refinements on my
end, and answered questions on the end of the maintainers. Eventually, there was
a general agreement with the status of things. It was at that point in time I
could really say: "We'd done something truly amazing for Bokeh."

## Where we currently are

A testing environment needs tests, and to test what we'd done, we needed a
variety of valid data visualizations. Luckily, Bokeh very generously had over
100 example plots in the documentation that we could test against. A caveat to
testing against the documentation was the fact that it would always need to be
built and served locally before we could run axe-core tests against it.

When the internship started, we had the following
[project](https://github.com/Quansight-Labs/open-source-internships/issues/31)
outcomes:

1. Familiarizing with Bokeh concepts.
2. Initial implementation of automated testing with Playwright and Axe-core.
3. Building on existing tests.
4. Integrating tests with Bokeh's CI.
5. Adding relevant test documentation.

There were a few limitations to achieving all these objectives. The limitations
were:

- Complexities of the Bokeh codebase that required weeks of knowledge share
  sessions.
- The `<canvas>` element being something that couldn't properly be tested.
- Initial difficulty in getting Playwright and Axe-core to run in the tests.
- Time constraints.

We were, however, able to achieve the following:

- An audit and
  [summary](https://github.com/bokeh/bokeh/discussions/14057#discussioncomment-10674506)
  of ~113 doc examples that were run through axe-core.
- Familiarity with the Bokeh codebase.
- An implementation of tests that support Playwright and Axe-core.
- A provision for creating new integration and unit tests and marking as
  "accessibility-focused".

Overall, our efforts towards going from 0 to 1 ended up looking like this [PR
that adds Playwright.](https://github.com/bokeh/bokeh/pull/14032)

## Progressive work going forward

Going from 0 to 1 was a good start, but to go from 1 to n, there are more things
that can be done in Bokeh. In the future, we could:

- Add integration snapshot tests that will be marked as known failures.
- Add CI checks for accessibility tests. This would prevent commits from being
  merged if they will change Bokeh data visualizations in a way that triggers
  accessibility issues.
- Couple things a little tighter with the existing convention. In Bokeh
  currently, to run both the existing tests and the new tests I added, you have
  to run two separate commands. Future work could involve unifying them so that
  all tests can run from a single command. The only requirement of this
  functionality will be a test-labeling mechanism described in the next bullet
  point.
- Have a labeling system to be able to run only "accessibility-focused" tests at
  will. In Bokeh, you can run both individual and group tests using a search
  string command. For labeling, you could prepend (or append) a string like
  "accessibility-focused" to the test description. This feature becomes even
  more useful as `unit` and `integration` directories start to contain more
  accessibility tests.
- Write more tests.

## References

The testing syntax and conventions mentioned all reference the Bokeh guides on
[running tests](https://docs.bokeh.org/en/latest/docs/dev_guide/testing.html#)
and [writing
tests](https://docs.bokeh.org/en/latest/docs/dev_guide/writing_tests.html)

## Acknowledgement

Several collaborative efforts led to the success of my internship work. I'm
grateful to the following people for making the journey smoother: My mentor
Gabriel, Tania and Pavithra for periodic information and pointers, Melissa for
the periodic checkups and feedback loop, Bokeh maintainers Mateusz and Bryan. I
also want to thank the Bokeh community for being welcoming, and Quansight for
giving me an enabling environment to do some great work.
