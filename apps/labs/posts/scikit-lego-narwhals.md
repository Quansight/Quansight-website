---
title: 'How Narwhals and scikit-lego came together to achieve dataframe-agnosticism'
authors: [marco-gorelli]
published: May 26, 2024
description: 'And how your library can become dataframe-agnostic too'
category: [PyData ecosystem]
featuredImage:
  src: /posts/scikit-lego-narwhals/scikit_lego_narwhals_handshake.jpg
  alt: 'Narwhals logo'
hero:
  imageSrc: /posts/scikit-lego-narwhals/scikit_lego_narwhals_handshake.png
  imageAlt: 'Scikit-lego and Narwhals logos, with handshake in between'
---

# How scikit-lego became dataframe-agnostic

[Scikit-lego](https://github.com/koaning/scikit-lego) is a Python project from the [scikit-learn](https://scikit-learn.org/stable/) ecosystem that contributes extra estimators for machine-learning pipelines.
It's a relatively popular project with over 1000 Github stars and 20,000 downloads a month.
It's popularity comes from industry as many of the tools that it provides aren't proven to be state-of-the-art,
but fall a bit more in the 'tricks that work' category. These features include a GroupedEstimator which
can effectively run full pipelines split per subset, a TimeGapSplit cross validator for timeseries
that adds a gap between train and test set and a whole suite of techniques that leverage mixture methods
for outlier detection and non-linear classification.

Recently, because polars has been gaining traction, the library maintainers have been looking for a simple way to support multiple dataframe implementations. The project still wants to support pandas, but it would be a shame if newer dataframes couldn't be supported.

Enter narwhals. As of scikit-lego 0.9.0, you can also pass dataframes from Polars, Modin, cuDF, and in principle a whole host
of other dataframes.
But, how does it work? Why did they use Narwhals?
Why don't they just
convert to pandas internally on the user's behalf?

We'll start by answering these questions, and will end with some hopes for the future.

## How does it work?

Let's take a look at `sklego.pandas_utils.add_lags` as a tangible example that demonstrates how you might be able to leverage Narwhals in your own library. The code before version 0.9.0 did something like this:

1. check if the input is NumPy or a pandas dataframe
2. if it's NumPy, then perform array operations
3. if it's pandas, then perform pandas dataframe operations

In order to support Polars too, one possible solution could have been to add a fourth step to
the above:

4. if it's Polars, then perform Polars dataframe operations

This looks simple, but it actually opens up a rabbit hole of extra steps, such as:

5. if it's Modin, ...
6. if it's cuDF, ...
7. if it's fireducks, ...

In order to address all the above, scikit-lego opted for a simpler approach: use Narwhals.
The steps then become:

1. run `narwhals.from_native` on the input
2. if it's NumPy, then perform array operations
3. otherwise, express dataframe logic using the subset of the Polars API supported by Narwhals

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
LazyFrame, which can run significantly faster because it delays reading data into memory and performs
[several optimisations](https://docs.pola.rs/user-guide/lazy/optimizations/),
then you're required to call `.collect` on it before converting to pandas.

To drive the second point home, here are some timings comparing running `add_lags` on a
10-million-row Polars dataframe directly, as opposed to converting to pandas and back:

- passing Polars directly to `add_lags`:  ~ 10.8 ms
- converting Polars to pandas, passing that to `add_lags`, then converting back: ~ 1470 ms

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
an enormously useful tool which solves a lot of problems for a lot of real people. 
However, if pandas remained the _only_ dataframe library supported in the data science
ecosystem, then that'd be a missed opportunity.

We've looked at how scikit-lego leveraged Narwhals in order to become dataframe-agnostic,
able to natively support Polars, Modin, and cuDF without adding them as dependencies.
Let's hope that this is the direction that data science libraries are headed towards, and that Narwhals
can facilitate the process.
