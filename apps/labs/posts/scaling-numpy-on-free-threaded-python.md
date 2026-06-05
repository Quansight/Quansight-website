---
title: 'Scaling NumPy on Free-Threaded Python'
authors: [kumar-aditya]
published: May 26, 2026
description: 'A recap on the work done in NumPy and CPython to make multi-threaded NumPy workloads scale on the free-threaded build of CPython.'
category: [Community]
featuredImage:
  src: /posts/scaling-numpy-on-free-threaded-python/logo.png
  alt: 'A logo for NumPy.'
hero:
  imageSrc: /posts/scaling-numpy-on-free-threaded-python/logo.png
  imageAlt: 'A logo for NumPy.'
---

## Introduction

NumPy is the foundational array library in the scientific Python ecosystem.
Every numerical, machine learning, and data analysis library in Python
either depends on NumPy directly or interoperates with it. As the Free-Threaded
build of CPython matures, NumPy is one of the first libraries that users reach
for when trying to scale CPU-bound numerical workloads across multiple cores
using threads.

In this blog post, I will walk through the work I did over the last few months
in both NumPy and CPython to eliminate the multi-threaded scaling bottlenecks
that were preventing NumPy from scaling on Free-Threaded Python.
Special thanks to Nathan Goldbaum for his help on the NumPy side of things
throughout this work.

## The bug report that started it all

The investigation started from a [StackOverflow
question](https://stackoverflow.com/questions/79851420/multithreading-becomes-much-slower-than-multiprocessing-in-free-threaded-python)
where a user reported that a NumPy workload using `ThreadPoolExecutor` was
significantly _slower_ than the equivalent `ProcessPoolExecutor` version on the
free-threaded build of CPython. This was tracked as
[numpy/numpy#30494](https://github.com/numpy/numpy/issues/30494).

The reproducer is small and representative of ufunc heavy workloads: each
worker takes an array, applies a handful of `np.sin` and `np.cos` calls in a
loop, and reduces the result. There is no shared mutable state between
workers, so in principle this should scale linearly with the number of cores.
In practice, multi-threading was up to 2x _slower_ than multi-processing
on the same machine.

The free-threaded build removes the GIL, but removing the GIL is not enough on
its own. Profiling the reproducer revealed several hidden bottlenecks in NumPy
and CPython that were masked by the GIL on the regular build but became severe
scaling issues on the free-threaded build. These scaling bottlenecks fall
primarily into three categories:

1. Lock contention.
2. Reference count contention on shared global objects.
3. Contention in the memory allocator.

<figure style={{ textAlign: 'center' }}>
  <img
    src="/posts/scaling-numpy-on-free-threaded-python/before.png"
    alt="Flame graph of the reproducer before any fixes."
    style={{position:'relative'}}
  />
  <figcaption>Flame graph of the reproducer before any fixes.</figcaption>
</figure>

## The bottlenecks and the fixes

### 1. Lock contention in `tracemalloc`

The first bottleneck that surfaced was in CPython's `tracemalloc` module.
`tracemalloc` is a memory tracking tool which is disabled by default.
However even though it was not enabled, it still acquired a global lock
on every allocation and deallocation to check whether `tracemalloc` had been
enabled at runtime.

I fixed this in CPython by avoiding locking when `tracemalloc` is disabled.
Now, CPython uses atomic operations to check whether `tracemalloc` is
enabled, providing a lock-free fast path. This was implemented in
[python/cpython#143065](https://github.com/python/cpython/pull/143065).

### 2. Lock contention in the ufunc dispatch cache

Every call to a ufunc such as `np.sin` or `np.cos` goes through a dispatch
cache that maps a tuple of input types to a concrete loop implementation. The
cache was previously protected by a `std::shared_mutex` (a reader-writer lock).
Even though, it was a reader-writer lock, it still didn't scale well.

To fix this, the new design takes advantage of two properties of the dispatch
cache: it is read-heavy, and its entries are immutable — once an entry is
inserted, it is never modified or removed. This means readers never have to
guard against an entry changing underneath them, so reads can be made
completely lock-free. It is now implemented as a lock-free concurrent hash
map with no locking required the read path at all, and only a single lock on
the write path for rare cache misses that require insertions.

The cache is implemented by `PyArrayIdentityHash`, which holds an atomic
pointer to the buckets that store the actual entries. To look up an entry, a
thread atomically loads the buckets pointer, indexes into it using the hash of
the input types, and atomically loads the key stored there. If the key matches
the input types, the corresponding loop is returned. So, looking up an entry
is just a sequence of atomic loads with no locking at all and scales well even
many threads are reading from the cache.

Insertions are rare and only happen on a cache miss. A writer acquires the
cache's mutex so that only one thread can modify the cache at a time, then
publishes the new entry into the buckets atomically, so concurrent readers
can read the updated entry without data races. This design allows the dispatch
cache to scale well with many threads while being thread safe.
This was implemented in
[numpy/numpy#30593](https://github.com/numpy/numpy/pull/30593).

<figure style={{ textAlign: 'center' }}>
  <img
    src="/posts/scaling-numpy-on-free-threaded-python/hashtable.png"
    alt="Diagram of the lock-free dispatch cache. "
    style={{position:'relative'}}
  />
  <figcaption>
    The lock-free dispatch cache. Readers follow the atomic pointer to the
    current buckets table and look up entries without taking a lock. After the
    table is resized, the old table is kept alive (linked through a prev chain)
    until deallocation, so readers still using it — like Reader C — can finish
    safely. Only writers acquire the mutex.
  </figcaption>
</figure>

### 3. Reference count contention on global `PyCapsule` objects

NumPy stores the default memory handler in a global `PyCapsule` object.
On the GIL build, an extra `Py_INCREF`/`Py_DECREF` on these capsule objects
is essentially free. On the free-threaded build, every increment and
decrement of such objects requires atomic operations on the reference count,
and with many threads all contending on the same global capsules, this
became a severe scaling bottleneck.

I fixed this by making the global default memory handler immortal,
meaning that it is never freed and no reference counting operations are
performed on them at all. There was no public C API to mark an object as
immortal, so I added `PyUnstable_SetImmortal` in CPython. This was
implemented in
[python/cpython#144543](https://github.com/python/cpython/pull/144543)
and [numpy/numpy#30826](https://github.com/numpy/numpy/pull/30826)

### 4. Module attribute lookup contention

NumPy uses module level `__getattr__` to resolve ufuncs such as `np.sin`
and `np.cos` to their actual implementations. In CPython, the module
attribute lookup bytecode specialization was not enabled for modules
which defined `__getattr__` which causes the attribute lookup to follow
the slow-path of acquiring the import lock and performing the lookup.

I fixed this upstream in CPython
([python/cpython#143470](https://github.com/python/cpython/pull/143470))
by enabling bytecode specialization for module attribute lookups even
when `__getattr__` is defined.

### 5. Memory allocator contention

After all of the above, the only remaining contention in the flame graph was
inside `malloc` itself. The free-threaded workload was allocating memory
concurrently across many threads, and it didn't scale well because of
locking inside the system allocator implementation particularly on macOS.

The fix was twofold:

- In CPython, I changed the raw allocator APIs to use mimalloc as the
  underlying memory allocator on the free-threaded build. This was implemented
  in [python/cpython#144916](https://github.com/python/cpython/pull/144916).

- In NumPy, I changed the array allocation APIs to use the raw allocator
  instead of the system allocator. This was implemented in
  [numpy/numpy#30846](https://github.com/numpy/numpy/pull/30846).

## Benchmarks

Here are the benchmark results comparing the performance of the
multi-threaded reproducer on the free-threaded build before and after all of
the above fixes on a 32 core linux machine:

<figure style={{ textAlign: 'center' }}>
  <img
    src="/posts/scaling-numpy-on-free-threaded-python/so_benchmark.png"
    alt="Benchmark result."
    style={{position:'relative'}}
  />
  <figcaption>
    The red line represents the performance before the fixes, the green line
    represents the performance after the fixes and the black line represents
    the performance of the multi-process version.
  </figcaption>
</figure>

Before the fixes, the multi-threaded case scaled well up to 18 threads, but after
that because of the bottlenecks described above, the performance degraded
significantly and became much slower than the multi-process version. After
the fixes, the multi-threaded version scales well across all 32 cores and is
significantly faster than the multi-process version.

## Summary

NumPy ufuncs now scale well on the free-threaded build of CPython after several
bottlenecks in both NumPy and CPython were fixed. The changes I implemented in
CPython to fix the bottlenecks in `tracemalloc`, the memory allocator, and
module attribute lookups will also benefit other libraries and workloads on
the free-threaded build beyond just NumPy. During this project work, I laid
the foundational work like adding the C-API for making objects immortal and
changing the raw allocator to use mimalloc which will enable more libraries to
easily fix similar bottlenecks in their own code and scale well on the
free-threaded build. This was a lot of work and required coordinated changes
across both NumPy and CPython, but it is very exciting to see NumPy workloads
scale efficiently on the free-threaded build now.
