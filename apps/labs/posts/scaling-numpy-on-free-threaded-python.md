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
2. Refcount contention on shared global objects.
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

The first bottleneck that surfaced was in `tracemalloc` of CPython.
`tracemalloc` is a memory tracking tool which is disabled by default,
however even though it was not enabled, it still acquired a global lock
on every allocation and deallocation.

I fixed this in CPython by avoiding locking when `tracemalloc` is disabled
by using atomic operations to check whether it is enabled before acquiring
the lock. This was implemented in
[python/cpython#143065](https://github.com/python/cpython/pull/143065).

### 2. Lock contention in the ufunc dispatch cache

Every call to a ufunc such as `np.sin` or `np.cos` goes through a dispatch
cache that maps a tuple of input types to a concrete loop implementation. The
cache was previously protected by a `std::shared_mutex` (a reader-writer lock).
Even though, it was a reader-writer lock, it still didn't scale well.

I fixed this by implementing a lock-free hashtable for the dispatch cache,
which allows for lock-free reads. The fast-path for cache hit is now just
a few atomic read operations which scales well across threads. This was
implemented in
[numpy/numpy#30593](https://github.com/numpy/numpy/pull/30593), you can
read more about the lock-free design in
[npy_hashtable.c](https://github.com/numpy/numpy/blob/main/numpy/_core/src/common/npy_hashtable.c).

### 4. Reference count contention on global `PyCapsule` objects

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

### 5. Module attribute lookup contention

NumPy uses module level `__getattr__` to resolve ufuncs such as `np.sin`
and `np.cos` to their actual implementations. In CPython, the module
attribute lookup bytecode specialization was not enabled for modules
which defined `__getattr__` which causes the attribute lookup to follow
the slow-path of acquiring the import lock and performing the lookup.

I fixed this upstream in CPython
([python/cpython#143470](https://github.com/python/cpython/pull/143470))
by enabling bytecode specialization for module attribute lookups even
when `__getattr__` is defined.

### 6. Memory allocator contention

After all of the above, the only remaining contention in the flame graph was
inside `malloc` itself. The free-threaded workload was allocating memory
concurrently across many threads, and it didn't scale well because of
locking inside the system allocator implementation particularly on macOS.

The fix was twofold:

- In CPython, I changed the raw allocator APIs to use mimalloc as the
  underlying memory allocator on the free-threaded build. This was implemented
  in [python/cpython#144916](https://github.com/python/cpython/pull/144916).

- In NumPy, I changed the array allocation APIs to use the raw allocator
  instead system allocator. This was implemented in
  [numpy/numpy#30846](https://github.com/numpy/numpy/pull/30846).

## Results

TODO Add benchmark results and summarise.
