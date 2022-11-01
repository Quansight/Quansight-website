---
title: 'Quansight Labs Dask Update'
published: August 27, 2019
author: james-bourbeau
description: 'Through a community work order (CWO) with the D. E. Shaw group, the Quansight Labs team has been able to dedicate developer time towards bug fixes and feature requests for Dask.'
category: [PyData ecosystem]
  src: /posts/labs-dask-update/blog_feature_var2.svg
  alt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
hero:
  imageSrc: /posts/labs-dask-update/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
---

This post provides an update on some recent [Dask](https://dask.org/)-related activities the Quansight Labs team has been working on.

## Dask community work order

Through a community work order (CWO) with [the D. E. Shaw group](https://www.deshaw.com/), the Quansight Labs team has been able to dedicate developer time towards bug fixes and feature requests for Dask. This work has touched on several portions of the Dask codebase, but generally have centered around using [Dask Arrays](https://docs.dask.org/en/latest/array.html) with the [distributed scheduler](https://distributed.dask.org/en/latest/).For instance, performance improvement in how Dask handles large graphs were made in [`dask` PR #4918](https://github.com/dask/dask/pull/4918) and [`distributed` PR #2594](https://github.com/dask/distributed/pull/2594), while several Dask Array bug fixes and support for asymmetric overlapping computations were included in [`dask` PR #5256](https://github.com/dask/dask/pull/5256), [`dask` PR #5151](https://github.com/dask/dask/pull/5151), and [`dask` PR #4863](https://github.com/dask/dask/pull/4863).

This CWO approach allows institutions, in this case the D. E. Shaw group, to fund development in community-driven open source projects while still respecting how these projects make decisions. To learn more about funding projects through CWOs, check out [this post](http://labs.quansight.org/blog/2019/05/community-driven-opensource-funded-development/) by Ralf Gommers which discusses the CWO model in detail.

## Conferences

In addition to working on Dask directly, we've also been engaging the broader scientific Python community through attending conferences. In particular, developers at Quansight, Anaconda, and NVIDIA organized a Dask sprint at the SciPy 2019 conference. Throughout the two-day sprint, core developers were able to help sprint attendees become more familiar with the Dask codebase, set up local development environments, and even get new pull requests from sprinters submitted, reviewed, and merged into Dask! I personally had a great time at SciPy and hope to see lots of familiar faces again next year.

Likewise, in July I spoke about Dask at the Data-Driven Wisconsin 2019 conference. Following my talk, I had several engaging discussions with other conference attendees and it was really gratifying to see all the enthusiasm surrounding Dask. The materials presented at the talk can be found [on GitHub](https://github.com/jrbourbeau/ddw-dask) and a live, interactive version is available [on mybinder.org](https://mybinder.org/v2/gh/jrbourbeau/ddw-dask/master?urlpath=lab/tree/ddw-dask.ipynb).

## Maintenance and development

Finally, there's been a push for a more coordinated effort towards project maintenance and development by core Dask maintainers at Quansight, Anaconda, and NVIDIA. As part of this effort, we spend a portion of our work week on day-to-day project maintenance tasks (e.g. responding on issues, reviewing pull requests, fixing CI systems, etc.) as well as working on contributions that require significant amounts of time or expertise to implement (e.g. large-scale refactoring, adding new features, writing documentation, etc.). Today, Dask users typically get a quicker response from a core maintainer when opening an issue or pull request, in part, because of these efforts. I, and perhaps other core maintainers, hope to write more about this process in the future.
