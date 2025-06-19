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

Ever used a Python typechecker (like mypy or Pyright) and got a frustrating error message like

```console
main.py:22: error: Argument 1 of "[...]" is incompatible with supertype "[...]"; supertype defines the argument type as "[...]"  [override]
main.py:22: note: This violates the Liskov substitution principle
```

?

Today, we'll learn about a situation in which this can arise, why contravariance is the underlying issue, and how to deal with it.

## Contra-what? What's contravariance?

We often learn better with examples than with highly accurate explanations, so let's make sense of covariance with an example. Let's define a `Vegetable` [protocol](https://typing.python.org/en/latest/spec/protocol.html), and a `Carrot` which inherits from it.

```python
from typing import Protocol

class Vegetable(Protocol): ...

class Carrot(Vegetable):
    ...
```

Now, try adding the following lines of code and [running a type checker on it](https://mypy-play.net/?mypy=latest&python=3.12&gist=1f6c4c2433e7247a7003fb7312aeecda):

```python
vegetable: Vegetable = Carrot()
```

You should see something like:

```python
Success: no issues found in 1 source file
```

However, if you write the following

```py
from typing import Callable

def carrot_func(vegetable: Carrot) -> None:
    return None

# Note: `Callable[[Vegetable], None]` means: "a function which 
# accepts an argument of type `Vegetable` and returns `None`.
vegetable_func: Callable[[Vegetable], None] = carrot_func
```

Then mypy will complain!

```console
main.py:13: error: Incompatible types in assignment (expression has type "Callable[[Carrot], None]", variable has type "Callable[[Vegetable], None]")  [assignment]
Found 1 error in 1 file (checked 1 source file)
```

Here's an intuitive explanation of why it fails:

- If you want a vegetable and I give you a carrot, you'll be happy.
- If you want a function which works on all vegetables and I give you a tool which only works on carrots, you'll be disappointed. This is why mypy rejects the second example (with `vegetable_func`) but not the first (with just `vegetable`).

More technically, the reason we can't assign `Callable[[Carrot], None]` to `Callable[[Vegetable], None]` is that `Callable` is [contravariant](https://mypy.readthedocs.io/en/stable/generics.html#variance-of-generics) in its parameters: just because `A` is a subtype of `B` doesn't mean that `Callable[[A], ...]` is a subtype of `Callable[[B], ...]`. In fact, `Callable[[B], ...]` is a subtype of `Callable[[A], ...]`!

But why does this matter? We'll now look at a situation where this issue can arise, and we'll learn about what to do about it. By the end, you'll no longer fear type checker error messages related to variance!

## How it might happen

In addition to `Vegetable`, let's also define a `VegetablePeeler` protocol, which has a `peel` method which accepts a `Vegetable` argument. We'd like to let `VegetablePeeler` peel a `Vegetable` of the appropriate type. For example:

- A `PotatoPeeler` can peel a `Potato`.
- A `CarrotPeeler` can peel a `Carrot`.

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

If we [run mypy on it](https://mypy-play.net/?mypy=latest&python=3.12&gist=32a73fcca2b275b74e81e8cc21dd265b), we get:

```console
main.py:13: error: Argument 1 of "peel" is incompatible with supertype "VegetablePeeler"; supertype defines the argument type as "Vegetable"  [override]
main.py:13: note: This violates the Liskov substitution principle
main.py:13: note: See https://mypy.readthedocs.io/en/stable/common_issues.html#incompatible-overrides
Found 1 error in 1 file (checked 1 source file)
```

This is the contravariance issue mentioned earlier: just because `Carrot` is a subtype of `Vegetable` doesn't mean that `Callable[[Carrot], ...]` is a subtype of `Callable[[Vegetable], ...]`.

I like to think of this as "contravariance hell":

- The type checker complains because `Callable` is contravariant. OK, fair enough, we're not going to argue with the theory.
- At the same time, we know that we will only ever use `CarrotPeeler` to peel `Carrot`, we won't use it to peel arbitrary vegetables.

We know that what we're doing is safe, so how can get the type checker to just leave us alone and stop complaining?

## Not-recommended solution: use `Any`

Given that the assignment above isn't valid, you may be tempted to use `Any` in the `VegetablePeeler.peel` method, and then `CarrotPeeler` in the `Carrot.peel` method:

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

This is enough to appease mypy and Pyright...

🛑 ...but wait!

Any time you use `Any`, you're turning off the type checker for some portion of your code, and so type checking won't be effective as it could be. Surely there's a better solution?

## Generic vegetable peelers

For a better solution, we can make `VegetablePeeler` generic. When implementing a `VegetablePeeler`, we also have to declare which vegetable it is allowed to peel.

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
- ...similar patterns exist for other dataframe backends like pandas, DuckDB, and more.

The `CompliantDataFrame` protocol has some methods which accept `CompliantSeries` as parameters, such as:

```py
class CompliantDataFrame:
    # [...]
    def __getitem__(self, item: CompliantSeries) -> Self:
        # [...]
```

Narwhals requires that `ArrowDataFrame.__getitem__` accepts `ArrowSeries` for `item`, and that `PolarsDataFrame.__getitem__` accepts `PolarsSeries` for `item`. To enforce this, `CompliantDataFrame` is defined as generic in `CompliantSeriesT`, which is a `TypeVar` bound to `CompliantSeries`. Like this, type checkers are appeased, and certain kinds of bugs can be sussed out before even running the code!

## Conclusion, and how to improve

We've learned about how to address a situation in which mysterious words like "Lyskov Substitution" and "contravariance" make it feel like the only way to appease type checkers is to slap a bunch `Any` types all over the place. We then looked at how to resolve the issue using `Generic` and `TypeVar`. By reducing the number of cases where you need to use `Any`, your IDE (interactive development environment) will provide you with helpful suggestion before you even run your code, and you'll leverage type checkers to their full potential.

Where should you go from here?

- If you'd like to improve your understanding of static typing, I'd suggest playing around with the [mypy playground](https://mypy-play.net/), creating minimal examples, and then trying to break them.
- If you want supercharged type-checking, we also recommend keeping an eye on [ty](https://github.com/astral-sh/ty) and [Pyrefly](https://github.com/facebook/pyrefly) - neither is production ready as of writing, but both look very promising!

If you'd like help with advanced static typing, or with other issues related to the Python scientific ecosystem [we can help](https://quansight.com/about-us/#bookacallform)!
