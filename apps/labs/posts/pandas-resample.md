---
title: "Why you probably should't be using `df.resample('M')`"
authors: [marco-gorelli]
published: June 17, 2024
description: 'Learn what you should be using instead'
category: [PyData ecosystem]
featuredImage:
  src: /posts/scikit-lego-narwhals/scikit_lego_narwhals_handshake.png
  alt: 'Scikit-lego and Narwhals logos shaking hands'
hero:
  imageSrc: /posts/scikit-lego-narwhals/hero.png
  imageAlt: 'Scikit-lego and Narwhals logos'
---

Suppose you have a Dataframe `df` containing two columns:

- date;
- price.

You can want to find the average price per month, and are using
pandas. Looking around online, you might find a solution such as

```python
df.resample('M', on='date')['price'].mean()
```

You may even have written production code yourself containing
such a pattern. In this post, I'd like to make the case that you
should almost certainly replace it with

```python
df.resample('MS', on='date')['price'].mean()
```

Let's learn why!

## What happens when we resample by 'M'

You'd be forgiven for thinking that `'M'` stands for "month".
But actually, looking at the [pandas docs](https://pandas.pydata.org/pandas-docs/version/2.1/user_guide/timeseries.html#offset-aliases), we see that it stands
for "month end"! Indeed, if we make a toy example and run the
code above, that's what we'll see:

```python
import pandas as pd
from datetime import datetime

df = pd.DataFrame({
    'date': [datetime(2020, 1, 1), datetime(2020, 1, 31, 3), datetime(2020, 2, 3)],
    'price': [1, 4, 3],
})
print(df.resample('M', on='date')['price'].mean())
```
```
date
2020-01-31    2.5
2020-02-29    3.0
Freq: ME, Name: price, dtype: float64
```

How should we interpret the index? It shows `2020-01-31` and `2020-02-29`.
Is that the upper-bound or the lower-bound of each bucket?
By looking at the output and the content of `'price'`, can reverse-engineer which elements landed in which bucket:

- `'2020-01-01'` and `'2020-01-31 03:00'` landed in the bucket labelled `'2020-01-31'`
- `'2020-02-03'` landed in the bucket labelled `'2020-02-29'`

Based on the above, the answers seems to be "neither". In fact,
the index shows the last day of the month, and the buckets are
constructed as follows:

- `('2019-12-31 23:59:59.999999999', '2020-01-31 23:59:59.999999999']`
- `('2020-01-31 23:59:59.999999999', '2020-02-29 23:59:59.999999999']`
- ...

This looks a bit complicated, but it's just following the meaning of the
`'M'` offset aliases, i.e. "month end".

## How do users probably think about it?

If you ask your software to calculate the average sales per month, then
you probably expect to report results in a format such as:

- January 2020 average: ...
- February 2020 average: ...
- ...

In your head, these probably correspond to the buckets:

- `['2020-01-01', '2020-02-01')`
- `['2020-02-01', '2020-03-01')`
- ...

and not the complicated right-closed buckets pandas created based on the
last nanosecond of each month. Surely there's a way to get pandas to
do this for us?

## What happens when you use `resample('MS')`

Let's repeat the example above using `'MS'`, and see what happens:

```python
print(df.resample('MS', on='date')['price'].mean())
```
```
2020-01-01    2.5
2020-02-01    3.0
Freq: MS, Name: price, dtype: float64
```

The index now shows the start of each interval, and the buckets are

- `['2020-01-01', '2020-02-01')`
- `['2020-02-01', '2020-03-01')`

Much simpler to reason about!

## What about Polars?

Do Polars users need to worry about the above distinction between
"month start" and "month end"? The answer is: no.

For `group_by_dynamic` (Polars' equivalent to `resample`), the only
monthly alises accepted is `'mo'`, and buckets are left-closed and
left-labelled by default, meaning that

```python
from datetime import datetime

import polars as pl

df = pl.DataFrame({
    'date': [datetime(2020, 1, 1), datetime(2020, 1, 31, 3), datetime(2020, 2, 3)],
    'price': [1, 4, 3],
})
print(df.group_by_dynamic('date', every='1mo').agg(pl.mean('price')))
```

gives you the result you were probably expecting from the start.

## Conclusion

We've seen how pandas users typically use `resample('M')` to calculate
monthly averages, and how the way buckets are created probably doesn't
align with their intuition. We then saw how using `resample('MS')`
delivers much more intuitive results. Finally, we looked at the respective
Polars API, and how to you can obtain the same results there.
