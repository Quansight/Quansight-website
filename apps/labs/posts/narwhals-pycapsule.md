---
title: 'Arrow PyCapsule Interface and Narwhals: Rust and Tusk for universal dataframe support'
published: December 20, 2024
authors: [marco-gorelli]
description: 'Support everything, depend on (almost) nothing'
category: [PyData ecosystem]
featuredImage:
  src: ...
  alt: ''
hero:
  imageSrc: ...
  imageAlt: ''
---

# How the Arrow PyCapsule Interface and Narwhals universal dataframe support 

If you were writing a dataframe-consuming library in 2015, you'd probably have
added pandas support and called it a day. However, it's not 2015, but 2025, so if you do that today you know full well that you'll be inundated with 
endless "can you support Polars / DuckDB / PyArrow / Modin / ..." requests. Yet
you have no interest in understanding the subtle differences between them - what can you do?

Today, you'll learn about exactly what you can do:

- The Arrow PyCapsule Interface, if you need access to dataframe data from a low-level language like C or Rust.
- Narwhals, if you want to keep your logic in Python.
- Narwhals _and_ the PyCapsule Interface together, if you want it all!

## `sum_i64_column` - "slow down, Professor!"

We'll learn about how you make a dataframe-agnostic function `sum_i64_column`.
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
PyCapsule Interfae (interested readers are welcome to read the docs), but about
its consequences. Check this out:

```python
>>> import duckdb
>>> import pandas as pd
>>> import polars as pl
>>> import pyarrow as pa
>>> from pycapsule_demo import sum_i64_column
>>> df_pl = pl.DataFrame({'a': [1,1,2], 'b': [4,5,6]})
>>> df_pd = pd.DataFrame({'a': [1,1,2], 'b': [4,5,6]})
>>> df_pa = pa.table({'a': [1,1,2], 'b': [4,5,6]})
>>> rel = duckdb.sql("select * from df_pd")
>>> sum_i64_column(df_pl, column_name="a")
6
>>> sum_i64_column(df_pd, column_name="a")
6
>>> sum_i64_column(df_pa, column_name="a")
6
>>> sum_i64_column(rel, column_name="a")
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

This is nice, but it may seem a little daunting. Sure, it gives us complete
freedom over which algorithms to implement, but what if we don't need all that
freedom and only want to do simple operations from the tools' own Python APIs?

This is where Narwhals comes into the game.

## Python solution: Narwhals

...

## Narwhals + PyCapsule Interface: Tusk and Rust

...

## What about Polars Plugins?

- Pro: work with Polars LazyFrames, query optimiser can understand them
- Cons: specific to Polars

# Conclusion
