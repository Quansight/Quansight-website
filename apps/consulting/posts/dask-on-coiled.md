---
title: 'Dask on Coiled'
published: August 5, 2021
author: amit-kumar
description: 'In this blog post, we will talk about a case study of utilizing Dask to speed up a particular computation and will scale that with the help of Coiled.'
category: [Scalable Computing]
featuredImage:
  src: /posts/dask-on-coiled/daskoncoiled-1.png
  alt: 'Dask and Coiled logos'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

In this blog post, we will talk about a case study of utilizing Dask to speed up
a particular computation and will scale that with the help of Coiled.

# What is Dask?

Dask is an open-source parallel computing library written in Python. One of the
most useful features of Dask is that you can use the same code for computations
on one machine or clusters of distributed machines. Traditionally making the
transition from a single machine to running the same computation on a
distributed computing cluster has been very difficult in the PyData ecosystem
without Dask.

![](/posts/dask-on-coiled/daskoncoiled-img-2.png)
