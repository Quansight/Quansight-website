---
title: >
  lib_sf_error_state – The story of SciPy's first shared library
published: August 1, 2024
authors: [albert-steppi]
description: 'lorem ipsum'
category: [PyData ecosystem]
featuredImage:
  src: /posts/lib-sf-error-state/featured.png
  alt: >
    The text "SciPy" along with the SciPy logo superimposed over an elaborate computer generated image of a circuitboard in the style of Francisco Goya, intended to evoke a sense of great complexity beneath a simple surface.
hero:
  imageSrc: /posts/lib-sf-error-state/hero.png
  imageAlt: 'The text "SciPy" along with the SciPy logo superimposed over an elaborate computer generated image of a circuitboard in the style of Francisco Goya, intended to evoke a sense of great complexity beneath a simple surface.'
---

### Intro to scipy.special

[`scipy.special`](https://docs.scipy.org/doc/scipy/reference/special.html) offers
implementations of a wide collection of [special
functions](https://en.wikipedia.org/wiki/Special_functions). Though not a
precise term, a loose definition of a special function is a mathematical
function which cannot be expressed in terms of well known [elementary
functions](https://en.wikipedia.org/wiki/Elementary_function) (think
polynomials,`log`, `exp`, `sin`, etc.), but which arises in applications
frequently enough that it is worthy of its own name.

Most of the functions in `scipy.special` are NumPy [Universal
functions](https://numpy.org/doc/stable/reference/ufuncs.html) - ufuncs for
short. A ufunc operates on NumPy
[`ndarrays`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html#numpy.ndarray),
looping over the elements and evaluating a function in efficient native code, avoiding Python
function call overhead.

Here is an example using the [Gamma
function](https://en.wikipedia.org/wiki/Gamma_function), a continuous extension
of the factorial, to reproduce a plot from the Wikipedia article [_Volume of an
n-ball_](https://en.wikipedia.org/wiki/Volume_of_an_n-ball). The plot shows how
the volume of a solid multi-dimensional sphere depends on the dimension `n` when
the radius `R` is one of 0.9, 1.0, or 1.1.

```python
import matplotlib.pyplot as plt
import numpy as np
import scipy.special as special

N = np.arange(0, 26)  # dimension
R = np.array([0.9, 1.0, 1.1])  # radius
# meshgrid makes it convenient to evaluate formula over the grid N x R
N, R = np.meshgrid(N, R)

# Formula for volume of an n-ball in terms of radius R and dimension N.
V = np.pi**(N/2)/special.gamma(N/2 + 1) * R**N

fig, ax = plt.subplots(1, 1)
ax.scatter(N[0], V[0], color='cadetblue', alpha=0.6, label="$R = 0.9$")
ax.scatter(N[1], V[1], color='indianred', alpha=0.6, label="$R = 1.0$")
ax.scatter(N[2], V[2], color='darkseagreen', alpha=0.6, label="$R = 1.1$")
ax.set_xlim(0, 25)
ax.set_ylim(0, 10)
ax.set_xticks([5, 10, 15, 20, 25])
ax.set_yticks([2, 4, 6, 8, 10])
ax.grid()
ax.legend()
plt.show()
```

which outputs

<p align="center">
  <img
    src="/posts/lib-sf-error-state/n_sphere_volume.png"
	alt="Plot showing how the volume of an n-ball depends on the
		dimension n for radius R = 0.9, 1.0, and 1.1"
   />
</p>

Beyond the performance benefit from getting to loop and evaluate over arrays in
low level native code, ufuncs also let us write more readable Python code
by allowing us to work directly with arrays without having to write our own loops.

### Error handling for ufuncs

Having ufuncs which operate over entire arrays poses a question. What should
be done if errors occur for some of the scalar function evaluations performed
when looping over the input arrays? The scalar function `gamma`
in the [`math`](https://docs.python.org/3/library/math.html) module from the
Python standard library raises an exception when the input is a non-positive
integer, since these points, known as poles, are outside the domain of the Gamma
function

```
In [1]: import math

In [2]: math.gamma(-2)
---------------------------------------------------------------------------
ValueError                                Traceback (most recent call last)
Cell In[2], line 1
----> 1 math.gamma(-2)

ValueError: math domain error
```

But consider the example below where we evaluate the Gamma function over many
points to produce a graph. Would it make sense to raise an exception because
5 of the 5,000,001 inputs are outside of the domain?

```python
import matplotlib.pyplot as plt
import numpy as np
import scipy.special as special

x = np.linspace(-5, 5, 5000001)
y = special.gamma(x)

fig, ax = plt.subplots(1, 1)
ax.plot(x, y, color="blue")
ax.set_xlim(-5, 5)
ax.set_ylim(-5, 5)
ax.minorticks_on()
ax.grid(which="major", linestyle="-", linewidth="0.75", color="black")
ax.grid(which="minor", linestyle=":", linewidth="0.5", color="gray")
plt.show()
```

If we run it, we see that it produces the correct result without issue

<p align="center">
  <img
    src="/posts/lib-sf-error-state/gamma_function_plot.png"
	alt="Plot of the Gamma function for x in the interval from -5 to  5."
   />
</p>

The errors were ignored. There may be situations where one
actually cares about errors though, and therefore `scipy.special`
provides [`seterr`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.seterr.html#scipy.special.seterr), [`geterr`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.geterr.html#scipy.special.geterr) and a
[`errstate`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.errstate.html#scipy.special.errstate) for controlling how
special-function errors are handled. These tools mirror those used in
NumPy for controlling [floating point error handling](https://numpy.org/devdocs/reference/routines.err.html). By default, all special-function errors are ignored,
but below we use the `special.seterr` context manager to raise warnings instead,
observing 5 warnings corresponding to the 5 poles of the Gamma function within the
array `x`.

```
In [1]: import numpy as np

In [2]: import scipy.special as special

In [3]: x = np.linspace(-5, 5, 5000001)

In [4]: with special.errstate(all="warn"):
   ...:     y = special.gamma(x)
   ...:
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
<ipython-input-6-b5f6b4a88c33>:2: SpecialFunctionWarning: scipy.special/Gamma: overflow
  y = special.gamma(x)
```

### Trouble

At first glance, special function error handling may seem like a straightforward
feature, but beneath the surface there is complexity. To understand why, let's
look into the workings of ufuncs in `scipy.special`.

Every ufunc is based on a _scalar kernel_ written in a compiled language.
In most cases, a scalar kernel is a function which takes either a scalar
floating point or integer value for each of its inputs and return a
single scalar. Historically, `scipy.special` featured scalar kernels written
in the compiled languages C, C++, Fortran, and Cython, mostly borrowed from
existing open source libraries

```c++
double Gamma(double x) {
    ...
```
