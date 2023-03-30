---
title: 'Scaling Python'
published: March 28, 2023
author: andrew-fulton
description: 'In this post, we walk you through how Quansight helped a banking client through this process of scaling in a real life scenario.'
category: [Scalable Computing, Optimization, Data Engineering]
featuredImage:
  src: /posts/scaling-python/header.png
  alt: 'summing dataframes visualization'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

This post is based off of a talk given at PyData NYC 2022. You can watch the talk here: [Scaling Python: Bank Edition](https://www.youtube.com/watch?v=tbqgsM6iGng).

Often scaling a distributed computation is easy until it isn't. There are currently several tools that will get you off the ground quickly, but when the size of your data increases and you are required to scale further, the complexity needed for a solution often increases considerably as well. At this point algorithm and infrastructure dependent requirements will likely preclude experimentation and problem solving. In this post, we walk you through how Quansight helped a banking client through this process of scaling in a real life scenario.

## Problem Overview

To start, we were tasked with deploying a large scale data processing pipeline for running valuation adjustment models using open source tools from the PyData ecosystem. We were given 140,000 simulation files, each around 140MB, totaling about 20 TB. The data was stored in flat parquet files with columns “path”, “Date”, and “value”. Each file contained 50,000 simulations 120 dates into the future (6 million rows) (~140MB/file). Each file belonged to a particular file group, with each group ranging from 2 to 18,000 files. Our goal was to sum the values in the files by path, date within each file group as quickly as possible to return results in as close to real time as possible. To complicate the problem, we had to be able to accomplish this while accounting for potentially limited compute resources.

<img
src="/posts/scaling-python/introduction-img-1.png"
width="400px"
alt="Three dataframes stacked on top of each other. Each dataframe has index named path with values ranging from 0-49,999. Each has two columns. The first is named Date. The second column is labeled value. The dataframes are labeled File 1, File 2, ..., File N. to the right of the stacked dataframes is an arrow with the text sum inside of it. To the right of the arrow is another dataframe representing the sum of the three dataframes by path and date."
/>

## Hardware Options

To solve this problem we first explored what hardware options were available to us. Specifically, as we were basically doing matrix summations on a large scale, we were curious is GPUs' could be a good fit for our problem.

### GPUs

There were several reasons why we considered using GPU hardware. We thought that trying different GPU tools could help us speed up our computation as we would be utilizing the same operation across many different elements.
Second, we thought that using the GPU may be able to help us reduce networking bottlenecks. We wondered if we could speed up our operations enough, if we could make up for the IO bottlenecks that we were facing. Finally, GPUs could help us in optimizing for-loop operations. We would be able to setup the our computation using ND-arrays and for-loops alongside striding to reduce the amount of memory used at one time.

### GPU Tools

We explored several different libraries that use a GPU compute engine as their back-end. Several of these were from the rapids stack. We also explored TensorFlow and PyTorch, but found that these were more suited to machine learning specific tasks than what our problem called for. The rapids stack libraries that we explored were cuDF, CuPy, and blazing-SQL (though that has been deprecated in favor of Dask SQL now). Another tool that we tried was HEAVY.AI, formerly OmniSci. While HEAVY.AI was fast, it could not handle simultaneous read/write, which was a showstopper for us.

### The "pyGPU-cuda" Algorithm

GPU architecture lends itself to a pattern that many of these tools rely on. First metadata is used to to determine the maximum threads per block and blocks per grid. Then using this information the data is loaded into GPU memory. Then the computation is run using one of the above tools, and then finally the data is extracted back to the host.

<img
src="/posts/scaling-python/pygpu-cuda-algorithm.png"
alt="An image representing a flow diagram of the pyGPU-cuda algorith."
/>

Unfortunately what we ended up finding was that copying the data back and forth between the host's memory and the GPU memory turned out to be rather expensive. It was expensive enough in fact to mitigate a lot of the benefits we saw in the speedup of the computation itself. On top of that, the increased cost of GPU available cloud instances made the usage of GPUs for our calculation unfeasible for our problem. With that in mind, we decided to focus on good old distributed CPU architecture for our computation.

## Orchestration & Aggregation

With our decision made up to use a distributed CPU architecture, we started looking at ways we could implement Dask to solve problem. We choose Dask due to it's native python implementation and it's utilization of standard python APIs. This makes it easy to test code in pandas or numpy and then quickly distributed the code using Dask, with only slight changes to the code. The first approach we tried was a simple dataframe group-by.

### Group-by

we thought that the dataframe approach made sense due to the ease of implementations. We could simply take a list of parquet files and pass that list to Dask dataframe’s read_parquet function. We would then run the group-by method on the loaded dataframe and take the sum of the group-by object.

<img
src="/posts/scaling-python/dd-groupby.png"
alt="A picture of a jupyter notebook input and output cells, next to an image of the cell contents equivilent dask graph being run"
/>

However, as we noted earlier, our resources may be limited. What happens if our dataframe is larger than the cluster itself?

### Dataframe Group-by

As it turns out this is an issue we ran into with some of our larger aggregations. We were finding that when we submitted jobs workers would be forced to pause or restart when the memory thresholds for the cluster were reached causing the job to fail.

<img
src="/posts/scaling-python/dd-larger-than-cluster.png"
alt="A picture of a jupyter notebook input and output cells next to an image of the dask dashboard with the results of the equivilent dask graph being run. The output cell of the jupyter notebook shows a KilledWorker error."
/>

The image above shows an example of this happening. In this example I used a Dask cluster with 2 workers each with 4 GB of memory and get a killed worker error when I try to aggregate 10 6,000,000 row files.

I will note however, that in this example I am using an older version of Dask. This problem is becoming less of an issue as improvements to the Dask scheduler are released. I am not able to reproduce this error on the same aggregation when I use a more recent version of Dask. This was however something we had to address at the time.

### Dataframe Group-by Chunking

In order to address this out of memory error, we used a chunking strategy. We found that if we created a graph that chunks the group-by into smaller aggregations the scheduler would have an easier time handling the load.

The chunking strategy looked like this. For a given set of files, if the set of files met a specific threshold, we would build a Dask graph that would first load a subset of the files. Next it would group and aggregate the subset into a single dataframe. Then for each subsequent subset,
The new set would be concatenated with the previously aggregated results. The resulting dataframe would then be grouped and aggregated until all files were aggregated together. If there where not enough files to meet the threshold, We would follow the standard read_parquet, group-by, sum strategy.

<img
src="/posts/scaling-python/dd-chunking.png"
alt="A picture of a jupyter notebook input cell next to an image of the dask dashboard with the graph build by the jupyter cell."
/>

With this strategy, we were able aggregate the our largest aggregation sets, but we still had a lot of aggregations to do and we wanted to run them as quick as possible. That’s where we started seeing our next set of problems. The strategy laid out so far allowed us to be able to complete any of our aggregations on an individual basis.
But when submitting the thousands of aggregations at a time, some of those larger than the cluster itself,
we again ran into our original problem. Workers were frequently running out of memory and either pausing, or worse, getting killed. This caused a lot of work being duplicated or erroring out completely

<img
src="/posts/scaling-python/oom-error.png"
alt="A picture of a jupyter notebook input and output cells. The output is showing dask worker usage warnings."
/>

### Manual throttling

To combat this, we decided to throttle how much work we were going to give the scheduler at a time. To do this we employed a thread-pool executor to submit the jobs.
This would allow us to submit many jobs at once but still limit how much was getting submitted to the scheduler.
Each job would get a thread worker, and the job would hold a place in the pool until it was complete in which case the thread-pool would grab the next job and submit it.

But we were still running into problems with overwhelming the cluster. We could just lower the number of thread workers, but than we still had jobs that were larger than the cluster on an individual basis so we were still overloading the cluster at times, and the rest of the time, the cluster would be highly underutilized making for poor efficiency and economy

So instead of just lowering the number of thread-workers in our thread-pool, we started checking the cluster resources manually with the Dask scheduler before submitting to make sure there was space. This strategy gave us the benefit of being able to increase the thread-pool workers for better cluster utilization for smaller aggregations, but it also still allowed us to throttle the amount of submissions when we needed to. For this to work we would set it up so that when a thread-pool worker got a new task, We would first estimate the required max resources the task would need. Which was essentially just the number of files multiplied by the estimated file-size. Then we would Activate a thread-lock so only one thread could check and submit at a time. Then we would check cluster resources. If the resources were available the task would be submitted to the Dask scheduler.At this point, there would be a brief wait and the thread-lock would be released so other workers could continue their work.

<img
src="/posts/scaling-python/throttling.png"
alt="A picture of a jupyter notebook input and output cells, next to an image of the cell contents equivilent dask graph being run. The image demonstrates showing work being passed to the scheduler in a chunk based manner"
/>

This strategy was starting to get us closer. We now had a little more leeway to increase thread-pool workers for better cluster utilization, but it was still taking time to create the graphs in the first place, and we didn’t have complete reliability with our larger aggregations.

So with that in mind we created a second thread-pool executor. This thread-pool was responsible for creating the Dask graphs for each aggregation group. It would then pass off each Dask graph to the next thread-pool for submission to the cluster. With the larger aggregation groups we found we could submit them via the creation thread-pool where they would throttle the amount of new graphs being created leaving the cluster resources free

With this strategy we could reliably complete large batches of jobs. And we could do so while utilizing the cluster fairly efficiently. However there were downsides. We were finding that tuning the thread-pool executors was tedious. It took work to figure out the number of threads per thread-pool, along with the appropriate sleep calls and thread-locking. It also wasn't a one size fits all strategy. Different workloads needed different settings. It made for a complex setup which was far less than ideal. Furthermore, the data shuffling and group-by operations continued to be expensive across a large cluster.

### Dataframe Summation

It was at this point, We started feeling like we were running out of wind in our sails with our group-by and multi-threading strategy. It was becoming clear that our code in it's current form was too complex and not very efficient. The more we continued down this path, we realized, the more technical debt we were going to accrue. So we began to think of other ways we could aggregate the data

At this point we realized that pandas dataframe actually sum together quiet nicely. Pandas ensures that the index and columns match on the sums so you won’t end up with mismatched sums. It’s also considerably faster then a group-by. Another bonus, by moving out of Dask dataframe, we could utilize multi-indexing which helps cut down on the memory footprint of the dataframes as well. We found that on our dataset, summing our re-indexed dataframe was about 3 times faster than running a group-by operation on the equivalent concatenated dataframe.

<img
src="/posts/scaling-python/df-sum.png"
alt="A picture of a jupyter notebook input and output cells. The first set shows a pandas groupby. The ouput shows that the computation took 1.77 s +- 72.3 ms per loop. The second input cells shows the summation of several dataframes. The ouput shows that the computation took 639 ms +- 15.9 ms per loop"
/>

We were still having a bit of trouble with getting the dataframes at the right place at the right time though. We also wanted our architecture to account for the parallelization opportunities among the different aggregation groups. Ideally we wanted to run an aggregation group on a single worker when feasible to cut down on network traffic on the cluster. With that in mind we started looking at cluster of clusters.

### Cluster of Clusters

We based our cluster of clusters implementation off of a [keynote at the 2021 dask summit](https://summit.dask.org/schedule/presentation/61/keynote-clusters-of-clusters-using-dask-distributed-to-scale-enterprise-machine-learning-systems/). With this setup. You have a normal dask distributed cluster with a scheduler and a set of workers. Instead of passing your work directly to the scheduler as normal, though. You pass delayed objects that instruct the worker to start a local cluster and to also build a specific dask graph to be passed to the local cluster. Submitting work in this way gives the benefit of being able to encapsulate a work unit in order to reduce the overall network communication. However, at this point we were still using thread-pools to manage the aggregation on the local clusters, requiring manual tuning. So from here we decided to pivot away from the aggregation strategy and try something different.

<img
src="/posts/scaling-python/cluster-of-clusters.png"
width="400px"
alt="A diagram showing how cluster of Cluster works. It contains a box with the text Outer Dask Cluster. Inside there are 4 boxes, 1 on the left and three on the right. There multi directional arrows between the box on the left and the boxes on the right. Each box is labeled 'K8s Node'. The box on the left encapsulates another box with the text Dask Scheduler. Each box on the right encapsulates a box with the text Dask Worker. That box encapsulates another box with the text Dask LocalCluster"
/>

### Dask Bag and Resource Annotations

This is when we started looking more seriously into dask bag. Dask bag is typically used for processing text or CON files, so it’s probably not the first thing people think of when they need to work with dataframes. One of the big advantages of it, though, is that it follows the Map-reduce model. It allows us to take a more hands off approach because we can trust that it will reduce our data on each individual worker as much as possible before moving data between workers to finish the aggregations. We also made sure to define a `partition_size`, which is the number of units included in each reduction.
Next we mapped `load_dataframe` to our our sequence of file-paths and finally we sum it. When the dask bag object is submitted. Dask will send batches of files as defined by the partition size to the workers. The workers will then apply the mappings and the aggregation to each batch. And finally, the workers will re-partition and apply the mappings and aggregation on the new batches until the dataset is fully aggregated

<img
src="/posts/scaling-python/dask-bag.png"
alt="A picture of a jupyter notebook input cell, next to an image of the cell contents equivilent dask graph being run. The input cell has the code for a dask bag data frame summation wit resource annotations."
/>

On top of dask bag, we also started utilizing resource annotations. These gave us a big hand up by letting us take a more hands off approach to the scheduler. Instead of managing how much work we are submitting. We can submit it all and let the scheduler do the heavy lifting of resource management. Insuring that the workers will not get more work then the resources that they have available.

To set use resource annotations, first you need to set up your cluster by configuring the necessary resources.

```python
with dask.config.set({'distributed.worker.resources.MEMORY': 2000}):
    cluster = LocalCluster()
client = Client(cluster)
```

As you can see in the above example, I used the context manager `dask.config` to set the `MEMORY` resources of each worker to 2000. The resource name and the value can be set arbitrarily. For example I could have set the resource to be `WIDGET` instead of `MEMORY` and it would work all the same as long as you are consistent between your cluster configuration and your annotations. Next, you annotate your dask objects.

```python
import dask.bag as db

part_size=10
with dask.annotate(resources={'MEMORY': 200*part_size}):
    b = db.from_sequence(filepaths, partition_size=part_size)
    dfs = b.map(load_dataframe)
    summed_df = dfs.sum()
```

In the above code, I have annotated the blocks of dask objects with the max amount of memory I expect them to need. Now when I run this, the scheduler know not to send off a block of work to a worker until there are the necessary resources available on a worker.

## Orchestration & Productionisation

Next we need a tool that would help us orchestrate all the work. We needed something that we could submit work to that would then handle making sure all the pieces were put together and run correctly. We tried two separate tools for this, Prefect and Argo Workflows.

### Prefect

We initially thought that prefect would be a good fit for us. Prefect is a python native package, which was a bonus. Also, tasks in prefect are just python functions wrapped in a flow with some flow control logic. It includes a server that can be used to run flows in response to triggers and schedulers, manage logging, and it provides a visualization dashboard. It also integrates nicely with Dask to run each dask on a dask cluster.

<img
src="/posts/scaling-python/prefect-flow.png"
alt="A diagram of a prefect flow."
/>

Unfortunately, we found that when running our workflow from within prefect, we were overloading the dask scheduler. Each prefect task was creating a client and connecting to the dask cluster. The scheduler can only handle so many open connections so we were running into errors due to having too many file descriptors open. Likewise, all the connections were slowing down communication between the scheduler and the workers causing dask workers to time out waiting from a response from the scheduler.

We also had problems trying to scale the Prefect server to more than 1,000 simultaneous tasks. Prefect Cloud is a commercial offering by prefect that would fix this issue, however, one of the primary goals in the project was to use only open source tools so everything could be kept in house. In order to scale to more tasks on our own, we were going to need to scale up the various containers that make up Prefect Server such as GraphQL, Postgres, etc. The work required to do this was out of scope for use so we began looking at other tools.

### Argo Workflows

With Prefect no longer an option, we decided to try Argo Workflows. Argo workflow is and open source workflow engine for orchestrating parallel jobs on Kubernetes. With Argo, we could use the cluster of cluster strategy, but replace Prefect and the primary dask cluster with Argo workflows. This would allow us to simplify dask communication, capture logs as well as providing a visualization dashboard, just like Prefect.

We were able to use Dask bag to control resource usage within a workflow pod for individual aggregations. However if an aggregation required more resources than a single Kubernetes pod could provide, we could also spin up a larger distributed cluster and have the Argo workflow pod submit the work to that cluster. This allowed us to keep aggregation groups completely separate units of work, alleviating the risk of one failure jeopardizing other work, will still allowing us to scale to the resources we needed.

<img
src="/posts/scaling-python/argo-workflow.png"
alt="An Argo Workflows cluster. It shows a Fast API server connecting argo worflow pods. Two of those pods start up local dask clusters. The third starts up a distributed dask cluster for doing large aggregations."
/>

## Conclusion

In conclusion, we looked into GPU use for our problem, but found that after accounting for data transfer it didn’t give us a speed up in this particular use case. We also experimented with Dask in various configurations to accomplish the large scale aggregation needed, settling on dask bag with resource annotations. Finally, for orchestration we investigated use of open source Prefect Server, but found that it would require quite a bit of effort to scale to the extent needed for our problem. We settled on Argo Workflows and were able to achieve our goal of deploying an open source large scale data processing pipeline for running valuation adjustment models using tools from the PyData ecosystem.

The setup described here is currently being used in production at the bank. It has allowed them to process the results from valuation models at near real time so that they can make decisions as quickly as possible, which was not possible for them beforehand.
