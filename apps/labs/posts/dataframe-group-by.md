---
title: 'The Polars innovation nobody is talking about'
authors: [marco-gorelli]
published: April 26, 2024
description: 'A closer look at non-elementary group-by aggregations'
category: [PyData ecosystem]
---

# The Polars innovation nobody is talking about

I attended PyData Berlin 2024 this week, and was pleased to see so much talk of Polars. Some people
even gathered together for a Polars-themed dinner! There's a lot of advantages people bring up
when talking about Polars:

- lazy execution
- Rust
- consistent handling of null values
- multithreading
- query optimisation

yet there's one innovation which barely ever gets a mention: non-elementary group-by aggregations.
Let's give it the attention it deserves.

We'll start by introducing the group-by operation. We'll then take a look at elementary aggregations
with both the pandas and Polars syntaxes. Finally, we'll see how the Polars syntax enables
non-elementary group-by aggregations.

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

A group-by operation results in a single row per group. For example, if we do
```python
df.group_by('a').agg('b')
```
we end up with
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

## Group-by in pandas

If you're coming from a pandas-like library, you may have been used to writing the above example as

```python
df.groupby('a')['b'].sum()
```

That's a solid API:

- select which columns you're grouping by;
- select the column(s) you want to aggregate;
- specify an elementary aggregation function.

Let's try something else: "find the maximum value of 'c', where 'b' is greater than its mean, per
group 'a'. How do we express this with the pandas API?

I have no idea. Here's all I can come up with:

### 1. Use a user-defined function

We could do
```python
df.groupby('a').apply(
    lambda df: df[df['b'] > df['b'].mean()]['c'].max()
)
```

However, if there's one lesson you should learn about working with dataframes, it's that any time
you find yourself writing
```python
.apply(lambda
```
you're probably "shooting yourself in the foot". It's only intended as a last-resort, and isn't
something which implementation can easily parse and optimise.

### 2. Perform multiple group-bys

Another solution I can think of is
```python
df[df['b'] > df.groupby('a')['b'].transform('mean')].groupby('a')['c'].max()
```
this isn't too bad, but it involves doing two group-bys, and so is at least twice as slow as it could
be.

Can we do better?

## Non-elementary group-bys in Polars

Yes we can! The Polars API lets us pass expressions to `GroupBy.agg`. We can express "the maximum value
of 'c' where 'b' is greater than its mean" as
```python
pl.col('c').filter(pl.col('b') > pl.mean('b')).max()
```
We can then insert it into `GroupBy.agg` and get

```python
df.group_by('a').agg(
    pl.col('c').filter(pl.col('b') > pl.mean('b')).max()
)
```
Wonderful! If there's a syntax which can express this operation, then an implementation can optimise
it.

## Conclusion, and a plea to future dataframe authors

We've learned about the group-by operation, elementary aggregations in both pandas and Polars, and how
Polars' syntax enables optimisation of non-elementary aggregations.

pandas is a wonderful tool which solves a lot of real problems for a lot of real people.
But please, stop copying its API. Not matter how much effort you put into
your implementation, if your API is limited and can't express non-elementary group-by aggregations,
then you're going to run into a wall at some point. Good luck reverse-parsing the bytecode of a user's
Python lambda function.

On the other hand, if you innovate on the API side, you can enable new possibilities. There's a reason
that

> I came for the speed, but stayed for the syntax

is a common refrain among Polars users.

There may be a more general lesson here: have the courage to do things differently.
