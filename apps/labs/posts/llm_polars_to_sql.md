---
title: "Can LLMs translate Polars code to SQL?"
published: 21, January 2026
authors: [marco-gorelli]
description: "Be very careful!"
category: [PyData ecosystem]
featuredImage:
  src: /posts/llm_polars_to_sql/featured.png
  alt: 'Illustration of two polar bears sitting back to back with laptops and writing code'
hero:
  imageSrc: /posts/llm_polars_to_sql/hero.png
  imageAlt: 'Illustration of two polar bears sitting back to back with laptops and writing code'

---

[Structured Query Language](https://en.wikipedia.org/wiki/SQL), also known as SQL, is probably the most common way for engineers to interact with data. Every data service out there seems to have a SQL interface. It's often regarded as a must-have skill for data scientists, and even more so for data engineers. It's portable, widespread, mostly standardised, and powerful.

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
> print(df.select(pl.col('price') - pl.col('price').mean())) # Task 1
> print(df.select(pl.col('price').n_unique()))               # Task 2
> print(df.select(pl.col('price').rank('dense')))            # Task 3
> ```
>
> ?


### Expected results

Let's look at examples of what correct translations may look like. The first one requires us to compare an aggregation (`AVG(price)`) with a column (`price`), which we can do by broadcasting the aggregation using `OVER ()`:

```sql
SELECT
     price - AVG(price) OVER () AS price_centered
FROM df;
```

For the second one, `COUNT(DISTINCT price)` gets us close, but the key detail to notice is that Polars includes null values by default in `n_unique` whereas `COUNT(DISTINCT ...)` doesn't. Therefore, some extra post-processing is needed - one way to do this is with a `CASE-WHEN` expression:

```sql
SELECT 
    COUNT(DISTINCT price) 
    + MAX(
        CASE 
            WHEN price IS NULL THEN 1 
            ELSE 0 
        END
      ) AS price
FROM df;
```

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

These are examples of models answers. How close to them do you think the LLMs will get?

## Meet the LLMs

For this task, we'll compare three free models:

- GPT-5.1 (proprietary), by OpenAI, which we'll run on ChatGPT.
- DeepSeek V3.1 (open source, MIT license). We'll run this one on [OpenRouter](https://openrouter.ai/).
- Qwen3 Coder 480B A35B (open source, Apache 2.0 license), by Alibaba. We'll also run this one on OpenRouter.

The first one is the one that everyone knows. It's unfortunate that for many, it's also where their awareness of LLMs ends. Many people don't even know that open source alternatives exist - let's change that!

## Putting LLMs to the test

Here's a summary of the LLMs' results, as of December 26, 2025:

### Task 1

- GPT: correct!
- Deepseek: correct!
- Qwen: correct!

OK, this one was too easy for them. Let's move on to the harder ones.

### Task 2

- GPT: incorrect!
- Deepseek: incorrect!
- Qwen: incorrect!

They all make the same mistake and generate a query a bit like this:

```sql
SELECT 
    COUNT(DISTINCT price) AS n_unique
FROM df;
```

The reason it's wrong is that it discards null values, whereas Polars includes them. Blindly trusting the LLMs' translation without checking it could lead to production failures or incorrect business decisions!

### Task 3

- GPT: correct!
- Deepseek: incorrect!
- Qwen: incorrect!

The latter two make the same mistake and output something like:

```sql
SELECT DENSE_RANK() OVER (ORDER BY price) FROM df;
```

The reason it's incorrect is that it ranks the null values last, whereas Polars preserves null values and only ranks non-null elements.

GPT gets this one right, and outputs:

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

There's definitely a pattern to the LLM failures: they generate code which _looks_ plausible. The only issue is that, on inspection, details such as null value handling are not always taken care of. Can we fix this by reminding the LLMs about the details of Polars' behaviour?

The answer is...yes! Indeed, by appending

> Remember that Polars counts null values in n_unique and preserves null values in rank.

to our prompt, we find that all 3 models give correct results to all tasks! So, it is possible to use these models to translate Polars to SQL, but it requires some care and domain knowledge to ensure the translations are correct.

## Non-AI solution: Narwhals

LLMs are highly susceptible to hallucinations, and their output should never be trusted blindly. If we want a more robust and predictable solution, we can turn our attention to an open source tool called [Narwhals](https://github.com/narwhals-dev/narwhals). Narwhals is a lightweight compatibility layer between dataframe libraries - in particular, it supports DuckDB, so we can use that to generate SQL.

Here's what a Narwhals solution looks like to the second task above (the one that all LLMs got wrong):

```py
import polars as pl
import narwhals as nw

data = {'price': [1, 4, None, 4]}
df = pl.DataFrame(data)

print(
    nw.from_native(df).lazy('duckdb')
    .select(nw.col('price').n_unique())
    .to_native().sql_query()
)
```

The top line of the output shows

```sql
SELECT
  (count(DISTINCT price)
   + max(CASE  WHEN ((price IS NULL)) THEN (1) ELSE 0 END)) AS price
FROM ColumnDataCollection - [1 Chunks, 4 Rows]
```

and that's a correct SQL translation - no need to manual prompt engineering! This approach is safe, well-tested, and free from hallucinations. The downside is that it is only limited to what's in the [Narwhals API](https://narwhals-dev.github.io/narwhals/api-reference/), while LLMs can at least attempt to translate more complex and niche queries.

If you would like to help fund the future of dataframe-agnostic workflows or would like help with bespoke Narwhals solutions, you can [contact Quansight](mailto:connect@quansight.com).

## Conclusion

We looked at how to translate Polars code to SQL, and compared different solutions:

- Proprietary AI models
- Open source AI models
- Narwhals

We found that AI models may get things subtely wrong but can be corrected with better prompt engineering. Finally, we found that Narwhals makes correct translations without requiring prompt engineering, but that this approach is limited to what's already implemented in the Narwhals API. If you plan on using LLMs to translate Polars to SQL, we suggest first trying Narwhals in order to avoid LLM hallucinations, and only trying LLMs if the Narwhals API is not sufficient for your task - in which case, make sure to include as many details as possible regarding expected behaviours so that the models have the highest chance of getting their translations right.
