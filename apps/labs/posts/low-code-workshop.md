---
title: 'Low-code contributions through GitHub'
published: September 28, 2021
author: isabela-presedo-floyd
description: "Our goal with the following low-code workshop is to offer a way for folks to join a project's contributors list without the technical overhead. To achieve this we'll discuss a format that relies solely on the GitHub web interface."
category: [Access-centered, Community, OSS Experience]
featuredImage:
  src: /posts/low-code-workshop/blog_feature_org.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/low-code-workshop/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Healthy, inclusive communities are critical to impactful open source projects.
A challenge for established projects is that the history and implicit technical
debt increase the barrier to contribute to significant portions of code base.
The literacy of large code bases happens over time through incremental
contributions, and we'll discuss a format that can help people begin this
journey.

At Quansight Labs, we are motivated to provide opportunities for new
contributors to experience open source community work regardless of their
software literacy.  Community workshops are a common format for onboarding, but
sometimes the outcome can be less than satisfactory for participants and
organizers.  In these workshops, there are implicit challenges that need to be
overcome to contribute to projects' revision history like Git or setting up
development environments.

Our goal with the following low-code workshop is to offer a way for folks to
join a project's contributors list without the technical overhead.  To achieve
this we'll discuss a format that relies solely on the GitHub web interface.

## Case study - collaboratively improving the accessibility of images in documentation

Our successful experiments are based on having new and seasoned contributors
work together to add alternative text representations to images in project
documentation.  Each event lasts an hour with the following format:

1. pre-meeting preparation with a project contributor and meeting facilitator
2. a crash course in the specific topic - eg alt text for images
3. an introduction to a collaborative pull request created by a project contributor
4. group working session to suggest changes to specific files assigned in the pull request
5. a short review of the submissions by the core contributor
6. final review by the core contributor to submit a final pull request

Accessibility is a focus for many members of Quansight Labs' team so we've
chosen this prompt to begin testing these workshops.  We'd love to hear about
other prompts that may be good for low-code contributions.

### Pre-meeting preparation

Each event relies on a single pull request managed by a project contributor.
We recommend using a fork to reduce noise to other contributors because we
gonna be loud for an hour.

Before the event the contributor makes a pull request identifying files that
need changes related to the prompt, some projects may have rendered
documentation that would also help guide the contributions.  The attendees will
use these files to recommend changes to the code landing their aliases in the
GitHub history.  The facilitator will add an agenda for the event with learning
materials that will prepare folks for the event.

### The crash course

The crash course is a short lightning talk style introduction to support the
prompt folks will address during the hour.  This short talk is important to
prepare folks for the topic, to support contributors we want to remove the
technical roadblocks that distract them from the community.

### Introduction to the pull request

To kick off the work, the core developer walks us through the pull request
they've prepared and introduces different files.  For reinforcement, the
facilitator will share their screen to demonstrate the process of recommending
changes to files in a pull request.

### Group work

Together the new and old contributors work together to make changes to relevant
files to improve their quality.  These changes are made using GitHub's suggest
changes feature that allows authors to make single line changes to code; a
workflow perfect for alt text.

### Group review

Over 40 minutes several contributors can make quite a few commits.  The project
contributor shares their screen to review the suggestions made over the course
of the event.  This portion becomes a critique to review the different
contributions made.

### Bringing everything home

All of the work we talked about happened on a contributor's fork.  They now
have a pull request withl a gaggle of contributors.  Their last job is to
submit the pull request to the mainline project and see the work accepted into
the code base.

## Success stories

Everyone loves an underdog story.  What follows are there triumphs of some open
source allies who thought they could run an hour sprint that allowed multiple
folks to contribute to an open source project.  Believe it or not, we weren't
lying to ourselves and others. Below we highlight our successes with running
low-code sprints in Jupyter and NumPy.

### Jupyter accessibility group

There is a small group of the Jupyter community focused on the improving the
accessibility of JupyterLab and orbiting projects.  We meet every other work to
add small patches and fixes. Currently, we're in the process of organizing
workshops to advocate for accessibility and improve the quality of the entire
Jupyter experience for disabled scientists.

On an off week, between our normal syncs, we tested a low-code format for folks
to participate in the Jupyter project.  During an hour, four people were
included in the project by suggesting changes to alt text for images in the
JupyterLab documentation (https://github.com/isabela-pf/jupyterlab/pull/1),
resulting in a collaborative commit to mainline with the help of @krassowski
and @isabela-pf as champions for the shared
work.(https://github.com/jupyterlab/jupyterlab/pull/10670)

We consider this event a success because we were able to remove `git` as a
technical barrier to entry and support changes from multiple authors.


### [NumPy documentation](https://numpy.org/doc/stable/) new comers meeting

Our fledgling experience in the Jupyter event made us *sort of* confident this
could work for other projects.  So we contacted our NumPy accessibility allies
[@melissawm](https://github.com/melissawm) and [@marsbarlee](https://github.com/marsbarlee) to test this hypothesis at the NumPy newcomer's
meetings, which [happen every other
Thursday](https://mail.python.org/archives/list/numpy-discussion@python.org/thread/4EBH3QAH6IR56WJCM7VEL55ACGGK6JKP/).

During the first meeting, @marsbarlee provided a valuable [slideshow on how to
write alt text for scientific
diagrams](https://docs.google.com/presentation/d/150vhbpGrtAc3ALhrS1a07lhEKCgevAY3ITh-4eCndDk/edit?usp=sharing).
Writing alt-text for scientific diagrams in the documentation poses a unique
challenge, as conventional advice for writing alt-text is not sufficient.
Abstract concepts such as mathematics can be difficult to describe visually.

We tackled this in the workshop by comparing different examples, such as how
writing alt-text for a Venn Diagram differs from writing for a bar chart. We
also took cue from the surrounding context of the diagram, such as the code
comments, to find the most relevant information to visually describe.

The progress from the NumPy newcomer's meeting can be seen in this issue
https://github.com/melissawm/numpy/pull/27 .  Melissa led the second iteration
of this event to complete more alt text in the main NumPy documentation as well
as beginning to cover [NumPy tutorials](https://numpy.org/numpy-tutorials/)
with a new group of people. By hosting a workshop with another project, we saw
the similar yet different challenges NumPy faced compared to Jupyter,

By working on the NumPy tutorials, which are originally written as Jupyter
notebooks, we faced new questions, such as how to handle rendered live charts,
which are not in still images formats such as JPEG. We faced other types of
media, such as cell input and outputs.

We used a variety of markup languages, including reST, Markdown and HTML, each
with it's own quirks and slight variation in implementing alt-text.

In these two workshops, the community gathered together to create more
accessible documentation across the open-source space, one contribution at a
time.  A highlight, to us, is that we provided opportunities for both long time
NumPy fans and high school students to see themselves in history of such a
foundational tool like NumPy.  Moreover, attendees were still adding alt text
contributions after the event concluded.


## Conclusion

Using GitHub's suggested change system is a way to support low-code,
single-line contributions to different open source code bases.  The event's
collaborative hands-on format offers time for the community to interact in a
meaningful way and see the fruits of their labor immediately.

Please reach out to us if you or your project are interested in running event
like this.  We'd love to hear about how this process can work for your events
and project's perspective.
