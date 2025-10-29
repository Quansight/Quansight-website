---
title: Creating a daft plugin for the Narwhals library
authors: [michele-pettinato]
published: October 20, 2025
description: 'On doing an open source internship & how we created a plugin for daft'
category: [PyData ecosystem, Community, Internship, OSS Experience]
featuredImage:
  src: /posts/oss-internship-creating-narwhals-daft-plugin/team.jpg
  alt: 'a team of children at sports practice doing a pre-match huddle'
hero:
  imageSrc: /posts/oss-internship-creating-narwhals-daft-plugin/team.jpg
  imageAlt: 'a team of children at sports practice doing a pre-match huddle'
---

# My Quansight Open Source Internship 2025: creating a Plugin for the Narwhals library

Have you ever watched a craftsperson at work, and found yourself mesmerised by their skilled actions and precise movements? It seems I'm not the only one, as legions of videos on the theme prove: "watch X pull Noodles seemingly in mid-air", "marvel at the steady progression of the stonemason", "get dizzy while watching the spindle transform a whole bag of wool" - you get the idea. Why are these videos so popular? I think it's because we are a fundamentally collaborative species, and something in us recognises mastery and is attracted to it, sometimes pushing us to try to acquire it. Now, substantiating that broad claim with evidence would not be the topic of a separate blogpost, but its own research program. But keep it in mind, as the idea does underpin what follows.

So how does someone mid-career find herself wanting to join an open source internship? Previous to my life in tech, I'd actually started out in Speech Science - no, not quite the ASR ([automatic speech recognition](https://en.wikipedia.org/wiki/Speech_recognition)) stuff, though we used some of it - the research behind e.g. hearing aid development or Speech and Language Therapy. Because of this, I'd always been interested in community efforts for science & sustainable code development.

I couldn't have wished for a better place to land. Quansight was a welcoming, open place and my fellow interns were delightful people with fascinating backgrounds. Most of all, I was in safe hands with my mentor Marco Gorelli, who patiently guided me even though I felt like I was trying to do calligraphy while wearing boxing gloves a lot of the time.

So what did I work on?

## Introducing Narwhals

Did you know that you can pass both a pandas dataframe or a PySpark dataframe to [Plotly](https://plotly.com/blog/chart-smarter-not-harder-universal-dataframe-support/)? How does that work?

Well, [Narwhals](https://narwhals-dev.github.io/narwhals/) is the magical fairy dust that makes this possible (or should I say "underwater unicorn magic" in Narwhals parlance?). The magic is basically a Python translation layer that takes any number of dataframe types (the library landing page lists all of them - many!) and allows you to perform framework-agnostic operations on them while preserving the data structure and types.

Narwhals is a complex, strongly typed library. It makes extensive use of "Protocols" (more on that in a bit) to do clever things such as allowing operations to work on a range of inputs. In this highly nested library, classes wrap other classes to make the translation between frameworks possible.

How could I start to contribute at this level of sophistication? How could I find my way in?

![A view looking up at the ceiling of the Sagrada Familia in Barcelona](/posts/oss-internship-creating-narwhals-daft-plugin/sagrada_familia.jpg)
Image: Vater_fotografo / CC BY-SA 2.0.

### First interlude: a word on creation by community

The hill seemed pretty steep, and I thought I would have to study all the frameworks and sub-modules to be able to start to contribute (did I mention there are many?). I was stuck because I essentially thought of this as a solo enterprise.

#### Narwhals study group to the rescue

Luckily, Narwhals has an active community, and one group in particular was pivotal for me: the study group[^1]. This is a loose community of interested people with varying levels of experience, and every week we get together to discuss what we're working on, ask questions, solve things as a group. I was nervous before joining the first one, but it's completely informal. The amazing thing is that it works: although there isn't a set learning path, people bring questions and you always come away having learned something. At one of our first meetings, Stelios showed me the way forward:

[^1]: See [here](https://github.com/narwhals-dev/narwhals/blob/main/CONTRIBUTING.md) for details of the community discord and meetings calendar, come join us!

> "you don't have to submit the perfect solution. Only very experienced contributors can submit a pretty polished version. Make a start, a suggestion, and you'll see the community run with it"

This was pretty liberating for me, and it's something I'd like to share with readers. Open source projects held a certain air of impenetrability; it seemed that only contributions of a very high standard would be helpful. I don't know how other communities are, but with Narwhals I found this not to be the case. In fact I realised even just asking questions is valuable, because it forces everyone to revise their understanding. At the study group, I found that a couple of my contributions that I thought were elementary actually managed to bring everyone’s understanding forward. Hearing this from experienced members made me feel on top of the mountain!

As I was able to find my footing in the project, I saw work progressed as a kind of [scaffolded process](https://en.wikipedia.org/wiki/Lev_Vygotsky#Scaffolding). Not just my contributions, but most decisions and ideas would be developed through communal working. Whilst I'd say Marco is very much the central, co-ordinating node, there is bi- and multi-directional traffic with other contributors. This very loosely organised structure nevertheless works as a well-oiled machine - probably why they're able to progress so quickly!

But back to the library itself:

## Why might we need a plugin for Narwhals?

If Narwhals already serves so many frameworks, why might we need a plugin? Let's say you're already using a library which uses Narwhals, i.e. Plotly. Then you discover a new fancy dataframe library which you can't do without, but Narwhals doesn't support it yet. Wouldn't it be great if you could pass your dataframe natively to Plotly? "I'll write a new module for Narwhals!" I hear you say. But are we going to do that for every new library, can we extend Narwhals indefinitely? What of our promise to keep Narwhals lightweight?

By writing a Narwhals plugin instead, you'll still be able to achieve the same thing, with zero required changes in either Plotly nor Narwhals.

But what do we mean by 'pass your dataframe natively'? Using [the daft library](https://docs.daft.ai/en/stable/) in a simple example, you can see here that we're able to manipulate a daft dataframe from within Narwhals and perform computations on it. We're able to do this because we've written a plugin for daft called [narwhals-daft](https://github.com/MarcoGorelli/narwhals-daft).

```python
import daft

import narwhals as nw

daft_df = daft.from_pydict({
        "A": [1, 2, 3, 4, 5],
        "fruits": ["banana", "banana", "apple", "apple", "banana"],
        "B": [5, 4, 3, 2, 1],
    })

df = nw.from_native(daft_df)

print(f'Using the Narwhals `from_native` function on a daft dataframe, we obtain a {type(df)}. \n')
print('Once we perform operations on it within Narwhals and collect it to show the result, we obtain a Narwhals DataFrame:')
print(df.with_columns(a_plus_1 = nw.col('A')+1).collect('polars'))
```

```
Using the Narwhals `from_native` function on a daft dataframe, we obtain a <class 'narwhals.dataframe.LazyFrame'>.

Once we perform operations on it within Narwhals and collect it to show the result, we obtain a Narwhals DataFrame:
┌─────────────────────────────────┐
|       Narwhals DataFrame        |
|---------------------------------|
|shape: (5, 4)                    |
|┌─────┬────────┬─────┬──────────┐|
|│ A   ┆ fruits ┆ B   ┆ a_plus_1 │|
|│ --- ┆ ---    ┆ --- ┆ ---      │|
|│ i64 ┆ str    ┆ i64 ┆ i64      │|
|╞═════╪════════╪═════╪══════════╡|
|│ 1   ┆ banana ┆ 5   ┆ 2        │|
|│ 2   ┆ banana ┆ 4   ┆ 3        │|
|│ 3   ┆ apple  ┆ 3   ┆ 4        │|
|│ 4   ┆ apple  ┆ 2   ┆ 5        │|
|│ 5   ┆ banana ┆ 1   ┆ 6        │|
|└─────┴────────┴─────┴──────────┘|
└─────────────────────────────────┘
```

As you can see, we've been able to pass a daft dataframe to Narwhals' `from_native` and get a Narwhals LazyFrame on which we can then do standard Narwhals operations.

### Second interlude: What's a Protocol?

These figure prominently in Narwhals, but what's a Protocol in Python? I read documentation, I read tutorials, but things didn't really click for me until I thought of this analogy:

Protocols are like the architectural drawing of a building. You can't do anything concrete with it, e.g you can't live in one, but without it, you don't know how to build your building and you'll have a shaky tower. They're underspecified for details of implementation (e.g. no description of bricks), but they specify the important stuff to do with structure (e.g. size of walls & number of building floors) and most importantly, they'll make sure that the different things you build will fit together.

If you think of Narwhal’s capacity to work with multiple types of dataframe libraries, you can see why this would be very handy indeed: using Protocols, you can make sure that any class with the same methods and properties can be used in different contexts and inputs[^2].

[^2]: A tutorial on Protocols is beyond the scope for this piece, but see [Python Protocols: Leveraging Structural Subtyping](https://realpython.com/python-protocol/) for a friendly introduction; additionally, this discussion helped me untangle abstract base classes from Protocols and helped clarify things for me: [Abstract Base Classes and Protocols: What Are They? When To Use Them?? Lets Find Out!](https://jellis18.github.io/post/2022-01-11-abc-vs-protocol/)

A toy example below shows how, because we have a Protocol for dataframes `FancyDataframeProtocol` which dictates the method greater than (Dunder `__gt__`) can take any type, we can have a function in a dataframe class that can return the max for both integers and strings.

```python
# adapted from https://jellis18.github.io/post/2022-01-11-abc-vs-protocol/

from typing import TypeVar, Protocol, Any

class FancyDataframeProtocol(Protocol):
    ...
    def __gt__(self, other: Any) -> bool:
        ...

T = TypeVar("T", bound=FancyDataframeProtocol)

class DataframeClassWithCustomMax():
    def max(self, x: T, y: T) -> T:
        if x > y:
            return x
        return y

find_max = DataframeClassWithCustomMax()
max_int = find_max.max(4, 5)
max_str = find_max.max("hello", "world!")

print(max_int)
print(max_str)
```

```
5
world!
```

## Introducing narwhals-daft

Narwhals already has guidelines on [how to extend the library](https://narwhals-dev.github.io/narwhals/extending/), although these are experimental and as yet untested. Nevertheless, they provide some must-haves which any plugin will eventually need to contain.

We decided to initially implement the bare minimum, as this would show how a plugin could function in principle and get a discussion going with the community around design.

**Our structure for narwhals-daft thus consists of:**

```
├── narwhals_daft
│   ├── __init__.py
│   ├── dataframe.py
│   ├── expr.py
│   ├── namespace.py
│   └── utils.py
├── pyproject.toml
├── README.md
```

**This blogpost will concentrate on how narwhals-daft connects to the Narwhals library and what parts every future plugin developer will need to implement**, for greater technical detail on the plugin & how it works within Narwhals, see [here](https://github.com/ym-pett/blogposts_etc/blob/main/Implementing%20a%20plugin%20for%20the%20Narwhals%20library_%20into%20the%20fray.md) (currently work in progress).

### 1. The top-level `pyproject.toml`

We can see that we have a top-level `pyproject.toml` file with an `entry point` defined. This part is crucial for every plugin. (See below on how to adapt this to the particular library of your plugin.)

```
...

[project.entry-points.'narwhals.plugins']
narwhals-daft = 'narwhals_daft'
...
```

### 2. The top-level `__init__.py` file giving access to 3 crucial utilities

Apart from the `.toml` file, this is where the connection to the Narwhals library happens. The file contains two functions, `__narwhals_namespace__` and `is_native` as well as a constant `NATIVE_PACKAGE` which gives the name of the package we're making a plugin for.

The `__narwhals_namespace__` acts as the entry point to the library. Given the version of Narwhals, it returns a `DaftNamespace`, which can be wrapped around a non-narwhals dataframe (referred to as "native object" in the Narwhals terminology). The `DaftNamespace` makes a `from_native` function available, which allows the native object to be read into a compliant object, on which typical Narwhals operations can be carried out whilst still retaining the original data and data structure[^3].

[^3]: Yes, you've guessed it, this is achieved by clever nesting of objects and protocols.

The `is_native` function simply checks if we are dealing with a daft dataframe. Note it is only at this point that we import the daft library, rather than when loading the plugin (see [](#issues-we-ve-considered) below for further discussion of this aspect).

```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from narwhals_daft.namespace import DaftNamespace
    from narwhals_daft.dataframe import DaftLazyFrame

    from narwhals.utils import Version
    from typing_extensions import TypeIs


def __narwhals_namespace__(version: Version) -> DaftNamespace:  # noqa: N807
    from narwhals_daft.namespace import DaftNamespace

    return DaftNamespace(version=version)

def is_native(native_object:object) -> TypeIs[DaftLazyFrame]:
    import daft
    return isinstance(native_object, daft.DataFrame)


NATIVE_PACKAGE = "daft"
```

We can see that in order for these functions to work, we'll need to implement at least two more classes, `DaftNamespace` and `DaftLazyFrame`. Moreover, what you can't see here is that `DaftLazyFrame` needs `DaftExpr`, so we'll have to implement those too.

But hang on, how did you know that those were needed? It's in the Protocols! Basically, if a plugin author implements all the methods from the `Compliant*` classes, then Narwhals will know how to glue everything together. And now we can see that tying this description to `daft` is too specific: what we've had to do is adapt the more abstract compliant classes `CompliantLazyFrame`, `Expression` & `Namespace`.

For a couple of code extract to convince you, I'll show you some relevant lines for `DaftNamespace`:

```python
...
from narwhals._compliant.namespace import LazyNamespace
...

class DaftNamespace(LazyNamespace[DaftLazyFrame, DaftExpr, daft.DataFrame]):
    ...
```

See how it imports `LazyNamespace` from the compliant layer? Similarly for `DaftExpr`, it imports Narwhals' `LazyExpr`.

```python
...
from narwhals._compliant import LazyExpr
...

class DaftExpr(LazyExpr["DaftLazyFrame", "Expression"]):
    ...
```

This way we can enforce compatibility with Narwhals, even though our daft library may be a very different beast.

Finally, I hear you whisper: "but how do you _write_ it... I mean how do you know what to use to translate from one to the other?". I'll tell you, and I realised this toe-curlingly late: it's [Polars](https://pola.rs/). It's essentially Polars syntax (or a subset of it). So get good at Narwhals, and you'll you get Polars for free. Nice.

## In summary, what users need implement to create their own plugin:

1.  The entry point in the .toml file: the section name `[project.entry-points.'narwhals.plugins']` must be part of every plugin & will be the same for all plugins. Whereas the next line will need to be adapted to the name of the particular library the plugin is made for, namely:

        `narwhals-<insert libraryname> = 'narwhals_<insert libraryname>'`

2.  The two top-level functions in `__init__.py`:

    - `is_native object`
    - `from_native`
    - the constant `NATIVE_PACKAGE` with the name of the package.

3.  The 3 compliant classes: `CompliantLazyFrame`, `Expression` & `Namespace`; in our daft-specific use case, we have `DaftLazyFrame`, `DaftExpr` & `DaftNamespace`, other plugin developers, say for fictitious `grizzlies` library would then have `GrizzliesLazyFrame`, `GrizzliesExpr` & `GrizzliesNamespace`[^4].

[^4]: In truth there are a couple more classes that need to be implemented for access to the whole breadth of methods available in Narwhals, but that's the subject of a different post. For a minimal architecture, this achieves functionality.

## Issues we've considered when creating this solution

## Finding the most lightweight approach to importing the framework of the plugin

Within the plugin, it was important to find a way of detecting whether the framework the plugin is written for is present, without going through the slow step of loading the framework itself. This is so that we can avoid importing `daft` if the user is not actually using a daft dataframe. for example, if a user has installed the (not-yet-existent) plugins `narwhals-xarray`, `narwhals-daft`, `narwhals-grizzlies`, then it should be possible to detect which plugin to use for a given user input without having to import all of `xarray`, `daft`, and `grizzlies`. If you recall the structure of the top-level `__init__.py` file, we are indeed only importing daft once we're checking a dataframe.

## Ensuring backwards-compatibility

### Related materials: the case of plugins in scikit-learn

It may be instructive to consider the issues faced by other packages when planning our own plugin.

For scikit-learn, it is a known issue that even with minor releases, extensions currently break (true as of 01/09/25, see discussion [here](https://github.com/scikit-learn/scikit-learn/issues/31912)).

There is currently a debate about how to fix this, with one proposal suggesting a more abstracted architecture where potentially breaking changes can be made safe by being placed between stable public-facing layers. On the other hand, this represents a quite significant rewrite of the package which may not sit well with users accustomed to more procedural scientific code. Scikit-learn is an established package with a long history and is widely used; this shows that questions around interfaces to other packages should be considered as early on as possible.

### Narwhals

Narwhals has a strong policy of [backwards compatibility](https://narwhals-dev.github.io/narwhals/backcompat/), mainly enforced through the use of a `stable` namespace. However, that promise does not extend to its internal Compliant protocols.

Given that plugin authors use the Compliant Protocols, we need to ensure that these protocols are stable enough that users' plugins don't break with every minor Narwhals release.

**Here are some guidelines which we (Narwhals developers) aim to follow, to minimise the potential disruption on plugins authors.**

> If an existing Protocol method is updated to accept additional arguments:
>
> - New parameter(s) MUST be introduced with a default value
> - The behavior of the existing signature MUST not change
> - The Narwhals-level SHOULD handle the default case, but all other cases remain undefined

We may need to deviate from them if strictly necessary, but we hope that this will be rare.

**The advice to plugin authors to avoid breakage with new Narwhals methods is therefore:**

> - Only use the public methods from the compliant protocols.
> - Don't rely on anything starting with an underscore[^5]

[^5]: The eagle-eyed reader may have spotted that although we advise plugin developers "Don't rely on anything starting with an underscore", we seem to contradict this with the code examples of the Protocol imports for `DaftNamespace` and `DaftExpr`, where we in fact import from `narwhals._compliant`. Flouting our own conventions already? Fear not, there is a refactor planned in Narwhals so that they'll be imported from `narwhals.compliant` in future.

## What next?

I've treasured my time working on this project and at Quansight. Am I done? I barely feel I've scratched the surface. I think working on this project and the interactions with the Narwhals community (you're stars - you know who you are!) have opened so many new areas I'm yet to explore. Writing this blogpost and looking over concepts and notes from our learning group, I realise just how far I've come. A bit like with the plugin development, I'm not sure what's next, as it will develop organically through the code I work on and people I meet. One thing's for sure, I'd like to hang out with you all on the Arctic for a bit longer.

As well as the community, I'd of course like to thank my mentor Marco Gorelli, Melissa Weber Mendonça who co-ordinated the internship programme with unfailing good humour and benevolent attention, my fabulous fellow interns and the folks at Quansight who have shared their insights with me over a coffee break - may our paths cross again soon!

---

Hero Image: "soccer practice" by woodleywonderworks / CC BY-SA 2.0.
