---
title: "Highlights of the Ibis 1.3 release"
author: ivan-ogasawara
published: May 2, 2020
description: 'Ibis 1.3 was just released, after 8 months of development work, with 104 new commits from 16 unique contributors. In this blog post we will discuss some important features in this new version!'
category: [PyData ecosystem]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: 'Excellent alt-text describing the featured image'
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: 'Excellent alt-text describing the hero image'
---

Ibis 1.3 was just released, after 8 months of development work, with 104
new commits from 16 unique contributors. What is new? In this blog post
we will discuss some important features in this new version!

First, if you are new to the Ibis framework world, you can check this
[blog
post](https://labs.quansight.org/blog/2019/07/ibis-python-data-analysis-productivity-framework/)
I wrote last year, with some introductory information about it.

Some highlighted features of this new version are:

-   Addition of a `PySpark` backend
-   Improvement of geospatial support
-   Addition of `JSON`, `JSONB` and `UUID` data types
-   Initial support for `Python 3.8` added and support for `Python 3.5`
    dropped
-   Added new backends and geospatial methods to the documentation
-   Renamed the `mapd` backend to `omniscidb`

This blog post is divided into different sections:

-   OmniSciDB
-   PostgreSQL
-   PySpark
-   Geospatial support
-   Python versions support

``` python
import ibis
import pandas as pd
```

### OmniSciDB

The `mapd` backend is now named `omniscidb`!

An important feature of `omniscidb` is that now you can define if the
connection is `IPC` (Inter-Process Communication), and you can also
specify the `GPU` device ID you want to use (if you have a NVIDIA card,
supported by `cudf`).

`IPC` is used to provide shared data support between processes.
OmniSciDB uses Apache Arrow to provide IPC support.

``` python
con_omni = ibis.omniscidb.connect(
    host='localhost', 
    port='6274',
    user='admin',
    password='HyperInteractive',
    database='ibis_testing',
    ipc=False,
    gpu_device=None
)
con_omni.list_tables()
```

    ['diamonds', 'batting', 'awards_players', 'functional_alltypes', 'geo']

Also you can now specify `ipc` or `gpu_device` directly to the `execute`
method:

``` python
t = con_omni.table('functional_alltypes')
expr = t[['id', 'bool_col']].head(5)
df = expr.execute(ipc=False, gpu_device=None)
df
```

```{=html}
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>bool_col</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>6690</td>
      <td>True</td>
    </tr>
    <tr>
      <th>1</th>
      <td>6691</td>
      <td>False</td>
    </tr>
    <tr>
      <th>2</th>
      <td>6692</td>
      <td>True</td>
    </tr>
    <tr>
      <th>3</th>
      <td>6693</td>
      <td>False</td>
    </tr>
    <tr>
      <th>4</th>
      <td>6694</td>
      <td>True</td>
    </tr>
  </tbody>
</table>
</div>
```

As you can imagine, the result of `df` is a `pandas.DataFrame`

``` python
type(df)
```

    pandas.core.frame.DataFrame

But if you are using `gpu_device` the result would be a `cudf` :)

`<small>`{=html}

> Note: when `IPC=True` is used, the code needs to be executed on the
> same machine where the database is running
>
> Note: when `gpu_device` is used, 1) it uses IPC (see the note above)
> and 2) it needs a NVIDIA card supported by `cudf`.

Another interesting feature is that now `omniscidb` also supports
`shapefiles` (input) and `geopandas` (output)!

Check out the *Geospatial support* section below to see more details!

Also the new version adds translations for more window operations for
the `omniscidb` backend, such as: `DenseRank`, `RowNumber`, `MinRank`,
`Count`,
[`PercentRank/CumeDist`](https://github.com/ibis-project/ibis/issues/1975).

For more information about window operations, check the [Window
functions](https://docs.ibis-project.org/sql.html#window-functions)
documentation section.

### PostgreSQL

Some of the highlighted features for the `PostgreSQL` backend are new
data types included, such as: `JSON`, `JSONB` and `UUID`.

``` python
from uuid import uuid4 
uuid_value = ibis.literal(uuid4(), type='uuid')
uuid_value == ibis.literal(uuid4(), type='uuid')
```

![](6a98cb83ec33da5b0824391dc456c3cf654cbd89.png)

``` python
import json
json_value = ibis.literal(json.dumps({"id": 1}), type='json')
json_value
```

![](29d7d60365fe2da629b5103143e73bfea0b6f39f.png)

``` python
jsonb_value = ibis.literal(json.dumps({"id": 1}).encode('utf8'), type='jsonb')
jsonb_value
```

![](8ddc92a22b0ccd022331e7a05bda2e0793922b6b.png)

Another important new features on `PostgreSQL` backend is the support of
new `geospatial` operations, such as

-   GeometryType
-   GeometryN
-   IsValid
-   LineLocatePoint
-   LineMerge
-   LineSubstring
-   OrderingEquals
-   Union

Also, now it has support for two geospatial data types: `MULTIPOINT` and
`MULTILINESTRING`.

Check out the *Geospatial support* section below to see some usage
examples of geospatial operations!

### PySpark

This new version also includes support for a new backend: **PySpark**!

Let's do the first steps with this new backend starting with a Spark
session creation.

``` python
import os

import pyspark
from pyspark.sql import SparkSession
import pyspark.sql.types as pt
from pathlib import Path

# spark session and pyspark connection
spark_session = SparkSession.builder.getOrCreate()
con_pyspark = ibis.pyspark.connect(session=spark_session)
```

We can use `spark` or `pandas` for reading from `CSV` file. In this
example, we will use `pandas`.

``` python
data_directory = Path(
    os.path.join(
        os.path.dirname(ibis.__path__[0]),
        'ci',
        'ibis-testing-data'
    )
)

pd_df_alltypes = pd.read_csv(data_directory / 'functional_alltypes.csv')
pd_df_alltypes.info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 7300 entries, 0 to 7299
    Data columns (total 15 columns):
     #   Column           Non-Null Count  Dtype  
    ---  ------           --------------  -----  
     0   index            7300 non-null   int64  
     1   Unnamed: 0       7300 non-null   int64  
     2   id               7300 non-null   int64  
     3   bool_col         7300 non-null   int64  
     4   tinyint_col      7300 non-null   int64  
     5   smallint_col     7300 non-null   int64  
     6   int_col          7300 non-null   int64  
     7   bigint_col       7300 non-null   int64  
     8   float_col        7300 non-null   float64
     9   double_col       7300 non-null   float64
     10  date_string_col  7300 non-null   object 
     11  string_col       7300 non-null   int64  
     12  timestamp_col    7300 non-null   object 
     13  year             7300 non-null   int64  
     14  month            7300 non-null   int64  
    dtypes: float64(2), int64(11), object(2)
    memory usage: 855.6+ KB

Now, we can create a Spark DataFrame and we will create a temporary view
from this data frame. Also we should enforce the desired types for each
column.

``` python
def pyspark_cast(df, col_types):
    for col, dtype in col_types.items():
        df = df.withColumn(col, df[col].cast(dtype))
    return df

ps_df_alltypes = spark_session.createDataFrame(pd_df_alltypes)

ps_df_alltypes = pyspark_cast(
    ps_df_alltypes, {
        'index': 'integer',
        'Unnamed: 0': 'integer',
        'id': 'integer',
        'bool_col': 'boolean',
        'tinyint_col': 'byte',
        'smallint_col': 'short',
        'int_col': 'integer',
        'bigint_col': 'long',
        'float_col': 'float',
        'double_col': 'double',
        'date_string_col': 'string',
        'string_col': 'string',
        'timestamp_col': 'timestamp',
        'year': 'integer',
        'month': 'integer'
    }
)

# use ``SparkSession`` to create a table
ps_df_alltypes.createOrReplaceTempView('functional_alltypes')
con_pyspark.list_tables()
```

    ['functional_alltypes']

Check if all columns were created with the desired data type:

``` python
t = con_pyspark.table('functional_alltypes')
t
```

![](5040bcc66b7071e11bb0db32b0142239a2336085.png)

Different than a `SQL` backend, that returns a `SQL` statement, the
returned `object` from the PySpark `compile` method is a PySpark
`DataFrame`:

``` python
expr = t.head()
expr_comp = expr.compile()
type(expr_comp)
```

    pyspark.sql.dataframe.DataFrame

``` python
expr_comp
```

    DataFrame[index: int, Unnamed: 0: int, id: int, bool_col: boolean, tinyint_col: tinyint, smallint_col: smallint, int_col: int, bigint_col: bigint, float_col: float, double_col: double, date_string_col: string, string_col: string, timestamp_col: timestamp, year: int, month: int]

To convert the compiled expression to a Pandas `DataFrame`, you can use
the `toPandas` method. The result should be the same as that returned by
the `execute` method.

``` python
assert all(expr.execute() == expr_comp.toPandas())
```

``` python
expr.execute()
```

```{=html}
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>index</th>
      <th>Unnamed: 0</th>
      <th>id</th>
      <th>bool_col</th>
      <th>tinyint_col</th>
      <th>smallint_col</th>
      <th>int_col</th>
      <th>bigint_col</th>
      <th>float_col</th>
      <th>double_col</th>
      <th>date_string_col</th>
      <th>string_col</th>
      <th>timestamp_col</th>
      <th>year</th>
      <th>month</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0</td>
      <td>0</td>
      <td>6690</td>
      <td>True</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>11/01/10</td>
      <td>0</td>
      <td>2010-11-01 00:00:00.000</td>
      <td>2010</td>
      <td>11</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>1</td>
      <td>6691</td>
      <td>False</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>10</td>
      <td>1.1</td>
      <td>10.1</td>
      <td>11/01/10</td>
      <td>1</td>
      <td>2010-11-01 00:01:00.000</td>
      <td>2010</td>
      <td>11</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2</td>
      <td>2</td>
      <td>6692</td>
      <td>True</td>
      <td>2</td>
      <td>2</td>
      <td>2</td>
      <td>20</td>
      <td>2.2</td>
      <td>20.2</td>
      <td>11/01/10</td>
      <td>2</td>
      <td>2010-11-01 00:02:00.100</td>
      <td>2010</td>
      <td>11</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3</td>
      <td>3</td>
      <td>6693</td>
      <td>False</td>
      <td>3</td>
      <td>3</td>
      <td>3</td>
      <td>30</td>
      <td>3.3</td>
      <td>30.3</td>
      <td>11/01/10</td>
      <td>3</td>
      <td>2010-11-01 00:03:00.300</td>
      <td>2010</td>
      <td>11</td>
    </tr>
    <tr>
      <th>4</th>
      <td>4</td>
      <td>4</td>
      <td>6694</td>
      <td>True</td>
      <td>4</td>
      <td>4</td>
      <td>4</td>
      <td>40</td>
      <td>4.4</td>
      <td>40.4</td>
      <td>11/01/10</td>
      <td>4</td>
      <td>2010-11-01 00:04:00.600</td>
      <td>2010</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
</div>
```

To finish this section, we can play a little bit with some aggregation
operations.

``` python
expr = t
expr = expr.groupby('string_col').aggregate(
    int_col_mean=t.int_col.mean(),
    int_col_sum=t.int_col.sum(),
    int_col_count=t.int_col.count(),
)
expr.execute()
```

```{=html}
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>string_col</th>
      <th>int_col_count</th>
      <th>int_col_mean</th>
      <th>int_col_sum</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>7</td>
      <td>730</td>
      <td>7.0</td>
      <td>5110</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3</td>
      <td>730</td>
      <td>3.0</td>
      <td>2190</td>
    </tr>
    <tr>
      <th>2</th>
      <td>8</td>
      <td>730</td>
      <td>8.0</td>
      <td>5840</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0</td>
      <td>730</td>
      <td>0.0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>730</td>
      <td>5.0</td>
      <td>3650</td>
    </tr>
    <tr>
      <th>5</th>
      <td>6</td>
      <td>730</td>
      <td>6.0</td>
      <td>4380</td>
    </tr>
    <tr>
      <th>6</th>
      <td>9</td>
      <td>730</td>
      <td>9.0</td>
      <td>6570</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1</td>
      <td>730</td>
      <td>1.0</td>
      <td>730</td>
    </tr>
    <tr>
      <th>8</th>
      <td>4</td>
      <td>730</td>
      <td>4.0</td>
      <td>2920</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2</td>
      <td>730</td>
      <td>2.0</td>
      <td>1460</td>
    </tr>
  </tbody>
</table>
</div>
```

Check out the PySpark Ibis backend [API
documentation](https://docs.ibis-project.org/api.html#pyspark-client-experimental)
and the [tutorials](https://docs.ibis-project.org/tutorial.html) for
more details.

### Geospatial support

Currently, `ibis.omniscidb` and `ibis.postgres` are the only Ibis
backends that support geospatial features.

In this section we will check some geospatial features using the
`PostgreSQL` backend.

``` python
con_psql = ibis.postgres.connect(
    host='localhost',
    port=5432,
    user='postgres',
    password='postgres',
    database='ibis_testing'
)
con_psql.list_tables()
```

    ['array_types',
     'awards_players',
     'batting',
     'diamonds',
     'films',
     'functional_alltypes',
     'geo',
     'geography_columns',
     'geometry_columns',
     'intervals',
     'not_supported_intervals',
     'raster_columns',
     'raster_overviews',
     'spatial_ref_sys',
     'tzone']

Two important features are that it support `shape` objects (input) and
`geopandas` dataframe (output)!

So, let's import `shapely` to create a simple `shape` point and
polygon.

``` python
import shapely

shp_point = shapely.geometry.Point((20, 10))
shp_point
```

![](fba0adc684226342999e42956c4bb303dedd9595.svg)

``` python
shp_polygon_1 = shapely.geometry.Polygon([(20, 10), (40, 30), (40, 20), (20, 10)])
shp_polygon_1
```

![](227141ab17cfaa94c0a1cad75849b5d1763fcae1.svg)

Now, let's create a Ibis table expression to manipulate a \"geo\"
table:

``` python
t_geo = con_psql.table('geo')
df_geo = t_geo.execute()
df_geo
```

```{=html}
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>geo_point</th>
      <th>geo_linestring</th>
      <th>geo_polygon</th>
      <th>geo_multipolygon</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>POINT (0.00000 0.00000)</td>
      <td>LINESTRING (0 0, 1 1)</td>
      <td>POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))</td>
      <td>(POLYGON ((30 20, 45 40, 10 40, 30 20)), POLYG...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>POINT (1.00000 1.00000)</td>
      <td>LINESTRING (1 1, 2 2)</td>
      <td>POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), ...</td>
      <td>(POLYGON ((40 40, 20 45, 45 30, 40 40)), POLYG...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>POINT (2.00000 2.00000)</td>
      <td>LINESTRING (2 2, 3 3)</td>
      <td>POLYGON ((2 2, 3 3, 4 4, 5 5, 5 2, 2 2))</td>
      <td>(POLYGON ((2 2, 3 3, 4 4, 5 5, 5 2, 2 2)))</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>POINT (3.00000 3.00000)</td>
      <td>LINESTRING (3 3, 4 4)</td>
      <td>POLYGON ((3 3, 4 4, 5 5, 6 6, 6 3, 3 3))</td>
      <td>(POLYGON ((3 3, 4 4, 5 5, 6 6, 6 3, 3 3)))</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>POINT (4.00000 4.00000)</td>
      <td>LINESTRING (4 4, 5 5)</td>
      <td>POLYGON ((4 4, 5 5, 6 6, 7 7, 7 4, 4 4))</td>
      <td>(POLYGON ((4 4, 5 5, 6 6, 7 7, 7 4, 4 4)))</td>
    </tr>
  </tbody>
</table>
</div>
```

And the type of `df_geo` is \... a `geopandas` dataframe!

``` python
type(df_geo)
```

    geopandas.geodataframe.GeoDataFrame

So you can take the advantage of GeoPandas features too!

``` python
df_geo.set_geometry('geo_multipolygon').head(1).plot();
```

![](6567cb659b1067258d29fbe649755a2e848e108a.png)

Now, let's check if there are any `geo_multipolygon`'s that contain
the `shape` point we just created.

``` python
t_geo[
    t_geo.geo_multipolygon, 
    t_geo['geo_multipolygon'].contains(shp_point).name('contains_point_1')
].execute()
```

```{=html}
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>geo_multipolygon</th>
      <th>contains_point_1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>MULTIPOLYGON (((30.00000 20.00000, 45.00000 40...</td>
      <td>True</td>
    </tr>
    <tr>
      <th>1</th>
      <td>MULTIPOLYGON (((40.00000 40.00000, 20.00000 45...</td>
      <td>True</td>
    </tr>
    <tr>
      <th>2</th>
      <td>MULTIPOLYGON (((2.00000 2.00000, 3.00000 3.000...</td>
      <td>False</td>
    </tr>
    <tr>
      <th>3</th>
      <td>MULTIPOLYGON (((3.00000 3.00000, 4.00000 4.000...</td>
      <td>False</td>
    </tr>
    <tr>
      <th>4</th>
      <td>MULTIPOLYGON (((4.00000 4.00000, 5.00000 5.000...</td>
      <td>False</td>
    </tr>
  </tbody>
</table>
</div>
```

So, as expected, just the first two `multipolygon`s contain a `point`
with coordinates `(20, 10)`.

For more examples of Geospatial Analysis with Ibis, check this nice
[tutorial](https://docs.ibis-project.org/notebooks/tutorial/11-Geospatial-Analysis.html)
written by [Ian Rose](https://github.com/ian-r-rose)!

### Python versions support

Ibis 1.3 added initial support for Python 3.8 and dropped support for
Python 3.5.

> Note: currently, the
> [OmniSciDB](https://github.com/ibis-project/ibis/issues/2090) and
> [PySpark](https://github.com/ibis-project/ibis/issues/2091) backends
> are not supported on Python 3.8.

### Final words

**Do you want to play more with Ibis framework?**

You can install it from PyPI:

    python -m pip install --upgrade ibis-framework==1.3.0

Or from conda-forge:

    conda install ibis-framework=1.3.0 -c conda-forge

Check out some interesting tutorials to help you to start on Ibis:
<https://docs.ibis-project.org/tutorial.html>. If you are coming from
the SQL world, maybe [Ibis for SQL
Programmers](https://docs.ibis-project.org/sql.html) documentation
section will be helpful. Have fun!

