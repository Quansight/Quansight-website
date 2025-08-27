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

# Introduction

asyncio is a Python standard library for writing high performance concurrent code
using the async/await syntax and provides high level API for managing event loops, coroutines,
tasks, and performing asynchronous I/O operations. It is used as a foundation for Python asynchronous
frameworks that provide high-performance network and web-servers, database connection libraries,
distributed task queues, etc. Multiple libraries and frameworks, such as FastAPI and aiohttp,
are built on top of `asyncio`.

In this blog post, we will explore the changes made in the upcoming Python 3.14 release to
enable `asyncio` to scale on the free-threaded build of CPython.

# The GIL and asyncio: A Brief Recap

Before diving into the details of scaling `asyncio` on the free-threaded
build of CPython, it's important to understand what is Global Interpreter Lock (GIL)
and how it is a significant limitation for `asyncio` in the first place.

The GIL is a global mutex that protects access to Python objects, preventing multiple threads
from executing Python bytecodes at once. This means that even though you can have multiple
threads in a Python program, only one thread can execute Python code at a time.

`asyncio` allows for highly efficient I/O-bound concurrency
by switching between tasks during I/O waits (non-blocking operations), however,
it still operates within a single OS thread and does not take advantage of multiple cores.
For CPU-bound tasks, which would block the event loop, you would typically need to offload
these tasks to a separate thread. However, the GIL prevents true parallel execution of Python threads,
meaning that even offloading the CPU bound to another thread, it would still block the event loop
because only one thread can execute Python code at a time.

The GIL also prevents execution of multiple event loops in parallel running
in different threads. This limits the ability to scale `asyncio` applications
across multiple CPU cores because of the limitations of the GIL.

# Scaling `asyncio` on Free-Threaded Python

The free-threaded build of CPython removes the GIL, allowing multiple threads
to execute in parallel. This opens up new possibilities for `asyncio` applications,
enabling them to scale across multiple CPU cores without the limitations imposed by the GIL.

However, this means that `asyncio` needed to be adapted to work in a
free-threaded environment as it previously relied on the GIL and global state
to manage the event loop and tasks and was not thread-safe.

Each thread running `asyncio` event loop primarily stores three key pieces of state:

1. Current loop: When a thread starts running an `asyncio` event loop,
  it sets its current loop to the instance of the event loop. This is done so that code
  can access the current loop via `asyncio.get_running_loop()` without it being passed around explicitly,
  and once the loop is stopped, the current loop state is reset.

2. Tasks: When a task is created, it is added to the list of tasks for the current event loop.
   This allows each thread to manage its own tasks independently, and once a task is completed,
   it is removed from the list.

3. Current task: When a task starts executing, it is set as the current task for the event loop.
   This allows the event loop to keep track of which task is currently running, and once the task
   completes or suspends by awaiting on something, the current task state is reset.


Up until now, `asyncio` was designed with the assumption of a single-threaded environment,
and relied on the GIL to manage access to shared state. The current task state was stored in a
global dictionary mapping threads to their current task, and all tasks were stored in a global `WeakSet`.
This scaled poorly with the number of threads in free-threading because of reference counting and locking
contention on these global data structures.

In Python 3.14, I have implemented several changes to fix thread safety of `asyncio`
and enable it to scale effectively on the free-threaded build of CPython.
It is now implemented using lock-free data structures and per-thread state,
allowing for highly efficient task management and execution across multiple threads.
In the general case of multiple event loops running in parallel, there
is no lock contention and scales linearly with the number of threads.

Here are the key changes:

1. **Per-thread linked list of tasks**:
    Python 3.14 introduces a per-thread circular double linked list implementation for storing tasks
    instead of global `WeakSet`.
    The linked list is thread-local, meaning that each thread maintains its own list of tasks and allows
    for lock-free addition and removal of tasks.
    The use of weak references is removed entirely which was slow and prone to contention, by instead
    making tasks responsible for removing themselves from the list when they are done.
    This requires cooperation between task's deallocator and the executing threads to ensure that the
    task is removed from the list before it is freed, otherwise a thread could try accessing already
    freed task. By removing the use of weak references,
    the overhead of reference counting is eliminated entirely and addition/removal of task in the list
    now requires only updating the pointers in the linked list.

    This design allows for efficient, lock-free and thread-safe task management and scales well with
    the number of threads in free-threading.

2. **Per-thread current task**:
   Python 3.14 stores the current task on the current thread state instead of a global dictionary mapping
   event loops to their current tasks.

   By storing the current task on thread state, the overhead of accessing the current task is reduced,
   and it allows for lock-free access to the current task and avoid dictionary lookup.
   It allows for faster switching between tasks which is a very frequent operation in asyncio.

   This design allows for lock-free access to the current task and avoid reference counting
   and lock contention on the global dictionary.

These changes allow `asyncio` to scale linearly with the number of threads in free-threading,

# Benchmarks

To evaluate the performance of `asyncio` on the free-threaded build of CPython,
I ran benchmarks comparing the performance of `asyncio` on the free-threaded build
with the GIL-enabled build.
