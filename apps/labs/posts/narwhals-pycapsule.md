---
title: 'Universal dataframe support with the Arrow PyCapsule Interface + Narwhals'
published: January 6, 2025
authors: [marco-gorelli]
description: 'Support everything, depend on (almost) nothing'
category: [PyData ecosystem]
featuredImage:
  src: /posts/narwhals-pycapsule/featured.jpg
  alt: 'Cat looking out window, with dataframe logos outside, original image by  Lucy Jackline https://unsplash.com/photos/a-cat-sitting-on-a-window-sill-looking-out-a-window-O896LIqr2vc'
hero:
  imageSrc: /posts/narwhals-pycapsule/hero.jpg
  imageAlt: 'Cat looking out window, with dataframe logos outside, original image by  Lucy Jackline https://unsplash.com/photos/a-cat-sitting-on-a-window-sill-looking-out-a-window-O896LIqr2vc'
---

# Universal dataframe support with the Arrow PyCapsule Interface + Narwhals

If you were writing a data science tool in 2015, you'd probably have
added pandas support and called it a day. However, it's not 2015, we've fast-forwarded to 2025,
and so if you do that today you'll be inundated with endless "can you support
Polars / DuckDB / PyArrow / DataFusion / ..." requests. Yet you have no interest in understanding
the subtle differences between them, prefering to focus on the problems which your library set
out to solve. What can you do?

Today, you'll learn about how to create tools which support all kinds of dataframes:

- The [Arrow PyCapsule Interface](https://arrow.apache.org/docs/format/CDataInterface/PyCapsuleInterface.html),
  if you need access to dataframe data from a low-level language like C or Rust.
- [Narwhals](https://github.com/narwhals-dev/narwhals), if you want to keep your logic in Python.
- Narwhals _and_ the PyCapsule Interface together, if you want it all!

## Summing non-null values in a column - "slow down, Professor!"

We'll learn about how you make a dataframe-agnostic function `agnostic_sum_i64_column`.
Here are the requirements:

- Given a dataframe `df` and a column name `column_name`, compute
  the sum of all non-null values in that column.
- If that column is not present, or if it is not of type `Int64`,
  raise an error.
- `pandas.DataFrame`, `polars.DataFrame`,
  `duckdb.PyRelation`, and `pyarrow.Table`, should all be supported without
  any of them being required.

Summing non-null values isn't rocket science, but how can we do this in a way that all
input libraries are supported without any of them being required?

## Low-level solution: PyCapsule Interface in Rust via PyO3

An example of a Rust solution via Pyo3 can be found at [pycapsule-demo/src/lib.rs](https://github.com/MarcoGorelli/pycapsule-demo/blob/6aad64be26ebbfc8526f26695544bfc6436e3266/src/lib.rs#L9-L56).

The technical details are beyond the scope of this post, but the summary is:

- We accept any object which implements the `ArrowStreamExportable` protocol from the
  [PyCapsule Interface](https://arrow.apache.org/docs/format/CDataInterface/PyCapsuleInterface.html).
  We can check for this by looking for the `__arrow_c_stream__` attribute:

  ```python
  >>> import polars as pl
  >>> import duckdb
  >>> import pandas as pd
  >>> import pyarrow as pa
  >>> hasattr(pl.DataFrame, '__arrow_c_stream__')
  True
  >>> hasattr(duckdb.DuckDBPyRelation, '__arrow_c_stream__')
  True
  >>> hasattr(pd.DataFrame, '__arrow_c_stream__')
  True
  >>> hasattr(pa.Table, '__arrow_c_stream__')
  True
  ```
- The solution is totally agnostic to the exact input, as it respects a standardised interface.
  We can verify this by trying to pass different dataframe libraries to the function:

  ```python
  >>> from pycapsule_demo import agnostic_sum_i64_column
  >>> df_pl = pl.DataFrame({'a': [1,1,2], 'b': [4,5,6]})
  >>> df_pd = pd.DataFrame({'a': [1,1,2], 'b': [4,5,6]})
  >>> df_pa = pa.table({'a': [1,1,2], 'b': [4,5,6]})
  >>> rel = duckdb.sql("select * from df_pd")
  >>> agnostic_sum_i64_column(df_pl, column_name="a")
  6
  >>> agnostic_sum_i64_column(df_pd, column_name="a")
  6
  >>> agnostic_sum_i64_column(df_pa, column_name="a")
  6
  >>> agnostic_sum_i64_column(rel, column_name="a")
  6
  ```

Like magic, our function works agnostically for any of these dataframes,
without us having to write any specialised code to handle the subtle differences
between them!

> **_NOTE:_** How many times can `agnostic_sum_i64_column` be called? Strictly
> speaking, the PyCapsule Interface only guarantees that it can be called once for
> any given input. In practice, however, all implementations that we're aware of
> (except for DuckDB) allow for it to be called repeatedly. Discussion about the
> DuckDB implementation is ongoing at https://github.com/duckdb/duckdb/discussions/15536.

If you found the above example a little daunting, you may be wondering if a simpler
solution exists which you can develop entirely in Python-land. Enter: Narwhals.

## Python solution: Narwhals

Narwhals is a lightweight, dependency-free, and extensible compatibility layer between
dataframe libraries functions. To use it to write a dataframe-agnostic function,
you need to follow three steps:

- Call `narwhals.from_native` on the user's object.
- Use the [Narwhals API](https://narwhals-dev.github.io/narwhals/api-reference/).
- If you want to return to the user an object of the same kind that they started with,
  call `to_native`.

In this case, a Narwhals version of `agnostic_sum_i64_column` looks like this:

```python
import narwhals as nw
from narwhals.typing import IntoFrame


def agnostic_sum_i64_column_narwhals(df_native: IntoFrame, column_name: str) -> int:
    lf = nw.from_native(df_native).lazy()
    schema = lf.collect_schema()
    if column_name not in schema:
        msg = f"Column '{column_name}' not found, available columns are: {schema.names()}."
        raise ValueError(msg)
    if (dtype := schema[column_name]) != nw.Int64:
        msg = f"Column '{column_name}' is of type {dtype}, expected Int64"
        raise TypeError(msg)
    df = lf.collect()
    return df[column_name].sum()
```

Like above, we can now pass different inputs and get the same result:
```python
>>> agnostic_sum_i64_column_narwhals(df_pl, column_name="a")
6
>>> agnostic_sum_i64_column_narwhals(df_pd, column_name="a")
6
>>> agnostic_sum_i64_column_narwhals(df_pa, column_name="a")
6
>>> agnostic_sum_i64_column_narwhals(rel, column_name="a")
6
```

So long as you stick to the Narwhals API, your code will keep working with all major dataframe libraries,
as well as with new ones which may appear in the future!

## Narwhals vs PyCapsule Interface: when to use one over the other, and when to use them together

If the Narwhals API is extensive enough for your use-case, then this is arguably
a simpler and easier solution than writing your own Rust function. On the other hand,
if you write a Rust function using the PyCapsule Interface, then you have complete
control over the data. So, when should you use which?

Let's cover some scenarios:

- If you want your dataframe logic to stay completely lazy where possible: use Narwhals.
  The PyCapsule Interface requires you to materialise the data into memory immediately,
  whereas Narwhals has both eager and lazy APIs.
- If you want complete control over your data: use the
  PyCapsule Interface. If you have the necessary Rust / C skills, there should be no limit
  to how complex and bespoke you make your data processing.
- If you want to keep your library logic to pure-Python and without heavy dependencies so
  it's easy to maintain and install: use Narwhals. Packaging a pure-Python project is very
  easy, especially compared with if you need to get Rust or C in there.
- If you want to do part of your processing in Python, and part of it in Rust - **use both**!
  An example of a library which does this is [Vegafusion](https://vegafusion.io/). This is
  facilitated by the fact that Narwhals exposes the PyCapsule Interface for both
  [import](https://narwhals-dev.github.io/narwhals/api-reference/narwhals/#narwhals.from_arrow)
  and [export](https://narwhals-dev.github.io/narwhals/api-reference/dataframe/#narwhals.dataframe.DataFrame.__arrow_c_stream__).

## What about Polars Plugins?

We wrote some Rust code earlier to express custom logic. You may have come across another way
to do this in Polars: [Expressions Plugins](https://marcogorelli.github.io/polars-plugins-tutorial/).
How does that differ from writing custom code with the PyCapsule Interface?

- Pros: Polars Plugins slot in seamlessly with Polars' lazy execution. This can enable massive
  time and cost savings, see [Reverse-Geocoding in AWS Lambda: Save Time and Money Using Polars Plugins](https://quansight.com/post/reverse-geocoding-aws-lambda-using-polars-plugin/)
  for an example.
- Cons: Polars Plugins are specific to Polars and so won't work with other dataframe libraries.

If you know that Polars is the only library you need to support, then Polars Plugins are the preferred
way to write custom user-defined logic. If you'd like to learn how, [we can help](https://quansight.com/about-us/#bookacallform)!

# Conclusion

As the Dataframe ecosystem grows, so does the demand for tools with universal dataframe
support (as opposed to those tightly-coupled to pandas). We've learned about how to use
the PyCapsule Interface to write dataframe-agnostic code from a low-level language such
as Rust or C. We also learned about how we can do that using Narwhals entirely from
Python. Finally, we discussed when it may makes sense to use one, the other, or even both
approaches together.

If you would like to contribute to efforts towards standardising the data ecosystem and
enabling innovation, or would just like to speak with data experts about how we can help
your organisation, please [book a call](https://quansight.com/about-us/#bookacallform)
with us, we'd love to hear from you!
