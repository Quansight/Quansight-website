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
I have participated in the [PyTorch-Ignite](https://pytorch-ignite.ai/) project internship at Quansight Labs working on test code improvements and features for distributed computations.
First part of my contributions is improvements of the test code for metric computation in Distributed Data Parallel (DDP) configuration.
Then I worked on adding `group` argument to `all_reduce` and `all_gather` methods in [`ignite.distributed`](https://pytorch.org/ignite/distributed.html) module.

## [About PyTorch-Ignite and distributed computations](https://pytorch-ignite.ai/tutorials/advanced/01-collective-communication/)

When you train a batch of dataset larger than your machine's capacity, then you need to parallelize computations.
In this situation, Distributed Data-Parallel training is a widely adopted when training in distributed configuration with `PyTorch`. 
With DDP, the model is replicated on every process, and every model replica will be fed with a different set of input data samples.

PyTorch-Ignite is a high-level library to help with training and evaluating neural networks in PyTorch flexibly and transparently.
Hence, PyTorch-Ignite supports distributed computations with PyTorch-Ignite distributed module.
PyTorch-Ignite distributed module (`ignite.distributed`) is a helper module to use distributed settings for multiple backends like `nccl`, `gloo`, `mpi`, `xla` and `horovod`.

![idist configuration](/posts/sangho-internship-blogpost/ddp0.png)

By simply designating the current backend, `ignite.distributed` provides a context manager to simplify the code of distributed configuration setup for all above supported backends. And it also provides methods for using existing configuration from each backend.
For example, `auto_model`, `auto_optim` or `auto_dataloader` helps provided model to adapt existing configuration and `Parallel` helps 
to simplify distributed configuration setup for multiple backends.


## How I contributed with improving test code in DDP config

Problem : test code for metrics computation has incorrectly implemented correctness checks in distributed configuration

There are 3 items to be checked to ensure that the test code for each metric works correctly in DDP configuration.
1) Generate random input data on each rank and make sure it is different on each rank. This input data is used to compute metric value with ignite.
2) Gather data with [`idist.all_gather`](https://pytorch-ignite.ai/tutorials/advanced/01-collective-communication/#all-gather) on each rank such that they have same data before computing reference metric
3) Compare computed metric value with the reference value (e.g. computed with scikit-learn)




## How I contributed new feature: `group` argument to `all_reduce` and `all_gather` methods

Problem : Existing methods in PyTorch-Ignite uses all ranks, however, for certain use-cases users may want to choose a subset of ranks for collecting the data like in the picture.

Distributed part of Ignite is wrapper of different backend like [horovod](https://horovod.ai/), [nccl](https://developer.nvidia.com/nccl), [gloo](https://github.com/facebookincubator/gloo) and [xla](https://github.com/pytorch/xla).
I added new group method for generating group depends on its backend and modified all_reduce and all_gather to take group arguments for users to select the devices.
![Code snippets](/posts/sangho-internship-blogpost/code1.png)


### My contributions

![Contributions with improving test](/posts/sangho-internship-blogpost/cont1.png)
![Contributions with improving test](/posts/sangho-internship-blogpost/cont2.png)

### What I learned

Last 3 months was really precious time for me as an intern of Quansight.

PS: I want to thank my mentor [Victor Fomin](https://github.com/vfdev-5) for the teaching and support during the internship.