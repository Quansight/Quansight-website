---
title: "Accessibility: Who's Responsible?"
published: March 25, 2021
authors: [isabela-presedo-floyd]
description: "For the past few months, I've been part of a group of people in the JupyterLab community who've committed to start chipping away at the many accessibility failings of JupyterLab. I find this work is critical, fascinating, and a learning experience for everyone involved. So I'm going to document my personal experience and lessons I've learned in a series of blog posts. Welcome!"
category: [Access-centered, OSS Experience]
featuredImage:
  src: /posts/accessibility-whos-responsible/jlabaccess1.png
  alt: 'Fingers and question marks pointing in every direction'
hero:
  imageSrc: /posts/accessibility-whos-responsible/jlabaccess1.png
  imageAlt: 'Fingers and question marks pointing in every direction'
---

## JupyterLab Accessibility Journey Part 1

For the past few months, I've been part of a group of people in the JupyterLab community
who've committed to start chipping away at the many accessibility failings of JupyterLab.
I find this work is critical, fascinating, and a learning experience for everyone involved.
So I'm going to document my personal experience and lessons I've learned in a series of blog
posts. Welcome!

Because this is the first of a series, I want to make sure we start with a good foundation.
Let me answer some questions you might be having.

**Q:** Who are you? <br />
**A:** I'm Isabela, a UX/UI designer at [Quansight Labs](https://labs.quansight.org/), who
cares about accessibility and is fortunate to work somewhere where that is a respected concern.
I also spend time in the Jupyter ecosystem—especially around JupyterLab —though that is not the
only open-source community you can find me in. I like to collect gargoyles, my hair is pink,
and I love the sunflower emoji :sunflower:. It's nice to meet you!

**Q:** What is the Jupyter ecosystem and JupyterLab? <br />
**A:** [Project Jupyter](https://jupyter.org/) is an organization that produces open-source software
and open standards. The Jupyter ecosystem is a term used to describe projects that are directly a
part of or support Project Jupyter. JupyterLab is one of its primary projects and a staple for
the day-to-day work of many students, professionals, researchers, and more.

**Q:** What is accessibility? <br />
**A:** Accessibility is a term used to describe the practice of creating things in a way that
makes them usable for people with disabilities. I’m going to be talking mostly about web accessibility
since JupyterLab is a web app. If you're asking why you should care about accessibility, please
take a moment to read [why it matters](https://www.w3.org/WAI/fundamentals/accessibility-intro/#context)
(hint: there are ethical, legal, and business reasons to care). Inaccessible experiences can
have consequences, from people not being able to get information they need to being unable to
pursue whole careers that rigidly require the use of inaccessible software (such as JupyterLab).

**Q:** Who is responsible for making things accessible? <br />
**A:** I'm so glad you asked! Let's dive into that...

### How did we get here?

The Jupyter ecosystem is full of people who care about accessibility. I know this because I've heard
people ask about accessibility in community meetings. I know this because I've read discussions about
accessibility on Github issues and PRs. I know this because the project has a
[repository](https://github.com/jupyter/accessibility/) devoted to organizing community accessibility
efforts. If this is the case, then why hasn't JupyterLab already been made more accessible in the past
three years it's been deemed "[ready for users](https://blog.jupyter.org/jupyterlab-is-ready-for-users-5a6f039b8906)?"
(I'm intentionally not mentioning other Jupyter projects to limit this post's scope.)

Because for every time accessibility is brought up, I've also experienced a hesitance around taking
action. Even though I’ve never heard it explicitly said, the way I’ve seen these efforts get lost time and
time again has come to mean this in my head: “accessibility is someone else’s problem.” But it can’t always
be someone else’s problem; at some point there is a person taking ownership of the work.

So who is responsible for making something accessible? Probably not the users, though feedback can be a
helpful step in making change. Certainly not the people that already can’t use the tool because it isn’t
accessible. But I, personally, think anyone who is part of making that tool is responsible for building and
maintaining its accessibility. Just as any user experience encompasses the whole of a product, an
accessible experience does the same. This should be a consideration from within the product, to its
support/documentation, to any other interaction. A comprehensive team who thinks to ask questions like,
“how would I use this if I could only use my keyboard?” or “would I be able to get the same information if
I were colorblind?” are starting to hold themselves and their team accountable. Taking responsibility is
key to starting and sustaining change.

### Misconceptions

Here are a few common concerns I’ve heard when people tell me why they can’t or haven’t worked on
accessibility. I’m going to paraphrase some replies I've heard when asking about accessibility in many
different environments (not only JupyterLab) over the years.

**I don’t know anything!**
And that’s fine. You don’t have to be an expert! Fortunately, there are already a lot of resources out
on the wide open internet, some even focused on beginners (some of my personal favorites are at
[The A11y Project](https://www.a11yproject.com/resources) and
[MDN](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/What_is_accessibility)). Of course,
it’s important to remember that learning will mean that you are likely to make mistakes and need to keep
iterating. This isn’t a one-and-done deal. If you do have access to an expert, spending time to build
a foundation means they can help you tackle greater obstacles instead of just giving you the basics.

**I don’t have time for another project!**
Accessibility doesn’t have to be your only focus. JupyterLab sure isn’t the only project I am working on,
and it won’t be in the near future. Any progress is better than no progress, and several people doing even
a little work can add up faster than you might think. Besides, there’s a good chance you won’t even have
to go out of your way to start improving accessibility. Start by asking questions about a project you are
already working on. Is there a recommended way to design and build a component? Is information represented
in more than one way? Is everything labeled? It’s good practice and more sustainable to consider
accessibility as a regular part of your process instead of a special side project.

**It’s not a good use of my energy to work on something that only affects a few people!**
It’s not just a few people. Read what [WHO](https://www.who.int/en/news-room/fact-sheets/detail/disability-and-health)
and the [CDC](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html) have
to say about the number of people with disabilities.

**I don’t want to make abled people’s experience different than it already is!**
Depending on what you are doing, the changes might not be active or noticeable unless assistive technologies
or accessibility features are being actively used. And in many cases, accessibility features improve the
experience for all users and not just those they were designed for (sometimes called the [curb cut effect](https://uxdesign.cc/the-curb-cut-effect-universal-design-b4e3d7da73f5)). Even if you aren’t convinced, I’d encourage you to ask yourself why creating the user
experience you want and making that experience accessible are mutually exclusive. What are people missing
out on if they can’t use your product? What are you missing out on if they can’t use your product?

### What could responsibility be like?

With JupyterLab, it was just a matter of a few people who were willing to say they were tired of waiting and able
to spend time both learning what needed to be done as well as doing it. Speaking for myself, I did not come in as
an expert or with undivided obligations or even someone with all the skills to make changes that are needed. I
think this is important to note because it seems to me that it could have just as easily been other members of
the community in my position given similar circumstances.

Our first step in taking responsibility was setting up a regular time to meet so we could check-in and help
one another. Then we set reasonable goals and scoped the work: we decided to focus on JupyterLab rather
than multiple projects at once, address [WCAG 2.1 standards](https://www.w3.org/TR/WCAG21/) in parts of JupyterLab we were already
working on, and follow up on past work that other community members began. This is just the beginning,
but I hope it was a helpful peek into the process we are trying out.

### But wait, there's more!

Deciding to make accessibility a priority in Jupyter spaces isn't where this work ends. Join me for the next post in this series
where I'll talk about my not-so-subtle panic at the amount of problems to be solved, how to move forwards in spite of panic, and
the four experience types in JupyterLab that we must address to be truly accessible.

---

_This is part of a series of blogs around making JupyterLab more accessible. You can read the
[whole series here](https://labs.quansight.org/blog?category=Access-centered&page=1)._

_Interested in getting involved? Join our community via the JupyterLab accessibility meetings
listed every other week on the [Jupyter community calendar](https://jupyter.readthedocs.io/en/latest/community/content-community.html#jupyter-community-meetings)._
