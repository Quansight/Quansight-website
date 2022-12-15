---
title: 'Spatial Filtering at Scale With Dask and Spatialpandas'
published: October 7, 2020
author: adam-lewis
description: >
  Imagine having a dataset of over 50 TB of compressed geospatial point data stored in flat files, and you want to efficiently filter data in a few ZIP codes for further processing. You can’t even open a dataset that large on a single machine using tools like pandas, so what is the best way to accomplish the filtering? This is exactly the problem one of our clients recently faced.
category: [Scalable Computing, PyData Ecosystem]
featuredImage:
  src: /posts/spatial-filtering-at-scale-with-dask-and-spatialpandas/spacialpandas-img-1.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

Imagine having a dataset of over 50 TB of compressed geospatial point data
stored in flat files, and you want to efficiently filter data in a few ZIP codes
for further processing. You can’t even open a dataset that large on a single
machine using tools like pandas, so what is the best way to accomplish the
filtering? This is exactly the problem one of our clients recently faced.

We addressed this challenge by spatially sorting the data, storing it in a
partitionable binary file format, and parallelizing spatial filtering of the
data all while using only open source tools within the PyData ecosystem on a
commercial cloud platform. This white paper documents the potential solutions
that we considered to address our client’s needs.

![](/posts/spatial-filtering-at-scale-with-dask-and-spatialpandas/spacialpandas-img-1.png)

_Figure 1: Filtering spatial data typically requires a large database to find
only a few results._

_Credits: NASA Earth Observatory images by Joshua Stevens, using Suomi NPP VIIRS
data from Miguel Román, NASA's Goddard Space Flight Center_

## Potential Approaches

Our client was a small startup who needed to avoid large up-front infrastructure
costs. This constrained our approaches to those possible via cloud providers
like AWS, Azure, or GCP. We considered five potential approaches to meet the
client’s needs, one of which employs a relational database, and four that use
the PyData stack.
