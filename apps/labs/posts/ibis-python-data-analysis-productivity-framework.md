---
title: "Ibis: Python data analysis productivity framework"
author: ivan-ogasawara
published: July 9, 2019
description: 'During the last months OmniSci and Quansight were working together to add a backend to Ibis for OmniSciDB (formerly MapD Core)The implementation of this new backend also resulted in the creation of new expressions/operators on Ibis core, such as GeoSpatial data types and operations, trigonometric operations and Ssome statistcal operations.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/ibis-python-data-analysis-productivity-framework/blog_feature_var2.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/ibis-python-data-analysis-productivity-framework/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Ibis is a library pretty useful on data analysis tasks that provides a
pandas-like API that allows operations like create filter, add columns,
apply math operations etc in a `lazy` mode so all the operations are
just registered in memory but not executed and when you want to get the
result of the expression you created, Ibis compiles that and makes a
request to the remote server (remote storage and execution systems like
Hadoop components or SQL databases). Its goal is to simplify analytical
workflows and make you more productive.

Ibis was created by [Wes McKinney](https://github.com/wesm) and is
mainly maintained by [Phillip Cloud](https://github.com/cpcloud) and
[Krisztián Szűcs](https://github.com/kszucs). Also, recently, I was
invited to become a maintainer of the Ibis repository!

Maybe you are thinking: \"why should I use Ibis?\". Well, if you have
any of the following issues, probably you should consider using Ibis in
your analytical workflow!

-   if you need to get data from a SQL database but you don't know much
    about SQL \...
-   if you create SQL statements manually using string and have a lot of
    `IF`'s in your code that compose specific parts of your SQL code
    (it could be pretty hard to maintain and it will makes your code
    pretty ugly) \...
-   if you need to handle data with a big volume \...

If you want to learn more about ibis consider taking a look at these
tutorials:

-   [https://docs.ibis-project.org/tutorial.html](https://docs.ibis-project.org/tutorial.html)

Do you want to watch some interesting video about Ibis? Check this out:

-   [https://www.youtube.com/embed/8Tzh42mQjrw?start=1625](https://www.youtube.com/embed/8Tzh42mQjrw?start=1625)

**Now, let's check out some work developed here at Quansight in the
last months!**

During the last months **OmniSci** and **Quansight** were working
together to add a backend to Ibis for **OmniSciDB** (formerly MapD
Core)! In a few words, OmniSciDB is an in-memory, column store, SQL
relational database designed from the ground up to run on GPUs. If you
don't know yet this amazing database, I invite you to [check it
out](https://omnisci.com).

The implementation of this new backend also resulted in the creation of
new expressions/operators on Ibis core, such as:

-   GeoSpatial data types and operations
-   Trigonometric operations
-   Some statistcal operations

First, let's connect to a *OmniSciDB* and play with this new features!

``` python
# install the dependencies if you need!
# !conda install -y ibis-framework=1.1.0 pyarrow pymapd vega geopandas geoalchemy2 shapely matplotlib --force-reinstall
```

``` python
import ibis
from matplotlib import pyplot as plt

print('ibis:', ibis.__version__)
```

    ibis: 1.2.0+7.g3afa8b0d

``` python
# metis.mapd.com is used in some OmniSci docs
# but maybe you want to install your own OmniSciDB instance
# you can take a look into installation section at 
# https://www.omnisci.com/docs/latest/
# also you maybe want to check the omniscidb-cpu conda package
# conda install -c conda-forge omniscidb-cpu
# if you need any help, feel free to open an issue at
# https://github.com/conda-forge/omniscidb-cpu-feedstock/
omniscidb_cli = ibis.mapd.connect(
    host='metis.mapd.com', 
    user='mapd', 
    password='HyperInteractive',
    port=443, 
    database='mapd',
    protocol='https'
)
```

### GeoSpatial features

You need to handle geospatial data in a esier way?

Let's take a look inside `zipcodes_2017` table!

Well, currently `omniscidb` backend doesn't support `geopandas` output,
so let's use a workaround for that! It should be implemented into
`omniscidb` backend soon! (see:
[gist-code](https://gist.githubusercontent.com/xmnlab/587dd1bde44850f3117a1087ed3f0f28/raw/0750400db90cf97319a91aa514648c31ad4ace45/omniscidb_geopandas_output.py))

``` python
gist_url = 'https://gist.githubusercontent.com/xmnlab/587dd1bde44850f3117a1087ed3f0f28/raw/0750400db90cf97319a91aa514648c31ad4ace45/omniscidb_geopandas_output.py'
!wget {gist_url} -O omniscidb_geopandas_output.py
```

    --2019-07-05 11:31:57--  [https://gist.githubusercontent.com/xmnlab/587dd1bde44850f3117a1087ed3f0f28/raw/0750400
    db90cf97319a91aa514648c31ad4ace45/omniscidb_geopandas_output.py](https://gist.githubusercontent.com/xmnlab/587dd1bde44850f3117a1087ed3f0f28/raw/0750400db90cf97319a91aa514648c31ad4ace45/omniscidb_geopandas_output.py)
    Resolviendo gist.githubusercontent.com (gist.githubusercontent.com)... 151.101.48.133
    Conectando con gist.githubusercontent.com (gist.githubusercontent.com)[151.101.48.133]:443... conectado.
    Petición HTTP enviada, esperando respuesta... 200 OK
    Longitud: 1874 (1,8K) [text/plain]
    Guardando como: “omniscidb_geopandas_output.py”

    omniscidb_geopandas 100%[===================>]   1,83K  --.-KB/s    en 0s      

    2019-07-05 11:31:57 (70,1 MB/s) - “omniscidb_geopandas_output.py” guardado [1874/1874]

``` python
# workaround to use geopandas output
from omniscidb_geopandas_output import enable_geopandas_output 
enable_geopandas_output(omniscidb_cli)
```

``` python
t = omniscidb_cli.table('zipcodes_2017')
display(t)
```

![A DatabaseTable with its data types](/posts/ibis-python-data-analysis-productivity-framework/a0a51ad71e1a32140f3e47e71145e6a67d061750.png)

``` python
print('# rows:', t.count().execute())
```

    # rows: 33144

This table has \~33k rows. For this example, let's use just the first
1k rows.

``` python
expr = t[t.omnisci_geo].head(1000)
df = expr.execute()
```

Instead of getting all rows from the database and get from that the
first 1000 rows, Ibis will prepare a SQL statement to get just the first
1000 rows! So it reduces the memory consuming to just the data you need!

This is what Ibis will request to the database:

``` python
print(expr.compile())
```

    SELECT "omnisci_geo"
    FROM zipcodes_2017
    LIMIT 1000

Of course geospatial data reading as text wouldn't be useful, so let's
plot the result!

**Remember: we are using geopandas here!**

``` python
# let's add some custom style :)
style_kwds = {
    'linewidth': 2,
    'markersize': 2,
    'facecolor': 'red',
    'edgecolor': 'red'
}

df['omnisci_geo'].iloc[::3].plot(**style_kwds)
plt.show()
```

![A scatterplot graph clustered in the upper right corner. It is clusetered -120 to 80 on the X axis and 40-60 in the Y axis.](/posts/ibis-python-data-analysis-productivity-framework/e62b7c1311b137ea2d1bfd6e7715369df26b2570.png)

### Trigonometric operations

Currently the OmniSciDB backend supports the follow trigonometric
operations: `acos`, `asin`, `atan`, `atan2`, `cos`, `cot`, `sin`, `tan`.

Let's check an example using a `sin` operation over `rowid` from
`zipcodes_2017`.

``` python
# if you want to use a SQL statement try`sql` method!
t = omniscidb_cli.sql('select rowid from zipcodes_2017')

expr = t[t.rowid, t.rowid.sin().name('rowid_sin')].sort_by('rowid').head(100)
expr.execute().rowid_sin.plot()
plt.show()
```

![A sine wave plot that repeats many times, the high points at 1,-- and -1.00. The X axis is 0 to 80.](/posts/ibis-python-data-analysis-productivity-framework/70f0a567ee713d1392bab6d8fef07bbe9777c033.png)

### Some statistical operations

The OmniSciDB Ibis backend also implements some statistical operations,
such as: `Correlation (corr)`, `Standard Deviation (stddev)`,
`Variance (var)` and `Covariance (cov)`.

Let's check a pretty simple example: if there is any correlation in
this dataset between `per capita income` and `education`.

``` python
t = omniscidb_cli.table('demo_vote_clean')
# remove some conflictives fields: 'TYPE', 'NAME', 'COUNTY' field
fields = [name for name in t.schema().names if name not in ('TYPE', 'NAME', 'COUNTY')]
t = t[fields].distinct()
t.PerCapitaIncome.corr(t.Education).execute()
```

    0.7212061029308654

The result `~0.72` means that `Per Capita Income` and `Education` has a
positive correlation in this dataset.

### Conclusions

Ibis is a cool library that can help you in your data analysis tasks. If
you already use pandas, it will be pretty easy to add Ibis in your
workflow!

So \...

-   Are you excited to use Ibis? [Try it out
    now](https://docs.ibis-project.org/getting-started.html)!
-   Have you already used Ibis? Reach out to me,
    [ivan.ogasawara@quansight.com](ivan.ogasawara@quansight.com), and share your experience!
-   Are you interested in contributing to Ibis? Check the [good first
    issues](https://github.com/ibis-project/ibis/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
    label on GitHub!
-   Do you want to add new features and want to fund Ibis? Contact us at
    (info@quansight.com)[info@quansight.com]
