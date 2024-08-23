---
title: 'The convoluted story behind `np.top_k`'
authors: [jules-poon]
published: July 19, 2024
description: 'In this blog post, I describe my experience as a first-time contributor to NumPy and talk about the story behind `np.top_k`.'
category: [OSS Experience, Array API]
featuredImage:
  src: /posts/convoluted-story-behind-topk/NumPy_logo_2020_hero.webp
  alt: 'NumPy Logo retrieved from Wikipedia Commons'
hero:
  imageSrc: /posts/convoluted-story-behind-topk/NumPy_logo_2020.webp
  imageAlt: 'NumPy Logo retrieved from Wikipedia Commons'
---

In this blog post, I describe my experience as a first-time contributor and talk about the story behind `np.top_k`.

---

Hi~ I'm [Jules Poon](https://juliapoo.github.io/), a Year 2 undergraduate at the National University of Singapore. This summer I had the incredible opportunity to join the Open Source internship program at Quansight Labs, under the mentorship of [Ralf Gommers](https://github.com/rgommers), [Nathan Goldbaum](https://github.com/ngoldbaum) and [Matti Picus](https://github.com/mattip) for work on NumPy, and [Evgeni Burovski](https://github.com/ev-br) for work
on SciPy.

My task for NumPy is quite generic: To contribute to NumPy. While I find myself in a position similar to many people just beginning in open source, I had two important advantages: recommendations of good starting issues and direct access to maintainers for discussion. These factors made it easier compared to starting as a new contributor alone. Hopefully, this blog post can help somebody just starting with open-source to navigate projects and understand the process behind the decisions made in open-source projects.

First, I want to go through some tips for contributing to NumPy.

## Contributing to NumPy

NumPy is a massive project, so it is easy to get lost when starting. The NumPy documentation has friendly [developer documentation](https://numpy.org/devdocs/dev/index.html) that any contributor should read, such as the [Contributor Guide](https://numpy.org/contribute/) and the [Suggested Workflow](https://numpy.org/devdocs/dev/development_workflow.html).

In addition to the NumPy developer documentation and the Python API documentation, I found the [C-API Documentation](https://numpy.org/devdocs/reference/c-api/index.html) to be incredibly useful for understanding the C portion of the codebase, as well as this [NumPy Internals Page](https://numpy.org/doc/stable/dev/internals.html).

As a contributor, it might be difficult to know what to work on. Aside from looking at the [issues page](https://github.com/numpy/numpy/issues/) of the repository, one can look through recent [NumPy Enhancement Proposals](https://numpy.org/neps/) and the [Current Roadmap](https://numpy.org/neps/roadmap.html) to both get an idea of the more long-term goals of the project and find things you wish to dive into.

Lastly, to catch up on existing discussions or to create new ones, in addition to the repository's issues and PR pages, one can look through (and join) the [Mailing List](https://mail.python.org/mailman3/lists/numpy-discussion.python.org/). The Mailing List also announces the details of the biweekly community meetings where you can ask questions and discuss details.

## My Contributions

Throughout the 1.5 months working on NumPy, I made incremental improvements to the tests, documentation, CI, and submitted bug fixes. I also worked on furthering the discussion for `np.top_k` and drafted implementations, and I want to talk more about the process behind that.

### Reviewing Community Discussions

The discussions for `np.top_k` started from [gh-15128 Feature request: Allow np.argmax to output top K maximum values](https://github.com/numpy/numpy/issues/15128) in 2019 where multiple people expressed their request for having this feature in NumPy. Furthermore, Ralf mentioned that it's the 6th-highest feature request in the whole issue tracker as measured by 👍🏼 emojis.

Seemingly independently, a thread was opened by [@quarrying](https://github.com/quarrying) in the mailing list in May 2021 [EHN: Discusions about 'add numpy.topk'](https://mail.python.org/archives/list/numpy-discussion@python.org/thread/F4P5UVTAKRJJ3OORI6UOWFSUEE5CNTSC/) with a corresponding PR [gh-19117 EHN: add numpy.topk](https://github.com/numpy/numpy/pull/19117).

Reading through the discussions, many people pointed out that such a feature is common across multiple array providers (such as PyTorch, TensorFlow, JAX, etc), and the feature is commonly named `top_k` or `topk`. In fact, the week before the mailing list thread was opened, `top_k` was [identified as a common API across array libraries](https://github.com/data-apis/array-api/issues/187).

There were some discussions of whether NumPy's API should use `top_k` or `topk`. Some prefer `top_k` as `topk` might be interpreted as "to pk", and considering it will be in the `numpy` namespace, it is a likely interpretation.

There were also some suggestions to include an additional function `argtop_k` in the same spirit as `argsort` and `argpartition`.

Outside of `numpy`, Athan opened a PR on `array-api` [gh-722 Add API specifications for returning the k largest elements](https://github.com/data-apis/array-api/pull/722) in Dec 2023 proposing three new functions to be added into the specification: `top_k`, `top_k_indices` and `top_k_values`, along with a detailed analysis of the rational and considerations.

With all these discussions, I took a stab at coming up with an implementation that makes the most sense.

### First Attempt at Implementation

Here's the signature I came up with for `top_k`:

```py
def top_k(
    x: array,
    k: int,
    /,
    *,
    axis: Optional[int] = None,
    mode: Literal["largest", "smallest"] = "largest",
) -> Tuple[array, array]
    """
    Returns the ``k`` largest/smallest elements and corresponding
    indices along the given ``axis``.

    When ``axis`` is None, a flattened array is used.

    If ``largest`` is false, then the ``k`` smallest elements are returned.

    A tuple of ``(values, indices)`` is returned, where ``values`` and
    ``indices`` of the largest/smallest elements of each row of the input
    array in the given ``axis``.

    Parameters
    ----------
    a: array_like
        The source array
    k: int
        The number of largest/smallest elements to return. ``k`` must
        be a positive integer and within indexable range specified by
        ``axis``.
    axis: int, optional
        Axis along which to find the largest/smallest elements.
        The default is -1 (the last axis).
        If None, a flattened array is used.
    largest: bool, optional
        If True, largest elements are returned.
        Otherwise the smallest are returned.

    Returns
    -------
    tuple_of_array: tuple
        The output tuple of ``(topk_values, topk_indices)``, where
        ``topk_values`` are returned elements from the source array
        (not necessarily in sorted order), and ``topk_indices`` are
        the corresponding indices.

    Notes
    -----
    The returned indices are not guaranteed to be sorted according to
    the values. Furthermore, the returned indices are not guaranteed
    to be the earliest/latest occurrence of the element. E.g.,
    ``np.top_k([3,3,3], 1)`` can return ``(array([3]), array([1]))``
    rather than ``(array([3]), array([0]))`` or
    ``(array([3]), array([2]))``.

    ...
    """
```

I decided on `np.top_k` as the name of the function, and against an additional function like `argtop_k` as there isn't a significant performance difference for just returning both the indices and values in one call (which Ralf agrees with).

I made heavy reference to the [array-api PR](https://github.com/data-apis/array-api/pull/722) and the notes there as well. Something I changed was to have `axis=-1` by default instead of the proposed `axis=None`. This follows `np.argpartition` and my own sensibility.

There were other open questions posed here as well which I had to resolve for the implementation of `top_k`. Since the NumPy implementation heavily relies on `np.argpartition`, I suggested that `np.top_k` should simply follow the behaviour of `np.argpartition`. For instance:

> Q: Should we be more strict in specifying what should happen when k exceeds the number of elements?
>
> A: `np.argpartition` does raise a `ValueError` when that happens, so yes.

> Q: How should `np.top_k` handle `NaN` values?
>
> A: `np.argpartition` (at this point in time) does not define the sort order of `np.nan`, even though `np.sort` does, so `np.top_k` shouldn't either.

The behaviour for `NaN` values will become a huge point of contention later.

### Feedback for the First Implementation

The performance of the implementation is good, being significantly faster than a full `np.sort`. However, [Jake Vanderplas](https://github.com/jakevdp) insists that `np.top_k` should clarify the behaviour of `NaN`s and not just leave it unspecified. [Sebastian Berg](https://github.com/seberg) pointed out two options on how to approach this:

1. Leave the sort order of `np.nan` unchanged (that it's the biggest element).
2. Always sort `np.nan` to the end.

The significance of Option 2 is that `np.top_k([1., np.nan], 1)` will return `1.` instead of `nan`, which is arguably preferable. This also follows dataframe libraries such as `pandas`.

However, Option 2 means that the sort order of `np.nan` is inconsistent: It is the biggest element when `largest=False`, and smallest when `largest=True`. Furthermore, this goes against the behaviour of `np.sort`.

This is further compounded by other datatypes that contain `NaN`s, such as complex numbers (e.g., `np.nan+1j`). `np.sort` resolves this with a lexicographical order with `np.nan > np.inf`.

At this point, my personal opinion was to leave the behaviour of `NaN`s undefined, just like `np.argpartition`, which, as Sebastian pointed out, is problematic as users will rely on the `NaN` behaviour anyways.

I have however traced through the code of `np.argpartition` and, by nature of `np.nan` failing all comparisons, the underlying IntroSelect algorithm ends up treating `np.nan` as the biggest element. I was unsure if this was intentional and the documentation of `np.argpartition` did not make this explicit, but I was open to defining the sort order of `np.nan` as the largest element.

We'll return to this issue later as in the meantime, Ralf suggested I make a PR into `array-api-compat` (part of the [Python Array API Standard](https://data-apis.org/array-api/latest/)) for `top_k` to establish any compatibility issues with other array providers.

### Python Array API Standard

Some background on the Array API Standard: The purpose behind this standard is so that array consumer libraries (like SciPy) can write array-provider-agnostic code that is compatible with this specification, rather than work with any particular provider's API. Examples of providers that aim to be fully compliant are NumPy, CuPy and PyTorch.

There are three repositories associated with the standard:

- [`array-api`](https://github.com/data-apis/array-api): Contains the specification.
- [`array-api-tests`](https://github.com/data-apis/array-api-tests/): Contains tests that providers run against to check compliance.
- [`array-api-compat`](https://github.com/data-apis/array-api-compat): Contains small wrappers around each provider to be compliant with the specification.

A great way to establish compatibility concerns for `top_k` with other array providers is to make a fork of `array-api` with a new specification for `top_k`, and similarly, fork `array-api-tests` and `array-api-compat` to write tests and compatibility layers for `top_k`. This makes it possible to test for subtle behaviour differences within the different array providers.

Ralf had hoped in particular that this would resolve the ordering of `NaN`s.

However, `array-api` does not specify the ordering of `NaN`s in sorting and searching functions. Hence, when writing the spec and tests for `top_k`, I too left `NaN`s unspecified (and also because I missed Ralf's comment until I started writing this post). Hence this endeavour did not resolve the `NaN` issue.

Despite this, the endeavour did show that there were no other compatibility concerns.

### NumPy Community Discussions

The discussions on the `NaN` ordering for `np.top_k` raised the issue that `np.partition` too, does not specify the `NaN` ordering. I opened a PR [gh-26716 DOC: Add clarifications np.argpartition](https://github.com/numpy/numpy/pull/26716) which clarified that `np.partition` does treat `NaN`s as the biggest element. With that merged, it is now justified to say that the current implementation of `np.top_k` follows the same sorting behaviour.

However, there was still an impasse about the `NaN` ordering, so Ralf brought up the topic on my behalf at the next NumPy community meeting, which I did not join as it was very late for my time zone.

Community meetings are great for these kinds of discussions since, in comparison to asynchronous conversations spread across, say, 4 threads, everything can happen in real-time.

The consensus from the meetings is that Option 2 (Sort `NaN`s to the back) is the more useful behaviour, so I set out to implement it.

However, while such behaviour is easy to implement for types that can be negated, as shown below,

```py
def top_k(a, k, /, *, axis=-1, largest=True):
    ...
    _arr = np.asanyarray(a)

    to_negate = largest and (
        np.dtype(_arr.dtype).char in np.typecodes["AllFloat"])
    if to_negate:
        # Push nans to the back of the array
        topk_values, topk_indices = top_k(-_arr, k, axis=axis, largest=False)
        return -topk_values, topk_indices

    # Actual implementation
    ...
```

I'm personally convinced that there is no pure-python way to implement this generally (e.g., for object arrays such as `np.array([np.uint8(1), np.nan], dtype=object)`). This is partly due to many other functions (like the ufunc `np.isnan`) not supporting object arrays.

Unfortunately, this is where the story for `np.top_k` stands. Hopefully, after the publication of this blog, `np.top_k` will find its place in some future version of NumPy.

### Conclusion

Contributing to open-source projects like NumPy has been an incredibly rewarding experience. Via working on `np.top_k`, I gained a better understanding of the complexities involved in developing and maintaining a widely-used library.

What can't be understated is the importance of open communication when working on Open Source. Feedback from experienced developers, collaborative discussions and insights from meetings are invaluable in shaping the final design and implementation.

## What now?

For the last two weeks of my internship, I took up another project under [Evgeni Burovski](https://github.com/ev-br) enhancing spline functions in SciPy. This project is pretty heavy on Mathematics, and while my background in Commutative Algebra helped, the computational aspects are completely new to me. I intend to see both `np.top_k` and this new project through.

Overall, this internship has been an incredible journey. I'd like to thank my mentors for their incredible support and guidance through this internship, and [Melissa Weber Mendonça](https://github.com/melissawm) for coordinating the internship program. I'm very grateful for the opportunity to learn from them.
