---
title: 'RAPIDS cuCIM: Porting scikit-image Code to the GPU'
published: April 20, 2021
author: gregory-lee
description: >
  cuCIM is a new RAPIDS library for accelerated n-dimensional image processing and image I/O. The project is now publicly available under a permissive license (Apache 2.0) and welcomes community contributions. This is the second part of a joint blog post with NVIDIA. Both posts feature a common motivation section, but the NVIDIA post focuses on cuCIM software architecture, image I/O functionality, and benchmark results. In this post, we expand on the CuPy-based cucim.skimage package, which provides a CUDA-based implementation of the scikit-image API. We will give an overview of how existing CPU-based scikit-image code can be ported to the GPU. We will also provide guidance on how to get started using and contributing to cuCIM. The initial release of the library was a collaboration between Quansight and NVIDIA's RAPIDS and Clara teams.
category: [Artificial Intelligence, Optimization]
featuredImage:
  src: /posts/rapids-cucim-porting-scikit-image-code-to-the-gpu/image-processing-img-1.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

This post was co-written between Gregory R. Lee & Gigon Bae, (NVIDIA).

## Overview

[cuCIM][cucim repo] is a new [RAPIDS][rapids site] library for accelerated
n-dimensional image processing and image I/O. The project is now publicly
available under a permissive license (Apache 2.0) and welcomes community
contributions. This is the second part of a
[joint blog post with NVIDIA][nvidia companion post]. Both posts feature a
common motivation section, but the NVIDIA post focuses on cuCIM software
architecture, image I/O functionality, and benchmark results. In this post, we
expand on the CuPy-based cucim.skimage package, which provides a CUDA-based
implementation of the scikit-image API. We will give an overview of how existing
CPU-based scikit-image code can be ported to the GPU. We will also provide
guidance on how to get started using and contributing to cuCIM. The initial
release of the library was a collaboration between Quansight and NVIDIA's RAPIDS
and Clara teams.

As a quick first look, the following code applies a set of filters that
highlight vessels in an image of the retina.

![](/posts/rapids-cucim-porting-scikit-image-code-to-the-gpu/image-processing-img-2.png)

[cucim repo]: https://github.com/rapidsai/cucim
[nvidia companion post]: https://developer.nvidia.com/blog/cucim-rapid-n-dimensional-image-processing-and-i-o-on-gpus
[rapids site]: https://rapids.ai/
