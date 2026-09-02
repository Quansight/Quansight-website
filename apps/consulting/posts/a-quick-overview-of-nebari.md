---
title: 'A Quick Overview of Nebari'
published: November 8, 2024
authors: [dharhas-pothina]
description: 'A Collaboration-minded AI Platform for Data and Science.'
category: ['Infrastructure & HPC']
featuredImage:
  src: /posts/a-quick-overview-of-nebari/Nebari-Youtube-Thumbnail.png
  alt: 'A Quick Overview of Nebari'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'A Quick Overview of Nebari'
---

_A collaboration-minded AI platform for data and science._

## What Is Nebari?

Nebari is a quick-to-setup, easy-to-maintain, JupyterHub-based AI platform designed to help teams work and collaborate effectively. Today, we will take a walk through some of its major features.

Nebari was originally born out of the idea that we needed a platform that organizations could set up quickly and efficiently for data science, AI, ML, and large-scale compute. When we began this process, we realized that deploying infrastructure in the cloud was challenging, so this platform is our attempt to make it easier and more accessible to organizations. Nebari was developed by people who needed to use it, so we feel we have a much better approach to fixing the pain points that data scientists, engineers, and analysts often face on cloud platforms.

_This article is taken from a transcription of the audio from the video below. Click on the video to see the full demo._

[Watch the video](https://youtu.be/sQTQ_fg2avA?si=7hQzfs2tRjjqGiaE)

## Getting Started with Nebari

We use an open source software called [Keycloak](https://www.keycloak.org/), which lets users connect to different providers like OAuth, SAML, or Active Directory. Once logged into Nebari, we’re presented with a landing page that shows many of the core services available, including the app library (which we’ll cover later). For now, we’ll look at one of the main actions people want to take: Launching a server to use JupyterLab or VS Code for their work.

After we launch JupyterLab, we’ll see we have different options available: small instances, larger high-memory instances, and several GPU instances. For this demo, we’ll choose a T4 GPU because we’ll be running some demos on a GPU later. We’ll then click Start, which sends the request to the cloud, firing up a server on [Kubernetes](https://kubernetes.io/) with a T4 GPU. This launches into the standard JupyterLab notebook that many are familiar with.

![Animated GIF of Dharhas scrolling through server options when starting up a GPU instance in Nebari.](/posts/a-quick-overview-of-nebari/2024.11-Nebari-Different-Server-Options-Available.gif)

## Download & Run Notebook

To get started, as you can see in [the demo video](https://youtu.be/sQTQ_fg2avA?si=cz43Dqa41b5fwQV6), we will download some examples so we can have notebooks to work with. After choosing an example, we’ll download it and open a folder to begin exploring. Once in JupyterLab, we’ll run some code for a time series plot. Nothing fancy. You’ll notice it uses a default environment with some packages already installed.

Let’s say we want to try new software—we want to try [Polars](https://pola.rs/), a popular data frame library. We’ll try running it, but we get an error because it’s not installed. This highlights one of the core issues in cloud platforms: managing available software. Typically, the approach would be to create a Docker image and figure out how to deploy it. Instead, we’ve developed a [software environment management system](https://conda.store/).

[Watch the video](https://youtu.be/79eX5S-3Pmk?si=WynU5bgUKJ4ZMV1y)

## Manage Data Science Libraries with Environments

In Nebari, [environment management is central to the platform](https://quansight.com/post/streamlined-environment-lifecycle-management-for-data-science-workflows-with-conda-store/). We have a comprehensive system supporting all the different applications used within the platform.

Here, within our software environment management system, we call [conda-store](https://conda.store/), we have a personal namespace with some existing environments, like a machine learning environment that includes packages like [scikit-learn](https://scikit-learn.org/) and [pandas](https://pandas.pydata.org/), but let’s say we want to create a new environment. This new environment is an environment to test out Polars. First, we’ll add Polars package and a plotting library ([hvPlot](https://hvplot.holoviz.org/)). We can also select which channel this library comes from ([conda-forge](https://conda-forge.org/)), and then we’ll hit create. This will take a few seconds to download and set up.

While that’s in progress, let’s look at a couple of other things. First, an extra package, [ipykernel](https://pypi.org/project/ipykernel/), has been added in the background because Jupyter needs it to function. We’ve set rules on the backend to manage these dependencies, allowing an administrator to control what gets installed.

On the left of the conda-store screen, we’ll see a “personal namespace,” where we can create environments. We also have “shared namespaces” or shared groups. In this example, we have an AI-Production group and a group for creating and collaborating with RAG applications. These are controlled groups with certain libraries, but we can’t edit or add libraries in these groups without permission. However, in the AI-Research group, we do have access, so we can create new environments.

This setup allows researchers to create the tools they need while also providing controlled environments as needed. Every environment is version-controlled, where we can see several versions, including an active version. As the group administrator, we can choose which version is active or roll back to a previous version if needed.

[Watch the video](https://youtu.be/pyTuj771NsQ?si=YkAuqfGymH1_nEHW)

## App and Dashboard Sharing

To illustrate this, we’ll go back to the main page. Here, we see an app library with different apps built by our colleagues. One of these apps is a climate viewer, a weather station app that lets us compare weather station data with climatology. Since we are authorized in this example, we can use this app.

Now, let’s create one ourselves. We use a simple notebook where we preview a dataset called [Iris](https://scikit-learn.org/1.5/auto_examples/datasets/plot_iris_dataset.html), which includes flower petal sizes and does a simple classification and clustering. With the dataset, we can make a small plot, which looks nice, but it’s not ideal for a notebook. So, instead, let’s see what this would look like as a deployed app. We click the preview button, and in a few moments, we’ll see a preview of the interactive dashboard. This lets us change parameters and see the plot reacting as the data changes through an interactive dashboard.

Once we’re satisfied with it, we’ll copy the path for this file and go to the deploy app button on the Nebari home screen. We’ll give it a name, let’s call it “MyPetalPlot,” select the [Panel](https://panel.holoviz.org/) framework used for plotting, and choose the software environment. We’ll then paste the file path copied from the interactive dashboard, and if we want the app to stay live, we can keep it active, or it can automatically shut down after about 15 minutes.

Next, we’ll choose who to share it with. We can share it with individuals or groups and make access to it public or keep it private, so people have to log in to see it. We’ll upload an image for the app, select a server (a micro servicer in this case, since it’s a simple plot), and hit deploy. In a couple of seconds, this app will be deployed on the platform and available to our colleagues at a URL we can share with them. They’ll also see it on their homepage.

[Watch the video](https://youtu.be/bh_-SObY1dQ?si=l1GHUpYt02eCypQV)

## Using a Software Development IDE

In addition to JupyterLab, we also have access to other integrated development environments (IDEs). For instance, we can open a terminal and use it to view files or perform other tasks. First, let’s download some code to show how to use VS Code. We’ll go to the Git plugin in Jupyter and clone a repository—specifically, an AI tool Quansight built called [Ragna](https://ragna.chat/en/latest/). We’ll clone it, and in a few seconds, we have a nice folder with the software.

Now, we’ll open [VS Code](https://code.visualstudio.com/). This gives us access to a full code editor with a debugger, source control, extensions, and everything needed for a full development environment. We’re a bit tool-agnostic; if you want to use Jupyter, use Jupyter; if you prefer a full IDE, go for it. We deploy these tools together in an integrated fashion.

[Watch the video](https://youtu.be/T3_yS97MQzg?si=JeyCeq3X2FX2fkGj)

## Scalable Compute

Moving on, let’s talk about handling really large datasets on the cloud platform. One big advantage of a cloud platform is access to various types of hardware. For example, if we have _terabytes_ of data, we can easily set up a cluster. For this example, we’ll choose an environment to run this in, a cluster profile using small workers. We’ll then request a cluster of machines, setting it to start with at least five machines and adapt up to ten as needed. This way, the cluster scales up as compute demands increase.

In the demo video, we open some diagnostic tools so we can see what’s happening. In this case, we’ll turn on the cluster map and the progress bar. Now, we’ll run a compute task using the Airline On-Time Performance dataset from the Bureau of Transportation. We calculate the number of flights per day over the last 20 years and plot the total daily flights.

As this runs, the system pulls in more machines, represented by a purple dot as the scheduler. In a few seconds, additional machines will appear as they start up in the cloud. Now, we have two machines, and we will keep adding more as needed. When it finishes, the machines will automatically shut down, which is an efficient way to handle big data without continuous server costs.

The plot is now available, showing 20 years of flight data. We can even see the drop in flights during COVID and how the numbers haven’t quite returned to pre-COVID levels. This illustrates the power of interactive visualization on massive datasets.

[Watch the video](https://youtu.be/5XZ2tzYRi3c?si=5rpJhatuvzW-zWGi)

## GPU Acceleration

Another way to accelerate tasks is by using GPUs. At the start of the demo, we selected a GPU server, so let’s turn on some plots to monitor what’s happening with the GPU. The GPU we have is using zero memory and is inactive, which makes sense since we haven’t started any tasks yet.

We have some code here that uses [PyTorch](https://pytorch.org/) to take the ResNet-50 model and train it for two epochs. This demonstrates that we now have GPU access on the platform and can monitor model performance and resource usage. In seconds, we’ll see the GPU starting to work. This model is using about 7GB of memory. In this particular case, using an A100 GPU might not be ideal, but the platform’s flexibility to switch between different _GPU types as needed_ is crucial. We can start up a server with a GPU and shut it down just as easily, making the platform very efficient.

In a few seconds, it’ll complete the second epoch, and we’ll see the GPU utilization return to zero. However, it will still hold data in memory until we kill this notebook. Once done, we’ll restart the kernel, and the GPU memory will also clear.

[Watch the video](https://youtu.be/gH0K0XH1llY?si=SOuVxi-yqIU8hX5J)

## Workflows

Another feature of Nebari is automated task scheduling. In this demo, we have a notebook that downloads an image of a cat and uses [TensorFlow](https://www.tensorflow.org/) to classify it. For example, this one predicts that the cat in the image is a Siamese with about 13% accuracy. Now, let’s say we want to download a cat image on a schedule every day—just for fun. We can create a schedule and set it to run every weekday, every hour, or even every month. For now, we’ll run it immediately to show what happens in real-time.

Again, we need to choose the environment for this job. This highlights why software environments are a critical part of the platform’s infrastructure. When we hit create, it initiates a job on the backend using a system called [Argo Workflows](https://argoproj.github.io/workflows/). Looking at the workflows, we’ll see a new job has started. It’s spinning up a server to run the task, and in a few seconds, it will complete and update back in our notebook.

[Watch the video](https://youtu.be/gdBFJuFleQ4?si=uvVlxjnB58rudhO0)

Once finished, we’ll download the output files and view them in a notebook or HTML. This next job ran, downloaded an image of a cat, and identified it as a Persian. This demonstrates how easy it is to write a notebook or script and then schedule it to run daily, monthly, or at any interval with just one click.

We hope you enjoyed this quick overview of Nebari and some of the major features and capabilities of the platform. For more information, visit the Nebari website: [nebari.dev](https://nebari.dev).
