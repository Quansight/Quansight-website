---
title: "Expressions are coming for pandas!"
published: 27 August, 2025
authors: [marco-gorelli]
description: "`pd.col` will soon be a real thing!"
category: [PyData ecosystem]
featuredImage:
  src: /posts/pandas-expressions/featured.jpg
  alt: 'panda climbing tree, with `pd.col` writing. Photo by Chester Ho on Unsplash'
hero:
  imageSrc: /posts/pandas-expressions/hero.jpg
  imageAlt: 'panda climbing tree, with `pd.col` writing. Photo by Chester Ho on Unsplash'

---

> "Express yourself (Ah, ah, ah yeah, ah yeah, ah yeah, ah yeah)" - _Dr. Dre_

17 years ago, pandas came onto the scene and took the Python data science scene by storm. It provided data scientists with an efficient way to interact with tabular data and solve real problems. Over time, other frameworks have emerged, often inspired by pandas but making various innovations aimed at tackling pandas' limitations. Recently, we've come full-circle, and pandas has introduced a new syntax inspired by the newer wave of dataframe libraries. Let's learn about why, and how you can use it!

## How to assign a new column in pandas

Suppose you've got a dataframe of city temperatures and populations:

```python
import pandas as pd

data = {'city': ['Sapporo', 'Kampala'], 'temp_c': [6.7, 25.]}
df = pd.DataFrame(data)
```

Let's look at how we can make a new column `'temp_f'` which converts `'temp_c'` to Farenheit.

```python
# option 1
df['temp_f'] = df['temp_c'] * 9 / 5 + 32

# option 2
df = df.assign(temp_f = lambda x: x['temp_c'] * 9 + 32)

# option 3 (coming in pandas 3.0!)
df = df.assign(temp_f = pd.col('temp_c') * 9 + 32)
```

The first option modifies the original object `df` in-place, and isn't suitable for method-chaining. The second option allows for method chaining, but requires using a lambda function. The third option is the new syntax coming in pandas 3.0. But why is it an improvement over the second option, what's so bad about lambda functions? There's a few reasons:

- Scoping rules make their behaviour hard to predict (example below!).
- They are opaque and non-introspectible. Try printing one out on the console, and you'll see something incomprehensible like `<function <lambda> at 0x76b583037560>`. If you receive a lambda function from user input, you have no way to validate what's inside (unless you enjoy reverse-engineering byte-code, and even then, you won't be able to do it in general).

I don't think the first point is appreciated enough, so before exploring `pd.col` more, let's elaborate on this `lambda` drawback.

## `lambda` might not do what you think it does

Say you have a dataframe

```python
df = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6], 'c': [7,8,9]})
```

and you want to increase each column's value by `10`. Rather than writing out an operation for each column, you try to get clever and write a dictionary comprehension:

```python
df.assign(
    **{col: lambda x: x[col] + 10 for col in df.columns}
)
```

Try executing though - you'll be in for a big surprise!

```python
    a   b   c
0  17  17  17
1  18  18  18
2  19  19  19
```

Bet that's not what you were expecting! Time to learn how to do better.

## Express yourself

Let's rewrite the above using expressions:

```python
df.assign(
    **{col: pd.col(col) + 10 for col in df.columns}
)
```

The output of `pd.col` is called an _expression_. You can think of it as a delayed column - it's only produces a result once it's evaluated inside a dataframe context. Note only does it provide us with a clean syntax, it also produces the output we were expecting!

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

Anecdotally, from my experience teaching Polars (a newer dataframe library which makes extensive use of expressions), people develop an intuition for this `col` syntax very quickly.

## What else can `pd.col` do?

Series namespaces, such as [dt](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.dt.html) and [str](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.str.html), are also supported. If you [register your own Series namespace](https://pandas.pydata.org/docs/reference/api/pandas.api.extensions.register_series_accessor.html), that'll also be supported. NumPy [ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html) can also take expressions are arguments:

```python
import numpy as np
import pandas as pd

df = pd.DataFrame({'city': ['Sapporo', 'Kampala'], 'temp_c': [6.7, 25.]})
df.assign(
    city_upper = pd.col('city').str.upper(),
    log_temp_c = np.log(pd.col('temp_c')),
)
```

```console
      city  temp_c city_upper  log_temp_c
0  Sapporo     6.7    SAPPORO    1.902108
1  Kampala    25.0    KAMPALA    3.218876
```

You can use `pd.col` anywhere in the pandas API where they accept callables from dataframes to series or scalars. One such place is `loc` - for example, to keep all rows where the value of column `'a'` is greater than `1`, you can do:

```python
df = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6], 'c': [7,8,9]})
df.loc[pd.col('a')>1]
```

```console
   a  b  c
1  2  5  8
2  3  6  9
```

## Can we use `pd.all` too?

If you're used to Polars, you might be wondering if it's possible to take things a step further by rewriting the above as just:

```python
df.assign(pd.all() + 10)
```

Answer: not yet. Some extensive refactors would be needed in pandas for that to work. But, the introduction of `pd.col` at least opens the doors to it!

In the meantime, [Narwhals](https://github.com/narwhals-dev/narwhals) implements more complete support for expressions on top of pandas (as well as on top of DuckDB, PySpark, Dask, and other major libraries!):

```python
import narwhals as nw

nw.from_native(df).with_columns(nw.all() + 10).to_native()
```

[nw.all](https://narwhals-dev.github.io/narwhals/api-reference/narwhals/#narwhals.all), [selectors](https://narwhals-dev.github.io/narwhals/api-reference/selectors/), and [expressions for use in `group_by`](https://narwhals-dev.github.io/narwhals/api-reference/dataframe/#narwhals.dataframe.DataFrame.group_by) are all already supported there - if you enjoy Polars' expressive syntax and want to write code which supports other major dataframe libraries too, check it out, you may like what you find!

## What's next?

We've looked at how pandas 3.0 will come with a new feature (`pd.col`) which allows you to use expressions to write readable code which avoids the many pitfalls of `lambda`s. This is a newly-introduced feature in pandas, and future work may include:

- Serialising and deserialising expressions.
- Accepting expressions in `groupby`.
- Multi-output expressions, such as `pd.all` or selectors.

If you would like help implementing solutions with any of the tools covered in this post or would like to sponsor efforts toward dataframe API unification, [we can help](https://quansight.com/about-us/#bookacallform)!
