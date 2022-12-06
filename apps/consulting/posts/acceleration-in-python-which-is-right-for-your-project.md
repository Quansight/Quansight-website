---
title: 'Acceleration in Python Which Is Right for Your Project?'
published: August 17, 2021
author: dharhas
description: 'Fast computation in Python relies on compiled code. Under the hoods of popular scientific computing libraries like NumPy, SciPy, and PyTorch are algorithms and data structures implemented in compiled languages. By using multiple languages, the aforementioned libraries and many others are able to run interactively in Python, but with the benefits of fast compiled code, facilitating real-time data analysis and manipulation. While this combination is highly desirable, reaping the benefits of both interactivity and speed, there are many ways to achieve this combination and the ways that developers have gone about this task have changed over the years. In this post, I'll highlight three main ways that open-source developers have approached writing performant Python libraries.'
category: [PyData Ecosystem]
featuredImage:
  src: /posts/acceleration-in-python-which-is-right-for-your-project/pythonacc.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

Quansight recently assisted the University of Oxford on the [sgkit][sgkit repo]
library, a new genetics toolkit. Sgkit is based on the scikit-allel project,
which has moved into maintenance mode. Part of the impetus behind this large
rewrite was to (1) allow for larger genomics datasets, (2) enable GPU support,
and (3) transition to a more sustainable, community-maintained project. Sgkit is
meant to improve upon scikit-allel and one of the most important improvements
lies in how the computationally intensive code is written. Indeed, a key
consideration for any scientific Python library is how to structure the
algorithmic code around the slow Python interpreter. We'll return to sgkit
below.

Fast computation in Python relies on compiled code. Under the hoods of popular scientific computing libraries like NumPy, SciPy, and PyTorch are algorithms and data structures implemented in compiled languages. By using multiple languages, the aforementioned libraries and many others are able to run interactively in Python, but with the benefits of fast compiled code, facilitating real-time data analysis and manipulation. While this combination is highly desirable, reaping the benefits of both interactivity and speed, there are many ways to achieve this combination and the ways that developers have gone about this task have changed over the years. In this post, I'll highlight three main ways that open-source developers have approached writing performant Python libraries.

- Using multiple languages in the same module

- Writing the codebase in a compiled language and writing bindings to other languages

- Using a Python-accelerating library

## Why does Python need speeding up in the first place?

Some of the same qualities that make Python user-friendly and good for data
science are the same qualities that make Python slow. The main reason is that
Python is an interpreted language. Most Python runs using the following model:

![](/posts/acceleration-in-python-which-is-right-for-your-project/pythonacc.png)

[sgkit repo]: https://github.com/pystatgen/sgkit
