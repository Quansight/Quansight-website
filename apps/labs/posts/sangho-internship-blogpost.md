---
title: "Sangho's Internship at Quansight"
published: October 6, 2022
author: sangho-lee
description: 'Blogpost of working on the PyTorch-Ignite project during internship at Quansight'
category: [Machine Learning, OSS Experience]
featuredImage:
  src: /posts/sangho-internship-blogpost/sangho1.png
  alt: 'An image of the assigned mentors.'
hero:
  imageSrc: /posts/sangho-internship-blogpost/ignite_logo_mixed.svg
  imageAlt: 'PyTorch-Ignite Logo'
---

Hey, I'm [Sangho Lee], a master's student from Seoul National University.
I have participated to the [PyTorch-Ignite](https://github.com/pytorch/ignite) especially with distibuted computations at Quansight Labs.
First thing I contributed was imprving test code of each metrics computated on DDP (Distributed Data Parallel) config.
Second is modifying all_reduce and all_gather methods to take group arguments

## About PyTorch-Ignite and distributed computations

PyTorch-Ignite is a high-level library to help with training and evaluating neural networks in PyTorch flexibly and transparently.

When you have a large batch of dataset such as training images, or videos then your device can’t afford more than a few datasets then it is natural to use multi-gpu in distributed configuration.

In this case, data is transferred to multiple devices for computations then after calculation, it gathers outputs from each devices.
<img alt="ddp configuration" src="/posts/sangho-blog-post/ddp1.png" />

## How PyTorch-Ignite gathers data

There are two major ways of gathering outputs from each devices, all reduce and all gather
All reduce : Make each device have same values of summation
<img alt="All reduce" src="/posts/sangho-blog-post/allreduce.png" />
All gather : Make each device have same values of list
<img alt="All gather" src="/posts/sangho-blog-post/allgather.png" />


## How I contributed with improving test code in DDP config

Problems : Many test code was not implemented to be tested in distributed data pararall environments

There are 3 checklists to ensure the test code in DDP configuration works.
1) Generate dummy data differently from each device
2) Gather data with idist.all_gather or idist.all_reduce to each device have same data before computing metrics
3) Compare with reference value like results from scikit-learn




## How I contributed with all_reduce and all_gather to take group argument

Problems : Existing methods in ignite uses all devices, however, we want users to choose the rank for gathering the data like the picture.

Distributed part of Ignite is wrapper of different backend like horovod, nccl, gloo and xla.
I added new group method for generating group depends on its backend and modified all_reduce and all_gather to take group arguments for users to select the devices.
<img alt="Code snippets" src="/posts/sangho-blog-post/code1.png" />


### My contributions

<img alt="Contributions with improving test" src="/posts/sangho-blog-post/cont1.png" />
<img alt="Contributions with improving test" src="/posts/sangho-blog-post/cont1.png" />

### What I learned

Last 3 months was really precious time for me as an intern of Quansight.

PS: I want to thank my mentors [Victor Fomin](https://github.com/iameskild) for the teaching and support during the internship.