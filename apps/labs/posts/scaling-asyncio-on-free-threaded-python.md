---
title: 'Scaling asyncio on Free-Threaded Python'
authors: [kumar-aditya]
published: June 24, 2025
description: 'A recap on the work done in Python 3.14 to enable asyncio to scale on the free-threaded build of CPython.'
category: [Community]
featuredImage:
  src: /posts/scaling-asyncio-on-free-threaded-python/logo.png
  alt: 'A logo for asyncio.'
hero:
  imageSrc: /posts/scaling-asyncio-on-free-threaded-python/logo.png
  imageAlt: 'A logo for asyncio.'
---

# The GIL and asyncio: A Brief Recap

Before diving into the details of scaling `asyncio` on the free-threaded
build of CPython, it's important to understand why the Global Interpreter Lock (GIL)
is a significant limitation for `asyncio` in the first place.
While `asyncio` allows for highly efficient I/O-bound concurrency
by switching between tasks during I/O waits (non-blocking operations),
it still operates within a single OS thread. For CPU-bound tasks, which would block
the event loop, you would typically need to offload these tasks to a separate thread
using `asyncio.to_thread()`.
However, the GIL prevents true parallel execution of Python threads,
meaning that even in a multithreaded environment, only one thread could execute
the CPU-bound task at a time.

The GIL also prevented execution of multiple event loops in parallel running
in different threads. This limited the ability to scale `asyncio` applications
across multiple CPU cores.

# Scaling `asyncio` on Free-Threaded Python

The free-threaded build of CPython removes the GIL, allowing multiple threads
to execute in parallel. This opens up new possibilities for `asyncio` applications,
enabling them to scale across multiple CPU cores without the limitations imposed by the GIL.

However, this means that `asyncio` needed to be adapted to work in a
free-threaded environment. It previously relied on the GIL and global state
to manage the event loop and tasks and was not thread-safe.

I implemented several changes in Python 3.14 to fix thread safety of `asyncio`
and enable it to scale effectively on the free-threaded build of CPython.
It is now implemented using lock-free data structures and per-thread state,
allowing for efficient task management and execution across multiple threads.
In the general case of multiple event loops running in parallel, there
is no lock contention and scales linearly with the number of threads.

Here are the key changes:

1. **Per-thread linked list of tasks**:
   Python 3.14 introduces a per-thread circular double linked list implementation for storing tasks. This allows each thread to maintain its own list of tasks and allows for lock free addition and removal of tasks. This is designed to be efficient, and thread-safe and scales well with the number of threads in free-threading

2. **Per-thread current task**:
   Python 3.14 stores the current task on the current thread state instead of a global dictionary. This allows for faster access to the current task without the need for a dictionary lookup. Each thread maintains its own current task, which is stored in the thread state structure. This avoids contention on a global dictionary and allows multiple threads to
   access thier current task without any locking or contention.

These changes allow `asyncio` to scale linearly with the number of threads in free-threading,

# Benchmarks

To evaluate the performance of `asyncio` on the free-threaded build of CPython,
I ran benchmarks comparing the performance of `asyncio` on the free-threaded build
with the GIL-enabled build.
