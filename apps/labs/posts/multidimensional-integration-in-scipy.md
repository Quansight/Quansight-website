---
title: 'Multdimensional integration in SciPy'
description: Extending SciPy's integration facilities for multidimensional and array-valued integrands.
authors: [olly-britton]
published: September 12, 2024
category: [PyData ecosystem, Internship, Array API]
featuredImage:
  src: /posts/multidimensional-integration-in-scipy/trapezoid-subdivisions-featured.png
  alt: >
    Applying the trapezoid rule to a curve with three trapeziums. The two trapeziums
    on the right of the curve are darker and narrower, and their area more closely matches
    the area of the function.
hero:
  imageSrc: /posts/multidimensional-integration-in-scipy/subdivisions-in-higher-dimensions.png
  imageAlt: >
    A plot of an undulating function in 3D. On top of the surface of the function,
    there is a white mesh. The top right corner of the mesh is being filled in by a finer
    mesh.
---

Hi! I'm Olly Britton, an undergraduate studying mathematics and computer science in the UK. This blog post talks about the work I did extending SciPy's integration facilities as part of a three-month internship with Quansight Labs.

## The problem

In one sentence, my work consisted of adding support for multidimensional numerical integration of array-valued functions into SciPy.

Numerical integration, or "quadrature", is about _approximating_ the value of a definite integral of a function over some region – in other words, estimating the area or volume under a curve. This is in contrast to symbolic integration, which is interested in finding a closed-form for the _exact_ value.

Before this internship, I wondered why you might ever want just an approximation rather than the exact value. But there are many good reasons to prefer numerical integration over symbolic integration: for one, the problem of finding out whether the integral of an arbitrary function has a "closed-form" is actually impossible in general! And even when it is, the results can be hopelessly complicated even for simple functions.

$$
\begin{aligned}
&\int^1_0 \frac{1}{1 + x + x^3} \, \text dx \approx 0.6303 \\\\
&\int^1_0 \frac{1}{1 + x + x^3} \, \text dx = \frac{2 ^ \frac{4}{3}\cdot3 ^ \frac{5}{2} \left(\frac{\sqrt{31}}{2\cdot 3 ^ \frac{3}{2}} - \frac 1 2\right)\ln\Big(\Big| 2- \cdots}{\sqrt[3]{\sqrt{31} - 3 ^ \frac{3}{2}}\Big(\Big(-\frac{3 ^ \frac{3}{2} \sqrt[3]{29 \cdot 3 ^ \frac{3}{2}\cdot}}{\sqrt[3]{2}} \,\,\,\cdots}
\end{aligned}
$$

Numerical integration is necessary across many different domains of mathematics and science, especially when faced with real-world problems that are difficult to solve analytically. It's also one of the oldest mathematical problems that humans have been tackling, with a long history stretching all the way back to Archimedes where he estimated the value of $\pi$ by approximating the area of a circle.

Before modern computational tools like SciPy existed, people used all sorts of tricks to answer these problems accurately – Archimedes painstakingly approximated the circle as a 96-sided polygon so that he could accurately estimate its area, and there's an apocryphal story of Galileo, frustrated with trying to estimate the area under a particular curve mathematically, physically cutting the graph of a function out of metal and weighing the pieces.

Had Galileo or Archimedes been transported to the modern age and given access to SciPy and a computer, maybe after a moment of familiarizing themselves with the flourishing PyData ecosystem, they would check what facilities are now available for integration:

```python
>>> import scipy
>>> help(scipy.integrate)
Integrating functions, given function object
============================================

    quad          -- General purpose integration
    quad_vec      -- General purpose integration of vector-valued functions
    dblquad       -- General purpose double integration
    tplquad       -- General purpose triple integration
    nquad         -- General purpose N-D integration
    ...
```

After 20 years of maturing as an open source project, SciPy now contains over 15 different functions for numerical integration, all of which address different but overlapping use-cases and functionality. My task for this internship was to address a small gap in these offerings: improving the support for multidimensional numerical integration ("cubature"), as initially discussed [in this SciPy issue](https://github.com/scipy/scipy/issues/20252) in March earlier this year. This culminated in a new function `scipy.integrate.cubature` which slots into the middle of the "array-valued" and "multidimensional" Venn diagram.

![A Venn diagram with two intersecting circles. One is labelled "array-valued integrands", the other is labelled "multi-dim integrands". In the intersection, "cubature" is written with a smiley face afterwards. There is another partial circle at the bottom labelled "available to Galileo and Archmides".](/posts/multidimensional-integration-in-scipy/scipy-integration-venn-diagram.png)

By "multidimensional", I mean that the routine supports calculating integrals of more than one variable (so volumes and not just areas under a curve), and by "array-valued", I mean that the routine supports integrands that can return arbitrarily-shaped arrays rather than a single number.

What does it mean to integrate a function that returns an array? It's the same as if you were to differentiate a function that returns an array: you integrate separately each element of the output. If the function returns a vector (the special case of a 1D array), then this is identical to integrating each component separately:

$$
\begin{aligned}
&\mathbf f: \mathbb R^n \to \mathbb R^m \\\\
&\mathbf f(\pmb x) = [\mathbf f_1(x_1, \ldots, x_n), \ldots, \mathbf f_m(x_1, \ldots, x_n)]^\top \\\\
\int &\mathbf f(\pmb x) \text d\pmb x = \left[\int\mathbf f_1(\pmb x) \text d\pmb x, \ldots, \int\mathbf f_m(\pmb x) \text d\pmb x\right]^\top
\end{aligned}
$$

Previously, there was no function in SciPy that let you efficiently integrate functions that were both multidimensional and array-valued at the same time. For example, `quad_vec` integrates array-valued univariate functions, while `nquad` handles scalar-valued multivariate functions. But there nothing that let you handle integrands that were both.

## A small example: solving a problem with `cubature`

In Pythonville, a small village that lives in the unit square $[0, 1]^2$, some of the scientists there have come up with a model of the rainfall per $\text{cm}^2$ at every $(x, y)$ coordinate on a given day $n$. This is implemented as a function which looks something like this:

```python
def f(x_arr):
    """
    Given an array of (x, y) coordinates, return an array of predicted
    rainfall per cm^2 at those coordinates for the next 30 days.
    """
    x, y = x_arr[:, 0], x_arr[:, 1]

    # ...magic weather prediction code...

    return rainfall_per_cm2

f(np.array([[0.1, 0.2], [0.1, 0.4]]))
# Output:
# array([[0.3524, ..., 0.2235], [0.7881, ..., 0.7873]])
```

Their implementation of $f$ is _vectorized_ – although $f$ is a actually function of two variables ($x$ and $y$), integration can be done faster if you can pass it an array of points $f([[x_1, y_1], [x_2, y_2], \ldots])$ and the results can all be computed in one call, rather than evaluating one point at a time. In other words, $f$ operates on whole arrays at a time rather than individual elements.

Given this function, the scientists now wish to calculate the total daily rainfall $r$ that's going to fall on the patch around where they live. This is equivalent to the following double integral:

$$
r(n) = \int^1_0 \int^1_0 \mathbf f(x, y) \, \text dy \text dx
$$

This can be done with the new `scipy.integrate.cubature` function like so:

```python
from scipy.integrate import cubature

cubature(
    f,      # Function to integrate
    [0, 0], # Lower limits of integration
    [1, 1], # Upper limits of integration
)
# Output: total rainfall on each day
# array([0.5123, 0.4993, ...])
```

This was not impossible in SciPy prior to the introduction of `cubature`, but it was a lot messier. Here's how they could have done it with `dblquad`, which is one of the existing integration functions for multidimensional integrands:

```python
from scipy.integrate import dblquad

# Now assuming f has been implemented as f(x, y, z), rather
# than being vectorised:

results = []

# Rainfall for days 1 to 30
for i in range(30):
    res, err = dblquad(f, 0, 1, 0, 1, args=(n,))
    results.append(res)
```

Here, the usefulness of supporting array-valued integrands should be clear: it lets you avoid for-loops like this one, and this means that the code can more effectively utilise the underlying array library (such as NumPy). This allows the 30 integrals required for each day to be computed simultaneously, rather than one at a time.

`dblquad`'s implementation uses a wrapper around a FORTRAN 77 package called QUADPACK. The version in SciPy was written in 1984! (Although, while I completed the internship, the version of QUADPACK in SciPy was actually [translated to C by Ilhan Polat](https://github.com/scipy/scipy/commit/7b9c3ba7f2b8cb6a2c7b3bbd1cfcb2e1cea1525c)). The fact the package being used is from 40 years ago is not inherently a bad thing, if anything it demonstrates that it is a robust piece of software. But ignoring 40 years of growth in scientific computing it is not without its drawbacks.

## Array API support

Another feature of `cubature` is that it also supports the array API standard. For a good primer on what this means, see [The Array API Standard in SciPy](https://labs.quansight.org/blog/scipy-array-api). In brief, a lot of SciPy relies heavily on NumPy, which provides the `array` data structure used to efficiently implement most of the algorithms SciPy offers. But considerable recent effort has meant that lots of SciPy functions are now array-agnostic – you can give these functions arrays from other compatible libraries, like PyTorch or CuPy, and they will also work:

```python
import torch

f(torch.Tensor([[0.1, 0.2], [0.1, 0.4]]))
# Output:
# tensor([[0.3524, ..., 0.2235], [0.7881, ..., 0.7873]])

cubature(f, [0, 0], [1, 1])
# Output:
# tensor([0.5123, 0.4993, ...])
```

This is good news for lots of reasons. For one, it means you can do array operations on the GPU rather than the CPU. This would've been quite difficult to add to `dblquad` and the rest of the functions from the QUADPACK family, since QUADPACK actually predates the first GPU!

## Arbitrary regions of integration

The examples so far have focussed on integrals over rectangular regions, but it's also common to see integrals over non-rectangular regions. These are problems where the limits are functions rather than just constants.

For example, one way of phrasing Archimedes' problem of approximating $\pi$ is that he was, without knowing it, approximating the following integral:

$$
\int^1_{-1} \int^{\sqrt{1-x^2}}_{-\sqrt{1-x^2}} \,1 \,\text dy \text dx
$$

`cubature` also supports these kind of problems, where you have arbitrary functions in the limits:

```python
cubature(
    f=lambda x_arr: np.ones(x_arr.size[0]),  # f is the constant 1 function
    a_func=[-1, lambda x: -np.sqrt(1-x**2)],
    b_func=[ 1, lambda x:  np.sqrt(1-x**2)],
)
# Output:
# array([3.14159])
```

You can even put infinity before the functions and it will still work. For example:

$$
\int^\infty_0 \int^x_0 e^{-x^2-y^2} \text dy \text dx = \frac \pi 8
$$

```python
cubature(
    f,
    a_func=[0, lambda x: 0],
    b_func=[np.inf, lambda x: x],
)
# Output:
# array([0.3926...])
```

Again, this could also have been previously using existing routines like `dblquad` and `nquad`, but was no existing functionality for integrating array-valued integrands over arbitrary regions. Also, the approach that `dblquad` takes to handling double integrals (namely, treating them as a series of nested 1D integration problems) has some disadvantages compared to the approach that `cubature` takes.

## How it works: $h$-adaptive cubature

`cubature` isn't fixed to using one particular mathematical approach to numerical integration, like using the trapezoid rule. Instead, it instead accepts a parameter called `rule`, which is a class with two methods: `estimate(f, a, b)` and `estimate_error(f, a, b)` (or a string, which is an alias for a particular class).

There might be `rule` classes for something like applying the trapezoid rule or Gauss-Legendre quadrature, both of which sample the function $f$ being integrated at a fixed number of points, and do some calculations to turn these evaluations into an estimate for the integral over that region. These rules by themselves aren't very flexible, and so might not give very good approximations – the job of `cubature` is then to work out how to repeatedly apply each `rule` over different subregions in order to get an accurate estimate of the integral.

For example, the simplest version of trapezium rule evaluates the function at the start and end of an interval, and estimates that the area of the function is roughly the same as the area of the trapezium formed by connecting up these two points.

![An illustration of the premise behind the trapezoid rule. A curve is show, and layered on top is a trapezium that begins and ends at the start and end of the curve.](basic-trapezoid-rule.png)

If the number of points that $f$ is evaluated at remains constant for each call to `rule`, then you'd expect that applying the rule over a smaller region would give more accurate estimates. This forms the basis of "$h$-adaptive" algorithms: estimate the integral over the big region requested by the user, and if the error is too high, split the interval in half and apply the rule to each of the subregions separately. Then you continue dividing the region with the highest error until the tolerance is reached.

<video controls>
  <source src="/posts/multidimensional-integration-in-scipy/refining-trapezoid-rule.mp4" type="video/mp4">
</video>

If instead you increase the number of points that $f$ is evaluated at for each call to `rule` while keeping the size of the region fixed, this forms the basis of a "$p$-adaptive" algorithm. $h$-adaptive algorithms and $p$-adaptive algorithms are named for the things they vary: $h$-adaptive algorithms vary the size ($h$) of the region being integrated, and $p$-adaptive algorithms vary the number of points ($p$) being used.

For $h$-adaptive cubature in higher dimensions, the process is almost identical. Rather than splitting an interval in two, you now split a rectangular patch of the function into four. Then you refine the estimate over the subregions which have the highest estimated error.

<video controls>
  <source src="/posts/multidimensional-integration-in-scipy/subdivisions-in-higher-dimensions.mp4" type="video/mp4">
</video>

That's the premise behind the algorithm. In more than two dimensions, things get harder to visualise, but the idea is the same: compute an estimate of the integral over some region, and if the error is still too high, split that region into many smaller regions and apply the rule on these mini-regions separately. But the basic idea is still the same: stripped down, the key loop in the actual source of `cubature` reads something like this:

```python
# Find the estimate of the integral over the big region requested
# by the user
est = rule.estimate(f, a, b)
err = rule.estimate_error(f, a, b)

regions = [Region(a, b, est, err)]

# While the error is still too high...
while np.any(err > atol + rtol * np.abs(est)):
    # Find the region with the largest error
    region = heapq.heappop(regions)

    # Refine this region into several subregions
    for (a_k, b_k) in find_subregions(region):
        # Calculate the estimate over this subregion
        subregion_est = rule.estimate(f, a_k, b_k)
        subregion_err = rule.estimate_error(f, a_k, b_k)

        est += subregion_est
        err += subregion_err

        heapq.heappush(regions, Region(a_k, b_k, subregion_est, subregion_err))

    # Remove old estimate so we don't double count
    est -= region.est
    err -= region.err
```

Another piece of the puzzle is how arbitrary regions are handled. It's not immediately obvious how you'd apply this algorithm to integrals like this one from earlier:

$$
\int^\infty_0 \int^x_0 e^{-x^2-y^2} \text dy \text dx = \frac \pi 8
$$

The issue here is that the region being integrated over is no longer rectangular, so you need some consistent method of subdividing non-rectangular regions. The technique for this is very pretty: you apply a coordinate transformation to the integral which turns it into an equivalent integral over a rectangle like $[-1, 1]^n$, and then you subdivide like before. Then subdivisions in these transformed coordinates correspond to useful non-linear subdivisions in the original coordinates.

## Conclusion

Prior to this internship, the prospect of contributing to a large open source project as a first-time contributor had felt a little daunting – but I have had an extremely rewarding experience over the last three months. I have had the unique opportunity of interacting with an incredibly positive and flourishing community, learning some very practical skills for a future career in software engineering and open source, and all while learning about something very interesting.

I'd like to thank my mentors [Evgeni Burovski](https://github.com/ev-br) and [Irwin Zaid](https://github.com/izaid) for all of their generous help and support, and [Melissa Mendonça](https://github.com/melissawm) for coordinating the internship itself and offering lots of helpful advice. I would also like to thank the many members of the SciPy community who took their time to review my PRs, including [Lucas Colley](https://github.com/lucascolley), [Jake Bowhay](https://github.com/j-bowhay) and [Ilhan Polat](https://github.com/ilayn). And finally, many thanks to Quansight Labs for enabling providing such a distinctive and fulfilling opportunity.
