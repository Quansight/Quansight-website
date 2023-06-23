---
title: 'Documentation as a way to build Community'
published: March 14, 2020
author: [melissa-mendonca]
description: 'Having official high-level documentation written using up-to-date content and techniques will certainly mean more users (and developers/contributors) are involved in the NumPy community. So, if everybody agrees on its importance, why is it so hard to write good documentation?'
category: [Community, Developer workflows, OSS Experience]
featuredImage:
  src: /posts/documentation-as-a-way-to-build-community/blog_feature_org.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/documentation-as-a-way-to-build-community/blog_hero_org.svg
  imageAlt: 'An illustration of a light brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

As a long time user and participant in open source communities, I've always known that documentation is far from being a solved problem. At least, that's the impression we get from many developers: "writing docs is boring"; "it's a chore, nobody likes to do it". I have come to realize I'm one of those rare people who likes to write both code and documentation. 

Nobody will argue against documentation. It is clear that for an open-source software project, documentation is the public face of the project. The docs influence how people interact with the software and with the community. It sets the tone about inclusiveness, how people communicate and what users and contributors can do. Looking at the results of a “NumPy Tutorial” search on any search engine also gives an idea of the demand for this kind of content - it is possible to find documentation about how to read the NumPy documentation!

I've started working at Quansight in January, and I have started doing work related to the [NumPy CZI Grant](https://labs.quansight.org/blog/2019/11/numpy-openblas-CZI-grant/). As a former professor in mathematics, this seemed like an interesting project both because of its potential impact on the NumPy (and larger) community and because of its relevance to me, as I love writing educational material and documentation. Having official high-level documentation written using up-to-date content and techniques will certainly mean more users (and developers/contributors) are involved in the NumPy community.

So, if everybody agrees on its importance, why is it so hard to write good documentation?

## Why do we lack documentation?

In a recent article about documentation for open source data analytics libraries, [Geiger et al.](https://doi.org/10.1007/s10606-018-9333-1) point out that "In a [2017 GitHub survey](https://opensourcesurvey.org/2017/) of OSS contributors, 93% reported that *incomplete or outdated documentation is a pervasive problem* but *60% of contributors say they rarely or never contribute to documentation* (Zlotnick et al. 2017)." At the same time, still in the words of Geiger et al., "Many interviewees who regularly contribute documentation to such projects stated that they did not feel like they received same levels of positive community feedback for documentation work as they did for adding new features or fixing bugs." The authors in this paper go as far as saying that documentation is the *invisible work* behind these projects. 

It doesn't help that many of these projects have been around for some time and have developed in decentralized, community-based ways. This is both positive and negative since it leaves the choice of the type of contribution to the new contributor. Most of the time, people who arrive want to make a big impact, and they perceive implementing a new feature or solving a pending bug, not writing documentation, as the way to do that.

Coming from an academic background, the same kind of dynamics seems to apply. Writing a paper or doing an experiment is far more appealing than writing a textbook or developing high-quality educational materials. But educational materials can have a huge impact and effectively bring people into the community. For me, realizing this was a turning point on the way I looked at documentation. 

## Who writes the docs?

If we look at proprietary or company-backed software projects, often professional technical writers are working on the docs. Having access to these professionals to do the documentation can make a huge difference. However, even then there can be problems. In her excellent talk ["Who Writes the Docs?"](https://www.youtube.com/watch?v=eOC6rsizIvM), Beth Aitman says *People who work on docs often don't feel like their work is valued (...) Being in a position where your value is questioned is pretty horrible.*

As I got more involved in the open source world, I realized that the people writing docs were not only invisible but were sometimes actively discouraged. There is even a differentiation in naming such contributions; have you ever heard of a "core docs developer"? [Rich Bowen says](https://opensource.com/business/15/5/write-better-docs) *There's common wisdom in the open source world: Everybody knows that the documentation is awful, that nobody wants to write it, and that this is just the way things are. But the truth is that there are lots of people who want to write the docs. We just make it too hard for them to participate. So they write articles on Stack Overflow, on their blogs, and third-party forums. Although this can be good, it's also a great way for worst-practice solutions to bloom and gain momentum. Embracing these people and making them part of the official documentation effort for your project has many advantages.*

Even when the community is welcoming, documentation is often seen as a "good first issue", meaning that the docs end up being written by the least experienced contributors in the community. This can have its advantages, as it may give voice to the users who are experiencing difficulties, improving the communication between the projects and its community. However, it may transfer the responsibility of one of the most crucial aspects of any project to novice users, who have neither the knowledge or the experience to make decisions about it.

## What can we do about it?

So if expert users and developers are too busy to write docs, or just don't want to, how can we address this problem? 

As much as the culture is changing, and many people are talking about the importance of documentation, we still have [technical debt](https://en.wikipedia.org/wiki/Technical_debt) related to projects that have been around for a while. This is not something we can overlook: having good documentation is the difference between being successful or not in solving our users' (and clients') problems. Furthermore, it is also crucial if we aim to improve reproducibility and transparency issues in science and data analytics.

In this sense, grants like the one NumPy just received are extremely important to create momentum around documentation and reshape the community into one that values those contributions. 

### Short and long-term goals

As part of our work related to the CZI grant, we have submitted a [NumPy Enhancement Proposal (NEP)](https://numpy.org/neps/nep-0044-restructuring-numpy-docs.html) that proposes a restructure the NumPy documentation, to make it more organized and discoverable for beginners and experienced users. 

In practical terms, we propose reorganizing the docs into the four categories mentioned in Daniele Procida's article ["What nobody tells you about documentation"](https://www.divio.com/blog/documentation), namely Tutorials, How-Tos, Reference Guide and Explanations. We believe that this will have several consequences:

- Improving on the quality and discoverability of the documentation as a whole;
- Showing a clearer difference between documentation aimed at different users (novices vs. experts, for example)
- Giving users more opportunities to contribute, generating content that can be shared directly on NumPy's official documentation
- Building a documentation team as a first-class team in the project, which helps create an explicit role as *documentation creator*. This helps people better identify how they can contribute beyond code.
- Diversifying our contributor base, allowing people from different levels of expertise and different life experiences to contribute. This is also extremely important so that we have a better understanding of our community and can be accessible, unbiased and welcoming to all people.

In the long term, having a process set up that can onboard new contributors and make sure they have the tools and environment they need to contribute can significantly improve the quality of our projects and broaden our contributors/maintainers base.

## Conclusion

Documentation is much more than a complement to code. It is education, it is community building, and it is how we can make sure the project is healthy and sustainable.

