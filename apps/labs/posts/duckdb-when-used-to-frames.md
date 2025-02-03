---
title: "Mastering DuckDB when you're used to Polars or pandas"
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

# Using DuckDB when you're used to Polars or pandas

You may have heard about DuckDB's impressive robustness and performance. Perhaps you wanted to try it out, too - BUT WAIT, you're a data scientist. You're used to pandas and/or Polars, not a SQL expert. You can use the `'JOIN'` and `'GROUP BY'` commands, but what do you use instead of your familiar dataframe commands, such as:

- Centering a variable (i.e. subtracting its mean)?
- Finding the average price per week?
- Computing rolling statistics?

Most DuckDB tutorials focus on SQL basics. Not this one. We'll focus on dataframe basics, but through a SQL lense.

## Subtracting the mean

Subtracting the mean, also known as "centering", is a common data science technique performed before fitting classical regression models. In pandas or Polars, it's trivial:

```python
data = {'a': [1, 3, -1, 8]}

# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd['a_centered'] = df_pd['a'] - df_pd['a'].mean()

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl = df_pl.with_columns(a_centered = pl.col('a') - pl.col('a').mean())
```

If you naively try translating this to SQL, however, you'll get an error:
```python
import duckdb

duckdb.sql("""
    SELECT
      *,
      a - MEAN(a) AS a_centered
    FROM df_pl
""")
```
```
BinderException: Binder Error: column "a" must appear in the GROUP BY clause or must be part of an aggregate function.
Either add it to the GROUP BY list, or use "ANY_VALUE(a)" if the exact value of "a" is not important.
```
SQL does not let us compare columns with aggregates like this. To do so, we need to use a [window function](https://en.wikipedia.org/wiki/Window_function_(SQL)). In this case, we're taking the mean of column `'a'` over the entire column, so we write:

```python
duckdb.sql("""
    SELECT
      *,
      a - MEAN(a) OVER () AS a_centered
    FROM df_pl
""")
```

```
┌───────┬───────┬────────────┐
│   a   │   b   │ a_centered │
│ int32 │ int32 │   double   │
├───────┼───────┼────────────┤
│     1 │     4 │      -1.75 │
│     3 │     2 │       0.25 │
│    -1 │     3 │      -3.75 │
│     8 │     4 │       5.25 │
└───────┴───────┴────────────┘
```

## Resampling: weekly average

Say we have unevently spaced temporal data, such as:
```python
from datetime import datetime

dates = [
  datetime(2025, 1, 1),   # Wednesday
  datetime(2025, 1, 7),   # Tuesday
  datetime(2025, 1, 8),   # Wednesday
  datetime(2025, 1, 9),   # Thursday
  datetime(2025, 1, 16),  # Thursday
  datetime(2025, 1, 17),  # Friday
]
sales = [1, 5, 0, 4, 3, 6]
data = {'date': dates, 'sales': sales}
```
We need to find the average weekly sales, where a week is defined as Wednesday to Tuesday. In pandas we'd use `resample`, in Polars `group_by_dynamic`:
```python
# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd.resample('1W-Wed', on='date', closed='left', label='left')['sales'].mean()

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl.group_by_dynamic('date', every='1w', start_by='wednesday').agg(pl.col('sales').mean())
```

Replicating this in DuckDB is not rocket science, but it does involve a little preprocessing step:

- We can use `DATE_TRUNC` to truncate each date to the Monday at the start of the Monday-Sunday week.
- To get our week to start on Wednesday, we need to first subtract 2 days, then truncate, and then add 2 days back.

In code:
```python
import duckdb

duckdb.sql("""
    SELECT 
        DATE_TRUNC('week', date - INTERVAL 2 DAYS) + INTERVAL 2 DAYS AS week_start,
        AVG(sales) AS avg_sales
    FROM df_pl
    GROUP BY week_start
""")
```

> **_NOTE:_** If you asked an LLM to translate the dataframe code above, it may suggest a similar SQL solution to the above but with an extra `ORDER BY` clause at the end. In general, we recommend only using `ORDER BY` as late as possible in your queries, and until that point, not making any assumptions about the physical ordering of your data. You'll see in the next section how to get around physical ordering assumptions.

## Rolling ~~and tumbling~~ statistics

If you work in finance, then rolling mean is probably your bread and butter. For example, with data:
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
sales = [2., 4.6, 1.32, 1.11, 9, 8]
data = {'date': dates, 'sales': sales}
```
you may want to smooth out `'sales'` by taking a rolling average over the last three data points. With dataframes, this is easy:

```python
# pandas
import pandas as pd

df_pd = pd.DataFrame(data)
df_pd['sales_smoothed'] = df_pd['sales'].rolling(3).mean()

# Polars
import polars as pl

df_pl = pl.DataFrame(data)
df_pl.with_columns(sales_smoothed = pl.col('sales').rolling_mean(3))
```

In these cases, we're relying on our data being sorted by `'date'`. In pandas / Polars, we often know that our data is ordered in a particular way, so calculating a rolling mean with that assumption is fine. For SQL engines, however, row order is typically undefined. There are some limited cases where DuckDB promises to maintain order, but what if you're not in one of those cases? You may be tempted to use `ORDER BY`, but we advised in the previous section to only uses that as late as possible. A better way is to specify `'ORDER BY'` inside your window function:

```python
import duckdb

duckdb.sql("""
    SELECT
        *, 
        MEAN(sales) OVER (ORDER BY date) AS sales_smoothed
    FROM df_pl
""")
```
This gets us close to the pandas/Polars output, but not quite. The dataframe solution only comutes the mean when there's at least `window_size` (in this case, 3) observations per window, whereas the DuckDB output computes the mean for every window. We can remedy this by using a named window function and a case statement:

```python
import duckdb

duckdb.sql("""
    SELECT
        *, 
        CASE WHEN (COUNT(sales) OVER w) >= 3 
             THEN MEAN(sales) OVER w 
             ELSE NULL 
             END AS sales_smoothed
    FROM df_pl
    WINDOW w AS (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
""")
```

Now it perfectly matches the pandas / Polars output exactly 😇!

## What if I don't like SQL?

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

## Conclusion

We've learned how to translate some common dataframe operations to SQL so that we can port them over to DuckDB. We looked at centering, resampling, and rolling statistics. Porting to SQL / DuckDB may be desirable if you would like to use the DuckDB engine, if your client and/or team mates prefer SQL to dataframe APIs, or if you like to have a robust and mostly standardised solution which is unlikely to break in the future.

If you would like help implementing solutions with any of the tools covered in this post, or would like to sponsor efforts towards dataframe API unification, [we can help](https://quansight.com/about-us/#bookacallform)!
