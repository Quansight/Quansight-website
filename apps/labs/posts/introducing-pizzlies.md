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

| Library                                        | Installed size |
| ---------------------------------------------- | -------------: |
| Pizzlies                                       | 2.4 MB         |
| DuckDB                                         | 70 MB          |
| pandas (+ NumPy, python-dateutil, tzdata)      | 97 MB          |
| PyArrow                                        | 171 MB         |
| Polars (+ polars-runtime-32)                   | 183 MB         |

## Wheel size

The wheel is what you download when you `pip install`, so it's what you pay for in network transfer and installation time:

| Library                        | Wheel size |
| ------------------------------ | ---------: |
| Pizzlies                       | 0.6 MB     |
| DuckDB                         | 25 MB      |
| pandas (+ NumPy)               | 28 MB      |
| Polars (+ polars-runtime-32)   | 55 MB      |
| PyArrow                        | 55 MB      |

The compiled libraries' wheels are platform-specific (the numbers above are for manylinux x86-64), whereas Pizzlies and Narwhals ship a single `py3-none-any` wheel which works everywhere.

## Import times

Each number is the median of 100 imports, each in a fresh interpreter:

| Library  | Import time |
| -------- | ----------: |
| Pizzlies | 40 ms       |
| DuckDB   | 81 ms       |
| Polars   | 131 ms      |
| PyArrow  | 142 ms      |
| pandas   | 347 ms      |

## Speed: TPC-H queries

The TPC-H benchmarks have, for some reason, become the reference benchmark comparison for dataframes. They are somewhat one-dimensional, as they don't fully capture the kind of work that data scientists often perform (for example, where do window functions even appear in the TPC-H queries? They're nowhere to be found). Nonetheless, they do give us an idea of how performant (or not!) Pizzlies is.

We ran the [Narwhals TPC-H queries](https://github.com/narwhals-dev/narwhals/tree/main/tpch) at scale factor 0.1, where the largest table (`lineitem`) has about 600,000 rows. Each library ran the exact same Narwhals code. We loaded all tables into memory before starting the clock, so file reading isn't included, and we checked every result against the reference answers. Pizzlies got all 22 queries right.

| Library  | Total, all 22 queries | Geometric mean per query |
| -------- | --------------------: | -----------------------: |
| Polars   | 0.53 s                | 0.020 s                  |
| DuckDB   | 0.78 s                | 0.031 s                  |
| pandas   | 3.6 s                 | 0.096 s                  |
| PyArrow  | 11.2 s                | 0.21 s                   |
| Pizzlies | 15.1 s                | 0.41 s                   |

Pizzlies is the slowest, which is unsurprising. However, every single query still finishes in under 1.4 seconds. If you're only analysing a few hundred thousand rows of data in a cloud function, that may well be fast enough, and you'll have saved up to 180MB of dependencies.

Per-query timings (in seconds, median of 5 runs for the compiled libraries and of 3 runs for Pizzlies):

| Query | Polars | DuckDB | pandas | PyArrow | Pizzlies |
| ----- | -----: | -----: | -----: | ------: | -------: |
| q1    | 0.013  | 0.022  | 0.142  | 0.070   | 1.383    |
| q2    | 0.035  | 0.037  | 0.042  | 0.236   | 0.066    |
| q3    | 0.021  | 0.028  | 0.101  | 0.579   | 0.523    |
| q4    | 0.013  | 0.034  | 0.075  | 0.238   | 1.246    |
| q5    | 0.028  | 0.040  | 0.450  | 0.660   | 0.669    |
| q6    | 0.003  | 0.007  | 0.024  | 0.008   | 0.987    |
| q7    | 0.059  | 0.090  | 0.190  | 0.762   | 0.201    |
| q8    | 0.041  | 0.070  | 0.624  | 2.529   | 1.208    |
| q9    | 0.036  | 0.051  | 0.484  | 1.825   | 1.112    |
| q10   | 0.031  | 0.039  | 0.332  | 0.756   | 1.369    |
| q11   | 0.027  | 0.021  | 0.028  | 0.047   | 0.035    |
| q12   | 0.015  | 0.026  | 0.122  | 0.412   | 0.729    |
| q13   | 0.017  | 0.034  | 0.081  | 0.134   | 0.363    |
| q14   | 0.010  | 0.013  | 0.095  | 0.117   | 1.004    |
| q15   | 0.013  | 0.022  | 0.027  | 0.013   | 0.816    |
| q16   | 0.020  | 0.031  | 0.060  | 0.065   | 0.108    |
| q17   | 0.012  | 0.026  | 0.032  | 0.494   | 0.048    |
| q18   | 0.032  | 0.033  | 0.058  | 0.312   | 0.262    |
| q19   | 0.011  | 0.022  | 0.247  | 0.899   | 0.404    |
| q20   | 0.028  | 0.035  | 0.061  | 0.066   | 1.308    |
| q21   | 0.048  | 0.072  | 0.264  | 0.928   | 1.241    |
| q22   | 0.018  | 0.026  | 0.015  | 0.012   | 0.033    |

One caveat: Pizzlies can't read Parquet, so for these benchmarks we read the files with PyArrow and converted them with `pz.from_arrow`. That conversion isn't free: turning the 600,000-row `lineitem` table into Python lists takes about 4.5 seconds, which is more than any single query.

## Why "Pizzlies"?

The Pizzly is a hybrid between grizzly bears and polar bears. It looks a bit like a polar bear, but is lighter. It also sounds kind of funny, which can only be a good thing.

## Acknowledgements

Thank you to Francesco Bruzzesi for having laid the groundwork for this to happen, and to Quansight Labs for some open source time.
