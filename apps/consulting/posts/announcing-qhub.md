---
title: 'Announcing QHub'
published: October 14, 2020
author: dharhas
description: 'Today, we are announcing the release of QHub, a new open source project from Quansight that enables teams to build and maintain a cost-effective and scalable compute/data science platform in the cloud or on-premises. QHub can be deployed with minimal in-house DevOps experience.'
category: [Scalable Computing]
featuredImage:
  src: /posts/announcing-qhub/qhub-thumbnail.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

**Today, we are announcing the release of QHub, a new open source project from
Quansight that enables teams to build and maintain a cost-effective and scalable
compute/data science platform in the cloud or on-premises. QHub can be deployed
with minimal in-house DevOps experience.**

See our [video demonstration][demo video].

## Flexible, Accessible, and Scalable

Deploying and maintaining a scalable computational platform in the cloud is
difficult. There is a critical need in organizations for a shared compute
platform that is flexible, accessible, and scalable. JupyterHub is an excellent
platform for shared computational environments and Dask enables researchers to
scale computations beyond the limits of their local machines. However, deploying
and maintaining a scalable cluster for teams with Dask on JupyterHub is a fairly
difficult task. QHub is designed to solve this problem without charging a large
premium over infrastructure costs like many commercial platform vendors do OR
requiring the heavy DevOps expertise that a roll-your-own solution typically
does.

QHub provides the following:

- Easy installation and maintenance controlled by a single configuration file

- Autoscaling JupyterHub installation deployed on the cloud provider of your choice

- Choice of compute instance types: normal; high memory; GPU; etc.

- Big Data via autoscaling Dask compute clusters using any instance type and Python environment

- Shell access and remote editing access (i.e. VS Code Remote)

- Full Linux-style permissions allowing for different shared folders for different user groups

- Data Science environment handling allowing for prebuilt and ad-hoc environment creation

- Integrated video conferencing, using Jitsi

Each of these features are discussed in the sections below.

QHub also integrates many common and useful JupyterLab extensions. QHub Cloud
currently works with AWS, GCP, and Digital Ocean (Azure coming soon). The cloud
installation is based on Kubernetes but is designed in a way that no knowledge
of Kubernetes is required. QHub On-Prem is based on OpenHPC and will be covered
in a future post. The rest of this post will cover the cloud-deployed version of
QHub.

[demo video]: https://youtu.be/XXJIjW9FVVk
