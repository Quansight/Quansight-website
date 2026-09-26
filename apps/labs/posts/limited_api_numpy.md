---
title: 'The things you own end up owning you'
authors: [pratham-hole]
published: September 30, 2026
description: 'A recap of my Quansight internship porting NumPy extension modules to the Limited API: heap types, swapping macros for function calls, and the side quest it started, getting NumPy ready for subinterpreters.'
category: [PyData ecosystem, Packaging, Internship]
featuredImage:
  src: /posts/limited_api_numpy/hero.png
  alt: 'The NumPy logo above a diagram of two stacked layers on a dark grid. The top layer looks like a circuit board and is labelled Limited API and Stable ABI, abi3. The layer under it is labelled CPython and is split into 3.13, 3.14 and 3.15. A caption reads Porting NumPy to the Limited API.'
hero:
  imageSrc: /posts/limited_api_numpy/hero.png
  imageAlt: 'The NumPy logo above a diagram of two stacked layers on a dark grid. The top layer looks like a circuit board and is labelled Limited API and Stable ABI, abi3. The layer under it is labelled CPython and is split into 3.13, 3.14 and 3.15. A caption reads Porting NumPy to the Limited API.'
---

_**Note:** if you've ever wondered why Python libraries like NumPy are so fast, how Python and C work together under the hood, or what buzzwords like the GIL, free-threading, multiprocessing and subinterpreters actually mean, this post is made for you. There are a few C snippets along the way, but the text explains each one, so you can follow along even if you don't write C._

Hey all, welcome to the blog! If you're reading this (and no, it's not too late), you're either a friend I personally begged to read it or a fellow geek. Both are my kind of people, so welcome!

Here's the deal: I yap, you listen, and I sneak in pop culture references (starting with the title) and puns along the way. That's on purpose. You've been warned. In return, you'll learn a lot. Even if you're a Python geek, you'll probably still pick up something new, especially if you maintain a C extension.

I spent the last three wonderful months working on NumPy as a Quansight intern, under the mentorship of Matti Picus, Nathan Goldbaum and Kumar Aditya. I actually started contributing before the internship began, mostly in masked arrays (`numpy.ma`), which I'd been using in SunPy. Not everyone cares about masked arrays, but I did, so I fixed a few things.

My internship project was all about the Limited API. So what is this Limited API thing?

Hold that thought. First, let's answer a few questions in order, so the non-Python folks can keep up too.

## How is NumPy so fast when Python is so… not?

Python is famously slow at crunching numbers. In a plain Python list, every number is a full-blown Python object with its own type info and reference count, scattered around memory. Loop over a million of them and the interpreter has to check what each one is, one at a time. It's like a bouncer re-checking the ID of every guest every time they walk past.

NumPy skips all that. An array stores raw numbers packed side by side in one block of memory, all the same type. So when you write:

```python
result = arr * 2
```

you make one Python call, and NumPy runs a tight loop in compiled C over the whole block. No bouncer, no ID checks.

And there's more muscle under the hood. Modern CPUs support SIMD (Single Instruction, Multiple Data), which lets one instruction work on several numbers at once. Buy one, get several free. NumPy has hand-tuned SIMD code for lots of common operations. For matrix multiplication and other linear algebra, NumPy hands the work off to BLAS and LAPACK libraries like OpenBLAS. People have been optimizing BLAS for decades. When it's time to enter the Matrix, NumPy calls the One.

So NumPy is basically a mullet: business in the front (Python), party in the back (C).

## Wait, what's CPython?

Just in case: when people say "Python," they almost always mean CPython, the reference implementation of Python, written in C. If you downloaded Python from python.org, CPython is what you're using.

CPython also provides the glue that sticks C to Python: the C API. It's a giant toolbox of functions, macros and structs (`PyDict_New()`, `PyLong_FromLong()`, `PyTuple_GET_ITEM()` and hundreds of their friends). These let C code create and work with Python objects. NumPy does its heavy lifting in C with this toolbox and compiles that code into extension modules (`.so` files on Linux and macOS, `.pyd` on Windows). Python then imports them like any other module.

![Flow diagram. NumPy's C code, which does the heavy lifting, goes into a C compiler. CPython's C API (functions, macros, structs) also feeds into the compiler. The compiler builds an extension module, a .so or .pyd file, which Python then loads with import numpy.](/posts/limited_api_numpy/c_extension_build_flow.png)

Here's the problem. For years, NumPy and packages like it have used everything the C API offers, with no boundaries whatsoever. NumPy runs on the full C API the way House runs on Vicodin: it kills the pain, it gets results, and every October, when CPython ships a new version, the withdrawal starts over. That includes macros that read straight out of CPython's internal structs at fixed memory offsets. Those internals are allowed to change between Python versions, so a binary built for Python 3.13 only works on 3.13.

So every NumPy release needs a separate binary wheel for every OS, every CPU architecture and every Python version, and free-threaded builds count separately too. NumPy 2.5.3, for example, ships 65 wheels on PyPI for Python 3.12 to 3.15. Gotta build 'em all. And when a brand-new Python comes out, older NumPy releases simply have no wheels for it. The maintainers tell me this is painful. I don't package and ship NumPy myself, so I'll take their word for it, but it sounds like the kind of thing that gives you gray hair.

![A grid of every wheel in the NumPy 2.5.3 release. Rows are platforms: four macOS builds (arm64 for macOS 14.0+ and 11.0+, x86-64 for 14.0+ and 10.13+), four Linux builds (x86-64 and arm64, each for glibc and musl) and three Windows builds (x86-64, arm64 and 32-bit x86). Columns are Python 3.12, 3.13, 3.14 and 3.15, plus free-threaded 3.14t and 3.15t. Every cell has a wheel except Intel Mac 3.14t, for 65 wheels in total. A note says that from 3.14 on the Intel Mac floor is macOS 10.15+, and that macOS 14.0+ wheels use Apple's Accelerate while older macOS wheels bundle OpenBLAS.](/posts/limited_api_numpy/numpy_2_5_3_wheel_matrix_65.png)

The full C API is the great power. The build matrix is the great responsibility. (Sorry, Uncle Ben.)

## So what is the Limited API?

The Limited API is a subset of the C API that CPython promises to keep stable. Or, in the immortal words of Kevin from The Office: why use a lot of API when few API do trick?

If your extension sticks to the Limited API, you pick a minimum Python version, say 3.13, and compile once. In C, that's `#define Py_LIMITED_API 0x030D0000` before including `Python.h`. In practice your build tool usually handles it: in Meson, you add `limited_api: '3.13'` to an extension module and Meson defines it for you (more on that below). The resulting wheel works on 3.13 and every version after it. These are called `abi3` wheels because they target CPython's Stable ABI (Application Binary Interface). The Limited API is the promise for your source code, and the Stable ABI is the same promise for your compiled binary.

So instead of one wheel per OS × architecture × Python version, you get one wheel to rule them all (per OS and architecture, anyway). Python 3.16 drops? Your old wheel just works.

One asterisk: `abi3` doesn't cover free-threaded builds. Python 3.15 adds a separate flavor for them, `abi3t` ([PEP 803](https://peps.python.org/pep-0803/)). It's stricter: `PyObject` itself becomes opaque, so defining modules and most classes needs new APIs.

![Two diagrams compared. Top, full C API: the same C source needs a separate build for Python 3.13, 3.14 and 3.15, each working only on its own version, and Python 3.16 needs a new build. Bottom, Limited API: the same C source makes one abi3 build targeting 3.13 and up, which works on Python 3.13, 3.14, 3.15 and 3.16. A note says this is per OS and CPU architecture, and that free-threaded builds are not covered by abi3.](/posts/limited_api_numpy/full_vs_limited_api_wheels.png)

If NumPy shipped `abi3` wheels (it doesn't yet, more on that later) and had dropped Python 3.12, the 65 wheels from earlier would shrink to 32. The free-threaded columns stay exactly the same:

![The same grid if NumPy shipped abi3 wheels. The four regular Python columns collapse into one column, 3.13+ (abi3), with one wheel per platform, while the free-threaded 3.14t and 3.15t columns stay the same. The total drops from 65 to 32. A note says one abi3 wheel per platform covers 3.13, 3.14, 3.15 and future versions, assuming 3.12 has aged out, and that free-threaded builds still need their own wheels.](/posts/limited_api_numpy/numpy_limited_api_wheel_matrix_32.png)

## How do you make NumPy Limited API compatible?

The first rule of Limited API Club: you do not touch CPython's internals. The second rule of Limited API Club: you couldn't if you tried. Define `Py_LIMITED_API` and the struct layouts vanish from the headers, so `PyTypeObject` becomes an incomplete type and reaching for a field is a compile error, not a code review comment. These aren't the fields you're looking for. If you follow CPython's docs, the work comes down to two big changes.

### 1. Hasta la vista, static types

NumPy defines a lot of Python types in C. Traditionally these are static types: a giant `PyTypeObject` struct filled in field by field at compile time and shared by the whole process. "Why are you the way that you are, `PyTypeObject`?!" (CPython's Toby.) The Limited API hides that struct's layout, so static types are out. Instead, you describe the type with a spec and let CPython build it at runtime as a heap type (simplified example):

```c
/* Before: a static type, laid out field by field */
static PyTypeObject Foo_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    .tp_name = "numpy.Foo",
    .tp_basicsize = sizeof(FooObject),
    .tp_dealloc = foo_dealloc,
    .tp_flags = Py_TPFLAGS_DEFAULT,
};

/* After: a heap type, built from a spec at runtime */
static PyType_Slot foo_slots[] = {
    {Py_tp_dealloc, foo_dealloc},
    {0, NULL},
};

static PyType_Spec foo_spec = {
    .name = "numpy.Foo",
    .basicsize = sizeof(FooObject),
    .flags = Py_TPFLAGS_DEFAULT,
    .slots = foo_slots,
};

/* during module init */
PyObject *foo_type = PyType_FromModuleAndSpec(module, &foo_spec, NULL);
```

There's an honesty upgrade in here too. A static type is baked into the binary and never really goes away, so its reference count is decoration. A heap type is an ordinary object: the count tracks who is actually using it, and when the last user lets go, the type is freed. A static type's refcount will tell you anything you want to hear. _♪ Heaps don't lie ♪_

[CPython's guide to isolating extension modules](https://docs.python.org/3/howto/isolating-extensions.html) walks through converting static types to heap types.

### 2. Leave the macro, take the function call

Lots of handy C API macros aren't in the Limited API because they read struct fields directly. Each one has a spot, the way Sheldon has a spot: a fixed offset it goes back to every single time. The Limited API takes the spot away, because CPython wants to be free to rearrange the furniture between releases.

Can we have `PyTuple_GET_ITEM`? We have `PyTuple_GET_ITEM` at home. `PyTuple_GET_ITEM` at home:

```c
/* Before: a macro that reads the tuple's memory directly */
PyObject *item = PyTuple_GET_ITEM(args, 0);

/* After: a real function call that checks bounds (and can fail) */
PyObject *item = PyTuple_GetItem(args, 0);
if (item == NULL) {
    return NULL;
}
```

The same goes for friends like `PyList_GET_ITEM` and `PyTuple_GET_SIZE`, and for reaching into type fields like `Py_TYPE(obj)->tp_name`. Each gets swapped for a Limited-API-approved equivalent. For type fields, that means functions like `PyType_GetSlot()` and `PyType_GetName()`. Say my name. Under the Limited API you can't read it off the struct, so you have to ask the type itself: `PyType_GetName()`.

By the end of a port, you and the macros are done. _♪ Now you're just a macro that I used to know ♪_

The function versions are a tiny bit slower. In most of NumPy that's noise, because the hot loops run over raw memory without touching the C API at all. But it's why benchmarks matter for this project.

A couple of bonus gotchas for my fellow C extension folks. First, once you set `Py_LIMITED_API` to 3.11 or higher, `Python.h` stops including `<stdio.h>`, `<stdlib.h>`, `<string.h>` and `<errno.h>` for you, and from 3.13 it also drops `<ctype.h>` and `<unistd.h>`, so include what you use yourself. Second, instances of a heap type hold a reference to their type, so your `tp_dealloc` has to `Py_DECREF` the type after freeing the object. Forget that one and you get a leak that looks like a dozen other problems first. It's never lupus. It's always a reference count.

## Where things stand

Ported and merged so far:

- **`numpy.random`:** `_bounded_integers`, `_common`, `bit_generator`, `_mt19937`, `_philox`, `_pcg64`, `_sfc64`, `_generator`, `mtrand`
- **`numpy.fft`:** `_pocketfft_umath`
- **`numpy.linalg`:** `lapack_lite`, `_umath_linalg`
- **`numpy._core` test modules:** `_rational_tests`, `_umath_tests`, `_struct_ufunc_tests`, `_operand_flag_tests`, `_reduction_loop_tests`, `_multiarray_tests`, `_simd`

That leaves the final boss: `multiarray` itself (`_multiarray_umath`), the core module that basically is NumPy. Wish me luck. I'm going in. (Don't say it, Michael.)

### Plot twist: it's off by default

Here's the part that surprises people. Those ported modules would be running on the Limited API right now, if it weren't for one meddling build option. A normal NumPy build still uses the full C API. The Limited API build is opt-in, and NumPy's top-level `meson.build` switches it off:

```
project(
  'NumPy',
  'c', 'cpp', 'cython',
  default_options: [
    # ...
    'python.allow_limited_api=false',
  ],
)
```

`python.allow_limited_api` is a built-in Meson option. Meson's own default is `true`, and NumPy flips it to `false`. Each ported module then asks for the Limited API with the `limited_api:` argument, like the `numpy.random` modules do:

```
py.extension_module(gen[0],
  # ...
  limited_api: py_limited_api,  # '3.13'
)
```

While the option is `false`, Meson ignores `limited_api:` and builds the module against the full C API, same as before. So the NumPy wheels on PyPI today are built exactly the way they always were. On free-threaded Python, `py_limited_api` is left empty because `abi3` doesn't cover those builds.

Until `multiarray` is ported, turning it on can't give you an `abi3` wheel anyway, since every module in the wheel has to be on the Limited API for that. But you can already build the ported modules that way:

```bash
spin build -- -Dpython.allow_limited_api=true
# or, without spin
pip install . -Csetup-args=-Dpython.allow_limited_api=true
```

NumPy's CI does the same in its debug job and runs the test suite on the result, so nobody can quietly sneak a banned macro back in. You shall not pass.

<!-- ### What about speed?

Trading macros for function calls sounds scary for a library that lives and dies by speed, so I benchmarked a normal build against a Limited API build of the ported modules. The setup: **[TODO: machine, OS, Python version, and benchmark tool, for example asv]**. The short version: **[TODO: overall result, for example "most benchmarks stayed within X% of the normal build"]**. The biggest change was in **[TODO: benchmark name]**, at **[TODO: X%]** slower, because **[TODO: reason]**. **[TODO: link to the full results or the PR]** -->

<!-- TODO: benchmark chart or table, saved in apps/labs/public/posts/limited_api_numpy/ -->

## What does this mean for everyone else?

First, the question everyone asks: will NumPy ship `abi3` wheels? Not yet. Being able to build with the Limited API is step one. Actually shipping `abi3` wheels is a separate call for the maintainers, and there's plenty to weigh.

All of NumPy has to build first, and `multiarray` is the final boss for a reason. Then there's speed. Function calls cost a little more than macros, and NumPy doesn't shrug off slowdowns, so benchmarks get the final say. Also, `abi3` only gets rid of the per-Python-version wheels. You still need one wheel per OS and architecture. Free-threaded builds are their own saga. They'd need `abi3t`, where an extension's own structs can no longer start with a `PyObject`, and NumPy's array object does exactly that.

### I maintain a package like SciPy. What happens to me?

Say you maintain SciPy, or a package like it: lots of compiled C, C++, Cython and Fortran code that talks to NumPy's C API.

Short answer: nothing breaks, and nothing changes until you decide it should. The longer answer depends on which of these three questions you're asking.

**1. Does NumPy's Limited API work change anything for me today?** No. Your extension doesn't care how NumPy compiled its own modules. It talks to NumPy through NumPy's own C API: when your module calls `import_array()`, it grabs a table of function pointers (the `_ARRAY_API` capsule) from NumPy at runtime. That table is the same whether NumPy was built with the full C API or the Limited API. So you keep building against the regular NumPy wheel from PyPI, your existing wheels keep working, and nobody has to recompile NumPy for you.

**2. What if NumPy ships `abi3` wheels one day?** Then you mostly win without doing anything. Today, when a new Python comes out, SciPy's CI can't even install NumPy until there's a NumPy build for that Python: release wheels, nightly wheels, or NumPy compiled from source in CI. An `abi3` NumPy wheel would install on a new Python the day it comes out (the regular build, not the free-threaded one), so your testing could start right away. Your own wheels are a different story: as long as SciPy builds with the full C API, you still need one SciPy wheel per Python version.

**3. What if I want `abi3` wheels for my own package?** Same diet, your kitchen:

1. **Put your own code on the diet.** Your C, C++ and Cython code has to stick to the Limited API. The playbook above applies: heap types instead of static types, and function calls instead of macros that poke at structs. Cython 3.1 or newer can generate Limited API code for you, which is how NumPy's own `numpy.random` modules build.
2. **Check your other tools too.** A project like SciPy doesn't only use Cython. If you use a C++ binding library or generated Fortran wrappers, check whether that tool supports the Limited API before you plan around it. If it doesn't, the modules built with it keep your whole wheel off `abi3`.
3. **Build against NumPy 2.0 or newer.** NumPy's headers work with `Py_LIMITED_API` defined, and they hide the few pieces that need the full C API. For example, since NumPy 2.0, `PyArrayScalar_VAL` isn't available in a Limited API build (use `PyArray_ScalarAsCtype` instead). NumPy's own test suite checks this. It builds small Limited API modules in C and Cython for every NumPy target version from 2.0 up (set with `NPY_TARGET_VERSION`) and imports each one.
4. **Ask for the Limited API in your build.** With Meson 1.3 or newer, add `limited_api: '3.13'` (or whatever minimum Python you support) to each `py.extension_module()`. Meson's default for `python.allow_limited_api` is already `true`, so you don't have to flip anything the way NumPy does. If you use meson-python, set `limited-api = true` under `[tool.meson-python]` in `pyproject.toml`, and your wheel gets tagged `abi3`. meson-python also checks every extension module in the wheel and stops the build if one of them isn't built for the Limited API.

And a couple of bigger-picture wins:

- **NumPy is the stress test.** If the most C-API-hungry library in the ecosystem can live within the Limited API, your extension probably can too.
- **Day-one wheels.** If NumPy does ship `abi3` wheels someday, new Python versions get working NumPy on day one, and everything that depends on NumPy stops waiting in line.

## The side quest bigger than the main quest: subinterpreters

My internship was supposed to be about the Limited API. Then I got to heap types, and heap types turned out to be the front door to a completely different feature: subinterpreters. So I ended up working on both, and there's now a [NumPy tracking issue for subinterpreter support](https://github.com/numpy/numpy/issues/32451).

### Wait, what's a subinterpreter?

A normal Python process starts with one interpreter, the main one: one set of imported modules, one set of builtins, one GIL. A subinterpreter is an extra interpreter living inside the same process, with its own modules, its own builtins and, since Python 3.12, its own GIL ([PEP 684](https://peps.python.org/pep-0684/)). You can create as many as you need, and threads in different interpreters can run Python code at the same time, all inside one process.

Python 3.14 made this reachable from Python itself with the new `concurrent.interpreters` module ([PEP 734](https://peps.python.org/pep-0734/)):

```python
import concurrent.interpreters as interpreters

interp = interpreters.create()
interp.exec("print('hello from another interpreter')")
interp.close()
```

![One Python process drawn as a dashed box. Inside it sit two independent interpreters side by side, each labelled with its own modules, own builtins and own GIL, and each with an arrow down to its own separate copy of numpy. A caption says threads in different interpreters run Python at the same time, in one process, and that they share nothing.](/posts/limited_api_numpy/subinterpreters_one_process.png)

### Why would anyone want this?

Python gives you three ways to put more than one CPU core to work, and each one has a catch.

**Multiprocessing** is what most people reach for today. It works and it's properly isolated, but every worker is a whole separate Python process: slow to start, its own copy of memory, and everything you send between workers gets pickled, copied and unpickled on the other side. Handing a big array to four workers means four copies.

**Subinterpreters** keep the isolation and drop the process. They start faster than processes, they live in one address space, and each one has its own GIL, so they really do run at the same time. Data still doesn't flow freely. Most objects get copied with `pickle` when they cross over, simple immutable ones like `int`, `str` and `bytes` cross cheaply, and `memoryview` is one of the few things that actually shares memory between interpreters. Shared nothing by default, like multiprocessing, but a lot cheaper.

**Free-threading** ([PEP 703](https://peps.python.org/pep-0703/)) takes the other road and removes the GIL, so ordinary threads in one interpreter run in parallel with real shared memory and no copying at all. For array work, where the whole point is one big block of memory you'd rather not duplicate, that's usually the faster answer. Python 3.14 made it officially supported ([PEP 779](https://peps.python.org/pep-0779/)), but it's still a separate build, not the default. And no GIL means no free lunch: you do your own locking, because when you play the game of threads, you win or you deadlock. NumPy already supports it, which is not at all the same as saying every array operation is thread safe.
NumPy runs on the full C API the way House runs on Vicodin: it works, it works fast, and nobody wants to talk about the dependency.
So, roughly: free-threading when you want speed on shared data, subinterpreters when you want isolation without paying for processes, multiprocessing when you want isolation and don't mind the bill. Today NumPy works on the free-threaded build, but it's still marked "not supported" for subinterpreters. The rest of this post is about changing that.

### How the Limited API walked me into it

Here's the overlap. The Limited API needs heap types because `PyTypeObject`'s layout is hidden. Subinterpreters need heap types for a completely different reason: a static type is one struct shared by the entire process, `tp_dict` and reference counts included, so two interpreters would be scribbling in the same notebook. Different reasons, same conversion. Once I was rewriting types anyway, the subinterpreter work was right there.

![Two panels compared. Top, a static type: two interpreters both point to a single shared PyArray_Type struct with one tp_dict and one refcount. Bottom, a heap type: each interpreter points to its own PyArray_Type, built by PyType_FromModuleAndSpec. A caption says this is the same conversion the Limited API needs, for a different reason.](/posts/limited_api_numpy/static_vs_heap_types.png)

### What subinterpreter support actually needs

CPython's [Isolating Extension Modules](https://docs.python.org/3/howto/isolating-extensions.html) guide is the checklist. For NumPy it comes down to three things:

1. **Multi-phase initialization ([PEP 489](https://peps.python.org/pep-0489/)).** With old-style (single-phase) init, the module is set up once and CPython copies its contents into any other interpreter that imports it, so they end up sharing state. Multi-phase init lets every interpreter build its own fresh module object. This is [issue #29021](https://github.com/numpy/numpy/issues/29021), an effort Adam Turner started before I arrived.
2. **Per-module state.** Lots of C extensions keep their data in global C variables: caches, references to Python objects, module-level settings. That's one Netflix account for the whole extended family, and someone is definitely ruining your recommendations. Phil's-osophy: if it's everybody's variable, it's nobody's variable. Each module object needs its own private struct instead, reached through `PyModule_GetState()`. Tracked in [issue #31930](https://github.com/numpy/numpy/issues/31930).

   ![Two panels compared. Top, before: two interpreters that both import numpy point to one shared block of C globals holding caches, cached objects and settings. Bottom, after: each interpreter has its own module state, reached through PyModule_GetState. A caption says each module object carries its own private struct.](/posts/limited_api_numpy/global_vs_per_module_state.png)

3. **Heap types.** The same conversion the Limited API wants, for the reason above. Tracked in [issue #32747](https://github.com/numpy/numpy/issues/32747).

### Where it stands today

Right now NumPy flat out tells CPython that it isn't ready. From `multiarraymodule.c`:

```c
static struct PyModuleDef_Slot _multiarray_umath_slots[] = {
    {Py_mod_exec, _multiarray_umath_exec},
    {Py_mod_multiple_interpreters, Py_MOD_MULTIPLE_INTERPRETERS_NOT_SUPPORTED},
    /* ... */
};
```

So you get an error at import time instead of a mysterious crash later. The error fires inside the subinterpreter and comes back to you wrapped in an `ExecutionFailed` (trimmed here, because NumPy also adds its long "PLEASE READ THIS" troubleshooting message):

```python
>>> import concurrent.interpreters as interpreters
>>> interp = interpreters.create()
>>> interp.exec("import numpy")
Traceback (most recent call last):
  ...
concurrent.interpreters.ExecutionFailed: ImportError:
  ...
Original error was: module numpy._core._multiarray_umath does not support loading in subinterpreters
```

What has landed so far:

- **Multi-phase init:** `_multiarray_umath` now starts up through a `Py_mod_exec` slot.
- **Per-module state:** `lapack_lite` in [PR #31928](https://github.com/numpy/numpy/pull/31928) and `_multiarray_umath` in [PR #31992](https://github.com/numpy/numpy/pull/31992). That second one parks the state behind a transitional global, and follow-up PRs are replacing those reads with real per-module lookups so the global can go.
- **Heap types:** the first batch of four self-contained types landed in [PR #32502](https://github.com/numpy/numpy/pull/32502): `flagsobj`, `busdaycalendar`, `_array_converter` and the array function dispatcher. A second batch, with the two array method types and two internal iterators, is in review in [PR #32552](https://github.com/numpy/numpy/pull/32552). What's left after that is the scary half: the other iterators (`flatiter`, `broadcast` and `nditer`), about 35 scalar types, `PyUFunc_Type`, and then `PyArray_Type`, `PyArrayDescr_Type` and `PyArrayDTypeMeta_Type`.

For NumPy to load in interpreters with their own GIL, which is what `concurrent.interpreters` creates, that flag has to become `Py_MOD_PER_INTERPRETER_GIL_SUPPORTED`. That can only happen once every module is isolated and no shared global state is left. That's still a long way off, but every PR gets it a little closer, and the Limited API work and the subinterpreter work are pushing the same rock up the same hill.

### What changes when it's done

Say you want to spread some NumPy work over four CPU cores. Today you'd use a process pool, and it works fine:

```python
from concurrent.futures import ProcessPoolExecutor
import numpy as np

def work(seed):
    rng = np.random.default_rng(seed)
    return float(rng.standard_normal(1_000_000).std())

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=4) as pool:
        print(list(pool.map(work, range(4))))
```

Python 3.14 already ships `InterpreterPoolExecutor`, which has the same interface. Once NumPy supports subinterpreters, you swap the executor and move the import inside the worker, because every interpreter loads its own modules. The Mandalorian would approve. This is the way:

```python
from concurrent.futures import InterpreterPoolExecutor

def work(seed):
    import numpy as np  # each interpreter imports its own numpy
    rng = np.random.default_rng(seed)
    return float(rng.standard_normal(1_000_000).std())

if __name__ == "__main__":
    with InterpreterPoolExecutor(max_workers=4) as pool:
        print(list(pool.map(work, range(4))))
```

Same code, same results, but the four workers are interpreters inside one process instead of four separate Python processes, so they start faster and use less memory. Data still gets copied when it crosses between interpreters, though, so for sharing one big array, free-threading is still the better tool. Today, the interpreter version fails as soon as a worker tries to import NumPy.

That's all from me for now. Huge thanks to Matti, Nathan and Kumar for the mentorship. If you maintain a C extension and want to go on the same diet, [CPython's C API stability docs](https://docs.python.org/3/c-api/stable.html) are the place to start. And to my friends who read this far out of pure loyalty: coffee and fries are on me, all you have to do is ask.
