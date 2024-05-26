---
title: 'How Narwhals and scikit-lego came together to enable dataframe-agnosticism'
authors: [marco-gorelli]
published: May 26, 2024
description: 'And how your library can become dataframe-agnostic too'
category: [PyData ecosystem]
---

# How scikit-lego became dataframe-agnostic

Scikit-lego is a Python project which provides extra building blocks on top of scikit-learn.
It provides some extra funcionality such as `TimeGapSplit` and `add_lags` which may be considered
too niche for scikit-learn itself. These functions have always only ever supported pandas...up until now!

As of scikit-lego 0.9.0, you can also pass dataframes from Polars, Modin, cuDF, and in principle a whole host
of other dataframes.
But, how does it work? Why did they use Narwhals?
Why don't they just
convert to pandas internally on the user's behalf?

We'll start by answering these questions, and will end with some hopes for the future.

## How does it work?

Let's take a look at `sklego.pandas_utils.add_lags`. The code before version 0.9.0 did something like this:

- check if the input is NumPy or a pandas dataframe
- if it's NumPy, then perform array operations
- if it's pandas, then perform pandas dataframe operations

In order to support Polars too, one possible solution could have been do add a third step to
the above:

- if it's Polars, then perform Polars dataframe operations

This looks simple, but it actually opens up a rabbit-hole of extra steps, such as:

- if it's Modin, ...
- if it's cuDF, ...
- if it's fireducks, ...

In order to address all the above, scikit-lego opted for a simpler approach: use Narwhals.
The steps then become:

- run `narwhals.from_native` on the input
- express the dataframe logic using the subset of the Polars API supported by Narwhals

Like this, Narwhals takes care of translating its (Polars-like) syntax to each
supported backend. Read the [Narwhals docs](https://narwhals-dev.github.io/narwhals) for more
info on how to use it, and for a tutorial.

## Why not "just convert to pandas"?

There are different ways of converting non-pandas input to pandas. Rather than using Narwhals,
couldn't scikit-lego just have done something like:

- if the input is pandas, keep as-is
- if the input is a non-pandas dataframe, then convert to pandas

However, even in the best-case zero-copy-conversion scenario, this presents several issues:

- once the input has been converted to pandas, there's no standardised way of converting back to
  the original dataframe library.
- using pandas as an engine may be significantly slower than doing everything using the original
  dataframe

Furthermore, converting to pandas may present a cost - for example, if you start with a Polars
LazyFrame, then you're required to call `.collect` on it before converting
to pandas.

To drive the second point home, here are some timings comparing running `add_lags` on a
10-million-row Polars dataframe directly, as opposed to converting to pandas and back:

- passing Polars directly to `add_lags`:  ~ 10.8 ms
- converting Polars to pandas, passing that to `add_lags`, then converting back: ~ 1.47 s

[Code to reproduce](https://gist.github.com/MarcoGorelli/1da1971063caf0b3e5133f5dfba3315b).

Note that we're dealing with purely numeric data here, so the conversion is extremely cheap.
The reason that the second approach takes over 100x longer is that Polars is generally much
faster at feature engineering than pandas. As the size of the dataframe increases, the comparison
scales even better in the "native Polars support" direction.

That's why "just convert to pandas" is a disappointing solution, and why it's worth it to
invest the time to achieve dataframe-agnosticism.

## Will the future of data science become "BYODF" (bring your own dataframe)?

Earlier this year, we saw [Great Tables announce that they are now "bring your own dataframe"](https://posit-dev.github.io/great-tables/blog/bring-your-own-df/).
Scikit-learn also supports Polars in a somewhat standardised way, by leveraging the [dataframe interchange protocol](https://data-apis.org/dataframe-protocol/latest/), the [`__array__` method](https://numpy.org/devdocs/user/basics.interoperability.html), and
some custom logic. And in this blog post, we look at how scikit-lego achieved the same by using Narwhals.

Is this a sign of what's to come? I certainly hope so. pandas is - and will very likely continue to be -
and enormously useful tool which solves a lot of problems for a lot of real people. 
However, if pandas remained the _only_ dataframe library supported in the data science
ecosystem, then that'd be a opportunity.

We've looked at how scikit-lego leveraged Narwhals in order to become dataframe-agnostic. Like this, they are
able to natively support Polars, Modin, and cuDF without any of them becoming required dependencies.
Let's hope that this is the direction that data science libraries are headed towards, and that Narwhals
can facilitate the process.
