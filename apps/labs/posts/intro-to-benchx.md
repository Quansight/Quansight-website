---
title: 'Introducing benchx'
published: November 20, 2026
authors: [marco-gorelli]
description: 'Why does the world need yet another benchmarking tool?'
category: [PyData ecosystem, Developer workflows]
featuredImage:
  src: /posts/introducing-benchx/featured.png
  alt: 'Terminal output of bx bench suite.py bench_sorted bench_join: a table listing each benchmark case with its median, mean ± standard deviation, min .. max, sample count (60) and status (success).'
hero:
  imageSrc: /posts/introducing-benchx/hero.png
  imageAlt: 'Terminal output of bx bench suite.py bench_sorted bench_join: a table listing each benchmark case with its median, mean ± standard deviation, min .. max, sample count (60) and status (success).'
---

> "Will this have any performance impacts?"

That question is surprisingly hard to answer. For example, if I compare two runs, how do I know if the difference is meaningful? How do I know if other factors (such as thermal throttling) affected the results? If I receive results from someone else, how confident should I be that they performed the comparison correctly? If I took a measurement last month, how can I know whether I can compare it with today's?

Let's introduce [benchx](https://benchx.dev/) as a new collaborative project which aims to address this and other problems.

## Defining the problem via user stories

Several open source projects, such as NumPy, Arrow, and pandas, have their own benchmarking setups. They all have their own pain points with their systems, and they all report difficulty in sometimes trusting benchmark results. For example, in [PR #31431](https://github.com/numpy/numpy/pull/31431), NumPy maintainers mention that some fluctuations "seem basically random". In pandas, some benchmark measurements get 10x slower one day for no apparent reason (it turned out to be due to a change in `asv-runner`, the machinery which runs their benchmarks, and not at all related to pandas' own code or benchmarks, see [asv issue #1613](https://github.com/airspeed-velocity/asv/issues/1613)).

To make sure we're solving the right problem, we started by collecting user stories from open source projects which do benchmarking. See [user stories](https://benchx.dev/user_stories/) for a collection of stories from various projects, including the pain points they have. If you'd like to add your own story, [we'd love to hear from you](https://benchx.dev/user_stories/TEMPLATE/)!

By exploring those stories, we realised that these open source projects have needs which go beyond what existing benchmarking tools have to offer. Rather than try to incrementally improve existing tools (which may be hard to change due to various reasons including legacy codebases and backwards-compatibility concerns), we set out to build something new. The result is a new tool, built from the ground up, centered on a shared result schema which is rigorous about units and comparisons, and designed starting with user stories in mind right from day zero.

## What's benchx?

Benchx is a collection of components. You can use any one component individually, integrating it with your existing system, or multiple components together. The components we have are: runner, harness adapters (for asv, Google Benchmark, and pyperf), result store, comparator, static dashboard (`bx view`), and local workbench CLI. Benchx is strict about units, comparisons, and history, so you should always know what's being measured and compared. You can think of it as treating benchmarking like a physical experiment: your benchmarks are the lab protocol, and benchx brings the tooling to run it.

![Diagram of the benchx components. The bx workbench CLI sends work orders to the runner: bx bench sends one, and bx compare sends one per side per round, alternating between the sides, then asks the comparator to compare the results. The runner drives harness adapters (pyperf, Google Benchmark, and asv suites) and produces results in a shared result schema. These are ingested into the result store (store.jsonl or store.parquet), which the comparator reads to decide whether each change is bigger than the noise, giving verdicts such as improved, regressed, no change detected, or indeterminate. bx view reads the result store and builds a static dashboard for exploring runs and trends in a browser.](/posts/introducing-benchx/components.svg)

## Try it!

Benchx is currently in beta stage, so don't take this example as set in stone; it may well change. But to give you an idea, here's an example of how you can run it. First, install [benchx from PyPI](https://pypi.org/project/benchx/) (it's pure Python and requires Python 3.11+), along with pyperf, which the examples below use to time benchmarks:

```console
pip install benchx pyperf
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

Benchx will then compare the revisions, alternating between them, and will report on the differences. To explore your recorded runs and trends in a browser, run:

```console
bx view
```

But wait, why alternate? The reason is that otherwise, external factors (such as thermal throttling) may affect one revision more than the other. By alternating, and by comparing round by round, we can see whether one side is meaningfully faster or slower than the other. Along the way, we also record details such as OS, Python version, source revisions, benchmark revisions, and whether any local work is uncommitted.

## Can't I just use asv?

Sure, if your primary use case is to compare revisions across CI runs and you're happy to let asv do your environment management for you. However, a lot of benchmarking doesn't look like that. For example, you may be midway through a refactor and wonder whether it'll make something faster. Rather than working around asv's environment management, you'd typically just use `%%timeit` and paste the numbers in a PR.

Benchx is designed so that it never builds anything. Environment building is up to you. Hand benchx the environments, and it'll run them whilst keeping track of environment details for you. Instead of ad-hoc `%%timeit` commands in notebooks, use `bx bench`. It's just as quick, but the results carry with them a record of how they were produced.

## Continuous benchmarking in the wild: Apache Arrow

The same schema and CLI also scale up to continuous benchmarking in CI. You can see a live deployment tracking Apache Arrow C++ benchmarks across five machines (over 50,000 series and 4 million measurements) at [arrow.benchx.dev](https://arrow.benchx.dev/). There's no hosted database behind it: `bx view` publishes a static site to GitHub Pages. The CI workflows live in [benchx-ci](https://github.com/benchx-dev/benchx-ci) and Arrow's benchmark configuration in [benchx-arrow](https://github.com/benchx-dev/benchx-arrow), so benchx itself stays independent of any particular cloud or CI provider.

## Getting involved

Benchx is currently in beta and only got started about three months ago, in a collaboration between Quansight Labs and [Arctos Alliance](https://arctosalliance.org/). It's fully open source, and contributions from outside are very welcome. If you'd like to get involved, try one of our [worked examples](https://benchx.dev/examples/), or submit a user story following [the template on our site](https://benchx.dev/user_stories/TEMPLATE/). If something you need is missing, send us a pull request. For anything else, our [issues and discussions on GitHub](https://github.com/benchx-dev/benchx) are open; feel free to reach out!
