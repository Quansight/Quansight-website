---
title: 'uarray: Attempting to move the ecosystem forward'
published: November 10, 2019
author: [hameer-abbasi]
description: "There comes a time in every project where most technological hurdles have been surpassed, and its adoption is a social problem. I believe uarray and unumpy had reached such a state, a month ago. I'd like to present some improvements the Quansight team has made to uarray over the course of the past several months."
category: [PyData ecosystem]
featuredImage:
  src: /posts/uarray-attempting-to-move-the-ecosystem-forward/blog_feature_var1.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/uarray-attempting-to-move-the-ecosystem-forward/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

There comes a time in every project where most technological hurdles have been surpassed, and its adoption is a social problem. I believe `uarray` and `unumpy` had reached such a state, a month ago.

I then proceeded, along with [Ralf Gommers](https://github.com/rgommers) and [Peter Bell](https://github.com/peterbell10) to write [NumPy Enhancement Proposal 31](https://numpy.org/neps/nep-0031-uarray.html) or NEP-31. This generated a lot of excellent feedback on the structure and the nuances of the proposal, which you can read both on the [pull request](https://numpy.org/neps/nep-0031-uarray.html) and on the [mailing list discussion](https://mail.python.org/pipermail/numpy-discussion/2019-September/079961.html), which led to a lot of restructuring in the contents and the structure of the NEP, but very little in the actual proposal. I take full responsibility for this: I have a bad tendency to assume everyone knows what I'm thinking. Thankfully, I'm not alone in this: It's a [known psychological phenomenon](https://en.wikipedia.org/wiki/Curse_of_knowledge).

Of course, social problems can take a long time to resolve one way or another, regardless of the proponents. And I consider this a good thing: it's better not to be stuck with an API decision that may bite you a few years down the line, especially with a project with API compatibility guarantees and number of dependents as NumPy.

I must confess I felt discouraged at some points in the `uarray` journey: However, realising my flaws will make me perform better in the future.

Although my main focus at this point in my career isn't `uarray` (not that I don't want it to be, only that social problems don't take very much of your time), it isn't a small library at the back of my head by any means.

With that out of the way, I'd like to present some improvements the Quansight team has made to `uarray` over the course of the past several months:

## Progress on Integration
### `uarray` ❤️ `scipy.fft`
`uarray` is now the [official override mechanism](https://scipy.github.io/devdocs/reference/fft.html#backend-control) for `scipy.fft`. This is a *huge* win.

### NEP-31 merged with draft status
Already discussed above, but [NEP-31](https://numpy.org/neps/nep-0031-uarray.html) is available on the NumPy website in draft form.

## In core `uarray`
### C++ Implementation Merged
The C++ implementation of the `uarray` protocol is now [merged](https://github.com/Quansight-Labs/uarray/pull/170). `uarray` is now lightning fast: About as fast as `__array_function__`.

### Global backend as the "only" backend
The `set_global_backend` gained an `only=` kwarg. You can read what this means in the [docs](https://uarray.org/en/latest/generated/uarray.set_global_backend.html), but basically: In the absence of any local backends; no other backend will be tried at all.

### Cross-platform CI
We now have [cross-platform CI](https://github.com/Quansight-Labs/uarray/pull/178) for Windows, macOS and Linux.

### Building wheels on CI
[.so we don't have to. 😁](https://github.com/Quansight-Labs/uarray/pull/193)

### Backends can fail fast
[.by throwing a `ua.BackendNotImplementedError`](https://github.com/Quansight-Labs/uarray/pull/199)

### New website 🥳
[https://uarray.org/](https://uarray.org/), and [https://unumpy.uarray.org/](https://unumpy.uarray.org/). 'Nuff said.

### Test `scipy.fft` in CI
[.so we don't accidentally break it.](https://github.com/Quansight-Labs/uarray/commit/ddbdad8bec3c94258e646313bcb20189f103a120)

### Re-entrant context managers
[.so you can cache contexts and use them without worrying.](https://github.com/Quansight-Labs/uarray/pull/207)

### Then we cache for you
[.so you don't have to.](https://github.com/Quansight-Labs/uarray/pull/210)

### Rich comparison of backends
[.so you can specify (via `__eq__`) which backends to skip](https://github.com/Quansight-Labs/uarray/pull/212)

### A bit of performance here and there
[Backend systems need to be fast. 😉](https://github.com/Quansight-Labs/uarray/pull/212)

## In `unumpy`
More coverage of the NumPy API, mainly. 🏃‍

## [`udiff`](https://github.com/Quansight-Labs/udiff)
There's another part of the [`uarray`](https://uarray.org/) ecosystem now: [`udiff`](https://github.com/Quansight-Labs/udiff). It can perform auto differentiation of any [`unumpy`](https://unumpy.uarray.org/) array.
