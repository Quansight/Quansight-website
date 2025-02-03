---
title: "Mastering DuckDB when you're used to pandas or Polars"
published: February 3, 2025
authors: [marco-gorelli]
description: "It's not as scary as you think"
category: [PyData ecosystem]
featuredImage:
  src: /posts/duckdb-when-used-to-frames/featured.jpg
  alt: 'Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/brown-and-green-mallard-duck-on-water--ZSnI9gSX1Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
hero:
  imageSrc: /posts/duckdb-when-used-to-frames/hero.jpg
  imageAlt: 'Photo by <a href="https://unsplash.com/@rthiemann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Robert Thiemann</a> on <a href="https://unsplash.com/photos/brown-and-green-mallard-duck-on-water--ZSnI9gSX1Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'

---

# Mastering DuckDB when you're used to pandas or Polars

You may have heard about DuckDB's impressive robustness and performance. Perhaps you want to try it out - BUT WAIT, you're a data scientist and are used to pandas and/or Polars, not SQL. You can use the `SELECT`, `JOIN` and `GROUP BY` commands, but not much more, and you may be wondering: is it even possible to use SQL to:

- Center a variable (i.e. subtracting its mean)?
- Find the average price per week?
- Compute rolling statistics?

Not only are these all possible, they're easy as well. Let's learn how to implement dataframe fundamentals in SQL!

## Subtracting the mean

Subtracting the mean, also known as "centering", is a common data science technique performed before fitting classical regression models. In pandas or Polars, it's trivial:

```python
data = {"a": [1, 3, -1, 8]}

# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd["a_centered"] = df_pd["a"] - df_pd["a"].mean()

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl.with_columns(a_centered=pl.col("a") - pl.col("a").mean())
```
```
shape: (4, 2)
┌─────┬────────────┐
│ a   ┆ a_centered │
│ --- ┆ ---        │
│ i64 ┆ f64        │
╞═════╪════════════╡
│ 1   ┆ -1.75      │
│ 3   ┆ 0.25       │
│ -1  ┆ -3.75      │
│ 8   ┆ 5.25       │
└─────┴────────────┘
```

If you naively try translating to SQL, however, you'll get an error:
```python
import duckdb

duckdb.sql(
    """
    SELECT
        *,
        a - MEAN(a) AS a_centered
    FROM df_pl
    """
)
```
```
BinderException: Binder Error: column "a" must appear in the GROUP BY clause or must be part of an aggregate function.
Either add it to the GROUP BY list, or use "ANY_VALUE(a)" if the exact value of "a" is not important.
```
SQL does not let us compare columns with aggregates. To do so, we need to use a [window function](https://en.wikipedia.org/wiki/Window_function_(SQL)). We're taking the mean of column `'a'` over the entire column, so we write:

```python
duckdb.sql(
    """
    SELECT
        *,
        a - MEAN(a) OVER () AS a_centered
    FROM df_pl
    """
)
```

```
┌───────┬────────────┐
│   a   │ a_centered │
│ int64 │   double   │
├───────┼────────────┤
│     1 │      -1.75 │
│     3 │       0.25 │
│    -1 │      -3.75 │
│     8 │       5.25 │
└───────┴────────────┘
```

## Resampling: weekly average

Say we have unevently spaced temporal data, such as:

```python
from datetime import datetime

dates = [
    datetime(2025, 1, 1),  # Wednesday
    datetime(2025, 1, 7),  # Tuesday
    datetime(2025, 1, 8),  # Wednesday
    datetime(2025, 1, 9),  # Thursday
    datetime(2025, 1, 16),  # Thursday
    datetime(2025, 1, 17),  # Friday
]
sales = [1, 5, 0, 4, 3, 6]
data = {"date": dates, "sales": sales}
```

We need to find the average weekly sales, where a week is defined as Wednesday to Tuesday. In pandas we'd use `resample`, in Polars `group_by_dynamic`:

```python
# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd.resample("1W-Wed", on="date", closed="left", label="left")["sales"].mean()

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
(
    df_pl.group_by_dynamic(
        pl.col("date").alias("week_start"), every="1w", start_by="wednesday"
    ).agg(pl.col("sales").mean())
)
```
```
shape: (3, 2)
┌─────────────────────┬───────┐
│ date                ┆ sales │
│ ---                 ┆ ---   │
│ datetime[μs]        ┆ f64   │
╞═════════════════════╪═══════╡
│ 2025-01-01 00:00:00 ┆ 3.0   │
│ 2025-01-08 00:00:00 ┆ 2.0   │
│ 2025-01-15 00:00:00 ┆ 4.5   │
└─────────────────────┴───────┘
```

Replicating this in DuckDB is not rocket science, but it does involve a little preprocessing step:

- We use `DATE_TRUNC` to truncate each date to the Monday at the start of the Monday-Sunday week.
- To get our week to start on Wednesday, we need to first subtract 2 days, then truncate, and then add 2 days back.

In code:

```python
import duckdb

duckdb.sql(
    """
    SELECT 
        DATE_TRUNC('week', date - INTERVAL 2 DAYS) + INTERVAL 2 DAYS AS week_start,
        AVG(sales) AS sales
    FROM df_pl
    GROUP BY week_start
    ORDER BY week_start
    """
)
```
```
┌─────────────────────┬────────┐
│     week_start      │ sales  │
│      timestamp      │ double │
├─────────────────────┼────────┤
│ 2025-01-01 00:00:00 │    3.0 │
│ 2025-01-08 00:00:00 │    2.0 │
│ 2025-01-15 00:00:00 │    4.5 │
└─────────────────────┴────────┘
```

> **_NOTE:_** In general, we recommend only using `ORDER BY` as late as possible in your queries, and until that point, not making any assumptions about the physical ordering of your data. You'll see in the next section how to get around physical ordering assumptions when performing order-dependent operations.

## Rolling ~~and tumbling~~ statistics

If you work in finance, then rolling means are probably your bread and butter. For example, with data:

```python
from datetime import datetime

dates = [
    datetime(2025, 1, 1),
    datetime(2025, 1, 2),
    datetime(2025, 1, 3),
    datetime(2025, 1, 4),
    datetime(2025, 1, 5),
    datetime(2025, 1, 7),
]
sales = [2.0, 4.6, 1.32, 1.11, 9, 8]
data = {"date": dates, "sales": sales}
```

you may want to smooth out `'sales'` by taking a rolling average over the last three data points. With dataframes, it's easy:

```python
# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd["sales_smoothed"] = df_pd["sales"].rolling(3).mean()

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl.with_columns(sales_smoothed=pl.col("sales").rolling_mean(3))
```
```
shape: (6, 3)
┌─────────────────────┬───────┬────────────────┐
│ date                ┆ sales ┆ sales_smoothed │
│ ---                 ┆ ---   ┆ ---            │
│ datetime[μs]        ┆ f64   ┆ f64            │
╞═════════════════════╪═══════╪════════════════╡
│ 2025-01-01 00:00:00 ┆ 2.0   ┆ null           │
│ 2025-01-02 00:00:00 ┆ 4.6   ┆ null           │
│ 2025-01-03 00:00:00 ┆ 1.32  ┆ 2.64           │
│ 2025-01-04 00:00:00 ┆ 1.11  ┆ 2.343333       │
│ 2025-01-05 00:00:00 ┆ 9.0   ┆ 3.81           │
│ 2025-01-07 00:00:00 ┆ 8.0   ┆ 6.036667       │
└─────────────────────┴───────┴────────────────┘
```

We're relying on our data being sorted by `'date'`. In pandas / Polars, we often know that our data is ordered in a particular way, and that order is often preserved across operations, so calculating a rolling mean with ordering assumptions is fine. For SQL engines however, row order is typically undefined, although there are some limited cases where DuckDB promises to maintain order. The solution is to specify `'ORDER BY'` inside your window function:

```python
import duckdb

duckdb.sql(
    """
    SELECT
        *, 
        MEAN(sales) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS sales_smoothed
    FROM df_pl
    """
)
```
```
┌─────────────────────┬────────┬────────────────────┐
│        date         │ sales  │   sales_smoothed   │
│      timestamp      │ double │       double       │
├─────────────────────┼────────┼────────────────────┤
│ 2025-01-01 00:00:00 │    2.0 │                2.0 │
│ 2025-01-02 00:00:00 │    4.6 │                3.3 │
│ 2025-01-03 00:00:00 │   1.32 │               2.64 │
│ 2025-01-04 00:00:00 │   1.11 │ 2.3433333333333333 │
│ 2025-01-05 00:00:00 │    9.0 │               3.81 │
│ 2025-01-07 00:00:00 │    8.0 │  6.036666666666666 │
└─────────────────────┴────────┴────────────────────┘
```

This gets us close to the pandas/Polars output, but it's not identical - notice how the first two rows are null in the dataframe case, but non-null in the SQL case! This is because the dataframe solution only computes the mean when there's at least `window_size` (in this case, 3) observations per window, whereas the DuckDB output computes the mean for every window. We can remedy this by using a case statement (and also a named window function for readability):

```python
import duckdb

duckdb.sql(
    """
    SELECT
        *, 
        CASE WHEN (COUNT(sales) OVER w) >= 3 
             THEN MEAN(sales) OVER w 
             ELSE NULL 
             END AS sales_smoothed
    FROM df_pl
    WINDOW w AS (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
    """
)
```
```
┌─────────────────────┬────────┬────────────────────┐
│        date         │ sales  │   sales_smoothed   │
│      timestamp      │ double │       double       │
├─────────────────────┼────────┼────────────────────┤
│ 2025-01-01 00:00:00 │    2.0 │               NULL │
│ 2025-01-02 00:00:00 │    4.6 │               NULL │
│ 2025-01-03 00:00:00 │   1.32 │               2.64 │
│ 2025-01-04 00:00:00 │   1.11 │ 2.3433333333333333 │
│ 2025-01-05 00:00:00 │    9.0 │               3.81 │
│ 2025-01-07 00:00:00 │    8.0 │  6.036666666666666 │
└─────────────────────┴────────┴────────────────────┘
```

Now it perfectly matches the pandas / Polars output exactly 😇!

## What if you don't like SQL?

First, consider what a SQL solution offers:

- Stability: dataframe APIs tend to go through deprecation cycles to make API improvements. If you write a dataframe solution today, it's unlikely that it will still work 5 years from now. A SQL one, on the other hand, probably will.
- Portability: SQL standards exist, and although implementation differences exist, migrating between SQL dialects is probably less painful than migrating between dataframe APIs.
- Widespreadness: analysts, engineers, and data scientists across industries are all likely familiar with SQL. They may not all rank it as their favourite language, but they can probably all read it, especially with the help of an LLM.
- Robustness: extensive SQL testing frameworks, such as [sqllogictest](https://www.sqlite.org/sqllogictest/doc/trunk/about.wiki), have already been developed, and so DuckDB can test against it to guard against buggy query results.

Nonetheless, if you really want to use DuckDB as an engine but prefer Python APIs, some available options are:

- [SQLFrame](https://github.com/eakmanrq/sqlframe): transpiles the PySpark API to different backends, including DuckDB.
- [DuckDB's Python Relational API](https://duckdb.org/docs/api/python/relational_api.html): very strict and robust, though documentation is quite scant. In particular, window expressions are not yet supportedl (but they are on the roadmap!).
- [Narwhals](https://github.com/narwhals-dev/narwhals): transpiles the Polars API to different backends. For DuckDB it uses DuckDB's Python Relational API, and so it also does not yet support window expressions.
- [Ibis](https://ibis-project.org/): transpiles its own API to different backends.

What's more, DuckDB allows you to write queries against in-memory pandas and Polars dataframes. Mixing tools and languages is totally legit, and you can probably get further by learning different tools and combining them appropriately than by swearing by a single tool and trying to do everything using just that.

## Conclusion

We've learned how to translate some common dataframe operations to SQL so that we can port them over to DuckDB. We looked at centering, resampling, and rolling statistics. Porting to SQL / DuckDB may be desirable if you would like to use the DuckDB engine, if your client and/or team mates prefer SQL to dataframe APIs, or if you would like to have a robust and mostly standardised solution which is unlikely to break in the future.

If you would like help implementing solutions with any of the tools covered in this post, or would like to sponsor efforts towards dataframe API unification, [we can help](https://quansight.com/about-us/#bookacallform)!
