---
title: 'The Polars vs SQL differences nobody is talking about'
published: August 15, 2026
authors: [marco-gorelli]
description: "We're all tired of performance comparisons - let's talk about something else"
category: [PyData ecosystem]
featuredImage:
  src: /posts/polars-vs-sql-differences/featured.jpg
  alt: 'Image of "Spot the difference" comparing Polars and SQL'
hero:
  imageSrc: /posts/polars-vs-sql-differences/hero.jpg
  imageAlt: 'Image of "Spot the difference" comparing Polars and SQL'
---

You've seen the "Polars vs <SQL engine du jour>" posts, and may be tired of them. Don't worry, that's not what this post is going to be about. We'll talk about some Polars vs SQL differences which aren't getting talked about enough, and what you can do about them. By learning these differences, you'll be able to seamlessly migrate between them and write code that generalises well.

## Mental models

In Polars, dataframes are best thought of as collections of columns, each of which has a unique name and has elements of a homogeneous type, and which are all of the same length. There's no special tie between the columns - as we will see later, this allows for column independence. Row order is defined, but as we will also see later, Polars doesn't always promise to preserve it!

SQL is a programming language used to interact with databases which follow the relational model. In the relational model, a table is an unordered bag of rows, each of which is atomic (meaning that it can't be split up). Row order isn't defined, rows may be sorted in a certain manner before being displayed.

## Row order

In Polars, not only is row-order well-defined, it is also preserved by `select` and `with_columns` operations. In SQL, you can still perform order-dependent operations by using the `order by` clause. Some SQL engines [promise to maintain row order for certain operations](https://duckdb.org/docs/current/sql/dialect/order_preservation), but if you want your solution to generalise across SQL engines, it's best to not rely on this.

For example, if we do a cumulative sum in Polars and DuckDB, we arrive at the same results.

```py
>>> df
shape: (3, 2)
┌─────┬─────┐
│ a   ┆ b   │
│ --- ┆ --- │
│ i64 ┆ i64 │
╞═════╪═════╡
│ 1   ┆ 1   │
│ 2   ┆ 2   │
│ 3   ┆ 1   │
└─────┴─────┘
>>> df.with_columns(c = pl.col('a').cum_sum().over('b'))
shape: (3, 3)
┌─────┬─────┬─────┐
│ a   ┆ b   ┆ c   │
│ --- ┆ --- ┆ --- │
│ i64 ┆ i64 ┆ i64 │
╞═════╪═════╪═════╡
│ 1   ┆ 1   ┆ 1   │
│ 2   ┆ 2   ┆ 2   │
│ 3   ┆ 1   ┆ 4   │
└─────┴─────┴─────┘
>>> duckdb.sql("""
...     from df
...     select *,
...            sum(a) over (
...                partition by b
...                rows between unbounded preceding and current row
...            ) as c
... """)
┌───────┬───────┬────────┐
│   a   │   b   │   c    │
│ int64 │ int64 │ int128 │
├───────┼───────┼────────┤
│     2 │     2 │      2 │
│     1 │     1 │      1 │
│     3 │     1 │      4 │
└───────┴───────┴────────┘
```

Note, however, that Polars displays them in the original order, whereas DuckDB rearranges the result's rows.

## Column independence

This is a powerful feature, but with great power comes great responsibility. Whereas in SQL rows are considered atomic, in Polars you can operate on each column independently. This allows you to write some very creative queries which wouldn't be expressible in SQL (e.g. `pl.col('a').sort_by('b').reverse().first()`). However, if you're not careful, this power can lead you astray.

Here's an example. We start with some data about some roles in a musical theatre show, and after a dataframe operation, end up with rows in which we can see a combination of "voice" and "role" which never appeared in the original data.

```py
>>> df
shape: (3, 3)
┌──────┬───────────────┬────────────┐
│ name ┆ voice         ┆ role       │
│ ---  ┆ ---           ┆ ---        │
│ str  ┆ str           ┆ str        │
╞══════╪═══════════════╪════════════╡
│ Elsa ┆ null          ┆ lead       │
│ Anna ┆ Mezzo soprano ┆ null       │
│ Olaf ┆ Tenor         ┆ supporting │
└──────┴───────────────┴────────────┘
>>> df.select(pl.col('voice', 'role').drop_nulls())
shape: (2, 2)
┌───────────────┬────────────┐
│ voice         ┆ role       │
│ ---           ┆ ---        │
│ str           ┆ str        │
╞═══════════════╪════════════╡
│ Mezzo soprano ┆ lead       │
│ Tenor         ┆ supporting │
└───────────────┴────────────┘
```

My personal opinion is that, if you want to write maximally safe Polars, then you're best off avoiding expressions which change length (e.g. `Expr.drop_nulls`) or which change order (e.g. `Expr.sort`). Instead, use the dataframe equivalents (`DataFrame.drop_nulls` and `DataFrame.sort` respectively), or specify `ignore_nulls` and `order_by` arguments when available.

## Literals

The interpretation of literals, such as `pl.lit(1)`, differs a bit between Polars and SQL. In Polars, `lit(1)` means "a single row with the value of 1", whereas in SQL it would mean "repeat the value 1 for every row in this table". We can see an example of the consequence of this difference in the following example.

```py
>>> df
shape: (3, 1)
┌─────┐
│ a   │
│ --- │
│ i64 │
╞═════╡
│ 1   │
│ 2   │
│ 3   │
└─────┘
>>> df.select(sum_1 = pl.lit(1).sum())
shape: (1, 1)
┌───────┐
│ sum_1 │
│ ---   │
│ i32   │
╞═══════╡
│ 1     │
└───────┘
>>> duckdb.sql("from df select sum(1) as sum_1")
┌────────┐
│ sum_1  │
│ int128 │
├────────┤
│      3 │
└────────┘
```

## Other

There are some other differences I'd like to touch on here, which are either quite minor or which I've written about previously.

- Null sorting. If you sort a table in SQL, then nulls come last by default. In Polars, they come first. This is configurable (`nulls_first=True` / `nulls_first=False`), just be aware that the defaults differ if you're porting code.
- The sum of zero elements is `NULL` in SQL and `0` in Polars. My personal feeling is that Polars is more mathematically correct here (zero is the addition identity), even though in practice I may prefer to get a null value in such cases so it's clearer that there are no valid values as opposed to values which happened to sum to zero. It's a difference that's easy to work around, you just need to be aware of it.
- Broadcasting. Polars follows NumPy-style broadcast, whereby if you apply a binary expression with inputs of length `N` and `1`, then the latter one gets broadcasted to be of length `N`. I find this useful for scientific applications, where operations such as subtracting the mean ("centering") are common. See [Mastering DuckDB when you're used to pandas or Polars](https://labs.quansight.org/blog/duckdb-when-used-to-frames) for how to work around this in SQL.

## Conclusion

We've looked at some differences between Polars and SQL, how your mental model for them needs to change, and how to workaround some differences. By appreciating their differences, you've learned how to write code which generalises well and how to migrate between them. You also saw some examples of how things can go wrong if you ignore the differences between them.

If you would like help leveraging open source tools like these in your organisation, [we can help](https://quansight.com/about-us/#bookacallform)!
