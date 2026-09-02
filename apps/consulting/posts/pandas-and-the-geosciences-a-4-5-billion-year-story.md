---
title: 'Pandas and the Geosciences: A 4.5 Billion Year Story'
published: June 26, 2023
authors: [quansight]
description: 'How Quansight and the University of Southern California joined forces to make Pandas available for use in the paleogeosciences by implementing a community-requested feature dating back to 2014.'
category: [PyData Ecosystem]
featuredImage:
  src: /posts/pandas-and-the-geosciences-a-4-5-billion-year-story/Pandas-And-The-Geosciences.jpg
  alt: 'Pandas and the Geosciences: A 4.5 Billion Year Story'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Pandas and the Geosciences: A 4.5 Billion Year Story'
---

![Image of the USC logo](/posts/pandas-and-the-geosciences-a-4-5-billion-year-story/USC-logo-200x113.png)

![Image of the Quansight logo](/posts/pandas-and-the-geosciences-a-4-5-billion-year-story/Quansight-logo-cropped.svg)

# **How Quansight and the University of Southern California joined forces to make Pandas available for use in the paleogeosciences by implementing a community-requested feature dating back to 2014.**

When it comes to time series analysis, Pandas is pervasive in the PyData ecosystem. One of its core features is the ability to work with time series data, and it provides powerful tools including resampling, rolling window calculations, time-based grouping, time shifting, and more.

However, until recently, Pandas was almost completely unusable in the paleogeosciences—or for _anyone_ doing time series data analysis on dates outside of 1678 AD and 2262 AD—due to a number of challenges around deep time across Earth’s history and the conventional uses of time scales in the geosciences.

This is because long ago, Pandas hardcoded nanoseconds as the base unit of time, limiting the timescales it can represent on a 64-bit machine to a relatively narrow timespan of 585 years, thus excluding many paleogeoscience applications.

An issue originally raised by the community [back in 2014](https://github.com/pandas-dev/pandas/issues/7307), the discrepancy was a long-time barrier for researchers in the paleogeosciences at University of Southern California (USC).

This is what our recent partnership with USC set out to fix.

**Note**: This is a companion post summarizing a recent blog by Quansight’s lead engineer, Kim Pevey, on USC’s Medium page. For greater technical detail, [check out that post](https://medium.com/cyberpaleo/pandas-and-the-geosciences-a-4-5-billion-year-story-66af9f565a4b).

### **A Collaboration Funded Through a Grant by the National Science Foundation**

Various communities have needed this feature in Pandas for years, but there were a number of limitations that delayed the effort, including finding the person-hours to take on this heavy-lift of a project and the need for sufficient funding to drive it forward.

However that changed in 2021. Through an NSF EarthCube grant ([RISE-2126510](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2126510&HistoricalAwards=false)), the University of Southern California, in collaboration with Quansight, was awarded funds to do the work to add support for non-nanosecond-resolution datetimes in Pandas

### **2.0. 10 Years and 40,000 Issues Later**

Quansight has several Pandas maintainers on staff who dedicate significant time to maintaining and enhancing the project. This, paired with deep connections within the open source community, allowed us to effectively approach the long standing issue, and ultimately bridge the gap between the needs of USC and the priorities of the Pandas project.

“_Strange though it may sound to code developers, it had never occurred to computational scientists like ourselves that it would be possible to contract professionals to get a difficult coding job done. You see, academics are so used to doing everything by themselves: the research, teaching, service and mentoring, of course, but also the team management, group psychology, budget management, writing, editing, website building, social media outreach, community outreach, and, for some of us, coding._” **Julien Emile-Geay, Professor of Climate Science, USC.**

### **Pyleoclim, Quansight’s Solutions, and What the Pandas Updates Mean for the Geosciences**

Geologists examine time over various scales and with numerous geochronological techniques. These kinds of datasets have incompatibilities with Pandas that have made it difficult for paleogeoscientists to use this important library.

[Pyleoclim](https://pyleoclim-util.readthedocs.io/en/latest/), a Python package designed for the analysis of paleoclimate data that is maintained by USC researchers, is a leading library for analyzing and visualizing paleo datasets. In this library, the USC team has already tackled some of these unique challenges, including:

- Time is often represented as positive towards the past to describe the _age_ of an event (e.g., 10 million years ago), whereas Pandas uses the conventional approach of time increasing toward the future.
- Ages are typically reported as time before a reference date, or _epoch_, which depends on the dating technique used. For example, 1950 is the reference date usually used for radiocarbon dating. Pandas does not natively handle these conventions for the _direction_ of time.
- Time scales are often unevenly-spaced (i.e., the amount of time in a day varies over Earth’s history).

However, there was one challenge that still excluded Pandas from usage within the paleogeoscience communities, even with the help of Pyleoclim: the nanosecond as the base time unit. Quansight worked to make this major upgrade to Pandas, which touched many parts of the Pandas codebase. Our work has resulted in Pandas support for time resolutions as coarse as one second, which can then represent timescales from days to billions of years.

Additionally, USC and Quansight worked to implement key elements of the Pyleoclim Python library to leverage these new features. In addition to the new long-timeframe capabilities, Quansight helped to improve the handling of _age_, _direction_, and _epoch_ within Pyleoclim.

This work is now available in [Pandas 2.0](https://pandas.pydata.org/docs/dev/whatsnew/v2.0.0.html) and [Pyleoclim 0.12](https://pypi.org/project/pyleoclim/). And although there’s still work to be done, we can now represent datetimes hundreds of billions of years into the past or future.

“_A colleague from the pangeo community opened up the sky for us when they recommended Quansight do the hard work of updating Pandas so it could allow non-nanosecond time resolution, which is crucial to our field (paleoclimatology). We were pleasantly surprised when the reviews of our proposal to the National Science Foundation expressed great support for this collaboration, which helped get the project funded._

_One would have had to wait an astronomical number of nanoseconds for us to complete this colossal job by ourselves! We’re so glad Quansight stepped in and made this long-awaited improvement to the Pandas codebase, and put it at our community’s fingertips via integration into our flagship Python package, Pyleoclim._” **Julien Emile-Geay, Professor of Climate Science, USC**

To learn about this project in greater technical detail, [check out the Medium blog post by Kim Pevey, Quansight’s lead engineer](https://medium.com/cyberpaleo/pandas-and-the-geosciences-a-4-5-billion-year-story-66af9f565a4b).

To speak to an expert at Quansight about consulting work for your business or for an academic proposal, reach out to: [connect@quansight.com](mailto:connect@quansight.com).
