---
title: 'Array API adoption: Performance wins across the ecosystem'
authors: [mateusz-sokol]
published: April 17, 2026
description: 'In this blog post, we survey performance gains reported by the ecosystem in the recent years.'
category: [Array API, GPU]
featuredImage:
  src: /posts/array-api-meta-blogpost/array-api-meta-blogpost-feature.png
  alt: 'The Data APIs logo next to the scikit-learn, scipy, and other logos.'
hero:
  imageSrc: /posts/array-api-meta-blogpost/array-api-meta-blogpost-hero.png
  imageAlt: 'The Data APIs logo next to the scikit-learn, scipy, and other logos.'
---

It has been four years since the first release of the array [API standard](https://data-apis.org/array-api/latest/API_specification/index.html)
(`2021.12`), and during that time we have witnessed an enormous effort performed by the
community to adopt it, and increase the interoperability between libraries.

Although for library producers it was surely a challenge to adopt it (i.e. extend their
existing APIs and ensure compliance with the standard), the profits of establishing a
common language for expressing numerical computations now clearly outweigh these costs.
Once the first compatible array producers appeared, downstream libraries
started to use the standard in their own implementations. This began a series of
impressive benchmarks, where a minimal user-code change made it possible to move
computations to new type of devices, namely GPU.

## scikit-learn

### LDA

[`scikit-learn`](https://scikit-learn.org/stable/), originally a NumPy (and CPU) only
project, is one of the beneficiaries of the array API adoption. In the `1.3` release
of `scikit-learn`, the [`LinearDiscriminantAnalysis`](https://scikit-learn.org/stable/modules/generated/sklearn.discriminant_analysis.LinearDiscriminantAnalysis.html)
estimator already supported the array API, which allowed to run the classifier with
the PyTorch backend. In the blog post, written by Thomas J. Fan, the benchmarks reported
a 27x speedup compared to NumPy's default execution path.

![Benchmarking of LDA](/posts/array-api-meta-blogpost/lda_plot.png)

You can find the full blog post here:
https://labs.quansight.org/blog/array-api-support-scikit-learn

### Ridge & transformers

Just a month ago, Lucy Liu, Software Engineer from Quansight, shared the latest status
of the array API support in the `scikit-learn` project. The `1.5` release shipped the
array API support for Ridge regressor and a few transformers, therefore making it
possible to run a custom pipeline on a GPU. Fitting [`Ridge`](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)
with [`MaxAbsScaler`](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html)
transformer benchmark reported 50x speedup for PyTorch, and 49x speedup for CuPy,
compared to NumPy baseline. For prediction, these numbers were 38x and 37x speedups for
PyTorch and CuPy respectively.

![Benchmarking of Ridge](/posts/array-api-meta-blogpost/ridge_plot.png)

The full report can be found in the _"A quick benchmark"_ section here:  
https://labs.quansight.org/blog/array-api-scikit-learn-2026

All `scikit-learn` models supporting the array API standard are listed here:  
https://scikit-learn.org/stable/modules/array_api.html#support-for-array-api-compatible-inputs

## SciPy

### Welch's method

[`SciPy`](https://scipy.org/), another fundamental library in the Scientific Python
ecosystem, also reaps the fruits of a few years' efforts to support the standard in its
internals.  
In the paper _"Python Array API Standard: Toward Array Interoperability in the_
_Scientific Python Ecosystem"_ by Aaron Meuer et al., accepted for the 22nd _"Python In_
_Science"_ conference, the authors present a few benchmarks, including SciPy's case:
Estimating power spectral density using Welch's method with optimized implementation
yielded 52x speedup for CuPy, and 51x speedup for PyTorch, compared to NumPy original
implementation.

![Benchmarking of Welch](/posts/array-api-meta-blogpost/welch_plot.png)

For the full report refer to page 14 in the paper:  
https://proceedings.scipy.org/articles/gerudo-f2bc6f59-001.pdf

### Rotation

Another instance of major performance gains for SciPy has been reported by Martin Schuck
for the [`spatial.transform.Rotation`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Rotation.html)
class. Martin's benchmarks ran experiments for a few rotation operations (such as
`approx_equal` or `magnitude`), showing 20x speedup for the JAX backend compared to NumPy.

![Benchmarking of rotation](/posts/array-api-meta-blogpost/rotation_plot.png)

Here's the discussion with reported scores:  
https://github.com/scipy/scipy/pull/23249#issuecomment-3071232726

The complete collection of plots can be found here:  
https://github.com/user-attachments/files/21223000/rotation_benchmark.pdf

### FFT

Another notable SciPy performance gain worth noting is the [`scipy.fft`](https://docs.scipy.org/doc/scipy/reference/fft.html#module-scipy.fft)
module example: Lucas Colley demonstrated a 15x speedup for CuPy backend compared to
NumPy for the task of smoothing a 2D image. You can find more details in the _"SciPy_
_support for the array API"_ section in his internship blog post:  
https://labs.quansight.org/blog/scipy-array-api

## SysIdentPy

The last success story that we would like to cover comes from a lesser-known library library,
[`SysIdentPy`](https://sysidentpy.org/) - a Python library for nonlinear system
identification and time series forecasting. In this case the migration to the array
API compliant version was done by one person - Wilson Rocha, the author of the library.
The PyTorch GPU execution achieved 38x speedup, and CuPy got 30x speedup, compared to
the NumPy version.

![Benchmarking of SysIdentPy](/posts/array-api-meta-blogpost/frols_plot.png)

The results obtained after completing the array API support were shared here:  
https://github.com/data-apis/array-api/discussions/1001

It's worth noting the author stated that `array-api-compat` and `array-api-extra`
packages made the migration simpler than expected. This proves it doesn't require
a whole team to enable a new backend for existing libraries - for smaller ones, one
person can execute the transition.

For full benchmark report refer to:  
https://github.com/wilsonrljr/sysidentpy/blob/feat/array_api/examples/array-api-benchmark.ipynb

## Wrapping up

In this meta blog post we presented a few benchmarks coming from different libraries
that embraced the array API standard, and started supporting new backends.
We are confident that this story won't be limited to only those, and that in the coming
months we will see even more success stories shared by the community.
