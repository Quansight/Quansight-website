---
title: "Escaping Contravariance Hell"
published: June 17, 2025
authors: [marco-gorelli]
description: "Protocols, Generics, and TypeVars"
category: [Developer workflows]
featuredImage:
  src: /posts/escaping-lyskov-substitution-hell/featured.png
  alt: 'Picture which says "Escaping covariance hell", overlaid on Google Street View image of Hell, Norway'
hero:
  imageSrc: /posts/escaping-lyskov-substitution-hell/hero.png
  imageAlt: 'Picture which says "Escaping covariance hell", overlaid on Google Street View image of Hell, Norway'

---

# Escaping Contravariance Hell

Ever used a Python typechecker (like mypy or PyRight) and got a frustrating error message like

```console
main.py:22: error: Argument 1 of "[...]" is incompatible with supertype "[...]"; supertype defines the argument type as "[...]"  [override]
main.py:22: note: This violates the Liskov substitution principle
```

?

If you look or ask around for help, you'll likely end up with an explanation along the lines of:

> `Callable` is contravariant in its parameters. Just because `A` is a subtype of `B` doesn't mean that `Callable[[A], ...]` is a subtype of `Callable[[B], ...]`.

There's an [nice explanation of what this means in the mypy docs](https://mypy.readthedocs.io/en/latest/generics.html#variance-of-generic-types), which I encourage all readers to study. But today's post isn't about understanding contravariance - it's about dealing with it.

We'll look at one situation when contravariance creates issues, and we'll learn about what to do about it. By the end, you'll no longer fear type checker error messages related to variance!

## How it might happen

Suppose you write some common utility functions for dealing with vegetables, and define:

- A `Vegetable` base class.
- A `VegetablePeeler` base class, with a `peel` method which accepts a `Vegetable` argument.

You'd like to let `VegetablePeeler` peel a `Vegetable` of the appropriate type. For example:

- A `PotatoPeeler` can peel a `Potato`.
- A `CarrotPeeler` can peel a `Carrot`.

You get started, and come up with:

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

Looks legit. Problem is, if we run mypy on it, we get:

```console
main.py:13: error: Argument 1 of "peel" is incompatible with supertype "VegetablePeeler"; supertype defines the argument type as "Vegetable"  [override]
main.py:13: note: This violates the Liskov substitution principle
main.py:13: note: See https://mypy.readthedocs.io/en/stable/common_issues.html#incompatible-overrides
Found 1 error in 1 file (checked 1 source file)
```

This is the contravariance issue mentioned earlier: just because `Carrot` is a subtype of `Vegetable` doesn't mean that `Callable[[Carrot], ...]` is a subtype of `Callable[[Vegetable], ...]`. We feel like our code is valid though - `CarrotPeeler` should be able to peel `Carrot`s.

Indeed, we've entered "contravariance hell": the type checker is telling us that our code is invalid because of contravariance, although intuitively we feel like our code _should_ be valid. Let's look at solutions.

## Not-recommended solution: use `Any`

Given that the assignment above isn't valid, you may think that you need to use `Any` in the `VegetablePeeler.peel` method, and then `CarrotPeeler` in the `Carrot.peel` method:

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

This is enough to appease mypy and PyRight...

🛑 ...but wait!

Any time you use `Any`, you're turning off the type checker for some portion of your code, and so type checking won't be effective as it could be. Surely there's a better solution?

## Generic vegetable peelers

The solution involves making `VegetablePeeler` generic. That is to say, we don't just implement a `VegetablePeeler`, we also declare which vegetable it can peel.

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

A real-world example where this concept shows up is the library [Narwhals](github.com/narwhals-dev/narwhals). There, we find protocols `CompliantDataFrame` and `CompliantSeries` which are implemented for different backends:

- For PyArrow, there's `ArrowDataFrame` and `ArrowSeries`.
- For Polars, there's `PolarsDataFrame` and `PolarsSeries`.
- Similarly, for other backends.

Now, `CompliantDataFrame` has some methods which accept `CompliantSeries` as parameters, such as:

```py
class CompliantDataFrame:
    # [...]
    def __getitem__(self, item: CompliantSeries) -> Self:
        # [...]
```

The library requires that `ArrowDataFrame.__getitem__` accepts `ArrowSeries` for `item`, and that `PolarsDataFrame.__getitem__` accepts `PolarsSeries` for `item`. To do this, `CompliantDataFrame` is made generic in `CompliantSeriesT`, which is a `TypeVar` bound to `CompliantSeries`. Like this, type checkers are appeased, and certain kinds of bugs can be sussed out before even running the code!

## Conclusion, and how to improve

We've learned about how to address a common situation in which mysterious words like "Lyskov Substitution" and "contravariance" make it feel like the only way to appease type checkers is to slap a bunch `Any` types all over the place. We then looked at how to resolve the issue using `Generic` and `TypeVar`. If you'd like to improve your understanding of static typing, I'd suggest playing around with the [mypy playground](https://mypy-play.net/), creating minimal examples, and then trying to break them. By reducing the number of cases where you need to use `Any`, your IDE (interactive development environment) will provide you with helpful suggestion before you even run your code, and you'll leverage type checkers to their full potential.

If you'd like help with advanced static typing, [we can help](https://quansight.com/about-us/#bookacallform)!
