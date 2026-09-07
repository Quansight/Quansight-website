---
title: 'Community-First Open Source: An Action Plan!'
published: June 21, 2024
authors: [dharhas-pothina]
description: 'Quansight CTO Dharhas Pothina is here to discuss an action plan for achieving community-driven open source. What is Community-first Open'
category: [Open Source Software]
featuredImage:
  src: /posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-Thumbnail.png
  alt: 'Community-First Open Source: An Action Plan!'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Community-First Open Source: An Action Plan!'
---

_Quansight CTO Dharhas Pothina is here to discuss an action plan for achieving community-driven open source._

## What is Community-first Open Source?

Most open source software (OSS) projects our readers work on are community-first or community-driven. Today, we will explore the transition from company-backed to community-driven open source, define the two, and explain why we are talking about this right now.

## Company-backed vs. Community-driven

**Company-backed open source** is created or maintained primarily by a single entity or sometimes a small handful of entities. An excellent example of this is [TensorFlow](https://www.tensorflow.org/), which is built and maintained by Google. Although it is open source, Google drives its direction. Nothing is inherently wrong with that, and there are some advantages to being company-backed open source. For example, you have fast iteration cycles because your decision-making process is quick. You don’t have to find consensus, and you can readily get institutional support, dedicate funds, and resources.

**Community-driven open source** is guided, developed, and governed by a community of developers. JupyterLab, NumPy, and similar projects are community-driven. Community-driven open source has many advantages, but it also has disadvantages; it’s just a different flavor of open source.

## Who’s who in the Zoo?

Who’s the ‘community’ in a community-driven open source project? It’s the Enthusiasts, the people who really care about what it’s doing. You also have Users, Advocates, Contributors, Maintainers, and Sustainers. Companies can also be involved in this community, either as contributors or as users. Many companies build their products on top of existing community-driven open source projects and benefit from their communities without necessarily contributing.

Building a contributor community around an open source project has substantial advantages, including long-term sustainability. If a company becomes bored with a project or its priorities shift, a healthy community-backed open source project can keep it going. However, if it’s company-backed open source, the project can die once the funding disappears or priorities change.

Decisions are easier to understand if there’s a healthy community. Decisions are open, changes are documented, and you have a better idea of what’s happening. We often ask how we can get new contributors and nurture the next generation of maintainers for the project. In a community-first open source situation, there is more emphasis on investing in new contributors. In a company-backed OSS project, the company doesn’t care because they will just assign another developer to it. It’s a very different dynamic.

## Community-driven OSS

## Why are we talking about this?

We are talking about this because Quansight recently transitioned a large company-backed open source project called [Nebari](https://www.nebari.dev/) into a community-driven open source project.

We’re also transitioned a second project called [conda-store](https://conda.store/), which helps you manage environments across an organization and solve problems while managing environments at scale. We’ve moved it to the [conda incubator](https://github.com/conda-incubator), now transforming this company-backed open source project into a community-driven open source project.

Because of these recent conversions, we’re well-positioned to discuss this process. In this article, we highlight a roadmap you can use to take a project you have been driving as a company or an organization and move it to a community-first model.

**Nebari**, the project we’re talking about, used to be called QHub (for Quansight Hub). It was a Quansight spin on [JupyterHub](https://jupyter.org/hub). A way to think about it is as a distribution of JupyterHub that you can install in about 30 minutes on any cloud you want. It includes all the tools you need for the [Pangeo Stack](https://pangeo.io/quickstart.html) or a lot of other stacks.

We built it because our clients needed it and discovered it solves a community-wide problem. We started talking to the community, particularly with the JupyterHub core maintainers, and we had discussions with other companies in the field trying to do similar things. The fact that it was so closely associated with Quansight encouraged people to partner with us to solve the issue of installing infrastructure in the cloud quickly and easily. That’s when we decided to make it a community-focused project where other people would be comfortable partnering with us to improve the ecosystem for deploying scientific tools in the cloud.

We first considered changing QHub to another name; let’s just call it ‘something-else-Hub,’ right? For those who don’t know, Nebari means ‘the roots of a bonsai tree.’ We liked the symmetry; this is the root infrastructure you could build other stuff on top of. So, that’s where we got the name. However, this process is more than just changing the name; it’s changing an attitude and a way of thinking. We took a relatively reasonable step-by-step process. We started with: _What are our guiding principles?_

![This image shows a user interface for a software application focused on user personas. The left side of the image displays a grid of 10 simplified, black and white avatar illustrations representing different user personas. Each avatar has a unique appearance and is accompanied by text, describing their role or characteristics. The right side of the image shows a detailed view of one selected persona. It includes a larger version of one of the avatars and sections for "Story," "Tools they need to do their job," "Pain points or biggest challenges," and "Core needs." These sections contain bullet points with specific details about the selected persona.](/posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-2.png)

## Our Guiding Principles

## Defining User Personas and Journeys

- Who are your existing users?
- Who should, could, and would be new users?
- What do they care about, based on what we see in the issue tracker?

Nebari is an infrastructure project. It’s doing two things:

1. It makes infrastructure easy to deploy and maintain.
2. It provides tools for end users (like JupyterHub, Dask, and scikit-learn).

We discovered we had two sets of personas, so we tried to map out who all our personas were and write stories about what they would want and need.

![Three key concepts displayed in a horizontal layout, each preceded by a purple right-pointing chevron and yellow dash. The concepts are: "Accessibility and inclusion", "Vendor-agnostic development", and "Security best practices". The text is in black on a white background.](/posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-3.png)

## Core Values

We also have our core values. Not all personas want the things we are targeting. We asked, ‘How would we expect our community to contribute and collaborate?’ With the answer to that, we came up with a set of core values.

One of the biggest ones for us was Accessibility and Inclusion. We wanted anyone to be welcome to use the tools we’re building and participate in or contribute to them.

Another core value is that we wanted to be Vendor-agnostic. Since we’re infrastructure, there are things we can do easier if we say we’re AWS or GCP only, but we made a very explicit decision that we wanted this to be able to run in as many contexts and places as possible. That means more work for us in some places, but it’s a core principle of the platform.

We also wanted to be Security-first. When someone installs JupyterHub or our other tools, our target audience may need to learn more about the cloud, so we need to be able to take care of their security.

![Product vision board for a data science platform. Displays sections: Vision, Target group, Needs, Product, and Business/Community goals. Includes details on users (data scientists, ML engineers), features (flexible environment, open-source tools), and goals (community-driven, open-source project). Dark background with white and blue text. Structured layout presents a comprehensive overview of the product's purpose, target audience, and objectives.](/posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-4.png)

## Vision Board

By putting the core values and the personas together, we can start working out our vision:

- Who are we targeting?
- What are we doing?
- What is the product going to have?

## Project Management Foundations

We now have some ideas and a framework; we know what to do and our vision of what we’re building. The next question is how we will do this on the project management side.

## License

_What license will you choose for all your work?_ Consider the licenses of what’s coming upstream or downstream:

- Where are we getting packages?
- Where is our stuff being used?

Deciding on a license for Nebari was easy for us. The code was already a [BSD 3-Clause “New” or “Revised” License](https://github.com/nebari-dev/nebari/blob/develop/LICENSE); we’re comfortable with that. Other Open Source Licenses and Source Available licenses have different implications for the community and commercial usage of the library. It’s not great when you make a license change for a mature product with significant uptake because your community feels like you’ve yanked them around. Having that discussion before is very useful.

## Code of Conduct: Policy and Enforcement Strategy

_How will you treat people, and will people know how they will be treated?_ A code of conduct requires a policy and enforcement.

We had an advantage because we had already done a fair amount of code of conduct work. Quansight sponsors many Open Source projects, including ones we own and ones where we partner with the community. We already had a code of conduct under which QHub was covered at Quansight. As we moved to a new organizational structure, we had to ask, ‘How will enforcement work?’

Here is a good list of codes of conduct out there that you can use to pull from and customize and build one for yourself:

- [Contributor Covenant](https://www.contributor-covenant.org/)
- [GitHub’s Open Source Guide](https://opensource.guide/code-of-conduct/)
- [SciPy’s CoC](https://docs.scipy.org/doc/scipy/dev/conduct/code_of_conduct.html)
- [Turing Way’s CoC (derived from Carpentries)](https://the-turing-way.netlify.app/community-handbook/coc.html)
- [Mozilla’s consequence ladder](https://github.com/mozilla/inclusion/blob/master/code-of-conduct-enforcement/consequence-ladder.md)

We use a two-person enforcement committee, as a code of conduct only makes sense with some enforcement.

![Two website screenshots side by side. Left: "QHUB - DEMONSTRATION" page for an autoscaling compute environment on cloud, with a sign-in button. Right: "Nebari - Quansight" page showcasing a data science platform on Google Cloud, featuring benefits like "100% open", "Batteries included", and "Customizable". An arrow connects the two. The layout presents a before-and-after or alternative solution scenario.](/posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-5.png)

## Message and Brand

We have a vision and want to tell people what we’re doing, why we’re doing it, and why they should be part of our community and use or contribute to our software. The color schemes you see in this post came from this tagline, message, and brand discussion, so we spent quite some time there.

Above, to the left, is our old QHub brand, and above, to the right, is what our new Nebari webpage looks like. We have improved our messaging, and as we understand more about what we’re building, we’re evolving this messaging.

## Repository Management

We then had to review the repository and consider how to keep it. How would we organize the different pieces of our project and make it clear to outside contributors? Where are we going to host it? We chose to use GitHub, which has a main repository for the code and a separate documentation repository. We had to think through all that and come up with templates, issue templates, and labeling. We needed to know how we would give people an easy-to-understand system.

We also set up a [.github project](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) with all the core items, like our code of conduct and license, automatically applied to all projects. We were trying to make the barrier of entry for newcomers as low as possible. Nothing we’re doing here will bring you a community. They will, however, lower the barrier for you to build a community.

## Communication Channels

Where should people go when they have a question? Is there going to be a Discourse forum? Is it going to be GitHub discussions? Deciding all those things, setting it up, and making it clear whether that’s going to happen was a key part of this process. Especially since this was a company-backed project, where all discussions and development happened in our internal Slack, in private, and sometimes in private GitHub repos. We can’t have internal-only meetings; we now have to have open meetings, and we have to have a place where the meeting notes are kept public. We have bi-weekly community meetings and post when those meetings are. We eventually decided to use GitHub discussions to keep everything in one place. Having those decisions about what those channels for communication are is very important.

## Governance

Then, what is the process of making design, development, and management decisions?

We had to come up with a process for decision-making. Previously, we were company-backed. Being a community-driven or community-first project means the community needs to have its ‘voice’ heard. If they want to build a new feature, how does that happen? Deciding what that governance structure will be (there are some really good books and [resources](https://opensource.guide/leadership-and-governance/) on different open source governance structures), deciding which one your project will do, and how you will transition to that, especially if you’re still a company-back project where the decisions made are a certain way, means moving to a place where the community’s voice is heard and acted on.

![This image shows two sections of a project management interface. On the left is a form titled "RD - Title" with fields for status, dates, and sections like Summary, User Benefit, and Design Proposal. On the right is a list of team roles in the "nsbain-dev organization" including Contributors, Design, Documentation, and Maintainers, each with associated user avatars indicating team members assigned to those roles.](/posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-6.png)

We have different teams focused on various areas within the Nebari community: a documentation team, a contributors team, and a maintainers team. We were also very clear that there are pathways for non-code contributors because code contributors are not the only ones who make a project successful.

## Enable Contributions

Then, we have to enable contributions. Part of that is having a roadmap, having a release pattern (and explaining to people how that works), having contributor guidelines and pathways, and improving documentation. We’ve made a lot of progress in the last year, and we are continually trying to make it easier for people to come into the community and for us to work with partners.

## Roadmap and Releases

What are our short-term and long-term priorities? These change over time, especially since this is an active product still used internally in the company and for our clients. We drive a lot of product development right now, but people understanding the priority of the project helps them decide how they can contribute and invites them to contribute.

## Contributor Guidelines and Paths

We need documentation, paths, and descriptions of how people can get involved with us. Some of that is code. There is a lot of documentation for low/no-code contributors, demonstrations, examples, and case studies. We’re open to any contributor, not just those who can write code to deploy things on Kubernetes.

Documentation on how developers can set up and develop environments might not attract new contributors, but it helps lower the barrier when people are interested.

## Maintainers & Sustainer Documentation

_How do we onboard new maintainers? Someone starts contributing; what is the process for someone new to the community to become a contributor and, eventually, a maintainer?_ Lots of projects do this very well. Make sure you copy those things and have them written down so even your internal folks know what they are; this is especially important since we’re moving from old to new habits, and we need everyone to be clear about the new habits, even internally.

For Nebari, we chose a truly open model. Over time, any contributor can become a maintainer and help drive project decisions; this is what we mean by community-first open source.

## Reminding Your Community About New Processes

We developed this open source project for roughly two years inside Quansight before deciding to move to a community-first OSS model. We had two years of bad habits of not talking to people when we make decisions. We have two years of bad habits of talking in our internal Slack, not our external GitHub discussions Channel. Both your external and internal communities must have continuous reminders to stop talking in private and communicate in a GitHub issue or talk about it at the community meeting.

Those habits get built over time, so expect this to be a process. Expect this to take time, and make changes or pivots along the way. These will evolve as your community grows. Some of the procedures and ideas we use will change over time as we move to a different organization size.

Transitioning to a community-driven open source model requires a clear vision, defined values, and a solid governance structure. By sharing our roadmap, we hope that others can navigate this transition successfully. While challenging, the long-term benefits for the community and the project outweigh the effort.

![Thank You! Guiding User Journeys principles Core values Vision board Project management foundations License and CoC Message and brand Repository management Communication channels Governance Enable contributions Roadmap and releases Contributor & maintainer guidelines.](/posts/community-first-open-source-an-action-plan/Community-First-OS-Dharhas-7.png)

## Acknowledgements:

I gave this as a talk at SciPy 2023 on behalf of my colleague Pavithra Eswaramoorthy. **Pavithra** is a DevRel at **Quansight** and also one of the **Bokeh** maintainers. She did most of the research on this article, and I want to clarify that she deserves the credit.

You can see the entire talk, plus the Q&A, below.

There is also a companion talk by Pavithra Eswaramoorthy at the PyCon Maintainers Summit you can view [HERE](https://www.youtube.com/watch?v=yUrj6z8eGAo).

## Who am I?

My name is Dharhas Pothina. My original background is in computational fluid dynamics. Now, I help run Quansight, a consulting company where we have a lot of open source maintainers. We help companies solve problems using the Open Source PyData/Scientific Python Stack.

If you’re a data science team looking to streamline workflows, improve collaboration, and enhance your projects, consider **Quansight** your go-to solution. To learn more about Nebari, conda-store, or our general consulting capabilities, contact us at [connect@quansight.com](mailto:connect@quansight.com).

[Watch the video](https://www.youtube.com/watch?v=b0dLwIxP004)
