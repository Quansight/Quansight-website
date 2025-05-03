---
title: 'Supporting dask arrays in scipy via the Python Array API standard'
authors: [thomas-li]
published: February 2, 2025
description: 'Extending Array API Standard support in scipy to distributed arrays via dask.array'
category: [Array API, PyData ecosystem]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: 'Excellent alt-text describing the featured image'
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: 'Excellent alt-text describing the hero image'
---

TLDR: As of scipy 1.16, users can now pass in `dask.array` arrays to most Array API compatible functions in scipy and
receive a lazy dask array back without forcing computation of the input array.

## Introduction: A quick refresher of the Python Array API standard

For those unfamiliar, the [Python Array API standard](https://data-apis.org/array-api/latest/API_specification/),
is a specification aimed at unifying the various APIs of different array libraries (e.g. Numpy, PyTorch, JAX, Dask, etc.).
While many libraries (e.g. JAX, cupy), implement a numpy-like interface, it is challenging (and sometimes undesirable)
for some libaries to support all the features/quirks of numpy, especially for those that run on hardware such as GPUs/TPUs
(e.g. MLX, cupy). Because of this, many array libraries subtly differ from numpy in various way, making it impossible for
users to treat arbritrary array objects as numpy arrays via duck typing.

Today, [array api support](https://scipy.github.io/devdocs/dev/api-dev/array_api.html) in scipy has progressed a long
way since mid 2023 when array API support was first experimentally introduced within the libary. While the array API
still remains experimental (one has to set `SCIPY_ARRAY_API=1` to use it), several modules (e.g. `scipy.special`,
`scipy.stats`), have either been fully or mostly ported to support the array API standard and successfully work with
input arrays from `PyTorch`, `cupy` in addition to `numpy`, allowing users to speed up their scipy code by passing in
e.g. GPU arrays to scipy functions that support the array API (see this [blog post](https://labs.quansight.org/blog/scipy-array-api)
for more details).

Now that a good chunk of scipy supports Array API inputs, one interesting area to study is whether array API compatible
functions in scipy can support lazy input such as dask or jax arrays. This is one area that has been purposefully left out
of the current array API spec as an open question, and investigating the feasibility of using lazy arrays via array API
will help us better evolve the spec to help users get the most performance benefits out of these libraries. In addition,
supporting dask (the focus of this blog post) in scipy, will allow users to take advantage of dask's out-of-core
capabilities for handling larger than RAM datasets, and distributed computing capabilities for scaling code to multiple
compute nodes.

## Supporting `dask.array` within scipy

TODO: add a figure showing how array API support works in scipy

Like many other array libraries (e.g. PyTorch), `dask.array` is not fully array API compatible out of the box.
To work around these differences, scipy uses the [array-api-compat](https://github.com/data-apis/array-api-compat)
libary, which acts as a portability layer that wraps functions in various array namespaces to make them array API
compatible.

The wrapping done for dask can be found [here](https://github.com/data-apis/array-api-compat/pull/76).
While this resolved many incompabilities of existing `dask.array` functions with the array API standard, we were still
unable to implement some array API functionality since some functions (mostly in the linear algebra extension)
were unimplemented by dask.
(a list of failures can be found [here](https://github.com/data-apis/array-api-compat/blob/main/dask-xfails.txt))

With this, we were now ready to begin testing of dask arrays in scipy, which turned out to be a mixed bag initially.
While some functions worked perfectly with zero code change, others crashed completely due to incompabilities with
dask's lazy design or resulted in wrong answers.

After going through the failures, we were able to categorize them into 3 main areas.

### Dask failure modes

1. Data-dependent output shapes

   For the uninitiated [data-dependent output shapes](https://data-apis.org/array-api/latest/design_topics/data_dependent_output_shapes.html)
   occur when the shape of the resulting array from an array API operation is unknown, because it depends on the
   values of an input array.

   For example, when calling the [`unique_values`](https://data-apis.org/array-api/latest/API_specification/generated/array_api.unique_values.html)
   function on an input array, the length of the output array will be dependent on the number of unique values appearing
   in the input array. Another common case of data-dependent output shapes, and the one we see the most in scipy, comes
   from the indexing with a boolean mask in numpy. When writing idiomatic numpy code, it is common to use a boolean mask
   for selecting a subset of items via `__getitem__` (i.e. `x[mask]`), or to set items according to the mask (i.e. `x[mask] = y`).
   Because the number of items to get/sets depends on the number of True values in the mask, this is a data-dependent operation.

   While some libraries like numpy or PyTorch can handle data-dependent output shapes, jitted/lazy libraries such as dask,
   jax, or MLX do not support these operations, and it is necessary to rewrite functions to avoid these operations if
   possible.

   In scipy, the lack of data-dependent output shapes makes up the majority of failures for dask, so fixing this issue
   is essential to have good support for dask arrays in scipy.

   ** Avoiding data-dependent output shapes **

   In order to avoid using data-dependent output shapes when setting array elements,
   one can use the [where](https://data-apis.org/array-api/latest/API_specification/generated/array_api.where.html)
   function from the array API spec.

   e.g.

```diff
- x[mask] = y
+ xp = array_namespace(x)
+ x = xp.where(mask, y, x)
```

Avoiding data-dependent output shapes in other cases (e.g. `__getitem__` with a boolean mask) is more non-trivial,
and remains an open question to be resolved.

2. Use of non array API features

   A good chunk of tests also failed due to the use of operations that were not part
   of the Array API.

   One example of this was in modules using C routines, that would rely
   on implicit conversions to numpy via the `__array__` dunder when calling
   a numpy function on an input array. This didn't always work for dask, as sometimes dask would
   call its own implementation of a numpy function via [NEP18 dispatching](https://numpy.org/neps/nep-0018-array-function-protocol.html),
   leading to a crash later on when a dask array was passed to a C extension module that expected numpy arrays.
   Fortunately, the fix to this issue was simple enough - by manually casting to numpy via `np.asarray`, we were able to
   prevent NEP18 dispatching, and make the previously failing tests pass.

   Another failure case occured due to lack of support for numpy specific keywords in functions.
   Some scipy modules (e.g. `scipy.ndimage`) allow a user to

3. Miscellaneous failures (e.g. spurious warnings, incompatible/wrong tests)

   Finally, a small portion of tests failed due to miscellaneous issues such as `RuntimeWarning`s emitted by
   dask for NaNs/invalid values in data, and bad interactions with other libraries tested in the test suite
   (e.g. matplotlib).

### Current support

TODO: finish filling out the notes in this table

| Module              | Status | Notes                                                                                        |
| ------------------- | ------ | -------------------------------------------------------------------------------------------- |
| scipy.cluster       | 🚧     |                                                                                              |
| scipy.constants     | ✅     |                                                                                              |
| scipy.datasets      | ✅     |                                                                                              |
| scipy.differentiate | ❌     |                                                                                              |
| scipy.fft           | ✅     |                                                                                              |
| scipy.io            | ✅     |
| scipy.integrate     | ❌     |
| scipy.linalg        | ✅     | All current Array API compatible functions pass. Not all functions are dispatched right now. |
| scipy.optimize      | ❌     |
| scipy.ndimage       | 🚧     |
| scipy.signal\*      | 🚧     |
| scipy.special       | ✅     |                                                                                              |
| scipy.stats\*       | 🚧     |                                                                                              |

`*` - Some public API functions/methods in this module have not yet been ported to the Array API standard.
(Status refers to the status of dask.array with )
See [here](https://scipy.github.io/devdocs/dev/api-dev/array_api.html#currently-supported-functionality)
for a list of supported functions/methods.

As of today, the `scipy.fft/special/stats` modules have the best support for dask arrays today, and are able to
output lazy dask arrays without forcing computation, as they can be fully expressed using array API operations.

While dask arrays are mostly supported in modules such as `scipy.ndimage/signal`, the bulk of the computation in those
modules is done by C routines (which requires a conversion to numpy that forces computation of the lazy dask array early).

In the next section, we will take a look more closely at how array API compatibility enables better performance with
dask arrays within the `scipy.stats` module.

## Case study: Out of core/Distributed computing in `scipy.stats` via dask

TODO!

## Future Work

While we've made great progress in enabling support for `dask.array` within scipy, a lot of work remains
to be done to fully enable scipy support for dask arrays. In particular, we'd like to circle back and fix modules,
such as `scipy.integrate` and `scipy.differentiate` that were skipped in the initial port of array API compatible
modules to support dask.array.

Looking forward, we'd also like to enable `dask.array` support via the Array API in other Array API
compatible libraries, most notably scikit-learn. A previous
[attempt](https://github.com/scikit-learn/scikit-learn/pull/28588) to add array API support within scikit-learn stalled
despite initial successes e.g. with getting functions like `sklearn.model_selection.train_test_split` working with dask
due to poor/missing support for features that scikit-learn used heavily such as data-dependent output shapes and sorting.
Given the lessons learned from getting dask to work with scipy, it should be possible to revisit that PR and support using
dask with more of the scikit-learn API via the Array API specification.

## Acknowledgments

I'd like to thank [Ralf Gommers](https://github.com/rgommers) for introducing me to the Array API
standard and guiding me on contributing to the adoption of the Array API standard. I'd also like to thank
[Lucas Colley](https://github.com/lucascolley), [Guido Imperiale](https://github.com/crusaderky), and
[Aaron Meurer](https://github.com/asmeurer) for providing feedback and reviewing my PRs to
scipy and array-api-compat.

This work was supported by a grant from NASA to Pandas, scikit-learn, SciPy and
NumPy under the NASA ROSES 2020 program.
