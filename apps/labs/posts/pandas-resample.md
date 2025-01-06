---
title: "Why you probably shouldn't be using `df.resample('M')`"
authors: [marco-gorelli]
published: June 17, 2024
description: 'Learn what you should be using instead'
category: [PyData ecosystem]
featuredImage:
  src: /posts/pandas-resample/pandas-resample.png
  alt: 'Image of Drake not looking impressed at `resample("M")`, and preferring `resample("MS")`'
hero:
  imageSrc: /posts/pandas-resample/pandas-logo-wide-field.png
  imageAlt: 'Pandas logo'
---

Suppose you have a Dataframe `df` containing two columns:

- date;
- price.

You can want to find the average price per month, and are using
pandas. Looking around online, you might find a solution such as

```python
df.resample('M', on='date')['price'].mean()
# or, since pandas 2.1: df.resample('ME', on='date')['price'].mean()
```

which divides the data into monthly buckets and finds the mean value of
`'price'` for each one.

There's nothing wrong with that - however, in this post, I'd like to make the
case that you should almost certainly replace it with

```python
df.resample('MS', on='date')['price'].mean()
```

Let's learn why!

## What happens when we resample by 'M' (or 'ME')

Before we begin, let's talk about `'M'`. You'd be forgiven for thinking that it stands for "month".
But actually, looking at the [pandas docs](https://pandas.pydata.org/pandas-docs/version/2.1/user_guide/timeseries.html#offset-aliases), we see that it stands for "month end"! Indeed in pandas 2.1 it was deprecated and
renamed to `'ME'` to make its meaning clearer.

With that out of the way, let's make a toy example and see what it does:

```python
import pandas as pd
from datetime import datetime

df = pd.DataFrame({
    'date': [datetime(2020, 1, 1), datetime(2020, 1, 31, 3), datetime(2020, 2, 3)],
    'price': [1, 4, 3],
})
print(df.resample('ME', on='date')['price'].mean())
```

```
date
2020-01-31    2.5
2020-02-29    3.0
Freq: ME, Name: price, dtype: float64
```

We got a Series where the values are `[2.5, 3]` and the index `['2020-01-31', '2020-02-29']`.
How should we interpret the index? Does it contain the lower-bound or the upper-bound of each
bucket?

The answer is...neither! Here's what they represent (note that we use `'('` and `')'` to refer to open boundaries
and `'['` and `']'` to refer to closed ones):

- Label `'2020-01-31'` corresponds to the bucket `('2019-12-31 23:59:59.999999999', '2020-01-31 23:59:59.999999999']`
- Label `'2020-02-29'` corresponds to the bucket `('2020-01-31 23:59:59.999999999', '2020-02-29 23:59:59.999999999']`
- ...

This looks a bit complicated, and probably not at all what users expect. Ask a crowd of data scientists which bucket
the data point corresponding to `'2020-01-31 01:00:00'` would land in and, unless they've read this article, you'll
probably get mixed answers.

## What happens when we resample by 'MS'

`'MS'` is the start-of-the-month counterpart to `'M'` / `'ME'` (not to be confused with `'ms'`, which stands for
"millisecond"). Let's repeat the example above using this offset alias instead:

```python
print(df.resample('MS', on='date')['price'].mean())
```

```
2020-01-01    2.5
2020-02-01    3.0
Freq: MS, Name: price, dtype: float64
```

The values are the same, but the index has changed. It now consistently shows
the start of each bucket:

- Label `'2020-01-01'` corresponds to the bucket `['2020-01-01', '2020-02-01')`
- Label `'2020-02-01'` corresponds to the bucket `['2020-02-01', '2020-03-01')`
- ...

Much simpler to reason about! In this case, the Series values (`2.5` and `3.0`) are
the same as before, but the interpretation of what they correspond to is much simpler.
If you ask a crowd of data scientists which bucket a point corresponding to
`'2020-01-31 01:00:00'` would land in, you can bet they'd all get it right this time ;).

## How does this differ from Polars?

Do Polars users need to worry about the above distinction between
"month start" and "month end"? The answer is: no.

For `group_by_dynamic` (Polars' equivalent to `resample`), the only
monthly alias accepted is `'mo'`, and buckets are left-closed and
left-labelled by default. Therefore,

```python
from datetime import datetime

import polars as pl

df = pl.DataFrame({
    'date': [datetime(2020, 1, 1), datetime(2020, 1, 31, 3), datetime(2020, 2, 3)],
    'price': [1, 4, 3],
})
print(df.group_by_dynamic('date', every='1mo').agg(pl.mean('price')))
```

gives you a result equivalent to pandas' `resample('MS')`.

## Conclusion

We've seen how pandas users typically use `resample('M')` (or `resample('ME')` since pandas 2.1) to calculate
monthly averages, and how the way buckets are created and labelled probably doesn't
align with their intuition. We then saw how using `resample('MS')`
delivers much more intuitive results. Finally, we looked at the respective
Polars API, and how to you can obtain the same results there.
