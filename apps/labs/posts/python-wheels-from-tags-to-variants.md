---
title: 'Python Wheels: from Tags to Variants'
published: August 1, 2025
authors: [michal-gorny]
description: 'The story of how the Python Wheel Variants were developed'
category: [Packaging]
featuredImage:
  src: /posts/python-wheels-from-tags-to-variants/featured.jpeg
  alt:
hero:
  imageSrc: /posts/python-wheels-from-tags-to-variants/hero.jpeg
  imageAlt:
---

# Python Wheels: from Tags to Variants

Many Python distributions are uniform across different Python versions
and platforms. For these distributions, it is sufficient to publish
a single binary package that can be used everywhere. However, some
packages are more complex than that — they include compiled Python
extensions, binaries or even Python code that differs across targets.
Robust distribution of these software involves publishing multiple
binary packages, with the installers selecting the one that matches
the platform used.

For a long time,
<a rel="external"
href="https://packaging.python.org/en/latest/specifications/binary-distribution-format/">Python
Wheels</a> made do with a relatively simple mechanism
of providing the needed variance: <a rel="external"
href="https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/">
Platform Compatibility Tags</a>. Tags identified different Python implementation and versions,
operating systems, CPU architectures. Over time, they were extended
to facilitate new use cases. To list a few: <a rel="external"
href="https://peps.python.org/pep-0513/">PEP 513</a> added
<code>manylinux</code> tags to standardize the dependency on GNU/Linux
systems, <a rel="external"
href="https://peps.python.org/pep-0656/">PEP 656</a> added
<code>musllinux</code> tags to facilitate Linux systems with musl libc.

However, not all new use cases could be handled effectively within
the framework of tags. The advent of GPU-backed computing made distinguishing
different acceleration frameworks such as CUDA or ROCm important.
As many distributions have set baselines for their binary packages
to x86-64 v2, Python packages also started looking at the opportunity
to express the same requirement. [TODO: more examples?]
While technically tags could be bent to facilitate all these use cases,
they could grow quite baroque. Perhaps most importantly, every change
to tags need to be implemented in all installers and package-related
tooling separately, making the adoption difficult.

Facing these limitations, software vendors employed different suboptimal
solutions to work around the lack of appropriate mechanism. Eventually,
as part of the <a rel="external" href="https://wheelnext.dev/">WheelNext</a>
initiative, we have started working on a more robust solution: Variant
Wheels. In this blog post, I would like to tell the story behind
the solution that emerged.
