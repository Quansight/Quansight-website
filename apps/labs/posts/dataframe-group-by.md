---
title: 'The "Polars vs pandas" difference nobody is talking about'
authors: [marco-gorelli]
published: May 10, 2024
description: 'A closer look at non-elementary group-by aggregations'
category: [PyData ecosystem]
---

# The "Polars vs pandas" difference nobody is talking about

I attended PyData Berlin 2024 this week, and it was a blast! I met so many colleagues, collaborators, and friends.
There was quite some talk of Polars - some people even gathered together for a Polars-themed dinner! It's certainly nice to see
people talking about it, and the focus tends to be on features such as:

- lazy execution;
- Rust;
- consistent handling of null values;
- multithreading;
- query optimisation.

Yet there's one innovation which barely ever gets a mention: non-elementary group-by aggregations.

I'll start by introducing the group-by operation. We'll then take a look at elementary aggregations
with both the pandas and Polars syntaxes. Finally, we'll look at non-elementary aggregations, and see
how the Polars syntax enables so much more than the pandas one.

## What's a group-by?

Suppose we start with a dataframe such as:

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

For this task, that's a nice API:

- select which columns you're grouping by;
- select the column(s) you want to aggregate;
- specify an elementary aggregation function.

Let's try something else: "find the maximum value of 'c', where 'b' is greater than its mean, per
group 'a'".

Unfortunately, the pandas API has no way to express this, meaning
that no library which copies pandas can truly optimise such an
operation in the general case.

We could do
```python
df.groupby('a').apply(
    lambda df: df[df['b'] > df['b'].mean()]['c'].max()
)
```

However, that uses a Python `lambda` function and so is generally going to be inefficient.

Another solution could be to do:
```python
df[df['b'] > df.groupby('a')['b'].transform('mean')].groupby('a')['c'].max()
```
This isn't too bad, but it involves doing two group-bys, and so is at least twice as slow as it could
be.

Finally, can rely on `GroupBy` caching its groups, in-place mutation of the original dataframe, and the
fact that `'max'` skips over missing values, to write:
```python
gb = df.groupby("a")
mask = df["b"] > gb["b"].transform("mean")
df["result"] = np.where(mask, df["c"], np.nan)
gb["result"].max()
```
This works, but it involved quite some manual optimisation, and is definitely not a general solution.

Surely it's possible to do better?

## Non-elementary group-bys in Polars

The Polars API lets us pass expressions to `GroupBy.agg`. So long as you can express your aggregation as
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
Wonderful! We could express the operation cleanly using the library's own API, meaning that any implementation
of the Polars API (not necessarily Polars itself) has the possibility to evaluate this efficiently.

## Conclusion, and a plea to future dataframe authors

We've learned about the group-by operation, elementary aggregations in both pandas and Polars, and how
Polars' syntax enables optimisation of non-elementary aggregations.

pandas is a wonderful tool which solves a lot of real problems for a lot of real people.
But please, stop copying its API. No matter how much effort you put into
your implementation, if your API is limited and can't express non-elementary group-by aggregations,
then you're going to run into a wall at some point. Good luck reverse-parsing the bytecode of a user's
Python lambda function.

On the other hand, if you innovate on the API side, you can enable new possibilities. There's a reason
that

> I came for the speed, but stayed for the syntax

is a common refrain among Polars users.

There may be a more general lesson here: if you have the courage to do things differently, you may be rewarded.

If you'd like to learn about how to use Polars effectively, or how to solve problems in your organisation
using Polars, Quansight is here to help - you can get in touch [here](https://quansight.com/about-us/#bookacallform).
