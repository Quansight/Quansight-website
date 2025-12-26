---
title: "Can LLMs translate Polars code to SQL?"
published: ??, January 2026
authors: [marco-gorelli]
description: "Be very careful!"
category: [PyData ecosystem]
featuredImage:
  src: /posts/llm-polars-to-sql/featured.jpg
  alt: 'Image of "Google Translate" which looks like it is translating Polars code to SQL'
hero:
  imageSrc: /posts/llm-polars-to-sql/hero.jpg
  imageAlt: 'Image of "Google Translate" which looks like it is translating Polars code to SQL'

---

[Structured Query Language](https://en.wikipedia.org/wiki/SQL), also known as SQL, is probably the most common way for engineers to interact with data. Every data service out there seems to have a SQL interface. SQL is often regarded as a must-have skill for data scientists, and even more so for data engineers. SQL is portable, widespread, mostly standardised, and powerful.

In spite of SQL's strengths, data scientists often prefer using tools known as "dataframes" (such as [pandas](https://github.com/pandas-dev/pandas) and [Polars](https://github.com/pola-rs/polars)) to perform data analyses. This is both because of how rich the ecosystem for dataframe tools is, but also because dataframes allow them to express data analysis tasks in a way that often feels more natural than it does in SQL.

Given the popularity of both Polars and SQL, we'll look at how well we can translate between them. Given some Polars code, is it possible to translate it to SQL? Do the translations produce the same output?

This isn't intended to be a comprehensive benchmark, but rather, we're interested in exploring the following:

- Is there any pattern in the LLMs' answers, and is it somewhat predictable?
- Are there any practices we can adopt to improve the LLMs' answers?
- Can we use open source LLMs for the task?
- Is there a non-LLM solution available?

## The prompt

We'll ask a prompt which touches on several aspects of translating Polars syntax to SQL: aggregations, null value handling, and broadcasting. Here's the prompt:

> Given a table `df` with values
> 
> ```
> {'price': [1, 4, None, 4]}
> ```
> 
> can you translate this Polars code to SQL
> 
> ```py
> print(df.select(pl.col('price') - pl.col('price').mean()))
> print(df.select(pl.col('price').n_unique()))
> print(df.select(pl.col('price').rank('dense')))
> ```
>
> ?


### Expected results

We're looking for SQL queries which produce the following output.

```python=
# Note: the exact order in the output may vary,
# but the values should be these ones:
shape: (4, 1)
┌───────┐
│ price │
│ ---   │
│ f64   │
╞═══════╡
│ -2.0  │
│ 1.0   │
│ null  │
│ 1.0   │
└───────┘
shape: (1, 1)
┌───────┐
│ price │
│ ---   │
│ u32   │
╞═══════╡
│ 3     │
└───────┘
shape: (4, 1)
┌───────┐
│ price │
│ ---   │
│ f64   │
╞═══════╡
│ 1.0   │
│ 2.5   │
│ null  │
│ 2.5   │
└───────┘
```

Let's look at examples of what correct translations may look like. The first one requires us to compare an aggregation (`AVG(price)`) with a column (`price`), which we can do by broadcasting the aggregation using `OVER ()`:

```sql
SELECT
     price - AVG(price) OVER () AS price_centered
FROM df;
```

For the second one, `COUNT(DISTINCT vendor)` gets us close, but the key detail to notice is that Polars includes null values by default in `n_unique` whereas `COUNT(DISTINCT ...)` doesn't. Therefore, some extra post-processing is needed - one way to do this is with a `CASE-WHEN` expression:

```sql
SELECT 
    COUNT(DISTINCT vendor) 
    + MAX(
        CASE 
            WHEN vendor IS NULL THEN 1 
            ELSE 0 
        END
      ) AS vendor
FROM df;
```

Note that the fact that `n_unique` counts null values has been explicitly mentioned in Polars' documentation since January 2025.

For the final one, Polars preserves null values and only ranks the non-null ones, so we're looking for a solution like:

```sql
SELECT
    price,
    CASE
        WHEN ((NOT (price IS NULL))) THEN (dense_rank() OVER (ORDER BY price ASC NULLS LAST))
        ELSE NULL
    END AS d
FROM df;
```

## Meet the LLMs

For this task, we'll compare three free models:

- GPT-5.1 (proprietary), by OpenAI, which we'll run on ChatGPT.
- DeepSeek V3.1 (open source, MIT license). We'll run this one on [OpenRouter](https://openrouter.ai/).
- Qwen3 Coder 480B A35B (open source, Apache 2.0 license), by Alibaba. We'll also run this one on OpenRouter.

The first one is the one that everyone knows. It's unfortunate that for many, it's also where their awareness of LLMs ends. Many people are unware of open source alternatives - let's change that!

## Putting LLMs to the test!

Here's a summary of the LLMs' results, as of December 26, 2025:

### Task 1

- ChatGPT: correct!
- Deepseek: correct!
- Qwen: correct!

Nothing much to say here, the SQL they produce is valid and correct.

### Task 2

- ChatGPT: incorrect!
- Deepseek: incorrect!
- Qwen: incorrect!

They all make the same mistake and generate a query a bit like this:

```sql
SELECT 
    COUNT(DISTINCT price) AS n_unique
FROM df;
```

The reason it's wrong is that it discards null values, whereas Polars includes them.

### Task 3

- ChatGPT: correct!
- Deepseek: incorrect!
- Qwen: incorrect!

The latter two ma

```sql
SELECT DENSE_RANK() OVER (ORDER BY price) FROM df;
```

The reason it's incorrect is that it ranks the null values last, whereas Polars preserves null values and only ranks non-null elements.

ChatGPT actually gets this one right, and outputs:

```sql
SELECT
    CASE
        WHEN price IS NULL THEN NULL
        ELSE DENSE_RANK() OVER (ORDER BY price)
    END AS dense_rank_price
FROM df;
```

Note the extra logic to preserve null values which was missing from the other two.

### Can better prompting fix the results?

Indeed, by appending

> Remember that Polars counts null values in n_unique and preserves null values in rank.

to our prompt, we find that all 3 models give correct results to all tasks! So, it is possible to use these models to translate Polars to SQL, but it requires some care and domain knowledge to ensure the translations are correct.

## What about non-free open source AI solutions?

There exist a variety of AI models which, although open source, are not free, and require some setup to get running. One of the easiest ways to do that is with [Nebari](https://openteams.com/nebari/). Please [book a discovery call](https://openteams.com/contact-us/) to learn how you can use Nebari and open source AI to build modern solutions which you can completely own!

## Non-AI solution: Narwhals

With the AI solution, we consistently found that:

- Just asking the question directly resulted in subtly wrong translations.
- By including extra details in the prompt, they were able to do the translation correctly.

It's actually possible to translate the above queries from Polars to SQL without any possibility for LLM hallucination, and that is by using [Narwhals](https://github.com/narwhals-dev/narwhals):

```py
import polars as pl
import narwhals as nw

data = {'price': [1, 4, None, 4]}
df = pl.DataFrame(data)

print(
    nw.from_native(df).lazy('duckdb')
    .select(nw.col('vendor').n_unique())
    .to_native().sql_query()
)
```

The top line of the output shows

```sql
SELECT
  (count(DISTINCT vendor)
   + max(CASE  WHEN ((vendor IS NULL)) THEN (1) ELSE 0 END)) AS vendor
FROM ColumnDataCollection - [1 Chunks, 4 Rows]
```

and that's our correct SQL translation - no need to manual prompt engineering! Same for the other tasks. This approach is safe, well-tested, and free from hallucinations. The downside is that it is only limited to what's in the [Narwhals API](https://narwhals-dev.github.io/narwhals/api-reference/), while LLMs can at least attempt to translate more complex and niche queries.

If you would like to help fund the future of dataframe-agnostic workflows or would like help with bespoke solutions, you can [contact Quansight Labs](connect@quansight.com).

## Conclusion

We've look at how to translate Polars code to SQL, and compared different solutions:

- Proprietary AI models
- Open source AI models
- Narwhals

We found that AI models may get things subtely wrong but can be corrected with better prompt engineering. Finally, we found that Narwhals can make a correct translation without requiring prompt engineering, but that this approach is limited to what's already implemented in the Narwhals API. If you plan on using LLMs to translate APIs, make sure include as many details as possible about the source API's behaviour, and always make sure to test the result before using it for anything serious.
