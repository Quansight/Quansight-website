---
title: 'What Every Python Developer Should Know About the CPython ABI'
authors: [nathan-goldbaum]
published: July 10, 2026
description: 'An introduction to the concept of the Application Binary Interface (ABI), the various CPython ABIs, and the new abi3t stable ABI in Python 3.15.'
category: [PyData ecosystem]
featuredImage:
  src: /posts/python-abi-abi3t/cpython_api_layers_listing.png
  alt: 'Five nested ellipses illustrating the layering of the Python C API. The outermost ellipse is gray and labeled "Internal API". The next enclosed ellipse is red and is labeled "Private API". The next enclosed ellipse is yellow and is labeled "Unstable API". The next enclosed ellipse is blue and labeled "Version-specific API". The next enclosed ellipse is green and is labeled "Limited API".'
hero:
  imageSrc: /posts/python-abi-abi3t/cpython_api_layers_hero.png
  imageAlt: 'Five nested ellipses illustrating the layering of the Python C API. The outermost ellipse is gray and labeled "Internal API". The next enclosed ellipse is red and is labeled "Private API". The next enclosed ellipse is yellow and is labeled "Unstable API". The next enclosed ellipse is blue and labeled "Version-specific API". The next enclosed ellipse is green and is labeled "Limited API".'
---

# What Every Python Developer Should Know About the CPython ABI

The CPython Application Binary Interface (ABI) backs Python's main superpower: the ability to easily call into native C, C++, Rust, or Fortran code and for that code to call back into the interpreter and update the state of Python objects.

What exactly is an ABI? How does it differ from an Application Programming Interface (API)?
Why did I begin this post's title with "what _every_ Python developer should know"?
Aren't these low-level details the kind of thing you can ignore most of the time in a high-level language like Python?

In this post I hope to answer all these questions and build up your intuition about these topics.
I also hope you'll learn some useful information about how Python projects that include native extensions are distributed, what the ABI compatibility tags that show up in wheel filenames mean, and how projects can choose to target different Python ABIs depending on the tradeoffs they want to make.
By the end, you should be able to look at any wheel filename and know which Python interpreters it will install on — and why.

You'll also learn about how the Python C API and ABI have evolved in recent years and how the new [free-threaded](https://py-free-threading.github.io) interpreter fits into this story.
I'll also share how Python 3.15 will ship [a new ABI](https://docs.python.org/3.15/howto/abi3t-migration.html) that will fix the issues introduced by the free-threaded build.

It's true that you can happily write Python for years without needing to understand any of the content of this post, so you may object to the title advertising this material as what _every_ Python developer should know.
However, the moment you ship a package, debug why a wheel won't install, or need to understand why an import or Python function call segfaults — these details start to matter.
Even writing and maintaining a single-file script puts you closer to distributing code than you might think.
An alternate title for this post could be "What I Wish Someone Taught Me About the CPython ABI".

## The CPython C API and the Python ABI

The Python interpreter does a bit of a magic trick when you execute a script
like in the cartoon below.
The `np.array` function can be called by Python
code, but it turns out this function is _implemented_ [_in
C_](https://github.com/numpy/numpy/blob/f8c34f2927ba812a3efe9bc978d84aa47f27bff7/numpy/_core/src/multiarray/multiarraymodule.c#L1720).
The CPython interpreter handles this transparently.

 <figure style={{ textAlign: 'center' }}>
   <img
     src="/posts/python-abi-abi3t/cpython_runtime_diagram.png"
     alt="A cartoon showing a Python script with NumPy code calling into a cloud representing the CPython interpreter runtime which in turn calls into a NumPy C extension."
     style={{position:'relative'}}
   />
 </figure>

How does it achieve this trick?
Via the [CPython C API](https://docs.python.org/3/c-api/index.html) and the corresponding [Python ABI](https://docs.python.org/3/c-api/stable.html#c-api-stability).
Of course that doesn't really explain what those terms mean.
It certainly doesn't help that these two related, intertwined concepts are named with such similar-sounding acronyms.
I will attempt to clarify that in the rest of this post.

### The CPython C API

[CPython](https://github.com/python/cpython), as the name suggests, is implemented in the C programming language.
[It began as a "hobby" programming project](https://www.python.org/doc/essays/foreword/) and was written to be easy to extend with new functionality.
To access the internals of the interpreter, you needed only to `#include "Python.h"` in a C program, which gave rich access to the internal state of the interpreter and hooks to call into the interpreter via the CPython C API, the very same C API that the core interpreter implementation is based on.

What is the C API exactly?
It's the set of C macros, typedefs, functions, and structs exposed by the header that defines the C interface: `Python.h`.
It's possible to [write C code](https://docs.python.org/3/extending/index.html) that replicates the behavior of any Python script, at the cost of compilation, verbosity, and exposure to the pitfalls of the C programming language.
The reward is raw execution speed.

It is often possible to achieve order-of-magnitude or even several-order-of-magnitude speedups by translating Python code to a compiled language that can call into the C API.
The [Cython](https://cython.readthedocs.io/en/latest/) programming language takes advantage of this by (among other things) compiling Python code to C source that, once compiled and linked into a larger program, behaves like the Python it was generated from.
Cython particularly benefits from knowing type information to generate efficient C code.
This translation isn't always perfect, but it is serviceable enough to back the implementations of popular libraries like [Pandas](https://pandas.pydata.org/), [scikit-image](https://scikit-image.org/), or [scikit-learn](https://scikit-learn.org/).

### The Distinction Between a C API and an ABI

What isn't the C API?
The C API is purely a construct of the C programming language.
Code written in languages that aren't C can call into a C API, but only by using the platform-specific and architecture-specific calling conventions used by all code that executes directly on the CPU, abstracting away functionality that is not expressible in C.

The diagram below illustrates the distinction between the CPython C API and the Python ABI.

 <figure style={{ textAlign: 'center' }}>
   <img
     src="/posts/python-abi-abi3t/api_vs_abi.png"
     alt='A two-panel hand-drawn diagram contrasting the API and the ABI. The left panel, in violet and marked with a small C-source-file icon, is titled "API — Application Programming Interface" and lists three things the API covers, each with a code example: function signatures (PyObject *PyDict_GetItemRef(…)); macros, typedefs, and inline functions (Py_INCREF(op)); and the header you compile against (#include "Python.h"). The right panel, in blue and marked with a small computer-chip icon, is titled "ABI — Application Binary Interface" and lists three things the ABI covers: exported symbol names (PyDict_GetItemRef); struct sizes and field offsets, illustrated by a memory-layout diagram of PyObject as two 8-byte fields — ob_refcnt at byte offset 0 and ob_type at offset 8, 16 bytes total; and platform-specific details, illustrated by a matrix of operating systems (rows: Windows, macOS, and Linux) against CPU architectures (columns: x86-64, arm64, and ppc64le), with a green dot marking each supported build — x86-64 and arm64 for all three operating systems, and ppc64le for Linux only.'
     style={{position:'relative'}}
   />
 </figure>

A C API includes all of the details that are expressed in a C header, including full function signatures, macros, typedefs, and inline functions.
It also includes the header itself.

A C ABI covers everything a compiled binary needs to correctly call into a library: the _symbols_ the library exports and the _memory layout_ of the data the two sides exchange.
A symbol is just a name — like `PyDict_GetItemRef` — that the linker resolves to the address of that function's implementation.
Crucially, nothing about the function's signature is encoded in the binary: the caller must have been compiled against a header that declared the right argument and return types.
Struct layouts — the order, size, and offset of every field — are likewise baked into both binaries at compile time.
This is why ABI mismatches are so nasty: nothing fails at link time; the code simply reads the wrong bytes at runtime.

A C ABI does _not_ include things that _are_ in the C API.
This includes all items that are particular to the conventions of the C language or the C preprocessor like [macros](<https://www.cs.yale.edu/homes/aspnes/pinewiki/C(2f)Macros.html>), [typedefs](https://en.wikipedia.org/wiki/Typedef), and [inline functions](<https://en.wikipedia.org/wiki/Inline_(C_and_C%2B%2B)>).
The Python ABI also doesn't depend on the names of the function arguments: all it cares about is how to store and lay out the instances of different types exposed in a C API in memory.

This can be a little confusing when working with the CPython C API and thinking about the difference between the ABI and API because many names in the C API are implemented as macros but logically behave as functions.
Because they're implemented as macros, these items do not appear in the Python ABI.
This means that programming languages that cannot compile C syntax, like Rust, cannot use any C API items that are defined as C macros or inline functions.
Instead, Rust extensions rely on Rust re-implementations of macros and static inline functions exposed by the C API based on items that _are_ in the Python ABI.
C++ _is_ compatible with the C preprocessor, so you can use typedefs, macros, and inline functions exposed in the CPython C API in C++ extensions.

These details about the C ABI in particular are very important in practice for C++ and Rust.
Rust does not have any ABI stability guarantees: the layout and ordering of struct members are not guaranteed by the compiler except if a struct is explicitly set to follow C ABI conventions using [`#[repr(C)]`](https://doc.rust-lang.org/nomicon/other-reprs.html#reprc).
C++ does allow defining C++ APIs with stable ABIs but doing so is [much more complex](https://community.kde.org/Policies/Binary_Compatibility_Issues_With_C++) due to details around ABI stability in various C++ standard library implementations as well as complexities like [name mangling](https://en.wikipedia.org/wiki/Name_mangling).
In practice, the C ABI is the low-level lingua franca of the modern computing environment, used by most popular programming languages to enable interoperability at the binary level.

## The Python ABI

When talking about a concrete Python extension module that targets a particular CPU and OS, it helps to conceptually organize the ABI definition into two layers: the _platform ABI_ (platform-specific details) and the _Python ABI_ (Python-specific details), which I'll discuss in turn.

### What Is a Platform ABI?

The platform ABI governs details of how exactly machine code executes on each architecture: how a compiler translates calling a C function like [`PyDict_GetItemRef`](https://docs.python.org/3/c-api/dict.html#c.PyDict_GetItemRef) into a concrete set of machine code that sets CPU registers and other platform-specific details per the specification of whatever platform the code ultimately runs on.

A platform ABI determines things like the exact way machine code needs to pass arguments to a function.
For example, on the [System V ABI](https://wiki.osdev.org/System_V_ABI) used by Linux and MacOS on the [`x86_64`](https://wiki.osdev.org/System_V_ABI#x86-64) architecture, only the first six non-floating-point arguments of a function are passed via registers, the remaining arguments are passed via the stack.
The [Windows x64 calling convention](https://learn.microsoft.com/en-us/cpp/build/x64-calling-convention) on the same CPU passes only the first four arguments in registers.

Normally, developers do not need to worry about details like this: compilers automatically generate machine code appropriate for whatever platform ABI a developer wants to target.
However, it _is_ important to know that the underlying platform — the combination of operating system and CPU architecture — has its own unique ABI, and that code compiled for one platform ABI is completely unusable on another platform ABI.
This fact determines much of the design of the [binary wheel distribution format](https://packaging.python.org/en/latest/specifications/binary-distribution-format/), which we'll discuss in more detail below.

The biggest consequence is that each platform and CPU architecture, each with its own distinct platform ABI, requires its own unique builds.
This is one reason projects like `NumPy` distribute [so many binary wheels](https://pypi.org/project/numpy/2.5.0/#files) with each release: projects need to build binaries for each platform ABI they want to support.

I am glossing over details a little bit here: things like the system libc library implementation (musl vs glibc on Linux — the distinction behind the [manylinux](https://peps.python.org/pep-0600/) and [musllinux](https://peps.python.org/pep-0656/) platform tags) or the compiler implementation (MSVC vs mingw-w64 on Windows) can also impact the ABI.
In many contexts, this complexity is parameterized with a so-called ["target triple"](https://mcyoung.xyz/2025/04/14/target-triples/) like `aarch64-apple-darwin`.
Each distinct target triple corresponds to a distinct set of ABI conventions that a compiler toolchain must support to generate valid binaries.

### ABI Tags and Wheel Filenames: Understanding Wheel Compatibility

Most popular Python packages ship binaries to the [Python Package Index](https://pypi.org) (PyPI) in the form of binary wheels.
A wheel is a zip-compressed folder containing Python code and, optionally, compiled artifacts.

Other posts go into this in a lot more detail, for example [Python Wheels: from Tags to Variants](https://labs.quansight.org/blog/python-wheels-from-tags-to-variants) on this blog, or the packaging guide's [overview of package formats](https://packaging.python.org/en/latest/discussions/package-formats/).
Here we're particularly concerned with the filename of a wheel file.
Let's consider what happens when I `pip install cryptography` on my development environment running on an ARM Mac laptop:

```bash
$ pip install cryptography
Collecting cryptography
  Downloading cryptography-48.0.0-cp311-abi3-macosx_10_9_universal2.whl.metadata (4.3 kB)
Collecting cffi>=2.0.0 (from cryptography)
  Downloading cffi-2.0.0-cp314-cp314-macosx_11_0_arm64.whl.metadata (2.6 kB)
Collecting pycparser (from cffi>=2.0.0->cryptography)
  Downloading pycparser-3.0-py3-none-any.whl.metadata (8.2 kB)
Downloading cryptography-48.0.0-cp311-abi3-macosx_10_9_universal2.whl (8.0 MB)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 8.0/8.0 MB 11.6 MB/s  0:00:00
Downloading cffi-2.0.0-cp314-cp314-macosx_11_0_arm64.whl (181 kB)
Downloading pycparser-3.0-py3-none-any.whl (48 kB)
Installing collected packages: pycparser, cffi, cryptography
Successfully installed cffi-2.0.0 cryptography-48.0.0 pycparser-3.0
```

Let's pay particular attention to the filenames of the wheel files, because most of the information in the wheel file is related to ABI compatibility.

 <figure style={{ textAlign: 'center' }}>
   <img
     src="/posts/python-abi-abi3t/wheel-filename-anatomy.png"
     alt="A diagram illustrating the structure of a wheel filename. There are six pieces of information as part of each wheel file: the name of the distribution, the distribution's version, the Python version tag, the abi tag, and the platform tag, and the wheel filename extension."
     style={{position:'relative',left:'0%',width:'100%'}}
   />
 </figure>

The third, fourth, and fifth pieces — the [compatibility tags](https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/) — are the ones that matter for ABI compatibility.
The "python" tag indicates either the exact version supported by the wheel or the minimum supported version.
Whether or not the version indicates a minimum or an exact version depends on the next ABI tag.
The `py3` tag used by `pycparser` indicates that this is usable by _any_ Python 3 interpreter running _any_ Python version, not necessarily just CPython.
The full `py3-none-any` triple implies the wheel is compatible with any Python 3 version and any platform: it includes only pure-Python code and no compiled extensions.
The `cp` in the `cp311` and `cp314` tags indicates that the `cryptography` and `cffi` wheels are only usable with CPython.
Other Python implementations will need a different wheel.

The `cp311-abi3` and `cp314-cp314` tags imply that these wheels contain compiled extensions.
The tags encode which of CPython's several ABIs a wheel targets; the rest of this post explains what that means, but to get there we'll need to describe the structure of the CPython C API.

## The Layers of the CPython C API

In the early days, there wasn't much distinction between "the interpreter" and "what's exposed by the C API": you simply were able to monkey around at will with internal state in the interpreter.
While this enabled lots of cool stuff, it also had a cost: extensions regularly broke with different Python releases, requiring careful fixes to adapt to changes in interpreter internals.
This also introduced a design pressure to freeze internals, lest people building on Python complain about changes breaking their code.

These days there is a much better distinction between CPython internals and publicly exposed API, with all signs pointing towards the trend of isolating interpreter internals to continue into the future.

This is managed by breaking up the "full" C API surface used by the interpreter into five different layers, illustrated in the diagram below.

 <figure style={{ textAlign: 'center' }}>
   <img
     src="/posts/python-abi-abi3t/cpython_api_layers.png"
     alt='Five nested ellipses illustrating the layering of the Python C API. The outermost ellipse is gray and labeled "Internal API, exposed only if `Py_BUILD_CORE` is defined". The next enclosed ellipse is red and outlined with a dashed line defined in the legend to mean "Usable with `#include "Python.h"`". The red ellipse is labeled "Private API `_Py*` prefix". The next enclosed ellipse is yellow and is labeled "Unstable API `PyUnstable_*` prefix". The next enclosed ellipse is blue and labeled "Version-specific API". The next enclosed ellipse is green with a dark shaded outline the legend defines to mean "Usable if `Py_LIMITED_API` is defined" and is labeled "Limited API".'
     style={{position:'relative'}}
   />
 </figure>

Below I describe each of these layers and explain how this separation enables many different use cases.

### Internal C API

The outermost layer is for people who work on the CPython implementation.
In order to use it, a C or C++ program must define the `Py_BUILD_CORE` compiler macro, which is equivalent to declaring that your program is a part of the CPython interpreter itself.
Note that defining `Py_BUILD_CORE` only exposes the internal API at the source level.
Many internal functions are not exported symbols in the Python ABI at all, so an extension that compiles cleanly against the internal headers may still fail at link or import time.
The internal API is only fully available to code compiled as part of CPython itself.

As [the CPython developer guide](https://devguide.python.org/developer-workflow/c-api/#the-internal-api) indicates, the internal API is subject to change at any moment and should not be relied on, even for the items that are part of the Python ABI.
Defining `Py_BUILD_CORE` and opting into using the internal C API is equivalent to saying you're willing to take on maintenance for code that can and will break at any time.

Because the internal API can change at any time — and can differ between build configurations — relying on it ties your code to a specific build of CPython, not just a specific version.
That is also what makes it useful to the one legitimate audience outside CPython itself: projects that compile their own modified interpreter from source.

### Private C API

This layer is _private_ in the sense that its items shouldn't be used outside CPython, but "public" in the sense that they're available after a plain `#include "Python.h"`, with no special macros.
Names in the C API with a leading underscore are private.
To pick a random example: [`_PyDict_GetItem_KnownHash`](https://github.com/python/cpython/blob/2e5843e13fcfd768a435d82e6182af403844432c/Include/cpython/dictobject.h#L45-L46) allows users to bypass the normal Python `dict` interface to directly access a dict entry with an already-computed hash.
This optimization is useful sometimes in the interpreter, so it's defined.
It's not a documented primitive, so there are no guarantees about it being available in a future version of the C API.
It is an exported symbol in the ABI of the releases that ship it, but that buys you nothing across versions: the docs warn that underscore-prefixed names ["are private API that can change without notice even in patch releases"](https://docs.python.org/3/c-api/stable.html#c-api-stability).
In practice, it is difficult for CPython to make changes like that.
For example, [\_PyDict_GetItem_KnownHash itself was removed in Python 3.13.0a1](https://github.com/python/cpython/pull/10715) and [restored an alpha later](https://github.com/python/cpython/pull/112115) because the removal broke several popular projects.

### Unstable C API

Moving inward, the next layer is the first _documented_ layer in the CPython C API, the [unstable C API](https://docs.python.org/3/c-api/stable.html#unstable-c-api).
There is an extra layer here because not everything that's documented is stable.
Unstable API items may be changed or removed in any CPython minor release, without a deprecation period, although they are guaranteed to remain stable within a CPython minor release (say for 3.14.0, 3.14.1, and so on).

These items serve a real purpose, but the CPython developers are not ready to commit to long-term support.
Usually this is because unstable API items rely on or expose interpreter implementation details and it's not yet clear if the resulting behavior should be enshrined in the "official" C API.
The unstable API is most useful for projects or organizations who can follow development of the CPython C API and are OK with occasional breakage when warranted.

### Version-Specific C API

The next innermost layer is the Python version-specific C API and includes all items that follow the CPython C API [stability policy](https://docs.python.org/3/c-api/stable.html#c-api-stability), as first laid out in [PEP 387](https://peps.python.org/pep-0387/) back in 2009 (although the PEP was only formally accepted in 2020).
While public symbols in the CPython C API can be removed following a deprecation period or to fix a serious defect, this only happens after a period of public discussion and consideration of the community impact.
Critically, CPython stops adding new items to the version-specific API at the first beta release of a Python minor version (with one narrow exception: [new unstable APIs for existing features are allowed](https://devguide.python.org/developer-workflow/c-api/#unstable-capi) until the first release candidate).
For example, this year [Python 3.15.0b1 came out in May](https://peps.python.org/pep-0790/#schedule), freezing the set of features going into Python 3.15.
Binary-level details — function signatures and struct layouts — can still shift during the beta phase; the ABI is only declared frozen at the first release candidate, after which no changes are allowed until the next Python minor release.
This allows projects to release binaries targeting a specific Python version and be assured it will continue to work for future bugfix releases of that version.

### Limited C API

Finally, the most restricted innermost layer corresponds, fittingly, to the "Limited" C API, a deliberately curated subset of the full CPython C API.
The limited C API corresponds to a subset of the full Python ABI: the stable Python ABI.
The CPython project [commits](https://docs.python.org/3/c-api/stable.html#stable-abi) to keeping items in the stable ABI as part of the Python ABI forever.
C or C++ extensions can opt into compiling for this mode by defining the [`Py_LIMITED_API`](https://docs.python.org/3/c-api/stable.html#c.Py_LIMITED_API) macro to a hex constant that corresponds to a particular CPython version.

A somewhat confusing point that is often glossed over is that the limited C API _also_ changes from Python version to Python version.
You can build extensions that target _either one_ of, say, the Python 3.13 version-specific API or the limited API.
It's also possible to target limited API versions older than the Python version used to build an extension.
An extension or wheel build targeting, say, the Python 3.10 limited API can be imported on Python 3.10 and _any newer Python release_.

Items in the limited API can be deprecated and removed, but the corresponding symbol in the ABI must remain available forever to ensure binary compatibility.
That means that the limited API is not necessarily forward compatible: an extension targeting the limited API for Python 3.9 may not necessarily compile on the limited API targeting Python 3.12.
However, a binary wheel targeting the Python 3.9 limited API built from the same project will be importable on Python 3.12, thanks to the stable ABI.

There is a big "but" in the above claim that targeting the limited API allows supporting _any_ Python version newer than Python 3.10.
It turns out that this guarantee depends critically on structs that have long been exposed in the CPython ABI and how free-threaded Python wants to change the layout of these structs.

## CPython C ABI Stability and Binary Wheel Builds

There are two levels of ABI stability provided by CPython:

- The ABI is frozen for all releases within a Python minor version, say from Python 3.13.0 to the last Python 3.13.x bugfix release.
- ABI items that are in the limited C API will never be removed, even if a future version of the limited API removes an API item.

Of course "never" is a little strong.
If a particularly bad design flaw is discovered, an item can be removed from the limited API, and the _implementation_ behind its ABI entry replaced with one that raises at runtime.
The _symbol_ itself stays in the ABI, though, so an extension that uses the removed function still compiles, links, and imports successfully.
It only risks a runtime error later, on a newer Python, if it actually _calls_ the removed function.

These two guarantees map onto two of the API layers from the previous section: **the version-specific API backs the `cp3XY` ABI**, and **the limited API's stable subset backs the forward-compatible `abi3` ABI**.
Each enables a different kind of build for distributors of extension modules:

### Version-Specific ABI: `cp3XY`

By policy, the ABI corresponding the version-specific C API is frozen at the first release candidate for a Python minor version.
The guarantee that the Python version-specific C API does not change within a Python minor release series corresponds to a stability policy for the CPython version-specific ABI.
In practice, it means that extension modules and binary wheels built using Python 3.15.0rc1 can be imported using any subsequent version of Python 3.15, even years into the future.

Projects shipping binary wheels using the version-specific ABI have ABI compatibility tags in the wheel filename like `cp314-cp314`.
If a wheel has this particular tag, that indicates the wheel has binaries that are built using the GIL-enabled version-specific ABI for Python 3.14.
We'll cover shortly why I had to add "GIL-enabled" there and why that's important.

Because the version-specific ABI is specific to a particular minor release of CPython, this means a project must explicitly add support for new Python releases every year.
Some projects, like NumPy, target this ABI because they have the contributor resources to manage that level of coordination, with an annual deadline corresponding to the release of CPython in the Fall.
Many projects do not have the resources to track CPython like that and instead tend to fall behind, adding support for new CPython versions months or even years after the CPython release happened.

### Stable ABI: `abi3`

The guarantee that items in the stable ABI will never go away enables a different kind of _forward-compatible_ build.
You can build binaries using the limited API as it was defined in, say, Python 3.10.
Because of the stability guarantees provided by the stable subset of the CPython ABI, you can rely on the fact future Python versions will be able to import your binary: all the symbols it needs from the CPython ABI should still be there.
The stable ABI pays off in the Conda ecosystem just as much as in the PyPI ecosystem, as [covered on the Quansight blog](https://labs.quansight.org/blog/conda-abi3) in 2025.

There is one major problem with this scheme: `abi3` as it was originally defined shared a detail with the version-specific ABI: the layout of the `PyObject` struct is exposed.

Until the advent of the free-threaded interpreter, projects had a choice of supporting a build matrix like the following:

<style dangerouslySetInnerHTML={{ __html: ".abi-grid{border-collapse:collapse}.abi-grid th,.abi-grid td{border:1px solid #374151;padding:8px 16px}" }} />

<div className="overflow-x-auto">
  <table className="abi-grid mx-auto w-auto min-w-[42rem]">
    <thead>
      <tr>
        <th>CPython version</th>
        <th>Stable ABI</th>
        <th>Version-specific ABI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>3.9</td>
        <td rowSpan={4} className="align-middle text-center"><code>cp39-abi3</code></td>
        <td><code>cp39</code></td>
      </tr>
      <tr>
        <td>3.10</td>
        <td><code>cp310</code></td>
      </tr>
      <tr>
        <td>3.11</td>
        <td><code>cp311</code></td>
      </tr>
      <tr>
        <td>3.12</td>
        <td><code>cp312</code></td>
      </tr>
    </tbody>
  </table>
</div>

That is, uploading one `cp39-abi3` wheel to target all Python versions newer than Python 3.9 or uploading one wheel per Python minor release, each targeting a different `cp3XY` ABI.

We now have two ABIs — the per-release `cp3XY` and the build-once `abi3`.
This worked well, up until Python 3.13.
To understand why, I'll need to go over how CPython handles multithreaded concurrency.

## The CPython ABI and the GIL

As you may have heard, it's possible to use a "free-threaded" build of CPython that does not have a [global interpreter lock](https://docs.python.org/3/glossary.html#term-global-interpreter-lock) (the GIL).

What is the GIL and why is it important for this discussion?

### The PyObject Struct

`PyObject` is by far the most important struct in the CPython C API and the Python ABI, and its layout is one of the main sources of tension that led to two new Python ABIs in recent years — so it's worth a closer look.

All Python objects correspond in C to an instance of `PyObject` or a struct that extends the `PyObject` struct.
Until free-threaded Python, the `PyObject` struct had the following layout on 64-bit architectures:

```c
struct PyObject {
    Py_ssize_t ob_refcnt;
    PyTypeObject *ob_type;
};
```

Here, [`Py_ssize_t`](https://docs.python.org/3/c-api/intro.html#c.Py_ssize_t) is a signed integer type that is used to represent sizes in the CPython C API.
In this case, the `ob_refcnt` field represents the [reference count](https://en.wikipedia.org/wiki/Reference_counting) of the object — the number of other data structures that reference an instance of the `PyObject` struct.
This is used to manage memory: the reference count is incremented and decremented as an object is passed between different Python modules and functions.
When the reference count goes to zero, the object is deallocated.
If you're curious why Python uses a signed integer to represent a strictly positive count: an _unsigned_ integer would catastrophically wrap around to a large positive value if the reference count ever underflowed.
With a signed integer you instead see a negative reference count: an obviously invalid state.

The other field, `ob_type`, is a pointer to the type of the object.
Since this is Python and even types are objects, `PyTypeObject` is another struct that extends `PyObject`.

Taken together, these two pieces of information, the reference count and the type, are always tracked on every Python object.
In some sense, an object _is_ the address and content of a `PyObject` instance or an instance of a struct that extends `PyObject`.

To make that all a little more concrete, `object()` in Python instantiates a `PyObject` instance in the interpreter runtime, while `dict()` instantiates a `PyDictObject` struct — a different struct that extends `PyObject`.
That is, the first two fields of `PyDictObject` are exactly the same as `PyObject`.

### Multithreaded Concurrency

If the reference count field, `ob_refcnt`, goes to zero then the object is deallocated.
In CPython, the object is deallocated immediately.
Python also exposes access to OS-level threads via the `threading` module.

These two facts have big implications for whether it is safe to use Python with threads.
In principle, without a global lock preventing it, two threads could access the same Python object _simultaneously_.
If, for some reason, the reference count happens to go to zero and the object is deallocated, the other thread might see free'd memory and probably crash.

So you have a situation where a C struct has a signed integer that may be incremented or decremented at arbitrary times — even simultaneously — from any arbitrary number of threads.
This is a classic case of a problem that is susceptible to pitfalls of concurrency: [races](https://en.wikipedia.org/wiki/Race_condition).
This particular case, where the race to increment or decrement the integer happens in C code, is susceptible to a particularly bad kind of multithreaded race: a [data race](https://en.wikipedia.org/wiki/Race_condition#Data_race).
In the specification of the C, C++, and Rust languages, the result of what happens after these sorts of races is [undefined behavior](https://www.hboehm.info/c++mm/why_undef.html).
Undefined behavior in a native application should be avoided at all costs because compilers are free to generate code that is not at all what a programmer intended if it is triggered in a program.

This problem was recognized quite early on in the development of CPython.
To fix it, the language grew the global interpreter lock.
In order to interact with Python objects, you need to acquire a global [mutex](<https://en.wikipedia.org/wiki/Lock_(computer_science)>) and release it as soon as you are done using the Python objects or the CPython interpreter runtime.

Since incrementing and decrementing reference counts should only happen with the GIL mutex held, it's therefore perfectly safe to arbitrarily share Python objects: you can be confident that only one thread at a time can actually see or mutate the state of the object.

There is a big downside to this design decision: the GIL means it is impossible to actually use more than one CPU core to run Python code.
In particular: only one core can run code that holds the GIL.
Here, "code that holds the GIL" is essentially all Python-level code: the interpreter holds the GIL while it executes Python bytecode.
Some extension and standard-library code does release the GIL so more than one CPU can run at once, but by [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law) the parts that must run single-threaded still cap how far an application can scale.

That is why there have been [several efforts over the years](https://dabeaz.blogspot.com/2011/08/inside-look-at-gil-removal-patch-of.html) — to varying degrees of success — to remove the GIL from the CPython implementation.
Over the past few years, one of these approaches seems to have stuck.
It looks like a free-threaded Python, one with no global interpreter lock and no limit to multithreaded concurrency in pure Python code, is the future of CPython.

If you're interested in learning more about how Quansight has contributed to the effort to support free-threaded Python, I've chronicled it on this blog from the [first experimental release](https://labs.quansight.org/blog/free-threaded-python-rollout) in Python 3.13, the ["stable" release](https://labs.quansight.org/blog/free-threaded-one-year-recap) for Python 3.14, and [crossing the 50% mark](https://labs.quansight.org/blog/free-threaded-python-halfway) on support in popular ecosystem packages that ship compiled extensions needing explicit free-threaded support.

### The `PyObject` Struct and Free-Threaded Python

Removing the GIL required making fundamental changes to the CPython interpreter.
Earlier we saw how the `PyObject` struct has an `ob_refcnt` field, which must be incremented and decremented safely under concurrent mutation.
In the GIL-enabled build, a global lock serializes access to the field, so normal integer addition and subtraction can be used.
Through Python 3.11, the function in the C API for incrementing the refcnt field, `Py_INCREF`, was defined in CPython [like this](https://github.com/python/cpython/blob/3.11/Include/object.h#L502):

```c
static inline void Py_INCREF(PyObject *op)
{
    op->ob_refcnt++;
}
```

[Early attempts](https://lwn.net/Articles/689548/) to remove the GIL attempted to preserve this simplicity and simply replace `ob_refcnt++` with [atomic](https://en.wikipedia.org/wiki/Linearizability#Primitive_atomic_instructions) addition.

Atomic operations, available on modern CPUs and with modern versions of the C standard and C compilers, allow for thread-safe sharing of objects without any explicit locks.
Instead, the responsibility for serializing operations using atomic instructions falls on the compiler and the CPU.
While atomics are lower overhead than a single global lock they are still higher overhead than an integer addition or subtraction, particularly for objects that are shared between multiple CPU threads.
Remember: sharing objects between CPU threads is the entire point of this exercise.

### The Free-Threaded ABI: `cp3XYt`

The fix that ultimately stuck was developed by [Sam Gross](https://github.com/colesbury) and others working on Python internals at Meta.
The key insight that led to scalable free-threaded Python was to give up on requiring that all threads agree on the exact reference count for all objects at all times.
Instead, adopt [biased reference counting](https://dl.acm.org/doi/10.1145/3243176.3243195): split the count between references held by the thread that "owns" the object and references from every other thread.
The owning thread updates its local count with cheap non-atomic addition and subtraction, while other threads update a separate shared count [using atomic instructions](https://peps.python.org/pep-0703/#biased-reference-counting) — more expensive, but with no global lock.
For a few object types that are constantly accessed by many threads — top-level functions, code objects, modules — the interpreter goes further and [defers reference counting entirely](https://peps.python.org/pep-0703/#deferred-reference-counting), computing the true count only while threads are paused for garbage collection.

There must also be a way to ensure accessing or mutating an object's state happens reliably.
Rather than use a _global_ lock, the solution Sam and collaborators settled on was to use many fine-grained locks.
In fact, one lock per Python object.
Extensions and the interpreter acquire these per-object locks through the [Python critical section C API](https://docs.python.org/3/c-api/synchronization.html#python-critical-section-api).

To make that a little more concrete: on Python 3.15, the `PyObject` struct is defined [like this](https://github.com/python/cpython/blob/v3.15.0b3/Include/object.h#L156-L167) on the free-threaded build of CPython:

```c
struct PyObject {
    uintptr_t ob_tid;          // id of owning thread
    uint16_t ob_flags;
    PyMutex ob_mutex;          // per-object lock
    uint8_t ob_gc_bits;
    uint32_t ob_ref_local;     // local reference count
    Py_ssize_t ob_ref_shared;  // shared (atomic) reference count
    PyTypeObject *ob_type;
}
```

You can see how the fields in the struct correspond to the two design decisions I introduced above: shared and local refcounts (`ob_ref_shared` and `ob_ref_local`), an "owning" thread ID to identify when objects are local (`ob_tid`), and a per-object lock (`ob_mutex`).

Notice that ob_type is still here, but it moved: on the GIL-enabled build it sits at byte offset 8 on 64-bit builds, right after the reference count.
On the free-threaded build it comes after all the new bookkeeping fields.
An extension compiled against the old layout would look for the type pointer at offset 8 and read unrelated data in the `ob_flags`, `ob_mutex`, and `ob_gc_bits` fields.
At best, this will lead to a crash.
That is the essence of the ABI incompatibility introduced by the free-threaded build.

`Py_INCREF` is correspondingly more complicated [on the free-threaded build](https://github.com/python/cpython/blob/6920036f287480f7d39d6a4005803aeac27aff3f/Include/refcount.h#L272-L284): for a thread-owned object the hot path is still a single non-atomic increment of `ob_ref_local`, but objects shared across threads fall back to an atomic update of `ob_ref_shared`.
The details aren't essential — what matters is that a once-trivial integer increment now has to account for the new layout.

The distinct `PyObject` layout on the free-threaded build corresponds to a distinct version-specific ABI for free-threaded builds.
The ABI tags in wheels reflect this by appending a `t` to the version in the CPython version-specific ABI tag.
So, free-threaded Python 3.14 corresponds to the `cp314t` ABI tag.
Python 3.13 [also shipped](https://docs.python.org/3.13/whatsnew/3.13.html#free-threaded-cpython) a `cp313t` ABI, but that was considered experimental.
Every Python release from Python 3.14 onward officially supports _two_ version-specific ABIs, `cp3XY` and `cp3XYt`.
That also means all ecosystem projects that wish to match CPython's officially supported releases must ship _two_ version-specific wheels per Python version for 3.14 and newer.

To make that concrete, let's try installing `cryptography` using free-threaded Python 3.14:

```bash
Collecting cryptography
  Downloading cryptography-49.0.0-cp314-cp314t-macosx_11_0_arm64.whl.metadata (4.3 kB)
Collecting cffi>=2.0.0 (from cryptography)
  Downloading cffi-2.0.0-cp314-cp314t-macosx_11_0_arm64.whl.metadata (2.6 kB)
Collecting pycparser (from cffi>=2.0.0->cryptography)
  Downloading pycparser-3.0-py3-none-any.whl.metadata (8.2 kB)
Downloading cryptography-49.0.0-cp314-cp314t-macosx_11_0_arm64.whl (4.0 MB)
Downloading cffi-2.0.0-cp314-cp314t-macosx_11_0_arm64.whl (185 kB)
Downloading pycparser-3.0-py3-none-any.whl (48 kB)
Installing collected packages: pycparser, cffi, cryptography
Successfully installed cffi-2.0.0 cryptography-49.0.0 pycparser-3.0
```

Compared with what happens on the GIL-enabled build, which I described above, there are some similarities.
All three packages resolve to compatible wheel builds.
The `pycparser` `py3-none-any` wheel is also compatible with the free-threaded build: pure Python code doesn't care about the layout of `PyObject` and doesn't need to explicitly support the free-threaded build.
CFFI also ships a version-specific wheel for the free-threaded build, with the ABI tag for free-threaded Python 3.14: `cp314t`.
Wheels compiled using this ABI tag use the free-threaded layout for `PyObject`.

Instead of installing an `abi3` wheel for cryptography, we installed a `cp314t` version-specific wheel.
It turns out that there is no equivalent to `abi3` for the free-threaded build of Python 3.14, so `cryptography` uploads a version-specific wheel.

So this was the design trade-off: enable multithreaded parallelism but increase the complexity of the interpreter and force extensions to explicitly support this new ABI with a new layout for `PyObject`.
You can read [PEP 703](https://peps.python.org/pep-0703/) and [PEP 779](https://peps.python.org/pep-0779/) for detailed discussions of why it's worth it for CPython to choose complexity over simplicity in this case.

Please also refer to [The Community-Curated Free-Threaded Python Guide](https://py-free-threading.github.io), [Victor Stinner's post](https://vstinner.github.io/free-threading-reference-counting.html) on reference counting in free-threaded Python, and the [summary of Thomas Wouters' 2026 PyCon talk on LWN](https://lwn.net/SubscriberLink/1078367/eaa511915870fdb2) for much more detailed discussions of this topic.

## A New Stable ABI for Python 3.15

As we saw above, the `PyObject` struct has a different layout on free-threaded Python.
That means it does not have an ABI that is compatible with the GIL-enabled build.
In other words, it is not possible to load a compiled extension module targeting the GIL-enabled build on a free-threaded interpreter because lots of things in the C API rely on the layout of `PyObject`.

Just one example that shows up in every single C extension: the [`PyModuleDef` struct](https://docs.python.org/3/c-api/module.html#c.PyModuleDef).
For historical reasons, this struct _extends_ the `PyObject` struct.
That means if `PyObject` has a different size, when CPython loads an extension and accesses data stored on the `PyModuleDef` struct to set up a module object it will access data at the wrong offset.
Most likely, this will lead to an immediate crash.

The fact that free-threaded Python 3.13 and 3.14 [do not support building extensions for the limited API](https://docs.python.org/3.14/howto/free-threading-extensions.html#limited-c-api-and-stable-abi) is a major blocker for some projects.
The stable ABI allows projects to build one wheel per architecture per release of the project.
With the stable ABI, there is no need to keep up with annual CPython releases to support each new Python version: new Python versions are supported with no effort on the part of the project.

Of course, as we saw above, the free-threaded build is fundamentally incompatible with the `abi3` stable ABI: the layout of `PyObject` is different.
When the steering council [accepted PEP 779](https://peps.python.org/pep-0779/) — the PEP that made the free-threaded build an officially supported part of Python 3.14 — it stated that it "expects that Stable ABI for free-threading should be prepared and defined for Python 3.15."
To fix this problem, the Python Steering Council asked Python Developer-in-Residence [Petr Viktorin](https://github.com/encukou) to design and integrate a new stable ABI for the free-threaded build in time for Python 3.15.
This process culminated in writing [PEP 803](https://peps.python.org/pep-0803/), which I got to chip in at the end as a co-author.

### The Free-Threaded Stable ABI: `abi3t`

What can be done about the fact that the free-threaded and GIL-enabled build have different `PyObject` layouts?
How can we resolve this difference to allow extensions to target both layouts simultaneously?

The key to fixing this lies in redefining structures in the Python C API to be _opaque structs_.
An [opaque struct](https://benjamintoll.com/2022/08/31/on-opaque-data-types-in-c/#creating-a-typedef) is a C type defined so that pointers to an instance can't be dereferenced; the only valid way to interact with it is to pass those pointers to functions in a C API, rather than accessing struct fields directly.
Struct fields are only accessed across the C API boundary, in the implementation of the function.

To make that concrete, what if the public definition of `PyObject` looked like this:

```c
typedef struct _object PyObject;
```

This relies on how the `typedef` statement works in C.
It gives the name `PyObject` to the opaque type `struct _object`.
If `Python.h` defined `PyObject` like this, it would be a _compiler error_ to access `ob_refcnt` or any other field directly.
This means that the precise details of how reference counts are stored can change in the CPython implementation.
Functions can account for the different `PyObject` layouts that are possible in their implementation, without exposing any internal implementation details in the public C API.

Victor Stinner describes this effort at a high level in [a 2021 blog post](https://vstinner.github.io/c-api-opaque-structures.html).
Just to go into one example: back then `Py_INCREF` was historically defined as a macro (and later a static inline function) that directly accessed `PyObject` internals.
A function version, [`Py_IncRef`](https://docs.python.org/3/c-api/refcounting.html#c.Py_IncRef), has actually existed since Python 2.4; Python 3.10 added a stricter private variant, _Py_IncRef, and when you target the limited API for Python 3.12 or newer, [Py_INCREF is implemented as a call to that function](https://github.com/python/cpython/blob/3.13/Include/refcount.h) instead of using direct struct access.
Going through a function call may add overhead compared with a macro that accesses a struct member directly, but it also lets CPython hide implementation details.

The next pernicious issue was around how extensions want to extend Python types like `dict`, `list`, or `set`.
In pure Python code, it's straightforward to subclass a builtin.
In C, you generally accomplish this by writing a new struct that extends a struct that backs a Python builtin type.
To make that concrete, here's how you would subclass `dict`, in C, to store an extra C integer on every instance of the `dict` subclass:

```c
struct MyDictObject {
    PyDictObject base;
    int64_t an_extra_integer;
};
```

Of course this is an artificial example.
However, it's not very hard to find real-world examples of this pattern.
For example, [in NumPy](https://github.com/numpy/numpy/blob/4357ad1a67e7d4a686c39f3720604b6440725e40/numpy/_core/include/numpy/arrayscalars.h#L140-L147).

This pattern only works if the layout of e.g.
`PyDictObject` is known at compile time.
However, if `PyObject` is opaque, then `PyDictObject` must also be opaque, and it's no longer possible to define C subtypes by simply defining a struct with a `base` member.
Instead, you need to use [a new API specifically for this case](https://peps.python.org/pep-0697/), added in Python 3.12.

During the Python 3.15 development cycle, a few more spots needed updating:

- [A new C API](https://peps.python.org/pep-0793/) for defining modules that avoids `PyModuleDef`, a type that extends `PyObject`.
- [Making `PyObject` opaque and defining a new stable ABI](https://peps.python.org/pep-0803/)

I had the privilege of helping get PEP 803 accepted and am a co-author.
[My primary contribution](https://peps.python.org/pep-0803/#ecosystem-maintainers-want-decreased-maintenance-burden) was to find examples of ecosystem projects asking for the ability to ship one wheel for both interpreter builds.

With all these pieces, it became possible to define a C extension implementing Python functions, modules, and types without relying on the layout of `PyObject`.

You select an `abi3t` build in a C or C++ extension by simultaneously defining the new `Py_TARGET_ABI3T` macro, which is analogous to the old `Py_LIMITED_API` macro.
Defining `Py_TARGET_ABI3T` to a Python version hex code is equivalent to defining `Py_LIMITED_API` to the same version, along with the `Py_GIL_DISABLED` macros.
Because the extension doesn't depend on the layout of `PyObject`, it is compatible with _both_ interpreter builds — and any future build that changes that layout again.
Since the free-threaded build has no GIL, `abi3t` extensions can't rely on it for thread safety — they must be written to be thread-safe.

### Advice for Maintainers of Projects Using or Considering `abi3` Wheels

The free-threaded Stable ABI, `abi3t`, gives extension maintainers a path to one artifact per platform for Python 3.15 and newer.
Older non-free-threaded versions can still be covered by `abi3`.
If you maintain a project that currently ships `abi3` wheels, we suggest building two more wheels: a version-specific free-threaded Python 3.14 wheel and a `cp315-abi3.abi3t` to target both builds on Python 3.15 and newer.
This is summarized in the table below.

<div className="overflow-x-auto">
  <table className="abi-grid mx-auto w-auto min-w-[42rem]">
    <thead>
      <tr>
        <th>CPython version</th>
        <th>Non-free-threaded</th>
        <th>Free-threaded</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>3.12</td>
        <td rowSpan={3} className="align-middle text-center"><code>cp312-abi3</code></td>
        <td>&mdash;</td>
      </tr>
      <tr>
        <td>3.13</td>
        <td>&mdash;</td>
      </tr>
      <tr>
        <td>3.14</td>
        <td><code>cp314t</code></td>
      </tr>
      <tr>
        <td>3.15</td>
        <td colSpan={2} rowSpan={3} className="align-middle text-center"><code>cp315-abi3.abi3t</code></td>
      </tr>
      <tr>
        <td>3.16</td>
      </tr>
      <tr>
        <td>3.17 and later</td>
      </tr>
    </tbody>
  </table>
</div>

In the future, when Python 3.15 becomes your minimum supported Python version, you can go back to shipping one wheel per release.
Temporarily building three wheels per release does add some ecosystem-wide cost with the reward of being able to adopt free-threaded Python.

As of July 2026, `abi3t` support in build tools and bindings generators is mixed, as Python 3.15 is still in a pre-release stage.
As the Python 3.15 final release approaches, expect to see build backend and binding generator support improve.
[PyO3](https://pyo3.rs/v0.29.0/features.html#abi3t) and [Maturin](https://www.maturin.rs/bindings.html?highlight=abi3t#py_limited_apiabi3) fully support Python 3.15 and `abi3t`, so most Rust extensions should be ready for testing.
[Scikit-build-core](https://scikit-build-core.readthedocs.io/en/latest/configuration/index.html#customizing-the-output-wheel) will support abi3t along in its upcoming 1.0 release.
Cython supports abi3t via [an experimental branch](https://github.com/cython/cython/issues/7399).
Setuptools support will be added once [PR #5193](https://github.com/pypa/setuptools/pull/5193) is merged and appears in a release.
Meson-python support has [been merged](https://github.com/mesonbuild/meson-python/pull/856) and will appear in the next release.
Installing an abi3t wheel should be fully supported across all installers, including both `pip` 26.1 or newer (via [packaging 26.1](https://packaging.pypa.io/en/stable/changelog.html#id2) and [`uv` 0.11.3](https://github.com/astral-sh/uv/releases/tag/0.11.3) or newer.

## Key Takeaways

- An **API** is a source-level contract — the function signatures, macros, and types in `Python.h` — while an **ABI** is the binary-level contract — symbol names, struct layouts, and calling conventions — that compiled extensions actually depend on.
- A wheel's ABI tag tells you its compatibility: `none` (pure Python, installs anywhere), `cp3XY` / `cp3XYt` (version-specific — one build per CPython release, for the GIL or free-threaded build), and `abi3` / `abi3t` (stable — build once, runs on that version and every newer one).
- The free-threaded build changes the layout of `PyObject`, so it needs its own ABIs; existing `abi3` wheels won't load on it.
- `abi3t`, new in Python 3.15, is the stable ABI for the free-threaded build — the missing piece that lets a single wheel target free-threaded Python 3.15 and every release after it.
- During the transition, shipping `abi3` plus a `cp314t` wheel (and `abi3.abi3t` from 3.15 on) covers every interpreter version.
