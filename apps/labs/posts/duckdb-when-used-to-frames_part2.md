---
title: "Mastering DuckDB when you're used to pandas or Polars: part 2"
published: March 25, 2025
authors: [marco-gorelli]
description: 'Yes, list comprehensions can belong in SQL (!)'
category: [PyData ecosystem]
featuredImage:
  src: /posts/duckdb-when-used-to-frames-part2/featured.jpg
  alt: 'A close up picture of two duckling heads, photo Kerin Gedge'
hero:
  imageSrc: /posts/duckdb-when-used-to-frames-part2/hero.jpg
  imageAlt: 'A close up picture of two ducking heads, photo Kerin Gedge'
---

# Mastering DuckDB when you're used to pandas or Polars: part 2

Last month, we published [Mastering DuckDB when you're used to pandas or Polars: part 1](https://labs.quansight.org/blog/duckdb-when-used-to-frames). We'll again be translating simple dataframe operations into not-so-obvious SQL ones. Once more, our reasons for learning to do this include stability, portability, widespreadness, and robustness.

We'll get into scarier-looking SQL than last time and will cover:

- Filtering with window functions.
- Expression composability.
- Nested data types.

## Filtering with window functions

Say you have some sales data with multiple records per day, and for each you want to keep the row(s) which achieved the highest number of sales that day. In pandas and Polars, this is straightforward: compute the maximum number of sales per date, compute a mask, then use that in `.loc` / `.filter`:

```python
from datetime import datetime

dates = [
    datetime(2025, 1, 1),
    datetime(2025, 1, 1),
    datetime(2025, 1, 2),
    datetime(2025, 1, 2),
    datetime(2025, 1, 2),
    datetime(2025, 1, 3),
]
sales = [1, 4, 6, 5, 6, 9]
stores = ["a", "b", "a", "b", "b", "b"]
data = {"date": dates, "sales": sales, "store": stores}

# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd[df_pd["sales"] == df_pd.groupby("date")["sales"].transform("max")]

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl.filter(pl.col("sales") == pl.col("sales").max().over("date"))
```

```
shape: (4, 3)
┌─────────────────────┬───────┬───────┐
│ date                ┆ sales ┆ store │
│ ---                 ┆ ---   ┆ ---   │
│ datetime[μs]        ┆ i64   ┆ str   │
╞═════════════════════╪═══════╪═══════╡
│ 2025-01-01 00:00:00 ┆ 4     ┆ b     │
│ 2025-01-02 00:00:00 ┆ 6     ┆ a     │
│ 2025-01-02 00:00:00 ┆ 6     ┆ b     │
│ 2025-01-03 00:00:00 ┆ 9     ┆ b     │
└─────────────────────┴───────┴───────┘
```

If we tried naively porting this to SQL, we'd get an error:

```python
import duckdb

duckdb.sql(
    """
    FROM df_pl
    SELECT *
    WHERE sales = MAX(sales) OVER (PARTITION BY date)
    """
)
```

```
BinderException: Binder Error: WHERE clause cannot contain window functions!
```

There's not much that we (nor DuckDB) can do about this: window functions get evaluated after filters, so this is (and has to be) an illegal operation. Fortunately, SQL also comes with a `'QUALIFY'` clause, which gets evaluated after window functions - using that, we can match the pandas/Polars output.

```python
duckdb.sql(
    """
    FROM df_pl
    SELECT *
    QUALIFY sales = MAX(sales) OVER (PARTITION BY date)
    ORDER BY date, store
    """
)
```

```
┌─────────────────────┬───────┬─────────┐
│        date         │ sales │  store  │
│      timestamp      │ int64 │ varchar │
├─────────────────────┼───────┼─────────┤
│ 2025-01-01 00:00:00 │     4 │ b       │
│ 2025-01-02 00:00:00 │     6 │ a       │
│ 2025-01-02 00:00:00 │     6 │ b       │
│ 2025-01-03 00:00:00 │     9 │ b       │
└─────────────────────┴───────┴─────────┘
```

Whilst not very complex, the `'QUALIFY'` clause may be new to you. Indeed, it's not part of the SQL Standard, you may well not have come across it before, and this solution isn't necessarily portable to all SQL engines. For a standard-compliant solution, you'll need to write a common table expression or a subquery. However, this article is about DuckDB, not the SQL Standard, so we leave that an exercise to the reader 😈.

## Expression composability

My experience writing Polars is that if it looks like something is supported, then it probably is. It's the cleanest, most expressive API I'm familiar with. For example, to find the rolling mean of a lagged variable, it's as simple as composing `shift` and `rolling_mean`.

```python
from datetime import datetime

dates = [
    datetime(2025, 1, 1),
    datetime(2025, 1, 4),
    datetime(2025, 1, 2),
    datetime(2025, 1, 5),
    datetime(2025, 1, 3),
    datetime(2025, 1, 7),
]
sales = [2.0, 4.6, 1.32, 1.11, 9, 8]
data = {"date": dates, "sales": sales}
```

```
df_pl = pl.DataFrame(data)
df_pl.with_columns(lagged_rolling_sales = pl.col('sales').shift(1).rolling_mean(2).over(pl.lit(1), order_by='date'))
```

```
shape: (6, 3)
┌─────────────────────┬───────┬──────────────────────┐
│ date                ┆ sales ┆ lagged_rolling_sales │
│ ---                 ┆ ---   ┆ ---                  │
│ datetime[μs]        ┆ f64   ┆ f64                  │
╞═════════════════════╪═══════╪══════════════════════╡
│ 2025-01-01 00:00:00 ┆ 2.0   ┆ null                 │
│ 2025-01-04 00:00:00 ┆ 4.6   ┆ 5.16                 │
│ 2025-01-02 00:00:00 ┆ 1.32  ┆ null                 │
│ 2025-01-05 00:00:00 ┆ 1.11  ┆ 6.8                  │
│ 2025-01-03 00:00:00 ┆ 9.0   ┆ 1.66                 │
│ 2025-01-07 00:00:00 ┆ 8.0   ┆ 2.855                │
└─────────────────────┴───────┴──────────────────────┘
```

A direct translation to SQL, however, would error:

```python
duckdb.sql(
    """
    FROM df_pl
    SELECT *,
    MEAN(SHIFT(SALES, 1)) OVER (
        ORDER BY date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
    ) AS lagged_rolling_sales
"""
)
```

```
CatalogException: Catalog Error: Scalar Function with name shift does not exist!
```

DuckDB expects a scalar (i.e. elementwise) function inside `mean`, not an order-dependent one like `shift`! Thus, we need to split the computation out into separate steps: one to shift the sales, and another to calculate the rolling mean.

```python
duckdb.sql(
    """
    WITH lagged AS (
        FROM df_pl
        SELECT date, LAG(sales) OVER (ORDER BY date) AS lagged_sales
    )
    FROM df_pl
    JOIN lagged ON df_pl.date = lagged.date
    SELECT * EXCLUDE (lagged_sales),
        CASE WHEN COUNT(lagged_sales) OVER rolling_window >= 2
             THEN MEAN(lagged_sales) OVER rolling_window
             ELSE NULL
             END AS lagged_rolling_sales
    WINDOW rolling_window AS (
        ORDER BY lagged.date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
    )
    """
)
```

```
┌─────────────────────┬────────┬─────────────────────┬──────────────────────┐
│        date         │ sales  │        date         │ lagged_rolling_sales │
│      timestamp      │ double │      timestamp      │        double        │
├─────────────────────┼────────┼─────────────────────┼──────────────────────┤
│ 2025-01-01 00:00:00 │    2.0 │ 2025-01-01 00:00:00 │                 NULL │
│ 2025-01-02 00:00:00 │   1.32 │ 2025-01-02 00:00:00 │                 NULL │
│ 2025-01-03 00:00:00 │    9.0 │ 2025-01-03 00:00:00 │   1.6600000000000001 │
│ 2025-01-04 00:00:00 │    4.6 │ 2025-01-04 00:00:00 │                 5.16 │
│ 2025-01-05 00:00:00 │   1.11 │ 2025-01-05 00:00:00 │                  6.8 │
│ 2025-01-07 00:00:00 │    8.0 │ 2025-01-07 00:00:00 │                2.855 │
└─────────────────────┴────────┴─────────────────────┴──────────────────────┘
```

This solution may look intimidatingly scary 😱. However, it's mostly compliant with the SQL Standard, and so that scariness comes with some nice portability.

## Nested data types

Polars has supported nested data types since as long as I can remember, with extensive support for compute functions. pandas supports PyArrow-backed ones since version 2.0, but with less support for compute functions. In particular, pandas' list support is still too nascent for the following examples, so we'll only use Polars and DuckDB here.

Say we've got a `List[Int64]` column, and would like to normalise each row. That is to say, we divide each element in each row by that row's total. For example:

- If a row contains values `[1, 4]`, the normalised version would contain `[0.2, 0.8]`.
- If a row contains values `[2, 2, 4]`, the normalised version would contain `[0.25, 0.25, 0.5]`.

In Polars, you can perform arithmetic on list columns quite liberally.

```python
data = {"rainfall": [[1, 4, 3], [2, 8], None, [1, 5, 2, 8]]}

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl.with_columns(
    rainfall_normalised=pl.col("rainfall") / pl.col("rainfall").list.sum()
)
```

```
shape: (4, 2)
┌──────────────┬──────────────────────────────┐
│ rainfall     ┆ rainfall_normalised          │
│ ---          ┆ ---                          │
│ list[i64]    ┆ list[f64]                    │
╞══════════════╪══════════════════════════════╡
│ [1, 4, 3]    ┆ [0.125, 0.5, 0.375]          │
│ [2, 8]       ┆ [0.2, 0.8]                   │
│ null         ┆ null                         │
│ [1, 5, 2, 8] ┆ [0.0625, 0.3125, 0.125, 0.5] │
└──────────────┴──────────────────────────────┘
```

If we try being as liberal in SQL, we'll get an error.

```python
duckdb.sql(
    """
    FROM df_pl
    SELECT rainfall / LIST_SUM(rainfall) AS rainfall_normalised
    """
)
```

```
BinderException: Binder Error: No function matches the given name and argument types '/(BIGINT[], HUGEINT)'. You might need to add explicit type casts.
```

Fortunately, DuckDB offers a solution indistinguishable from magic.

```python
duckdb.sql(
    """
    FROM df_pl
    SELECT *, [x / LIST_SUM(rainfall) FOR x IN rainfall] AS rainfall_normalised
    """
)
```

```
┌──────────────┬──────────────────────────────┐
│   rainfall   │     rainfall_normalised      │
│   int64[]    │           double[]           │
├──────────────┼──────────────────────────────┤
│ [1, 4, 3]    │ [0.125, 0.5, 0.375]          │
│ [2, 8]       │ [0.2, 0.8]                   │
│ NULL         │ NULL                         │
│ [1, 5, 2, 8] │ [0.0625, 0.3125, 0.125, 0.5] │
└──────────────┴──────────────────────────────┘
```

Yes, we really did write a list comprehension in a SQL query. We've sailed so far away from the SQL Standard that we can't even see it anymore, so admittedly this solution might not be the most portable. And, I'm absolutely OK with that, it felt great to write!

## Is it "DuckDB or Polars", or "DuckDB and Polars"?

My advice is to learn both. It's hard to get away from SQL in any data position, so you either know it already or will have to learn it at some point anyway. The Polars API is coherent and consistent, so although there is an initial learning curve, things generally just work the way you expect them to once you're past it. One major Polars feature which is missing in DuckDB is eager execution: it's totally valid to do a large part of your processing in DuckDB / SQL, and then convert to Polars (`.pl()`) when you need interoperability with other tools, for functionality which Polars offers but DuckDB doesn't, or if you want eager execution.

Stay tuned for part 3, in which delve deeper into how to use the two tools together, what Polars offers on top of DuckDB, and how to write tools which support both.

## Conclusion

We continued our journey of translating simple dataframe operations to not-so-simple SQL ones. In doing so, we veered pretty far away from the SQL Standard, but stayed within the realms of what DuckDB is capable of. Porting dataframe code to SQL might be desirable if you would like to use the DuckDB engine or if you or your client prefer SQL to dataframe APIs.

If you would like help implementing solutions with any of the tools covered in this post or would like to sponsor efforts toward dataframe API unification, [we can help](https://quansight.com/about-us/#bookacallform)!
