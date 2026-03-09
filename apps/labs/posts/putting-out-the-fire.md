---
title: 'Putting out the fire: Where do we start with accessibility in JupyterLab?'
published: May 25, 2021
authors: [isabela-presedo-floyd]
description: 'With the support of a team member with prior experience auditing for accessibility, we pinpointed specific ways in which JupyterLab lacked support for accessibility broken up by WCAG 2.1 standards.'
category: [Access-centered, OSS Experience]
featuredImage:
  src: /posts/putting-out-the-fire/featured_jlabaccess2.png
  alt: 'Multiple fires in an alternating pattern'
hero:
  imageSrc: /posts/putting-out-the-fire/hero_jlabaccess2.png
  imageAlt: 'Multiple fires in an alternating pattern'
---

## JupyterLab Accessibility Journey Part 2

I want to be honest with you, I started asking accessibility questions
in JupyterLab spaces while filled with anxiety. Anxiety that I was shouting
into the void and no one else would work on accessibility with me. Anxiety
that I didn’t have the skills or energy or knowledge to back up what I
wanted to do. Anxiety that I was going to do it wrong and make JupyterLab
even more inaccessible. Sometimes I still feel that way.

Here’s the thing. That anxiety, while real and worth acknowledging, doesn’t
help the disabled people we constantly fail and exclude when we keep building
things inaccessibly. So yes, I want you to know I felt that way and that you
might too, but I also want you to remember who we are here for, especially
if you are working to support a group you aren’t a part of (as is the
case with me). Plus, many of these concerns didn’t end up happening. First,
I didn’t end up being alone at all! Each of the people that have joined in
have different skills that have helped us tackle issues that I don’t think
any of us would’ve been able to on our own. Knowing we are working together
also helps keep me accountable because I’d like to be able to show up to our
meetings with something to share. As for worrying that I’m doing it all
wrong, I suppose that’s still a possibility. Speaking for myself, I’d rather
be making mistakes, learning, and iterating than continue to let JupyterLab
stay inaccessible indefinitely.

In a space where considering the needs of disabled people isn’t the standard,
accessibility might feel like an insurmountable challenge. For example, when
I showed up to our first devoted accessibility meeting, JupyterLab’s
accessibility status was like a hazy shape in the distance. I was pretty sure
it wasn’t good, but I didn’t know for sure how or why. A few meetings later
and a closer look made me realize that haze was actually smoke and I'd walked
myself and others directly into a (metaphorical) burning building. But just
because it felt like everything was chaos without a good place to start didn't
mean that was the truth. In fact, it wasn't. Building software is more about
people more than any tool, so let’s consider what our regular team of people
on the user-contributor-maintainer spectrum said are the basics of what they
care about in JupyterLab.

Users want to:

- Use JupyterLab to read or navigate documents.
- Use JupyterLab to edit and run documents. To edit a document, users need to
  be able to navigate where they want to edit, so the read-only experience is a
  prerequisite.
- Know what things they can do in JupyterLab and get help on how to do it.

Contributors want to:

- Gain enough understanding of a JupyterLab in order to work with it.
- Understand the expectations of their contributions and how to meet them. In
  this case, they would want to know that they need to think about accessibility
  and how to consider that.

Maintainers want to:

- Ensure that JupyterLab is both progressing and relatively stable.
- Promote sustainable growth for a project that doesn’t overwrite past efforts.
  Automation can be helpful because maintainers are usually strapped for time.

With the support of a team member with prior experience auditing for accessibility,
we pinpointed [specific ways](https://github.com/jupyterlab/jupyterlab/issues/9399)
in which JupyterLab lacked support for accessibility broken up by
[WCAG 2.1](https://www.w3.org/TR/WCAG21/) standards.

From conversations with these more experienced community members, we found that
issues generally broke up into four categories of work needed (not necessarily
in this order):

### 1. Make JupyterLab accessible for a read-only type experience

This is something users need. For our purposes, we’re using read-only to
describe what you need to navigate and consume all the content in JupyterLab
from the interface to the documents and processes that live in it. Most
of this also falls under WCAG standards, and are the first things users
need to start working with JupyterLab since it’s difficult to interact
with a space if you can’t get where you want to go.

### 2. Make JupyterLab accessible for an interacting/editing experience

This is something users need and is the other half of WCAG standards. Once
you can navigate the space, people need to interact by writing, editing,
running process, and so on. While WCAG standards do cover interactive web
experiences and they are written generally enough to apply to many interface
types, their roots in a more standard website experience means that we
also have some grey areas to account for since JupyterLab can easily include
complex and layered interactions than even other web apps. We are supporting
this by looking into how other tools with similar uses (like coding) approach
these types of accessibility and hope to test it in the future.

### 3. Accessibility documentation

This is something users and contributors need and has two parts. One part
is making the documentation itself accessible through WCAG compliance in
the docs theme, labeling relevant content, and providing content in different
forms. Second is adding documentation specifically for accessibility such
as how to use accessibility features and how accessibility fits in to our
contribution process.

Accessibility and documentation both have reputations for falling to the
wayside, and we almost got so caught up in applying WCAG standards to the
software itself that we continued the pattern. But making an accessible
experience is, like any UX problem, not limited to the time spent within
that product. Think of it this way, if there is no accessible documentation
on how to get started with JupyterLab and use relevant accessibility
support, then all the work we’ve done in the software itself won’t be able
to serve the very people it is there for.

### 4. Adding relevant accessibility tests to the JupyterLab contributing workflow

This is something contributors and maintainers need, though the results
also benefit users. As grateful as I am to have a group of people who are
taking action to make JupyterLab accessible, it isn’t enough on its own.
We aren’t a group that can review every single PR and we may not all be
able to devote time to this forever; tests ensure that accessibility
remains a priority in the contributing workflow regardless of individual
involvement. It also will help prevent current efforts from being
overwritten by new contributions.

Automated accessibility [testing has its limits](https://www.w3.org/WAI/test-evaluate/tools/selecting/)
because you are trying to quantify an experience without getting users
involved, but I think a first pass and a reminder to the community—especially
the contributing community—that accessibility is something we are all
responsible for is critical. Since accessibility isn’t yet a regular
standard for contributions in many projects, feedback from tests might
also be an opportunity for people who haven’t worked with accessibility
before to start learning more.

## Where we are now

As I’m writing this post, our team is mostly focused on JupyterLab
accessibility for WCAG compliance starting with the read-only type
experience. Among many things, JupyterLab is currently missing of
[landmarks](https://accessibility.18f.gov/landmarks/) and
[labels](https://webaim.org/articles/label-name/) that block manual
accessibility testing to a degree since they prevent further navigation
and interaction. Starting here means that we are a step closer to
users being able to accessibly read content in the interface.

If you are going to take away one thing from my journey so far, I’d
tell you to be consistently brave. Feeling anxious in the face of
challenges and accepting areas where you don’t yet have knowledge is
normal, but it isn’t reason to back down. Find the people that will
collaborate with you and dive in. And when I get lost and don’t know
what to do, I find it most helpful to put people first and remember
who I am doing this for. Breaking the work into pieces by what users
need can help you strategically start putting out fires.

Focusing on people just for strategy isn’t all though. Be on the look
out for my next blog where I’ll talk about what the disconnect of
what accessibility meant to different people in our community and how
that impacted the time and way we’ve solved issues in JupyterLab so far.

---

_This is part of a series of blogs around making JupyterLab more accessible. You can read the
[whole series here](https://labs.quansight.org/blog?category=Access-centered)._

_Interested in getting involved? Join our community via the JupyterLab accessibility meetings
listed every other week on the [Jupyter community calendar](https://jupyter.readthedocs.io/en/latest/community/content-community.html#jupyter-community-meetings)._
