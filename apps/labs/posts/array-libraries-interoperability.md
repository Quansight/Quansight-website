---
title: 'Array Libraries Interoperability'
published: October 13, 2021
authors: [anirudh-dagar]
description: "Let's dive into the technicalities involved in array libraries interoperability and understand the protocols making this a reality."
category: [Array API]
featuredImage:
  src: /posts/array-libraries-interoperability/ninja_arrays.png
  alt: 'Meme of Master Splinter leading the baby turtles from TMNT. Splinter
    represents NumPy, and the turtles represent TensorFlow, CuPy, PyTorch and JAX.'
hero:
  imageSrc: /posts/array-libraries-interoperability/hero.png
  imageAlt:
    'Meme of Master Splinter leading the baby turtles from TMNT. Splinter
    represents NumPy, and the turtles represent TensorFlow, CuPy, PyTorch and JAX.'
---

In this blog post I talk about the work that I was able to accomplish during
my internship at Quansight Labs and the efforts being made towards making
array libraries more interoperable.

Going ahead, I'll assume basic understanding of array and tensor libraries
with their usage in the Python Scientific and Data Science software stack.

<p align="center">
  <img
    alt="Meme of Master Splinter leading the baby turtles from TMNT. Splinter
     represents NumPy, and the turtles represent TensorFlow, CuPy, PyTorch and JAX."
    src="/posts/array-libraries-interoperability/ninja_arrays.png"
  />
  <i>Master NumPy leading the young Tensor Turtles</i>
</p>

## Array Provider & Consumer Libraries

As someone who's been involved in the Data Science domain for more than four
years now, I can't think of any of my projects without using an array/tensor
library. Over time, NumPy (more than 15 years old today) has become a blind import before starting any Python project involving manipulation of arrays.

With the recent advancements in and around the field of Machine Learning,
Deep Learning techniques have gained a lot of popularity in the AI community.
More and more libraries have been developed to extend
NumPy's concept of N-dimensional arrays to the new domains of
numerical computing. Namely these features come in the form of
multi-device (`CPU`, `GPU`, `XLA` etc.) support and
autograd engines for the array/tensor. One such framework is PyTorch,
and it has been my go-to for research in machine learning during the last
couple of years. The reason simply is due to this extra saccharinity
along with some other machine learning specific modules
(`torch.nn`, `torch.optim` etc.) it has to offer. A few eminent
array/tensor libraries include [`CuPy`](https://github.com/cupy/cupy),
[`TensorFlow`](https://github.com/tensorflow/tensorflow),
[`MXNet`](https://github.com/apache/incubator-mxnet/),
[`JAX`](https://github.com/google/jax) etc.

Henceforth, let's just call all of them **"array provider"** libraries.

Libraries like [`SciPy`](https://github.com/scipy/scipy),
[`scikit-learn`](https://github.com/scikit-learn/scikit-learn),
[`einops`](https://github.com/arogozhnikov/einops) etc. are built on top of
these "array providers" and they integrate specific features through their
own methods which conventionally ingest arrays from these array provider
libraries as their arguments. We'll refer to these set of libraries as **"array
consumer"** libraries.

## What's the catch?

The pain now is that an extremely stable and popular consumer library
like SciPy is cut off from the sweet features which the new array/tensor
frameworks have to offer. A user might prefer SciPy's domain specific
features and stable API for their scientific stack, but because their
underlying project is built on top of say PyTorch, they are left alone
at sea.

Say we wanted to use a provider library other than NumPy, but with SciPy
(or a similar library). After some thought, one may end up choosing
either of the following options:

1. Somehow convert their array/tensors into NumPy arrays,
   before feeding them in the SciPy function, which is where you lose
   the _"extra sweetness"_.

2. Find some other consumer library (if it exists) mimicking SciPy's API, but
   built on top of the "array provider" library that was used in the initial
   project (say PyTorch). This way the user enjoys the extra
   features, but this comes at the cost of learning and getting used to
   a new library API which might mimic SciPy's functionality
   but not behave exactly the same.

Also, the APIs (function signatures) for these "array providers" can
be different, which is a problem in itself. Imagine a
scientist who has experience using NumPy for about 10 years. When they
move into the PyTorch ecosystem, they are still doing a lot of similar
computations, but now will need to learn a new API.

<p align="center">
  <img
    alt="Comic depicting the happy relationship between NumPy and SciPy, and
     how envious other array/tensor libraries are of it."
    src="/posts/array-libraries-interoperability/array_wonderland.JPG"
    width="67%"
  />
</p>

<i align="center">
  <b>ELI5 Caption:</b> This is a page from the array libraries
  interoperability special edition chapter of comic array wonderland. SciPy only
  wants to play with NumPy and refuses to play with other libraries like
  PyTorch, CuPy, Tensorflow and JAX. All of them are sad, and then they decide
  to make their own new friends.
</i>

<i align="center">
  <b>Serious Caption:</b> Other than NumPy, array/tensor libraries like PyTorch,
  CuPy, Tensorflow and JAX aren't compatible with Consumer Libraries like SciPy.
  This led to developers creating an ecosystem of libraries around each
  array/tensor framework which are conceptually the same but differ in the
  unique array/tensor frameworks they are built for.
</i>

---

Life is hard, ain't it! But as Rocky Balboa said:

> "NumPy, CuPy, PyTorch or SciPy is not gonna hit as hard as all of them
> when used together. But it ain't about finding a way to use them
> individually; it's about making them work together.
> That's how Data Science is done." ~ ([actual quote :P](https://youtu.be/8xFEqdkO5UI?t=13))

OK sorry, that's just me using Rocky's motivational lines to make a point.
To define the issue more concretely, the question is: can we do something like
the following?!

```python
import torch

. # Do something with PyTorch
x = torch.rand(3000)  # End up with some torch tensor

# Estimate power spectral density using Welch’s method.
# SciPy offers a method `welch` for doing exactly that.
from scipy.signal import welch

f, Pxx = welch(x, fs=10e3, nperseg=1024)
```

Our world would be a better place if we could pass any kind of "array provider"
object in these consumer libraries and let them do their magic, finally
spitting out the same "array provider" type as the one in input. Note that all the
arguments should be of the same kind.

What if there is a way? What if there are existing ways to achieve this?
Not kidding, it is possible with the recent efforts made towards this direction.

## Protocols for Interoperable Behaviour

Now that the problem and motivation is clear, let's dive into the
technicalities involved in array libraries interoperability and
understand the protocols making this a reality.

Enter the [NEP 18 (`__array_function__` protocol)](https://numpy.org/neps/nep-0018-array-function-protocol.html), which was one of the first
efforts to address the issue of interoperability in NumPy. In a nutshell,
[NEP 18](https://numpy.org/neps/nep-0018-array-function-protocol.html)
allows arguments of NumPy functions to define how that function
operates on them. This enables using NumPy as a high level API for
efficient multi-dimensional array operations, even with array implementations
that differ greatly from `numpy.ndarray`.

I suggest reading the [NEP 18](https://numpy.org/neps/nep-0018-array-function-protocol.html)
itself for a detailed understanding, but I'll try to expound the motivation
with a simple example taken from an insightful [talk](https://www.youtube.com/watch?v=HVLPJnvInzM)
by [Ralf Gommers](https://github.com/rgommers)
at PyData Amsterdam 2019.

```python
import numpy as np
import cupy

def some_func(x):
    return np.log(np.sin(x) + 5)

x = np.random.random((100000, 100000))

some_func(x)  # Runs on CPU, might be slow

# Now can we use some_func with CuPy arrays
# designed to work on NVIDIA GPUs and are
# faster at parallelized matrix operations.

x_cupy = cupy.array(x)

# NEP 18 enables this possibility
some_func(x_cupy) # Runs on GPU, orders of magnitude fast
```

Since [NEP 18](https://numpy.org/neps/nep-0018-array-function-protocol.html),
there have been a few other protocols like
[NEP 30](https://numpy.org/neps/nep-0030-duck-array-protocol.html#nep30),
[NEP 35](https://numpy.org/neps/nep-0035-array-creation-dispatch-with-array-function.html)
and
[NEP 37](https://numpy.org/neps/nep-0037-array-module.html) endeavouring to
address some of the issues and shortcomings with [NEP 18](https://numpy.org/neps/nep-0018-array-function-protocol.html). Note that these NEPs
were actually never accepted or implemented.

For the sake of brevity in this blog,
we'll limit our focus to [NEP 31 or `uarray`](https://uarray.org/en/latest/)
and [NEP 47 or Array API (`__array_namespace__`)](https://numpy.org/neps/nep-0047-array-api-standard.html). These are some of the most recent protocols
with a goal to ameliorate interoperability shortfalls.

## Array API or NEP 47

Before I start describing Python Array API in the context of this blog,
I urge you to read:

1. [Announcing the consortium](https://data-apis.org/blog/announcing_the_consortium/)
2. [First release of the Array API Standard](https://data-apis.org/blog/array_api_standard_release/)

These two official blogs from the [Consortium for Python Data API Standards](https://data-apis.org/) describe the API, giving a high level overview of its existence.

Let's see how the use of this Array API might look in practice.

```python
import torch as xp
# or
import numpy.array_api as xp

a = xp.arange(3)
b = xp.ones(3)

c = a + b
```

Probably the only changes involved for a NumPy end user to
support PyTorch would be to update the import statements and refactor
`np.*` to `xp.*`. Here `xp` represents _any_ array provider library
compliant with the Array API. Doing something like this is extremely easy as
compared to some other array interoperability protocols taking a much more
convoluted approach.

The Array API spec mentions a couple of [concrete use cases](https://data-apis.org/array-api/latest/use_cases.html#concrete-use-cases):

- Use case 1: add hardware accelerator and distributed support to SciPy
- Use case 2: simplify einops by removing the backend system

With the introduction and compliance of Array API in all the major
array/tensor libraries, consumer libraries will be able to support more
than one "array provider" and become truly interoperable.

Since we started by talking about consumer libraries like SciPy, let's
continue with the same example. We've built a [demo](https://quansight-labs.github.io/array-api-demo/intro.html) around Array API showcasing the use of PyTorch Tensors with
SciPy.

<p align="center">
  <a href="https://quansight-labs.github.io/array-api-demo/intro.html">
    <img
      alt="Screenshot of the demo's website"
      src="/posts/array-libraries-interoperability/array_api_demo_screenshot.png"
    />
    <i>Array API Demo</i>
  </a>
</p>

The [Array API Demo](https://quansight-labs.github.io/array-api-demo/intro.html) walks
you through the details and processes involved to make an array consumer library
like SciPy more interoperable with array provider libraries. The demo is built
keeping two different perspectives in mind: an end user, and
an open-source developer/maintainer looking to incorporate the Array API
within their array consumer library.

The demo showcases the 2017 Nobel prize winning work for Physics about
[LIGO-Virgo detector noise and extraction of transient gravitational-wave signals](https://inspirehep.net/literature/1751757).
The original tutorial ([Colab link](https://colab.research.google.com/github/losc-tutorial/Data_Guide/blob/master/Guide_Notebook.ipynb)) was built using NumPy, SciPy,
and Matplotlib.
But, instead of using NumPy arrays we switch to a PyTorch based
implementation with minimal changes in the codebase.

Let's dive into the exact formulation and Python code that allows this behaviour.

### get_namespace

The demo shows the implementation of a dummy [`get_namespace`](https://quansight-labs.github.io/array-api-demo/GW_Demo_Array_API.html#get-namespace) method which is the
first function to be called inside any SciPy method. One can see how it works
below, simply returning the namespace, which can be used later for calling any
Array API specified methods. See the `csd` toy example function below to understand
`get_namespace` usage.

```python
def get_namespace(*xs):
    # `xs` contains one or more arrays, or possibly Python scalars (accepting
    # those is a matter of taste, but doesn't seem unreasonable).
    namespaces = {
        x.__array_namespace__() if hasattr(x, '__array_namespace__') else None for x in xs if not isinstance(x, (bool, int, float, complex))
    }

    if not namespaces:
        # one could special-case np.ndarray above or use np.asarray here if
        # older numpy versions need to be supported.
        # This can happen when lists are sent as an input, for eg. some
        # SciPy functions coerce lists into ndarrays internally.
        raise ValueError("Unrecognized array input")

    if len(namespaces) != 1:
        raise ValueError(f"Multiple namespaces for array inputs: {namespaces}")

    xp, = namespaces
    if xp is None:
        raise ValueError("The input is not a supported array type")

    return xp


# representative example of how to use get_namespace
def csd(x, y, fs=1.0, window='hann', nperseg=None, noverlap=None, nfft=None,
		detrend='constant', return_onesided=True, scaling='density', axis=-1,
		average='mean'):
    # Array-API
    xp = get_namespace(x, y)

    # Library Independent Code
    # Call Array API specified methods
    some_internal_calculation = xp.some_func(x)
    ...
```

This should be possible with the Array API, for the end-user in a
future release of SciPy and PyTorch.

We made SciPy plus PyTorch work for this very much nontrivial use case,
which demonstrates the feasibility and power of using the Array API.
I'd encourage you to read more details about the
demo on the [tutorial webpage](https://quansight-labs.github.io/array-api-demo/intro.html)
itself.

Given that the Array API standard is still under development, there are some issues
we ran into, namely:

- A lack of Array API standards on complex numbers in the upcoming 2021 version,
  `v1.0` of the specification, compelled us to special case such instances within the
  SciPy codebase for PyTorch and NumPy separately.
- In the current state, the lack of complete Array API compliance in PyTorch
  is another small issue. One example of PyTorch diverging from NumPy and
  Array API is `.numel()` vs `.size()`.

All of this is of course addressable with plans to add support for the
complex numbers module in the second release of Array API Specification.
We can expect updates and added submodules in a future version of the spec,
to be released next year.

PyTorch developers have been working hard to improve PyTorch's Array API compliance,
fixing divergent behaviour. During the development of this prototype demo,
I was able to identify some gaps in the [current state of Array API in PyTorch](https://github.com/pytorch/pytorch/labels/module%3A%20python%20array%20api)
and started my journey as a PyTorch contributor.

### Contributing to PyTorch

In an effort to make PyTorch
more [Array API](https://data-apis.org/array-api/latest/) compatible
and in the process to get the above demo working,
I started contributing to PyTorch by raising PRs and relevant Issues.
My first PyTorch PR [#62560](https://github.com/pytorch/pytorch/pull/62560)
started with adding an alias `torch.concat` for `torch.cat`, which is
how concatenation is defined in the [Array API spec](https://data-apis.org/array-api/latest/API_specification/manipulation_functions.html?highlight=concat#concat-arrays-axis-0),
and ended with a bunch of other fixes related to concatenation in PyTorch.
Later, I worked on improving compatibility for the Array API in the `torch.linalg`
module. See [pytorch/pytorch#63285](https://github.com/pytorch/pytorch/pull/63285)
and [pytorch/pytorch#63227](https://github.com/pytorch/pytorch/pull/63227).

As mentioned earlier, you can track the progress on PyTorch's GitHub repo with
the label
["module: python array api"](https://github.com/pytorch/pytorch/labels/module%3A%20python%20array%20api) to check out other interesting developments.

### What's Missing?

This approach of tackling interoperability in `scipy.signal` for
pure Python + NumPy code can leverage the Array API standard. But, for other
modules like `scipy.fft`, `scipy.ndimage`, `scipy.special` etc. where one
encounters compiled code, there is a need for an array library and a hardware
specific implementation, and hence from SciPy we need to be able to
access and use those. This is where uarray comes in. A more detailed
explanation can be found in [the section below](#protocol_differences)
highlighting the differences between the Array API and uarray.

## uarray

uarray is a backend system for Python that allows you to separately define
an API, along with backends that contain separate implementations of that API.

I've been working on adding uarray backend support to more SciPy modules.

<p align="center">
  <a href="https://github.com/scipy/scipy/issues/14353">
    <img
      alt="SciPy: uarray compatibility tracker"
      src="/posts/array-libraries-interoperability/uarray_compatibility_tracker.png"
    />
    <i>SciPy: uarray compatibility tracker</i>
  </a>
</p>

The uarray backend compatibility tracker issue linked above sums up
the plan and current state of uarray in SciPy.

I've been working on adding uarray support in the
[`scipy.ndimage`](https://github.com/scipy/scipy/tree/master/scipy/ndimage) module
for the last couple of months.
See [scipy/scipy#14356](https://github.com/scipy/scipy/pull/14356) for more
details on the discussions.

With `ndimage` supporting `uarray` backends soon, one will be able to
achieve the following in the future:

```python
# SciPy ndimage with CuPy array
from scipy import ndimage
import cupy as cp

with scipy.ndimage.set_backend('cupy'):
    y_cupy = ndimage.correlate1d(cp.arange(10),
                                 cp.array([1, 2.5]))
```

The [work](https://github.com/scipy/scipy/pull/14356) on adding `uarray`
backend in `ndimage` is slightly complicated and
involved a few other maintenance fixes in SciPy. In case you are interested,
I'll leave a list of some of my notable SciPy contributions below which
are directly or indirectly connected to uarray.

- [scipy/scipy#14275](https://github.com/scipy/scipy/pull/14275)
- [scipy/scipy#14359](https://github.com/scipy/scipy/pull/14359)
- [scipy/scipy#14447](https://github.com/scipy/scipy/pull/14447)
- [scipy/scipy#14474](https://github.com/scipy/scipy/pull/14474)
- [scipy/scipy#14266](https://github.com/scipy/scipy/issues/14266)

---

<h2 id="protocol_differences">{/*
The span is a workaround to some issue with Chromium and Next.js v12's font optimization, which causes certain emoji to display in text rather than emoji presentation: https://en.wikipedia.org/wiki/Emoji#Emoji_versus_text_presentation
*/}All <span className="font-['sans-serif']">☀️</span> & 🌈?</h2>

As they say, nothing is perfect on the human stage, both uarray and
the Array API also have their limitations.

\*\*\*_Wears interoperability hat again_\*\*\*

Let's highlight some Pros & Cons for these two protocols.

<div className="grid grid-cols-2">
  <h3 className="col-start-1 row-start-1" align="center">
    <b>uarray</b>
  </h3>
  <div className="col-start-1 row-start-2">
    <p align="left">
      <b>Pros</b>
    </p>
    <ul>
      <li>
        Can handle compiled code (anything not Python but which ends up with
        Python bindings).
      </li>
      <li>
        Supports ability to coerce/convert inputs and wrapping other arrays
        using the `__ua_convert__` protocol.
      </li>
    </ul>
  </div>
  <div className="col-start-1 row-start-3">
    <p align="left">
      <b>Cons</b>
    </p>
    <ul>
      <li>
        Involves a lot of utility code (setup machinery) on both the libraries which may
        get tricky at times.
      </li>
      <li>
        The dispatching mechanism is not implicit. The user is required to register
        the backend before they can use the array library of their choice. See
        the
        <a href="https://github.com/scipy/scipy/issues/14266">scipy/scipy#14266</a>
        issue for auto-registering backends.
      </li>
    </ul>
  </div>
  <h3 className="col-start-2 row-start-1" align="center">
    <b>Array API</b>
  </h3>
  <div className="col-start-2 row-start-2">
    <p align="left">
      <b>Pros</b>
    </p>
    <ul>
      <li>
        Easy for consumer libraries to add support and compatiblity with
        multiple "array providers".
      </li>
      <li>
        One can make use of the consumer library functions without thinking
        about any form of backend registration etc.
      </li>
    </ul>
  </div>
  <div className="col-start-2 row-start-3">
    <p align="left">
      <b>Cons</b>
    </p>
    <ul>
      <li>
        Can't handle compiled code, works only for pure Python and array provider
        based code in consumer library methods.
      </li>
      <li>
        Not all functions are covered in the Array API spec, which may be a blocker
        if the consumer library method utilizes a function outside of Array API's
        scope.
      </li>
    </ul>
  </div>
</div>

These protocols may not be perfect, but are a big step towards interoperability
and bringing the array/tensor libraries ecosystem closer together.
We'll see iterations and development of new NEPs in the future which will probably
make array libraries even more interoperable. In essence, open-source communities like
NumPy putting interoperability as one of the key goals in their
[roadmap](https://numpy.org/neps/roadmap.html#interoperability) and
the larger scientific community taking small steps in the right direction is
ultimately progress towards the ideal world of array library interoperability.
At Quansight and in the wider PyData community, we've gained a lot of momentum
and interest towards improving interoperability and extensibility in
SciPy and Scikits. Stay tuned for some interesting updates on this very soon.

---

## What's Next?

On a more personal note, I've absolutely enjoyed the Scientific
Python Open-Source community and plan to continue working on projects
including SciPy and PyTorch voluntarily going forward.

Specifically, I plan to work on improving interoperability with other
libraries in PyTorch with Python Array API compliance, which is aimed for a
release in `1.11`, and also on improving NumPy support. There are a lot of
interesting gaps that are to be filled in the
[`OpInfo`](https://github.com/pytorch/pytorch/issues/54261) testing module and
in general trying to catch a few bugs through the improved testing framework.
With the recent migration to [`Structured Kernels`](https://github.com/pytorch/rfcs/blob/rfc-0005/RFC-0005-structured-kernel-definitions.md), I also plan to help out
with porting of some Ops to `structured`.

PyTorch is a project that I really love and have been a user for a long time,
it is always nice to be contributing back to the project and learning along
the way. I'm open to contributing to other interesting areas that might
arise in the future.

In SciPy, I aim to continue adding and improving uarray backend support
for more modules. This also extends work into libraries like `CuPy`, `Dask` etc.
where the uarray backend needs to be enabled.

Apart from uarray, I'd also like to explore and contribute to a few more
interesting tracks revolving around making SciPy more performant.

- One of the GSoC students (Xingyu Liu) recently made a lot of
  [progress](https://github.com/scipy/scipy/issues?q=author%3Acharlotte12l) in
  accelerating some of the modules with the experimental Pythran support. It
  would be interesting to explore further possibilities with `Pythran`.

- A more personal goal is to learn and contribute more towards SciPy's `Cython`,
  `CPython API-using`, and in general Python bindings code. I plan to pick
  up relevant issues and also contribute to that part of the codebase in SciPy.

---

I end my blog here and hope you learnt a few new things about array library
interoperability. Feel free to check out my non-technical blog post titled
["Why Quansight is Awesome!"](https://anirudhdagar.ml/Quansight_Experience/),
where I talk about my experience as an Intern at Quansight.

## Acknowledgements

Special thanks to my mentor, [Ralf Gommers](https://github.com/rgommers),
who has been extremely helpful and positive everytime I felt lost. Thank you for
taking all my questions and doubts repeatedly, and still being so responsive and
thorough with your answers. I'm grateful to your support and guidance.

I feel fortunate contributing back to impactful libraries like PyTorch and
SciPy (having used them personally). Thanks to the community and the awesome
team at Quansight Labs for an amazing summer.

## References

- [Python Data API Standards](https://data-apis.org/)
- [uarray](https://uarray.org/en/latest/)
- [NEP 18 — A dispatch mechanism for NumPy’s high level array functions (`__array_function__` Protocol)](https://numpy.org/neps/nep-0018-array-function-protocol.html)
- [NEP 31 — Context-local and global overrides of the NumPy API](https://numpy.org/neps/nep-0031-uarray.html)
- [NEP 47 — Adopting the array API standard](https://numpy.org/neps/nep-0047-array-api-standard.html)
- [The evolution of array computing in Python | PyData Amsterdam 2019 | Ralf Gommers](https://www.youtube.com/watch?v=HVLPJnvInzM)
- [Gravitational Wave Open Science Center Tutorials](https://www.gw-openscience.org/tutorials/)
- [A guide to LIGO–Virgo detector noise and extraction of transient gravitational-wave signals](https://inspirehep.net/literature/1751757)

<br />
