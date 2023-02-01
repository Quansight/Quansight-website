---
title: 'Announcing QHub'
published: October 14, 2020
author: dharhas
description: 'Today, we are announcing the release of QHub, a new open source project from Quansight that enables teams to build and maintain a cost-effective and scalable compute/data science platform in the cloud or on-premises. QHub can be deployed with minimal in-house DevOps experience.'
category:
  [
    Infrastructure & HPC,
    Jupyter,
    Open Source Software,
    PyData Ecosystem,
    Scalable Computing,
  ]
featuredImage:
  src: /posts/announcing-qhub/qhub-img-1.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

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
- Autoscaling JupyterHub installation deployed on the cloud provider of your
  choice
- Choice of compute instance types: normal; high memory; GPU; etc.
- Big Data via autoscaling Dask compute clusters using any instance type and
  Python environment
- Shell access and remote editing access (i.e. VS Code Remote)
- Full Linux-style permissions allowing for different shared folders for
  different user groups
- Data Science environment handling allowing for prebuilt and ad-hoc environment
  creation
- Integrated video conferencing, using Jitsi

Each of these features are discussed in the sections below.

QHub also integrates many common and useful JupyterLab extensions. QHub Cloud
currently works with AWS, GCP, and Digital Ocean (Azure coming soon). The cloud
installation is based on Kubernetes but is designed in a way that no knowledge
of Kubernetes is required. QHub On-Prem is based on OpenHPC and will be covered
in a future post. The rest of this post will cover the cloud-deployed version of
QHub.

## Easy Installation and Maintenance

QHub is designed to be used by someone who is comfortable opening a cloud
account and is reasonably familiar with version control using Git. It does not
assume any knowledge of cloud infrastructure or Kubernetes. It specifically aims
to solve both the bootstrapping problem, i.e. getting the platform up and
running, as well as the “Day 2” problem of customizing, upgrading, and
maintaining the platform in a production environment. It can also be thought of
as a JupyterHub distribution with these specific goals kept at the forefront.

QHub does this by storing the entire configuration of the deployment in a single
version-controlled YAML file and then uses an infrastructure-as-code approach to
deploy and redeploy the platform seamlessly. This means that any time a change
is made to the configuration file, the platform is redeployed. The state of the
deployed platform is self-documenting and is always reflected in this
version-controlled repository.

<img
src="/posts/announcing-qhub/qhub-img-2.png"
alt=""
width="880px"
/>

&nbsp; &nbsp; &nbsp; &nbsp; _Overview of the infrastructure-as-code workflow_

This infrastructure-as-code approach has several key benefits. For an
administrator, it is easy to set up and maintain multiple deployments, say a
development and a production platform. It also lends itself to a robust workflow
that allows team members to request changes and customize the platform through
pull requests. A team member can submit a change to the configuration file that
can be reviewed before modifying the infrastructure. This ability for end-users
to easily customize the platform has been a critical part of making QHub an
effective platform for teams.

## Autoscaling and Multi-Cloud

Each cloud provider has its own advantages and disadvantages. If you are part of
a team that has not made a choice, you may choose based on price. However, in
many organizations, the choice of which cloud provider to use is often dictated
by other organizational needs, say where data is hosted or compliance and policy
reasons. For this reason, one of the primary design goals of QHub is its
multi-cloud deployment capability. It can currently be deployed on AWS, GCP, and
Digital Ocean, with Azure coming soon.

In addition, since the deployment is based on Kubernetes, new pods are spun up
automatically as more users log in and resources are required. These resources
are scaled back down once they are no longer needed. This allows for the
cost-effective use of cloud resources. The base infrastructure costs of a QHub
installation can vary from $50-$200 depending on the cloud provider, storage
size, and other options chosen. The incremental cost of each user that logs in
can vary from approximately $0.02-$2.50 per hour based on the instance types
they choose. User pods are scaled-down when they log out or if their session has
been idle for a specified time (usually 15-30 mins).

## Choice of Instance Types

QHub allows users to pick from several available types of compute resources such
as high memory, high CPU, and GPU instances in a cost-effective manner using
Kubernetes node groups. Users can choose between these and launch the
appropriate type as their needs change. Using the group permissioning feature
described below, certain instance types can be restricted to specific groups of
users.

![](/posts/announcing-qhub/qhub-img-3.png)

&nbsp; &nbsp; &nbsp; &nbsp; _Specifying the instance type to spawn with QHub_

## Big Data Using Dask

[Dask][dask site] provides scalable analytics in Python. It is a very effective
tool for powering big data analytics and visualization. Making it work correctly
in the cloud is hard and requires managing dynamic clusters, data access, and
synchronization of Python environments between scheduler and workers. QHub
manages all of the details to make this simple. It allows the user to easily
launch and use auto-scaling Dask clusters with any available compute instance
type and Python environment.

## Shell Access and Remote Editing Access

While JupyterLab is an excellent platform for data science, it lacks some
features that QHub accommodates. JupyterLab is not well suited for launching
long-running jobs because the browser window needs to remain open for the
duration of the job. It is also not the best tool for working on large codebases
or debugging. To this end, QHub provides the ability to connect via the
shell/terminal and through remote development environments like VS Code Remote
and PyCharm Remote. This remote access connects to a pod that has the same
filesystems, Dask clusters types, and environments that are available from the
JupyterHub interface. It can be used effectively for long-running processes and
more robust development and debugging. We will explore this capability in a
future blog post about KubeSSH.

## Linux-Style Permissions for Groups and Sharing

One of the deficiencies in most JupyterHub deployments is the inability to have
controls over-sharing. QHub enables a shared directory between all users via nfs
and set permissions associated with every user. In addition, QHub creates a
shared directory for each declared group in the configuration allowing for
group-level protected directories shown in the Figure below (bottom cell).

To achieve this robust permissioning model we have followed
[openshift's][openshift site] approach on how to control user permissions in a
containerized ecosystem. QHub configures JupyterHub to launch a given user's
JupyterLab session with set uid and primary/secondary group ids. To get the uid
and gid mapping we use [nss_wrapper][nss_wrapper library] (must be installed in
the container) which allows non-root users to dynamically map ids to names. In
the image below (top cell) we show the given Linux mapping of ids to usernames.
This enables the full Linux permission model for each JupyterLab user.

<img
src="/posts/announcing-qhub/qhub-img-4.png"
alt=""
width="880px"
/>

&nbsp; &nbsp; &nbsp; &nbsp; _Example of standard Linux-style permissioning in QHub_

## Data Science Environment Handling

Data Science environments can be maddeningly complex, difficult to install, and
even more difficult to share. In fact, it is exactly this issue that pushes many
teams and organizations to look at centralized solutions like JupyterHub. But
first, what do we mean by a Data Science environment? Basically, it is a set of
Python/R packages along with their associated C or Fortran libraries. On the
first pass, it seems logical to prebake these complex environments into the
platform as a set of available options users can choose from. This method breaks
down quickly because user needs change rapidly and different projects and teams
have different requirements.

![](/posts/announcing-qhub/qhub-img-5.png)

&nbsp; &nbsp; &nbsp; &nbsp; _Using conda-store to manage cloud environments_

Allowing end-users to build custom ad-hoc environments in the cloud is a hard
problem and Quansight has solved it through the creation of two new open-source
packages, conda-store and conda-docker. We will describe these packages in more
detail in a future blog post. QHub’s integration with these packages allows for
both pre-built controlled environments as well as ad-hoc user created
environments that are fully integrated with both JupyterLab as well as the
autoscaling Dask compute clusters.

## Integrated Video Conferencing

[Jitsi][jitsi site] is an open-source video-conferencing platform that supports
standard features of video-conferencing applications (e.g., screen-sharing,
chat, group-view, password protection, etc.) as well as providing an end-to-end
encrypted self-hosting solution for those who need it. Thanks to the
[Jupyter Video Chat (JVC) extension][jupyter video chat repo], it is possible to
embed a Jitsi instance within a pane of a JupyterLab session. The ability to
manage an open-source video-conferencing tool within JupyterLab—along with a
terminal, notebook, file browser and other conveniences—is remarkably useful for
remote pair-programming and also for teaching or training remotely.

<img
src="/posts/announcing-qhub/qhub-img-6.png"
alt=""
width="880px"
/>

&nbsp; &nbsp; &nbsp; &nbsp; _Using the Jupyter Video Chat plug-in within a JupyterLab session_

## An Open Source Technology Stack

At its core QHub can be thought of as a JupyterHub Distribution that integrates
the following existing open-source libraries:

- [Terraform][terraform site], a tool for building, changing, and versioning
  infrastructure
- [Kubernetes][kubernetes documentation], a cloud-agnostic and open source
  orchestration system
- [Helm][helm site], a package manager for Kubernetes
- [JupyterHub][jupyterhub site], a shareable compute platform for data science
- [JupyterLab][jupyterlab documentation], a web-based interactive development
  environment for Jupyter notebooks
- [Dask][dask documentation], a scalable and flexible library for parallel
  computing in Python
- [Dask-Gateway][dask gateway documentation], a secure, multi-tenant server for
  managing Dask clusters
- [GitHub Actions][github actions documentation], a tool to automate, customize,
  and execute your software development workflows in your GitHub repository,
- [KubeSSH][kubessh repo], a tool that brings the familiar SSH experience and
  remote development to QHub.
- [Jupyter-Videochat][jupyter video chat repo], a Jupyter extension for
  integrated video chat within the platform
- [conda-store][conda-store repo], a tool for declaratively building Conda
  environments by watching a directory of environment.yaml files.
- [conda-docker][conda-docker repo], a tool to associate declarative
  environments with docker images. In addition, this tool does not require
  docker to build images.

This means there is no vendor lock-in, no licensing costs, and no premium to pay
over the base infrastructure costs. (conda-store and conda-docker are new
libraries created by Quansight, whereas KubeSSH received numerous Quansight
contributions.)

<img
src="/posts/announcing-qhub/qhub-img-1.png"
alt=""
width="880px"
/>

&nbsp; &nbsp; &nbsp; &nbsp; _Overview of the QHub stack_

## Take QHub for a Spin

Quansight invites you to try QHub and give us your feedback. We use QHub in
production with several clients and also use it as our internal platform and for
Quansight training classes. We have found it to be a reliable platform but as a
new open source project, we expect that you will find rough edges. We are
actively developing new features and we invite you to get involved by
contributing to QHub directly or to any of the upstream projects it depends on.

https://qhub.dev

https://github.com/Quansight/qhub

https://gitter.im/Quansight/qhub

## Need Help with QHub or JupyterHub?

QHub is a JupyterHub distribution with a focused goal. It is an opinionated
deployment of JupyterHub and Dask with shared file systems for teams with little
to no Kubernetes experience. In addition, QHub makes some design decisions to
enable it to be cross-platform on as many clouds as possible. The components
that form QHub can be pulled apart and rearranged to support different
enterprise use cases. If you would like help installing, supporting, or building
on top of QHub or JupyterHub in your organization, please reach out to Quansight
for a free consultation by sending an email to connect@quansight.com.

If you liked this article, check out our new blog post about <a
href="/post/why-we-are-excited-about-jupyterlab-3-0-dynamic-extensions"
target="_self">JupyterLab 3.0 dynamic extensions</a>.

Update: QHub is now Nebari. See the <a href="/post/evolving-qhub-to-nebari"
target="_self">more recent post on Nebari</a> and <a
href="https://www.nebari.dev">nebari.dev</a> for more.

[conda-docker repo]: https://github.com/conda-incubator/conda-docker
[conda-store repo]: https://github.com/quansight/conda-store
[dask documentation]: https://docs.dask.org
[dask gateway documentation]: https://gateway.dask.org/
[dask site]: https://dask.org/
[demo video]: https://youtu.be/XXJIjW9FVVk
[github actions documentation]: https://docs.github.com/en/actions
[helm site]: https://helm.sh/
[jitsi site]: https://jitsi.org/
[jupyter video chat repo]: https://github.com/yuvipanda/jupyter-videochat
[jupyterhub site]: https://jupyter.org/hub
[jupyterlab documentation]: https://jupyterlab.readthedocs.io/en/stable/
[kubernetes documentation]: https://kubernetes.io/docs/home/
[kubessh repo]: https://github.com/yuvipanda/kubessh
[nss_wrapper library]: https://cwrap.org/nss_wrapper.html
[openshift site]: https://www.openshift.com/
[terraform site]: https://www.terraform.io/intro/index.html
