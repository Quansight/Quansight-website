---
title: "Ibis: an idiomatic flavor of SQL for Python programmers"
author: tony-fast
published: June 26, 2020
description: 'Ibis is an alternative approach using databases that relies on Python rather than SQL experience. This post focuses on writing SQL expressions in Python and how to compose queries visually using Ibis.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/d47c33e991c43658e0b328f336af5eb6723531bc.png
  alt: 'Excellent alt-text describing the featured image'
hero:
  imageSrc: /posts/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/d47c33e991c43658e0b328f336af5eb6723531bc.png
  imageAlt: 'Excellent alt-text describing the hero image'
---

![The Ibis project logo, which is a black and white tall bird.](/posts/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/d47c33e991c43658e0b328f336af5eb6723531bc.png)

[Ibis](https://www.ibis-project.org/) is a mature open-source project
that has been in development for about 5 years; it currently has about
1350 stars on Github. It provides an interface to SQL for Python
programmers and bridges the gap between remote storage & execution
systems. These features provide authors the ability to:

1.  write backend-independent [SQL](https://en.wikipedia.org/wiki/SQL)
    expressions in
    [Python](https://en.wikipedia.org/wiki/Python_(programming_language));
2.  access different database connections (eg.
    [SQLite](https://www.sqlite.org/index.html),
    [OmniSci](https://www.omnisci.com/),
    [Pandas](http://pandas.pydata.org/)); and
3.  confirm visually their SQL queries with [directed acyclic graphs
    (DAGs)](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Ibis is an alternative approach using databases that relies on Python
rather than SQL experience. Typically, users have to learn an entirely
new syntax or flavor of SQL to perform simple tasks. Now, those familiar
with Python can avoid a new learning curve by using Ibis for composing
and executing database queries using familiar Python syntaxes (i.e.,
similar to Pandas and Dask). Ibis assists in formation of SQL
expressions by providing visual feedback about each Python object. This
post focuses on writing SQL expressions in Python and how to compose
queries visually using Ibis. We'll demonstrate this with a SQLite
database---in particular, [Sean Lahman's baseball
database](http://www.seanlahman.com/baseball-archive/statistics/).

## Connecting to a database

To get started, we'll need to establish a [database
connection](https://en.wikipedia.org/wiki/Database_connection). Ibis
makes it easy to create connections of different types. Let's go ahead
and do this now with the function
[`ibis.sqlite.connect`](https://docs.ibis-project.org/docs/api.html#sqlite-client)
(in this instance, the database used is a SQLite database):

``` python
%matplotlib inline
import ibis
import pathlib, requests

db_path = pathlib.Path.cwd() / 'lahmansbaseballdb.sqlite'

if not db_path.exists():          # Downloads database if necessary
    with open(db_path, 'wb') as f:
        URL = 'https://github.com/WebucatorTraining/lahman-baseball-mysql/raw/master/lahmansbaseballdb.sqlite'
        req = requests.get(URL)
        f.write(req.content)

client = ibis.sqlite.connect(db_path.name) # Opens SQLite database connection
```

The `client` object represents our connection to the database. It is
essential to use the appropriate Ibis connection---SQLite in this case
constructed through the [`ibis.sqlite`
namespace](https://docs.ibis-project.org/docs/api.html#sqlite-client)---for
the particular database.

This [baseball
database](http://www.seanlahman.com/baseball-archive/statistics/) has 29
distinct tables; we can see by running the following code:

``` python
tables = client.list_tables()
print(f'This database has {len(tables)} tables.')
```

    This database has 29 tables.

## Selecting and visualizing tables

Displaying the list `tables`, gives the names of all the tables which
include, among others, tables with identifiers

``` {python}
[...'appearances'...'halloffame', 'homegames', 'leagues', 'managers',...]
```

Let's use the database connection to extract & examine dataframe
representations of the `halloffame` and `appearances` tables from the
baseball database. To do this, we can invoke the [`table`
method](https://docs.ibis-project.org/docs/generated/ibis.impala.api.ImpalaDatabase.table.html)
associated with the `client` object called with the appropriate names.

``` python
halloffame = client.table('halloffame', database='base')
appearances = client.table('appearances', database='base')
```

At the moment, the objects objects `halloffame` and `appearances` just
constructed don't hold any data; instead, the objects are *expressions*
of type `TableExpr` that represent putative operations applied to the
data. The data itself is inert wherever it's actually located---in this
case, within the SQLite database. We can verify this by examining their
types or by using assertions like this:

``` python
print(f'The object appearances has type {type(appearances).__name__}.')
assert isinstance(halloffame, ibis.expr.types.TableExpr), 'Wrong type for halloffame'
```

    The object appearances has type TableExpr.

We can examine the contents of these Ibis table expressions using the
[`TableExpr.limit`](https://docs.ibis-project.org/docs/generated/ibis.expr.api.TableExpr.limit.html)
or the `TableExpr.head` method (similar to the [Pandas `DataFrame.head`
method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.head.html)).
That is, we can define an object `sample` that represents a sub-table
comprising the first few rows of the `halloffame` table:

``` python
sample = halloffame.head()
print(f'The object sample is of type {type(sample).__name__}')
```

    The object sample is of type TableExpr

Remember, the object `sample` is a `TableExpr` object representing some
SQL query to extracts a sub-table from a larger table. We can view the
actual SQL query corresponding to `sample` by compiling it with the
[`compile`
method](https://docs.ibis-project.org/docs/generated/ibis.expr.api.Expr.compile.html)
and converting the result to a string:

``` python
str(sample.compile())
```

    'SELECT t0."ID", t0."playerID", t0.yearid, t0."votedBy", t0.ballots, t0.needed, t0.votes, t0.inducted, t0.category, t0.needed_note \nFROM base.halloffame AS t0\n LIMIT ? OFFSET ?'

Another useful feature of Ibis is its ability to represent an SQL query
as a [DAG (Directed Acyclic
Graph)](https://en.wikipedia.org/wiki/Directed_acyclic_graph). For
instance, evaluating the object `sample` at the interactive command
prompt yields a visualization of a sequence of database operations:

``` python
sample  # This produces the image below in a suitably enabled shell
```

![A DAG (Directed Acyclic Graph) of an SQLite table pointing at a limit table.](/posts/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/5d2db9528ae260926e1258de124fe156ac24e5ed.png)

This image of a DAG is produced using [Graphviz](https://graphviz.org/);
those familiar with [Dask](https://dask.org/) may have used a similar
helpful feature to assemble [task
graphs](https://docs.dask.org/en/latest/graphviz.html).

Finally, the actual sub-table corresponding to the expression sample can
be extracted using the [`execute`
method](https://docs.ibis-project.org/docs/generated/ibis.expr.api.Expr.execute.html)
(similar to
[`compute`](https://docs.dask.org/en/latest/api.html#dask.compute) in
[Dask](https://docs.dask.org)). The result returned by executing the
expression sample is a
[tidy](https://vita.had.co.nz/papers/tidy-data.pdf) [Pandas
`DataFrame`](https://pandas.pydata.org/docs/reference/frame.html)
object.

``` python
result = sample.execute()
print(f'The type of result is {type(result).__name__}')
result    # Leading 5 rows of halloffame table)
```

    The type of result is DataFrame

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
      <th>ID</th>
      <th>playerID</th>
      <th>yearid</th>
      <th>votedBy</th>
      <th>ballots</th>
      <th>needed</th>
      <th>votes</th>
      <th>inducted</th>
      <th>category</th>
      <th>needed_note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>cobbty01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226</td>
      <td>170</td>
      <td>222</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>ruthba01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226</td>
      <td>170</td>
      <td>215</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>wagneho01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226</td>
      <td>170</td>
      <td>215</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>mathech01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226</td>
      <td>170</td>
      <td>205</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>johnswa01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226</td>
      <td>170</td>
      <td>189</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
  </tbody>
</table>
</div>
```

A similar extraction of the leading five rows from the `appearances`
table (in one line) gives the following table with 23 columns:

``` python
appearances.head().execute()  # Leading 5 rows of appearances table)
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
      <th>ID</th>
      <th>yearID</th>
      <th>teamID</th>
      <th>team_ID</th>
      <th>lgID</th>
      <th>playerID</th>
      <th>G_all</th>
      <th>GS</th>
      <th>G_batting</th>
      <th>G_defense</th>
      <th>...</th>
      <th>G_2b</th>
      <th>G_3b</th>
      <th>G_ss</th>
      <th>G_lf</th>
      <th>G_cf</th>
      <th>G_rf</th>
      <th>G_of</th>
      <th>G_dh</th>
      <th>G_ph</th>
      <th>G_pr</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>1871</td>
      <td>TRO</td>
      <td>8</td>
      <td>NA</td>
      <td>abercda01</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>1871</td>
      <td>RC1</td>
      <td>7</td>
      <td>NA</td>
      <td>addybo01</td>
      <td>25</td>
      <td>25</td>
      <td>25</td>
      <td>25</td>
      <td>...</td>
      <td>22</td>
      <td>0</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>1871</td>
      <td>CL1</td>
      <td>3</td>
      <td>NA</td>
      <td>allisar01</td>
      <td>29</td>
      <td>29</td>
      <td>29</td>
      <td>29</td>
      <td>...</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>29</td>
      <td>0</td>
      <td>29</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>1871</td>
      <td>WS3</td>
      <td>9</td>
      <td>NA</td>
      <td>allisdo01</td>
      <td>27</td>
      <td>27</td>
      <td>27</td>
      <td>27</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>1871</td>
      <td>RC1</td>
      <td>7</td>
      <td>NA</td>
      <td>ansonca01</td>
      <td>25</td>
      <td>25</td>
      <td>25</td>
      <td>25</td>
      <td>...</td>
      <td>2</td>
      <td>20</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 23 columns</p>
</div>
```

## Filtering and selecting data

As mentioned earlier, Ibis uses familiar Pandas syntax to build SQL
queries. As an example, let's look at the various kinds of entries in
the `category` column from the `halloffame` table. A nice way to do this
is to extract the relevant column with attribute access and apply the
[`value_counts`
method](https://docs.ibis-project.org/docs/generated/ibis.expr.api.ColumnExpr.value_counts.html).
Remember, an invokation of `execute` is needed to realize the actual
expression.

``` python
halloffame.category.value_counts().execute()
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
      <th>category</th>
      <th>count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Manager</td>
      <td>74</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Pioneer/Executive</td>
      <td>41</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Player</td>
      <td>4066</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Umpire</td>
      <td>10</td>
    </tr>
  </tbody>
</table>
</div>
```

There are four different types of entries in this column, most of which
are `Player`s. To illustrate filtering and selection, we'll create a
expression `condition` of boolean values corresponding to rows from the
`halloffame` table in which the `category` column has the value
`Player`. The boolean values represented by `condition` can be extracted
from the table `halloffame` using brackets. The final result is bound to
the identifier `players`.

``` python
condition = halloffame.category == 'Player'
players = halloffame[condition]
```

``` python
players.execute() # take a look at this table
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
      <th>ID</th>
      <th>playerID</th>
      <th>yearid</th>
      <th>votedBy</th>
      <th>ballots</th>
      <th>needed</th>
      <th>votes</th>
      <th>inducted</th>
      <th>category</th>
      <th>needed_note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>cobbty01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226.0</td>
      <td>170.0</td>
      <td>222.0</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>ruthba01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226.0</td>
      <td>170.0</td>
      <td>215.0</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>wagneho01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226.0</td>
      <td>170.0</td>
      <td>215.0</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>mathech01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226.0</td>
      <td>170.0</td>
      <td>205.0</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>johnswa01</td>
      <td>1936</td>
      <td>BBWAA</td>
      <td>226.0</td>
      <td>170.0</td>
      <td>189.0</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>4061</th>
      <td>4187</td>
      <td>lidgebr01</td>
      <td>2018</td>
      <td>BBWAA</td>
      <td>422.0</td>
      <td>317.0</td>
      <td>0.0</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4062</th>
      <td>4188</td>
      <td>millwke01</td>
      <td>2018</td>
      <td>BBWAA</td>
      <td>422.0</td>
      <td>317.0</td>
      <td>0.0</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4063</th>
      <td>4189</td>
      <td>zambrca01</td>
      <td>2018</td>
      <td>BBWAA</td>
      <td>422.0</td>
      <td>317.0</td>
      <td>0.0</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4064</th>
      <td>4190</td>
      <td>morrija02</td>
      <td>2018</td>
      <td>Veterans</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4065</th>
      <td>4191</td>
      <td>trammal01</td>
      <td>2018</td>
      <td>Veterans</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
    </tr>
  </tbody>
</table>
<p>4066 rows × 10 columns</p>
</div>
```

## Joining Ibis tables

If we want a single view of the `halloffame` players and their
appearances, we need to [join](https://en.wikipedia.org/wiki/Join_(SQL))
the tables `halloffame` and `appearances`. To do this, we'll perform an
[inner
join](https://stackoverflow.com/questions/38549/what-is-the-difference-between-inner-join-and-outer-join)
based on the `playerID` columns of our `players` & `appearances` tables.

``` python
condition = players.playerID == appearances.playerID
```

We notice that both the `players` and the `appearances` tables each have
a column labelled `ID`. This column needs to be excluded from
`appearances`; otherwise the overlapping columns will corrupt the
computed join. Specifically, we want to filter out the `ID` and
`playerID` columns from the `appearances` table. One strategy to do this
is to use a list comprehension.

``` python
columns = [col for col in appearances.columns if col not in ('playerID', 'ID')]
```

Now, we use the [`TableExpr.join`
method](https://docs.ibis-project.org/docs/generated/ibis.expr.api.TableExpr.join.html#ibis.expr.api.TableExpr.join)
to compute an inner join of the `players` table and the filtered
`appearances` table; the result is bound to the identifier
`unmaterialized`.

``` python
unmaterialized = players.join(appearances[columns], condition)
```

## Materializing the join

We used the identifier `unmaterialized` just above to emphasize that the
resulting expression is *not* a [materialized
view](https://en.wikipedia.org/wiki/Materialized_view) (that would be
required to build new expressions). Without a materialized view, Ibis
raises an exception (as demonstrated here).

``` python
try:
    unmaterialized.distinct()
except Exception as e:
    print('Unable to execute "unmaterialized.distinct()"')
    print(repr(e))
```

    Unable to execute "unmaterialized.distinct()"
    IbisError('Table operation is not yet materialized')

The [`distinct`
method](https://docs.ibis-project.org/docs/generated/ibis.expr.api.TableExpr.distinct.html#ibis.expr.api.TableExpr.distinct)
in the preceding code behaves like the [Pandas
`DataFrame.drop_duplicates`
method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html),
i.e., it drops duplicated rows. We can obtain such a materialized view
to circumvent the exception above using the expression's `materialize`
method.

``` python
join = unmaterialized.materialize().distinct()
```

The code above completes the join and binds the resulting expression to
the materialized object `join`; here is a sample of the leading five
rows of our joined data (notice the result has 31 columns).

``` python
join.head().execute()
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
      <th>ID</th>
      <th>playerID</th>
      <th>yearid</th>
      <th>votedBy</th>
      <th>ballots</th>
      <th>needed</th>
      <th>votes</th>
      <th>inducted</th>
      <th>category</th>
      <th>needed_note</th>
      <th>...</th>
      <th>G_2b</th>
      <th>G_3b</th>
      <th>G_ss</th>
      <th>G_lf</th>
      <th>G_cf</th>
      <th>G_rf</th>
      <th>G_of</th>
      <th>G_dh</th>
      <th>G_ph</th>
      <th>G_pr</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2861</td>
      <td>aaronha01</td>
      <td>1982</td>
      <td>BBWAA</td>
      <td>415</td>
      <td>312</td>
      <td>406</td>
      <td>Y</td>
      <td>Player</td>
      <td>None</td>
      <td>...</td>
      <td>16</td>
      <td>0</td>
      <td>15</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3744</td>
      <td>abbotji01</td>
      <td>2005</td>
      <td>BBWAA</td>
      <td>516</td>
      <td>387</td>
      <td>13</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
      <td>...</td>
      <td>16</td>
      <td>0</td>
      <td>15</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>147</td>
      <td>adamsba01</td>
      <td>1937</td>
      <td>BBWAA</td>
      <td>201</td>
      <td>151</td>
      <td>8</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
      <td>...</td>
      <td>16</td>
      <td>0</td>
      <td>15</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>260</td>
      <td>adamsba01</td>
      <td>1938</td>
      <td>BBWAA</td>
      <td>262</td>
      <td>197</td>
      <td>11</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
      <td>...</td>
      <td>16</td>
      <td>0</td>
      <td>15</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>385</td>
      <td>adamsba01</td>
      <td>1939</td>
      <td>BBWAA</td>
      <td>274</td>
      <td>206</td>
      <td>11</td>
      <td>N</td>
      <td>Player</td>
      <td>None</td>
      <td>...</td>
      <td>16</td>
      <td>0</td>
      <td>15</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 31 columns</p>
</div>
```

Ibis supports other join strategies as methods of the class `TableExpr`.
The following list comprehension shows us what they are.

``` python
[method_name for method_name in dir(players) if 'join' in method_name]
```

    ['anti_join',
     'any_inner_join',
     'any_left_join',
     'asof_join',
     'cross_join',
     'inner_join',
     'join',
     'left_join',
     'outer_join',
     'semi_join']

## Executing an expression

We'll now expand the expression `join` as a Pandas DataFrame object.
We'll use this DataFrame to answer the following question:

```{=html}
<center>
How many pitchers have been inducted into the hall of fame?
</center>
```
Some of the \"hitters\" have also been \"pitchers\", so we'll need to
filter out rows corresponding to those appearances from the table
`join`. That is, to identify a specific player as a \"pitcher\", we'll
choose those players who played *mostly* as pitchers; in particular,
we'll take 100 games as an arbitrary threshold between pitchers and
non-pitchers. The column `G_p` from the table `join` represents the
numbers of games a player played as a pitcher; the desired filtering
expression, then, is as follows:

``` python
pitchers = join[join.G_p > 100]
```

Next, we group the `pitchers` table based on a specific pair of columns
(stored as a list `cols`) and then count them annually using a `groupby`
with a `count` aggregation.

``` python
cols = [pitchers.inducted, pitchers.yearID]
grouped_pitchers = pitchers.groupby(cols).count()
```

The expression `grouped_pitchers` is still an Ibis `TableExpr`; as
we've seen several times now, it can be realized as a Pandas DataFrame
using the `execute` method. The resulting DataFrame's index can be set
as a multi-index using the `inducted` and `yearID` columns.

``` python
df = grouped_pitchers.execute().set_index('inducted yearID'.split())
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
      <th></th>
      <th>count</th>
    </tr>
    <tr>
      <th>inducted</th>
      <th>yearID</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th rowspan="5" valign="top">N</th>
      <th>1936</th>
      <td>105</td>
    </tr>
    <tr>
      <th>1937</th>
      <td>106</td>
    </tr>
    <tr>
      <th>1938</th>
      <td>114</td>
    </tr>
    <tr>
      <th>1939</th>
      <td>99</td>
    </tr>
    <tr>
      <th>1942</th>
      <td>67</td>
    </tr>
    <tr>
      <th>...</th>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th rowspan="5" valign="top">Y</th>
      <th>2014</th>
      <td>3</td>
    </tr>
    <tr>
      <th>2015</th>
      <td>4</td>
    </tr>
    <tr>
      <th>2016</th>
      <td>2</td>
    </tr>
    <tr>
      <th>2017</th>
      <td>3</td>
    </tr>
    <tr>
      <th>2018</th>
      <td>6</td>
    </tr>
  </tbody>
</table>
<p>150 rows × 1 columns</p>
</div>
```

The dataframe `df` has counts of the number of pitchers who were
(`inducted` index `'Y'`) and were not (`inducted` index `'N'`) inducted
into the baseball Hall of Fame in a given year. We'll pull in all the
relevant counts of inductees into a dataframe `count_inducted_pitchers`.
Notice the use of the Pandas `DataFrame.fillna` method to assign 0s in
rows appropriately (i.e., reflecting that no pitchers were inducted into
the Hall of Fame in those years).

``` python
count_inducted_pitchers = df.loc['Y'].fillna(0).rename({'count':'Inducted pitchers'})
count_inducted_pitchers
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
      <th>count</th>
    </tr>
    <tr>
      <th>yearID</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1936</th>
      <td>5</td>
    </tr>
    <tr>
      <th>1937</th>
      <td>3</td>
    </tr>
    <tr>
      <th>1938</th>
      <td>1</td>
    </tr>
    <tr>
      <th>1939</th>
      <td>7</td>
    </tr>
    <tr>
      <th>1942</th>
      <td>1</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>2014</th>
      <td>3</td>
    </tr>
    <tr>
      <th>2015</th>
      <td>4</td>
    </tr>
    <tr>
      <th>2016</th>
      <td>2</td>
    </tr>
    <tr>
      <th>2017</th>
      <td>3</td>
    </tr>
    <tr>
      <th>2018</th>
      <td>6</td>
    </tr>
  </tbody>
</table>
<p>76 rows × 1 columns</p>
</div>
```

The Pandas `DataFrame` & `Series` classes have a convenient plotting
interface. We'll use a dictionary `options` to specify keyword
arguments to tidy the final invokation of
[`plot.bar`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.bar.html).

``` python
options = dict(figsize=(15, 5), grid=True, legend=None)
count_inducted_pitchers.plot.bar(**options);
```

![A bar plot. The X axis ranges from 1937 to 2018. Y axis ranged from - to 8.](/posts/ibis-an-idiomatic-flavor-of-sql-for-python-programmers/7caaeda319436dc88038861ff8ee72bc5bdd140e.png)

## What next?

That's it! In future posts, we'll explore other backends and visualize
more Ibis objects. If you'd like to contribute to Ibis, please take a
look at [Ibis contributing
guide](https://docs.ibis-project.org/contributing.html) and
[OpenTeams](https://openteams.com/).

