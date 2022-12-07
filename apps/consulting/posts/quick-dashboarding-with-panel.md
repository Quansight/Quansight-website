---
title: 'Quick Dashboarding With Panel'
published: October 27, 2020
author: dillon-roach
description: 'In this post, we show you how to construct a quick dashboard using Panel & Python without ever leaving the comfort of your Jupyter notebook.'
category: [Data Visualization]
featuredImage:
  src: /posts/quick-dashboarding-with-panel/panellogo4x3.png
  alt: 'Panel logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

A bespoke, polished data science dashboard can be a beautiful thing for anyone
looking to make data-driven decisions. And yet, not every project can afford
setting up elaborate dashboards that cost money and developer time.

In this post, we show you how to construct a quick dashboard using
[Panel][panel site] & Python without ever leaving the comfort of your Jupyter
notebook.

For this example, we want to create a dynamic plot dashboard displaying
historical trends of popular (user-supplied) baby names.

See the [demonstration video][demo video @ storyblok].

While the historical trends of name registrations are not at the forefront of
business decisions, similar name-indexed data queries could involve stock
indexes, product names in your catalog (or a competitor's), or perhaps
predictions of future trends for your named-apparel business.

This baby-name data originally comes from
[the US Social Security open data][us name data]; we have modified it for ease
of use and to off-load some pre-processing needed for the final plots.

For each observation, we have preserved Year, Name, and Gender as features from
the original data. We also have a feature Normalized that represents the
percentage of all names within a given year.

We could add names common to M & F genders—say Dillon (M) & Dillon (F)—but we
leave them distinct here to preserve their individual trends.

We present a random slice of the data below to build intuition.

[demo video @ storyblok]: https://a.storyblok.com/f/147759/x/eb036127d4/panel-dashboard-video.mp4
[panel site]: https://panel.holoviz.org/
[us name data]: https://catalog.data.gov/dataset/baby-names-from-social-security-card-applications-national-level-data
