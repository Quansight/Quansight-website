---
title: "Sangho's Internship at Quansight with PyTorch-Ignite project"
published: October 6, 2022
author: sangho-lee
description: 'Blogpost of working on the PyTorch-Ignite project during internship at Quansight'
category: [Machine Learning, OSS Experience]
featuredImage:
  src: /posts/sangho-internship-blogpost/sangho1.png
  alt: 'An image of the intern, Sangho.'
hero:
  imageSrc: /posts/sangho-internship-blogpost/ignite_logo_mixed.png
  imageAlt: 'PyTorch-Ignite Logo'
---

Hey, I'm [Sangho Lee], a master's student from Seoul National University.
I have participated to the [PyTorch-Ignite](https://pytorch-ignite.ai/) project especially with distributed computations at Quansight Labs.
First thing I contributed was improvements of the test code for metric computation in Distributed Data Parallel (DDP) configuration.
Second is modifying `all_reduce` and `all_gather` methods to take `group` argument.

## [About PyTorch-Ignite and distributed computations](https://pytorch-ignite.ai/tutorials/advanced/01-collective-communication/)

When you have 1) a larger batch of dataset such as training images or you 2) need to parallelize computations, then it is natural to use multi-gpu in distributed configuration.

PyTorch-Ignite is a high-level library to help with training and evaluating neural networks in PyTorch flexibly and transparently.
PyTorch-Ignite distributed module (IGNITE.DISTRIBUTED) is a helper module to use distributed settings for multiple backends like `nccl`, `gloo`, `mpi`, `xla` and `horovod`
It provides a context manager to simplify the code of distributed configuration setup for all above supported backends.
For example, `auto_model`, `auto_optim` or `auto_dataloader` helps provided model to adapt existing configuration. And `Parallel` helps 
to simplify distributed configuration setup for multiple backends.

When using distributed computation with PyTorch-Ignite, data is transferred to multiple devices for computations then after calculation, it gathers outputs from each devices.
<img alt="ddp configuration" src="/posts/sangho-blog-post/ddp1.png" />

## How PyTorch gathers data

There are two major ways of collecting outputs from each devices, all reduce and all gather
All reduce : Make each device have same values of summation
<img alt="All reduce" src="/posts/sangho-blog-post/allreduce.png" />
All gather : Make each device have same values of list
<img alt="All gather" src="/posts/sangho-blog-post/allgather.png" />


## How I contributed with improving test code in DDP config

Problems : Many test code already implemented did not test correctly for distributed data pararall environments

There are 3 items to be checked to ensure that the test codes for each metric work correctly in DDP configuration.
1) Generate random data differently from each device to check metric from gathered data has different value with metric calculated from each rank.
2) Gather data with [`idist.all_gather`](https://pytorch-ignite.ai/tutorials/advanced/01-collective-communication/#all-gather) or [`idist.all_reduce`](https://pytorch-ignite.ai/tutorials/advanced/01-collective-communication/#all-reduce) to each device have same data before computing metric
3) Compare calculated metric with reference result from scikit-learn




## How I contributed with all_reduce and all_gather to take group argument

Problems : Existing methods in PyTorch-Ignite uses all ranks, however, for certain use-cases users may want to choose a subset of ranks for collecting the data like in the picture.

Distributed part of Ignite is wrapper of different backend like [horovod](https://horovod.ai/), [nccl](https://developer.nvidia.com/nccl), [gloo](https://github.com/facebookincubator/gloo) and [xla](https://github.com/pytorch/xla).
I added new group method for generating group depends on its backend and modified all_reduce and all_gather to take group arguments for users to select the devices.
<img alt="Code snippets" src="/posts/sangho-blog-post/code1.png" />


### My contributions

<img alt="Contributions with improving test" src="/posts/sangho-blog-post/cont1.png" />
<img alt="Contributions with improving test" src="/posts/sangho-blog-post/cont2.png" />

### What I learned

Last 3 months was really precious time for me as an intern of Quansight.

PS: I want to thank my mentors [Victor Fomin](https://github.com/vfdev-5) for the teaching and support during the internship.