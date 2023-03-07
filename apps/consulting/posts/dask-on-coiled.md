---
title: 'Dask on Coiled'
published: August 5, 2021
author: amit-kumar
description: 'In this blog post, we will talk about a case study of utilizing Dask to speed up a particular computation, and we will scale it with the help of Coiled.'
category: [Scalable Computing, Training]
featuredImage:
  src: /posts/dask-on-coiled/daskoncoiled-1.png
  alt: 'Dask and Coiled logos'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

In this blog post, we will talk about a case study of utilizing [Dask][dask] to speed up
a particular computation, and we will scale it with the help of [Coiled][coiled].

## What Is Dask?

Dask is an open-source parallel computing library written in Python. One of the
most useful features of Dask is that you can use the same code for computations
on one machine or clusters of distributed machines. Traditionally making the
transition from a single machine to running the same computation on a
distributed computing cluster has been very difficult in the PyData ecosystem
without Dask.

<img
src="/posts/dask-on-coiled/daskoncoiled-img-2.png"
width="400px"
/>

The beauty of Dask is that it uses existing APIs from libraries like [NumPy],
[pandas], and [scikit-learn] to create Dask equivalents of those libraries for
scalable computing.

For example:

- Reading a `DataFrame` in pandas

```python
import pandas as pd

df = pd.read_csv(filename)
df.head()
```

- Reading a `DataFrame` in Dask

```python
import dask.dataframe as dd

df = dd.read_csv(filename)
df.head()
```

And the latter can scale from your computer to distributed machines on the cloud.

## Coiled

Coiled is a service to scale Dask on the cloud. It's a company started by
Matthew Rocklin, who is also the main developer of Dask.

<img
src="/posts/dask-on-coiled/daskoncoiled-img-3.png"
width="300px"
/>

Coiled gives you access to compute resources on the cloud with just a few lines
of code. For example, launching a Coiled Dask Cluster with _n_ number of workers
is as easy as:

```bash
# Install Coiled
$ pip install coiled
```

```python
import coiled
from dask.distributed import Client

# Launch a cluster with Coiled
cluster = coiled.Cluster(
    n_workers=5,
    worker_cpu=4,
    worker_memory="16 GiB",
)

# Connect Dask to your cluster
client = Client(cluster)
```

Reference: https://docs.coiled.io/user_guide/index.html

Notes:

- As shown above you need the `coiled` [PyPI] package to interact with Coiled's API.
- You also need to sign up for a free account on Coiled to be able to spin up a
  Dask cluster on Coiled. At the time of writing this, Coiled's Free account
  gives 1000 CPU hours with 100 cores every month.

## The Problem

In large-scale genomics analysis, the samples are often very similar. Because of
that, it is useful to reduce samples into groups of individuals, that share
common traits. One of the most common techniques for doing this is calculating a
distance metric between all individuals. This involves calculating the pairwise
distance between each of the individuals, which is a very time-expensive
calculation. Consequently, it is important to utilize all kinds of performant
hardware we have at our disposal.

To simplify this a bit, consider a set of vectors in a 2D matrix:

<img
src="/posts/dask-on-coiled/daskoncoiled-img-4.png"
width="550px"
/>

Our goal here is to calculate the pairwise distance between all vector pairs.
The output matrix will look like the following:

<img
src="/posts/dask-on-coiled/daskoncoiled-img-5.png"
width="600px"
/>

## Requirements

### I. Solution

- Carry out the computation mentioned above correctly.
- It should be scalable to large datasets, where the array doesn't fit in memory.
- It should be able to utilize GPUs, if available, to speed up the computation.
- It should be generic enough to be able to accommodate further implementations
  of various distance metrics such as Euclidean, Minkowski, cityblock, etc.

### II. Benchmarking

- Ability to benchmark on large clusters on the cloud with access to CPUs and GPUs

## Solution

There exists a solution for the same operation in the [SciPy] library in the
form of a function named [`pdist`][pdist].

It solves the problem for smaller datasets and is fast enough, but it doesn't
scale well or utilize GPUs. Therefore, there was a need for a new implementation
to handle large datasets and to make use of GPUs.

An implementation with both of these features is available in the
[sgkit library][sgkit], and it can be used as follows:

- Import the tools and create a random 2D matrix

```python
import dask.array as da
from sgkit.distance.api import pairwise_distance

x = da.random.random((4, 5))
```

- Run on CPU

```python
pairwise_distance(x).compute()

array([[0.        , 0.58320543, 0.85297084, 0.67021758],
       [0.58320543, 0.        , 0.86805965, 0.61936337],
       [0.85297084, 0.86805965, 0.        , 0.78851248],
       [0.67021758, 0.61936337, 0.78851248, 0.        ]])
```

- Run on GPU

```python
pairwise_distance(x, device="gpu").compute()

array([[0.        , 0.58320543, 0.85297084, 0.67021758],
       [0.58320543, 0.        , 0.86805965, 0.61936337],
       [0.85297084, 0.86805965, 0.        , 0.78851248],
       [0.67021758, 0.61936337, 0.78851248, 0.        ]])
```

### Approach

To tackle the problem of scaling the computation for large datasets, where the
entire array (matrix) would not fit in memory, we took the map-reduce approach
on the chunks of the arrays which can be described as follows.

Consider a small chunk of a large 2D array:

![](/posts/dask-on-coiled/daskoncoiled-img-6.png)

We calculate the map step of the computation on the chunk. To illustrate this,
consider Euclidean distance. The Euclidean distance for a pair of vectors V0 and
V1 is defined as the square root of

<img
src="/posts/dask-on-coiled/daskoncoiled-img-7.png"
width="800px"
/>

### Map of Map-Reduce Algorithm

Now to understand map-reduce on a chunk of a large matrix, let's try to
understand it with a simple example of two vectors. To perform the map step of
the map-reduce algorithm for Euclidean distance, we calculate the squared sum of
a pair of vectors, which is demonstrated in the image below:

![](/posts/dask-on-coiled/daskoncoiled-img-8.png)

In the above image, you can see that the 2D array has three chunks and we
calculate the squared sum for each chunk of the array. In practice, a chunk will
have more than two vectors, but here we have taken only two vectors for
simplicity.

### Reduction step of Map-Reduce Algorithm

In the reduction step, we take the square root of the sum of all the squared
sums of all the chunks. It is demonstrated in the image below:

![](/posts/dask-on-coiled/daskoncoiled-img-9.png)

### Implementation

The implementation was done using Dask and [Numba]. Dask arrays `da.blockwise`
and `da.reduction` were used for scaling the map-reduce algorithm to large
datasets and Numba's `guvectorize` and `cuda` modules were used for implementing
the distance metric map and reduce functions on CPU and GPU. The full
implementation of the pairwise distance calculation can be seen in the
[sgkit source code][sgkit distance].

### Using Coiled

Coiled was used for testing the scalability of the implementation on large
datasets and on both CPUs and GPUs.

Here is how one can quickly create a Dask cluster with GPUs on Coiled:

1. Create a Software Environment to run the computation

```python
import coiled
from dask.distributed import Client, performance_report, get_task_stream

account = "aktech"
env_name = f"{account}/sgkit"

coiled.create_software_environment(
    name=env_name,
    conda="environment.yml",
    container="gpuci/miniconda-cuda:10.2-runtime-ubuntu18.04",
)
```

2. Create cluster configuration for Dask to spin up on Coiled

This will define the name of the cluster configuration and spec for the machine
used for a single machine in the cluster. Here we have chosen the machine with
**15 GiB RAM**, 4 vCPUs, and 1 GPU attached to it.

```python
coiled.create_cluster_configuration(
    name=env_name,
    software=env_name,
    worker_cpu=4,
    worker_gpu=1,
    worker_memory="15 GiB"
)
```

3. Create the Dask cluster on Coiled

This will create a Dask cluster with 25 workers and 2 threads each with the
`dask_cuda.CUDAWorker` worker class to handle GPUs.

```python
cluster = coiled.Cluster(
    configuration=env_name,
    n_workers=25,
    worker_options={"nthreads": 2},
    worker_gpu=1,
    account=account,
    worker_class="dask_cuda.CUDAWorker",
    backend_options={"region": "us-east-1", "spot": False},
)
client = Client(cluster)
print("Dashboard:", client.dashboard_link)
```

This will also give you the link to the Dask dashboard to see the status of the
task.

### Running the Computation on a Large Dataset

The dataset used for studying the scalability is the
[genomic data by MalariaGEN][malariagen dataset].

Here is the code to run the computation on the MalariaGEN dataset:

```python
import dask.array as da
import fsspec
import zarr
from dask.distributed import Client
from sgkit.distance.api import pairwise_distance

store = fsspec.get_mapper(
    "gs://ag1000g-release/phase2.AR1/variation/main/zarr/all/ag1000g.phase2.ar1"
)
callset_snps = zarr.open_consolidated(store=store)
gt = callset_snps["2R/calldata/GT"]

gt_da = da.from_zarr(gt)
x = gt_da[:, :, 1].T
x = x.rechunk((-1, 100000))


def run_with_report(x, metric, target, report_name):
    with performance_report(
        filename=f"dask-report-{metric}-{report_name}.html"
    ), get_task_stream(filename=f"task-stream-{metric}-{report_name}.html"):
        out = pairwise_distance(x, metric=metric, target=target)
        out.compute()
```

Run the computation for the Euclidean metric on GPU on Coiled as follows:

```python
run_with_report(x, metric="euclidean", target="gpu", report_name="full")
```

## Benchmarks

Here are the benchmarks for the computation on Coiled Cloud:

<img
src="/posts/dask-on-coiled/daskoncoiled-img-10.png"
width="700px"
/>

## Sample Output

Here is a sample output for a small, random matrix, to give an idea of the
result of a typical calculation:

```python
import dask.array as da
from sgkit.distance.api import pairwise_distance

# Create a 5x4 random 2D array to calculate pairwise distance
rs = da.random.RandomState(0)
x = rs.randint(0, 3, size=(5, 4))

# Compute pairwise distance on CPU
pairwise_distance(x).compute()

# Compute pairwise distance on GPU (if you have one)
pairwise_distance(x, device="gpu").compute()
```

Output:

```python
array([[0.        , 1.73205081, 2.44948974, 2.23606798, 2.44948974],
       [1.73205081, 0.        , 2.23606798, 2.        , 1.73205081],
       [2.44948974, 2.23606798, 0.        , 1.73205081, 2.44948974],
       [2.23606798, 2.        , 1.73205081, 0.        , 2.23606798],
       [2.44948974, 1.73205081, 2.44948974, 2.23606798, 0.        ]])
```

## Conclusion

In this blog post, we learned how a complex problem of genomics analysis can use
Dask to scale to a large dataset and the compute can be easily obtained from
Coiled for CPU as well as GPU architectures with just a few lines of code.

The main takeaway here is, if you have a computation that uses Dask and you need
compute at scale to speed up the computation, then using Coiled is a very easy
way to get compute quickly.

[coiled]: https://www.coiled.io/
[dask]: https://www.dask.org/
[malariagen dataset]: https://malariagen.github.io/vector-data/landing-page.html
[numba]: https://numba.pydata.org/
[numpy]: https://numpy.org
[pandas]: https://pandas.pydata.org
[pdist]: https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.distance.pdist.html
[pypi]: https://pypi.org
[scikit-learn]: https://scikit-learn.org/
[scipy]: https://scipy.org
[sgkit]: https://pystatgen.github.io/sgkit/latest/
[sgkit distance]: https://github.com/pystatgen/sgkit/blob/f22b667b071d18e4885bcfa73b00dc821ee6f1bf/sgkit/distance/api.py
