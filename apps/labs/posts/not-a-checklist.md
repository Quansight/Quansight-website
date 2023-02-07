---
title: 'Not a checklist: different accessibility needs in JupyterLab'
published: September 14, 2021
author: isabela-presedo-floyd
description: "How we ended up with a discussion about where issues with JupyterLab’s built-in code editors fit on the list of immediate accessibility priorities."
category: [Access-centered]
featuredImage:
  src: /posts/not-a-checklist/blog_feature_var1.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/not-a-checklist/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

## JupyterLab Accessibility Journey Part 3

In a pandemic, the template joke-starter “x and y walk into a bar” seems like 
a stretch from my reality. So let’s try this remote version:

Two community members with accessibility knowledge enter a virtual meeting 
room to talk about JupyterLab. They’ve both updated themselves on GitHub issues 
ahead of time. They’ve both identified major problems with the interface. They 
both get ready to express to the rest of the community what is indisputably, 
one hundred percent for-sure the biggest accessibility blocker in JupyterLab 
for users. Here it is, the moment of truth! 

And they each say totally different things. 

What? Is that not a very funny joke? You’re right, it’s not funny at all; this 
is a real problem we faced.

When I say it like this, I feel silly that there was ever expectation of 
perfect agreement. And yet with every accessibility quick guide, code snippet, 
and blog post (like this one!), I feel as though there is a lingering sense of 
singular absoluteness that pervades the discussions around accessibility that 
I encounter. Something that leaves abled folk like myself almost subconsciously 
feeling , “if I just follow this this top ten accessibility misses as listed 
here, I will have succeeded in making a perfectly accessible piece of software 
and never have to worry about it again.” Once again, this notion sounds just as 
silly to me when stated explicitly, and yet I find myself falling into that 
trap after reading every listicle. 

Most of all, is it any surprise that this might be what happens when disabled 
people are frequently ignored or left out of community conversations? That is, 
if their needs are even considered at all. Disability isn’t monolithic, but it 
can look like that from the outside when these voices are prevented from 
communicating for themselves. (Speaking of which, why don’t you go read the 
thoughts of some disabled people now? Here’s a not-intentionally-curated list 
from my old Slack messages: [Shona Louise](http://www.shonalouise.com/2020/10/im-tired-of-fighting-for-my-rights-as.html), 
[Rin Oliver](https://ckoliver.com/published.html), 
[Dr. Amy Kavanagh](https://twitter.com/BlondeHistorian), 
and [Léonie Watson](https://tink.uk/).)

This is part of why I try to focus these blogs on recording stories and 
thoughts as well as our approaches to solving problems. Because many times I 
feel like the best solution I can give is to keep asking questions, keep 
gathering people who care, and prioritize listening to disabled people.

### How does this affect JupyterLab?

So when we have experienced community members disagreeing about accessibility 
in a JupyterLab call, it really intimidated someone newer like me. I never 
thought the disagreement was a bad thing, but it made me extremely unsure 
about how to make concrete progress. If these two couldn’t agree, then what was 
I going to do? The first thing was to listen. That’s how we ended up with a 
discussion about where issues with JupyterLab’s built-in code editors fit on 
the list of immediate accessibility priorities. For some it was the absolute 
first-to-fix item because they found writing content—code in particular—as the 
most important and empowering part of working in JupyterLab. For others, the 
code editor was one of many priorities that could not be realized until all of 
JupyterLab was navigable. They argued that if you couldn’t even get to the 
code editor, how would you be able to take advantage of its accessibility 
features? But those in favor of making the code editor accessibility 
improvements immediately felt that not having a core function of JupyterLab 
accessible as soon as possible was the obstacle for anyone needing to work in 
JupyterLab now: the people who are actively having their education, careers, 
and life disrupted by yet another inaccessible tool.

### Current steps

This is where user feedback, testing, and community comes in. Personally, I’ve 
found user testing and similar types of feedback its own challenge in open 
source projects, and this is no exception. We are still figuring out how we 
can approach this for JupyterLab long-term, especially when the people we want 
feedback from the most likely can’t use JupyterLab at all as it is now. Here 
are a few approaches we’ve been applying so far:

- Actively inviting people who haven’t been served by JupyterLab in the past, 
disabled people in this case, back to the community. This has been mostly in 
our [regular accessibility meetings](https://jupyter.readthedocs.io/en/latest/community/content-community.html#jupyter-community-meetings) 
and in planning upcoming Jupyter accessibility workshops.
- Prioritizing that the resources we use when doing accessibility work are 
made by disabled people and/or are resources that received review from that 
community. This also includes emphasizing a search for multiple resources and 
approaches to similar topics rather than stopping only at one, like reading 
[WCAG guidelines](https://www.w3.org/TR/WCAG21/) and nothing else, for example.
- Manually testing ourselves even though we have a majority abled community. 
[I’ve said it before](https://labs.quansight.org/blog/2021/03/accessibility-whos-responsible/), 
but even abled users can test things, such as keyboard accessibility or 
contrast, pretty reliably. It is important that even as we want disabled 
people to lead, we can’t put all the pressure on them alone. Accessibility is 
the responsibility of abled people too.

### Future steps

Additionally, there are two approaches we’d like to be using but are currently 
not.

- Utilizing services that connect us with disabled people who work in 
accessibility testing. We are not doing this at the moment, because we have 
already been made aware by disabled community members that 
[JupyterLab has major common accessibility issues](https://github.com/jupyterlab/jupyterlab/issues/9399). 
We’d rather do this approach when we are ready to test our solutions to these 
problems and can make the most of that feedback.
- Utilizing automated accessibility testing as a part of JupyterLab’s standard 
test suite. This approach is currently blocked by available tests. I know that 
automated testing is contentious in accessibility spaces, but for reasons I 
mentioned in [this past post](https://labs.quansight.org/blog/2021/05/putting-out-the-fire/) 
I think it is an important part (not whole) of sustainable accessibility for 
open source projects specifically.

As was recently announced, myself and others at Quansight Labs have also been 
awarded funding to dedicate more time and different skill sets to 
accessibility efforts in the Jupyter ecosystem. This is extremely exciting, as 
it will help us make progress on these future steps and other aspects of 
accessibility across projects. You can learn more about this and other funded 
projects at Quansight Labs in our [CZI EOSS4 grants blog post](https://labs.quansight.org/blog/2021/08/czi-eoss4-grants-at-quansight-labs/).

### What’s next?

After several months of JupyterLab accessibility meetings and lovely comments 
from people across open source communities (like our friends in [NumPy](https://numpy.org/) 
and [Spyder](https://www.spyder-ide.org/)), people have repeatedly asked for 
what my process is for evaluating accessibility in my regular work as an abled 
person. Stay tuned for my personal recommendations and references for making 
accessibility a constant consideration even when it is not a part of your 
personal experience!