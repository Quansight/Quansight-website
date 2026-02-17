---
title: 'Stop browsing "good first issues" - do this instead'
published: 11, February 2026
authors: [marco-gorelli]
description: 'Before becoming a contributor, become a user'
category: [PyData ecosystem]
featuredImage:
  src: /posts/good-first-issues/featured.png
  alt: 'Image of "good first issue" label crossed out'
hero:
  imageSrc: /posts/good-first-issues/hero.png
  imageAlt: 'Image of "good first issue" label crossed out'
---

There are many reasons to contribute to open source, and any one of them may have piqued your interest in giving it a go. You hear about the "good first issue" label on GitHub, and start following some trackers which flag issues labelled with it. Indeed, "start with 'good first issues'" has been standard open source advice for years. And I'm here to argue against it: there's a better way to start contributing to open source which will be both rewarding and far easier.

## What's wrong with browsing for "good first issue"s?

First off, let's consider issues labelled "good first issue" in projects you're not familiar with. They will likely either be trivial typo fixes, bugs which look simple to fix, or documentation. Let's consider these in turn:

- Trivial typo fixes: not only will someone else likely have already opened a pull request by the time you finished reading the issue, but this won't be a very valuable learning experience for you anyway.
- Bug fixes. Either it'll be trivial - in which case, see the bullet point above - or you likely won't even be able to understand what the issue is describing and won't have any intrinsic motivation to spend time trying to fix it.
- Good documentation - contrary to some people's belief - is very hard to write. Tackle documentation issue only once you've already used (and struggled with!) a tool.

So instead, let's consider "good first issue"s in projects you are familiar with, and you at least know what they do. If you find a non-trivial issue labelled "good first issue" in such a project, then I'm fairly confident that at least one of the following will be true:

- It'll affect an aspect of the project you're not familiar with.
- You'll read the issue description and you'll ask yourself "why should anyone care about this?".
- You'll have no idea how to even start tackling the issue, calling into question the "good first issue" label.

If may, therefore, look like getting started with open source is a hopeless endeavor and that you may as well give up. Don't! I'm here to tell you want to do instead.

## How to find actually find issues

Don't. That's right - don't find problems to solve. Instead, let the problems find you!

If you focus on building projects and completing tasks, then inevitably, problems to solve will appear by themselves. Some examples are:

- The documentation for a tool you're using is out-of-date or inaccurate.
- You get an unclear error message which doesn't tell you what to do and is unrelated to what you did.
- A parameter which you pass down appears to be ignored.
- Some feature you need is missing.
- ...

And voilà, there you go! When you run into one of the situations above, you've found your good first issue. What you encountered is something that other users will likely also encounter. It's something you already understand and care about. Try addressing it! If you don't manage and don't get anywhere, then no big deal, you likely learned something new along the way anyway. But if you manage, then it'll likely be your entry point to being an open source contributor! Even just writing a good bug report is a valuable way of contributing, see [Joseph Barbier's post on this topic](https://barbierjoseph.com/blog/open-source-starts-with-a-good-issue/).

As you fix the problems which you encounter, you'll gradually build both familiarity with the project and develop a positive reputation within the community. It won't be long until you're able to successfully fix other people's problems too!

## Even better - write your own project (but don't force it)

At some point, you'll find yourself thinking "wouldn't it be nice if there existed a tool which did this particular thing...wait, how has nobody created it yet?". In that moment, seize the opportunity: solve the problem, and publish it online as an open source project. You'll learn a tonne about testing, packaging, and maintenance by doing. And if people start contributing, you'll also learn about community management and leadership.

There are some caveats I must make, though:

- Could your project be monetizable? I'm not an open-source absolutist, and I think closed-source software has its place. If you think your project isn't something that others could easily build for themselves and that people would be willing to pay actual money for, then open-sourcing it isn't necessarily the right idea.
- If you're under full-time employment, check your contract and speak with your manager about whether you're allowed to publish an open source package. Some employment contracts include clauses such as "any invention of yours made whilst employed, even outside of working hours, belongs to the company".
- If your project becomes popular, then user requests can become tiring at times. Give yourself permission to not be perfect, and remind yourself that you have no obligation towards strangers on the internet.

## Responses to possible objections

I'd like to respond to some likely objections from readers.

> "Fixing a typo can still be useful because it teaches you the contribution process / git workflow and teaches you to build the project locally".

I'm not sure I agree. First, because you can fix a typo directly from the GitHub UI without the need to build anything locally, and second because there's nothing stopping you from building the project locally without having a typo to fix.

As for getting familiar with the GitHub workflow, there's already [first-contributions](https://github.com/firstcontributions/first-contributions) for that.

> "Making any kind of contribution can get people's feet in the door"

Agree! And that's why I suggest using tools first, and then making contributions based on problems you encounter whilst using them. Trying to make a first contribution while browsing "good first issue" labels, on the other hand, may result in frustration and dissuade you from doing open source contributions at all.

> "But I might never encounter any bug or issue to contribute to"

This seems a little unlikely to me, as I routinely encounter issues in all kinds of tools that I use. But if this really is the case, you can always start your own project, or browse the issue trackers of projects you routinely use. In which case, I'd suggest browsing the issues until you find one that you care about - it might take a while, but so does anything worthwhile, and I think it'll be a better use of your time than only looking at "good first issue" labels would be.

> "But 'good first issues' are good for projects to attract new contributors"

The story I've heard from several maintainers is that the label tends to attract drive-by contributions and that they are more effort than they're worth. There are some exceptions, of course, but they are in the minority. Some reference threads worth reading are:

- scikit-learn: [RFC: Should we remove the 'good first issue' label?](https://github.com/scikit-learn/scikit-learn/issues/32680)
- Scientific Python: [What does it mean to be a project that is welcoming to newcomers?](https://discuss.scientific-python.org/t/what-does-it-mean-to-be-a-project-that-is-welcoming-to-newcomers/2127/2)

## Conclusion

Next time you use a tool and encounter a cryptic error message, outdated or missing documentation, or bug, take a moment and pause. Turn that frustration into motivation. You may indeed have found your path towards becoming an open source contributor.
