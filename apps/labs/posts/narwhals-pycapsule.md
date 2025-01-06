---
title: 'Arrow PyCapsule Interface and Narwhals for universal dataframe support'
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

# How the Arrow PyCapsule Interface and Narwhals universal enable dataframe support 

If you were writing a dataframe-consuming library in 2015, you'd probably have
added pandas support and called it a day. However, it's not 2015, but 2025, so if you do that
today you know full well that you'll be inundated with endless "can you support
Polars / DuckDB / PyArrow / Modin / ..." requests. Yet you have no interest in understanding
the subtle differences between them - what can you do?

Today, you'll learn about ways to support different kinds of dataframes:

- The [Arrow PyCapsule Interface](https://arrow.apache.org/docs/format/CDataInterface/PyCapsuleInterface.html),
  if you need access to dataframe data from a low-level language like C or Rust.
- [Narwhals](https://github.com/narwhals-dev/narwhals), if you want to keep your logic in Python.
- Narwhals _and_ the PyCapsule Interface together, if you want it all!

## `agnostic_sum_i64_column` - "slow down, Professor!"

We'll learn about how you make a dataframe-agnostic function `agnostic_sum_i64_column`.
Here are the requirements:

- Given a dataframe `df` and a column name `column_name`, it should compute
  the sum of all non-null values in that column.
- If that column is not present, or if it is not of type `Int64`,
  it should raise an error.
- It should work for a variety of inputs: `pandas.DataFrame`, `polars.DataFrame`,
  `duckdb.PyRelation`, and `pyarrow.Table`, without any knowledge of or dependency
  on any.

Summing non-null values isn't rocket science, but do we do so without any
knowledge of the incoming dataframe?

## Low-level solution: PyCapsule Interface in Rust via PyO3

An example of a Rust solution via Pyo3 can be found at [pycapsule-demo/src/lib.rs](https://github.com/MarcoGorelli/pycapsule-demo/blob/6aad64be26ebbfc8526f26695544bfc6436e3266/src/lib.rs#L9-L56).

This blog post isn't about explaining all the technical details behind the
PyCapsule Interface (interested readers are welcome to read the docs), but about
its consequences. Check this out:

```python
>>> import duckdb
>>> import pandas as pd
>>> import polars as pl
>>> import pyarrow as pa
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
Our function works agnostically for any of these dataframes, without us having
to write any specialised code for each, and without any knowledge of them!

This is an example of how standards can enable freedom. The aforementioned
libraries all support a standard known as the
[PyCapsule Interface](https://arrow.apache.org/docs/format/CDataInterface/PyCapsuleInterface.html)
for export - you can verify this by checking that they all have a `__arrow_c_stream__` method:

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

Because we can access the underlying data in a library-agnostic manner from
Rust, this enables us to write functions for any kind of complex and bespoke logic
which users of any of the above libraries can then all make use of!

> **_NOTE:_** How many times can `agnostic_sum_i64_column` be called? Strictly
> speaking, the PyCapsule Interface only guarantees that it can be called once.
> In practice, however, all implementations that we're aware of (except for
> DuckDB) allow for it to be called repeatedly. Discussion about the
> DuckDB implementation is ongoing at https://github.com/duckdb/duckdb/discussions/15536.

This is nice, but it may seem a little daunting. Sure, it gives us complete
freedom over which algorithms to implement, but what if we don't need all that
freedom and only want to do simple operations from the tools' own Python APIs?

This is where Narwhals comes into the game.

## Python solution: Narwhals

Narwhals is a lightweight, dependency-free and extensible compatibility layer between
dataframe libraries, which lets you write "Dataframe X in -> Dataframe X out"-style
functions.  To use it to write a dataframe-agnostic function, you need to follow three
steps:

- Call `narwhals.from_native` on the user's object.
- Use the [Narwhals API](https://narwhals-dev.github.io/narwhals/api-reference/).
- If you want to return to the user an object of the same kind that they started with,
  call `to_native`.

In this case, a Narwhals version of `agnostic_sum_i64_column` would look like this:

```python
import narwhals as nw
from narwhals.typing import IntoFrame


def agnostic_sum_i64_column_narwhals(df_native: IntoFrame, column_name: str) -> int:
    df = nw.from_native(df_native)
    schema = df.collect_schema()
    if column_name not in schema:
        msg = f"Column '{column_name}' not found, available columns are: {schema.names()}."
        raise ValueError(msg)
    if (dtype := schema[column_name]) != nw.Int64:
        msg = f"Column '{column_name}' is of type {dtype}, expected Int64"
        raise TypeError(msg)
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

## Narwhals vs PyCapsule Interface: when to use one over the other, and when to use them together

If the Narwhals API is extensive enough for your use-case, then this is arguably
a simpler and easier solution than writing your own Rust function. On the other hand,
if you write a Rust function using the PyCapsule Interface, then you have complete
control over what do with the data. So, when should you use which?

Let's cover some scenarios:

- If you want your dataframe logic to stay completely lazy where possible: use Narwhals.
  This is because the PyCapsule Interface requires you to materialise the data into memory,
  whereas Narwhals has both eager and lazy APIs.
- You want complete control over which operations happen on your data: use the
  PyCapsule Interface. If you have the necessary Rust / C skills, there should be no limit
  to how complex and bespoke you make your data processing.
- You want to keep your library logic in pure-Python and without heavy dependencies, so
  it's easy to maintain and install: use Narwhals. Packaging a pure-Python project is very
  easy, whereas if you need to get Rust or C in there then it becomes trickier.
- You want to do part of your processing in Python, and part of it in Rust - **use both**!
  An example of a library which does this is [Vegafusion](https://vegafusion.io/).

## What about Polars Plugins?

We wrote some Rust code earlier to write custom logic. You may have come across another way
to do this in Polars, which is the [Expression Plugin](https://marcogorelli.github.io/polars-plugins-tutorial/)
mechanism. How does that differ from custom code written with the PyCapsule Interface?

- Pros: Polars Plugins slot in seamlessly with Polars' lazy execution. This can enable massive
  time and cost savings, see [Reverse-Geocoding in AWS Lambda: Save Time and Money Using Polars Plugins](https://quansight.com/post/reverse-geocoding-aws-lambda-using-polars-plugin/)
  for an example.
- Cons: Polars Plugins are specific to Polars, so won't work with other dataframe libraries.

If Polars is the only library you need to support and would like help writing Polars Plugins,
[we can help](https://quansight.com/about-us/#bookacallform)!

# Conclusion

As the Dataframe ecosystem grows, so does the need for tools which support any of them as opposed
to being tightly-coupled to pandas. We've learned about how we can use the PyCapsule Interface
to write dataframe-agnostic code from a low-level language such as Rust or C. We also learned
about how we can do that using Narwhals entirely from Python, and when it may makes sense to use
one, the other, or even both approaches together.

If you would like to contribute with efforts to standardise the data ecosystem and enable innovation,
or would just like to speak with data experts about how we can help your organisation, please
[book a call](https://quansight.com/about-us/#bookacallform) with us, we'd love to hear from you!
