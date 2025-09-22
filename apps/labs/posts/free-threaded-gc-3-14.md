---
title: "Unlocking Performance in Python's Free-Threaded Future: GC Optimizations"
authors: [neil-schemenauer]
published: Aug 30, 2025
description: 'A description of the performance optimizations made to the free-threaded garbage collector for Python 3.14.'
category: [Community]
featuredImage:
  src: /posts/free-threaded-gc-3-14/fast-gc-snake.jpg
  alt: 'A cartoon of a snake with jet engines, carrying a trash can.'
hero:
  imageSrc: /posts/free-threaded-gc-3-14/fast-gc-snake.jpg
  imageAlt: 'A cartoon of a snake with jet engines, carrying a trash can.'
---

# Unlocking Performance in Python's Free-Threaded Future: GC Optimizations

## Introduction

The upcoming Python 3.14 release is packed with exciting features and
improvements. A release candidate for 3.14 is now available. Regular Python
users are encouraged to download and try it to ensure it is well tested before
the final release. It contains significant improvements to the free-threaded
version of Python, which allows Python to run without the Global Interpreter
Lock (GIL). Here at Quansight, I have implemented several optimizations to the
garbage collector (GC) for this new Python build.

This work, contained in the 3.14 release, delivers substantial performance
improvements. Let's dive into the technical details of how we're making
Python's garbage collection faster.

## Two Garbage Collectors

First, it’s important to know that the free-threaded build of Python uses a
different garbage collector implementation than the default GIL-enabled build.

- **The Default GC:** In the standard CPython build, every object that supports
  garbage collection (like lists or dictionaries) is part of a per-interpreter,
  doubly-linked list. The list pointers are contained in a PyGC_Head structure
  that sits right before the object's data in memory. This header adds two extra
  machine words to the size of every GC-supporting object.

- **The Free-Threaded GC:** The new free-threaded GC takes a different
  approach. It scraps the PyGC_Head structure and the linked list entirely.
  Instead, it allocates these objects from a special memory heap managed by the
  "mimalloc" library. This allows the GC to find and iterate over all collectible
  objects using mimalloc's data structures, without needing to link them together
  manually.

This design choice has trade-offs. It makes creating and destroying objects
faster because they don't need to be constantly linked and unlinked from a
list. Modern hardware also tends to be slow when iterating over linked lists.
However, without the linked-lists, the free-threaded GC needs to allocate some
working memory to operate, which could be an issue if your system is already
critically low on memory. The default GC, by contrast, can run without
allocating any extra memory.

Another consequence is that the free-threaded GC doesn't support "generations"
or "incremental" collections. These are effective optimizations in the default
GC that avoids looking at all GC-supporting objects on every collection. For
the free-threaded build, every collection must examine all GC-supporting
objects.

## Optimization 1: The 'Mark-Alive' Phase

A traditional ["mark and sweep" garbage
collector](https://en.wikipedia.org/wiki/Tracing_garbage_collection#Na%C3%AFve_mark-and-sweep)
works by first identifying a set of "root" objects that are definitely in use
(like global variables and objects on the call stack). It then "marks" all
objects that can be reached from these roots and "sweeps" away everything else
as garbage.

This simple approach doesn't quite work for Python for two main reasons:

1. **Unknown Roots:** Third-party C extensions can create their own global
   variables that point to Python objects, creating "roots" the GC doesn't know
   about. Missing these could be disastrous, leading to use-after-free errors.

2. **Optional GC Support:** Not all container-like objects in extensions are
   required to implement the GC API.

So, what can we do? This is where the "mark-alive" phase comes in—an idea that
emerged from a chat with CPython core developer Pablo Galindo Salgado at a
CPython core sprint. The insight is simple: while we can't know _all_ the
roots, we do know the important ones, like the module dictionary (sys.modules)
and the interpreter's call stack.

By marking all objects reachable from these _known_ roots, we can identify a
large set of objects that are definitely alive and exclude them from the more
expensive cycle-finding part of the GC process. Since the fraction of these
objects is typically very high, this initial marking phase provides a
significant performance win.

As a proof-of-concept, I implemented a prototype version of this optimization
for the default build of Python 3.12. The implementation was relatively simple
and yielded some significant performance benefit in terms of reducing GC
collection time. Mark Shannon independently implemented the same kind of
optimization for the default build of Python 3.14a3. Mark's optimization gave
an overall speedup on the [pyperformance
suite](https://pyperformance.readthedocs.io/) of 3% and the most GC heavy
benchmark of that suite got a 50% speedup.

I implemented a version of this "mark-alive" pass for the free-threaded GC as
well. See the [GitHub PR](https://github.com/python/cpython/pull/128808) for
details. For the pyperformance suite, it shows an overall speedup of 0.7% and a
35% speedup on the most GC heavy benchmark. Additional benchmark results will
be shown later in this post.

## Optimization 2: Using Software Pre-fetch

Modern CPUs are incredibly fast, but fetching data from main memory is a major
bottleneck. A CPU first-level cache hit might take half a nanosecond, while a
trip to main memory can take 100 nanoseconds—200 times slower. CPUs try to
predict which memory you'll need next (hardware pre-fetching), but this fails
with unpredictable memory access patterns, causing the CPU to stall.

Inspired by [a similar change in the OCaml
GC](https://github.com/ocaml/ocaml/pull/10195), we introduced software
pre-fetching to the mark-alive phase of the free-threaded GC. If we know we're
going to need an object's data soon, we can issue an instruction to the CPU to
start loading it from memory ahead of time.

In our implementation, instead of immediately accessing an object pointer, we
push it into a special FIFO queue called a "pre-fetch buffer." When the pointer
is pushed, we also issue a pre-fetch instruction. We pop pointers from the
other end of the buffer and only then access the object's data. The buffer's
size creates a time window that, when tuned correctly, hides the memory access
latency.

In order to tune the size of the pre-fetch buffer, I created an instrumented
version of the GC that logged pre-fetch buffer operations along with object
access timings. An example histogram produced by this is shown below. For the
distribution shown, the median pre-fetch window was 14. More details about the
GC software pre-fetch are contained in the CPython
[internal
documentation](https://github.com/python/cpython/blob/main/InternalDocs/garbage_collector.md#software-prefetch-hinting).

  <figure style={{ textAlign: 'center' }}>
    <img 
      src="/posts/free-threaded-gc-3-14/prefetch-hist.png"
      alt="Histogram chart showing distribution of pre-fetch latency."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

This optimization is only a win if the working set of the objects is too large
to fit entirely into the CPU’s cache. So, it is only enabled if the number of
Python container objects exceeds a threshold. We experimentally determined a
threshold of 200,000 long-lived GC objects to enable it. A rough estimate
could also be made based on the CPU cache size. For example, if the CPU L2
cache is 4 MB in size, it would hold about 130,000 objects if those objects are
32 bytes in size. The gc_big_tree.py benchmark, shown below, uses 3,000,000
objects to ensure the working set of data for the GC does not fit into the L2
cache.

## Optimization 3: Smarter GC Triggers Based on Process Size

When should the garbage collector run? Traditionally, the Python GC is
triggered after a certain number of new container objects have been allocated.
For the free-threaded GC, this threshold is 2,000. This generally works quite
well but it is a crude metric. Allocating 2,000 tiny list objects has a very
different memory impact than allocating 2,000 huge ones.

An obvious improvement to this would be to not just consider the number of new
objects but also the amount of memory those new objects are using. That sounds
smart but turns out to be hard to implement. When allocating a new Python object,
we know the size of the object. However, when it is deallocated, we don't. An
additional problem is that tracking only the memory used by the objects
themselves will fail to account for other memory that is held by those objects.
For example, consider an object that "wraps" a C library data structure. The
Python object itself might be quite small but the library data structure could
be large.

The fix, which was prompted by a user's bug report about performance, was to
make the trigger based on the process memory. Instead of just counting objects,
the free-threaded GC can now query the operating system for the process's total
memory usage, or Resident Set Size (RSS). If the process's memory footprint
hasn't grown significantly since the last collection, the GC can skip running,
avoiding unnecessary work. This is especially beneficial for the free-threaded
GC, which must perform a full collection each time it runs.

This optimization work was initiated based on a bug report about the slower
performance of the free-threaded build on a small benchmark program (see
[cpython#132917](https://github.com/python/cpython/issues/132917)). It turned out
that the program was triggering a lot of GC collections due to the accumulated
allocation of many small list objects. For the free-threaded GC, it must do a
full collection whenever triggered since it doesn't implement incremental
collection like the default build GC.

A further refinement of this was to consider not just resident memory but also
swap or paged memory. On Linux systems, we use the resident-set-size plus the
swap usage. On Windows, the process working-set-size plus the page file usage.
On MacOS, the physical footprint of the process (RAM plus the compressed
memory). This ensures that if the process is slowly consuming memory due to
garbage reference cycles and the OS is swapping that memory out to disk, we
will eventually trigger a collection to free the cycles.

## Putting It to the Test: Benchmark Results

For many programs, time spent in the GC is minimal. To highlight these
optimizations, we used specialized benchmarks that are highly dependent on GC
performance. The tests were run on a Linux machine with an Intel i7-14700K CPU,
and Python was built with PGO/LTO optimizations and with the "tail-call"
interpreter enabled.

The three specialized benchmarks are:
[gc_big_tree.py](https://gist.github.com/nascheme/b882d5d79dbf39ae6361ab3874730066),
[gc_big.py](https://gist.github.com/nascheme/96e71c86d023a927775690de89cb5f14),
and
[list_append_perf_test.py](https://gist.github.com/nascheme/189a3a32dd942c8d3c4c23e9fa62073c).
The first two create a large and complex object graph. The set of objects is
large enough to not fit into the CPU cache and therefore the pre-fetch
optimization has some chance to improve performance. The list append benchmark
is highly dependent on how often the GC runs and shows the effect of the
collection threshold change. The script creates many small list objects and
that typically triggers frequent garbage collection runs, due to the "number of
container objects" threshold.

For the “gc_big_tree” benchmark, the time was measured for both tree creation
and GC collection (all) and for GC collection only (collect only). The “base”
version is Python built for free-threading, without any of the optimizations
described here. The “default” version is Python built with the GIL enabled.
On the charts, a taller bar means faster. So a 2.0 speedup would mean the
benchmark finishes in half the time.

  <figure style={{ textAlign: 'center' }}>
    <img 
      src="/posts/free-threaded-gc-3-14/gc_big_tree_collect.png"
      alt="Bar chart comparing performance of optimizations on gc_big_tree (collect) benchmark."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

The mark-alive pass gives a nice speedup for the "gc_big_tree (collect only)"
benchmark. For that benchmark, the “rss threshold” optimization does essentially
nothing, since GC collection is being manually triggered. For the “all”
version of the benchmark, the “rss threshold” does help since as the tree is
being constructed in memory, automatic GC is triggered less often. The
pre-fetch optimization only provides a small benefit. The default GC has a
[performance issue](https://github.com/python/cpython/issues/129210) in version
3.14 which causes quite poor performance on this benchmark (0.2x the speed of
the base free-threaded GC). This will hopefully be fixed for the 3.15 release.

  <figure style={{ textAlign: 'center' }}>
    <img 
      src="/posts/free-threaded-gc-3-14/gc_big.png"
      alt="Bar chart comparing performance of optimizations on gc_big benchmark."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

  <figure style={{ textAlign: 'center' }}>
    <img 
      src="/posts/free-threaded-gc-3-14/gc_big_tree_all.png"
      alt="Bar chart comparing performance of optimizations on gc_big_tree (all) benchmark."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

For the “gc_big” benchmark, the collection is being triggered manually and so
the “rss threshold” optimization has no effect. However the pre-fetch
optimization shows more benefit here. That’s likely because the object graph
created by this benchmark contains many large list objects and the pre-fetch
logic has some special optimizations for marking lists. Again, the performance
issue with the default build GC is hurting a lot (only 0.2x the performance of
the base free-threaded version). For this benchmark, disabling the GC while
the data structure is being constructed somehow improves the default GC
collection time when later run manually (this is the “default no gc” case, 1.6x
faster than base).

  <figure style={{ textAlign: 'center' }}>
    <img 
      src="/posts/free-threaded-gc-3-14/list_append.png"
      alt="Bar chart comparing performance of optimizations on list_append_perf_test benchmark."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

The “list_append_perf_test” benchmark really highlights the benefit of the
“rss threshold” optimization. Each free-threaded GC run is relatively more
expensive than a default GC incremental collection, since it must look at all
container objects. The benchmark creates many small objects. These objects
don’t actually consume much memory but they trigger frequent GC collections,
due to the net container object count increasing. With the RSS threshold
triggering, which triggers GC based on an actual increase in memory usage, we
avoid many useless collections. This puts the free-threaded GC on par with the
default GC, even though it does a full collection each time it runs.

To compare the benefit of the pre-fetch optimization, the “gc_big” benchmark
was run on three different CPUs: a Ryzen 5 7600X, a Macbook Pro M3, and an
Intel i7-14700K (Raptor Lake). The speedup vs the mark-alive version is shown
below. The speedup on the “gc_big_tree” benchmark is more modest, about 1.1x
faster than the mark-alive version.

The speedup from the pre-fetch optimization is quite hardware dependent. On
the Apple M3 processor, it gives only a 1.15x speedup over the mark-alive
version. However, on an Intel i7 (Raptor Lake) CPU it gives 1.47x speedup.
Relevant hardware features are the speed and size of the CPU caches and main
memory as well as the effectiveness of the CPU hardware pre-fetch. It also
depends on the layout of objects in memory. If object references have good
spatial locality or at least predicable reference offsets, the hardware caching
and pre-fetch logic will do a good job of hiding memory latency without needing
software pre-fetch hints.

  <figure style={{ textAlign: 'center' }}>
    <img 
      src="/posts/free-threaded-gc-3-14/prefetch_speedup.png"
      alt="Bar chart comparing performance of pre-fetch optimization vs mark-alive."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

## Summary

Benchmarks using GC-intensive programs demonstrate the effectiveness of these
optimizations. The "mark-alive" pass consistently delivers good speedups. The
"rss threshold" optimization significantly reduces the frequency of GC runs,
especially for programs creating many small objects. While software
pre-fetching provides varying benefits depending on the hardware, it provides a
measurable speedup when the working set of objects is large. Considering all
these benchmarks, the overall speedup of the free-threaded GC collection is
between 2 and 12 times faster than the 3.13 version. These advancements are
important steps toward unlocking the full performance potential of Python's
free-threaded future.
