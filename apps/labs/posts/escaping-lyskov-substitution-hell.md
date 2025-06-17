---
title: "Escaping Lyskov Substitution Contravariance Hell"
published: June 17, 2025
authors: [marco-gorelli]
description: "Protocols, Generics, and TypeVars"
category: [Developer workflows]
featuredImage:
  src: /posts/duckdb-when-used-to-frames/featured.jpg
  alt: 'Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/brown-and-green-mallard-duck-on-water--ZSnI9gSX1Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
hero:
  imageSrc: /posts/duckdb-when-used-to-frames/hero.jpg
  imageAlt: 'Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/brown-and-green-mallard-duck-on-water--ZSnI9gSX1Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'

---

# Escaping Lyskov Substitution Contravariance Hell

Ever used a Python typechecker (like MyPy or PyRight) and got a frustrating error message like

```console
main.py:22: error: Argument 1 of "[...]" is incompatible with supertype "[...]"; supertype defines the argument type as "[...]"  [override]
main.py:22: note: This violates the Liskov substitution principle
```

?

Let's learn about how to address it!

## How it might happen

Suppose you want to write some common utility functions for dealing with vegetables. You want to define:

- A `Vegetable` base class.
- A `VegetablePeeler` base class, with a `peel` method.

A `VegetablePeeler` should be able to peel a `Vegetable` of the appropriate type. For example:

- A `PotatoPeeler` can peel a `Potato`.
- A `CarrotPeeler` can peel a `Carrot`.

Very well then, you get started, and come up with:

```python
from typing import Protocol

class Vegetable(Protocol): ...

class VegetablePeeler(Protocol):
    def peel(self, vegetable: Vegetable) -> Vegetable:
        ...
    
class Carrot(Vegetable):
    ...

class CarrotPeeler(VegetablePeeler):
    def peel(self, vegetable: Carrot) -> Carrot:
        return vegetable
```

Looks legit. Problem is, if we run MyPy on it, we get:

```console
main.py:13: error: Argument 1 of "peel" is incompatible with supertype "VegetablePeeler"; supertype defines the argument type as "Vegetable"  [override]
main.py:13: note: This violates the Liskov substitution principle
main.py:13: note: See https://mypy.readthedocs.io/en/stable/common_issues.html#incompatible-overrides
Found 1 error in 1 file (checked 1 source file)
```

Hmmm... if `peel` expects a vegetable for the argument `vegetable`, and `Carrot` is a `Vegetable`, then why is MyPy complaining that I have an incompatible type? Let's provide an answer on two levels:

- The technical answer is that `Callable` is contravariant in the function arguments, and so `Callable[[Carrot], ...]` isn't assignable to `Callable[[Vegetable], ...]`.
- A more intuitive answer is: a carrot peeler can only peel carrots, not necessarily arbitrary vegetables.

## Hacky answer: use `Any`

Given that the assignment above isn't valid, you may think that you need to use `Any` in the `VegetablePeeler.peel` method, and then `CarrotPeeler` can use `Carrot`:

```py
from typing import Any, Protocol

class Vegetable(Protocol): ...

class VegetablePeeler(Protocol):
    def peel(self, vegetable: Any) -> Vegetable:
        ...
    
class Carrot(Vegetable):
    ...

class CarrotPeeler(VegetablePeeler):
    def peel(self, vegetable: Carrot) -> Carrot:
        return vegetable
```

This is enough to appease MyPy and PyRight.

But wait.

Surely we can do better? What if we try defining a `PotatoPeeler` and accidentally give it a nonsense type for `vegetable`, such as:

```py
class CarrotPeeler(VegetablePeeler):
    def peel(self, vegetable: int) -> Carrot:
        return vegetable
```

In this case...type checkers would not complain. The erroneous type might be caught somewhere else in the code, or by a runtime test. However, I prefer to get all the help I can from tools before running tests - given that a better solution exists, let's learn how to implement it!

## Generic vegetable peelers

The solution involves making `VegetablePeeler` generic. That is to say, we can't just implement a `VegetablePeeler`, we also need to declare which vegetable it's allowed to peel.

```py
from typing import Generic, Protocol, TypeVar

class Vegetable(Protocol): ...

VegetableT = TypeVar('VegetableT', bound=Vegetable)

class VegetablePeeler(Protocol[VegetableT]):
    def peel(self, vegetable: VegetableT) -> VegetableT:
        ...
    
class Carrot(Vegetable):
    ...

class CarrotPeeler(VegetablePeeler[Carrot]):
    def peel(self, vegetable: Carrot) -> Carrot:
        return vegetable
```

And voila, type-checkers are satisfied!

```console
Success: no issues found in 1 source file
```

## What's a real-world example where this is useful?

A real-world example where this concept shows up is the library [Narwhals](github.com/narwhals-dev/narwhals). There, we define some protocols such as `CompliantDataFrame` and `CompliantSeries`, which can then be implemented by different backends:

- For PyArrow, we implement `ArrowDataFrame` and `ArrowSeries`.
- For Polars, we implement `PolarsDataFrame` and `PolarsSeries`.
- ...

Now, `CompliantDataFrame` has some methods which accept `CompliantSeries` as arguments, such as:

```py
class CompliantDataFrame:
    # [...]
    def __getitem__(self, item: CompliantSeries) -> Self:
        # [...]
```

In order to allow `ArrowDataFrame.__getitem__` to accept `ArrowSeries` for `item`, and for `PolarsDataFrame.__getitem__` to accept `PolarsSeries` for `item`, we make `CompliantDataFrame` generic in `CompliantSeriesT`, which is a `TypeVar` bound to `CompliantSeries`.

## Conclusion, and how to improve

We've learned about how to address a common situation in which mysterious words like "Lyskov Substitution" and "contravariance" make it feel like the only way to appease type checkers is to stick `Any` everywhere. If you'd like to improve your understanding of static typing, I'd suggest playing around with the [MyPy playground](https://mypy-play.net/), creating minimal examples, and trying to break them. Sometimes you really do need to slap an `Any` on a variable, but by reducing the number of cases where that's necessary, you can sus out issues as quickly as possible without even needing to execute your code.
