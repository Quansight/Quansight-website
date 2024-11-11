---
title: 'The Polars vs pandas difference nobody is talking about'
published: November 11, 2024
authors: [marco-gorelli]
description: 'A closer look at non-elementary group-by aggregations'
category: [PyData ecosystem]
featuredImage:
  src: /posts/dataframe-group-by/group-by-hero-mobile.png
  alt: 'Group of Polar bears'
hero:
  imageSrc: /posts/dataframe-group-by/group-by-hero-desktop.png
  imageAlt: 'Example of group-by operation in Polars'
---

# The Polars vs pandas difference nobody is talking about

I attended PyData Berlin 2024 in April, and it was a blast! I met so many colleagues, collaborators, and friends.
There was quite some talk of Polars - some people even gathered together for a Polars-themed dinner!
It's certainly nice to see people talking about it, and the focus tends to be on features such as:

- lazy execution
- Rust
- consistent handling of null values
- multithreading
- query optimisation

Yet there's one innovation which barely ever gets a mention: non-elementary group-by aggregations.

I'll start by introducing the group-by operation. We'll then take a look at elementary aggregations
with both the pandas and Polars APIs. Finally, we'll look at non-elementary aggregations, and see
how the Polars API enables so much more than the pandas one.

## What's a group-by?

Suppose we start with a (Polars) dataframe such as:

```python
shape: (6, 3)
┌─────┬─────┬─────┐
│ a   ┆ b   ┆ c   │
│ --- ┆ --- ┆ --- │
│ i64 ┆ i64 ┆ i64 │
╞═════╪═════╪═════╡
│ 1   ┆ 4   ┆ 3   │
│ 1   ┆ 1   ┆ 1   │
│ 1   ┆ 2   ┆ 2   │
│ 2   ┆ 7   ┆ 8   │
│ 2   ┆ 6   ┆ 6   │
│ 2   ┆ 7   ┆ 7   │
└─────┴─────┴─────┘
```

A group-by operation produces a single row per group:
```python
df.group_by('a').agg('b')
```
```
shape: (2, 2)
┌─────┬───────────┐
│ a   ┆ b         │
│ --- ┆ ---       │
│ i64 ┆ list[i64] │
╞═════╪═══════════╡
│ 2   ┆ [7, 6, 7] │
│ 1   ┆ [4, 1, 2] │
└─────┴───────────┘
```

If we want a single scalar value per group, we can use a reduction ('mean', 'sum', 'std', ...):
```python
df.group_by('a').agg(pl.sum('b'))
```
```python
shape: (2, 2)
┌─────┬─────┐
│ a   ┆ b   │
│ --- ┆ --- │
│ i64 ┆ i64 │
╞═════╪═════╡
│ 2   ┆ 20  │
│ 1   ┆ 7   │
└─────┴─────┘
```

### Group-by in pandas

If you're coming from a pandas-like library, you may have been used to writing the above example as

```python
df.groupby('a')['b'].sum()
```

And indeed, for such a simple task as this one, the pandas API is quite nice. All we had to do was:

1. select which columns we're grouping by
2. select the column(s) we want to aggregate
3. specify an elementary aggregation function

Let's try something else: "find the maximum value of 'c', where 'b' is greater than its mean, per
group 'a'".

Unfortunately, the pandas API has no way to express this, meaning
that no library which copies the pandas API can truly optimise such an
operation in the general case.

You might be wondering whether we can just do the following:
```python
df.groupby('a').apply(
    lambda df: df[df['b'] > df['b'].mean()]['c'].max()
)
```

However, that uses a Python `lambda` function and so is generally going to be inefficient.

Another solution one might come up with is this one:
```python
df[df['b'] > df.groupby('a')['b'].transform('mean')].groupby('a')['c'].max()
```
It's not as bad as the `apply` solution above, but it still looks overly complicated and requires
two group-bys.

There's actually a third solution, which:

- relies on `GroupBy` caching its groups
- performs in-place mutation of the original dataframe
- uses the fact that `'max'` skips over missing values

Realistically, few users would come up with it (most would jump straight to `apply`), but for
completeness, we present it:
```python
gb = df.groupby("a")
mask = df["b"] > gb["b"].transform("mean")
df["result"] = np.where(mask, df["c"], np.nan)
gb["result"].max()
```

Surely it's possible to do better?

## Non-elementary group-bys in Polars

The Polars API lets us pass [expressions](https://docs.pola.rs/user-guide/concepts/expressions/) to `GroupBy.agg`.
So long as you can express your aggregation as
an expression, you can use it in a group-by setting. In this case, we can express "the maximum value
of 'c' where 'b' is greater than its mean" as
```python
pl.col('c').filter(pl.col('b') > pl.mean('b')).max()
```
Then, all we need to do is pass this expression to `GroupBy.agg`:

```python
df.group_by('a').agg(
    pl.col('c').filter(pl.col('b') > pl.mean('b')).max()
)
```
Wonderful! Like this, we can express the operation cleanly and without hacks, meaning that any dataframe
implementation which follows the Polars API has the possibility to evaluate this efficiently.

## Conclusion, and a plea to future dataframe authors

We've learned about the group-by operation, elementary aggregations in both pandas and Polars, and how
Polars' syntax enables users to cleanly express non-elementary aggregations.

pandas is a wonderful tool which solves a lot of real problems for a lot of real people.
However, by insisting on copying its API, the dataframe landscape is stunting its own potential.
If an API doesn't allow for an operation to be expressed and users end up using `apply` with custom
Python lambda functions, then no amount of acceleration is going to make up for that.

On the other hand, innovation on the API side can enable new possibilities. There's a reason
that

> I came for the speed, but stayed for the syntax

is a common refrain among Polars users.

For years, the unwritten consensus among dataframe library authors was that if you wanted to
get adoption, then you needed to mimic the pandas API. However, Polars' success calls that into question.
There may be a more general lesson to be learned here: try doing things differently, and then maybe - just
maybe - you might be rewarded.

If you'd like to learn about how to use Polars effectively, or how to solve problems in your organisation
using Polars, Quansight is here to help - [please get in touch](https://quansight.com/about-us/#bookacallform) -
we'd love to hear from you.
