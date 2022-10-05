---
title: 'Asmi's Internship Experience at Quansight 2022.'
published: October 4, 2022
author: asmi-jafar
description: 'Blogpost of my three months internship experience working on the Nebari project at Quansight.'
featuredImage:
  src: /posts/asmi-blogposts/feature.svg
  alt: 'An image of the assigned mentors.'
hero:
  imageSrc: /posts/asmi-blogposts/nebari-logo.png
  imageAlt: 'Nebari theme logo.'
---

## About Nebari

Nebari is a open source project from Quansight that enables teams/user to build cost-effective and scalable compute/data science platform in the cloud. It uses an infrastructure-as-code approach to quickly and easily deploy a shared data science environment, on premises or in the cloud of choice.

### Nebari CLI (Command-line Interface)

I worked on developing the Nebari CLI during my three months internship. CLI is a structure of the application through which user can interact and able to run that application or a program. It connects a user to a program.

Nebari CLI consists of various commands that user needs to run in order to run or use the Nebari.

<img alt="Nebari logo" src="/posts/asmi-blogposts/nebari-commands.png" />

1. `nebari init` command: It initialize and create a `nebari-config.yaml` file for the deployment.
2. `nebari validate` command: It validated the configuration file `nebari-config.yaml` for the deployment.
3. `nebari render` command: Render the infrastructure (all terraform stages) and resources.
4. `nebari deploy` command: Deploys the Nebari with all the resources available in `nebari-config.yaml` file.
5. `nebari destroy` command: Destroy does the same thing as deploy but instead of creating we destroy the provisioned resources (the one which was created during deploy).

## How I started
