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
either depends on NumPy directly or interoperates with it. As the free-threaded
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

The reproducer is small and representative of ufunc-heavy workloads: each
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
`tracemalloc` is a memory-tracking tool that is disabled by default.
However, even though it was not enabled, it still acquired a global lock
on every allocation and deallocation to check whether `tracemalloc` had been
enabled at runtime.

I fixed this in CPython by avoiding locking when `tracemalloc` is disabled.
Now, CPython uses atomic operations to check whether `tracemalloc` is
enabled, providing a lock-free fast path. This was implemented in
[python/cpython#143065](https://github.com/python/cpython/pull/143065).

This kind of bottleneck is easy to introduce and hard to spot. However, this is
a common pattern where a flag needs to be checked before performing some
operation. While adding a lock is easy and fixes the thread-safety issue, it
can cause severe scaling bottlenecks if the flag is checked frequently in a hot
path. In such cases, it is better to use atomic operations to check the flag
and avoid locking on the fast path, and only acquire the lock when the flag
needs to be updated.

### 2. Lock contention in the ufunc dispatch cache

NumPy implements mathematical operations like `np.sin` as
[ufuncs](https://numpy.org/doc/stable/reference/ufuncs.html) (short for
universal functions). The key thing to know here is that a ufunc is defined in
terms of its input types: NumPy implements a different loop for each
combination of types. For example, the implementation of `np.add` differs
depending on whether the operands are integers or floats, since one needs a
loop based on integer addition and the other on floating point addition. NumPy
therefore has a dispatch system that determines the correct loop to call given
a tuple of input data types.

To avoid repeating this resolution on every call, NumPy caches the result in a
dispatch cache that maps a tuple of input types to a concrete loop
implementation. This cache is global state shared by all threads. It was
previously protected by a `std::shared_mutex` (a reader-writer lock), but it
still didn't scale well under heavy concurrent read accesses.

To fix this, the new design takes advantage of two properties of the dispatch
cache: it is read-heavy, and its entries are immutable — once an entry is
inserted, it is never modified or removed. This means readers never have to
guard against an entry changing underneath them, so reads can be made
completely lock-free. It is now implemented as a lock-free concurrent hash
map with no locking required on the read path at all, and only a single lock on
the write path for rare cache misses that require insertions.

<figure style={{ textAlign: 'center' }}>
  <img
    src="/posts/scaling-numpy-on-free-threaded-python/hashtable.png"
    alt="Diagram of the lock-free dispatch cache. "
    style={{position:'relative'}}
  />
  <figcaption>
    The lock-free dispatch cache. Readers follow the atomic pointer to the
    current buckets table and look up entries without taking a lock. After the
    table is resized, the old table is kept alive (linked through a prev
    chain) until deallocation, so readers still using it — like Reader C — can
    finish safely. Only writers acquire the mutex.
  </figcaption>
</figure>

The cache is implemented by `PyArrayIdentityHash`, which holds an atomic
pointer to the buckets that store the actual entries. To look up an entry, a
thread atomically loads the buckets pointer, indexes into it using the hash of
the input types, and atomically loads the key stored there. If the key matches
the input types, the corresponding loop is returned. So, looking up an entry
is just a sequence of atomic loads with no locking at all and scales well even
when many threads are reading from the cache.

Insertions are rare and only happen on a cache miss. A writer acquires the
cache's mutex so that only one thread can modify the cache at a time, then
publishes the new entry into the buckets atomically, so concurrent readers can
read the updated entry without data races. If the cache needs to be resized,
the writer creates a new buckets table, rehashes all entries into it, and
atomically updates the pointer to the new table. The old table is kept alive
until deallocation, so readers that are still using it can finish safely
without worrying about it being freed while they are reading from it. This
design allows the dispatch cache to scale well with many threads while being
thread-safe. This was implemented in
[numpy/numpy#30593](https://github.com/numpy/numpy/pull/30593).

### 3. Reference count contention on global `PyCapsule` objects

NumPy lets users customize how arrays allocate their memory through a
[configurable memory
handler](https://numpy.org/doc/stable/reference/c-api/data_memory.html#configurable-memory-routines-in-numpy-nep-49).
To make this handler accessible from Python and swappable at runtime, NumPy
wraps it in a [`PyCapsule`](https://docs.python.org/3/c-api/capsule.html), an
object that carries an opaque C pointer.

NumPy stores the default memory handler in a global `PyCapsule` object.
On the GIL build, an extra `Py_INCREF`/`Py_DECREF` on these capsule objects
is essentially free: the reference count is a plain integer that only one
thread can touch at a time. On the free-threaded build, every increment and
decrement of a shared object has to be an atomic operation on the reference
count, and when many threads reference-count the same object, the cache line
holding that count bounces between cores instead of staying local to one. This
makes reference counting a shared object dramatically slower than reference
counting a thread-local one and causes severe performance degradation when
many threads are referencing the same global `PyCapsule` object for the
default memory handler.

I fixed this by making the global default memory handler immortal. An immortal
object is one that is never freed and has no reference counting performed on it
at all, which sidesteps the contention entirely. CPython already uses immortal
objects extensively for internal singletons like `None`, `True`, and small
integers, precisely because it lets them be shared across threads without
reference count contention.

The problem was that, before Python 3.15, there was no public C API for a
library like NumPy to make its own objects immortal. This use case is exactly
what justified adding one, so I added `PyUnstable_SetImmortal` in CPython. This
was implemented in
[python/cpython#144543](https://github.com/python/cpython/pull/144543)
and [numpy/numpy#30826](https://github.com/numpy/numpy/pull/30826). The API is
public from Python 3.15 onwards, but NumPy can already use it on Python 3.14
through the [pythoncapi-compat](https://github.com/python/pythoncapi-compat)
headers, which implement it using the private C APIs available in 3.14.

### 4. Module attribute lookup contention

When you write `np.sin`, that is an attribute access on the `numpy`
module object — Python looks up the `sin` attribute on the module.
NumPy uses module level `__getattr__` to resolve ufuncs such as `np.sin` and
`np.cos` to their actual implementations. In CPython, the module attribute
lookup bytecode specialization was not enabled for modules that defined
`__getattr__`, which causes the attribute lookup to follow the slow path of
acquiring the import lock and performing the lookup.

I fixed this upstream in CPython
([python/cpython#143470](https://github.com/python/cpython/pull/143470))
by enabling bytecode specialization for module attribute lookups even
when `__getattr__` is defined. This fix is available from Python 3.15 onwards.

### 5. Memory allocator contention

NumPy allocates the memory for its arrays directly from the system allocator
through `malloc` and `free`. With many threads allocating and freeing memory
concurrently, this scales poorly because some system allocators serialize
allocations behind internal locks. This is especially bad on macOS, where the
system allocator does not scale well when multiple threads are allocating and
deallocating memory.

CPython exposes its own low-level ["raw" memory allocator
routines](https://docs.python.org/3/c-api/memory.html) such as
`PyMem_RawMalloc` and `PyMem_RawFree`. However, those routines were also
calling the system allocator. The free-threaded build of CPython already uses
[mimalloc](https://github.com/microsoft/mimalloc) to allocate Python objects.
mimalloc is highly optimized for multi-threaded workloads. NumPy, however, was
not using it because it was calling the system allocator directly.

The fix was twofold:

- In CPython, I changed the raw allocator APIs to use mimalloc as the
  underlying memory allocator on the free-threaded build. This was implemented
  in [python/cpython#144916](https://github.com/python/cpython/pull/144916).

- In NumPy, I changed the array allocation APIs to use CPython's raw allocator
  instead of calling the system allocator directly. Routing array allocations
  through these routines lets NumPy automatically benefit from mimalloc —
  without needing to know anything about mimalloc itself. This was implemented
  in [numpy/numpy#30846](https://github.com/numpy/numpy/pull/30846).

## Benchmarks

The benchmark is the same reproducer from the StackOverflow question that
started this investigation: each worker applies a handful of `np.sin` and
`np.cos` calls to its own array in a loop and reduces the result, with no
shared mutable state between workers. Here are the benchmark results comparing
the performance of the multi-threaded reproducer on the free-threaded build
before and after all of the above fixes on a 32 core linux machine:

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

Before the fixes, the multi-threaded case scaled well up to 18 threads, but
after that, because of the bottlenecks described above, the performance
degraded significantly and became much slower than the multi-process version.
After the fixes, the multi-threaded version scales well across all 32 cores and
is significantly faster than the multi-process version.

## Summary

NumPy ufuncs now scale well on the free-threaded build of CPython after several
bottlenecks in both NumPy and CPython were fixed. The changes I implemented in
CPython to fix the bottlenecks in `tracemalloc`, the memory allocator, and
module attribute lookups will also benefit other libraries and workloads on
the free-threaded build beyond just NumPy. During this project work, I did the
foundational work, such as adding the C API for making objects immortal and
changing the raw allocator to use mimalloc, which will enable more libraries to
easily fix similar bottlenecks in their own code and scale well on the
free-threaded build. This was a lot of work and required coordinated changes
across both NumPy and CPython, but it is very exciting to see NumPy workloads
scale efficiently on the free-threaded build now.
