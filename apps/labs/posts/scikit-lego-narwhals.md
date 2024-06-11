---
title: 'How Narwhals and scikit-lego came together to achieve dataframe-agnosticism'
authors: [marco-gorelli]
published: June 11, 2024
description: 'And how your Python library can become dataframe-agnostic too'
category: [PyData ecosystem]
featuredImage:
  src: /posts/scikit-lego-narwhals/scikit_lego_narwhals_handshake.png
  alt: 'Scikit-lego and Narwhals logos shaking hands'
hero:
  imageSrc: /posts/scikit-lego-narwhals/hero.png
  imageAlt: 'Scikit-lego and Narwhals logos'
---

[Scikit-lego](https://github.com/koaning/scikit-lego) is a Python project from the [scikit-learn](https://scikit-learn.org/stable/) ecosystem that contributes extra estimators for machine-learning pipelines.
It's a relatively popular project with over 1,000 Github stars and 20,000 downloads a month.
Its popularity comes from practical applications, as many of the tools that it provides aren't
proven to be state-of-the-art but instead fall a bit more in the 'tricks that work' or
'experimental with proven use case' category.

Recently, because Polars has been gaining traction, the library maintainers have been looking for a simple way to support multiple dataframe implementations. The project still wants to support pandas, but it would be a shame if newer dataframes couldn't be supported.

Enter Narwhals. As of scikit-lego 0.9.0, you can also pass dataframes from Polars, Modin, cuDF, and in principle a whole host
of other dataframes. But, how does it work? Why did they use Narwhals?
Why don't they just convert to pandas internally on the user's behalf?

We'll start by answering these questions, and will end with some hopes for the future.

## How does it work?

Let's take a look at [scikit-lego's `add_lags` function](https://koaning.github.io/scikit-lego/api/pandas-utils/?h=add_lags) as a tangible example that demonstrates how you might be able to leverage Narwhals in your own library. The code before version 0.9.0 did something like this:

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

1. run [`narwhals.from_native`](https://narwhals-dev.github.io/narwhals/api-reference/narwhals/#narwhals.from_native) on the input
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

This may look like a good solution - however, even in the best-case zero-copy-conversion scenario,
it presents several issues:

- once the input has been converted to pandas, there's no standardised way of converting back to
  the original dataframe library
- using pandas as an engine may be significantly slower than doing everything using the original
  dataframe

Furthermore, converting to pandas may present a cost - for example, if you start with a Polars
LazyFrame, which can run significantly faster because it delays reading data into memory and performs
[several optimisations](https://docs.pola.rs/user-guide/lazy/optimizations/),
then you're required to call [`.collect`](https://docs.pola.rs/py-polars/html/reference/lazyframe/api/polars.LazyFrame.collect.html) on it before converting to pandas.

To drive the second point home, here are some timings comparing (lower is better):

- running `add_lags` on a 10-million-row Polars dataframe directly
- converting that same dataframe to pandas and running `add_lags` on that

![with native Polars support `add_lags` takes ~ 11 ms, whereas going via pandas it
takes ~ 1470 ms. Image produced with `great-tables` package](/posts/scikit-lego-narwhals/comparison.png)

[Code to reproduce](https://gist.github.com/MarcoGorelli/1da1971063caf0b3e5133f5dfba3315b).

Note that we're dealing with purely numeric data here, so the conversion is extremely cheap.
The reason that the second approach takes over 100x longer is that Polars generally excels at
feature engineering. As the size of the dataframe increases, the comparison
scales even better in the "native Polars support" direction.

That's why "just convert to pandas" is a disappointing solution, and why it's worth it to
invest the time to achieve dataframe-agnosticism.

## What's the Narwhals overhead?

Narwhals translates a subset of the Polars API to other dataframe libraries.
You might expect, therefore, that there is some overhead when translating the Polars API to
the pandas one.

However, this overhead is negligible, and barely detectable. The few extra Python calls it makes
don't add up to much. Running the above benchmark for pandas, we see the following timings
(lower is better):

- scikit-lego 0.8.2 (before Narwhals): 1593 ms
- scikit-lego 0.9.0 (with Narwhals): 1383 ms

There is some variability here - sometimes the second one is marginally faster, sometimes
marginally slower. Overall, we consistently find them to be in the same ballpark -
because Narwhals is so simple and lightweight, its overhead is typically negligible. Thus,
it truly enables library authors to support newer dataframe libraries with little to no impact
on pandas users.

## Will the future of data science become "BYODF" (bring your own dataframe)?

Earlier this year, we saw [Great Tables announce that they are now "bring your own dataframe"](https://posit-dev.github.io/great-tables/blog/bring-your-own-df/).
Scikit-learn also supports Polars in a somewhat standardised way, by leveraging the [dataframe interchange protocol](https://data-apis.org/dataframe-protocol/latest/), the [`__array__` method](https://numpy.org/devdocs/user/basics.interoperability.html), and
some custom logic. And in this blog post, we looked at how scikit-lego achieved the same by using Narwhals.

Is this a sign of what's to come? I certainly hope so. pandas is - and will very likely continue to be -
an enormously useful tool which solves a lot of problems for a lot of real people. 
However, if pandas remained the _only_ dataframe library supported in the data science
ecosystem, then that'd be a missed opportunity.

Scikit-lego leveraged Narwhals in order to become dataframe-agnostic,
and is now able to natively support Polars, Modin, and cuDF without adding any of them as dependencies.
Let's hope that this is the direction that data science libraries are headed towards, and that Narwhals
can facilitate the process.
