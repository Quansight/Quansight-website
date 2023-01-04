---
title: 'Zoom zoom zoom! Improving Accessibility in JupyterLab'
author: kulsoom-zahra
published: November 28, 2022
description: 'Kulsoom Zahra learns about accessibility and fixes a part of the JupyterLab interface (that used to break when zoomed in) during her summer 2022 internship at Quansight Labs.'
category: [Access-centered, OSS Experience]
featuredImage:
    src: /posts/zoom-a11y-jupyterlab/accessibility+jupyter.png 
    alt: 'Jupyter Accessibility' 
hero:
    imageSrc: /posts/zoom-a11y-jupyterlab/labsbg.png 
    imageAlt: 'Jupyter Accessibility'
---
Hi! I’m [Kulsoom Zahra](https://twitter.com/KulsoomZahra3/), a computer science graduate based in India. I just completed a three month internship (July 22 - Oct 22) at Quansight Labs where I worked on the project “Removing accessibility barriers in JupyterLab”.
 
This blog-post talks about the learnings and experiences from my internship.
 
You all might have heard about accessibility at some point, so did I. Accessibility is basically making the web easy to use for all. But when I started to learn about it, accessibility seemed like a whole world in itself; a compassionate, inclusive and empathetic world. According to Wikipedia, the traditional definition goes like: "[Accessibility is the design of products, devices, services, vehicles, or environments so as to be usable by people with disabilities](https://en.wikipedia.org/wiki/Accessibility)". It’s a practice wherein we build software that everyone can use with ease, a product that can fit into different kinds of scenarios. 

Now that you have a basic idea of accessibility, let’s move to what I did during my internship.
 
My project was about improving accessibility in JupyterLab which led me to explore the notebook interface too. [JupyterLab](https://jupyter.org/) is an open source web-based application which is widely used to create, edit, view and pretty much do anything with computational notebooks. The interface is popular among students, researchers, data scientists and anyone who has to work with data.
 
## 90 days, 1 goal: Making accessibility a reality

My task of improving accessibility in JupyterLab required me to bind the two. I started off by reading articles and listening to talks. Learning about accessibility widened my thoughts: it’s not people but rather the environment that needs to be fixed.
 
Accessibility is a big road to go down. And accessibility issues can come from a wide diversity of people and abilities. Some of them could be permanent like hearing impairment, low vision, locomotory issues while others could be temporary or situational. To make web content accessible, there are a set of guidelines called [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/). These are standard rules to keep in mind while designing your website. Integrating these will help make content on the web accessible, because of course the web is for all! :)
 
We couldn’t cover all types of accessibility issues in this internship, so we just focused on one corner of WCAG that is [1.4.10 - Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html). This section works specifically for people who have varying abilities in terms of vision. They might need to enlarge their screens or use magnification software.
 
Accessibility guidelines recommend two main features for this group. Your app or website should allow:

- zoom up till 400%
- scroll only in the vertical direction
 
## Challenges

On the journey of making JupyterLab more accessible, we needed to make sure JupyterLab moves parallel to WCAG, the standard guidelines. For this, JupyterLab should support zooming up till 400% and scrolling only in the vertical direction. But, when zooming in JupyterLab to that extent, we ran into issues. Some parts started breaking while others were hard to reach. We tried to identify areas for improvements and worked towards fixing them.
 
## The Issue

The gif below shows one of the issues we encountered. On browser zoom, some sections of the Running Panel disappear if sections above them are expanded. This makes `Language Servers` and `Terminals` impossible to reach at browser zoom. Mainly because there is no way to go down the panel.
 
![](/posts/zoom-a11y-jupyterlab/before.gif)
 
 
## The Fix
 
We tried changing things here and there, and finally, adding a vertical scrollbar to the Running Panel worked!  I was happy, as I am most of the times. :)

This following GIF shows a fix for the issue. After putting a scrollbar in the Running Panel, all sections are reachable even when other sections are expanded. Now, it’s easy to reach the bottom.

![](/posts/zoom-a11y-jupyterlab/after.gif)

The thing about proposing a solution in a massive open-source project is you need to be willing to take critiques. Everyone has an opinion, and it's your job to respect theirs while expressing yours. You also need to be sure that you give enough context and clarity on the issue while being open to better solutions.
 
## Rose, Bud and Thorn 🌹 🌱 🌵

I would like to seal my blog-post with the Rose, Bud and Thorn analogy.
This analogy describes my internship outcomes. Roses are the good things and achievements, bud being the ideas that I want to keep or grow with me, and thorns are the challenges of my internship.
 
🌹 `Rose` - I am glad I could create an impact towards making JupyterLab more accessible. The experience of learning about accessibility gave me a new perspective on the world. It enlightened my thoughts and made me empathic towards the community.
 
🌱 `Bud` - My internship has convinced me that accessibility is fundamental; not just something “nice to have”. I’m excited to include it in my future work! I’ve learnt some amazing things from great people that I wish to share with the world.
 
🌵 `Thorn` -  The thorn of my internship was setting up JupyterLab’s development environment locally. It didn’t like me much and threw a bunch of errors my way. Once it was finally up, it would give new errors.
 
## Words of encouragement

- Collaborate - One of the biggest takeaways from my internship is effective collaboration and that comes with great communication. Asking clarifying questions helps to ensure there are clear expectations from both ends.
- Optimism  - There will be times when things won’t work go your way and to deal with that you need to be optimistic. Don’t lose hope, you got that!
- Perseverance - Rome wasn’t built in a day. Be consistent in your efforts till you make it.
- Faith - When we don't see immediate results of our work, we often doubt ourselves, having faith in such times is crucial.
 
## Acknowledgement

I'd like to express my gratitude to Quansight for offering a wonderful workplace. I am appreciative of the advice and assistance I received from my mentor, Gabriel Fouasnon, throughout the duration of the internship. Additionally, I want to thank Tania, Stephannie and Isabela for all their guidance and support.
 
It was a joy to work with the Jupyter and Quansight communities.
 
## References

- [Improve view of Open Tabs and Kernels on browser zoom #37](https://github.com/Quansight-Labs/jupyterlab-accessible-themes/issues/37)
- [Running Panel sections not accessible at browser zoom #6559](https://github.com/jupyter/notebook/issues/6559)
- [Added scroll to Running Panel #13241](https://github.com/jupyterlab/jupyterlab/pull/13241)
- [Fix cell toolbar layout #13059](https://github.com/jupyterlab/jupyterlab/pull/13059)
- [Cell contents overlap toolbar at narrow width #13115](https://github.com/jupyterlab/jupyterlab/issues/13115)
