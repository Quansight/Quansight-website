---
title: 'Array API adoption: what to do with compiled code'
authors: [evgeni-burovski]
published: June 23, 2026
description: 'In this blog post, we discuss ways of dealing with compiled code when adopting the Array API.'
category: [Array API, GPU]
featuredImage:
  src: posts/array-api-aot-jit/array-api-aot-jit.png
  alt: 'Data APIs logo next to logos of NumPy, CuPy, PyTorch and JAX'
hero:
  imageSrc: posts/array-api-aot-jit/array-api-aot-jit.png
  imageAlt: 'Data APIs logo next to logos of NumPy, CuPy, PyTorch and JAX'
---



Python is known for both being easy and fast to develop in, and its slow execution
speeds. For several decades, the answer to "Python is slow" has been
to write a C extension, so that computationally intensive parts of an application
proceed at C speeds. 
A prime example in scientific computing and data science is NumPy,
which provides an array abstraction in Python and performs internal looping over the array
data in C. 

Historically, NumPy is geared toward single-core CPU execution. The surge in popularity
of hardware accelerators, such as GPUs, has given rise to multiple array libraries--CuPy, PyTorch, JAX and others--which
encapsulate the compute power of accelerators
(which NumPy itself does not harness) within a NumPy-like array interface. 

Recent efforts of making general purpose libraries, such as SciPy and scikit-learn, use
alternative array providers via the [Array API](https://data-apis.org/array-api/latest/) demonstrated
significant [performance improvements](https://labs.quansight.org/blog/array-api-meta-blogpost).
For end users, speedups of an order of
magnitude or more come "for free" by simply feeding correct arrays types to, for example, familiar
scikit-learn estimators.
For library developers, the work is to replace NumPy calls with their
[Array API analogs](https://data-apis.org/array-api/draft/tutorial_basic.html).
This way, all low-level details of CUDA programming are
fully contained at the array library level (e.g., CuPy, PyTorch) and do not leak to either
the higher-level library (e.g., SciPy, scikit-learn) or the end user.

This approach works extremely well for computational pipelines implemented as vectorized Python
operations on arrays. This is not the full story, however; significant parts of user
libraries contain specialized compiled extensions for operations which are still too slow
in pure Python and vectorized array manipulations, or are too awkward to implement in
pure Python. How to deal with these kinds of situations is a big open question: the
existing body of C extensions is naturally CPU-only, and one cannot expect that
scikit-learn maintains both CPU and CUDA C kernels. Simply porting all C code
to CUDA is also out of question: there is user demand across single- and
multi-core CPU compute, CUDA, and other types of hardware accelerators, such as
ROCm or TPU--and the hardware landscape itself changes rapidly.

In this work, we report on an experiment where we take a SciPy object,
[`RBFInterpolator`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.RBFInterpolator.html) from `scipy.interpolate`, which is backed by
a dedicated C extension, extend it to support multicore CPUs and CUDA GPUs via Array API,
and evaluate it for performance and maintainability across several array backends and compute types.
We also consider an additional dimension: in addition to the classic ahead-of-time
compilation (AOT) in C, we compare with generating kernels on the fly via just-in-time
compilation (JIT). Note that JIT technologies are backend-specific and are much less mature
than AOT technologies. In this work, we report on using `torch.compile`, `jax.jit`, and `numba`.
Depending on hardware and software tech stack, we find non-trivial performance differentials,
with speedups of more than an order of magnitude to significant slow-downs.

Before going into details, a note is in order. What we report on is a work in progress and happening within the context of
a rapidly evolving field. While we expect specific details to age poorly, the main conclusions
are that (i) using just-in-time compilation in conjunction with Array API compatible backends
is a viable alternative to tried-and-tested ahead-of-time compiled C extensions, and
 (ii) for users, it is absolutely worth spending (a possibly time-boxed) effort to benchmark
their particular application.

The rest of the text is organized as follows: we [first](#details) briefly
outline the mathematical contents and discuss main implementation details, and
[then](#benchmarks) report on benchmarking results on multicore CPUs and GPUs.
(Readers not interested in mathematical or implementation details may skip straight
to the second section).


# Implementation details
<a name="details"></a>

We consider the [`RBFInterpolator` object](https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.RBFInterpolator.html) from `scipy.interpolate`. Note that we deliberately benchmark
the behavior of a real production object, as [implemented in SciPy version 1.17](https://github.com/scipy/scipy/blob/v1.17.0/scipy/interpolate/_rbfinterp.py#L62-L540), not a toy example.

In this section, we start with a brief outline of the mathematics that `RBFInterpolator`
implements, then discuss the baseline implementation and its Array API compatible
generalization. We then move on to describing our approach to JIT compilation, which is
specific for different array libraries.


## Background: Radial basis functions

Glossing over the details, the mathematical contents behind `scipy.interpolate.RBFInterpolator`
is as follows. Given a collection of $m$ vectors, $X_i$, in an N-dimensional space, and $m$ scalar "values", $D_i$, we want to construct a function $F(x)$ which accepts N-dimensional vectors and takes the given values $D_i$ at $X_i$.

We take this function--an RBF interpolant--as a linear combination of _kernel functions_, centered at $X_i$:

$$
F(x) = \sum_{i=1}^m C_i f(|x - X_i|)
$$

where $f(\cdot)$ is the scalar *kernel function* and $|x - X_i|$ is the norm of the N-dimensional vector $x - X_i$. The coefficients, $C_i$, are defined by the inputs $X_i$ and $D_i$.

The process thus involves two steps: we first *fit* the input data, $X_i$ and $D_i$, to find the coefficients, $C_i$; we then *predict* the value of the interpolant at the new vector $x$. The latter is performed by taking the array of the kernel functions centered at $X_i$ and multiplying it by the array of coefficients. 

Typically, we fit the data once and evaluate the resulting $F(x)$ multiple times for varying inputs $x$. Thus, evaluations are performance-critical, and we focus on evaluations in what follows.


## Baseline implementation

Glossing over non-essential details, the core evaluation routine of `RBFInterpolator` is conceptually equivalent to a direct translation of the mathematical formula for the RBF evaluation:

```python
import numpy as np

def kernel_func(r):
    # the default RBF kernel, the so-called "thin plate spline" function
    if r == 0:
        return 0
    else:
        return r**2 * np.log(r)


def evaluate_np(x, Y, coeffs):
    # multiple data vectors are stacked into the `x` array
    npts, ndim = x.shape
    vec = np.empty((npts, Y.shape[0]))

    for i in range(npts):
        for j in range(Y.shape[0]):
            vec[i, j] = kernel_func(np.linalg.vector_norm(x[i, :] - Y[j, :]))

    return vec @ coeffs
```

Here `kernel_func` is the RBF basis function $f(r)$, and `coeffs` are coefficients, $C_i$, pre-computed during the *fit* stage.
Since we typically evaluate the interpolant at multiple vectors $x$, we always stack them into a 2-D array `x`.

Consider evaluating an interpolant on a 50x50 grid in two dimensions. The `x` array than has the shape `(2500, 2)`, and looping over this large of an array in pure Python is too slow to be practical. Therefore, `RBFInterpolator` in fact compiles the loop into C using the [`pythran`](https://pythran.readthedocs.io/en/latest/) ahead-of-time (AOT) compiler. In practice, this amounts to adding special comments to the Python source and invoking the `pythran` compiler on the annotated source file:

```python
# pythran export evaluate_pythran(float64[:, :], float64[:, :], float64[:])
def evaluate_pythran(x, Y, coeffs):
    # ... as before in `evaluate_np`
```

During the build stage, the `pythran` compiler uses these special comments to transpile the annotated Python functions into C++ and then builds them into a Python-importable extension module. As a result, looping over arrays proceeds at C speeds.


## Array API "generic" implementation
<a name="generic"></a>

To generalize `RBFInterpolator` across Array API compatible backends, we use the [recommended pattern](https://data-apis.org/array-api/draft/migration_guide.html#array-consumers): we deduce the array namespace from the input arguments using the `array_namespace` function from the `array_api_compat` package and fetch routines from this namespace instead of the `numpy` namespace. 
Since looping over array elements in alternative array backends is at least as slow as it is in `numpy`, we use a "vectorized" version of the `evaluate_np` routine above:


```python
def kernel_func(r, xp):
    return xp.where(r == 0, 0, r**2 * xp.log(r))


def evaluate_xp(x, Y, coeffs, xp):
    r = xp.linalg.vector_norm(x[:, None, :] - Y[None, :, :], axis=-1)
    vec = kernel_func(r, xp)
    return vec @ coeffs
```

Note an additional `xp` argument, which stands for an Array API compatible namespace, and we use `xp.where`, `xp.log`, and `xp.linalg.vector_norm` functions. The overall structure of the `RBFInterpolator` class is essentially as follows:

```python
from array_api_compat import array_namespace

class RBFInterpolator:
    def __init__(self, Y, d, ...):
        self.xp = array_namespace(Y, d)
        Y = self.xp.asarray(Y)
        d = self.xp.asarray(d)
        self.coeffs = ...           # fit the inputs
        self.Y = Y

    def __call__(self, x):
        x = self.xp.asarray(x)  # ensure x is a compatible array type
        if is_numpy(xp):
            return evaluate_pythran(x, self.Y, self.coeffs)    # pythran-compiled
        else:
            return evaluate_xp(x, self.Y, self.coeffs, self.xp)
```

This way, if `Y` and `d` are PyTorch tensors, an `RBFInterpolator` instance infers
the `xp` namespace to be `torch`, and `evaluate_xp` uses PyTorch functions to operate on
PyTorch tensors throughout.


## JIT compilation

First and foremost, we note that there is no single best JIT technology. JIT-ing is
backend-specific: for PyTorch, we use `torch.compile`; for JAX, we use `jax.jit`; and
for NumPy, we use `numba`. 

For the JIT strategy in this exercise, we use the simplest approach: we keep the
"generic" Array API implementation of the `RBFInterpolator` class and only replace the
`evaluate_xp` function with its JIT-compiled version. We stress that this is not the
final end user API. Currently, SciPy provides no public interface for jitting, and here
we reach into private implementation details of a SciPy object.

With PyTorch, the incantation reads

```python
evaluate_dynamo = torch.compile(fullgraph=True, dynamic=True)(evaluate_xp)
```

Here, the `fullgraph=True` argument is to make sure that the JIT-compiled code does not
call back into the Python runtime, and `dynamic=True` argument ensures that we compile
a single kernel for all input sizes instead of recompiling a new kernel for each array size.

With `jax`, we need to tell it that the `xp` argument is special:

```python
evaluate_jax = jax.jit(evaluate_xp, static_argnames=["xp"])
```

Both `torch.compile` and `jax.jit` are _tracing_ compilers: they analyze the types of
variables in the running program and replace Python operations on these variables
with their efficient low-level analogs. This way, they manage to convert to machine code
our backend-generic `evaluate_xp` function which uses the runtime-defined `xp` argument.

The very fact that invoking this kind of highly non-trivial machinery fits in a single
line of Python code feels like a minor miracle. 

With `numba`, we need a little more work. First of all, Numba is not a tracing compiler;
it special-cases NumPy at the source code level, and our approach of adding the `xp`
argument which only resolves to `numpy` at runtime breaks down.
Second, Numba currently has difficulties compiling "vectorized" constructions and effectively
forces writing explicit loops.

We therefore had to `numba.njit` a "non-vectorized" version (see `evaluate_np` above).
Running a little ahead of ourselves, we also had to explicitly use `numba.prange` in
the loops for performance reasons. Overall, `numba` turned out to be both the least
performant and the most capricious of the JIT variants we consider here. The [JIT section
below](#numba) gives more details.


# Benchmark results
<a name="benchmarks"></a>

To measure performance across backends and devices, we used an example from the
[`RBFInterpolator` documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.interpolate.RBFInterpolator.html) and performed evaluations with arrays of size
`N x N` with `N` ranging from 50 to 1000, using `torch`, `jax`, `cupy` and `numpy` as array backends,
in both *eager* and *jit* modes ("numpy jit" is `numba`, and `cupy` is eager-only).
The computational complexity of a single run is approximately quadratic with the
problem size `N`.

In eager mode, we ran benchmarks against SciPy version 1.17.0; the JIT modes are
from this [SciPy pull request](https://github.com/scipy/scipy/pull/23447). The benchmarking
scripts and results are available [in this repository](https://github.com/ev-br/bench_playground/).

## Benchmarks on a CPU

While `numpy` execution is single-threaded even on a multi-core machine, `torch` and `jax`
internally use multiple cores by default. Therefore, we ran benchmarks twice:
once on a consumer-grade laptop with 4-core Intel i5 processor and then on a beefy 32-core
AMD Ryzen Threadripper 3970X system.

### Benchmarks on a laptop, CPU

The following results are from running [the benchmark](https://github.com/ev-br/bench_playground/blob/master/rbf_bench.py)
on a 4-core Intel i5 CPU laptop

![Benchmark results on 4-core CPU](/posts/array-api-aot-jit/cpu_bench.png)

We see that, in the eager mode (left-hand panel), JAX and PyTorch evaluations are 2-5 times
slower than the AOT-compiled pythran code. In itself, it is not surprising that they
are slower; if anything, it is surprising that the slowdown is "only" by a factor of 2-5!
We did not benchmark an uncompiled pure NumPy implementation: the "loopy" version is
expected to have abysmal performance, and a vectorized implementation is expected to
perform roughly in the same ballpark as eager `jax`/`torch`.

In the JIT mode (right-hand panel), however, JAX and PyTorch are 3-5 times faster than
the AOT `pythran`-compiled implementation.
The origin of the speedup relative to `pythran` is not very clear; a potential contributing
factor is that both JAX and PyTorch are multi-threaded by default, while `pythran`-compiled
code is single-threaded. In principle, `pythran` can generate OpenMP parallel loops, but it is switched off
in the SciPy build system.

Surprisingly, `numba` fares much worse than `jax.jit` or `torch.compile` and is about
three times slower than the AOT-compiled pythran version, even though we explicitly
parallelized the loops with `numba.prange` (which uses OpenMP under the hood).


### Benchmarks on a multicore machine, CPU

To assess the effect of parallelizing the workload on a multicore machine, we reran the same benchmark on a
32-core AMD Ryzen Threadripper 3970X system. We used the default parallelization settings, so that
`torch`, `jax`, and `numba` used all available cores.

![Benchmark results on a 32-core CPU](/posts/array-api-aot-jit/cpu_bench_server.png) 

In eager mode, JAX seems to parallelize a little better than other backends: when using all 32 cores, JAX is nearly 2x
faster than the (single-threaded!) AOT-compiled `numpy`/`pythran` code, while PyTorch is about 2x-3x slower.
So just throwing more CPU cores does not make things much faster by itself.

In JIT mode, however, we get massive speed-ups: `jax` performs about 15 times better, with `torch` trailing at a speedup of about 10x.

`numba` is seen to improve with increased CPU count, and, on 32 CPU cores, performs within 30% of the (single-threaded) AOT version (i.e., 0.7-1.3x faster, depending on the problem size).


### Forced single-threaded execution

Since parallelization seems to play a non-trivial role, we also performed an apples-to-apples benchmark run where
we forced single-threaded execution for all backends (in fact, forcing single threading
is [not entirely straightforward](#single_core_stanza)). Below, we display the *slowdown* of single-core
execution versus default parallelization on 32 cores.


![Benchmark results for single-core vs 32-core execution](/posts/array-api-aot-jit/single_core_bench.png) 

The first bizarre observation is that NumPy eager execution becomes 2x faster with the
`OPENBLAS_NUM_THREADS=1` environment variable despite the fact that, both with and
without it, we verified with the process monitor that the execution only uses a single core. 
The exact cause remains a mystery; there is some adversarial interaction between OpenBLAS
(which is the SciPy's default linear algebra library) and `pythran`-compiled code.
[This SciPy issue](https://github.com/scipy/scipy/issues/23732) has further details.

Discounting the OpenBLAS / pythran conspiracy, all backends perform 2-5 times
slower when run on a single core. The important observation is that, in all cases, the slowdown
is less than 32, the number of cores for the "default" run. Therefore, if raw performance is the only concern, parallelism wins by a large margin: splitting the work across a `multiprocessing` pool of 32 processes, where each process is 5 times slower, still gives a 32/5=6.4-fold speedup budget! Whether this is practical for a particular application is of course strongly application-dependent.


## Benchmarks on CUDA

One of the salient points of the Array API compatible code is the ease of using CUDA GPUs.
We ran the same benchmark with no code changes on a GPU with `jax`, `torch`, and `cupy`
libraries. On a machine with a GeForce RTX 2060 accelerator, we obtain the following results:


![Benchmark results on a CUDA GPU](/posts/array-api-aot-jit/gpu_bench.png) 

Overall, performance benefits from using CUDA device are massive.
In JIT mode, PyTorch delivers up to 40x speed-up relative to the baseline `numpy`/`pythran` AOT on CPU, while JAX delivers up to 20x. Curiously, JAX wins on multicore CPUs, while PyTorch seems to utilize a CUDA device better.

The difference between eager and JIT modes is not as pronounced on CUDA as it is on a multicore CPU
(with `torch`: on CPU, jitting changes the speedup from 1.6x to 16x; while on CUDA, eager it gives 25x, and invoking JIT
further improves it by "just" 60% to a total of 40x.)

Performance profiles for running on CUDA are problem size dependent, especially with JAX eager. This in itself is not very surprising.
It is expected that only large enough workloads benefit from using GPUs, and the problem sizes in this study are actually rather small.

We also note that CuPy "only" delivers a speedup of about 3x relative to NumPy, which is modest in comparison to JAX or PyTorch. Also note that, in this study, we only used CuPy in eager mode and did not use any CuPy JIT capabilities (and therefore the CuPy results are identical on the two panels of the plot). We also did not attempt using `numba.cuda` which
is a different, lower-level interface for CUDA programming from Python.


## JIT caveats

Using JIT compilation in conjunction with the Array API looks to be a viable route toward multicore and GPU performance, especially for us mere mortals who are not ready to commit to maintaining dedicated CUDA kernels. 

There is no single best JIT technology: performance characteristics of `jax.jit` and `torch.compile` strongly depend on details, and both technologies have rough edges. The field is rapidly evolving though, and the issues we faced in this exercise may or may not be relevant in a year from the time of writing:

- <a name="single_core_stanza"></a> It is surprisingly awkward to control the threading behavior across backends, especially in the JIT context. To force a single-core execution, 
  we had to (i) force the LAPACK library to make linear algebra single-threaded, and (ii) switch off the internal thread
  management in the JIT-compiled code. Depending on the backend and/or the linear algebra library, we needed at least some
  parts of the following incantation: `$ OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1 NUMBA_NUM_THREADS=1 OPENMP_NUM_THREADS=1 XLA_FLAGS=" --xla_force_host_platform_device_count=1 --xla_cpu_multi_thread_eigen=false intra_op_parallelism_threads=1"  taskset -c 0 python ...`.

- `torch.compile` hardcodes the number of threads at compile time and uses a cached value which it stores somewhere on the file system. As a result, JIT-compiled code may or may not react to attempts to control threading at runtime.
  See [this pytorch issue](https://github.com/pytorch/pytorch/issues/160812) for details.

- <a name="numba"></a> Out of the three JIT technologies we considered, Numba is the most established, and I expected it to be the most mature. Alas, it turned out to be underwhelming on multiple counts. First of all, it required quite a bit more effort to get working. Attempting to compile a "vectorized" implementation runs into unexpected gaps in functionality (for instance, `np.prod(..., axis=-1)` does not compile, and [a related feature request](https://github.com/numba/numba/issues/1269) has been open since 2015.) In effect, Numba requires rewriting code in a fairly specific, low-level "loopy" coding style. Second, controlling parallelism also requires source code changes, and it is very easy to run into massive oversubscription. And even after rewriting the sources in the Numba way, performance is still trailing the performance of other JIT compilers by a large margin. While I absolutely am not claiming to be a Numba expert and it is possible that further code tweaks could unlock stellar performance, at least in this experiment, I did not manage to. 

- While `numba` nudges a developer toward using explicit loops, other JIT compilers rather strongly favor the alternative,
"vectorized" code style. `jax.jit` frowns on conditionals, branching, and data-dependent control flow in general; `torch.compile` by design fully unrolls all explicit loops. For vectorized code, however, both `jax.jit` and `torch.compile` generate efficient native code and eliminate temporaries from constructions like [`evaluate_xp`](#generic) which are memory-bound in eager mode. 


All-in-all, despite all the rough edges of all the current JIT tech, they are nothing but small hiccups compared to
the complexity of dealing with manually written CUDA C kernels.


# Conclusions and outlook

Adopting Array API compatibility for library components written in terms of NumPy-like primitives has been previously
shown to deliver significant performance improvements from seamlessly using CUDA devices without writing
a single line of CUDA C code!
In this work, we expand on the previous work and consider routines which rely on dedicated compiled kernels. Our
approach was to add an additional "generic backend": an Array API compatible pure-Python reimplementation of the functionality of the compiled C kernel. These kinds of "generic" backends are amendable to just-in-time compilation,
which we showed to deliver performance benefits of up to an order of magnitude or more.

With the current state of JIT technologies, performance strongly depends on details and may require some tinkering
and fine-tuning. The eventual performance characteristics depend on the problem, on the available hardware, and on
the software stack: the choice of the array library dictates the choice of the JIT technology. (If anything,
the ease of moving between different array libraries is one of the high points of the whole Array API movement.)
However, even though a stellar performance improvement is not guaranteed, the effort/reward ratio very strongly favors
JIT versus developing more traditional compiled CUDA kernels, and it is hard not to recommend at least trying out the Array API + JIT based approach (potentially, as a time-boxed experiment).

From a library maintainer perspective, using mixed JIT/AOT implementation poses several open questions.
First of all, what is the public interface for JIT-ing, especially for stateful objects like scikit-learn estimators?
In this experiment, we were reaching into private implementation details of the `RBFInterpolator` object, which works for one-off experimentation, but is not something a library can recommend for its general user base. 
At the time of writing, there is no universally-agreed upon answer, and the discussions are ongoing ([here is one example](https://github.com/data-apis/array-api-extra/issues/523)).

One other concern for library developers is that duplicate backends obviously add to the maintenance load: there is more code to maintain, backends need to be kept in sync, and adding new features is more complicated. Ultimately, the decision on the performance / maintainability balance will continue to need to be done on a case-by-case basis. Devising ways to reduce duplication is, however, worth experimenting across the community.


