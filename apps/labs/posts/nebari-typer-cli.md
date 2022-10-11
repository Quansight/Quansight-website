---
title: 'The evolution of Nebari CLI using Typer'
published: October 4, 2022
author: asmi-jafar
description: 'Nebari typer CLI'
featuredImage:
  src: /posts/asmi-blogposts/intern-mentors.png
  alt: 'An illustration of nebari logo with the assigned mentors and intern.'
hero:
  imageSrc: /posts/asmi-blogposts/typer-nebari.png
  imageAlt: 'Nebari logo with Typer CLI logo'
---

Hey, I'm [Asmi Jafar](https://twitter.com/asmijafar20), a computer science postgraduate student from India.
I've worked on the [Nebari project](https://www.nebari.dev/) (previously known as Qhub) during my three months internship at Quansight Labs.

## 🪴 About Nebari

Nebari is an open source project from Quansight that enables teams/users to deploy a cost-effective and scalable compute/data science platforms in the cloud. It uses an infrastructure-as-a-code approach to quickly and smoothly deploy a shared data science environment, on-premises or in the cloud of choice. For more details, refer to the [Nebari docs](https://www.nebari.dev/).

## Nebari Command-line Interface (CLI)

I've worked on developing the Nebari [Command-line interface (CLI)](https://en.wikipedia.org/wiki/Command-line_interface) during my three months internship.

The Nebari CLI consists of various commands the user needs to run to deploy, configure, and update Nebari. Let's see briefly what each one of the `nebari` commands does.

Below is a diagram of the Nebari CLI commands.

<img alt="Nebari commands" src="/posts/asmi-blogposts/nebari-commands.png" />

1. `nebari init` command: initializes and creates the `nebari-config.yaml` file for the deployment.
2. `nebari validate` command: validates the configuration file `nebari-config.yaml`.
3. `nebari render` command: renders the infrastructure configuration files (all terraform stages) and resources.
4. `nebari deploy` command: deploys the Nebari with all the resources and configurations set in `nebari-config.yaml` file.
5. `nebari destroy` command: tears down the provisioned resources for Nebari (the ones which were created during deployment).

## ✅ Initial steps

Prior to my internship, Nebari already has a command line interface with all the functionality listed above however it was clunky and, at times, a little challenging to use. My task as an intern was to improve the CLI experience for the end-user. After exploring various tools and libraries it was decided that we would proceed with [Typer](https://typer.tiangolo.com/) and [Rich](https://rich.readthedocs.io/en/stable/introduction.html). For those unfamiliar, Typer is a Python library that makes CLI applications more interactive and user friendly. I started exploring features of `typer` and how it could be implemented as a replacement for the current CLI. After exploring about typer and rich, Now it is time to implement `typer` on the predefined functions of the CLI.
Initially it was hard to implement `typer` on the predefined functions of the CLI as it was important to understand how all functions fits together and their functionalities.

Prior to implementing the new Typer-based CLI, I spent some time trying to understand what each of the commands do and where the changes needed to be made. Once this was understood, I created a minimum viable product (MVP), shared it with the team and got the green-light to proceed.

In the next section, we will take a look at this new Nebari CLI.

## 🪴✨ Nebari Typer CLI

First, we have added a new `nebari --help` command to see all the commands and options available in the Nebari CLI.

```bash
  nebari --help
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
  nebari init --help
```

<p align="center">
    <img
     alt="Output of the nebari init help command"
     src="/posts/asmi-blogposts/nebari-init-help.png" />
    <i>Output of the nebari init help command</i>
</p>

We can see that the `nebari init` command has a lot of available options. If we are using Nebari first time and we don't know exactly what other each of the options represent, then running `nebari init --guided-init` will guide us through a simple questionnaire which provides helpful information ,and links to additional resources, to assist with a number of important decisions.

```bash
  nebari init --guided-init
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

As we can see it's more like a survey that asks end-users to fill out the details for generating the `nebari-config.yaml` file. To create this questionnaire, We have used the [questionary library](https://github.com/tmbo/questionary).

After generating the `nebari-config.yaml`, it's time to validate and render it respectively. First we will see the `help` command output for the validate to see all the options and requirements available for it.

```bash
  nebari validate --help && nebari render --help
```

<p align="center">
    <img
     alt="Output of the nebari validate and render help"
     src="/posts/asmi-blogposts/nebari-vrh.png" />
    <i>Output of the nebari validate and render help command</i>
</p>

As we can see we have to pass the `-c/--config` flag for validating the `nebari-config.yaml` file and we have to do the same for rendering the infrastructure using the render command.

```bash
  nebari validate -c qhub-config.yaml && nebari render -c qhub-config.yaml
```

<p align="center">
    <img
     alt="Output of the nebari validate and neabri render"
     src="/posts/asmi-blogposts/nebari-rv.png" />
    <i>Output of the nebari validate and render command</i>
</p>

The render command renders all of the Terraform scripts used for the actual deployment. These Terraform scripts are broken into stages and are stored in directory called `stages`.

**_NOTE:_** It's not necessary to run the `validate` and `render` commands separately as both commands are run under the hood by the deploy command.

Now we will see the output of the `nebari deploy` help command. The deploy command creates the provisioned resources that Nebari requires and deploys your project. Nebari also has a destroy command that works the same way the deploy works but instead of creating the provisioned resources it destroys it. The destroy command now requires confirmation, an important new feature. Previously it didn't ask for the confirmation and the cluster would start being destroyed right after executing it.

```bash
  nebari deploy --help
```

<p align="center">
    <img
     alt="Output of the nebari deploy help"
     src="/posts/asmi-blogposts/nebari-dh.png" />
    <i>Output of the nebari deploy help command and destroy command</i>
</p>

The deploy command also has a `--config` flag. Let's pass this flag to see the output of the `nebari deploy` command.

```bash
  nebari deploy -c nebari-config.yaml
```

<p align="center">
    <img
     alt="Output of the nebari deploy"
     src="/posts/asmi-blogposts/nebari-d.png" />
    <i>Output of the nebari deploy command</i>
</p>

## 😇 My Learnings and Acknowledgements

I learned a lot during my internship. First, I learned about `Typer` and `Rich` and its functionalities. Interacting with the command line interface was easy but understanding how it worked and making it more structured and user-friendly was tough intially, but playing around with the respective functions and features made it more accessible.
Nebari is a very useful platform for data scientists and reseachers to develop their projects. I hope to continue working on this very interesting project that makes life so much easier without requiring in-depth DevOps knowledge.

PS: I want to thank my mentors [Eskild Eriksen](https://github.com/iameskild), [Vinicius D. Cerutti](https://github.com/viniciusdc) and [Amit Kumar](https://github.com/aktech) for all the help and support. I have learned a lot of things from them. It was a really good and memorable experience working at Quansight.

PPS: I presented a demo on the Nebari CLI during Qshare (Quansight share) weekly meeting. Check out the recording 📹 [here](link to the video).
