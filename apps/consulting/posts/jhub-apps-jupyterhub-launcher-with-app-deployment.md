---
title: 'JHub Apps: JupyterHub Launcher With App Deployment'
published: March 7, 2025
authors: [quansight]
description: 'We’re excited to present JHub Apps, a new launcher for JupyterHub that supports the deployment and sharing of web applications and dashboards.'
category: [Jupyter, 'Infrastructure & HPC']
featuredImage:
  src: /posts/jhub-apps-jupyterhub-launcher-with-app-deployment/JHub-preview-image.png
  alt: 'JHub Apps: JupyterHub Launcher With App Deployment'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'JHub Apps: JupyterHub Launcher With App Deployment'
---

![Image of the Jupyterhub logo](/posts/jhub-apps-jupyterhub-launcher-with-app-deployment/JupyterHub-logo.svg)

We’re excited to present **JHub Apps, a new launcher for JupyterHub that supports the deployment and sharing of web applications and dashboards**. In this update, we’ll discuss the key problems it solves and the motivation for developing it as a new open source library.

![](/posts/jhub-apps-jupyterhub-launcher-with-app-deployment/JHub-image1.png)

## Background: JupyterHub and Nebari

[JupyterHub](https://jupyterhub.readthedocs.io/en/stable/index.html) is an open source project for providing multiple users access to JupyterLab & Notebook. With over 7.5 thousand stars on GitHub, it’s used by several data science teams to create collaborative platforms. It can access cloud and high-performance computing (HPC) resources effectively for data science workflows. JupyterHub has an ecosystem of tools that extend and build on its features. One such tool is Nebari.

[Nebari](https://nebari.dev/) is a library that can quickly deploy & manage a JupyterHub-based platform, and has several pre-configured integrations for environment management, user management, and scalability. It allows any data team to quickly set up a collaborative platform without DevOps expertise, and start using it for their everyday work immediately. What started as a small project has grown into an [ecosystem of libraries, plugins, extensions, and more](https://github.com/nebari-dev) working together to create a powerful cloud platform. It’s used by government agencies, climate and energy scientists, pharmaceutical companies, data science educators and many more industry and research teams. We also use it internally at Quansight for several projects. Personally, as a developer advocate, it’s my go-to for testing GPU-specific libraries and workflows that I can’t reliably test on my personal laptop.

## JupyterHub Launcher Interface

The launcher, sometimes called the Homepage, is the first page we see on launching and authenticating into JupyterHub. JupyterHub systems are primarily used to launch servers, which are single-user machines with some CPU, GPU, and memory, with an interface like JupyterLab. A basic or vanilla JupyterHub homepage looks like this:

![](/posts/jhub-apps-jupyterhub-launcher-with-app-deployment/JHub-Image2.png)

We realized this workflow was not intuitive for several Nebari (hence, JupyterHub) users. Data practitioners were not familiar with a “server,” especially when it launched a JupyterLab interface. As the first page, we could use it to share a lot more important information.

The JHub Apps Launcher lists all the available services, and presents the most common features in a **Quick Access Panel**. In addition to launching a server with [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/), Nebari has a Visual Studio Code-like interface (for the same machine and user file system) provided by [Code Server](https://github.com/coder/code-server) for software development workflows. The software environment management system, provided by [conda-store](https://conda.store/), is central to the platform and is also available in the Quick access panel. You can start a machine with the resources you require, and stop the servers when done. Additional services like User management with Keycloak, Monitoring with Grafana, and Job scheduling with Argo Workflows are available in the sidebar.

![](/posts/jhub-apps-jupyterhub-launcher-with-app-deployment/instance-startup.gif)

The launcher was designed with good user experience (UX) principles to ensure users can quickly find and utilize the resources they need without disrupting their workflows. It’s the very first interface for all Nebari users, so it needs to be the central location for accessing all integrated tools and features of Nebari. The new launcher reinforces Nebari’s core value as a fully bundled, powerful platform for data science and software development.

## Web Application Deployment and Sharing

The JHub Apps Launcher also enables the deployment and sharing of web applications and dashboards, addressing another common challenge in JupyterHub systems. Since JupyterHub is a unified platform for multiple single-user systems, traditional deployment paradigms like running applications on localhost don’t translate directly. Deploying web applications here requires routing through proxies, and sharing this app securely with collaborators on the platform adds complexity.

Previously, [CDS Dashboards](https://cdsdashboards.readthedocs.io/en/stable/), a community-built open source library, provided a solution for dashboard sharing in early versions of Nebari. CDS Dashboards eventually slowed into maintenance mode as some opens source projects do, and could not support the latest versions of JupyterHub. We decided to build and maintain an alternative in JHub Apps Launcher, and designed a more intuitive interface from learnings gathered while using CDS Dashboards.

In JHub Apps, users can share applications with collaborators on the same platform, such as specific groups or individuals, and publicly on the internet. This flexibility allows for smoother data science workflows, where deploying and sharing dashboards or small applications is frequent.

[Watch the video](https://www.youtube.com/watch?v=gdBFJuFleQ4)

## New: Quicker App Sharing With JupyterLab Extension!

A newer JupyterLab extension, [jupyterlab-jhub-apps](https://github.com/nebari-dev/jupyterlab-jhub-apps), makes this app and dashboard deployment even more convenient. Instead of returning to the JupyterHub homepage to deploy an app, users can now deploy directly from within the JupyterLab interface they’re working in. With just two or three clicks, it streamlines the workflow further, saving time and reducing overall friction in workflows.

![](/posts/jhub-apps-jupyterhub-launcher-with-app-deployment/JHub-image3.png)

The development of JHub Apps Launcher was funded by the [CDAO JATIC initiative](https://cdao.pages.jatic.net/public/), and completed in collaboration with [Metrostar](https://www.metrostar.com/).

**Although these tools were designed for Nebari, you can use them with any JupyterHub deployment**. Check out the project [README](https://github.com/nebari-dev/jhub-apps#jupyterhub-apps-launcher) to get started. If you’d like to deploy Nebari for your data science team, [reach out to us](/contact-us)!
