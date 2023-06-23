---
title: 'The evolution of the SciPy developer CLI'
published: May 03, 2022
author: [sayantika-banik]
description: 'The development story of a developer command-line interface (CLI) for the SciPy project, with exmaples'
category: [Developer workflows]
featuredImage:
  src: /posts/the-evolution-of-the-scipy-developer-cli/scipy_cli_feature.png
  alt: 'A screenshot of the SciPy CLI, showing the "do.py" command and the various options implemented for the SciPy project'
hero:
  imageSrc: /posts/the-evolution-of-the-scipy-developer-cli/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

#### 🤔 What is a command-line interface (CLI)?

Imagine a situation, where there is a massive system with various tools and functionalities, and every functionality requires a special command or an input from the user. A CLI is designed to tackle such situations. Like a catalog or menu, it lists all the options available, thus helping the user to navigate a complex system.

<p align="center">
  <img alt="CLI example" src="https://user-images.githubusercontent.com/17350312/166633508-a2795c44-30bc-4a5b-8043-65beab71d31f.png" />
</p>

Now that we understand what a `CLI` is, how about we dive into the world of `SciPy`?

#### 🤓 SciPy CLI journey

An open-source project undergoes multiple iterations, and each iteration adds layers of tools and functionalities to it. Modules like build, test, benchmarking, release notes, etc are the building blocks of an open source project. With time, the contribution guides start to span over multiple pages, and the over all effort to maintain the project grows exponentially.

The two homegrown CLI for SciPy are `runtests.py`(for distutils-based builds) and `dev.py`(for Meson-based builds) developed using python tooling `argparse`.
Both of these tools have long chains of conditional statements, which are notorious for reducing code readability drastically. It is harder to find the right code block in the chain to modify, hence code maintainability becomes a challenge. The documentation runs into an infinite loop of updates, requiring additional efforts from maintainers. Another issue that remains is the lack of task grouping. A group of tasks linking to a single objective helps reduce confusion, super helpful for new contributors (like me :D).

Thus the idea of a developer command-line interface (CLI) was born, easing the development experience with an intuitive and informative CLI. In addition, we also removed dependency on legacy tooling like `paver`, which added great value to the overall experience. More details could be found under [issue-#15489](https://github.com/scipy/scipy/issues/15489).

#### ✍️ Planning and objective

Like any development activity, the plan was to experiment with available tools. [doit](https://pydoit.org/) and [Typer](https://typer.tiangolo.com/) were the first ones we picked. The two components of our interests were a _task runner_, and a _command-line interface tool_. doit satisfied the requirements of a task runner along with added functionality, like maintaining a task dependency graph as a [DAG](https://hazelcast.com/glossary/directed-acyclic-graph/). While `Typer` is quick to get started with building CLI applications.

As a starting point, I began experimenting with existing `dev.py` options, wrapped around individual `doit` and `Typer` tasks. Both the [doit, Proof of concept (POC)](https://github.com/sayantikabanik/scipy/blob/cli_poc/dodo.py) and [Typer POC](https://github.com/sayantikabanik/scipy/blob/cli_poc/cli.py) were developed by wrapping a few selected options available under `dev.py`.

As I progressed with the development of POCs using both tools, I experienced certain shortcomings. A better way to integrate an external library for exposing a CLI was the missing piece. **Eduardo Naufel Schettino** the author of doit developed an architecture combining the core elements of `doit` along with `click`. Henceforth we continued with a `doit-click` approach, the journey is captured in detail under [issue-#133](https://github.com/rgommers/scipy/issues/133).

#### 💁🏽‍♀️ More about the architecture and core components

Combining these tools wasn’t a straightforward journey; after multiple iterations, we were able to achieve a stable state. doit underwent updates to incorporate added functionalities, helping the pieces come together. Below are the core components for the `doit-click` based task definition along with an illustration _(code snippet 01 and 02)_.

1. ✍️ Click based approach to input arguments/options/parameters
2. ☑️ Base class to define doit task and/or click command
3. 🏃 Method to execute a task `run()`
4. 🌟 Additional utilities like `task dependency` and metadata definition using class attribute `TASK_META`

> Snippet 01

- The code snippet below initiates a class based `Click` command definition

```python
@cli.cls_cmd('test')
class Test():
    """Run tests"""
    @classmethod
    def run(cls):
        print('Running tests...')
```

> Snippet 02

**Additional details**

- A command may make use of a `Click.Group` context defining a `ctx` class attribute
- The command options are also defined as class attributes

```python
@cli.cls_cmd('test')
class Test():
    """Run tests"""
    ctx = CONTEXT
    verbose = Option(
        ['--verbose', '-v'], default=False, is_flag=True, help="verbosity")
    @classmethod
    def run(cls, **kwargs): # kwargs contains options from class and CONTEXT
        print('Running tests...')
```

#### 🎨 `rich-click` addition

To incorporate the look and feel, I designed a layer on top of the existing CLI architecture with the help of [rich-click](https://pypi.org/project/rich-click/).
It offers a variety of style options, markdown settings and flexibility to group tasks and options. Together it adds that perfect richness to the CLI command pallet.
Below is a simple example which demonstrates the grouping of options and tasks along with style settings.

```python

# style and markdown setting
rich_click.STYLE_ERRORS_SUGGESTION = "yellow italic"
rich_click.USE_MARKDOWN = True

# grouping global and task based options
rich_click.OPTION_GROUPS = {
    "do.py": [
        {
            "name": "Options",
            "options": [
                "--help", "--build-dir", "--no-build", "--install-prefix"],
        },
    ],

    "do.py test": [
        {
            "name": "Options",
            "options": ["--help", "--verbose", "--parallel", "--coverage"],
        },
    ],
}
# adding tasks into groups
rich_click.COMMAND_GROUPS = {
    "do.py": [
        {
            "name": "environments",
            "commands": ["shell", "python", "ipython"],
        },
        {
            "name": "release",
            "commands": ["notes", "authors"],
        },
    ]
}
```

#### 🎥 The developer CLI in action

<script id="asciicast-U9l9VvklvEjXdEi1xYS4A7u5M" src="https://asciinema.org/a/U9l9VvklvEjXdEi1xYS4A7u5M.js" async></script>

#### Current list of implemented tasks

Below are the lists of tasks currently implemented as part of the developer CLI. This list is dynamic and subject to change in the coming months.

- `Build & testing tasks`
  - build (build & install package on path)
  - test (Run tests along with options to run tests for a given submodule)
- `Static checker tasks`
  - pep8 ( Perform pep8 check with flake8)
  - mypy ( Run mypy on the codebase)
- `Environments`
  - shell (Start Unix shell with PYTHONPATH set)
  - python (Start a Python shell with PYTHONPATH set)
  - ipython (Start IPython shell with PYTHONPATH set )
- `Documentation tasks`

  - doc (Build documentation)
  - refguide-check (Run refguide check)

- `Release tasks`
  - notes (Release notes and log generation)
  - authors (Task to generate list the authors who contributed within a given revision interval)
- `Benchmarking tasks`
  - bench & bench compare

#### 👏🏽 Great Collaboration and teamwork

From an idea to developing a successful POC, the journey was a great learning opportunity for me. Planning, coordination, teamwork and clear communication played a very important role. Huge thanks to **Ralf Gommers** and **Eduardo Naufel Schettino** for the amazing collaboration and support.

As a newcomer to the _SciPy codebase_, it was a steep learning curve. I asked a ton of questions, at times drifted to the ocean searching for answers. Learning something completely new can be overwhelming, different emotions brush past. Thanks to Ralf and **Pamphile Roy** for addressing my questions. The learnings and achievements will stay with me for a long-long time.

#### 😇 The next steps

The experimental CLI is available under `scipy/do.py` for the wider community to test and provide us with valuable feedback.

> **Handy commands to quickly try out the CLI**

- Enabling the GUI: `python do.py`
- Listing all the available arguments/options for a task: `python do.py <task_name> --help`

> **Outcomes**

1. 📜 Self-documentation and hierarchical help option
2. 🧭 Easy to navigate and intuitive interface
3. ⏩ Clear and concise examples to get started quickly
4. ⏱ Reduction in the time spent navigating documentation

With a great start comes possibilities. In the coming weeks, the CLI will become mature and stable. After we receive wider usage and acceptance from the community, support for `dev.py` and `runtests.py` will be paused and `do.py` will be renamed to `dev.py`. The user documentation for the CLI components and usage will be made available for clear and concise understanding.
To foster reusability, Eduardo has developed a package named `pydevtool`. The reusable elements will be incorporated into the SciPy developer CLI code. We will also be adding support for `act`, which will enable users to run GitHub CI jobs locally.

#### 🙂 Parting thoughts

Many thanks to the wonderful community for all the support and guidance.
We are excited to collaborate with projects looking forward to adapting a similar developer command-line interface.
