---
title: "Numpy QuadDType: Quadruple Precision for Everyone"
authors: [swayam-singh]
published: September 30, 2024
description: "Introducing the new data type for Numpy providing cross-platform support of quadruple precision."
category: [OSS Experience, Array API, PyData ecosystem, Packaging]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: "WIP"
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: "WIP"
---

*Picture this*: You're a scientist, working on complex simulations that push the boundaries of numerical precision. You fire up your trusty NumPy-powered Python script, eagerly anticipating the results. But then... your calculations start producing unexpected errors. You've just stumbled into the realm of floating-point precision limitations.

Hi there! I'm [Swayam Singh](https://github.com/SwayamInSync/), and for the past three months, I've been developing numpy_quaddtype with [Nathan Goldbaum](https://github.com/ngoldbaum), a true cross-platform quadruple precision datatype for NumPy. In this blog post, we'll explore why such high precision is sometimes necessary, dive into the technical aspects of numpy_quaddtype, and discuss its potential applications. Whether you're a quantum physicist, a financial modeler, or just curious about numerical computing, this post will give you insights about current precision limitations in NumPy and how we are resolving them.

So buckle up and grab your favorite beverage (*might I suggest a Quad Espresso?*)

---

=> WIP (Table of contents)

---
## The Long Double Dilemma in NumPy

The `np.longdouble` dtype in NumPy has become a significant pain point for developers and users alike. Ralf Gommers, a core NumPy developer, highlighted several critical issues that make long double support "extremely painful to maintain, probably far more than justified."

1. **Cross-Platform Inconsistency**

   The `long double` type varies dramatically across platforms:
   - Windows & macOS: 64-bit (same as `double`)
   - Linux (x86/x86_64): 80-bit
   - Some architectures (IBM Power9): True 128-bit quadruple precision

   This inconsistency leads to portability issues and unexpected behavior, read more about this at [NumPy: Issue #14574](https://github.com/numpy/numpy/issues/14574).

2. **Build Complications**
   Building NumPy, especially on Windows, has become increasingly complex due to `np.longdouble`:
   - MSVC uses 64-bit `long double`
   - Mingw-w64 defaults to 80-bit `long double`

   This discrepancy necessitates dealing with multiple toolchains and compiler patches, significantly increasing the maintenance burden. A detailed discussion of this issue can be found at [NumPy: Issue #20348](https://github.com/numpy/numpy/issues/20348):

3. **Non-Standard Format**
   NumPy supports 9 different binary representations for long double, each requiring specialized code:
   - Example: Complex platform-specific handling in [Dragon4 algorithm implementation](https://github.com/numpy/numpy/blob/480dbf631b03ee48150ded049d2e8988b6ffbb81/numpy/_core/src/multiarray/dragon4.c#L2467)

   This complexity makes it challenging to implement and maintain, even in build systems like Meson, more about it at [Meson: Issue #11068](https://github.com/mesonbuild/meson/issues/11068).

4. **Maintenance Overhead**
   The NumPy team spends a disproportionate amount of time addressing `long double`-related issues, as well as dealing with hard-to-diagnose build issues, especially on Windows :
    - [NumPy Pull #20360](https://github.com/numpy/numpy/pull/20360)
    - [NumPy Pull #18536](https://github.com/numpy/numpy/pull/18536)
    - [NumPy Pull #21813](https://github.com/numpy/numpy/pull/21813)
    - [NumPy Pull #22405](https://github.com/numpy/numpy/pull/22405)
    - [NumPy Pull #19950](https://github.com/numpy/numpy/pull/19950)
    - [NumPy Commit #aa9fd3c7cb](https://github.com/numpy/numpy/pull/18330/commits/aa9fd3c7cb)
    - [SciPy Issue #16769](https://github.com/scipy/scipy/issues/16769)
    - [NumPy Issue #14574](https://github.com/numpy/numpy/issues/14574)


5. **Limited Practical Benefits**
   Despite these challenges, the benefits of `long double` are questionable:
   - On Windows and macOS, it's functionally identical to `double`, only consuming more memory with padded bits.
   - On Linux, it provides only a modest precision increase (80-bit vs 64-bit).

6. **Hidden Complexity**
   The `long double` issue extends beyond the user-visible dtype. It's also baked into the libnpymath static library shipped with NumPy, adding another layer of complexity to any potential solutions [NumPy Issue #20880](https://github.com/numpy/numpy/issues/20880).

Given these issues, the NumPy community is at a crossroads. The current approach to `long double` support is proving to be increasingly problematic and difficult to maintain. It's clear that a new direction is needed to ensure the long-term stability and usability of NumPy across different platforms.

As we move forward, the community is considering several potential solutions, from full deprecation to developing a true cross-platform quadruple precision dtype.

In our next section, we'll explore how `numpy_quaddtype` aims to address these issues, promising a future where high-precision computing in Python doesn't come with a side of maintenance headaches.
