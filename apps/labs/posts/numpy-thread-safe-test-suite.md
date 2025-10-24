---
title: Exploring & Improving the Thread Safety of NumPy's Test Suite
description: WIP
published: October 23, 2025
authors: [britney-whittington]
category: [Developer workflows, OSS Experience, Internship]
featuredImage:
  src: /posts/numpy-thread-safe-test-suite/feature.png
  alt: 'An illustration of a brown and white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/numpy-thread-safe-test-suite/hero.webp
  imageAlt: 'The NumPy logo'
---

Hello! My name is Britney Whittington, and I had the honor of being part of Quansight's 2025 cohort of interns. For the past three months, I worked with [Nathan Goldbaum](https://github.com/ngoldbaum) and [Lysandros Nikolaou](https://github.com/lysnikolaou) to improve the thread safety of NumPy's test suite. This project involved working with various parts of NumPy and other libraries, and taught me a lot about OSS practices.

With the release of free-threaded builds of Python, it's more important than ever to ensure Python code is thread-safe. This blog post details my journey improving the thread safety of NumPy's test suite. If you ever decide to tackle making your own code and test suite more thread-safe, hopefully my experience is helpful! So, feel free to kick back as I describe how I messed with NumPy's test suite, from my first one-line commit to updating the CI jobs.

(It's a fun coincidence that Hollow Knight: Silksong came out around midway through my internship. Get it? *Silk*song, free-_threaded_?)

## Table of Contents

- [Part One: Background](#part-one-background)
  - [Free-Threaded Python](#free-threaded-python)
  - [The Codebase & Test Suite](#the-codebase--test-suite)
  - [NumPy + Test Suite + pytest-run-parallel = ???](#numpy--test-suite--pytest-run-parallel--)
- [Part Two: Setup](#part-two-setup)
- [Part Three: Discovery](#part-three-discovery)
  - [Test Failures](#test-failures)
  - [Test Marking](#test-marking)
- [Part Four: Modifications](#part-four-modifications)
  - [1. Setup & Teardown](#1-setup--teardown)
  - [2. Random Number Generation](#2-random-number-generation)
  - [3. Temporary Files](#3-temporary-files)
  - [4. Misc Fixes](#4-misc-fixes)
- [Part Five: Wrapping Things Up](#part-five-wrapping-things-up)
  - [1. Thread Unsafe Markers](#1-thread-unsafe-markers)
  - [2. CI Job](#2-ci-job)
- [Part Six: Finale](#part-six-conclusion)

---

## Part One: Background

### Free-Threaded Python

Going into this internship, I was familiar with both Python and NumPy, but this would be my first exposure to free-threaded Python.

What is free-threaded Python? Well, for a more in-depth look into this topic, I would highly suggest visiting the [Python Free-Threading Guide](https://py-free-threading.github.io/) and the [Python doc's how-to](https://docs.python.org/3/howto/free-threading-python.html) on free-threading support. Typically, Python is "GIL-enabled", which means the global interpreter lock is active. The [Python docs](https://docs.python.org/3/glossary.html#term-global-interpreter-lock) defines the GIL as:

> The mechanism used by the CPython interpreter to assure that only one thread executes Python bytecode at a time.

A free-threaded build disables the GIL, allowing Python to use all available CPU cores and run code concurrently. This can be helpful in the field of scientific computing and AI/ML, with the GIL often being difficult to work around. Feel free to check out [PEP 703](https://peps.python.org/pep-0703/) for more information about the motivations behind free-threaded Python.

Of course, you don't just have to read up on articles, you can give it a try yourself! Python's latest version, 3.14, comes with the option to install the free-threaded build (which can be denoted as "3.14t").

### The Codebase & Test Suite

With free-threaded Python getting more support, it's a good idea to ensure your code can handle running on multiple threads. One way of doing this is to run the test suite under multiple threads. The test suite already attempts to test the codebase, so if we run the tests in multiple threads, we could see if the codebase plays nice with threads.

**\*Note**: This approach, while straightforward, will only find a subset of possible issues. If you really want to make sure your codebase can handle multithreading, you may want to do more explicit multithreaded testing. However, this approach can catch a lot of real-world issues in codebases like NumPy that were written with strong assumptions about the GIL in mind.\*

This project was my first major foray into open-source development, so when I saw I would be working with NumPy, I honestly was a little intimidated! NumPy is such a fundamental and widely used library, and I came into this not knowing a lot about how to contribute to something like that! Of course, I had no reason to feel nervous. The NumPy community is wonderful, and I enjoyed my time working with them, lurking around the community meetings, and learning what I could.

Like any other big software project, NumPy has a test suite. During NumPy's lifetime, its test suite followed best-practices, first being written in [unittest](https://docs.python.org/3/library/unittest.html), then [nose](https://nose.readthedocs.io/en/latest/), and now [pytest](https://docs.pytest.org/en/stable/), a popular Python unit testing framework. Due to NumPy's size and lifetime, its test suite is fairly large and contains some older code.

### NumPy + Test Suite + pytest-run-parallel = ???

Now we have the three major parts of the project: free-threaded Python, NumPy, and its test suite written with pytest. So, how do we put these pieces together? How can we get the test suite running under multiple threads? For this, we can employ the help of one last library: [pytest-run-parallel](https://github.com/Quansight-Labs/pytest-run-parallel), a pytest plugin developed by folks here at Quansight to bootstrap multithreaded testing of Python codebases using their existing test suite.

pytest-run-parallel is useful for multi-threading stress testing, exposing thread-safety issues in the test suite. It also sometimes discovers real thread-safety issues in the implementations of libraries.

![How pytest-run-parallel handles running tests. Tests run one-by-one in a thread pool.](/posts/numpy-thread-safe-test-suite/pytest-run-parallel-diagram.png)

> How pytest-run-parallel handles running tests. Tests are run one-by-one in separate thread pool. Basically, a test is run many times in parallel with itself.

**\*Note**: This is distinct from tools like [pytest-xdist](https://pytest-xdist.readthedocs.io/en/stable/). pytest-run-parallel does not speed up the testing time by running all test in the same thread pool. The plugin typically increases testing duration since it runs each test multiple times.\*

---

## Part Two: Setup

With this last tool, we can finally get started with the project! But before I could actually start running NumPy tests, I needed to set up my environment properly.

#### 1. Set up WSL

My PC runs under Windows, and while it does have its merits (I do enjoy gaming from time to time), it often make some parts of software development difficult, especially when it comes to building C code (which NumPy makes use of). To make things easier on me and Nathan (who was using macOS), we decided I should use the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) (or WSL). Thankfully I had some experience with this and already had it installed! Installing WSL is generally as easy as putting `wsl --install` in the terminal of a machine running Windows 10/11.

#### 2. Download free-threaded Python

At the start of my internship, the Python version my mentor suggested I use for the project, 3.14t, was still in development. I had trouble installing it, so my mentor introduced me to [pyenv](https://github.com/pyenv/pyenv), a Python version manager for macOS and Linux. I hadn't used pyenv before, instead preferring to use conda, but it was a elegant solution to the problem of managing and installing multiple versions of Python! To install the development version of 3.14t, all it took was running the command `pyenv install 3.14t-dev`.

**\*Note**: Sometimes I used the "normal" GIL-enabled build of 3.14 instead. When I did that, I had to also make sure the environment variables `PYTHON_CONTEXT_AWARE_WARNINGS` and `PYTHON_THREAD_INHERIT_CONTEXT` were set to true. These ensure warnings and context play nicely with threads. They are set to true on free-threaded builds, and false otherwise. The "What's New" entries in the Python 3.14 release notes describe these variables more in-depth [here](https://docs.python.org/3/whatsnew/3.14.html#concurrent-safe-warnings-control) and [here](https://docs.python.org/3/whatsnew/3.14.html#free-threaded-mode-improvements).\*

#### 3. Create NumPy fork and clone it to my machine

While I didn't have a lot of experience with OSS, I have used git and GitHub before. I will admit I did fight with git from time to time during my internship, but this initial `git clone` was simple enough.

#### 4. Build NumPy locally using spin

To run the NumPy test suite, I had to build it locally first. NumPy recommends using [spin](https://github.com/scientific-python/spin), detailing the steps [here](https://numpy.org/doc/stable/building/index.html) in its developer documentation. After installing the various system and Python dependencies (preferably under a virtual environment), all it took was running `spin build` to get everything built.

#### 5. Install pytest-run-parallel

And finally, the last step is to get pytest-run-parallel. I prefer to use virtual environments when using Python, so after setting one up with venv, I installed the plugin with `pip install pytest-run-parallel`.

---

## Park Three: Discovery

With everything put together, I could finally start testing the NumPy test suite, running `spin test -- --parallel-threads=auto`. "spin test" is how NumPy runs its test suite when built under spin. "--parallel-threads=auto" is a command line option from pytest-run-parallel which activates the plugin, telling it to run each test under the specified number of threads. You can use a specific number of threads or use the keyword `auto`. This looks at the number of available CPU cores and determines the number of threads for you (for me, it was 24).

**\*Note:** If you encounter projects that use spin, like NumPy, putting `--` after the initial spin command will let you pass more options to the underlying command. For example, `spin test -- -sv` will pass `-sv` to the underlying pytest command!\*

Alright, if everything in the test suite was "thread-safe" (aka can run under multiple threads at the same time), then everything should run fine, with no test failures whatsoever! As you might be able to tell, since my project was to improve the thread safety of the test suite, this was not the case at first.

**\*Note:** If you're following along and tried to run NumPy's test suite yourself under pytest-run-parallel just now, you won't run into any failures. I suppose this is a spoiler, but I was able to fix all this! Continue reading to find out how I did this.\*

### Test Failures

For my first couple runs, I was running into numerous errors, and even some hang-ups and crashes. There were large parts of the test suite that were not happy with being ran under multiple threads (aka "thread-unsafe"), and it was now my job to record these errors and figure out why they were failing.

An example of what a test failure may look like is below. Along with this, pytest will detail where the failure occurred, which helps us figure out why failures were happening.

```
PARALLEL FAILED numpy/tests/test_reloading.py::test_numpy_reloading - Failed: DID NOT WARN. No warnings of type (<class 'UserWarning'>,) were emitted.
```

Thread safety issues can come from many sources. Thread safety issues can be something inherit to Python, or even the system itself. For example, anything dealing with the file system can be thread-unsafe. Probably not a good idea to have multiple threads trying to access the same file at the same time. Other failures could come from the test suite itself (pytest has some thread-unsafe features that I'll go more in depth later). And of course, NumPy may have some thread safety issues as well, which is what we were trying to expose and (hopefully) fix!

### Test Marking

So, I went through the entire test suite, recording and marking any test that failed under pytest-run-parallel. One feature of pytest is [markers](https://docs.pytest.org/en/stable/example/markers.html), which pytest-run-parallel makes use of with the `thread_unsafe` marker. Tests with the marker won't run under a thread pool and instead run "normally" under a single thread, letting us avoid these test failures.

```python
@pytest.mark.thread_unsafe(reason="modifies global module state")
def test_ctypes_is_not_available(self):
  ...
```

While I was doing this, I also tried to puzzle out why the tests were failing. For some it was fairly obvious, others not so much. I often asked Nathan for help with this, and over time I started to get a better sense of what may be thread-safe or not.

In the end, I had a large list of tests that were thread-unsafe and now had the job of fixing them. I detailed my findings in [this tracking issue](https://github.com/numpy/numpy/issues/29552) on the NumPy repo (it also links most of the PRs I made for this project if you want to look through them!) and got started.

---

## Part Four: Modifications

My first modification of the NumPy's source code could be called "baby's first commit". One thread safety issue we ran into early on was the usage of [Hypothesis](github.com/HypothesisWorks/hypothesis). NumPy was using an older version of Hypothesis which lacked some thread-safety updates that the project received, so all we had to do was bump the version!

```diff
  setuptools         ; python_version >= '3.12'
- hypothesis==6.104.1
+ hypothesis==6.137.1
  pytest==7.4.0
```

A small one-line change, but I remember being so excited about my first change to this massive codebase. What a rush!

After this, it was time to make some more substantial changes. Most test failures could be sorted into specific categories for why they were failing. I will go in detail on why they were failing, and how I went about fixing them.

### 1. Setup & Teardown

The first thread safety issue I tackled was the one that required the most modifications to the test suite.

#### Problem

One feature of pytest is [xunit setup and teardown methods](https://docs.pytest.org/en/stable/how-to/xunit_setup.html), which was inherited from unittest. Before my internship, the way NumPy typically used this feature was to define variables that various tests would use without needing redefine the same variables over and over again. Nowadays, you may see pytest [fixtures](https://docs.pytest.org/en/stable/reference/fixtures.html#fixture) used more often instead, with the prevalent usage of xunit setup and teardown throughout NumPy's test suite being a sign of its age.

```python
# example of test using xunit setup
class TestClass:
  def setup_method(self):
    self.x = 2

  def test_one(self):
    assert self.x == 2
```

Nothing wrong with old code if it still works of course! Unfortunately, this feature is currently incompatible with pytest-run-parallel and how it handles running tests under multiple threads. Depending on scope, these xunit methods run before (setup) and after (teardown) each test. Even if you don't define a teardown method, pytest has implicit default teardown implementation that it calls. This removes variables that were defined during the setup. When running tests under pytest-run-parallel, this teardown is called before all the threads in a thread pool can finish running the current test. Any test that tries to access the removed variables will fail with an `AttributeError`.

**\*Note**: Overall, pytest isn't very thread-safe, and so a large part of the project was figuring out what to do with thread-safety issues concerning the usage of these setup methods and thread-unsafe fixtures. However, work is currently being done to improve pytest's thread-safety, as detailed in [this issue](https://github.com/pytest-dev/pytest/issues/13768) on pytest's repo.\*

#### Solution

One solution to this early teardown problem is to modify pytest-run-parallel itself. It's possible to hook into pytest and modify how teardown methods are called. However, currently this would be a major undertaking and require a lot more maintenance than the current state of the plugin. [This tracking issue](https://github.com/Quansight-Labs/pytest-run-parallel/issues/14) discusses this problem more in-depth.

Instead, for now we can rewrite these tests to not use xunit setup and teardown. After some trial and error and discussion with members of the NumPy community, we decided on using explicit methods that are called by each test.

```python
# example of test using explicit "creation" methods
class TestClass:
  def _create_data(self):
    return x

  def test_one(self):
    x = self._create_data()
    assert x == 2
```

With this solution, we can simply create and call our own "setup methods", with variables no longer getting deleted too early. Each thread of each test would also then get its own "copy" of the data, meaning they could modify the values to their heart's content (which was another issue, with threads trying to mutate the same data). It was a fairly simple change all things considered, but it took up a large chunk of time in the internship due to how prevalent setup methods were in the test suite.

**\*Note**: Utilizing custom pytest fixtures was another option, however they have their own thread safety issues since they are only created _once_ per test. Thread pools will share data returned by fixtures and potentially create thread-safety issues if tests try mutating the shared fixture data.\*

#### Problem with the Solution

While the pros of this solution aligned with the goals of my project, there were some cons. One problem was that it introduced more lines of code, since you needed to explicitly call the method for each test (which the original setup and teardown methods were used to avoid).

However, the largest issue was that it introduced _stricter testing guidelines_. Overall, making sure the test suite is thread safe will introduce some limitations when it comes to writing tests, but this was perhaps the most noteworthy. This would limit the usage of xunit setup, teardown, and pytest fixtures, and instead encourage a somewhat more unorthodox method of utilizing normal methods to set up variables. This spawned some concern and conversation on the best way of handling this, especially since xunit setup took up such large parts of the test suite. This encouraged me to [post to the NumPy mailing list](https://mail.python.org/archives/list/numpy-discussion@python.org/thread/ZWRN6TJXXE4UZQJ3QLPL7VT26WHRQVWL/) to elicit some feedback (though we probably should've done this earlier on in the project, whoops!). In the end, members of the community agreed with my approach of replacing xunit setup with explicit methods, so we'll just have to be more careful with how we set up test values from now on.

**\*Note**: This may not be a problem forever. If pytest and pytest-run-parallel figure out a way of getting thread-safe setup working, the changes I made could be reverted with some git magic.\*

### 2. Random Number Generation

The next biggest category of test failures involved the usage of `np.random`.

#### Problem

Generally, anything that involves global state and shared data will cause thread safety issues. And well, `np.random` is very much global state! When threads use `np.random`, they are using the same global RNG instance, which can cause test failures when tests rely on seeded results.

Let's say you have a test that relies on seeded results, such as below.

```python
# test using np.random
def test_rng():
  np.random.seed(123)
  x = np.random.rand()
  y = np.random.rand()
  z = np.random.rand()
  ...
```

When this test runs normally under a single thread, you may get results like this for the three variables:

|               | x     | y     | z     |
| ------------- | ----- | ----- | ----- |
| Single Thread | 0.696 | 0.286 | 0.226 |

When this test runs under multiple threads with pytest-run-parallel, the threads fight for the usage of the global RNG. So, you may instead get results like so:

|          | x     | y     | z     |
| -------- | ----- | ----- | ----- |
| Thread 1 | 0.696 | 0.226 | 0.719 |
| Thread 2 | 0.696 | 0.286 | 0.551 |

You can see how the RNG seed is shared between threads, with values from the single-threaded run popping up all over the thread pool. Tests that care about seeded results will fail since they're not getting the results they expect.

#### Solution

Thankfully, NumPy already had a solution for us! Instead of using the global `np.random` instance, we can create local instances with the [RandomState](https://numpy.org/doc/stable/reference/random/legacy.html) class.

```python
# test using RandomState. this will generate the same numbers as np.random!
def test_rng():
  rng = np.random.RandomState(123)
  x = rng.rand()
  y = rng.rand()
  z = rng.rand()
  ...
```

Another somewhat simple solution to a problem that affected large parts of the test suite. Nice!

**\*Note**: Another option was using [NumPy Generators](https://numpy.org/doc/stable/reference/random/generator.html), a newer approach to creating local RNG instances. However, when it comes to test suites, RandomState should be preferred. RandomState's RNG stream will likely never change, whereas Generators may change as they get improved. It also helped that RandomState shares the same RNG as `np.random`, so I didn't need to worry about modifying any of the expected results!\*

### 3. Temporary Files

And finally, the last major change I'll go in-depth with is the usage of temporary files.

#### Problem

Sometimes in test suites, you want to test features that deal with the file system. For this, it's commonplace to utilize fixtures in pytest that create temporary file paths, like `tmp_path` or `tmpdir`. Of course, this can lead to thread safety issues, with the file system being global state. Threads that try to modify the same files at the same time will generate test failures.

#### Solution

How do we fix this? Of course we can't make the file system _not_ global state, but we can be smarter with how we create files.

To make temporary file usage thread safe, we wanted to make sure file paths were unique between threads. One way we thought of early on was appending a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) at the end of file names. This ensured each file created by each thread was completely unique!

```python
# test that creates a unique file between threads
def test_with_file(tmp_path):
  file = tmp_path / str(uuid4())
  ...
```

This did definitely work, but after further consideration, we decided to look elsewhere for a more foolproof solution (though it is a nice general solution for dealing with unique files between threads!).

Here we break the mold a little bit. Instead of messing with NumPy a bunch, how about we take a look at the actual tool I'm using, pytest-run-parallel? With this being a pytest plugin, we can hook into the `tmp_path` fixture and modify it to be thread-safe! This also makes it so anyone using the plugin doesn't need to worry about modifying their tests that use `tmp_path`.

Okay, how do we actually do this? This took a lot of brainstorming, but eventually Nathan, Lysandros, and I settled on directly patching into the `tmp_path` fixture and creating a subdirectory for each thread. Each thread's "version" of the `tmp_path` would then be set to whatever subdirectory was assigned to them. These are the sort of hacky solutions I live for, and it keeps things fairly simple! Each thread, when they try and access the `tmp_path` fixture, would get a modified version with a subdirectory where they can mess around with their files as much as they want.

**\*Note**: I made a few more changes to pytest-run-parallel over the course of my internship. With this similar patching approach, I added some more fixtures that changed between threads, such as the `thread_index` fixture that returned the current thread's index. I also made `tmpdir` thread-safe in a similar way to `tmp_path`.\*

#### Problem with the Solution

Ah, another one of these. While it is a simple solution, it isn't foolproof. With the way I patched `tmp_path`, it currently doesn't get properly patched to be thread-safe when called by _other_ fixtures. I wasn't able to figure out a solution to this during my internship, but it's probably something that can be fixed.

```python
def test_with_file(tmp_path):
  # you're good to go! tmp_path will be
  # thread-safe with pytest-run-parallel
  ...

@pytest.fixture
def file_fixture(tmp_path)
  yield tmp_path / "file"

def test_with_file_two(file_fixture):
  # be careful with this! tmp_path isn't thread-safe here
```

### 4. Misc Fixes

Outside of these three major changes, there were a few other thread-unsafe bugs that I was able to fix. I'll note some here:

- There were some usages of `@pytest.mark.parametrize` that led to data races. We concluded that the test threads were trying to modify the parameterized values at the same time. Kinda weird, but it was easily fixed with `.copy()` (a classic solution to all sorts of mutation errors that I happen to be a fan of, thank you Lysandros for this suggestion).

- Running tests in parallel can sometimes result in issues with [warnings](https://docs.python.org/3/library/warnings.html) if you aren't using 3.14t (these thread-safety issues were addressed in [these](https://github.com/python/cpython/issues/128384) [issues](https://github.com/python/cpython/issues/91505) on the CPython repo). Any sort of global warnings filter or capture can lead to thread-unsafe failures, so it's important to keep warnings filters under context managers of some sort.

---

## Part Five: Wrapping Things Up

With these test suite modifications under my belt, there were 2 more things to work on:

1. Figuring out what to do with all the tests that I couldn't fix.
2. Getting this all running under NumPy's CI.

### 1. Thread Unsafe Markers

#### Problem

While working through the test suite, I sometimes ran into tests that were thread-unsafe in a way that made fixing them either very difficult or impossible. Maybe they were specifically testing things that were thread-unsafe, like global modules or docstrings. Maybe they modified environment variables. Maybe they required a lot of memory to run and would completely and utterly crash the terminal when ran under multiple threads (`wsl --shutdown` started to become my best friend over the course of this internship). Or maybe they were using thread-unsafe functionally that I didn't have the scope to fix during the course of my internship.

Regardless, we still wanted to make sure these wouldn't cause issues when the test suite was run under pytest-run-parallel. We also wanted to make sure that we documented _why_ these tests were thread-unsafe, just in case anyone in the future wanted to take a stab at fixing them.

#### Solution

Thankfully, we already have the solution for both of these goals, the `thread_unsafe` marker! It allowed us to run these tests under singular threads and record why they're thread-unsafe in the "reason" field. [One of my last PRs](https://github.com/numpy/numpy/pull/29816) during the internship involved marking up all the remaining tests that were thread-unsafe. That PR got nearly 100 comments over the course of 2-3 weeks and led to me making more PRs when I realized some of these tests actually could be fixed, whoops!

One thing that required some interesting solutions was marking the entire `np.f2py` module test suite as thread-unsafe. Of course, you could go in and put a marker on every test, but that's a bit tedious and messy. Instead, I tried putting a [conftest.py file](https://docs.pytest.org/en/stable/how-to/writing_plugins.html#conftest-py-plugins) in the f2py testing folder that would mark the tests as thread-unsafe with `pytest_itemcollected`.

```python
# numpy/f2py/tests/conftest.py
@pytest.hookimpl(tryfirst=True)
def pytest_itemcollected(item):
  item.add_marker(pytest.mark.thread_unsafe(reason="f2py tests are thread-unsafe"))
```

This worked, sort of. When NumPy was built with spin it worked as expected, but when installing NumPy locally using an editable install (`pip install -e . --no-build-isolation`), for some reason this new conftest file would override the base conftest file in `numpy/` that the test suite needed to run properly. My mentor came up with the clever solution of just using the base conftest file and checking that the test was in the f2py directory. Fun stuff!

### 2. CI Job

Finally, the last step to get the NumPy test suite running under parallel threads was to get pytest-run-parallel running in NumPy's CI workflow. NumPy's CI notably runs whenever someone submits a PR, so this would mean any new code coming in would be tested against pytest-run-parallel. This ensures NumPy's test suite will stay thread-safe! My task was to go into the [GitHub Action](https://docs.github.com/en/actions) files that the CI used and put pytest-run-parallel somewhere.

Easier said than done. We were adding a whole new pytest run, which would increase the time the NumPy CI jobs would run for. It already took a while, so we needed to be clever about this. Instead of making a new CI job, perhaps we could replace one? Maybe we could find a pytest run that ran Python 3.14t and wasn't really needed anymore.

After some trial and error, Nathan found a good spot in the macOS CI runs. Perfect! Once I figured out how to write bash if-statements, I was able to add my shiny new pytest-run-parallel run to NumPy.

```yml
- name: Test in multiple threads
  if: ${{ matrix.version == '3.14t' && matrix.build_runner[0] == 'macos-14' }}
  run: |
    pip install pytest-run-parallel==0.7.0
    spin test -p 4 -- --timeout=600 --durations=10
```

[In the PR where I added this CI job](https://github.com/numpy/numpy/pull/30005), I also added a new option to `spin test`. Throughout this internship, if I wanted to do a test run under pytest-run-parallel, I would need to type out `spin test -- --parallel-threads=auto`. I definitely got a feel for it after all these months, but let's try to make things easier for ourselves. Now, you can instead use `spin test -p auto` to get a parallel run going in NumPy!

**\*Note**: During this PR, we also ran into some more thread-safety issues with Hypothesis that were fixed with the latest version. And so, mirroring my very first PR, I went back and bumped the Hypothesis version again. What a poetic way of wrapping up the project!\*

---

## Part Six: Conclusion

And that was my journey throughout this internship! It was a very rewarding experience, being able to work with such a large and historic codebase and learn how to contribute to it. I learned so much about the ins-and-outs of pytest, how Python works with multithreading, and all sorts of intricacies with git and open-source development. But perhaps the most noteworthy thing this internship gave me was the confidence to contribute to and interact with open-source communities. I definitely want to keep going after this and continue to contribute to open-source projects!

I want to thank my mentors and the folks who helped me out throughout the project and took the time to look at my PRs. I also want to thank Melissa for coordinating the internship and making sure we all knew what we were doing, and the other interns for being a wonderful bunch of folks to talk to! And finally, many thanks to Quansight for giving me the opportunity to learn and grow as an open-source developer.
