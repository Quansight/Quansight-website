---
title: "Expressions are coming for pandas!"
published: 28 August, 2025
authors: [marco-gorelli]
description: "Express youself"
category: [PyData ecosystem]
featuredImage:
  src: /posts/duckdb-when-used-to-frames/featured.jpg
  alt: 'Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/brown-and-green-mallard-duck-on-water--ZSnI9gSX1Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
hero:
  imageSrc: /posts/duckdb-when-used-to-frames/hero.jpg
  imageAlt: 'Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/brown-and-green-mallard-duck-on-water--ZSnI9gSX1Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'

---

> "Express yourself", Dr. Dre

The most widely used dataframe library out there is - by far - pandas. It's been around for over 15 years, and clearly solves a lot of real problems for a lot of people. The syntax hasn't massively moved in that time, yet recently, a new feature has been introduced which it feel closer to modern tools like Polars.

## How to assign a new column in pandas

Suppose you've got a dataframe of city temperatures and populations:

```python
import pandas as pd

data = {
    'city': ['Sapporo', 'Kampala'],
    'population': [1_973_000, 1_680_000],
    'temp_c': [6.7],
}
df = pd.DataFrame(data)
```

If you wanted to convert column `'temp_c'` to Farenheit, then you have a couple of options:

```python
# option 1
df['temp_f'] = df['temp_c'] * 9 / 5 + 32

# option 2
df = df.assign(temp_f = lambda x: x['temp_c'] * 9 + 32)
```

The first option modifies the original object `df` in-place, and isn't suitable for method-chaining. Hence, method-chaining aficionados tend to prefer the second option, whilst acknowledging some of its drawbacks:

- `lambda` functions aren't easy to explain to beginners (anyone with experience teaching Python and/or mentoring people will confirm).
- `lambda` functions are opaque and non-introspectible. Try printing the function out on the console, and you'll see something incomprehensible like `<function <lambda> at 0x76b583037560>`. If you receive a lambda function from user input, you have no way to validate what's inside (unless you enjoy reverse-engineering byte-code, and even then, you won't be able to do it in general).
- scoping rules make behaviour with lambdas hard to predict.

I don't think the last point is appreciated enough, so let's look at an example.

## `assign` with `lambda` might not be doing what you think it does

Say you have a dataframe

```python
df = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6], 'c': [7,8,9]})
```

and decide you want to increase each column's value by `10`. Rather than writing out an operation for each column, you try to get clever and write a for-loop:

```python
df.assign(
    **{col: lambda x: x[col] + 10 for col in df.columns}
)
```

Try executing though - you'll be in for a big surprise:

```python
    a   b   c
0  17  17  17
1  18  18  18
2  19  19  19
```

Bet that's not what you were expecting! But don't worry - there's a better way.

## Express yourself

Let's rewrite the above using expressions. Note that the following syntax will only be available in pandas 3.0 which - at the time of writing - has not yet been released. But it gives you a glimpse into the future!

```python
df.assign(
    **{col: pd.col(col) + 10 for col in df.columns}
)
```

And now, you get the output you were expecting, with a much cleaner syntax!

```python
    a   b   c
0  20  50  17
1  30  60  18
2  40  70  19
```

Furthermore, we no longer have to deal with opaque lambda functions. If you print the expression, you'll get readable output:

```python
In [7]: pd.col('a') + 10
Out[7]: (col('a') + 10)
```

## Can we use `pd.all` too?

If you're used to Polars, you might be expecting to be able to write something like

```python
df.assign(pd.all() + 10)
```

Although Polars, supports such expressive syntax, some extensive refactors would be needed in pandas for that to work. But, the introduction of `pd.col` at least opens the doors to it!

In the meantime, [Narwhals](https://github.com/narwhals-dev/narwhals) implements more complete support for expressions on top of pandas (as well as on top of DuckDB, PySpark, Dask, and other major libraries!):

```python
import narwhals as nw

nw.from_native(df).with_columns(nw.all() + 10).to_native()
```

[nw.all](https://narwhals-dev.github.io/narwhals/api-reference/narwhals/#narwhals.all), [selectors](https://narwhals-dev.github.io/narwhals/api-reference/selectors/), and [expressions for use in `group_by`](https://narwhals-dev.github.io/narwhals/api-reference/dataframe/#narwhals.dataframe.DataFrame.group_by) are all already supported there!

## What's next?

We've looked at how pandas 3.0 will come with a new feature (`pd.col`) which allows you to use expressions to write readable code which avoids the many pitfalls of `lambda`s. This is a newly-introduced feature in pandas, and future work may include:

- Serialising and deserialising expressions.
- Accepting expressions in `groupby`.
- Multi-output expressions, such as `pd.all` or selectors.

If you would like help implementing solutions with any of the tools covered in this post or would like to sponsor efforts toward dataframe API unification, [we can help](https://quansight.com/about-us/#bookacallform)!
