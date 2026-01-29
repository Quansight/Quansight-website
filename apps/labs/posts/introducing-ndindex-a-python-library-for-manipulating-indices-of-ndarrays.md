---
title: 'Introducing ndindex, a Python library for manipulating indices of ndarrays'
published: April 4, 2020
authors: [aaron-meurer]
description: 'ndindex is a new library that provides high level objects representing the various objects that can index NumPy arrays. These objects automatically canonicalize under the assumption of NumPy indexing semantics, and can be manipulated with a uniform API. All ndindex types have a .args that can be used to access the arguments used to create the object, and they are all hashable.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/introducing-ndindex-a-python-library-for-manipulating-indices-of-ndarrays/blog_feature_var1.png
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/introducing-ndindex-a-python-library-for-manipulating-indices-of-ndarrays/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

One of the most important features of NumPy arrays is their indexing
semantics. By "indexing" I mean anything that happens inside square brackets,
for example, `a[4::-1, 0, ..., [0, 1], np.newaxis]`. NumPy's index semantics
are very expressive and powerful, and this is one of the reasons the library
is so popular.

Index objects can be represented and manipulated directly. For example, the
above index is `(slice(4, None, -1), 0, Ellipsis, [0, 1], None)`. If you are
any author of a library that tries to replicate NumPy array semantics, you
will have to work with these objects. However, they are often difficult to
work with:

- The different types that are valid indices for NumPy arrays do not have a
  uniform API. Most of the types are also standard Python types, such as
  `tuple`, `list`, `int`, and `None`, which are usually unrelated to indexing.

- Those objects that are specific to indexes, such as `slice` and `Ellipsis`
  do not make any assumptions about their underlying semantics. For example,
  Python lets you create `slice(None, None, 0)` or `slice(0, 0.5)` even though
  `a[::0]` and `a[0:0.5]` would be always be an `IndexError` on a NumPy array.

- Some index objects, such as `slice`, `list`, and `ndarray` are not hashable.

- NumPy itself does not offer much in the way of helper functions to work with
  these objects.

These limitations may be annoying, but are easy enough to live with. The real
challenge when working with indices comes when you try to manipulate them.
Slices in particular are challenging to work with because the rich meaning of
slice semantics. Writing formulas for even very simple things is a real
challenge with slices. `slice(start, stop, step)` (corresponding to
`a[start:stop:step]`) has fundamentally different meaning depending on whether
`start`,`stop`, or `step` are negative, nonnegative, or `None`. As an example,
take `a[4:-2:-2]`, where `a` is a one-dimensional array. This slices every
other element from the third element to the second from the last. What will
the shape of this sliced array be? The answer is `(0,)` if the original shape
is less than 1 or greater than 5, and `(1,)` otherwise.

Code that manipulates slices will tend to have a lot of `if`/`else` chains for
these different cases. And due to 0-based indexing, half-open semantics,
wraparound behavior, clipping, and step logic, the formulas are often quite
difficult to write down.

## ndindex

This is where ndindex comes in. ndindex is a new library that provides high
level objects representing the various objects that can index NumPy arrays.
These objects automatically canonicalize under the assumption of NumPy
indexing semantics, and can be manipulated with a uniform API. All ndindex
types have a `.args` that can be used to access the arguments used to create
the object, and they are all hashable.

```py
>>> from ndindex import Slice, Integer, Tuple
>>> Slice(0, 3)
Slice(0, 3, 1)
>>> idx = Tuple(Slice(0, 10), Integer(0))
>>> idx.args
(Slice(0, 10, 1), Integer(0))
>>> [i.args for i in idx.args]
[(0, 10, 1), (0,)]
```

The goal of ndindex is to give 100% correct semantics as defined by NumPy's
ndarray. This means that ndindex will not make a transformation on an index
object unless it is correct for all possible input array shapes. The only
exception to this rule is that ndindex assumes that any given index will not
raise IndexError (for instance, from an out of bounds integer index or from
too few dimensions). For those operations where the array shape is known,
there is a `reduce` method to reduce an index to a simpler index that is
equivalent for the given shape.

## Features

ndindex is still a work in progress. The following things are currently
implemented:

- `Slice`, `Integer`, and `Tuple`

- Constructing a class puts it into canonical form. For example

  ```python
  >>> from ndindex import Slice
  >>> Slice(None, 12)
  Slice(0, 12, 1)
  ```

- Object arguments can be accessed with `idx.args`

  ```py
  >>> Slice(1, 3).args
  (1, 3, 1)
  ```

- All ndindex objects are hashable and can be used as dictionary keys.

- A real index object can be accessed with `idx.raw`. Use this to use an
  ndindex to index an array.

  ```py
  >>> s = Slice(0, 2)
  >>> from numpy import arange
  >>> arange(4)[s.raw]
  array([0, 1])
  ```

- `len()` computes the maximum length of an index over a given axis.

   ```py
   >>> len(Slice(2, 10, 3))
   3
   >>> len(arange(10)[2:10:3])
   3
   ```

- `idx.reduce(shape)` reduces an index to an equivalent index over an array
  with the given shape.

  ```py
  >>> Slice(2, -1).reduce((10,))
  Slice(2, 9, 1)
  >>> arange(10)[2:-1]
  array([2, 3, 4, 5, 6, 7, 8])
  >>> arange(10)[2:9:1]
  array([2, 3, 4, 5, 6, 7, 8])
  ```

The following things are not yet implemented, but are planned.

- `idx.newshape(shape)` returns the shape of `a[idx]`, assuming `a` has shape
  `shape`.

- `ellipsis`, `Newaxis`, `IntegerArray`, and `BooleanArray` types, so that all
  types of indexing are supported.

- `i1[i2]` will create a new ndindex `i3` (when possible) so that
  `a[i1][i2] == a[i3]`.

- `split(i0, [i1, i2, ...])` will return a list of indices `[j1, j2, ...]`
  such that `a[i0] = concat(a[i1][j1], a[i2][j2], ...)`

- `i1 + i2` will produce a single index so that `a[i1 + i2]` gives all the
  elements of `a[i1]` and `a[i2]`.

- Support [NEP 21 outer indexing and vectorized
  indexin](https://numpy.org/neps/nep-0021-advanced-indexing.html).

And more. If there is something you would like to see this library be able to
do, please [open an issue](https://github.com/Quansight-Labs/ndindex/issues). Pull
requests are welcome as well.

## Testing and correctness

The most important priority for a library like this is correctness. Index
manipulations, and especially slice manipulations, are complicated to code
correctly, and the code for them typically involves dozens of different
branches for different cases and formulas that can be difficult to figure out.

In order to assure correctness, all operations are tested extensively against
NumPy itself to ensure they give the same results. The basic idea is to take
the pure Python `index` and the `ndindex(index).raw`, or in the case of a
transformation, the before and after raw index, and index a `numpy.arange`
with them (the input array itself doesn't matter, so long as its values are
distinct). If they do not give the same output array, or do not both produce
the same error (like an `IndexError`), the code is not correct. For example,
the `reduce` method can be verified by checking that `a[idx.raw]` and
`a[idx.reduce(a.shape).raw]` produce the same sub-arrays for all possible
input arrays `a` and ndindex objects `idx`.

There are two primary types of tests that ndindex employs to verify this:

- **Exhaustive tests.** These test every possible value in some range. For
  example, `Slice` tests test all possible `start`, `stop`, and `step` values
  in the range [-10, 10], as well as `None`, on `numpy.arange(n)` for `n` in
  the range [0, 10]. This is the best type of test, because it checks every
  possible case. Unfortunately, it is often impossible to do full exhaustive
  testing due to combinatorial explosion.

  For example, here is the exhaustive test for `Slice.reduce`:

  ```py
  def _iterslice(start_range=(-10, 10), stop_range=(-10, 10), step_range=(-10, 10)):
    for start in chain(range(*start_range), [None]):
        for stop in chain(range(*stop_range), [None]):
            for step in chain(range(*step_range), [None]):
                yield (start, stop, step)

  def test_slice_reduce_exhaustive():
    for n in range(10):
        a = arange(n)
        for start, stop, step in _iterslice():
            try:
                s = Slice(start, stop, step)
            except ValueError:
                continue

            check_same(a, s.raw, func=lambda x: x.reduce((n,)))

            reduced = s.reduce((n,))
            assert reduced.start >= 0
            # We cannot require stop > 0 because if stop = None and step < 0, the
            # only equivalent stop that includes 0 is negative.
            assert reduced.stop != None
            assert len(reduced) == len(a[reduced.raw]), (s, n)
  ```

  `check_same` is a [helper
  function](https://github.com/Quansight-Labs/ndindex/blob/f8706a6fb6ffac879a0863cb93243f9bb14e6487/ndindex/tests/helpers.py#L60-L82)
  that ensures that two indices give either the exact same subarray or raise
  the exact same exception. The test checks all `a[start:stop:step]` where
  `a` is an array with shape from 0 to 10, and `start`, `stop`, and `step`
  range from -10 to 10 or `None`. We also test some basic invariants, such
  as that `Slice.reduce` always returns a slice with non-None arguments and
  that the start is nonnegative, and that the length of the slice is
  minimized for the given shape.

  This test takes about 4 seconds to run, and is about at the limit of what is
  possible with exhaustive testing. Other objects, in particular `Tuple`, have
  so many possible combinations that a similar exhaustive test for them would
  take billions of years to complete.

- **Hypothesis tests.**
  [Hypothesis](https://hypothesis.readthedocs.io/en/latest/index.html) is a
  library that can intelligently check a combinatorial search space of inputs.
  This requires writing Hypothesis strategies that can generate all the
  relevant types of indices. All ndindex tests have Hypothesis tests, even if
  they are also tested exhaustively.

  The Hypothesis test for the above test looks like this

  ```py
  from hypothesis import assume
  from hypothesis.strategies import integers, composite, none, one_of, lists

  # hypothesis.strategies.tuples only generates tuples of a fixed size
  @composite
  def tuples(draw, elements, *, min_size=0, max_size=None, unique_by=None,
             unique=False):
      return tuple(draw(lists(elements, min_size=min_size, max_size=max_size,
                              unique_by=unique_by, unique=unique)))

  # Valid shapes for numpy arrays. Filter out shapes that would fill memory.
  shapes = tuples(integers(0, 10)).filter(lambda shape: prod([i for i in shape if i]) < 100000)

  @composite
  def slices(draw, start=ints(), stop=ints(), step=ints()):
      return slice(
          draw(one_of(none(), start)),
          draw(one_of(none(), stop)),
          draw(one_of(none(), step)),
      )

  @given(slices(), shapes)
  def test_slice_reduce_hypothesis(s, shape):
      a = arange(prod(shape)).reshape(shape)
      try:
          s = Slice(s)
      except ValueError:
          assume(False)

      check_same(a, s.raw, func=lambda x: x.reduce(shape))

      try:
          reduced = s.reduce(shape)
      except IndexError:
          # shape == ()
          return
      assert reduced.start >= 0
      # We cannot require stop > 0 because if stop = None and step < 0, the
      # only equivalent stop that includes 0 is negative.
      assert reduced.stop != None
      assert len(reduced) == len(a[reduced.raw]), (s, shape)
  ```

  In order to tell Hypothesis how to search the example space, we must define
  some functions to tell it how to draw example objects of a given type, in
  this case, slices and shape parameters for NumPy arrays. These strategies,
  as they are called, can be reused for multiple tests. Hypothesis then
  automatically and intelligently draws examples from the sample space to try
  to find one that fails the test. You can think of Hypothesis as a fuzzer, or
  as an "automated QA engineer". It tries to pick examples that are most
  likely to hit corner cases or different branch conditions.

Why bother with Hypothesis if the same thing is already tested exhaustively?
The main reason is that Hypothesis is much better at producing human-readable
failure examples. When an exhaustive test fails, the failure will always be
from the first set of inputs in the loop that produces a failure. Hypothesis
on the other hand attempts to "shrink" the failure input to smallest input
that still fails. For example, a failing exhaustive slice test might give
`Slice(-10, -9, -10)` as a the failing example, but Hypothesis would shrink it
to `Slice(-2, -1, -1)`.

Another reason for the duplication is that Hypothesis can sometimes test a
slightly expanded test space without any additional consequences. For example,
the above Hypothesis tests all types of array shapes, whereas the exhaustive
test tests only 1-dimensional shapes. This doesn't affect things because
Hypothesis will always shrink large shapes to a 1-dimensional shape in the
case of a failure, and it has the benefit of ensuring the code works correctly
for larger shapes (it should always slice over the first index, or in the case
of an empty shape raise `IndexError`).

## Try it out

You can install ndindex with pip or from conda-forge

    conda install -c conda-forge ndindex

The documentation can be found [here](https://quansight-labs.github.io/ndindex/),
and the development is on [GitHub](https://github.com/Quansight-Labs/ndindex).
Please try the library out and
[report](https://github.com/Quansight-Labs/ndindex/issues) any issues you have, or
things you would like to see implemented. We are also looking for people who
are interested in using the library and for people who are interested in
contributing to it.
