---
title: 'Scaling Python: Banking Edition'
published: March 28, 2023
author: andrew-fulton
description: 'In this post, we walk you through how Quansight helped a banking client through the process of scaling a Python data computation in a real life scenario.'
category: [Scalable Computing, Optimization, Data Engineering]
featuredImage:
  src: /posts/scaling-python-banking-edition/header.png
  alt: 'summing dataframes visualization'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

This post is based off of a talk given at PyData NYC 2022. You can
watch the talk here: [Scaling Python: Bank
Edition](https://www.youtube.com/watch?v=tbqgsM6iGng).

Often scaling a distributed computation is easy until it isn't. There
are currently several tools that will get you off the ground quickly,
but when the size of your data increases and you are required to scale
further, the complexity needed for a solution often increases
considerably as well. At this point, algorithm- and
infrastructure-dependent requirements will likely preclude
experimentation and problem solving. While new tools are continuously
emerging that promise straightforward hyper-scaling, in most
situations there are at least a few confounding details that have to
be ironed out manually.

In this post, we walk you through how Quansight helped a banking
client through this process of scaling Python DataFrame calculations
in a real-life scenario.

## Problem Overview

For this project, we were tasked with deploying a large scale data processing
pipeline for running valuation adjustment models using open source tools from
the PyData ecosystem. We were given 140,000 simulation files, each around 140 MB,
totaling about 20 TB. The data was stored in flat parquet files with columns
`path`, `Date`, and `value`. Each file contained 50,000 simulations, where each
simulation spanned the same set of 120 non-sequential dates into the future
(resulting in 6 million rows of data per file).

Each file belonged to a particular file group, with the size of each file group
ranging from 2 to 18,000 files. Our goal was to sum the `value` entries in all
of the files within each file group over each unique (`path`, `Date`)
combination. We needed to do this very quickly, to allow generation of results
in as close to real time as possible. To complicate the problem, we had to be
able to accomplish this while accounting for potentially limited compute
resources.

<img
src="/posts/scaling-python-banking-edition/introduction-img-1.png"
alt="Three dataframes stacked on top of each other. Each dataframe has index named path with values ranging from 0-49,999. Each has two columns. The first is named Date. The second column is labeled value. The dataframes are labeled File 1, File 2, ..., File N. to the right of the stacked dataframes is an arrow with the text sum inside of it. To the right of the arrow is another dataframe representing the sum of the three dataframes by path and date."
/>

## Considering GPUs

To solve this problem we first explored what hardware options were
available to us. Specifically, as we were basically doing matrix
summations on a large scale, we were curious if GPUs could be a good
fit for our problem.

There were several reasons why we considered using GPU hardware. We thought that
trying different GPU tools could help us speed up our computation, as we would
be performing the same operation across many different elements. Second, we
thought that using GPUs might be able to help us reduce networking bottlenecks.
We wondered whether, if we could speed up our operations enough, that we could
make up for the I/O bottlenecks that we were facing. Finally, GPUs could help us
in optimizing for-loop operations. We would be able to set up our computation
using n-D arrays and for loops alongside striding to reduce the amount of memory
used at one time.

### Tools We Explored

We explored several different libraries that use a GPU compute engine
as their back-end. Several of these were from the RAPIDS stack. We
also explored TensorFlow and PyTorch, but found that these were more
suited to machine learning-specific tasks than what our problem called
for. The RAPIDS stack libraries that we explored were cuDF, CuPy, and
blazing-SQL (though that has now been deprecated in favor of Dask SQL).
Another tool that we tried was HEAVY.AI, formerly OmniSci. While
HEAVY.AI was fast, it could not handle simultaneous read/write, which
was a showstopper for us.

### The "pyGPU-cuda" Algorithm

GPU architecture lends itself to a pattern that many of these tools rely on.
First, metadata is used to to determine the maximum threads per block and blocks
per grid. Then, the data is loaded into GPU memory using this information and
the computation is run using one of the above tools. Finally, the data is
extracted back to the host. For more background on techniques for memory
swapping between main RAM and GPU-RAM, see this
[NVIDIA blog post][nvidia mem swapping post].

<img
src="/posts/scaling-python-banking-edition/pygpu-cuda-algorithm.png"
alt="An image representing a flow diagram of the pyGPU-cuda algorith."
/>

Unfortunately, what we ended up finding was that copying the data back
and forth between the host's memory and the GPU memory turned out to
be rather expensive. It was expensive enough, in fact, to mitigate a lot
of the benefits we saw in the speedup of the computation itself. On
top of that, the increased cost of GPU-available cloud instances made
the usage of GPUs infeasible for this project. With
that in mind, we decided to focus on good, old distributed CPU
architecture for our computation.

## Dataframe Aggregation

With our decision made to use a distributed CPU architecture, we
started looking at ways we could implement Dask to solve the problem. We
choose Dask due to its native Python implementation and its
utilization of standard Python APIs. This makes it easy to test code
in pandas or numpy and then quickly distribute the code using Dask,
with only slight changes. The first approach we tried was
a simple dataframe group-by.

### Group-by

We thought that the dataframe approach made sense due to the ease of
implementation: we could simply take a list of Parquet files and pass
that list to the Dask dataframe’s `read_parquet()` function. We would then run
the `groupby()` method on the loaded dataframe and take the sum of the resulting
group-by object. Below is an example of this code and an image of the dask dashboard after successfully running the above code. You can see that the work has run without error across 2 workers each allocated with 2 threads.

```python
def build_graph(paths):
    df = dd.read_parquet(paths,
                         index=False,
                         storage_options=storage_options)
    gb = df.groupby(['path', 'Date']).sum()
    return gb


graph = build_graph(paths_5)
fut = client.compute(graph)
fut.result().info()
```

<img
src="/posts/scaling-python-banking-edition/dd-groupby-dask-dashboard.png"
alt="A picture of a jupyter notebook input and output cells, next to an image of the cell contents equivilent dask graph being run"
width="700px"
/>

However, as we noted earlier, we couldn't guarentee the resources available to the cluster. What happens if our dataframe is larger than the cluster itself?

As it turns out, we ran into this issue with some of our larger
aggregations. We were finding that when we submitted jobs, workers
would be forced to pause or restart when the memory thresholds for the
cluster were reached, in some cases causing the job to fail.

```python
>>> graph = build_graph(paths_10)
>>> fut = client.compute(graph)
>>> fut.result().info()

2023-03-31 18:58:33,630 - distributed.worker_memory - WARNING - Worker is at 83% memory usage. Pausing worker.  Process memory: 3.33 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 18:58:33,792 - distributed.worker_memory - WARNING - Worker is at 76% memory usage. Resuming worker. Process memory: 3.07 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 18:58:33,893 - distributed.worker_memory - WARNING - Worker is at 89% memory usage. Pausing worker.  Process memory: 3.60 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 18:58:33,934 - distributed.worker_memory - WARNING - Worker exceeded 95% memory budget. Restarting
2023-03-31 18:58:33,977 - distributed.nanny - WARNING - Restarting worker
2023-03-31 18:58:51,739 - distributed.worker_memory - WARNING - Worker is at 86% memory usage. Pausing worker.  Process memory: 3.46 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 18:58:52,334 - distributed.worker_memory - WARNING - Worker exceeded 95% memory budget. Restarting
2023-03-31 18:58:52,376 - distributed.nanny - WARNING - Restarting worker
---------------------------------------------------------------------------
KilledWorker                              Traceback (most recent call last)
File <timed exec>:3

File ~/.conda/envs/bank/lib/python3.8/site-packages/distributed/client.py:283, in Future.result(self, timeout)
    281 if self.status == "error":
    282     typ, exc, tb = result
--> 283     raise exc.with_traceback(tb)
    284 elif self.status == "cancelled":
    285     raise result

KilledWorker: ("('dataframe-groupby-sum-chunk-d4e753da53a3eff842bab7cbba152105-e7aebcddb75c44615a5bb2eb1e6f9433', 82)", <WorkerState 'tcp://127.0.0.1:42571', name: 1, status: closed, memory: 0, processing: 39>)
```

<img
src="/posts/scaling-python-banking-edition/dd-larger-than-cluster-dask.png"
alt="An image of the dask dashboard with the results a dask graph representing the code above and the resulting run failing."
/>

The above code shows an example of this happening. In this example I
used a Dask cluster with 2 workers, each with 4 GB of memory, and I get a
'killed worker' error when I try to aggregate ten 6,000,000-row files. Likewise, the dask dashboard image on the left shows new workers getting started after the workers are killed. If this ran as expected. We would expect the task stream diagram to have 4 rows. 1 for each thread on each worker. Instead, we several rows showing new workers starting and trying to run the remaining jobs before failing. The graph on the right shows the dask graph for this task, demonstrating how the various groups are aggregated together.

(Author's Note: In this example, I am using an older version
of Dask. This problem is becoming less of an issue as improvements to
the Dask scheduler are released. I am not able to reproduce this error
on the same aggregation if I use a more recent version of Dask. This
was however something we had to address at the time we were executing the project.)

### Chunking Dataframe Group-by Operations

In order to address this out of memory error, we used a chunking
strategy. We found that if we created a graph that chunks the group-by
into smaller aggregations, the scheduler would have an easier time
handling the load.

The chunking strategy was as follows. For a given set of files, if
the set of files met a specific threshold, we would build a Dask graph
that would first load a subset of the files. Next it would group and
aggregate the subset into a single dataframe. Then, for each subsequent
subset, the new set would be concatenated with the previously
aggregated results. The resulting dataframe would then be further grouped and
aggregated as many times as required until all files were aggregated together.

In cases where there were not enough files to meet the threshold, we would
follow the standard `read_parquet()`, `groupby()`, and `sum()` strategy, without
any intermediate subset calculations and aggregations.

```python
%%time

def build_graph(paths, batch_cutoff=10, n_per=5):
    df = None
    if len(paths) >= batch_cutoff:
        for x in range(0, len(paths), n_per):
            ps = paths[x:x+n_per]
            sub = dd.read_parquet(ps,
                                  index=False,
                                  storage_options=storage_options)
            if df is not None:
                sub = dd.concat([sub, df])
            sub = sub.groupby(['path', 'Date'])
            sub = sub.sum()
            df = sub
    else:
        df = dd.read_parquet(paths, index=False, storage_options=storage_options)
        df = df.groupby(['path', 'Date']).sum()
    return df


graph = build_graph(paths_10, batch_cutoff=5, n_per=2)
fut = client.compute(graph)
fut.result().info()
```

<img
src="/posts/scaling-python-banking-edition/dd-chunking-dask-graph.png"
alt="The dask graph built by the code above."
/>

The above image is a schematic of the chunked calculate-and-aggregate
strategy used for one large dataset.

With this strategy, we were able process our largest aggregation
sets, but we still had a lot of aggregations to do and we wanted to
run them as quickly as possible. This is where we started seeing the next
set of problems. The strategy laid out so far allowed us to
complete any of our aggregations on an individual basis. But when
submitting thousands of aggregations at a time, some of which were
larger than the cluster itself, we again ran into our original
problem. Workers were frequently running out of memory and either
pausing or, worse, getting killed. This caused a lot of work to be
duplicated or error out completely.

```python
>>> [len(group) for group in small_path_groups]
[20, 15, 15, 10, 10, 10, 5, 4, 4, 2, 3, 2]
```

```python
>>> graphs = []
>>> for path_group in small_path_groups:
...    graphs.append(build_graph(path_group, batch_cutoff=9, n_per=5))

>>> futs = client.compute(graphs)
>>> wait(futs)

2023-03-31 19:16:02,371 - distributed.worker_memory - WARNING - Unmanaged memory use is high. This may indicate a memory leak or the memory may not be released to the OS; see https://distributed.dask.org/en/latest/worker.html#memtrim for more information. -- Unmanaged memory: 2.62 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 19:16:13,723 - distributed.worker_memory - WARNING - Unmanaged memory use is high. This may indicate a memory leak or the memory may not be released to the OS; see https://distributed.dask.org/en/latest/worker.html#memtrim for more information. -- Unmanaged memory: 2.67 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 19:19:15,364 - distributed.worker_memory - WARNING - Unmanaged memory use is high. This may indicate a memory leak or the memory may not be released to the OS; see https://distributed.dask.org/en/latest/worker.html#memtrim for more information. -- Unmanaged memory: 2.77 GiB -- Worker memory limit: 4.00 GiB

 ...

2023-03-31 19:40:35,851 - distributed.worker_memory - WARNING - Unmanaged memory use is high. This may indicate a memory leak or the memory may not be released to the OS; see https://distributed.dask.org/en/latest/worker.html#memtrim for more information. -- Unmanaged memory: 2.66 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 19:40:36,265 - distributed.utils_perf - WARNING - full garbage collections took 33% CPU time recently (threshold: 10%)
2023-03-31 19:40:36,384 - distributed.worker_memory - WARNING - Unmanaged memory use is high. This may indicate a memory leak or the memory may not be released to the OS; see https://distributed.dask.org/en/latest/worker.html#memtrim for more information. -- Unmanaged memory: 2.70 GiB -- Worker memory limit: 4.00 GiB
2023-03-31 19:40:38,542 - distributed.utils_perf - WARNING - full garbage collections took 20% CPU time recently (threshold: 10%)
2023-03-31 19:40:39,007 - distributed.utils_perf - WARNING - full garbage collections took 23% CPU time recently (threshold: 10%)

DoneAndNotDoneFutures(done={<Future: error, key: finalize-e92147f1de33377e5d699b9a433833ce>, <Future: error, key: finalize-84b8df9a83cf66156a75066a2ac1e76d>, <Future: finished, type: pandas.core.frame.DataFrame, key: finalize-ab97ef0c5f1a508ff7794c880dc52904>, <Future: error, type: pandas.core.frame.DataFrame, key: finalize-fa12a3d29b570a5c9fde46ad4bb4b54e>, <Future: error, key: finalize-27d9405ba12f958c13d758e631561dc1>, <Future: error, key: finalize-62c1aac7865d455c15c608feb900b359>, <Future: finished, type: pandas.core.frame.DataFrame, key: finalize-0736bf3a3c1b701cf111a7602b94688f>, <Future: finished, type: pandas.core.frame.DataFrame, key: finalize-e7a25f8b5dec897b1324baeb1058e0ae>, <Future: error, key: finalize-04ea3d501751890ece2130a20efc5dba>, <Future: error, key: finalize-d7140f09799374ca916b3cbb28816323>, <Future: error, key: finalize-89541c92fdaf68ded72329388778eadf>, <Future: error, key: finalize-0dde02417f66f47d1f389e64ee5fb966>}, not_done=set())
```

### Throttling Dask Graph Submission

To combat this, we decided to throttle how much work we were going to
give the scheduler at a time. To do this we employed a thread-pool
executor to submit the jobs. This would allow us to submit many jobs
at once but still limit how much work was getting released to the
scheduler. Each scheduled job would get a thread worker, and the job would hold
a place in the pool until it was complete, after which the
thread-pool would grab the next job and schedule it.

However, we were still running into problems with overwhelming the cluster. One
option that might work for some situations is lowering the number of thread
workers, but this wasn't helpful for us. We had some jobs that were
individually larger than the cluster could handle, even after chunking. This
meant that we were still overloading the cluster when these large jobs were
scheduled, and the rest of the time the cluster was significantly underutilized,
making for poor efficiency and economy.

So, instead of lowering the number of thread-workers in our
thread-pool, we started checking the cluster resources manually with
the Dask scheduler before submitting each job to make sure there was
enough memory to accommodate it. This strategy gave us the benefit of being able to increase the
number of thread-pool workers for better cluster utilization for smaller
aggregations, while also allowing us to throttle the amount of
submissions when we needed to. To implement this, we set it up so
that when a thread-pool worker got a new task, we would:

1. Estimate the required maximum resources the task requires.

   - This calculation was essentially just the number of files in the task
     multiplied by the estimated average file size.

1. Activate a thread-lock so only one thread at a time could check cluster status
   and submit a job.

   - This prevents a race condition that would allow multiple thread-pool workers
     to check cluster status at the same time and receive misleading statistics
     about cluster utilization.

1. Check cluster resources.
1. If sufficient resources are _not_ available, the thread sleeps for a period of time and then rechecks the cluster resources.
1. Once sufficient resources are available, submit the task to the Dask
   scheduler.
1. Wait briefly to allow the job to start.
1. Release the thread-lock to allow other workers to continue their work.

```python
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed
from threading import Lock
from time import sleep

def build_graph(paths, batch_cutoff=10, n_per=5):
    ...
    return df

def good_to_go(needed_bytes_gb, submitted_task_cutoff=20):
    # returns is cluster has available resources
    # percent of cluster in use
    ...
    return bool, percent_use

lock = Lock()

def compute_task(graph, num_paths):
    max_size = num_paths * 200 / 1000
    go_ahead = False
    while not go_ahead:
        with lock:
            go_ahead, cluster_usage = good_to_go(max_size)
            sleep_mult = (cluster_usage * 2) ** 1.5
            if go_ahead:
                fut = client.compute(graph)
                sleep(sleep_mult)
    wait(fut)
    return fut

def creator(paths):
    n_paths = len(paths)
    graph = build_graph(paths, batch_cutoff=9, n_per=5)
    return graph, n_paths

def submit_via_threadpool(graphs):
    results = []
    with ThreadPoolExecutor(max_workers=1) as creation_executor:
        with ThreadPoolExecutor(max_workers=6) as submission_executor:
            for (graph, n_paths) in creation_executor.map(creator, small_path_groups):
                result = submission_executor.submit(compute_task, graph, n_paths)
                results.append(result)
    for fut in as_completed(results):
        print(fut.result())
    return result
```

<img
src="/posts/scaling-python-banking-edition/throttling.png"
alt="An image of the above code being run as represented by the dask dashboard."
/>

Above the dask dashboard demonstrates this strategy successfully working. We can see how different tasks are running both in parallel and consecutevely as resources become. Some begin immediately, and then as they finish and the resources are freed, new tasks begin. This happens until all work is complete.

This strategy was starting to get us closer. We now had a little more
leeway to increase thread-pool workers for better cluster utilization,
but it was still taking time to create the graphs in the first place,
and we didn’t have complete reliability with our larger aggregations.

So, with that in mind we created a second thread-pool executor. This
thread-pool was responsible for creating the Dask graphs for each
aggregation group. It would then pass off each Dask graph to the next
thread-pool for submission to the cluster. With the larger aggregation
groups we found we could submit them via the creation thread-pool
where they would throttle the amount of new graphs being created
leaving the cluster resources free.

With this strategy, we could reliably complete large batches of
jobs, and we could do so while utilizing the cluster fairly
efficiently. However there were still downsides. We were finding that tuning
the thread-pool executors was tedious. It took work to figure out the
number of threads per thread-pool, along with the appropriate sleep
calls and thread-locking. It also wasn't a one-size-fits-all
strategy, as different workloads needed different settings. All of this made for a
complex setup which was far from ideal. Furthermore, the data
shuffling and group-by operations continued to be expensive across a
large cluster.

### Dataframe Summation

At this point, we started feeling like we were reaching the limits of
our multi-threaded group-by strategy. It
was becoming clear that our code was too complex
and not very efficient. We realized that the more we continued down this path,
the more technical debt we were going to accrue and the harder the project would be to manage. So we began
to think of other ways we could aggregate the data.

In the course of this process, we realized that pandas dataframe actually sum together
quite nicely: pandas ensures that the index and columns match on the
sums, so you won’t end up adding the wrong numbers together. Pandas sums are also considerably
faster than group-by operations. As another bonus, moving out of Dask
dataframes would allow us to utilize multi-indexing, which helps cut down on the
memory footprint of the dataframes. We found that on our
dataset, summing our re-indexed dataframe was about 3 times faster
than running a group-by operation on the equivalent concatenated
dataframe.

```python
>>> %timeit concated_list_of_dfs.groupby(['path', 'Date']).sum()
1.77 s ± 72.3 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
```

<img
src="/posts/scaling-python-banking-edition/groupby_sum_diagram.png"
alt="An image of a dataframe that shows the before and after of an groupby operation."
/>

```python
>>> %timeit concated_list_of_dfs.groupby(['path', 'Date']).sum()
1.77 s ± 72.3 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
```

<img
src="/posts/scaling-python-banking-edition/df_list_sum.png"
alt="An image of a dataframe that shows the before and after diagram for summing a list of dataframes."
/>

**_!!!! (What's the difference between the two figures above? Why are both of these figures included? If they're showing two different things, that difference needs to be explained. If they're both showing basically the same thing, then one figure can be removed. Also, the two code snippets look identical—should they be different?) !!!!_**

While these performance improvements were promising, we were still having a bit of trouble with getting the dataframes to
the right place at the right time. **_!! (What does this mean? What is the 'right place', and what is the 'right time'?) !!_**

We also wanted our
architecture to exploit any parallelization opportunities among
the different aggregation groups. Ideally, we wanted to run an
aggregation group on a single worker whenever feasible, to cut down on
network traffic on the cluster. With that in mind we started looking
at a cluster-of-clusters approach.

### Cluster-of-Clusters

We based our cluster-of-clusters implementation off of a [keynote at
the 2021 Dask
Summit][cluster of clusters keynote]. With
this setup, you have a normal Dask distributed cluster with a
scheduler and a set of workers. Instead of passing your work directly
to the scheduler as normal, though, you pass delayed objects that
instruct the worker to start a local cluster and also to build a
specific Dask graph to be passed to that local cluster. Submitting work
in this way gives the benefit of being able to encapsulate a work unit
in order to reduce the overall network communication. However, at this
point we were still using thread-pools to manage the aggregation on
the local clusters, requiring the same cumbersome manual tuning as before. So, from here we decided
to pivot away from the aggregation strategy to a different approach.

<img
src="/posts/scaling-python-banking-edition/cluster-of-clusters.png"
width="400px"
alt="A diagram showing how cluster-of-clusters works. It contains a box with the text Outer Dask Cluster. Inside there are 4 boxes, 1 on the left and three on the right. There multi directional arrows between the box on the left and the boxes on the right. Each box is labeled 'K8s Node'. The box on the left encapsulates another box with the text Dask Scheduler. Each box on the right encapsulates a box with the text Dask Worker. That box encapsulates another box with the text Dask LocalCluster"
/>
&nbsp; &nbsp; _(k8s = Kubernetes)_

### Dask Bag and Resource Annotations

At this point, we started looking more seriously into Dask Bag. Dask Bag
is typically used for processing text or JSON files, so it’s probably
not the first thing people think of when they need to work with
dataframes. One of the big advantages of Dask Bag, though, is that it
follows the map-reduce model. It allows us to take a more hands-off
approach to managing the calculations because we can trust that it will reduce our data on each
individual worker as much as possible before moving data between
workers to finish the aggregations. We also made sure to define a
`partition_size`, which is the number of units included in each
reduction. Next we mapped `load_dataframe` to our our sequence of
file-paths and finally we sum it. When the Dask Bag object is
submitted, Dask will send batches of files as defined by `partition_size`
to the workers. The workers will then apply the mappings and the
aggregation to each batch. Finally, the workers will re-partition
and apply the mappings and aggregation across the batches until the
dataset is fully aggregated.

```python
def load_dataframe(data):
    df = pd.read_parquet(
        data,
        storage_options=storage_options
    )
    df = df.set_index(['Date'], append=True)
    return df

@delayed
def info(df):
    buffer = io.StringIO()
    df.info(buf=buffer)
    return buffer.getvalue()

def build_task_graph(filepaths):
    part_size = 5
    with dask.annotate(resources={'MEMORY': 200*part_size}):
        b = db.from_sequence(filepaths, partition_size=part_size)
        dfs = b.map(load_dataframe)
        summed_df = dfs.sum()
    with dask.annotate(resources={'MEMORY': 200}):
        delayed_df = summed_df.to_delayed(optimize_graph=True)
    info_delayed = info(delayed_df)
    return info_delayed
```

<img
src="/posts/scaling-python-banking-edition/dask-bag.png"
alt="A picture of a jupyter notebook input cell, next to an image of the cell contents equivilent dask graph being run. The input cell has the code for a dask bag data frame summation wit resource annotations."
/>

**_!!!! (We need to walk the reader through the above figure) !!!!_**

On top of Dask Bag, we also started utilizing a tool called 'resource
annotations.' These allowed us to take a much more
hands-off approach to the scheduler. Instead of manually managing how much work
we are submitting at a time, we can submit it all and let the scheduler do the
heavy lifting of resource management. This automatically insures that the workers will
not get work that exceeds the resources that they have available.

To use resource annotations, first you need to define the relevant resource
limits when you set up your cluster.

```python
with dask.config.set({'distributed.worker.resources.MEMORY': 2000}):
    cluster = LocalCluster()
client = Client(cluster)
```

As you can see in the above example, I used the context manager
`dask.config.set` to set the `MEMORY` resources of each worker
to 2000 **_WHAT UNITS?_**. The resource name and the value can be set arbitrarily. For
example, I could have set the resource to be `WIDGET` instead of
`MEMORY`, and it would work the same as long as your naming is consistent
between your cluster configuration and your annotations. Next, you
annotate your Dask **_Dask Bag?_** objects.

```python
import dask.bag as db

part_size=10
with dask.annotate(resources={'MEMORY': 200*part_size}):
    b = db.from_sequence(filepaths, partition_size=part_size)
    dfs = b.map(load_dataframe)
    summed_df = dfs.sum()
```

In the above code, I have annotated the blocks of Dask objects with
the max amount of memory I expect them to need. Now, when I run this,
the scheduler knows not to send off a block of work to a worker until
there are the necessary resources available on a worker.

## Orchestration & Productionisation

With the computational machinery defined, we then needed a tool to orchestrate all the work for us.
In particular, we needed something that we could submit the work to, which would then handle
making sure all the pieces were put together and run correctly. We
tried two separate tools for this, Prefect and Argo Workflows.

### Prefect

We initially thought that Prefect would be a good fit for us. Prefect
is a Python-native package, which was a bonus. Also, tasks in Prefect
are just Python functions wrapped in a workflow definition with some flow control
logic. It includes a server that can be used to run flows in response
to triggers and schedulers and to manage logging, and it provides a
visualization dashboard. It also integrates nicely with Dask to run
each Dask on a Dask cluster.

<img
src="/posts/scaling-python-banking-edition/prefect-flow.png"
alt="A diagram of a prefect flow."
width="600px"
/>

Unfortunately, we found that when running our workflow from within
Prefect, we were overloading the Dask scheduler. Each Prefect task was
creating a client and connecting to the Dask cluster. The scheduler
can only handle a certain number open connections, and thus we were running into
errors due to having too many file descriptors open. Likewise, all the
connections were slowing down communication between the scheduler and
the workers, causing Dask workers to time out while waiting from a response
from the scheduler.

We also had problems trying to scale the Prefect server to more than
1,000 simultaneous tasks. Prefect Cloud is a commercial offering by
Prefect that would fix this issue; however, one of the primary goals
of the project was to use only open source tools so everything could
be kept in-house, and thus this was not a viable solution.

In order to scale to more tasks on our own, we were
going to need to scale up the various containers that make up Prefect
Server such as GraphQL, Postgres, etc. The work required to do this
was out of scope for us so we began looking at other tools.

### Argo Workflows

With Prefect no longer an option, we decided to try Argo
Workflows. Argo Workflows is an open source workflow engine for
orchestrating parallel jobs on Kubernetes. With Argo, we could use the
cluster-of-clusters strategy, but replace Prefect and the primary Dask
cluster with Argo Workflows. This would allow us to simplify Dask
communication, capture logs, and also provide a visualization
dashboard, just like Prefect.

We were able to use Dask Bag to control resource usage within a
workflow pod for individual aggregations. However, if an aggregation
required more resources than a single Kubernetes pod could provide, we
could also spin up a larger distributed cluster and have the Argo
Workflow pod submit the work to that cluster. This allowed us to keep
aggregation groups as completely separate units of work, alleviating the
risk of one failure jeopardizing other work, while still allowing us to
scale to the resources we needed.

<img
src="/posts/scaling-python-banking-edition/argo-workflow.png"
alt="An Argo Workflows cluster. It shows a Fast API server connecting argo worflow pods. Two of those pods start up local dask clusters. The third starts up a distributed dask cluster for doing large aggregations."
/>
&nbsp; &nbsp; _(k8s = Kubernetes)_

## Conclusion

Our banking client is currently using this cluster-of-clusters solution built on Dask Bag and Argo Workflows in production. It has allowed them to process the results from their valuation models
in near real-time, which was not possible for them beforehand. This has enabled them to make decisions far more quickly than they previously could.

To review, we first looked into using GPUs to solve this problem, but found that
after accounting for data transfer it didn’t give us a speed up in
this particular use case. We also experimented with Dask in various
configurations to accomplish the large scale aggregation we needed, eventually
settling on an approach using Dask Bag with resource annotations. To satisfy our
orchestration needs, we first investigated use of the open source Prefect Server backend, but
found that it would require quite a bit of effort to scale to the
extent needed for our problem. We then evaluated Argo Workflows, which enabled us
to achieve our goal of deploying an open source large scale data
processing pipeline for running valuation adjustment models using
tools from the PyData ecosystem.

[cluster of clusters keynote]: https://summit.dask.org/schedule/presentation/61/keynote-clusters-of-clusters-using-dask-distributed-to-scale-enterprise-machine-learning-systems/
[nvidia mem swapping post]: https://developer.nvidia.com/blog/how-optimize-data-transfers-cuda-cc
