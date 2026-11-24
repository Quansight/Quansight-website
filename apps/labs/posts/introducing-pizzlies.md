---
title: "Pizzlies: the most lightweight dataframe you've never heard of!"
published: November 23, 2026
authors: [marco-gorelli]
description: "Extremely lightweight, no dependencies, no compiled code, and Polars' expressive API"
category: [PyData ecosystem]
featuredImage:
  src: /posts/introducing-pizzlies/featured.jpg
  alt: 'Watercolour illustration of a brown-and-white pizzly bear soaring through a blue sky over an Arctic landscape, while a polar bear cub watches from the ice below'
hero:
  imageSrc: /posts/introducing-pizzlies/hero.jpg
  imageAlt: 'Watercolour illustration of a brown-and-white pizzly bear soaring through a blue sky over an Arctic landscape, while a polar bear cub watches from the ice below'
---

<!-- TODO: intro paragraph. What Pizzlies is in one or two sentences, who it's for, and why you might care. -->

I know the feeling: you need to analyse few hundred-thousand rows of data and do some simple grouped aggregations. If you were working locally, you'd pull in pandas/Polars/DuckDB, and analyse it with no issue. Suppose you're working in the cloud however, and it's paramount that you keep environment size and import times minimal. Do you really need a compiled dataframe library, or is Python enough?

## Pizzlies: the world's lightest dataframe library.

Let's get the features out of the way:

- No dependencies. It's just pure-Python.
- No compiled code. If you have Python, you can have Pizzlies. No installation issues, ever.
- Extremely lightweight. Never worry about your container's size exploding.
- Familiar: just use (a subset of) Polars' API.

Here's a quick example of what you can do once you've installed it (`pip install pizzlies` - it'll be super-quick):

```py
>>> import pizzlies as pz
>>> df = pz.from_dict({'a': [1,2,3], 'b': [4,4,6]})
>>> df.group_by('b').agg(a_sum = pz.col('a').mean())
┌──────────────────┐
|Narwhals DataFrame|
|------------------|
| shape: (2, 2)    |
| ┌─────┬───────┐  |
| │ b   ┆ a_sum │  |
| │ --- ┆ ---   │  |
| │ i64 ┆ f64   │  |
| ╞═════╪═══════╡  |
| │ 4   ┆ 1.5   │  |
| │ 6   ┆ 3.0   │  |
| └─────┴───────┘  |
└──────────────────┘
```

Note that the output shows "Narwhals DataFrame". That's because Pizzlies is implemented as a [Narwhals plugin](https://narwhals-dev.github.io/narwhals/extending/#creating-a-plugin).

## Show me the benchmarks!

Everyone loves benchmarks, so alright, here's a few.

All numbers below were measured with Python 3.13 on Linux x86-64 (AMD Ryzen AI 9 465), with Pizzlies 0.1.0 and Narwhals 2.29.0 (built from Narwhals' `main` branch), Polars 2.1.0, pandas 3.1.1, PyArrow 26.0.1 and DuckDB 2.0.1. Your hardware will give different numbers, so measure your own workload.

## Package size

This is how much space each library takes up once installed, including its required dependencies:

![Bar chart of installed size: Pizzlies (with Narwhals) 2.4 MB, DuckDB 70 MB, pandas (with NumPy, python-dateutil and tzdata) 97 MB, PyArrow 171 MB, Polars (with polars-runtime-32) 183 MB](/posts/introducing-pizzlies/installed-size.svg)

## Wheel size

The wheel is what you download when you `pip install`, so it's what you pay for in network transfer and installation time:

![Bar chart of wheel size: Pizzlies (with Narwhals) 0.6 MB, DuckDB 25 MB, pandas (with NumPy) 28 MB, Polars (with polars-runtime-32) 55 MB, PyArrow 55 MB](/posts/introducing-pizzlies/wheel-size.svg)

The compiled libraries' wheels are platform-specific (the numbers above are for manylinux x86-64), whereas Pizzlies and Narwhals ship a single `py3-none-any` wheel which works everywhere.

## Import times

Each number is the median of 100 imports, each in a fresh interpreter:

![Bar chart of import time: Pizzlies 40 ms, DuckDB 81 ms, Polars 131 ms, PyArrow 142 ms, pandas 347 ms](/posts/introducing-pizzlies/import-time.svg)

## Speed: TPC-H queries

The TPC-H benchmarks have, for some reason, become the reference benchmark comparison for dataframes. They are somewhat one-dimensional, as they don't fully capture the kind of work that data scientists often perform (for example, where do window functions even appear in the TPC-H queries? They're nowhere to be found). Nonetheless, they do give us an idea of how performant (or not!) Pizzlies is.

We ran the [Narwhals TPC-H queries](https://github.com/narwhals-dev/narwhals/tree/main/tpch) at scale factor 0.1, where the largest table (`lineitem`) has about 600,000 rows. Each library ran the exact same Narwhals code. We loaded all tables into memory before starting the clock, so file reading isn't included, and we checked every result against the reference answers. Each timing is the median of 5 runs (3 for Pizzlies), and Pizzlies got all 22 queries right.

![Bar chart of total time for all 22 TPC-H queries: Polars 0.53 s, DuckDB 0.78 s, pandas 3.6 s, PyArrow 11.2 s, Pizzlies 15.1 s](/posts/introducing-pizzlies/tpch.svg)

Pizzlies is the slowest, which is unsurprising. However, every single query still finishes in under 1.4 seconds. If you're only analysing a few hundred thousand rows of data in a cloud function, that may well be fast enough, and you'll have saved up to 180MB of dependencies.

One caveat: Pizzlies can't read Parquet, so for these benchmarks we read the files with PyArrow and converted them with `pz.from_arrow`. That conversion isn't free: turning the 600,000-row `lineitem` table into Python lists takes about 4.5 seconds, which is more than any single query.

## Why "Pizzlies"?

The Pizzly is a hybrid between grizzly bears and polar bears. It looks a bit like a polar bear, but is lighter. It also sounds kind of funny, which can only be a good thing.

## Acknowledgements

Thank you to Francesco Bruzzesi for having laid the groundwork for this to happen, and to Quansight Labs for some open source time.
