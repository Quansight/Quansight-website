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

When I joined Quansight Labs as an intern, I was handed an interesting challenge: help migrate the pyOpenSci website from a multi-platform setup (Jekyll, Sphinx, and Quarto) to a unified Django-based solution. The goal wasn't just to replicate what existed—it was to build a foundation that would support future growth, enable translations, and provide a Python-native environment that aligned with pyOpenSci's mission.

Ten weeks later, we have a working Django site with Wagtail CMS integration, a fully migrated homepage, dynamic data parsing, and a robust blog system. Here's how we got there.

## Why Django?

pyOpenSci's existing website worked, but it was fragmented. Content lived in different places, each with its own build process and quirks. For a Python-focused organization, having a website that couldn't leverage Python's ecosystem felt like a missed opportunity.

Django offered several advantages:

- **Python-native tooling** that the community already knows and loves
- **Wagtail CMS** for flexible content management without losing developer control
- **Built-in i18n support** for future multilingual content
- **A rich ecosystem** for integrations and extensions

The challenge? We needed to prove this could work without disrupting the live site.

## Starting with the Foundation

Every migration needs a solid starting point. After spending time understanding Jekyll, reviewing the existing site architecture, and discussing approaches with my mentors Leah and Carol, we began with the essentials:

**Project Setup:** We chose Django 5.x with Wagtail for CMS capabilities. Since pyOpenSci values modern development practices, we migrated to `uv` for dependency management and locked the project to Python 3.12+. This gave us a reproducible environment right from the start.

**Styling Decisions:** The team debated CSS frameworks—vanilla CSS, Bootstrap, or Tailwind. We settled on Tailwind CSS for its utility-first approach and flexibility, which proved invaluable when translating the existing designs into Django templates.

## Bringing the Homepage to Life

The homepage migration was our first real test. The Jekyll site had a clean, functional design that we needed to preserve while making it dynamic.

The challenge wasn't just aesthetic—it was architectural. The homepage displayed recent contributors and packages, both pulled from YAML files that the community maintained. In Jekyll, this was straightforward. In Django, we needed a system that could:

- Parse YAML files efficiently
- Handle data validation and cleaning
- Display information in a performant way
- Maintain compatibility with the existing data format

We built custom Django template tags to parse contributor and package data. The first iteration used PyYAML, but we switched to `ruamel.yaml` for better maintenance support. We also adopted NumPy-style docstrings to match pyOpenSci's documentation standards.

The result? A homepage that looks like the original but runs on Django, with room to grow.

## Separating Concerns: Blogs and Events

One of the more interesting architectural decisions came when we integrated Wagtail for the blog. Initially, we considered a single "publications" model to handle both blog posts and events. But as we dug deeper, it became clear that blogs and events have different needs.

We created a dedicated publications app with:

- **Separate models** for `BlogPage` and `EventPage`
- **Static index pages** at `/blog/` and `/events/` (no CMS setup needed)
- **URL prefixing** to keep content organized (`/blog/slug/` and `/events/slug/`)
- **Pagination and filtering** by year for better navigation

This separation gave us flexibility. Events could have date-specific logic, while blog posts could focus on content and categories. Both lived in the same app but remained distinct where it mattered.

## The Learning Curve of Testing and CI

If there's one lesson I'll carry forward, it's this: testing is not optional, and CI pipelines are your friend.

We implemented unit tests for data parsing early on, which caught edge cases we hadn't considered. When tests started failing on my mentors' machines but not mine, I learned the hard way about environment consistency—turns out they didn't have the latest version of main.

Setting up GitHub Actions was a revelation. I spent time with Leah learning how CI scripts work, and we created a foundation for automated testing. It's still a work in progress, but having that infrastructure means future contributors can iterate with confidence.

## What's Next?

The foundation is solid, but there's more to do:

- Automating blog post migrations from the Jekyll site
- Expanding test coverage
- Polishing the blog layout and accessibility features
- Exploring Sphinx integration for documentation

The beauty of building with Django is that these next steps are now much more approachable. We're not fighting tooling—we're extending a system designed for growth.

## Reflections

This internship taught me that migration projects are as much about people as they are about code. Every decision—from choosing Tailwind to structuring the blog—involved discussions with mentors, community feedback, and iteration.

I'm grateful to Leah Wasser and Carol Willing for their patience and guidance, to Melissa Mendonça for keeping me on track, and to the pyOpenSci community for being so welcoming. I came in wanting to learn Django; I'm leaving with a deeper appreciation for open source collaboration.

If you're considering a similar migration, here's my advice: start small, test often, and don't be afraid to refactor. The goal isn't perfection—it's progress.
