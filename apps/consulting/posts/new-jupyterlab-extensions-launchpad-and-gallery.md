---
title: 'New JupyterLab Extensions: Launchpad and Gallery'
published: April 11, 2025
authors: [quansight]
description: 'We’re excited to share two JupyterLab extensions developed by our team'
category: [Jupyter]
featuredImage:
  src: /posts/new-jupyterlab-extensions-launchpad-and-gallery/GenAI-Things-You-Need-to-Know-That-Your-Parents-Didnt-Teach-You-1.png
  alt: 'Slide with Quansight and JupyterLab logos. Text: "New JupyterLab Extensions: Launchpad and Gallery". Purple dotted background, Quansight Staff badge.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'New JupyterLab Extensions: Launchpad and Gallery'
---

We’re excited to share two JupyterLab extensions developed by our team:

- [JupyterLab Gallery](https://github.com/nebari-dev/jupyterlab-gallery): Present and download examples repositories from the JupyterLab Launcher.
- [JupyterLab Launchpad](https://github.com/nebari-dev/jupyterlab-launchpad): A new launcher for JupyterLab with better environment selection capabilities

![JupyterLab screenshot showing its launcher with notebook icons and file list. Callouts highlight the launchpad and gallery features. Purple gradient background.](/posts/new-jupyterlab-extensions-launchpad-and-gallery/initial-graphic.png)

## JupyterLab Gallery

Gallery is an extension to present, clone (download), and access remote repositories directly from JupyterLab.

You can configure the list of repositories to display in the launcher, as well as the thumbnails and text to use. Users can (git) clone the repository and navigate to the cloned material with a single click from the launcher window directly.

![](/posts/new-jupyterlab-extensions-launchpad-and-gallery/jlab-gallery.gif)

Before the JupyterLab-Gallery extension, users would typically have to manually run git clone commands or use the Git JupyterLab extension to clone repositories. The Gallery extension simplifies this workflow by reducing it to just a couple of clicks, making it more user-friendly.

The extension was especially helpful during the SciPy US conference in 2023 and 2024, where Nebari was the tutorial hosting platform. Having all the tutorial materials readily available in the Gallery made it convenient for participants—they could simply click on a repository and start using it right away. This streamlined setup can be particularly valuable in a tutorial setting, where fewer setup steps keep sessions smooth and efficient.

Internally at Quansight, we use this extension to support onboarding and beginner workflows on [Nebari](https://nebari.dev/), a JupyterHub-based collaborative platform for data science teams. We’ve configured JupyterLab-gallery on Nebari to have specific examples and training materials for new users to get started on the platform.

You can use it with your JupyterLab interface anywhere: locally or on JupyterHub systems. Get started and learn more on the [nebari-dev/jupyterlab-gallery GitHub repository](https://github.com/nebari-dev/jupyterlab-gallery).

## JupyterLab Launchpad

Launchpad is a new JupyterLab launcher interface with a cleaner kernel selection interface.

While working in JupyterLab, you often create isolated software or data science environments with packages and libraries required for your project. These environments present as “kernels” in JupyterLab. JupyterLab Launchpad’s new launcher interface lets you select the kernel to start your Jupyter Notebook or IPython Console from a table view or by searching/filtering for it. The selection and filter interface is also used while changing the kernel of your Notebook or Console.

![](/posts/new-jupyterlab-extensions-launchpad-and-gallery/launchpad.gif)

Environments are a critical part of the data science workflow. On Nebari, we use [conda-store](https://conda.store/) to create and manage isolated environments. On local systems, we have tools like conda or mamba for package and environment management. Accessing and switching between environments quickly is a very common part of the data science workflow, and you want minimal interruptions or breaks in that flow. Launchpad was developed to provide a cleaner, more intuitive way to select and search for kernels tied to these environments.

On Nebari platforms, there are often hundreds of environments created by different users, and this new interface provides a quicker solution to select the required environment and get to work. Although Launchpad was primarily developed for Nebari, the extension works with any JupyterLab interface, local or on JupyterHub systems. You can get started on the [nebari-dev/jupyterlab-launchpad GitHub repository](https://github.com/nebari-dev/jupyterlab-launchpad).

The development of these extensions was funded by the [CDAO JATIC initiative](https://cdao.pages.jatic.net/public/) and completed in collaboration with [Metrostar](https://www.metrostar.com/).

_For those exploring the evolving ecosystem of JupyterLab extensions, this companion piece offers a deeper look at JHub Apps—a modern interface layer for JupyterHub that simplifies application deployment and access to shared infrastructure. [Read the full article to see how JHub Apps advances the usability and shareability of JupyterHub deployments](/blog/jhub-apps-jupyterhub-launcher-with-app-deployment)_
