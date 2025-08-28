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

## Introduction

`asyncio` is a Python standard library for writing high performance concurrent
code using the async/await syntax and provides high level APIs for creating and
managing event loops, coroutines, tasks, and performing asynchronous I/O
operations. It is used as a foundation for Python asynchronous frameworks that
provide high-performance network and web-servers, database connection
libraries, distributed task queues, etc. Multiple libraries and frameworks, such
as `FastAPI` and `aiohttp`, are built on top of `asyncio`.

In this blog post, we will explore the changes I made in the upcoming Python
3.14 release to enable `asyncio` to scale on the free-threaded build of CPython.

## The GIL and asyncio: A brief recap

Before diving into the details of scaling `asyncio` on the free-threaded build
of CPython, it's important to understand what is Global Interpreter Lock (GIL)
and how it is a significant limitation for `asyncio` in the first place.

The Global Interpreter Lock (GIL) is a global mutex that protects access to
Python objects, preventing multiple threads from executing Python bytecodes at
once. This means that even though you can have multiple threads in a Python
program, only one thread can execute Python code at a time.

`asyncio` uses an event loop as a scheduler to enable highly efficient I/O-bound
concurrency by switching between tasks during non-blocking I/O operations. The
event loop leverages platform-specific support for asynchronous I/O—such as
`epoll` on Linux, `kqueue` on macOS, and `IOCP` on Windows to perform these
operations efficiently. Since only one event loop can run per thread, CPU-bound
tasks, which would otherwise block the event loop, are typically offloaded to
separate threads. However, the GIL limits true parallel execution of Python code
across threads. Hence, even when tasks are offloaded, they still compete for the
GIL for execution and limits parallelism.

The GIL also prevents execution of multiple event loops in parallel running in
different threads. This limits the ability to scale asyncio applications across
multiple CPU cores because of the limitations of the GIL.

## Scaling `asyncio` on Free-Threaded Python

The free-threaded build of CPython removes the GIL, allowing multiple threads to
execute in parallel. This opens up new possibilities for `asyncio`
applications, enabling them to scale across multiple CPU cores without the
limitations imposed by the GIL. However, this means that `asyncio` needed to be
adapted to work in a free-threaded environment as it previously relied on the
GIL and global state to manage the event loop and tasks and was not thread-safe.

Since each thread can only run one event loop, `asyncio` internally does
book-keeping for each thread running an event loop and primarily stores three
key pieces of state:

1. **Current loop**: When a thread starts running an `asyncio` event loop, it
   sets its current loop to the instance of the running event loop. Once the
   event loop is stopped, the current loop is set to `None`. The current loop is
   used to associate futures, tasks and callbacks with the running event loop.
   The current loop can be accessed using `asyncio.get_running_loop()`.

2. **Tasks**: When a task is created, it is added to the set of tasks to be
   executed by the current event loop. This allows each loop to manage its own
   tasks independently, and once a task is completed, it is removed from the
   set. The set of tasks can be accessed by `asyncio.all_tasks()`.

3. **Current task**: When a task starts executing, it is set as the current task
   for the event loop. This allows the event loop to keep track of which task is
   currently running, and once the task completes or suspends by awaiting on
   something, the current task state is reset. High-level APIs such as
   `asyncio.timeout()` and `asyncio.TaskGroup` rely on current task for proper
   cancellation of tasks. The current task can be accessed using
   `asyncio.current_task()`.

Up until now, `asyncio` was designed with the assumption of a single-threaded
environment, and relied on the GIL to manage access to shared state. The current
task state was stored in a global dictionary mapping threads to their current
task, and all tasks were stored in a global `WeakSet`. This scales poorly with
the number of threads in free-threading because of reference counting and
locking contention on these global data structures.

In Python 3.14, I have implemented several changes to fix thread safety of
`asyncio` and enable it to scale effectively on the free-threaded build of
CPython. It is now implemented using lock-free data structures and per-thread
state, allowing for highly efficient task management and execution across
multiple threads. In the general case of multiple event loops running in
parallel, there is no lock contention and scales linearly with the number of
threads.

Here are the key changes:

1. **Per-thread linked list of tasks**:
   Python 3.14 introduces a per-thread circular double linked list implementation
   for storing tasks instead of global `WeakSet`. The linked list is per-thread,
   meaning that each thread maintains its own list of tasks and allows for
   lock-free addition and removal of tasks. The use of weak references is
   removed entirely which was slow and prone to contention, by instead making
   tasks responsible for removing themselves from the list when they are done.
   This requires cooperation between task's deallocator and the executing
   threads to ensure that the task is removed from the list before it is freed,
   otherwise a thread could try accessing already freed task. By removing the
   use of weak references, the overhead of reference counting is eliminated
   entirely and addition/removal of task in the list now requires only updating
   the pointers in the linked list.

   This design allows for efficient, lock-free and thread-safe task management
   and scales well with the number of threads in free-threading.

2. **Per-thread current task**:
   Python 3.14 stores the current task on the current thread state instead of a
   global dictionary mapping event loops to their current tasks. By storing the
   current task on thread state, the overhead of accessing the current task is
   reduced, and it allows for lock-free access to the current task while
   avoiding dictionary lookup. It allows for faster switching between tasks
   which is a very frequent operation in asyncio.

   This design allows for lock-free access to the current task and avoids
   reference counting and lock contention on the global dictionary.

Both of these changes allow `asyncio` to scale linearly with the number of
threads in free-threading, and has significantly improved performance for both
single-threaded and multi-threaded asyncio usage. The standard `pyperformance`
benchmark suite shows a significant 10–20% improvement in performance while also
reducing memory usage.

## Benchmarks

Here are the benchmark results comparing the performance of `asyncio` on the free-threaded
build with the GIL-enabled build on a 12 core Windows machine:

- **TCP Benchmark**: This benchmark measures raw TCP performance.

  <figure style={{ textAlign: 'center' }}>
    <img
      src="/posts/scaling-asyncio-on-free-threaded-python/asyncio_tcp_benchmark.png"
      alt="Bar chart comparing performance of asyncio TCP on GIL-enabled vs free-threading build."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>

- **Web Scraping**: This benchmark measures the performance of using `aiohttp` with
   [Web Scraping on asyncio](https://py-free-threading.github.io/examples/asyncio/).

  <figure style={{ textAlign: 'center' }}>
    <img
      src="/posts/scaling-asyncio-on-free-threaded-python/asyncio_web_scraping_benchmark.png.png"
      alt="Bar chart comparing performance of Web Scraping using aiohttp on GIL-enabled vs free-threading build."
      style={{position:'relative',left:'15%',width:'70%'}}
    />
  </figure>
