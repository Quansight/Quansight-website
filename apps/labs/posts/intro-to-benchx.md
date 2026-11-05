---
title: 'Introducing benchx'
published: November 6, 2026
authors: [marco-gorelli]
description: 'Why does the world need yet another benchmarking tool?'
category: [PyData ecosystem, Developer workflows]
featuredImage:
  src: /posts/introducing-benchx/featured.png
  alt: 'TODO'
hero:
  imageSrc: /posts/introducing-benchx/hero.png
  imageAlt: 'TODO'
---

> "Will this have any performance impacts?"

That question is surprisingly hard to answer. For example, if I compare two runs, how do I know if the difference is meaningful? How do I know if other factors (such as thermal throttling) affected the results? If I receive results from someone else, how confident should I be that they performed the comparison correctly? If I took a measurement last month, how can I know whether I can compare it with today's?

Let's introduce [benchx](https://github.com/benchx-dev/benchx) as a new collaborative project which aims to address this and other problems.

## Defining the problem via user stories

Several open source projects, such as NumPy, Arrow, and pandas, have their own benchmarking setups. They all have their own pain points with their systems, and they all report difficulty in sometimes trusting benchmark results. For example, in [PR #31431](https://github.com/numpy/numpy/pull/31431), NumPy maintainers mention that some fluctuations "seem basically random". In pandas, some benchmark measurements get 10x slower one day for no apparent reason (it turned out to be due to a change in `asv-runner`, the machinery which runs their benchmarks, and not at all related to pandas' own code or benchmarks, see [asv issue #1613](https://github.com/airspeed-velocity/asv/issues/1613)).

To make sure we're solving the right problem, we started by collecting user stories from open source projects which do benchmarking. See [user stories](https://benchx-dev.github.io/benchx/user_stories/) for a collection of stories from various projects, including the pain points they have. If you'd like to add your own story, [we'd love to hear from you](https://benchx-dev.github.io/benchx/user_stories/TEMPLATE/)!

By exploring those stories, we realised that these open source projects have needs which go beyond what existing benchmarking tools have to offer. Rather than try to incrementally improve existing tools (which may be hard to change due to various reasons including legacy codebases and backwards-compatibility concerns), we set out to build something new. The result is a new tool, built from the ground up, centered on a shared result schema which is rigorous about units and comparisons, and designed starting with user stories in mind right from day zero.

## What's benchx?

Benchx is a collection of components. You can use any one component individually, integrating it with your existing system, or multiple components together. The components we have are: runner, harness adapters (for asv, Google Benchmark, and pyperf), result store, comparator, and local workbench CLI. Benchx is strict about units, comparisons, and history, so you should always know what's being measured and compared.

## Try it!

Benchx is currently in pre-alpha stage, so don't take this example as set in stone; it may well change. But to give you an idea, here's an example of how you can run it. The project is not yet available on PyPI, so for now you'll need to clone the repo and install it from there:

```console
git clone https://github.com/benchx-dev/benchx
cd benchx
uv venv && source .venv/bin/activate
uv pip install -e prototype pyperf
```

To just run a single benchmark locally:

```console
bx bench suite.py my_function_1
# Or, if you have existing asv benchmarks:
bx bench . --adapter=asv --filter Sort.time_argsort
```

To compare your branch against `main`:

```console
# This example assumes a pure-Python project with a flat layout.
git worktree add ../myproject-main origin/main
bx compare ../myproject-main . --adapter pyperf --profile revisions --suite suite.py --rounds 5
```

It will handle interleaving for you, and will record details such as OS, Python version, source revisions, benchmark revisions, and whether any local work is uncommitted.

## Getting involved

Benchx is currently in pre-alpha and is just getting started. If you'd like to get involved, the most useful way to contribute would probably be by submitting a user story, following [the template on our site](https://benchx-dev.github.io/benchx/user_stories/TEMPLATE/). For anything else, our [issues and discussions on GitHub](https://github.com/benchx-dev/benchx) are open; feel free to reach out!
