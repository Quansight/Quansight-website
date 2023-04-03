---
title: 'Building Your Own Code Copilot with LLMs'
published: March 27, 2023
author: chris-ostrouchov
description: 'As an experiment we wanted to add a feedback loop into LLM generated code via type annotations, docstrings, automated tests, and user feedback. We developed a simple package pseudoscode which uses the OpenAI API for generating code.'
category: ["Artificial Intelligence"]
featuredImage:
  src: '/posts/openai-pseudocode/pseudocode-screenshot.png'
  alt: 'A screenshot of the pseudocode program running'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

## Overview

Large Language Models (LLMs) have been around for several years but
recent advances have revolutionized the field of natural language
processing (NLP) and artificial intelligence (AI), opening up a world
of possibilities across various domains. [OpenAI's
ChatGPT](https://chat.openai.com/) has taken the world by storm and
shown remarkable ability to generate human-like responses to a wide
range of queries.

These models require training on vast amounts of data and in some
sense can be thought of as a way to summarize and expose the
information in the training dataset. It is important to remember
however that the information returned in response to a query is a
statistical answer and these models have no concept of
'correctness'. This leads to the so called hallucination effect that
is now being talked about, i.e. when a confident but factually wrong
response is given to a set of queries.

Between discussion sites like StackOverflow and code repositories like
GitHub and GitLab, there is a tremendous amount of source code
available online for potential training. Efforts like [Github
Copilot](https://github.com/features/copilot), show the power of AI
assisted coding to boost productivity. Our testing has shown however
that while CoPilot can greatly assist a developer, it is also prone to
hallucinations inventing new methods that don't exist or sometimes
using outdated api's that no longer exist in recent versions of the
code.

We decided to experiment to if we could add a feedback loop into the
process of code generation to reduce model hallucinations and iterate
towards a working solution faster. We also wanted to experiment with
adding conversational feedback to the results rather than the
auto-complete mechanism that CoPilot currently implements (Note:
CoPilot just announced a preview release of a [conversational chat
based mode](https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/).

As an experiment we developed a python package
[pseudocode](https://github.com/Quansight/pseudocode) which allows
developers to annotate their code and produce testable code generated
by LLMs without the user writing any code. We hope that
[pseudocode](https://github.com/Quansight/pseudocode) may be a "higher
level language" for writing python code. Below you will find an
example. We emphasize interfaces via type annotations and function
docstrings and provide easy ways to have automated tests.

1. We define the code to be generated as a function signature with
   type annotations
2. We define tests that must pass
3. We submit these to OpenAI `gpt-3.5-turbo` API with some
   instructions
4. Once we have code that passes the tests, we allow the user to
   accept the code or provide feedback
5. If the users provide feedback, then the feedback is sent back to
   ChatGPT and we repeat the process
6. We run the resulting code through the tests, if the tests fail we
   resubmit the errors back to OpenAI `gpt-3.5-turbo`

Below we walk through a demonstration of this process. We have named
the codebase [pseudocode](https://github.com/Quansight/pseudocode).

## Example

Let's use a concrete example of a slightly non-trivial task of getting
Github issues.

```python
import typing
import datetime

from pseudocode import pseudo_function

@pseudo_function(review=True)
def get_issues(repository: str) -> typing.List[typing.Tuple[str, int, datetime.datetime]]:
    """A function to fetch all issues created by

    A function that does the following:
     - assume you have a github token environment variable GITHUB_TOKEN
     - assume that repository is of the form organization/repo
     - use the requests library
     - fetch all github issues from repository in last 10 days
     - only show issue numbers which are odd
     - return a tuple with issue titles, number, and date created

    Examples
    --------
    >>> all([_[1] % 2 == 1 for _ in get_issues("conda/conda")])
    True
    """
    pass


print('github issues', get_issues("conda/conda"))
```

We feel this is a good example because it is hard to remember how to
use the GitHub API exactly and inevitably requires some back and forth
using the [PyGithub](https://github.com/PyGithub/PyGithub) python
library, API requests, and viewing API documentation. LLMs show promise

for these applications since there is a large amount of surrounding
documentation but no one example to do exactly what you
need. `pseudocode` enforces the practice of creating an __interface__
specification which:
 - declares the function signature `def get_issues(repository: str) -> typing.List[typing.Tuple[str, int, datetime.datetime]]`
 - uses the function's `docstring` to specify what the function should be doing
 - automates tests run by `pseudocode` to provide feedback to the LLM of the quality and correctness of the code generated

When you run the example above, you will see the following.

```shell
╭────────────────────────────────────────────────────── Function Specification ────────────────────────────────────╮
│                                                                                                                  │
│ The following is a short description of what this function should do "A function to fetch all issues created by".│
│ A longer more detailed description of what this function should do is as follows:                                │
│ A function that does the following:                                                                              │
│  - assume you have a github token environment variable GITHUB_TOKEN                                              │
│  - assume that repository is of the form organization/repo                                                      │
│  - use the requests library                                                                                      │
│  - fetch all github issues from repository in last 10 days                                                       │
│  - only show issue numbers which are odd                                                                         │
│  - return a tuple with issue titles, number, and date created                                                    │
│ The function takes the following arguments:                                                                      │
│  - variable "respository" of python type "<class 'str'>"                                                         │
│ This function must return a result of python type "typing.List[typing.Tuple]".                                   │
│ Output code that will satisfy the given requirements.                                                            │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────── Code Review ─────────────────────────────────────────╮
│                                                                                                                  │
│ import os                                                                                                        │
│ import datetime                                                                                                  │
│ import requests                                                                                                  │
│                                                                                                                  │
│ def run(repository: str) -> list:                                                                                │
│                                                                                                                  │
│     headers = {                                                                                                  │
│         'Authorization': f"Bearer {os.environ['GITHUB_TOKEN']}",                                                 │
│         'Accept': 'application/vnd.github.v3+json'                                                               │
│     }                                                                                                            │
│                                                                                                                  │
│     url = f"https://api.github.com/repos/{repository}/issues"                                                    │
│                                                                                                                  │
│     now = datetime.datetime.now()                                                                                │
│     ten_days_ago = now - datetime.timedelta(days=10)                                                             │
│                                                                                                                  │
│     response = requests.get(url, headers=headers, params={"since": ten_days_ago})                                │
│                                                                                                                  │
│     issues = response.json()                                                                                     │
│     odd_issue_numbers = [f"{issue['number']}" for issue in issues if issue['number'] % 2 != 0]                   │
│                                                                                                                  │
│     result = []                                                                                                  │
│     for issue in issues:                                                                                         │
│         if str(issue['number']) in odd_issue_numbers:                                                            │
│             result.append((issue['title'], issue['number'], issue['created_at']))                                │
│                                                                                                                  │
│     return result                                                                                                │
│                                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
What code feedback would you like to provide? (leave empty for approval): 
```

`pseudocode` generates appropriate prompts to the LLM asking it to
provide code in response to the user's requirements. In this case we
specified `review=True` in the decorator which prompted `pseudocode`
to ask for user feedback on the generated code.

```shell
What code feedback would you like to provide? (leave empty for approval): this code is messy can you simplify it?
╭─────────────────────────────────────────────────────────── LLM Feedback ─────────────────────────╮
│ this code is messy can you simplify it?                                                          │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
╭──────────────────────────────────────────────────────────── Code Review ─────────────────────────╮
│                                                                                                  │
│ import os                                                                                        │
│ import datetime                                                                                  │
│ import requests                                                                                  │
│                                                                                                  │
│ def run(repository: str) -> list:                                                                │
│     headers = {'Authorization': f"Bearer {os.environ['GITHUB_TOKEN']}"}                          │
│     url = f"https://api.github.com/repos/{repository}/issues"                                    │
│     since = datetime.datetime.now() - datetime.timedelta(days=10)                                │
│     params = {'since': since.isoformat()}                                                        │
│     response = requests.get(url, headers=headers, params=params)                                 │
│     issues = response.json()                                                                     │
│     return [(i['title'], i['number'], i['created_at']) for i in issues if i['number'] % 2 != 0]  │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
What code feedback would you like to provide? (leave empty for approval):
```

Already after some quick initial feedback we can see that the LLM
takes into account the users needs. After user provided feedback the
automated tests are run. If those tests fail or run into exceptions
they will be automatically passed back to the LLM for corrections.

```shell
pass result = str(all([_[1] % 2 == 1 for _ in run("conda/conda")]))
github issues [
  ('Use appropriate `defaults` value for Windows is use when subdir=win-*', 12555, '2023-03-30T17:44:55Z'), 
  ...
  ('Document steps to debug tests with vscode', 12459, '2023-03-07T18:20:08Z')
]
```

The final generated code after passing all tests.

```python
import os
import datetime
import requests

def run(repository: str) -> list:
    headers = {'Authorization': f"Bearer {os.environ['GITHUB_TOKEN']}"}
    url = f"https://api.github.com/repos/{repository}/issues"
    since = datetime.datetime.now() - datetime.timedelta(days=10)
    params = {'since': since.isoformat()}
    response = requests.get(url, headers=headers, params=params)
    issues = response.json()
    return [(i['title'], i['number'], i['created_at']) for i in issues if i['number'] % 2 != 0]
```

## Conclusion

There are several key ideas here we want to highlight about why we
think the approaches taken in `pseudocode` are unique.

 * __Autogenerated code needs guidance__. Feedback is generated from the user and the rest is guided by automated testing and exception reporting back to the LLM.

 * Interface design is naturally a high level task which is the key to composable code. Declaring interfaces for LLMs to operate within is important. 

 * Separation of code declarations and generated code. Similar to `.py` and `.pyc` files we should separate the interfaces from the autogenerated code.

We mentioned earlier that this was an experiment of the interaction
between automated testing, user feedback, and LLMs. We want to explore
this more and already have additional ideas like applying formatting and linting to generated
LLM code via [black](https://black.readthedocs.io/en/stable/),
[ruff](https://github.com/charliermarsh/ruff), and
[isort](https://pycqa.github.io/isort/). Caching of LLM code generated
to avoid repetitive API calls and a database of reusable code. Similar
to `pseudocode.pseudo_function(...)` it would be nice to have an
equivalent for arbitrary files. This feels somewhat like
[cookiecutter](https://cookiecutter.readthedocs.io/en/stable/) on
steroids

```python
def test_dockercompose(contents):
    pass

pseudocode.pseudo_file(
  'docker-compose.yaml, 
  'A docker-compose file to generate a running redis service on port 5000 with no password', 
  [test_dockercompose]
)
```

[![asciicast](https://asciinema.org/a/573724.svg)](https://asciinema.org/a/573724)

Check out the project at [Quansight/pseudocode](https://github.com/quansight/pseudocode).
