---
title: Exploring & Improving the Thread Safety of NumPy's Test Suite
description: WIP
published: October 22, 2025
authors: [britney-whittington]
category: [Developer workflows, OSS Experience, Internship]
featuredImage:
  src: /posts/numpy-thread-safe-test-suite/feature.png
  alt: Image
hero:
  imageSrc: /posts/numpy-thread-safe-test-suite/hero.webp
  imageAlt: Image
---

Hello! My name is Britney Whittington, and I had the honor of being part of Quansight's 2025 cohort of interns. For the past three months, I worked with [Nathan Goldbaum](https://github.com/ngoldbaum) to improve the thread safety of NumPy's test suite. This project involved messing with various parts of NumPy, and even some other libraries.

Thread safety in Python is something that will become more prevalent with the release of free-threaded builds of Python. This blog post details my journey with improving the thread safety of a large library, so if you ever decide to tackle making your own code and test suite more thread-safe, this may be helpful! So feel free to kick back as I describe how I messed with NumPy's test suite, from my first one-line commit to messing with the CI jobs.

### Table of Contents (WIP)

- [Part One: Background](#part-one-background)
- [Part Two: Setup](#part-two-setup)
- [Part Three: Discovery](#part-three-discovery)
- [Part Four: Modifications](#part-four-modifications)
- [Part Five: Wrapping Things Up](#part-five-wrapping-things-up)
- [Part Six: Finale](#part-six-conclusion)

---

# Part One: Background

## Free-Threaded Python

Going into this internship, I was familiar with both Python and NumPy, but this would be my first exposure to free-threaded Python.

What is free-threaded Python? Well, for a more in-depth look into this topic, I would highly suggest visiting the [Python Free-Threading Guide](https://py-free-threading.github.io/) and the [Python doc's how-to](https://docs.python.org/3/howto/free-threading-python.html) on free-threading support. Typically, Python is "GIL enabled", which means the global interpreter lock is active. The [Python docs](https://docs.python.org/3/glossary.html#term-global-interpreter-lock) defines the GIL as:

> The mechanism used by the CPython interpreter to assure that only one thread executes Python bytecode at a time.

A free-threaded build disables the GIL, allowing Python to use all available CPU cores and run code concurrently. This can be helpful in the field of scientific computing and AI/ML, with the GIL often being difficult to work around. Feel free to check out [PEP 703](https://peps.python.org/pep-0703/) for more information about the motivations behind free-threaded Python.

Of course, you don't just have to read up on articles, you can give it a try yourself! Python's latest version, 3.14, comes with the option to install the free-threaded build (which can be denoted as "3.14t").

(It was somewhat ironic that Hollow Knight: Silksong came out around midway through my internship. Get it? *Silk*song, free-_threaded_?)

## The Codebase & Test Suite

With free-threaded Python getting more support, it's a good idea to ensure your code can handle running on multiple threads. One way of doing this, is to run the test suite under multiple threads. The test suite already attempts to test the codebase, so if we run the tests in multiple threads, we could see if the codebase plays nice with threads.

So, let's give it a shot! As already mentioned, the codebase I focused on during this project was NumPy. The first time I saw I would be working with NumPy, I honestly was a little intimidated! NumPy is such a fundamental and widely used library, so the idea of it being my first major open source contribution definitely made me a little nervous. Of course, I had no reason to feel nervous. The NumPy community is wonderful, and I enjoyed my time working with them and lurking around the community meetings.

Like any other big software project, NumPy has a test suite. During NumPy's lifetime, its test suite followed best-practices, first being written in unittest, and now being used with `pytest`, a popular Python unit testing framework. Due to NumPy's size and lifetime, it's test suite is pretty big, and does contain some older code.

## NumPy + Test Suite + pytest-run-parallel = ???

So there are our major parts of the project: free-threaded Python, NumPy, and its test suite written with `pytest`. Now, how do we actually get the test suite running under multiple threads? To do that, we can employ the help of one last library: [pytest-run-parallel](https://github.com/Quansight-Labs/pytest-run-parallel), a `pytest` plugin developed by folks here at Quansight.

`pytest-run-parallel`'s main goal is multi-threading stress testing, exposing thread-safety issues in all parts of the code. The way it does this is by running each test multiple times under multiple threads.

![How pytest-run-parallel handles running tests. Tests runs one-by-one, multiple times under multiple threads.](/posts/numpy-thread-safe-test-suite/pytest-run-parallel-diagram.png)

With this last tool, the project can finally start to come together, utilizing `pytest-run-parallel` to see how NumPy handles running under multiple threads.

# Part Two: Setup

Putting all these pieces together took a bit of work, but generally went like this:

#### 1. Set up WSL

My PC runs under Windows, which does have it's merits (I do enjoy gaming from time to time), but it does make parts of software development difficult, especially when it comes to building C code, which NumPy makes use of. To make things easier on me and my mentor (who was using macOS), we decided I should use the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) (or WSL). Thankfully I had some experience with this already, and already had that installed! Installing WSL is generally as easy as putting `wsl --install` in the terminal of a machine running Windows 10/11.

#### 2. Download free-threaded Python

At the start of my internship, Python 3.14t, the version my mentor suggested I use for the project, was in development. I was having a little trouble getting it installed, so my mentor introduced me to [pyenv](https://github.com/pyenv/pyenv). I hadn't used `pyenv` before, instead preferring to use `conda`, but `pyenv` was a nice solution to the problem of managing multiple Python versions, especially since it made installing different versions of Python so straight-forward. Running `pyenv install 3.14t-dev` was all it took to get it on my machine.

**Note:** Sometimes I would use the GIL enabled build of 3.14 as well. In that case, I wanted to also make sure the environment variables `PYTHON_CONTEXT_AWARE_WARNINGS` and `PYTHON_THREAD_INHERIT_CONTEXT` were set to true. These ensure warnings and context play nice with threads. They are set to true on free-threaded builds, and false otherwise.

#### 3. Create NumPy fork and clone it to my machine

While I didn't have a lot of experience with OSS before this internship, I have used git and GitHub before.

#### 4. Build NumPy locally using spin

To run the NumPy test suite, you should build it locally first. For NumPy, the way it recommends is to use `spin`, detailing the steps [here](https://numpy.org/doc/stable/building/index.html). After installing the various system and Python dependencies (preferably under a virtual environment), all it took was putting in `spin build` to get everything put together.

#### 5. Install pytest-run-parallel

And finally, the last step is to get `pytest-run-parallel`. When it came to Python, I prefer to use virtual environments, setting them up using `venv`. After activating it, `pip install pytest-run-parallel` will get you the plugin.

# Park Three: Discovery

With everything put together, I could finally get started on testing the NumPy test suite, running `spin test -- --parallel-threads=auto`. "spin test" is how NumPy runs the test suite under `pytest` when built under `spin`. "--parallel-threads=auto" is a command line option from `pytest-run-parallel` which activates the plugin, telling it to run each test under the specified number of threads. The keyword `auto` looks at the number of available CPU cores and determines the number of threads for you (for me, it was 24).

Alright, if everything in the test suite is "thread-safe" (aka can run under multiple threads at the same time), then everything should run fine, with no test failures whatsoever! As you might be able to tell, since my project was to improve the thread safety of the test suite, this was not the case.

## Test Failures

For my first couple runs, I was running into numerous errors, and even some hang-ups and crashes. There were large parts of the test suite that were not happy with being ran under multiple threads (aka "thread-unsafe"), and it was now my job to record these errors and figure out why they were failing.

An example of what a test failure may look like is below. Along with this, `pytest` will detail where the failure occurred, which helps us figure out why failures were happening.

```
PARALLEL FAILED numpy/tests/test_reloading.py::test_numpy_reloading - Failed: DID NOT WARN. No warnings of type (<class 'UserWarning'>,) were emitted.
```

Thread safety issues can come from many sources. Thread safety issues can be something inherit to Python, or even the system itself. For example, anything dealing with the file system can be thread-unsafe. Probably not a good idea to have multiple threads trying to access the same file at the same time. Other failures could come from the test suite itself. `pytest` does have some thread-unsafe features that I'll go more in depth later. And of course, NumPy may have some thread safety issues as well, which is what we were trying to expose.

## Test Marking

So, I went through the entire test suite, recording and marking any test that failed under `pytest-run-parallel`. One feature of pytest is markers, which `pytest-run-parallel` makes use of with the `thread_unsafe` marker. Tests with the marker will run under a single thread, letting us avoid these test failures.

```python
@pytest.mark.thread_unsafe(reason="modifies global module state")
def test_ctypes_is_not_available(self):
  ...
```

At the same time, I tried to puzzle out why the tests were failing. For some it was fairly obvious, others not so much. I often asked Nathan for help with this, and over time I started to get a better sense of what may be thread-safe or not.

In the end, I had a fairly large list of tests that were thread-unsafe, and now was tasked with fixing them. I detailed my findings in [this tracking issue](https://github.com/numpy/numpy/issues/29552) on the NumPy repo (it also links most of the PRs I made for this project if you want to look through them!) and got started.

# Part Four: Modifications

My first modification of the NumPy's source code could be called baby's first commit. One thread safety issue we ran into early on was the usage of [Hypothesis](github.com/HypothesisWorks/hypothesis). NumPy was using an older version of Hypothesis which lacked some thread-safety updates, so all we had to do was bump the version!

```diff
  setuptools         ; python_version >= '3.12'
- hypothesis==6.104.1
+ hypothesis==6.137.1
  pytest==7.4.0
```

A small one-line change, but I remember being so excited about my first change to this massive codebase. What a rush!

After this, it was time to make some more sustansial changes. Most test failures can be sorted specific categories for why they were failing. I will go in detail on why they were failing, and how I went about fixing them.

## Setup & Teardown

The first thread safety issue I tackled was the one that required the most modifications to the test suite.

### Problem

One feature of `pytest` is [xunit setup and teardown methods](https://docs.pytest.org/en/stable/how-to/xunit_setup.html). These allow you to setup some values that many of your test methods may use, and typically runs before and after each test. Nowadays, you may see `pytest` [fixtures](https://docs.pytest.org/en/stable/reference/fixtures.html#fixture) used more often instead, with the prevalent usage of xunit setup and teardown throughout NumPy's test suite being a sign of its age.

```python
# example of test using xunit setup
class TestClass:
  def setup_method(self):
    self.x = 2

  def test_one(self):
    assert self.x == 2
```

Nothing wrong with old code if it still works of course! Unfortunately, this feature is currently incompatible with `pytest-run-parallel` and how it handles running tests under multiple threads. Even if you don't define a teardown method, `pytest` has implicit teardown that it calls after tests are ran, which removes values setup during the setup_method. When this happens with multiple threads, this teardown is called before all the threads can finish running the current test. Any test that tries to access the removed values will then fail with an `AttributeError`.

**Note:** Overall, `pytest` isn't very thread-safe, and so a large part of the project was figuring out what to do with thread-safety issues concerning the usage of these setup methods and thread-unsafe fixtures.

### Solution

One solution is to go into `pytest-run-parallel`, and hook into `pytest` and modify how teardown methods are called. It would help with this problem, but it would be a major undertaking at the moment and require a lot more maintenance than the current state of the plugin. [This tracking issue](https://github.com/Quansight-Labs/pytest-run-parallel/issues/14) discusses this problem more in-depth.

Instead, for now we can rewrite these tests to not use xunit setup and teardown. After some trial and error and discussion with members of the NumPy community, we decided on utilizing explicit methods that are called by each test.

```python
# example of test using explicit "creation" methods
class TestClass:
  def _create_data(self):
    return x

  def test_one(self):
    x = self._create_data()
    assert x == 2
```

Utilizing fixtures was another option, but fixtures are only created **once** per test, so threads will share data returned by fixtures, and potentially create thread-safety issues if tests try mutating the shared fixture data.

Overall, this solution was a lot more thread-safe since each thread of each test would get it's own "copy" of the data, meaning they could modify the values to their heart's content with no issue. It was a fairly simple change all things considered, but it took up a large chunk of time in the internship due to how prevalent setup methods were in the test suite.

**Stats**

- 8 PRs
- ~1470 lines added
- ~1300 lines deleted

### Problem with the Solution

While the pros of this solution aligned with the goals of my project, there were still some issues with it. For one, it may introduce more lines of code, since you need to explicitly call the method for each test (which the original setup and teardown methods tried to avoid).

However, the largest issue is that it introduces **stricter testing guidelines**. Overall, making sure the test suite is thread safe will introduce some limitations, but this was perhaps the most noteworthy. This would limit the usage of setup, teardown, and `pytest` fixtures, and instead encourage a somewhat more unorthodox method of utilizing normal methods to set up variables. This spawned some concern and conversation on the way to handle this, especially since it modifies such large parts of the test suites. This encouraged me to post to the NumPy mailing list to illicit some feedback (though we probably should've done this earlier on in the project, whoops!). Overall, members of the community were fine with this change, so we'll just have to be more careful with how we setup tests from now on

**Note:** Of course, this may not be a problem forever. If `pytest` and `pytest-run-parallel` figure out a way of getting thread-safe setup working, the changes I made could be reverted with some git magic.

## Random Number Generation

The next biggest category of test failures involved the usage of `np.random` in tests.

### Problem

Generally, anything that invokes global state and shared data will cause thread safety issues. And well, `np.random` very much is global state! When threads use `np.random`, they are using the same global RNG instance, which can cause test failures when tests rely on seeded results.

Let's say you have a test that relies on seeded results, such as below.

```python
def test_rng():
  np.random.seed(123)
  x = np.random.rand()
  y = np.random.rand()
  z = np.random.rand()
  ...
```

When ran normally under a single thread, you may get results like this for the three variables:

| x     | y     | z     |
| ----- | ----- | ----- |
| 0.696 | 0.286 | 0.226 |

However, when ran with multiple threads, the threads fight for the usage of the global RNG. So, you may instead get results like so:

|          | x     | y     | z     |
| -------- | ----- | ----- | ----- |
| Thread 1 | 0.696 | 0.226 | 0.719 |
| Thread 2 | 0.696 | 0.286 | 0.551 |

You can see how the RNG seed is sort of shared between threads. Obviously, not a good thing when we're trying to keep things thread safe. Tests that care about seed results will fail since they're not getting the results they expect.

### Solution

Thankfully, NumPy actually has a solution for us! Instead of using the global `np.random` instance, we can create local instances with `np.random.RandomState`.

```python
def test_rng():
  rng = np.random.RandomState(123)
  x = rng.rand()
  y = rng.rand()
  z = rng.rand()
  ...
```

Another somewhat simple solution to a problem that affected large parts of the test suite. Nice!

**Note:** NumPy also has the newer Generator class that handles local creation of RNG instances. However, RandomState utilizes the same RNG as `np.random`, making it so I didn't need to go in and modify the expected results.

## Temporary Files

And finally, the last major change I'll go in-depth with is the usage of temporary files.

### Problem

As stated early, usage of the file system is thread unsafe, since the file system is very much global state. When it comes to making temporary files for test suites, it's commonplace to utilize fixtures is `pytest` that create temporary file paths, like `tmp_path`. If you're not careful with file names and locations, tests that use `tmp_path` can be thread-unsafe.

### Solution

Overall, to make temporary file usage thread safe, we want to make sure file paths are unique between threads. One way we thought of early on was appending uuids at the end of file names. This did definitely work, but after further consideration, we decided to look elsewhere for a more foolproof solution.

Here we break the mold a little bit, and instead of messing with NumPy a bunch, how about we take a look at the actual tool I'm using, `pytest-run-parallel`? With this being a `pytest` plugin, we can hook into the `tmp_path` fixture and modify it to be thread-safe!

Okay, how so we actually do this? This took a lot of brainstorming and trial-and-error, but eventually Nathan, [Lysandros Nikolaou](https://github.com/lysnikolaou), and I settled on directly patching into `tmp_path` fixture and creating a subdirectory for each thread that `tmp_path` would then be set to. These are the sort of hacky solutions I live for, and it keeps things fairly simple! Each thread, when they try and access the `tmp_path` fixture, would get a modified version with a subdirectory where they can mess around with their files as much as they want.

With this similar patching approach, I went ahead and added some more fixtures to `pytest-run-parallel` that may be useful, such as a `thread_index` and `iteration_index`.

### Problem with the Solution

Ah, another one of these. While it's a simple solution, it isn't foolproof. With the way I patched `tmp_path`, it makes it so it doesn't get properly patched when called by _other_ fixtures, so be careful if you try to do that. I wasn't able to figure out a solution to this during my internship, but it's probably something that can be fixed.

## Misc Fixes

Outside of these three major changes, there were a few other thread-unsafe bugs that I was able to fix. One example was some usages of `@pytest.mark.parametrize` leading to data races when the test threads would try to modify the parameterized values. Kinda weird, but it was easily fixed with using `.copy()` (a classic solution that I happen to be a fan of, thank you Lysandros for this suggestion).

Finally, running tests in parallel can sometimes result in issues with `warnings`. Any sort of global `warnings` filter or capture can lead to thread-unsafe failures. So, instead it's important to keep `warnings` filters under context managers of some sort.

# Part Five: Wrapping Things Up

With these test suite modifications under my belt, there were 2 more things to work on:

1. Figuring out what to do with all the tests that I couldn't fix
2. Getting this all running under NumPy's CI

## Thread Unsafe Markers

### Problem

When fixing thread-unsafe tests, there were some tests that were thread-unsafe in some way that made fixing them either very difficult or impossible. Maybe they were specifically testing things that were thread-unsafe, like global modules or docstrings. Maybe they modify environment variables. Maybe they require a lot of memory to run, and will completely and utterly crash the terminal when ran in multiple threads (`wsl --shutdown` started to become my best friend over the course of this internship). Or maybe they were using thread-unsafe functionally that I didn't have the scope to fixing during the course of my internship.

Regardless, we still wanted to make sure these wouldn't cause issues when the test suite is ran under `pytest-run-parallel`.

### Solution

Thankfully, we already have the solution, the `thread_unsafe` marker! One of my latest PRs involved marking up all the remaining tests that were thread-unsafe. That PR got nearly 100 comments over the course of 2-3 weeks, and led to me making more PRs when I realized some of these tests actually could be fixed.

One thing that required some interesting solutions was marking up the entire `np.f2py` module as thread-unsafe. Of course you could go in and put a marker on every test, but that's a bit tedious. Instead, I tried putting a `conftest.py` file in the f2py testing folder that would mark the tests as thread-unsafe with `pytest_itemcollected`.

```python
# numpy/f2py/tests/conftest.py
@pytest.hookimpl(tryfirst=True)
def pytest_itemcollected(item):
  item.add_marker(pytest.mark.thread_unsafe(reason="f2py tests are thread-unsafe"))
```

This worked, sort of. With `spin` it worked fine, but when installing NumPy locally using an editable install (`pip install -e . --no-build-isolation`), for some reason this new conftest file overrides the base conftest file in `numpy/` that the test suite needs. My mentor came up with the clever solution of just using the base conftest file and checking that the test was in the f2py directory. Fun stuff!

I definitely submitted this PR at a bad time, overlapping with the Quansight retreat, so shout out to Nathan, Lysandros, and [Ralf Gommers](https://github.com/rgommers) for taking a look at it despite that!

## CI Job

Finally, the last step to get the NumPy test suite running under parallel threads was to get `pytest-run-parallel` running in NumPy's CI workflow. Coming into this internship, I had some experience with GitHub Actions, having experimented with it when making my own personal Python library. So, my task was to go into the GitHub Action files and put `pytest-run-parallel` somewhere.

Easier said than done. We want to have a whole new `pytest` run here, which will increase the time NumPy's CI jobs will run. It already takes a while to run, so we needed to be clever about it and maybe find a `pytest` run that isn't really needed anymore.

After some trial and error, Nathan suggested I try putting it under the accelerated macOS runs. These tests are already testing Python 3.14t, and are somewhat redundant. Perfect! After figuring out how to do if statements, I was able to put in my shiny new test run into NumPy.

```yml
- name: Test in multiple threads
  if: ${{ matrix.version == '3.14t' && matrix.build_runner[0] == 'macos-14' }}
  run: |
    pip install pytest-run-parallel==0.7.0
    spin test -p 4 -- --timeout=600 --durations=10
```

In this PR, I also added a new option to `spin test`. Throughout this internship, if I wanted to do a test run under `pytest-run-parallel`, I would need to type out `spin test -- --parallel-threads=auto`. I definitely got a feel for it after all these months, but we have the technology to make things easier for us. Now, I can use `spin test -p auto` to get a parallel run going!

**Note:** During my CI PR, we also ran into some more thread-safety issues with Hypothesis that were fixed with the latest version. And so, mirroring my very first PR, I again went back and bumped the Hypothesis version. What a poetic way of wrapping up the project!

# Part Six: Conclusion

And that was my journey throughout this internship. It was very rewarding working with such a large codebase, and learning how to contribute to it. I learned so much about the ins-and-outs of `pytest`, and how Python works with multithreading. I didn't even get into my process of learning all the intricacies with git, and the confidence I started to grow with submitting PRs and issues to various repos.

I want to thank my mentor and the folks who helped me out throughout the project and took the time to look at my PRs. I also want to thank Melissa for coordinated the internship and making sure we all knew what we were doing, and the other interns for being a wonderful bunch of folks to meet with! And finally, many thanks to Quansight for giving me the opportunity to learn and grow as an open-source developer.
