---
title: 'How Many DataFrame Libraries Do You Need To Change a Lightbulb?'
published: December 13, 2024
authors: [dharhas-pothina]
description: 'Exploring Pandas, Polars, DuckDB, and Beyond'
category: [PyData Ecosystem]
featuredImage:
  src: /posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/1-1.png
  alt: 'How Many DataFrame Libraries Do You Need To Change a Lightbulb?'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'How Many DataFrame Libraries Do You Need To Change a Lightbulb?'
---

![](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/Pandas_logo.svg.png)

![](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/DuckDB_Image-removebg-preview.png)

_﻿﻿ Exploring Pandas, Polars, DuckDB, and Beyond_

This article, developed from a [2024 PyData NYC presentation](https://www.youtube.com/watch?v=cgWHPTx0wjw&list=PLGVZCDnMOq0ohEIZ-_wM2W_xqSVjyA3dC&index=45) of the same title, written with help from [Marco Gorelli](https://github.com/marcogorelli), explores the strengths and limitations of these DataFrame library tools, their compatibility with existing workflows, and how they can be integrated into modern data pipelines. We’ll also discuss [Narwhals](https://narwhals-dev.github.io/narwhals/), a lightweight library designed by Marco to bridge compatibility between pandas, Polars, and more.

Whether you’re working with datasets in the tens of gigabytes (or more), experimenting with new technologies, or simply looking for better ways to work, this guide will help you navigate the growing ecosystem of DataFrame tools. By the end, you’ll have a clearer picture of which tool fits your needs and why.

For a deeper dive into these topics, check out Marco’s post, [The Polars vs pandas difference nobody is talking about](https://labs.quansight.org/blog/dataframe-group-by) on the [Quansight Labs](https://labs.quansight.org/) blog.

[Watch the video](https://www.youtube.com/watch?v=cgWHPTx0wjw&list=PLGVZCDnMOq0ohEIZ-_wM2W_xqSVjyA3dC&index=45)

## A Journey Through DataFrames

I started using Python when I moved from MATLAB to Python in 2008. During my early career there, pandas did not exist. I remember at probably SciPy 2010 or so—almost 15 years ago—there was a _Birds of a Feather_ session where everyone got in the room to discuss many of the problems associated with building a DataFrame library or labeled arrays, as they were then referred to. There was this big discussion about possible approaches and all the things one should and shouldn’t do when building labeled arrays. Fast forward a year, and [Wes McKinney](https://github.com/wesm), who was in that previous meeting, comes back introducing pandas, ignoring many things everyone said we shouldn’t do when building labeled arrays in favor of a working implementation. The rest is history, and pandas is by far the most popular DataFrame library in existence.

Over the years, there have been many attempts to displace pandas. Right now, there’s a long list of relevant DataFrame libraries. Here, I’ll be giving an overview for anyone thinking about doing something different. We’re going to mostly focus on pandas, polars, and DuckDB and what you can do on a single computer node or laptop—not clusters or really big data sets.

DataFrames are at the heart of modern data analysis, and for many, [pandas](https://github.com/pandas-dev/pandas) is the tool that started it all. Over the years, it has become synonymous with data manipulation, offering flexibility, domain-specific libraries, and unparalleled ecosystem support. However, as data sizes grow and performance demands change, new tools have emerged to challenge pandas’ dominance, each bringing unique strengths to the table.

[Polars](https://github.com/pola-rs) and [DuckDB](https://duckdb.org/) are two such tools, each designed to solve specific pain points that pandas can struggle with. Whether handling massive datasets efficiently, optimizing query performance, or introducing innovative syntax, these tools offer exciting new possibilities for data professionals. Yet, choosing the right tool is not always straightforward. Each has its learning curve, trade-offs, and ideal use cases. Polars introduces a new syntax designed for flexibility and performance, while DuckDB reimagines SQL for modern analytical workflows. Meanwhile, pandas remains a solid choice for most workflows, especially when stability and library compatibility are top priorities.

![Dharhas Pothina presenting at PyData NYC on November 7, 2024 to a full room of attendees, discussing modern DataFrame tools such as pandas, Polars, and DuckDB. The presentation slide on the screen reads 'There's more than just pandas' and highlights key features of pandas.](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/Dharhas-presenting.png)

## Pandas: The Backbone of Data Science

For many data professionals, pandas is the first tool they reach for when working with structured data. It has earned its reputation as the backbone of data science workflows thanks to its flexibility, extensive documentation, and compatibility with domain-specific libraries like [GeoPandas](https://github.com/geopandas/geopandas) and [Cyberpandas](https://github.com/ContinuumIO/cyberpandas). With over a decade of development, pandas has become a cornerstone of the Python ecosystem, offering a stable and consistent API that millions of users rely on daily.

## Strengths of Pandas

**Pandas excels in its breadth and reliability**. Its extensive support for data manipulation tasks, seamless integration with Python libraries, and wide adoption in the data science community make it an incredibly versatile tool. Whether you’re working with time-series data, categorical variables, or complex types like sparse or periodic data, pandas likely has a solution.

Moreover, pandas is **supported by a robust ecosystem of libraries**, ensuring that you’ll rarely face a task it cannot handle. Its plotting integrations, machine learning compatibility, and domain-specific extensions have made it the go-to solution for everything from quick data exploration to building production-grade pipelines.

## Challenges with Pandas

However, pandas is not without its challenges. One of the most common complaints is its performance when working with large datasets. For example, processing a 50 GB file on a laptop can often result in memory errors or crashes. Pandas was designed as an _eager execution library_, meaning operations are executed immediately rather than optimized in batches. This approach can lead to **inefficiencies when dealing with large-scale data.**

Additionally, pandas’ reliance on _single-threaded processing_ means it doesn’t fully leverage modern multi-core CPUs. While tools like [**Dask**](https://github.com/dask/dask) and [**Modin**](https://github.com/modin-project/modin) provide ways to scale pandas operations, they require additional setup and present large overhead when working with smaller datasets.

Another challenge lies in its API. While powerful, **pandas’ API can be overwhelming and occasionally unintuitive**. Features like multi-indexing and hierarchical tables are incredibly flexible but can introduce complexity that’s difficult to manage, especially for new users.

## The Role of Pandas Today

Despite its limitations, pandas remains a vital tool for many workflows. It provides a level of stability and compatibility that is unmatched by newer tools. The maintainers are cautious about introducing breaking changes, ensuring that code written years ago still works today. Additionally, efforts like the [PyArrow](https://github.com/apache/arrow/tree/main/python/pyarrow) backend allow pandas to leverage modern technologies, offering a bridge to more performant frameworks.

**For most small to medium-sized datasets, pandas continues to be an excellent choice. Its familiarity, flexibility, and ecosystem support make it a safe and reliable option for a wide range of use cases. However, for larger datasets or performance-critical workflows, it’s worth exploring complementary tools like Polars and DuckDB**. (Note: in this discussion, we are focusing on single-node performance; for distributed multi-node performance, there are excellent tools like Dask – See: <https://docs.coiled.io/blog/tpch.html> for a discussion of scaling from 100GB to 10TB datasets)

![](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/polars-image.png)

## Polars: A Modern Approach to DataFrames

As data grows in size and complexity, traditional tools like pandas can struggle to keep up. This is where Polars steps in. Designed for speed, flexibility, and modern data workflows, Polars reimagines the DataFrame paradigm with a focus on _lazy execution, memory efficiency,_ and _innovative syntax_.

## Why Choose Polars?

Polars is built from the ground up with performance in mind. Unlike pandas, which processes operations immediately (_eager execution_), Polars supports both _eager_ and _lazy execution_. Lazy execution allows Polars to optimize operations before running them, reducing memory usage and improving efficiency. This makes it particularly well-suited for workflows involving medium to large datasets.

One standout feature of Polars is its ability to handle operations on sorted data intelligently. Once you sort your data, Polars remembers the order, enabling faster subsequent operations. It also shines in window functions, which are both fast and intuitive to implement.

## Syntax: A New Way to Think About DataFrames

While many tools mimic pandas’ syntax for ease of adoption, Polars takes a different approach. **It introduces its own syntax, designed to be more expressive and optimized for modern data workflows**. This might seem daunting at first, especially for users familiar with pandas. However, once you understand how Polars’ expression-based system works, it often feels more intuitive and scalable than pandas’ approach.

Polars focuses heavily on building reusable expressions, allowing users to chain operations seamlessly without repeated trips to documentation or Stack Overflow. For example, tasks that require multiple steps in pandas can often be condensed into a single, optimized pipeline in Polars.

People seem to move to Polars because of performance, but the reason you stay is the syntax. As someone who has used pandas for a very long time—about 15 years since it came out—and who only recently started playing around with Polars, I have to say I have fallen in love with its expression system. It takes a little while to get your head around it, but it’s very composable and generalizable.

## Performance and Modern Features

**Polars leverages** [**Apache Arrow**](https://github.com/apache/arrow) **as its memory format, providing a foundation for efficient memory handling and compatibility with other Arrow-based tools.** Arrow’s inclusion also simplifies working with external libraries and enables _zero-copy operations_ where possible, reducing overhead when transitioning between tools.

**Polars is _inherently multi-threaded_, which allows it to utilize modern multi-core processors effectively**. Unlike pandas, which is largely _single-threaded_ unless paired with external tools like Dask, Polars provides _parallelism_ out of the box. This significantly boosts performance for compute-intensive tasks.

While Polars does not (yet?) support all of pandas’ complex data types (such as sparse or period), it also has excellent support for data types such as fixed and variable-length lists, structs, as well as [state-of-the-art strings](https://pola.rs/posts/polars-string-type/). Recent developments, including its CUDA integration for GPU acceleration, promise even greater performance for computationally heavy workflows.

## When to Use Polars

**Polars is an excellent choice for:**

- Medium to large datasets where performance is critical.
- Workflows that require frequent switching between lazy and eager execution.
- Scenarios where modern syntax and expression-based workflows can simplify complexity.
- Production-ready pipelines which require strictness and validation.

That said, Polars does have a learning curve, especially for those transitioning from pandas. However, the investment in learning its syntax is well worth it for users looking to future-proof their workflows and handle more demanding datasets.

![](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/DuckDB-Image.png)

## DuckDB: SQL Reimagined for Analytics

SQL has long been the standard for querying and managing structured data, but most SQL engines are designed for transactional workloads rather than analytical ones. Enter DuckDB—a modern, in-process analytical database optimized for single-node systems. With its focus on speed, scalability, and ease of use, DuckDB offers a powerful alternative for handling large datasets and complex analytical workflows.

## Why Choose DuckDB?

DuckDB shines in scenarios where SQL’s strengths align with the need for performance and scalability. It supports lazy execution, meaning it optimizes query plans before running them, ensuring efficient resource usage. This makes DuckDB particularly well-suited for large datasets, even those exceeding your machine’s memory.

Unlike traditional databases, DuckDB is an in-process system, meaning it doesn’t require a server. It works directly within your Python environment or notebook, offering the power of a full analytical database without the overhead. For example, DuckDB can process a 50 GB dataset on a laptop, even when decompressed to 150–200 GB, by streaming data through memory instead of loading it all at once.

## Key Features of DuckDB

**SQL-Based Querying**

- DuckDB fully embraces SQL, making it an excellent choice for users familiar with writing complex queries. For example, tasks like joins, aggregations, and groupings can be executed quickly and efficiently.
- Unique features like the “group by all” functionality highlight DuckDB’s innovative approach to SQL, offering capabilities not found in traditional systems.

**Handling Large Datasets**

- With its ability to stream data through memory, DuckDB can handle datasets far larger than what pandas or Polars can manage on a typical machine. This makes it an ideal choice for users working on laptops or workstations without access to high-memory environments.

**Interoperability**

- DuckDB integrates seamlessly with pandas and Polars, allowing you to preprocess data in SQL and then switch to Python-based tools for further analysis. This makes it a versatile tool in multi-step workflows.

**Simplified Setup**

- DuckDB’s in-process design eliminates the need for external servers or complex configurations. It’s as easy to use as importing a library in Python and running a query.

## DuckDB in Modern Workflows

In enterprise and analytics-heavy environments, DuckDB has proven to be a game-changer. Combining SQL’s stability with high performance can empower users to handle datasets 10x to 100x larger than traditional tools, all without needing specialized hardware. Furthermore, DuckDB’s ability to stream data efficiently and work with modern tools like pandas and Polars makes it a valuable addition to any data professional’s toolkit.

For those exploring large datasets, SQL-based analytics, or LLM-driven automation (where SQL’s stable syntax excels), DuckDB offers a robust, scalable solution that bridges the gap between traditional databases and modern data analysis tools.

![](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/comparison-table1a.png)

## When to Use DuckDB

**DuckDB excels in:**

- Scenarios where SQL is the preferred query language.
- Preprocessing or querying large datasets before transitioning to pandas or Polars for deeper analysis.
- Workflows where ease of setup and efficient resource usage are priorities.

However, DuckDB’s SQL-first approach can feel limiting for users who prefer Python-based tools. Its Python API is functional but not as well-documented or intuitive as pandas or Polars. Additionally, some operations, like window functions or cumulative sums, require explicit ordering clauses (`` `ORDER BY` ``) due to [limited guarantees of row ordering](https://duckdb.org/docs/sql/dialect/order_preservation.html) in query results.

## Practicality: Comparing DuckDB and Polars

When it comes to performance, both DuckDB and Polars offer unique strengths that make them stand out from traditional tools like pandas. However, their design philosophies and execution models cater to different needs, making them complementary rather than direct competitors.

## Performance at Scale

**DuckDB truly shines at larger scales, thanks to its efficient streaming engine**. It excels in handling massive datasets, such as those in the range of 1 TB to 10 TB. Benchmarks, [like those conducted by Coiled](https://docs.coiled.io/blog/tpch.html), show DuckDB’s impressive performance across industry-standard TPC-H queries. While few users regularly work with datasets this large, it’s common to encounter data in the 50–500 GB range—and both DuckDB and Polars handle these workloads effectively.

**Polars, on the other hand, delivers exceptional performance for smaller to medium-sized datasets**. Its ability to execute operations lazily or eagerly provides users with flexibility depending on their workflow needs. Polars also stands out in tasks like window operations, where its optimized memory handling and sorting capabilities give it an edge.

## Execution Models: Lazy vs. Eager

A key difference between these tools lies in their execution models:

- **DuckDB operates exclusively in lazy mode, meaning it optimizes all operations before execution**. While this ensures efficiency, it can slow down experimentation, as users can’t view intermediate results until all queries are finalized. This limitation often leads users to preprocess data in DuckDB and then transition to pandas or Polars for further analysis.
- **Polars, by contrast, supports both lazy and eager execution, allowing users to experiment and refine their workflows interactively**. This flexibility makes it particularly attractive for iterative development and smaller analyses.

## Working with Larger-Than-Memory Datasets

**Both tools handle datasets larger than your machine’s memory by streaming data through memory** rather than loading it all at once. For example, decompressing a 50 GB Parquet file might expand to 150–200 GB in RAM—well beyond the limits of most laptops. DuckDB and Polars efficiently process these datasets without crashing, making them invaluable for data professionals without access to clusters. Note that Polars’ streaming engine is still experimental, but a full-rewrite is underway.

## SQL vs. Python: A Question of Preference

DuckDB is SQL-centric, making it ideal for those comfortable writing complex SQL queries. Its SQL grammar is stable, well-documented, and hasn’t changed significantly over time. This stability makes DuckDB particularly appealing for workflows involving automation or large language models (LLMs), which excel at generating SQL compared to Python code for pandas or Polars.

Polars, meanwhile, is designed for Python-first workflows, introducing a modern syntax that is more expressive and Pythonic than pandas. While there is a learning curve for new users, Polars’ approach to expressions often simplifies complex workflows, offering a clean and efficient alternative to pandas.

## Combining Tools for Maximum Effect

In many workflows, these tools complement rather than replace each other. For example, you might use DuckDB for initial data extraction and processing, then transition to Polars or pandas for detailed analysis and visualization. Both DuckDB and Polars allow for seamless integration, enabling smooth transitions between tools.

By experimenting with these tools on real-world projects, you can discover their strengths and limitations, ensuring you’re prepared for any data challenge. There’s space for all three tools—pandas, Polars, and DuckDB—to coexist, depending on your needs. The growing diversity of DataFrame tools has introduced exciting possibilities for data professionals. Pandas, Polars, and DuckDB each bring unique strengths to the table, but they aren’t mutually exclusive. Instead, they complement one another, enabling seamless transitions and interoperability across workflows.

## Embracing a Growing Ecosystem

These advancements aren’t about replacing pandas but complementing it. By combining tools, data professionals can build workflows that leverage the unique strengths of each. For example:

- Use DuckDB for SQL-based preprocessing and large dataset management.
- Transition to Polars for performance-intensive analysis with flexible syntax.
- Continue leveraging pandas for its stability and ecosystem of domain-specific libraries.

![](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/Dataframes-image.png)

## Expanding the DataFrame Ecosystem

The DataFrame ecosystem has evolved significantly in recent years, with tools like Polars and DuckDB offering fresh perspectives on performance, scalability, and usability. While pandas remains the most widely used tool, these newcomers provide exciting alternatives that address common limitations in traditional workflows.

## Interoperability: The Road Ahead

Thanks to ongoing collaboration in the data science community, these tools are becoming increasingly interoperable. For example, you can:

- Perform part of your workflow in pandas, then switch to Polars for performance-intensive operations using zero-copy transitions with PyArrow.
- Query pandas and Polars DataFrames directly from DuckDB using SQL, allowing for seamless integration across tools.
- Leverage libraries like [Narwhals](https://narwhals-dev.github.io/narwhals/) to support multiple DataFrame backends in custom libraries without complex compatibility issues.

This interoperability ensures that data professionals can choose the best tool for each stage of their workflow without being locked into a single solution.

## Strengths and Improvements Across the Ecosystem

Polars has gained traction for its speed and flexibility, offering advanced features like lazy execution and multi-threading. One of its early challenges—compatibility with upstream and downstream libraries—is steadily improving.

DuckDB is revolutionizing how we think about analytical workflows. Its ability to handle massive datasets efficiently, combined with SQL’s stability as a language, makes it a powerful choice for both preprocessing and integration with other tools. DuckDB’s support for pandas and Polars further cements its role as a key player in modern data workflows.

For library maintainers, tools like Narwhals are pushing the boundaries of compatibility. Narwhals provides a lightweight, dependency-free way to integrate support for multiple DataFrame libraries, enabling seamless transitions between pandas, Polars, DuckDB, and others. For instance, Altair’s ability to work with Polars is powered by Narwhals under the hood. While not an end-user tool, Narwhals is a valuable asset for developers creating tools that need to operate across multiple libraries.

## Transforming the Data Science Landscape

The availability of these new tools is essential for many data professionals. Previously, handling large datasets can require specialized hardware or clusters. With DuckDB and Polars, datasets that once crashed machines can now be processed efficiently on laptops. Polars’ recent CUDA integration adds GPU acceleration to the mix, promising even greater performance for computationally intensive tasks.

This ability to integrate tools seamlessly ensures that users can adapt their workflows as their needs evolve.

![A pair of glasses with computer code reflected in the lenses, symbolizing a forward-thinking and focused approach to advancing DataFrame workflows and exploring modern tools like pandas, Polars, and DuckDB. The image evokes innovation, clarity, and a vision for the future of data analysis.](/posts/how-many-dataframe-libraries-do-you-need-to-change-a-lightbulb/Lenses-image.png)

## Looking Ahead: Taking Your DataFrame Work to the Next Level

For those starting new projects, now is the perfect time to explore these tools. Try Polars or DuckDB for smaller analyses, or incorporate them into larger workflows to see how they perform in real-world scenarios. Each tool brings unique capabilities to the table, and the investment in learning them can pay off significantly.

Pandas is still awesome—it’s everywhere, and this is not about criticizing pandas. However, having new tools like DuckDB and Polars in the ecosystem makes everything better. While these tools require an investment in learning new syntax, they provide more choices and enable work with much larger datasets.

As the ecosystem grows, the tools we use are becoming more powerful and adaptable, enabling us to solve bigger problems with fewer constraints. By experimenting, learning, and integrating these tools into your workflows, you’re not just keeping up with the evolution of data science—you’re helping to shape its future. If you’re a tool builder looking to support multiple libraries, consider using Narwhals.

## Next Steps

The tools we’ve explored—pandas, Polars, and DuckDB—represent the cutting-edge of DataFrame libraries, but even the best tools are only as effective as how you use them. Are you confident you’re getting the most out of your current workflows? Could exploring these tools unlock new efficiencies or capabilities for your projects?

What’s the biggest problem you’re facing with your data workflows today? If you’re ready to move past limits, I’d love to hear from you. Whether you’re navigating the challenges of integrating these tools, tackling datasets that push your current systems to the edge, or simply wondering which tool is right for your next big project, let’s talk. Drop me a message or [reach out to the Quansight team](https://quansight.com/about-us/#bookacallform).

Together, we can explore how to optimize your approach, streamline your analysis, and take your work to the next level.

## Additional Viewing/Listening

- Polars and Time Series: <https://youtu.be/qz-zAHBz6Ks?si=ioUnFS0Z_r7qb36s>
- Understanding Polars Expressions when you’re used to pandas: <https://youtu.be/BgnPgssga90?si=fKvXz2j8FUG4WaQX>
- How you can write a Polars plugin (tutorial): <https://youtu.be/j2N_YD5vbOs?si=WQYbJrEy4KAgV1qr>
- Polars and time zones: <https://youtu.be/Qr0PnDox5MM?si=RBLHNODcrjohdHuA>
- Ahoy, Narwhals are bridging the data science APIs <https://youtu.be/FSH7BZ0tuE0>
