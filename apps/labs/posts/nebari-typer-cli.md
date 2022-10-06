---
title: 'The evolution of Nebari CLI using Typer'
published: October 4, 2022
author: asmi-jafar
description: 'Nebari typer CLI'
featuredImage:
  src: /posts/asmi-blogposts/nebari-logo.png
  alt: 'An image of the assigned mentors.'
hero:
  imageSrc: /posts/asmi-blogposts/nebari-logo.png
  imageAlt: 'Nebari theme logo.'
---

Hey, I'm [Asmi Jafar](https://twitter.com/asmijafar20), a computer science postgraduate student from India.
I've worked on the [Nebari project](https://www.nebari.dev/) (previously known as Qhub) during my three months internship at Quansight Labs.

## About Nebari

Nebari is a open source project from Quansight that enables teams/user to build cost-effective and scalable compute/data science platform in the cloud. It uses an infrastructure-as-code approach to quickly and easily deploy a shared data science environment, on premises or in the cloud of choice.

## What is Command-line Interface

CLI is a structure of the application through which user can interact and able to run that application or a program. It connects a user to a program.

## Nebari CLI (Command-line Interface)

I've worked on developing the Nebari CLI during my three months internship.

Nebari CLI consists of various commands that user needs to run in order to use the Nebari. Let's see briefly what each one of the `nebari` commands does.

Below is the diagram of the Nebari CLI structure.

<img alt="Nebari commands" src="/posts/asmi-blogposts/nebari-commands.png" />

1. `nebari init` command: It initialize and create a `nebari-config.yaml` file for the deployment.
2. `nebari validate` command: It validated the configuration file `nebari-config.yaml` for the deployment.
3. `nebari render` command: Render the infrastructure (all terraform stages) and resources.
4. `nebari deploy` command: Deploys the Nebari with all the resources available in `nebari-config.yaml` file.
5. `nebari destroy` command: Destroy does the same thing as deploy but instead of creating we destroy the provisioned resources (the one which was created during deploy).

## How I started

Nebari already has a command line interface with all the functionalities but the structure of the CLI was not good and it was quite messy. I have to work on making it more clearer, structured and pretty. So, I started all the tools and libraries that we can use to make a CLI better. After exploring various tools and libraries it was decided to work with [Typer](https://typer.tiangolo.com/) and [Rich](https://rich.readthedocs.io/en/stable/introduction.html). Typer is a python library that makes CLI applications more interactive and user friendly. I started exploring features of `typer` and how it can be implemented with the current CLI. After exploring about typer and rich, Now it is time to implement `typer` on the predefined functions of the CLI.
Initially it was hard to implement `typer` on the predefined functions of the CLI as it was important to understand how all functions fits together and their functionalities.
In the next section, we will see how the new Nebari CLI looks like with all it's functionalities.

## Nebari Typer CLI

First we will start with `nebari --help` command to see all the commands and options available in the Nebari CLI.

```bash
  nebari --help
```

<p align="center">
    <img
     alt="Output of new nebari help command"
     src="/posts/asmi-blogposts/nebari-help.png"
    />
    <br />
    <i>Output of new Nebari CLI help command</i>
</p>

Now, we will see the output of the `nebari init` help command to see all the arguments and options that are available to create and initialize a `nebari-config.yaml` file.

```bash
  nebari init --help
```

<p align="center">
    <img
     alt="Output of nebari init help command"
     src="/posts/asmi-blogposts/nebari-init-help.png" />
    <br />
    <i>Output of nebari init help command</i>
</p>

Like we can see it has lots of options available to pass as a flag in the command while executing it. The `guided-init` flag in the init command is the most valuable flag. If we are using Nebari first time and we don't know exactly what other options and arguments are there for the `init` command then we can run `init` command using `--guided-init` flag. It's ask values from the user and it is more friendly survey or questionnaire for the user to fill out. Let's see the output of it.

```bash
  nebari init --guided-init
```

<p align="center">
    <img
     alt="Output of nebari init --guided-init command"
     src="/posts/asmi-blogposts/nebari-cli-1.1.png" 
    />
    <br />
    <img
     alt="Output of nebari init --guided-init command"
     src="/posts/asmi-blogposts/nebari-cli-gcp-1.2.png" 
     />
    <br />
    <img
     alt="Output of nebari init --guided-init command"
     src="/posts/asmi-blogposts/nebari-cli-gcp-1.3.png" 
     height="500"/>
    <br />
    <i>Output of nebari init guided-init command</i>
</p>

As we can see it's more like a survey that asks users to fill out the correct details for generating the `nebari-config.yaml` file. We have used the [questionary library](https://github.com/tmbo/questionary) for having the options for the questions.

After creating or generating the `nebari-config.yaml`, It's time to validate and render it respectively. First we will see the `help` command output for the validate to see all the options and requirements available for it.

```bash
  nebari validate -c nebari-config.yaml
```

<p align="center">
    <img
     alt="Output of nebari validate help"
     src="/posts/asmi-blogposts/nebari-cli-gcp-1.4.png" />
    <br />
    <i>Output of nebari validate and render command</i>
</p>

As we can see we have to pass the `-c/--config` flag for validating the `nebari-config.yaml` file.

```bash
  nebari validate -c nebari-config.yaml
```

<p align="center">
    <img
     alt="Output of nebari validate"
     src="" />
    <br />
    <i>Output of nebari validate command</i>
</p>

```bash
    nebari render -c nebari-config.yaml
```

<p align="center">
    <img
     alt="Output of nebari render"
     src="" />
    <br />
    <i>Output of nebari render command</i>
</p>

Render command builds the infrasture for the deployment. It creates all terraform stages file that are required during deployment.

**\***NOTE:\*\*\*\* It's not neccessary to run validate and render command seperately. Because it runs under the hood of the deploy command.

Now we will see the ouput of the `nebari-deploy` help command.Deploy command creates the provisioned resources that Nebari needs.

```bash
  nebari deploy -c nebari-config.yaml
```

<p align="center">
    <img
     alt="Output of nebari deploy"
     src="" />
    <br />
    <i>Output of nebari deploy command</i>
</p>

It has many flag which user can pass while executing the deploy command according to it's preferences. Here also `-c` flag is important to pass to make the deployment of `nebari-config.yaml` file successful.

Nebari also has a destroy command that works the same way the deploy works but instead of creating the provisioned resources it destroys it.

```bash
  nebari destroy -c nebari-config.yaml
```

<p align="center">
    <img
     alt="Output of nebari deploy"
     src="" />
    <br />
    <i>Output of nebari deploy command</i>
</p>

It comes with the confirmation that is very important feauture that the new CLI have because previously it didn't ask for the confirmation and the cluster get destroyed right after running it (we don't want that thing to happen with us mistakenly).

### My learnings

I learned a lot during my internship. First thing first I learned about `Typer` and `Rich` and their functionalities. Interacting with the command line interface is easy but understanding and making it more structured and user-friendly can be tough in the start but playing around with functions and it's features can make it easy.
Nebari is very usefule tool for the data scientists/reseachers to develop their project. I hope to continue working on this very interesting project that makes life so much easier without having the much knowledge about devOps.

PS: I want to thank my mentors [Eskild Eriksen](https://github.com/iameskild), [Vinicius D. Cerutti](https://github.com/viniciusdc) and [Amit Kumar](https://github.com/aktech) for all the help and support. I have learned a lot of things from them. It was a really good and memorable experience working at Quansight.
