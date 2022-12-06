---
title: 'Up and Running With Prefect'
published: August 31, 2021
author: peyton-murray
description: 'There are many types of computations that can be broken down into subtasks. Some of these tasks may be resource-intensive or long-running, and may fail at any time for multiple reasons. Being able to define tasks, chain them together, and monitor execution is a nontrivial part of any modern computational pipeline. However, most researchers, data scientists, and software engineers want to focus on solving big-picture questions without worrying about these kinds of bookkeeping details. In the past decade or so, several task management libraries have attempted to make task tracking easy for the programmer, with Apache Airflow and Luigi being some of the most well known. Here, we will focus on a recent addition, Prefect.'
category: [Optimization]
featuredImage:
  src: /posts/up-and-running-with-prefect/prefect-img-1.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

_Note: This post discusses the 1.x version of Prefect, and not the newer 2.x
series._

There are many types of computations that can be broken down into subtasks. Some
of these tasks may be resource-intensive or long-running, and may fail at any
time for multiple reasons. Being able to define tasks, chain them together, and
monitor execution is a nontrivial part of any modern computational pipeline.
However, most researchers, data scientists, and software engineers want to focus
on solving big-picture questions without worrying about these kinds of
bookkeeping details. In the past decade or so, several task management libraries
have attempted to make task tracking easy for the programmer, with [Apache
Airflow][airflow homepage] and [Luigi][luigi repo] being some of the most well
known. Here, we will focus on a recent addition, [Prefect][prefect repo].

![](/posts/up-and-running-with-prefect/prefect-img-2.png)

## Prefect

Prefect is an open source workflow management library designed to make it simple
for users to keep track of task execution with only minimal changes to their
code. The first public release of Prefect, v0.2.0, was in July of 2018, with the
Prefect team releasing on a regular cadence ever since.
[prefect.io][prefect site], the company behind the Prefect library (also known
as [Prefect Core][prefect site: core] in the official documentation), offers a
cloud-based task management dashboard called
[Prefect Cloud][prefect site: cloud] as their flagship product. By itself, the
Prefect library is [open source][prefect repo] and totally free to use. Today
we'll explore some of Prefect's data structures by building a simple pipeline
from the ground up. Along the way, we'll show how to

- define the _tasks_ (read: functions) that will make up the pipeline
- ... THESE NEED TO BE FILLED IN
- ...
- ...

### Installing Prefect

First we'll need to install prefect; we'll also need [pandas][pandas site] and
[numpy][numpy site]. For example data, we'll make use of the Palmer penguins
dataset:

```bash
pip install prefect prefect[viz] pandas numpy palmerpenguins
```

prefect[viz] is an optional extra which is only needed if you want to generate flow visualizations with graphviz.

## The Example: How much does it cost to ship all of the Palmer penguins🐧?

[airflow homepage]: https://airflow.apache.org/
[luigi repo]: https://github.com/spotify/luigi
[numpy site]: https://numpy.org/
[pandas site]: https://pandas.pydata.org/
[prefect repo]: https://github.com/prefecthq/prefect
[prefect site]: https://www.prefect.io/
[prefect site: cloud]: https://www.prefect.io/cloud/
[prefect site: core]: https://www.prefect.io/core
