---
title: 'Developing a Typer CLI for Nebari'
published: October 4, 2022
author: asmi-jafar
description: 'The Nebari CLI consists of various commands the user needs to run to initialize, deploy, configure, and update Nebari.'
category: [Developer workflows]
featuredImage:
  src: /posts/asmi-blogposts/blog_feature.png
  alt: 'An illustration of nebari logo with the assigned mentors and intern.'
hero:
  imageSrc: /posts/asmi-blogposts/blog_hero.svg
  imageAlt: 'Nebari logo with Typer CLI logo'
---

Hey, I'm [Asmi Jafar](https://twitter.com/asmijafar20), a computer science postgraduate student from India.
I've worked on the [Nebari project](https://www.nebari.dev/) (previously known as Qhub) during my three months internship at Quansight Labs.

## 🪴 About Nebari

Nebari is an open source project from Quansight that enables users to deploy a cost-effective and scalable data science platforms in the cloud. It uses an infrastructure-as-a-code approach to quickly and smoothly deploy a shared data science environment, on-premises or in the cloud of choice. For more details, refer to the [Nebari docs](https://www.nebari.dev/).

## Nebari Command-line Interface (CLI)

I worked on developing the Nebari [Command-line interface (CLI)](https://en.wikipedia.org/wiki/Command-line_interface) during my three months internship.

The Nebari CLI consists of various commands the user needs to run to initialize, deploy, configure, and update Nebari. Let's see briefly what each one of the `nebari` commands does.

Below is a diagram of the Nebari CLI commands.

<img alt="Nebari commands" src="/posts/asmi-blogposts/nebari-commands.svg" />

1. `nebari init` command: initializes and creates the `nebari-config.yaml` file for the deployment.
2. `nebari validate` command: validates the configuration file `nebari-config.yaml`.
3. `nebari render` command: renders the infrastructure configuration files (all terraform stages) and resources.
4. `nebari deploy` command: deploys the Nebari with all the resources and configurations set in `nebari-config.yaml` file.
5. `nebari destroy` command: tears down the provisioned resources for Nebari (the ones which were created during deployment).

## ✅ Initial steps

Prior to my internship, Nebari had an [`argparse`-based](https://docs.python.org/3/library/argparse.html) command line interface which included all the functionality listed above. However it was clunky and, at times, a little challenging to use. My task as an intern was to improve the CLI experience for the end-user. After exploring various tools and libraries it was decided that we would proceed with [Typer](https://typer.tiangolo.com/) and [Rich](https://rich.readthedocs.io/en/stable/introduction.html). For those unfamiliar, Typer is a Python library that makes CLI applications more interactive and user friendly. I started exploring features of `typer` and how it could be implemented as a replacement for the current CLI.

Initially it was hard to implement `typer` on the predefined functions of the CLI as it was important to understand how all functions fits together and their functionalities.

Prior to implementing the new Typer-based CLI, I spent some time trying to understand what each of the commands do and where the changes needed to be made. Once this was understood, I created a minimum viable product (MVP), shared it with the team and got the green-light to proceed.

In the next section, we will take a look at this new Nebari CLI.

## 🪴✨ Nebari Typer CLI

First, we have added a new `nebari --help` command to see all the commands and options available in the Nebari CLI.

```bash
  `nebari --help`
```

<p align="center">
    <img
     alt="Output of the new nebari help command"
     src="/posts/asmi-blogposts/nebari-help.png"
    />
    <i>Output of the new Nebari CLI help command</i>
</p>

Now, we will see the output of the `nebari init` help command to see all the arguments and options that are available to create and initialize a `nebari-config.yaml` configuration file.

```bash
  `nebari init --help`
```

<p align="center">
    <img
     alt="Output of the nebari init help command"
     src="/posts/asmi-blogposts/nebari-init-help.png" />
    <i>Output of the nebari init help command</i>
</p>

The `nebari init` command has many available options. If a user is trying Nebari for the first time, it's hard to know what other each of these options represent. As a result, we implemented a helpful guided initialization wizard: `nebari init --guided-init`. This command guides the user through a simple questionnaire to provide helpful information and links for a number of important decisions that the user needs to make.

```bash
  `nebari init --guided-init`
```

<p align="center">
    <img
     alt="Output of the nebari init --guided-init command"
     src="/posts/asmi-blogposts/nebari-gi.png" 
    />
    <img
     alt="Output of the nebari init --guided-init command"
     src="/posts/asmi-blogposts/nebari-gi1.png" 
     />
    <img
     alt="Output of the nebari init --guided-init command"
     src="/posts/asmi-blogposts/nebari-gi2.png" 
     />
    <i>Output of nebari init guided-init command</i>
</p>

This guided initialization wizard (equivalent to using `nebari init` with the appropriate flags) generates the all important `nebari-config.yaml` file. To help us generate this questionnaire, we used a package called [questionary](https://github.com/tmbo/questionary).

After generating the `nebari-config.yaml`, it's time to validate and render the Terraform scripts. To inspect how to use the validate and render commands, let's have a look at their respective `--help` commands.

```bash
  `nebari validate --help && nebari render --help`
```

<p align="center">
    <img
     alt="Output of the nebari validate and render help"
     src="/posts/asmi-blogposts/nebari-vrh.png" />
    <i>Output of the nebari validate and render help command</i>
</p>

We need to pass the `-c/--config` flag to validate the `nebari-config.yaml` file and we need to do the same for render to generate the Terraform scripts.

```bash
  `nebari validate -c qhub-config.yaml && nebari render -c qhub-config.yaml`
```

<p align="center">
    <img
     alt="Output of the nebari validate and neabri render"
     src="/posts/asmi-blogposts/nebari-rv.png" />
    <i>Output of the nebari validate and render command</i>
</p>

These Terraform scripts are broken into stages and are stored in directory called `stages`.

**_NOTE:_** It's not necessary to run the `validate` and `render` commands separately as both commands are run under the hood by the deploy command.

Now we will see the output of the `nebari deploy` help command. The deploy command creates the necessary resources Nebari needs. Nebari also has a destroy command that works in a similar manner but instead of creating resources, it destroys them. The destroy command now requires confirmation, an important new feature. Previously it didn't ask for the confirmation and the cluster would start being destroyed right after executing it.

```bash
  `nebari deploy --help`
```

<p align="center">
    <img
     alt="Output of the nebari deploy help"
     src="/posts/asmi-blogposts/nebari-dh.png" />
    <i>Output of the nebari deploy help command and destroy command</i>
</p>

The deploy command also has a `--config` flag. Let's pass this flag to see the output of the `nebari deploy` command.

```bash
  `nebari deploy -c nebari-config.yaml`
```

<p align="center">
    <img
     alt="Output of the nebari deploy"
     src="/posts/asmi-blogposts/nebari-d.png" />
    <i>Output of the nebari deploy command</i>
</p>

## 😇 My Learnings and Acknowledgements

I learned a lot during my internship. First, I learned about `Typer` and `Rich`. Interacting with the command line interface was easy but understanding how it worked and making it more streamlined and user-friendly was challenging at first, but playing around with the respective functions and features made it more accessible.
Nebari is a very useful platform for data scientists and researchers to perform their job duties while not requiring a dedicated DevOps administrator. I look forward to making future contributions and seeing it improve.

PS: I want to thank my mentors [Eskild Eriksen](https://github.com/iameskild), [Vinicius D. Cerutti](https://github.com/viniciusdc) and [Amit Kumar](https://github.com/aktech) for all the help and support. I have learned a lot of things from them. It was a really good and memorable experience working at Quansight.

<!--- TODO: PPS: I presented a demo on the Nebari CLI during Qshare (Quansight share) weekly meeting. Check out the recording 📹 [here](link to the video). --->
