---
title: 'Building a Foundation: Migrating pyOpenSci to Django'
authors: [philip-narteh]
published: October 3, 2025
description: 'How we built a modern, Python-native foundation for pyOpenSci website using Django, Wagtail, and Tailwind CSS—from project setup to production-ready features.'
category: [Community, Developer workflows, OSS Experience]
featuredImage:
  src: /posts/migrating-pyopensci-to-django/featured.png
  alt: 'Two hands exchanging a card with the Quansight Labs logo'
hero:
  imageSrc: /posts/migrating-pyopensci-to-django/hero.png
  imageAlt: 'Hand holding a microphone'
---

Hey there, I'm Philip Narteh. I have spent the last three months interning at Quansight PBC, where I have had the incredible opportunity of migrating the pyOpenSci website from Jekyll to Django. If you've ever stared at a codebase and thought, "Where do I even start?" - well, that was me on day one. This blog post is about that journey. It's about learning about tools, meeting brilliant people across Quansight, and discovering that open source is less about the code you write and more about the people you collaborate with along the way, as well as what you learn. The goal isn't perfection. It's **progress.**

So grab a coffee (or tea, or whatever fuels your day), and let me tell you how I have helped build a foundation for pyOpenSci's future - one pull request, and one very patient and helpful mentor at a time.

## The opening: Getting a first look at the Jekyll code

When I first cloned the [pyOpenSci website repository](https://github.com/pyopensci/pyopensci.github.io/), I had a very limited idea of how to navigate it. My project was straightforward on paper - to help create a good foundation to migrate PyOpenSci's website to Django. I began by digging through the codebase to understand the different platforms and different build processes stitched together to make [pyopensci.org](https://www.pyopensci.org/) work.

Melissa Mendonça coordinates this internship program and hosts weekly sync calls with all interns. I had a first call with her to learn more about the internship. She later introduced me to the Quansight community on Slack and to my mentors: Leah Wasser and Carol Willing.

After meeting my mentors, Leah shared [this handbook page](https://www.pyopensci.org/handbook/community/infrastructure/intro.html) to help me understand PyOpenSci's infrastructure. We decided that we will work via small tasks and pull requests so that I can get a good feel for common open-source workflows. My first task was simple but important. I had to spend time understanding the existing Jekyll site. Read the code. Explore how pages are built. Figure out how data flows through the system. I spent my first week doing this.

![The old multi-platform architecture: Jekyll handling the main site, Sphinx managing documentation, and Quarto powering tutorials—all separate systems with their own build processes](/posts/migrating-pyopensci-to-django/jekyll-multi-platform-architecture.png)

During this time, I discovered one of the best parts of working at Quansight - coffee chats. There's a Slack bot called Donut that randomly pairs people in the #coffee-buddies channel every week for casual conversations. My first random pairing was with Agriya, a software engineer at Quansight. This was particularly cool because we are both members of the [Equitech Futures](https://www.equitechfutures.com/) alumni network, and he helped review my application for the internship. These coffee chats quickly became one of my favourite activities at Quansight. Although occasionally I had internet issues, I enjoyed all of my coffee buddies' chats!

## Why Django?

I'm sure you've probably asked yourself, "_Why are we doing this?"_ Why migrate from Jekyll (which works!) to Django?

The answer is about more than just technology. PyOpenSci is all about the scientific Python ecosystem - supporting Python package maintainers, promoting best practices, and building a community around scientific Python. Having a website that couldn't actually _use Python_ felt a bit... ironic.

Django offered something different:

- Python-native tooling that the community already knows and loves
- Wagtail CMS for managing blog and event content without losing developer flexibility
- Built-in i18n support for future multilingual content (a big deal for a global community!)
- A rich ecosystem for integrations, extensions, and future growth.

But here's the thing. We couldn't just rip out the old site and start afresh. The live site at pyopensci.org had to keep working. We needed to build incrementally, especially for a 12-week internship program. In my first technical sync with Leah and Melissa, we mapped out the strategy and decided to start with the project setup. Later, we will get the homepage working and build out the blog system. Finally, we would iterate, iterate, iterate.

## The Great CSS Debate and other foundational decisions

When setting up the Django + Wagtail project, I hit an early decision-making point - which CSS framework should we use? Vanilla CSS? Bootstrap? Tailwind?

Vanilla CSS would give us maximum control but require more manual work. Bootstrap would be quick to set up but harder to customize. Tailwind CSS had a steeper learning curve, but its utility-first approach would give us flexibility. We went with Tailwind, and it was amazing to work with during the internship. When it was time to translate the Jekyll site's designs into Django templates, Tailwind's utility classes made iteration _so much faster_.

We also added support for uv (a modern Python dependency manager) and locked the project to Python 3.12+ after Leah opened a PR for that. That was my first time reviewing an open-source PR. It was very fun for me. In one of our calls, I shared my interest in learning about open source workflows from the maintainer's perspective. Leah and Carol took it upon themselves to teach me a great deal about this and provided the platform for me to practice. I am eternally grateful for all the support.

Around this time, I joined my first QShare, a monthly meeting where Quansight folks present anything they're working on that they'd love to share. I mostly just listened and tried to absorb as much as I could. Everyone was working on such cool stuff.

## YAML parsers, NumPy docstrings, and building the homepage

The homepage migration was my first real technical challenge. The Jekyll site had a clean homepage with some static content and other sections displaying recent contributors and featured Python packages. This dynamic data was pulled from YAML files that the pyOpenSci community maintained. This brought me to the second major decision-making point that I needed to discuss with the community before going forward. I asked the community whether to just read those YAML files from GitHub or implement a more Django-native solution of writing the feature from scratch. We decided to create a foundation for a Django-native solution in the future by including models of the contributor and package data, but the solution we went with, for the internship's sake, just read the data from the GitHub YAML files.

In implementing this, I used PyYAML to parse the YAML files after a quick Google search and AI prompts. However, after some discussion, Leah suggested Ruamel.yaml instead because it's actively maintained and has better support for modern YAML features. Smart call. She told me that she also used PyYAML in the past and had to learn the hard way to always use actively maintained packages. She also taught me how to check to make sure that I am always going with an actively supported package!

We also decided to adopt NumPy-style docstrings to match pyOpenSci's documentation standards after one of my PRs was reviewed. During this time, I learnt a lot about how PyOpenSci operates.

I created a PR for the project foundation and homepage. Later, we started iterating on the contributor and package display logic. Carol joined one of my weekly calls with Leah, and together they taught me about contribution workflows from the _maintainer's perspective_ - what makes a good PR, how to check out a PR, how to review one, and how to merge them cleanly. That was one of the best calls I had with my mentors!

## DjangoCon Africa

During my fourth week, I used up all my paid time off from the internship to attend DjangoCon Africa 2025 in Arusha, Tanzania. It was a milestone moment for me. Not only was this my first open-source conference, but I also gave a talk titled "_Inclusive Coding: My Journey with Django and Accessibility._" Sharing my story on how the Django community and accessibility shaped my open-source journey felt amazing. Seeing people connect with the talk and spark conversations about accessibility in tech was one of the most fulfilling parts of the experience.

The conference was a wonderful blend of learning and connection. There were engaging sessions on Django performance optimization, AI, open-source contributions, and the growing African tech community. I also got to meet incredible developers. One of the highlights for me was getting to meet Sarah Abderemane and Tim Shilling from the Djangonaut Space, in person for the first time. The sense of community and shared purpose was unforgettable.

Outside the conference, I took some time to explore Arusha a bit. Visiting the Arusha Tanzanite Experience and the Cultural Heritage Centre were definite highlights, offering a glimpse into Tanzania's rich artistry and history. I was not able to hop on a safari, but it remains on the bucket list!

By the end of DjangoCon Africa, I felt deeply inspired and proud of myself - I gave my first conference talk! The energy, the people, and the conversations left a lasting impression. I came back with new friendships, ideas, and lessons I'll carry with me for a long time.

## Blogs, events, and the journey to a new site structure

Halfway through this internship, I turned my focus to building out the blog system.

My first instinct was to just follow the structure of the Jekyll site and create a blog app that handles both blog posts and events. However, after one of my calls with Leah. We decided to separate them because the current app was not ideal. She explained to me that, although the Jekyll site works well, it was just "hacked together".

I also realized that blogs and events have _fundamentally different needs_. Events need date/time logic, location information, RSVP tracking, and maybe calendar integration down the line. Blogs need categories, tags, author attribution, SEO-friendly URLs, and even reading time estimates. The possibilities were endless. Trying to cram all of that into a single model would create a mess. Half the fields would be null for blogs, half would be null for events.

I renamed the blog app to "publications" and created separate models for BlogPage and EventPage, both inheriting from Wagtail's page system but staying distinct where it mattered. We set up separate static index pages, clean URL patterns, pagination, and separate templates. It felt good to see the architecture coming together sustainably.

![The new unified Django architecture: one Django application handling everything, with Wagtail managing blog and event content through a clean CMS interface](/posts/migrating-pyopensci-to-django/django-unified-architecture.png)

I also had my first call with Bane Sullivan, a core PyOpenSci community member, to discuss database handling in development. He shared resources on best practices with me, which helped me create some dummy data to help with testing. Super helpful stuff.

## Refinements, and my budding interest in CI

As the core features came together, I shifted focus to polishing and refinement. I included pagination, year filters, and many styling refinements via a PR.

During one of our earlier calls, I told Leah that I would love to learn about continuous integration, and given that pyOpenSci leverages it really well, I could learn a thing or two before the internship ends! Leah then gave me the time to learn about GitHub Actions after having an amazing teaching session where she walked me through some PyOpenSci GitHub Actions configurations in detail. The goal here for me was to create a CI foundation for the website, starting with running tests on commits and eventually writing a GitHub Actions tutorial for pyOpenSci. It was one of my favourite things to work through, and I relished the opportunity to learn and explore.

## Final push and presentations

The final weeks were crunch time. Leah and I had a planning call to discuss priorities. Learning more about CI/CD? Writing documentation? Polishing the blog layout? Trying to automate the Jekyll-to-Django blog post migration?

I ambitiously said I'd try to do all of it. (Spoiler: It was not possible to do everything.) With a week to go, we decided that I would focus on completing the blog and events pages and creating a GitHub Actions foundation for the website.

All interns had a presentation during the September QShare. It was fun to share my work with the general Quansight community and also learn about what my fellow interns have worked on.

I also joined a PyOpenSci packaging workshop for scientists at Stanford and learned about building Python packages - an amazing experience.

## What we built (and what's still to come)

So, what did we actually accomplish?  
✅ A working Django site with Wagtail CMS integration  
✅ A fully migrated homepage with dynamic YAML parsing for contributors and packages  
✅ A blog system with proper separation between blogs and events  
✅ Tailwind CSS styling that follows the design language of the original Jekyll design and pyOpenSci  
✅ Unit tests and the foundation for CI/CD infrastructure  
✅ A sustainable architecture that future contributors can build on

But there's still more to do. We need to automate the blog posts migration from the Jekyll site, polish the sites, make sure they're accessible, and build the other static pages. The beauty of building with Django is that these next steps are _approachable_. I urge you to check out the project and lend a hand if you can find the time.

## Reflections: People, code, and coffee

If there's one thing this internship taught me, it's that migration projects, especially in open source, are as much about people as they are about code. Every decision we made, from choosing Tailwind, structuring the blog, picking YAML parsers, and setting up CI, involved conversations with my mentors and the community.

The Quansight Donut coffee chats were unexpectedly valuable. Talking with Agriya, Klaus, Neil, Evgeni, Paul, Hameer, and Andrew gave me amazing insights on several different topics that I will cherish for life!

I'm incredibly grateful to Leah Wasser and Carol Willing for their patience, guidance, and trust. They didn't just tell me what to do. They taught me _how to think_ about sustainable open source development and set me up to do open source well. I'm also grateful to Melissa Mendonça for keeping the internship program running smoothly and for all the feedback in weekly sync and 1-on-1 calls. This ensured that we all felt supported.

Finally, I'm grateful to the PyOpenSci community and everyone at Quansight for being so welcoming and collaborative. Open source can feel intimidating when you're new, but this community made it feel accessible and fun. I loved it!
