---
title: 'IPython 8.0, Lessons learned maintaining software'
published: January 12, 2022
author: matthias-bussonnier
description: 'This is a companion post from the Official release of IPython
8.0. We hope it will help you apply best practices, and have an easier time
maintaining your projects, or helping other.'
category: [Community, Developer workflows]
featuredImage:
  src: /posts/ipython-8.0-lessons-learned-maintaining-software/ipython-8.0-feature.png
  alt: 'Code snippets showing why always using stacklevel is important in ipython-8.0. Full code snipppets are in the blog post.'
hero:
  imageSrc: /posts/ipython-8.0-lessons-learned-maintaining-software/blog_hero_org.svg
  imageAlt: 'An illustration of a light brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

This is a companion post from the [Official release of IPython
8.0](https://blog.jupyter.org/release-of-ipython-8-0-6e034ff122ef), that describe
what we learned with this large new major IPython release. We hope it will help
you apply best practices, and have an easier time maintaining your projects, or
helping other. We'll focus on many patterns that made it easier for us to make
IPython 8.0 what it is with minimal time involved.

IPython 8.0 in addition to adding a number of improvements and make full use of
newer Python features, it also removes support for a number of legacy API. It
reduces the size of the code base, and in general simplify the multiple layer of
abstractions and conditionals branches present in functions. This makes IPython
easier to contribute for new comers. Make the codebase faster to navigate and
simpler to understand.

As Brian Kernighan put it: “Debugging is twice as hard as writing the code in
the first place. Therefore, if you write the code as cleverly as possible, you
are, by definition, not smart enough to debug it.”

So I'd like to keep my code as simple as possible with less states or condition
to keep in mind.

Seen it in another way, your software progressing both because it's leading edge
is moving forward, as it does because the trailing end is also catching up. And
for this release of IPython we focused on both.

## LBYL vs EAFP

Look Before You Leap and Easier to Ask Forgiveness than Permissions are two
practices each with their advantages and inconveniences. Python tend the prefer
the second one as try/except is "easy" in Python.

This first implementation will often feel more idiomatic Python:

```python
from pahtlib import Path

p = Path('test')

try:
   p.mkdir()
except FileExistsError:
   continue

```

While this second one can feel less Pythonistic

```python
if not p.exists():
    p.mkdir()
```

In particular note that the second one suffer a race condition, as the directory
could be created between the check and call to mkdir and that anyway you should
use the `exist_ok=True` argument.

Regardless I have found that conditional code using try and except / EAFP to
deal with various versions of a dependency is bad practice. It make figuring out
the reason for these exception hard to discover, and also make it hard to find
all occurrences of such conditional imports. I guess that should have bee
obvious from the Zen of Python:

```
In [1]: import this
The Zen of Python, by Tim Peters

...
Explicit is better than implicit.
...
```

So my first tip: Always avoid catching `ImportError`s when you can compare
version numbers.

- having two import lines will not make import slower.
- it's explicit.
- it's easier to search for.
- it's easier to remove.

For example IPython used to contain

```python
try:
    from numpy.testing import KnownFailure, knownfailureif
except ImportError:
    from ._decorators import knownfailureif
    try:
        from ._numpy_testing_noseclasses import KnownFailure
    except ImportError:
        pass
```

Which adds a fallback for [numpy version older than numpy 1.3 from
2008](https://github.com/numpy/numpy/commit/ba9a02dcb2c3ca635076a75cc9eb0f406e00ceed).
It took me ~30 minutes to find this informations, which could have been seconds
would the author (which could have been me) had checked version. A proper
version check would also had this code removed years ago.

Currently we do no check for numpy versions anymore as we are removing support
for [NumPy older than 1.19](https://github.com/ipython/ipython/pull/13434). One
way to find numpy version would be

```python
# using importlib to check versions before importing !
importlib.metadata.version("numpy")
# or if already imported:
numpy.__version__
```

As a side note, I wish numpy had a `numpy.version_info`, that was a comparable
tuple of int to make it less error prone to compare versions, here I would need
to parse the version.

Using `packaging` as dependencies, I can do the following (distutils way is
deprecated and emit a deprecation warning):

```python
from packaging.version import parse
if parse(numpy.__version__) < parse('1.13'):
   ...

```

Splitting on `.` and mapping int fails on version numbers like Release
Candidates `1.22.0rc1`.

```python
# may fails on alpha, beta, rc
if tuple(int(x) for x in numpy.version.version.split(".")[:3]) < (1, 13):
   ValueError('Parsing version is more complicated that it looks like')
```

While IPython has few dependencies beyond Python, we do so with Python version
itself, and always compare with `sys.version_info` made it straightforward to
find all dead code once we bumped or minimal version to 3.8+.

This has domino effects in IPython 8.0 as we were going to great length to
support top level async which is since 3.8 native to Python. Many simplification
leading do even more down the line up to complete method and class suppressions.

# Don't be cheap on `DeprecationWarning`s

Warnings in general are much more powerful and complex than at first look. Once
you understand them well they are an extremely powerful features. When use
correctly they give you an expressive way to communicate with your users and
dependees as well as you in the future. Misused they can be just noise that
trains everybody to ignore them.

Here is a quick tip/summary of what this section will expand upon.

- Always set `warnings.warn(stacklevel=...)` to the right value (at least 2).
- Be descriptive of what "deprecated" means.
- Be descriptive of what the replacement is.
- Always indicate since when it is deprecated / the replacement is available.
- Don't be afraid to use multiple line strings.

## Always use `stacklevel=...`

Setting the `stacklevel` ensure that python reports the right place where the
deprecated feature is used.

### Make it easier to fix

```python
# file example.py
import warnings
def function(argument=None):
   if argument:
      warnings.warn('`argument is deprecated`')
```

Will lead to the following error:

```text
~/example.py:5: UserWarning: `argument is deprecated`
  warnings.warn('`argument is deprecated`')
```

While setting `stacklevel=2` will point to the right file, line, and show the
problematic code:

```text
~/foo.py:3: UserWarning: `argument is deprecated`
  example.function(1)
```

Most terminal and editor now recognize the `file/path.py:LineNumber` syntax, so
on my setup it is also a single click to open the right file on the right
location and fix it.

### makes it easier to find

Most test runners have options to turns `DeprecationWarning`s into error, this
allow you to detect early usage of deprecated feature and react early to update
your code.

Individual Errors can be turned off.

Moreover it is easy to make warnings into errors **only in the code you
maintain**, assuming the libraries you call properly set their `stacklevel`,
this allow you to make sure you do not use deprecated features directly.

[napari](https://github.com/napari/napari/blob/79834ad8ed2191b44df5be4233f4b98a6bd33de9/pyproject.toml#L88-L108) for example uses the following

```toml
# pyproject.toml
[tool.pytest.ini_options]

filterwarnings = [
  # turn warnings from napari into errors by default
  # this requires stacklevel=.to be correct
  "error:::napari",

  # we can easily ignore some warnings if we wish to.
  "ignore:.*Version classes are deprecated.*:DeprecationWarning:napari._vendor",
]
```

The syntax is `which action:pattern of message to match:class of warning:which module`. The `which module` requires the author to have set `stacklevel=`
properly.

Setting `stacklevel=` will make you much more confident that the users have seen
the warning and has fixed the right location. I am personally quite unlikely to
fix a warning if it take me 30 minutes to figure out where my code use
deprecated features, though if I see where the error is I can at least open an
issue with the right location to fix and go back to my previous task.

### Be clear what deprecated means, and what the replacements are

While "deprecated" conveys the idea that something should not be used,
there might be reasons why, or change in effects since the deprecation that
you want to describe.

```python
def publish_display_data(data, metadata=None, source=None, *, ...):
    """

    Parameters
    ----------
    ...
    source : Deprecated.

    """
    ...
```

In this particular case the `source=` parameter is deprecated, and passing it
has, **and had** no effects. It was originally left in the function signature to
avoid `TypeError`s.

The deprecation without explanation, and suggestion of alternative lead to
numerous confusion by users (and IPython developers later on). It also delayed
removal of passing the `source=` arguments in many dependees, and thus cleanup
of the API.

This is one of the deprecated API we did not remove in 8.0 even if the
deprecation enacted a couple of years ago, and for 8.0 we've updated the
deprecation message. A better one if

```python
    ...
    warnings.warn("The 'source' parameter has been deprecated,"
                  " it has no effects and can safely"
                  " omitted, there are no replacements.",
                  DeprecationWarning,
                  stacklevel=2)
```

If there are replacement, or an option was deprecated as it was obviously wrong,
you may want to say that as well. In particular if the alternative option are
available before the deprecation as that can avoid conditional code.

### Indicate the time of the deprecation

This one if a bit of a pet peeve of mine, I regularly come across a deprecation
and need to go hunt into `git blame` to figure out which versions are affected.
Sometime it is written in the function docstring, but still this can interrupt
my workflow as the `DeprecationWarning` could be in CI and I don't have the
library installed locally.

The version since a deprecation is critical as:

- it gives me the right info for a conditional
- it tells me whether I can maybe drop support for older version.
- It give me an idea of the time frame for me to fix the deprecation.
- Sometime the warning is added in the different version than the deprecation.

The warning from the previous section should become:

```python
    ...
    warnings.warn("The 'source' parameter has been deprecated since"
                  " IPython 5.0, it has no effects and can safely omitted,"
                  " there are no replacements.",
                  DeprecationWarning,
                  stacklevel=2)
```

Some authors also like to add in the deprecation the version where the
functionality will be removed. I tend to avoid as:

- I believe this gives users explicit authorisation to delay updating API.
  Though you as a maintainer want to get rid of it as fast as possible.
- I often came across deprecation that were reverted/delayed/not removed. This
  becomes confusing to users, and can lead to mistrust of deprecation warning.

I thus prefer to stay factual, and I don't claim to predict the future.

### Use multiline strings

Python has multiline strings with triple quote marks, they are not limited to
docstrings. Of course you can (and should) mention deprecation in docstrings,
but you can and should also use multiline strings in warnings messages.

The more informations and the easier to you make it for your users to fix
warnings without having to search and lookup informations, the more likely they
are to update their code immediately, and the more confident you can be about
removing deprecated code.

Give them all the informations they need, and you will realise that it in the
long term it is also less work for you, and you will have an easier time
cleaning API.

## Communication and Explicitness are keys

You want to be explicit to your users and future self. All the explicit
informations will make it easier for you in the long term.

Especially in the open-source and volunteer work where time is scarce, you want
to carefully manage where it is spent.

A warning is likely going to be updated only a couple of time, but may be seen
hundreds of time, and fixed in dozen of places.

We hope all the new warnings in IPython will be much better, and help you
migrate easily to new API. They can likely be improved, and we look forward to
your contributions to make them better.

We also hope the lessons we learned to remove old codepath from IPython will be
of use to you, and simplify your work going forward.
