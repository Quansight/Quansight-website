---
title: "Using Hypothesis to test array-consuming libraries"
author: matthew-barber
published: October 6, 2021
description: 'This blog post is for anyone developing array-consuming methods (think SciPy and scikit-learn) and is new to property-based testing. I demonstrate a typical workflow of testing with Hypothesis whilst writing an array-consuming function that works for all libraries adopting the Array API, catching bugs before your users do.'
category: [Array API]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: 'Excellent alt-text describing the featured image'
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: 'Excellent alt-text describing the hero image'
---

![Hypothesis logo accompanied by the text \"Property-based testing for
the Array API\"](/images/2021/10/hypothesis-array-api-social.png)

Over the summer, I\'ve been interning at Quansight Labs to develop
testing tools for the developers and users of the upcoming [Array API
standard](https://data-apis.org/array-api/latest/). Specifically, I
contributed \"strategies\" to the testing library
[Hypothesis](https://github.com/HypothesisWorks/hypothesis/), which I\'m
excited to announce are now available in
[`hypothesis.extra.array_api`](https://hypothesis.readthedocs.io/en/latest/numpy.html#array-api).
Check out the primary [pull
request](https://github.com/HypothesisWorks/hypothesis/pull/3065) I made
for more background.

This blog post is for anyone developing array-consuming methods (think
SciPy and scikit-learn) and is new to property-based testing. I
demonstrate a typical workflow of testing with Hypothesis whilst writing
an array-consuming function that works for *all* [libraries adopting the
Array
API](https://data-apis.org/array-api/latest/purpose_and_scope.html#stakeholders),
catching bugs before your users do.

## Before we begin

Hypothesis shipped with its Array API strategies in [version
6.21](https://hypothesis.readthedocs.io/en/latest/changes.html#v6-21-0).
We also need to use NumPy \>= 1.22 so that we can test with its
[recently merged](https://github.com/numpy/numpy/pull/18585) Array API
implementation---this hasn\'t been released just yet, so I would
recommend installing a [nightly
build](https://anaconda.org/scipy-wheels-nightly/numpy).

I will be using the excellent
[ipytest](https://github.com/chmp/ipytest/) extension to nicely run
tests in Jupyter as if we were using
[pytest](https://github.com/pytest-dev/pytest/) proper. For pretty
printing I use the superb [Rich](https://github.com/willmcgugan/rich)
library, where I simply override Python\'s builtin `print` with
[`rich.print`](https://rich.readthedocs.io/en/stable/reference/init.html#rich.print).
I also suppress all warnings for convenience\'s sake.

``` python
%%capture
!pip install hypothesis>=6.21
!pip install -i https://pypi.anaconda.org/scipy-wheels-nightly/simple numpy
```

``` python
%%capture
!pip install ipytest
import ipytest; ipytest.autoconfig(display_columns=80)
```

``` python
%%capture
!pip install rich
from rich import print
```

``` python
import warnings; warnings.filterwarnings("ignore")
```

## What the Array API enables

The [API](https://data-apis.org/array-api/latest/) standardises
functionality of array libraries, which has [numerous
benefits](https://data-apis.org/array-api/latest/use_cases.html) for
both developers and users. I recommend reading the [Data APIs
announcement
post](https://data-apis.org/blog/announcing_the_consortium/) to get a
better idea of how the API is being shaped, but for our purposes it
works an awful lot like NumPy.

The most exciting prospect for me is being able to easily write an
array-consuming method that works with all the adopting libraries.
Let\'s try writing this method to calculate the cumulative sums of an
array:

``` python
def cumulative_sums(x):
    """Return the cumulative sums of the elements of the input."""
    xp = x.__array_namespace__()
    
    result = xp.empty(x.size, dtype=x.dtype)
    result[0] = x[0]
    for i in range(1, x.size):
        result[i] = result[i - 1] + x[i]
        
    return result
```

The all-important
[`__array_namespace__()`](https://data-apis.org/array-api/latest/API_specification/array_object.html#method-array-namespace)
method allows array-consuming methods to get the array\'s respective
Array API module. Conventionally we assign it to the variable `xp`.

From there you just need to rely on the guarantees of the Array API to
support NumPy, TensorFlow, PyTorch, CuPy, etc. all in one simple method!

## Good ol\' unit tests

I hope you\'d want write some tests at some point 😉

We can import NumPy\'s Array API implementation and test with that for
now, although in the future it\'d be a good idea to try other
implementations (see [related Hypothesis
issue](https://github.com/HypothesisWorks/hypothesis/issues/3085)). We
don\'t `import numpy as np`, but instead import NumPy\'s new module
`numpy.array_api`, which exists to comply with the Array API standard
where `numpy` proper can not (namely so NumPy can keep backwards
compatibility).

``` python
from numpy import array_api as nxp

def test_cumulative_sums():
    x = nxp.asarray([0, 1, 2, 3, 4])
    assert nxp.all(cumulative_sums(x) == nxp.asarray([0, 1, 3, 6, 10]))
    
ipytest.run()
```

    .                                                                        [100%]
    1 passed in 0.02s

I would probably write a
[parametrized](https://docs.pytest.org/en/stable/parametrize.html) test
here and write cases to cover all the interesting scenarios I can think
of. Whatever we do, we will definitely miss some edge cases. What if we
could catch bugs we would never think of ourselves?

## Testing our assumptions with Hypothesis

```{=html}
<!-- I would put this in a quote block, but lists look bad with the blog's style -->
```
Hypothesis is a property-based testing library. To lift from their
excellent
[docs](https://hypothesis.readthedocs.io/en/latest/index.html), think of
a normal unit test as being something like the following:

1.  Set up some data.
2.  Perform some operations on the data.
3.  Assert something about the result.

Hypothesis lets you write tests which instead look like this:

1.  For all data matching some specification.
2.  Perform some operations on the data.
3.  Assert something about the result.

You almost certainly will find new bugs with Hypothesis thanks to how it
cleverly fuzzes your specifications, but the package really shines in
how it [\"reduces\" failing test
cases](https://drops.dagstuhl.de/opus/volltexte/2020/13170/) to present
only the minimal reproducers that trigger said bugs. This demo will
showcase both its power and user-friendliness.

Let\'s try testing a simple assumption that we can make about our
`cumulative_sums()` method:

> For an array with positive elements, its cumulative sums should only
> increment or remain the same per step.

```{=html}
<!--Formally we might express this assumption as $\forall i \in \{1,\ldots,\vert x \vert \}.f(x)_i - f(x)_{i-1} \geq 0$.-->
```
```{=html}
<!--Formally you might specify this assumption as
"if $A$ is a $n$-lengthed ordered set
containing values $v$ that satisfy $v\in\mathbb{R}$ and  $v\geq0$,
for the cumulative sums function $f$ defined as $f(A)_j = \sum_{i=1}^j A_i$,
when $j > 1$ the following is always true: $f(A)_j \geq f(A)_{j-1}$."-->
```
We can write a simple enough Hypothesis-powered test method for this:

``` python
from hypothesis import given
from hypothesis.extra.array_api import make_strategies_namespace

xps = make_strategies_namespace(nxp)

@given(xps.arrays(dtype="uint8", shape=10))
def test_positive_arrays_have_incrementing_sums(x):
    a = cumulative_sums(x)
    assert nxp.all(a[1:] >= a[:-1])
```

As the Array API tools provided by Hypothesis are agnostic to the
adopting array/tensor libraries, we first need to bind an implementation
via
[`make_strategies_namespace()`](https://hypothesis.readthedocs.io/en/latest/numpy.html#hypothesis.extra.array_api.make_strategies_namespace).
Passing `numpy.array_api` will give us a
[`SimpleNamespace`](https://docs.python.org/3/library/types.html#types.SimpleNamespace)
to use these tools for NumPy\'s Array API implementation.

The
[`@given()`](https://hypothesis.readthedocs.io/en/latest/details.html#hypothesis.given)
decorator tells Hypothesis what values it should generate for our test
method. In this case
[`xps.arrays()`](https://hypothesis.readthedocs.io/en/latest/numpy.html#xps.arrays)
is a \"search strategy\" that specifies Array API-compliant arrays from
`numpy.array_api` should be generated.

In this case, `shape=10` specifies the arrays generated are
1-dimensional and of size 10, and `dtype="uint8"` specifies they should
contain unsigned integers (which is handy for our test method as uints
are always positive). Let\'s quickly see a small sample of the arrays
Hypothesis can generate:

``` python
for _ in range(10):
    x = xps.arrays(dtype="uint8", shape=10, unique=True).example()
    print(repr(x))
print("...")
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span><span style="color: #008080; text-decoration-color: #008080; font-weight: bold">239</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">211</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">226</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">129</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">31</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">13</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">80</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">235</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">163</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span><span style="color: #008080; text-decoration-color: #008080; font-weight: bold">164</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">175</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">111</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">63</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">241</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">64</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">201</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">173</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">117</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span><span style="color: #008080; text-decoration-color: #008080; font-weight: bold">106</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">149</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">210</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">230</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">58</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">37</span>,  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">66</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">153</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">203</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">181</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span> <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">93</span>,   <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span> <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">16</span>,   <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span><span style="color: #008080; text-decoration-color: #008080; font-weight: bold">172</span>,   <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span><span style="color: #008080; text-decoration-color: #008080; font-weight: bold">129</span>,   <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span><span style="color: #008080; text-decoration-color: #008080; font-weight: bold">111</span>,   <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span> <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">67</span>,   <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #800080; text-decoration-color: #800080; font-weight: bold">Array</span><span style="font-weight: bold">([</span>  <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">0</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">255</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">254</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">253</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">252</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">251</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">250</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">249</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">248</span>, <span style="color: #008080; text-decoration-color: #008080; font-weight: bold">247</span><span style="font-weight: bold">]</span>, <span style="color: #808000; text-decoration-color: #808000">dtype</span>=<span style="color: #800080; text-decoration-color: #800080">uint8</span><span style="font-weight: bold">)</span>
</pre>
```

```{=html}
<pre style="white-space:pre;overflow-x:auto;line-height:normal;font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><span style="color: #808000; text-decoration-color: #808000">...</span>
</pre>
```

How Hypothesis \"draws\" from its strategies can look rather
unremarkable at first. A small sample of draws might look fairly uniform
but trust that strategies will end up covering all kinds of edge cases.
Importantly it will cover these cases efficiently so that
Hypothesis-powered tests are *relatively* quick to run on your machine.

All our test method does is get the cumulative sums array `a` that is
returned from `cumulative_sums(x)`, and then check that every element
`a[i]` is greater than or equal to `a[i-1]`.

Time to run it!

``` python
ipytest.run("-k positive_arrays_have_incrementing_sums", "--hypothesis-seed=3")
```

    F                                                                        [100%]
    =================================== FAILURES ===================================
    _________________ test_positive_arrays_have_incrementing_sums __________________

        @given(xps.arrays(dtype="uint8", shape=10))
    >   def test_positive_arrays_have_incrementing_sums(x):

    <cell>:7: 
    _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

    x = Array([26, 26, 26, 26, 26, 26, 26, 26, 26, 26], dtype=uint8)

        @given(xps.arrays(dtype="uint8", shape=10))
        def test_positive_arrays_have_incrementing_sums(x):
            a = cumulative_sums(x)
    >       assert nxp.all(a[1:] >= a[:-1])
    E       assert Array(False, dtype=bool)
    E        +  where Array(False, dtype=bool) = <function all at 0x7f2d48cc2430>(Array([ 52,  78, 104, 130, 156, 182, 208, 234,   4], dtype=uint8) >= Array([ 26,  52,  78, 104, 130, 156, 182, 208, 234], dtype=uint8))
    E        +    where <function all at 0x7f2d48cc2430> = nxp.all

    <cell>:9: AssertionError
    ---------------------------------- Hypothesis ----------------------------------
    Falsifying example: test_positive_arrays_have_incrementing_sums(
        x=Array([26, 26, 26, 26, 26, 26, 26, 26, 26, 26], dtype=uint8),
    )
    =========================== short test summary info ============================
    FAILED <cell>::test_positive_arrays_have_incrementing_sums - assert A...
    1 failed, 1 deselected in 0.17s

Hypothesis has tested our assumption and told us we\'re wrong. It
provides us with the following falsifying example:

``` python
>>> x = xp.full(10, 26, dtype=xp.uint8)
>>> x
Array([ 26,  26,  26,  26,  26,  26,  26,  26,  26,  26], dtype=uint8)
>>> cumulative_sums(x)
Array([ 26,  52,  78, 104, 130, 156, 182, 208, 234,   4], dtype=uint8)
```

You can see that an overflow error has occurred for the final cumulative
sum, as 234 + 26 (260) cannot be represented in 8-bit unsigned integers.

Let\'s try promoting the dtype of the cumulative sums array so that it
can represent larger numbers, and then we can run the test again.

``` python
def max_dtype(xp, dtype):
    if dtype in [getattr(xp, name) for name in ("int8", "int16", "int32", "int64")]:
        return xp.int64
    elif dtype in [getattr(xp, name) for name in ("uint8", "uint16", "uint32", "uint64")]:
        return xp.uint64
    else:
        return xp.float64

def cumulative_sums(x):
    xp = x.__array_namespace__()
    
    result = xp.empty(x.size, dtype=max_dtype(xp, x.dtype))
    result[0] = x[0]
    for i in range(1, x.size):
        result[i] = result[i - 1] + x[i]
        
    return result

ipytest.run("-k positive_arrays_have_incrementing_sums")
```

    .                                                                        [100%]
    1 passed, 1 deselected in 0.18s

You can see another assumption about our code is:

> We can find the cumulative sums of arrays of any scalar dtype.

We should cover this assumption in our test method
`test_positive_arrays_have_incrementing_sums` by passing child search
strategies into our
[`xps.arrays()`](https://hypothesis.readthedocs.io/en/latest/numpy.html#xps.arrays)
parent strategy. Specifying `dtype` as
[`xps.scalar_dtypes()`](https://hypothesis.readthedocs.io/en/latest/numpy.html#xps.scalar_dtypes)
will tell Hypothesis to generate arrays of all scalar dtypes. To specify
that these array values should be positive, we can just pass keyword
arguments to the underlying value generating strategy
[`xps.from_dtype()`](https://hypothesis.readthedocs.io/en/latest/numpy.html#xps.from_dtype)
via `elements={"min_value": 0}`.

And while we\'re at it, let\'s make sure to cover another assumption:

> We can find the cumulative sums of arrays with multiple dimensions.

Specifying `shape` as
[`xps.array_shapes()`](https://hypothesis.readthedocs.io/en/latest/numpy.html#xps.array_shapes)
will tell Hypothesis to generate arrays of various dimensionality and
sizes. We can
[filter](https://hypothesis.readthedocs.io/en/latest/data.html#filtering)
this strategy with `lambda s: prod(s) > 1` so that always `x.size > 1`,
allowing our test code to still work.

``` python
from math import prod
from hypothesis import settings

@given(
    xps.arrays(
        dtype=xps.scalar_dtypes(),
        shape=xps.array_shapes().filter(lambda s: prod(s) > 1),
        elements={"min_value": 0},
    )
)
def test_positive_arrays_have_incrementing_sums(x):
    a = cumulative_sums(x)
    assert nxp.all(a[1:] >= a[:-1])
    
ipytest.run("-k positive_arrays_have_incrementing_sums", "--hypothesis-seed=3")
```

    F                                                                        [100%]
    =================================== FAILURES ===================================
    _________________ test_positive_arrays_have_incrementing_sums __________________

        @given(
    >       xps.arrays(
                dtype=xps.scalar_dtypes(),
                shape=xps.array_shapes().filter(lambda s: prod(s) > 1),
                elements={"min_value": 0},
            )
        )
    E   hypothesis.errors.MultipleFailures: Hypothesis found 2 distinct failures.

    <cell>:5: MultipleFailures
    ---------------------------------- Hypothesis ----------------------------------
    Falsifying example: test_positive_arrays_have_incrementing_sums(
        x=Array([[False, False]], dtype=bool),
    )
    TypeError: only size-1 arrays can be converted to Python scalars

    The above exception was the direct cause of the following exception:

    Traceback (most recent call last):
      <cell>, line 12, in test_positive_arrays_have_incrementing_sums
        a = cumulative_sums(x)
      <cell>, line 13, in cumulative_sums
        result[0] = x[0]
      File "<env>/numpy/array_api/_array_object.py", line 657, in __setitem__
        self._array.__setitem__(key, asarray(value)._array)
    ValueError: setting an array element with a sequence.

    Falsifying example: test_positive_arrays_have_incrementing_sums(
        x=Array([False, False], dtype=bool),
    )
    Traceback (most recent call last):
      <cell>, line 12, in test_positive_arrays_have_incrementing_sums
        a = cumulative_sums(x)
      <cell>, line 15, in cumulative_sums
        result[i] = result[i - 1] + x[i]
      File "<env>/numpy/array_api/_array_object.py", line 362, in __add__
        other = self._check_allowed_dtypes(other, "numeric", "__add__")
      File "<env>/numpy/array_api/_array_object.py", line 125, in _check_allowed_dtypes
        raise TypeError(f"Only {dtype_category} dtypes are allowed in {op}")
    TypeError: Only numeric dtypes are allowed in __add__
    =========================== short test summary info ============================
    FAILED <cell>::test_positive_arrays_have_incrementing_sums - hypothes...
    1 failed, 1 deselected in 0.38s

Again Hypothesis has proved our assumptions wrong, and this time it\'s
found two problems.

Firstly, our `cumulative_sums()` method doesn\'t adjust for boolean
arrays, so we get an error when we add two `bool` values together.

``` python
>>> x = xp.zeros(2, dtype=xp.bool)
>>> x
Array([False, False], dtype=bool)
>>> cumulative_sums(x)
Traceback:
  <cell>, line 15, in cumulative_sums
    result[i] = result[i - 1] + x[i]
  ...
TypeError: Only numeric dtypes are allowed in __add__
```

Secondly, our `cumulative_sums()` method is assuming arrays are
1-dimensional, so we get an error when we wrongly assume `x[0]` will
always return a single scalar (technically a 0-dimensional array).

``` python
>>> x = xp.zeros((1, 2), dtype=xp.bool)
>>> x
Array([[False, False]], dtype=bool)
>>> cumulative_sums(x)
Traceback:
  <cell>, line 13, in cumulative_sums
    result[0] = x[0]
  ...
TypeError: only size-1 arrays can be converted to Python scalars
```

I\'m going to flatten input arrays and convert the boolean arrays to
integer arrays of ones and zeros. Of-course we\'ll run the test again to
make sure our updated `cumulative_sums()` method now works.

``` python
def cumulative_sums(x):
    xp = x.__array_namespace__()
    
    x = xp.reshape(x, x.size)
    
    if x.dtype == xp.bool:
        mask = x
        dtype = xp.uint64
        x = xp.zeros(x.shape, dtype=xp.uint64)
        x[mask] = 1
        
    result = xp.empty(x.size, dtype=max_dtype(xp, x.dtype))
    result[0] = x[0]
    for i in range(1, x.size):
        result[i] = result[i - 1] + x[i]
        
    return result

ipytest.run("-k positive_arrays_have_incrementing_sums", "--hypothesis-seed=3")
```

    F                                                                        [100%]
    =================================== FAILURES ===================================
    _________________ test_positive_arrays_have_incrementing_sums __________________

        @given(
    >       xps.arrays(
                dtype=xps.scalar_dtypes(),
                shape=xps.array_shapes().filter(lambda s: prod(s) > 1),
                elements={"min_value": 0},
            )
        )

    <cell>:5: 
    _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

    x = Array([4611686018427387904, 4611686018427387904], dtype=int64)

        @given(
            xps.arrays(
                dtype=xps.scalar_dtypes(),
                shape=xps.array_shapes().filter(lambda s: prod(s) > 1),
                elements={"min_value": 0},
            )
        )
        def test_positive_arrays_have_incrementing_sums(x):
            a = cumulative_sums(x)
    >       assert nxp.all(a[1:] >= a[:-1])
    E       assert Array(False, dtype=bool)
    E        +  where Array(False, dtype=bool) = <function all at 0x7f2d48cc2430>(Array([-9223372036854775808], dtype=int64) >= Array([4611686018427387904], dtype=int64))
    E        +    where <function all at 0x7f2d48cc2430> = nxp.all

    <cell>:13: AssertionError
    ---------------------------------- Hypothesis ----------------------------------
    Falsifying example: test_positive_arrays_have_incrementing_sums(
        x=Array([4611686018427387904, 4611686018427387904], dtype=int64),
    )
    =========================== short test summary info ============================
    FAILED <cell>::test_positive_arrays_have_incrementing_sums - assert A...
    1 failed, 1 deselected in 1.24s

We resolved our two previous issues\... but Hypothesis has found yet
another failing scenario 🙃

``` python
>>> x = xp.full(2, 4611686018427387904, dtype=xp.int64)
>>> x
Array([ 4611686018427387904,  4611686018427387904], dtype=int64)
>>> cumulative_sums(x)
Array([ 4611686018427387904, -9223372036854775808], dtype=int64)
```

An overflow has occurred again, which we can\'t do much about it this
time. There\'s no larger signed integer dtype than `int64` (in the Array
API), so we\'ll just have `cumulative_sums()` detect overflows itself.

``` python
def cumulative_sums(x):
    xp = x.__array_namespace__()
    
    x = xp.reshape(x, x.size)
    
    if x.dtype == xp.bool:
        mask = x
        dtype = xp.uint64
        x = xp.zeros(x.shape, dtype=xp.uint64)
        x[mask] = 1
        
    result = xp.empty(x.size, dtype=max_dtype(xp, x.dtype))
    result[0] = x[0]
    for i in range(1, x.size):
        result[i] = result[i - 1] + x[i]
        if result[i] < result[i - 1]:
            raise OverflowError("Cumulative sum cannot be represented")
        
    return result
```

If Hypothesis generates arrays which raise `OverflowError`, we can just
catch it and use
[`assume(False)`](https://hypothesis.readthedocs.io/en/latest/details.html#making-assumptions)
to ignore testing these arrays on runtime. This \"filter-on-runtime\"
behaviour can be very handy at times, although [their docs note
`assume()` can be
problematic](https://hypothesis.readthedocs.io/en/latest/details.html#how-good-is-assume).

We can also explicitly cover overflows in a separate test.

``` python
from hypothesis import assume
import pytest

@given(
    xps.arrays(
        dtype=xps.scalar_dtypes(),
        shape=xps.array_shapes().filter(lambda s: prod(s) > 1),
        elements={"min_value": 0},
    )
)
def test_positive_arrays_have_incrementing_sums(x):
    try:
        a = cumulative_sums(x)
        assert nxp.all(a[1:] >= a[:-1])
    except OverflowError:
        assume(False)
    
def test_error_on_overflow():
    x = nxp.asarray([nxp.iinfo(nxp.uint64).max, 1], dtype=nxp.uint64)
    with pytest.raises(OverflowError):
        cumulative_sums(x)

ipytest.run()
```

    ...                                                                      [100%]
    3 passed in 0.27s

Our little test suite finally passes 😅

If you\'re feeling adventurous, you might want to get [this very
notebook](https://github.com/Quansight-Labs/quansight-labs-site/tree/main/posts/2021/10/hypothesis-array-api.ipynb)
running and see if you can write some test cases yourself---bonus points
if they fail! For starters, how about testing that cumulative sums
*decrease* with arrays containing negative elements?

When you\'re developing an Array API array-consuming method, and an
equivalent method already exists for one of the adopting libraries, I
highly recommend using Hypothesis to compare its results to your own.
For example, we could use the battle-tested
[`np.cumsum()`](https://numpy.org/doc/stable/reference/generated/numpy.cumsum.html)
to see how our `cumulative_sums()` method compares:

``` python
import numpy as np

@given(xps.arrays(dtype=xps.scalar_dtypes(), shape=xps.array_shapes()))
def test_reference_implementation(x):
    our_out = cumulative_sums(x)
    # We convert numpy.array_api arrays into NumPy's top-level "ndarray"
    # structure, so we can compare our results with np.cumsum().
    # We do this via np.asarray(obj), which will see if obj supports
    # NumPy's interface protocol to subsequently get the underlying
    # ndarray from obj - fortunately arrays generated from
    # numpy.array_api do support this!
    # See https://numpy.org/devdocs/user/basics.interoperability.html
    our_out = np.asarray(our_out)
    their_out = np.cumsum(np.asarray(x))
    assert np.all(our_out == their_out)
```

```{=html}
<!-- Code at even <80 cols can get wrapped with the current (Feb 2022) blog theme -->
```
Such \"differential testing\" is a great exercise to really think about
what your code does, even if ultimately you conclude that you are happy
with different results.

Zac Hatfield-Dodds, who maintains Hypothesis, writes more about
differential testing in their short paper [\"Falsify your Software:
validating scientific code with property-based
testing\"](http://conference.scipy.org/proceedings/scipy2020/zac_hatfield-dodds.html).
Generally it\'s a great read if you want more ideas on how Hypothesis
can make your array-consuming libraries robust!

## Watch this space

This year should see a first
[version](https://data-apis.org/array-api/latest/future_API_evolution.html#versioning)
of the Array API standard, and subsequently NumPy shipping
`numpy.array_api` out to the world---this means array-consuming
libraries will be able to reliably develop for the Array API quite soon.
I hope I\'ve demonstrated why you should try Hypothesis when the time
comes 🙂

Good news is that I\'m extending my stay at Quansight. My job is to help
unify Python\'s fragmented scientific ecosystem, so I\'m more than happy
to respond to any inquiries about using Hypothesis for the Array API via
[email](mailto:quitesimplymatt@gmail.com) or
[Twitter](https://twitter.com/whostolehonno).

For now I\'m contributing to the Hypothesis-powered [Array API
compliance suite](https://github.com/data-apis/array-api-tests), which
is already being used by the NumPy team to ensure `numpy.array_api`
actually complies with every tiny detail of the
[specification](https://data-apis.org/array-api/latest/). This process
has the added side-effect of finding limitations in
[`hypothesis.extra.array_api`](https://hypothesis.readthedocs.io/en/latest/numpy.html#array-api),
so you can expect Hypothesis to only improve from here on out!

