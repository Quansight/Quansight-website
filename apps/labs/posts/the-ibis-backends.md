---
title: 'Querying multiple backends with Ibis'
published: 2020-11-13
author: tony-fast
description: 'We'll highlight the ability of Ibis to generically prescribe query expressions across different data storage systems.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/the-ibis-backends/blog_feature_var2.svg
  alt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
hero:
  imageSrc: /posts/the-ibis-backends/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
---


In [our recent Ibis post], we discussed querying & retrieving data using a familiar [Pandas]-like interface.
That discussion focused on the fluent API that [Ibis] provides to query structure from a SQLite database&mdash;in particular, using a single specific backend.
In this post, we'll explore Ibis's ability to answer questions about data using two different Ibis backends.

```python
import ibis.omniscidb, dask, intake, sqlalchemy, pandas, pyarrow as arrow, altair, h5py as hdf5
```

## Ibis in the scientific Python ecosystem

Before we delve into the technical details of using Ibis, we'll consider Ibis in the greater historical context of the scientific Python ecosystem. It was started by Wes McKinney, the creator of Pandas, as way to query information on
the [Hadoop distributed file system][HDFS] and [PySpark]. More backends were added later as Ibis became a general tool for data queries.

Throughout the rest of this post, we'll highlight the ability of Ibis to generically prescribe
query expressions across different data storage systems.

### The design of Ibis backends

Currently, Ibis supports more than ten different backends:

```
>>> import ibis
>>> dir(ibis)
[...HDFS...WebHDFS...bigquery...clickhouse...hdf5...impala...omniscidb...pandas...pyspark...spark...sql...sqlite...]
```

A backend manages the computation of an Ibis query expression; _the query expression itself is independent of the computation_.
A backend implementation that can be queried with Ibis has one of the three following architectures:

1. Direct execution backends (e.g., Pandas and HDF5);
2. Expression-generating backends that create SQLAlchemy expressions (e.g., `ibis.sql`); or
3. String-generating backends (e.g., `ibis.bigquery` and `ibis.omniscidb`)

We'll unravel some of the different capabilities of each approach below.

## A data-driven history of Ibis compatibility

The table below looks at over 2000 issues in the Ibis project.
It provides an annual summary of the issues tagged in Ibis
for different backends over a span of six years.

|  <div style="width:120px"/></div>  | <div style="width:70px"/>&nbsp; &nbsp; 2015</div> | <div style="width:70px"/>&nbsp; &nbsp; 2016</div> | <div style="width:70px"/>&nbsp; &nbsp; 2017</div> | <div style="width:70px"/>&nbsp; &nbsp; 2018</div> | <div style="width:70px"/>&nbsp; &nbsp; 2019</div> | <div style="width:70px"/>&nbsp; &nbsp; 2020</div> |
|:-------------|:------:|:------:|:------:|:------:|:------:|:------:|
| [Omnisci]    |        |        |        |   31   |   33   |   38   |
| [Spark]      |        |        |   1    |        |   22   |   3    |
| [PostgreSQL] |   2    |   3    |   21   |   10   |   17   |   4    |
| [BigQuery]   |        |        |   15   |   71   |   12   |   2    |
| [Pandas]     |    2   |        |   49   |   35   |   32   |   4    |
| [SQLite]     |   25   |   2    |   10   |   8    |   1    |   1    |
| [Impala]     |   52   |   4    |   15   |   17   |   4    |   2    |
| [Kudu]       |        |        |        |        |        |   1    |
| [Geospatial] |        |        |        |        |   7    |   3    |
| [ClickHouse] |        |        |   8    |   9    |   1    |   4    |
| [MySQL]      |        |        |        |   2    |   2    |   4    |
| [SQLAlchemy] |   17   |   3    |   10   |   2    |   5    |        |
<br>

We note an early focus SQLite, SQLAlchemy and Impala.
Later, work began on the Pandas backend rounding out the three different types of backgrounds.
From this point, improvements were made to these key backends as ClickHouse, Spark and PostgreSQL.
For the past two years, Quansight, in partnership with OmniSci, added the `ibis.omniscidb`
string-generating backend. Further, our responsibilities have expanded
to support Ibis as community maintainers through Quansight Labs.
This collaboration introduced [geospatial functionality to Ibis][Geospatial] for several backends.

There are currently ongoing efforts to introduce support for [SQL Server][sql-server] backends.
What other backends would you like to see for Ibis?  Maybe our community could benefit from a [Dask]
backend or an [Altair] backend?

## Ibis direct execution backends

Ibis direct execution backends like Pandas and HDF5 operate on conventional in-memory python objects.
Pandas is the gold standard for structured data in Python and inspires the API for Ibis.

```python
pd = ibis.pandas.connect({'A': pandas.util.testing.makeDataFrame()})
```
The object `pd` is an Ibis backend based on `pandas.DataFrame`.

```python
expression = pd.table('A').head()
```

`expression` is an Ibis query that has `expression.compile` and `expression.execute` methods.
We'll recognize the `execute` method when we return `pandas.DataFrame`s from Ibis expression.
The `compile` method does not trigger any computation, rather it constructs an intermediate form
that is interpreted by a backend.

```python
>>> assert isinstance(expression.compile(), ibis.expr.types.TableExpr)
```

In the case of direction execution backends, the `expression` compiles to an the original Ibis
expression.  The computation itself is carried out based on a set of recipes defined in Ibis.
In general, we would typically do this work directly in Pandas; however this approach is
practical in making tests for backend-independent expressions.

## Ibis expression-generating backends.

```python
db = ibis.sqlite.connect('lahmansbaseballdb.sqlite')
expression = db.table('halloffame').head()
```

Expression-generating backends operate on SQL databases that interoperate with SQLAlchemy.

```python
>>> assert isinstance(expression.compile(), sqlalchemy.sql.Select)
```

In the case of expression-generating backends, the intermediate representation is a `sqlalchemy` object.
SQLAlchemy is _the Database Toolkit for Python_ and Ibis leverages its compatibility
with traditional SQL databases.

## Ibis string generating backends.

There are two options for downloading Ibis: using `pip` or using `conda`.

- `pip`: the extra backends from Ibis need to be requested explicitly, e.g.:

```bash
pip install --upgrade ibis-framework[omniscidb] ibis-framework[sqlite]
```

- `conda`: all the supported [backends] (e.g., [SQL], [Pandas], [BigQuery], [Omnisci], etc.) are bundled in a single conda package and can be downloaded/installed simultaneously:

```bash
conda install -c conda-forge ibis-framework # installs all the backends!
```

String-generating backends allow Ibis to interface with big data systems that manage
their own computation. For example, we may connect to an example Omnisci database.

```python
import ibis.omniscidb
omnisci = ibis.omniscidb.connect(host='metis.omnisci.com',
                                 user='demouser',
                                 password='HyperInteractive',
                                 port=443,
                                 database='omnisci',
                                 protocol='https')
```

The `omnisci` object is described as a string-generating backend because the intermediate representation of the query is a flavor of SQL.

```python
expression = omnisci.table('upstream_reservoir').head()
```

A string-generating expression compiles to `ibis.omniscidb` flavored SQL, while `ibis.bigquery` may have a different string representation.

```python
>>> expression.compile()
'SELECT *\nFROM upstream_reservoir\nLIMIT 5'
```

## Acknowledgements
Major credit goes to [@xmnlab] in his heroic PR to introduce `ibis.omniscidb` into Ibis. You can watch
the drama play out in this [Github Issue][omnisci-pr]. We'd like to thank the maintainers of Ibis for
their effort in supporting the Ibis community.

Learn more about OmniSci and `ibis.omniscidb` in this Quansight Labs post:
[Ibis: Python data analysis productivity framework][labs-post].

[our recent Ibis post]: https://labs.quansight.org/blog/2020/06/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/
[Ibis]: https://www.ibis-project.org/
[SQL]: https://en.wikipedia.org/wiki/SQL
[Python]: https://en.wikipedia.org/wiki/Python_(programming_language)
[flavor of sql]: https://stackoverflow.com/questions/1326318/difference-between-different-types-of-sql
[design]: https://docs.ibis-project.org/design.html
[SQLite]: https://www.sqlite.org/index.html
[Pandas]: http://pandas.pydata.org/
[Omnisci]: https://www.omnisci.com/
[glue]: https://docs.scipy.org/doc/numpy/user/c-info.python-as-glue.html
[Dask]: https://dask.org/
[flavor of sql]: https://stackoverflow.com/questions/1326318/difference-between-different-types-of-sql
[dag]: https://en.wikipedia.org/wiki/Directed_acyclic_graph
[data]: http://www.seanlahman.com/baseball-archive/statistics/
[database connection]: https://en.wikipedia.org/wiki/Database_connection
[tidy data]: https://vita.had.co.nz/papers/tidy-data.pdf
[openteams]: https://openteams.com/
[contributing]: https://docs.ibis-project.org/contributing.html
[qs]: https://www.quansight.com/
[graphviz]: https://graphviz.org
[materialized view]: https://en.wikipedia.org/wiki/Materialized_view
[Blaze]: https://blaze.pydata.org/
[SQLAlchemy]: https://www.sqlalchemy.org/
[backends]: https://ibis-project.org/docs/backends/index.html
[intake]: https://intake.readthedocs.io/en/latest/
[arrow]: https://arrow.apache.org/docs/python/
[labs-post]: https://labs.quansight.org/blog/2019/07/ibis-python-data-analysis-productivity-framework/
[Geospatial]: http://ibis-project.org/docs/user_guide/geospatial_analysis.html
[geo-tutorial]: https://github.com/ibis-project/ibis/pull/1991
[geo-closed]: https://github.com/ibis-project/ibis/issues?q=label%3Ageospatial+is%3Aclosed
[sql-server]: https://github.com/ibis-project/ibis/pull/1997
[omnisci-pr]: https://github.com/ibis-project/ibis/pull/1419
[test-hdf5]: https://github.com/ibis-project/ibis/blob/master/ibis/file/tests/test_hdf5.py
[@xmnlab]: https://github.com/xmnlab
[HDFS]: https://en.wikipedia.org/wiki/Apache_Hadoop#HDFS
[Spark]: https://spark.apache.org/
[PySpark]: https://pypi.org/project/pyspark/
[PostgreSQL]: https://www.postgresql.org/
[MySQL]: https://www.mysql.com/
[BigQuery]: https://cloud.google.com/bigquery/
[Impala]: https://impala.apache.org/
[ClickHouse]: https://clickhouse.tech/
[Kudu]: https://kudu.apache.org/
[Altair]: https://www.altair.com/
