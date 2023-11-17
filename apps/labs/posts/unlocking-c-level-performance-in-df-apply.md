---
title: 'Unlocking C-level performance in pandas.DataFrame.apply with Numba'
authors: [thomas-li]
published: November 17, 2023
description: 'A high-level overview of the new numba engine in DataFrame.apply'
category: [PyData ecosystem]
featuredImage:
  src: /posts/numpy-python-api-cleanup/numpy-python-api-cleanup-featured.png
  alt: 'todo'
hero:
  imageSrc: /posts/numpy-python-api-cleanup/numpy-python-api-cleanup-hero.png
  imageAlt: 'todo'
---

## Introduction

If you've been using pandas for a while, you are probably familiar with the family of `apply` functions in pandas (e.g. `DataFrame.apply`, `Series.apply`, `DataFrameGroupBy.apply`, etc.). For those unaware, these functions allow you to specify a Python function to be called for each row/column of a DataFrame, and then combines and returns the results back to you.

Because everything happens in Python-land, though, apply is usually very slow, and its recommended that you only use it when you cannot find an equivalent
method that does what you want.

In pandas 2.2.0, though, a new engine (`engine="numba"`) option will be added to `DataFrame.apply`, opening up the possibility for fast and parallelizable apply in pandas. It works by using numba, a JIT (just-in-time) compiler that translates your Python/numpy functions into fast machine code when their called, providing a several times speedup compared to the original python engine.

So, can I just slap on `engine="numba"` to `DataFrame.apply` and enjoy a free many-times speedup?

```diff
- df.apply(f)
+ df.apply(f, engine="numba")
```

Well, not quite. Because of the way that numba/the numba engine inside pandas works, there are several caveats and gotchas to keep in mind to obtain this speedup.

TLDR:
Use apply only when you have to (e.g. there is no corresponding method or chain of pandas methods that do that you want).

## How the numba engine works

Currently, in pandas, there are currently two implementations of the numba engine inside of apply, one for `raw=True`, and one for `raw=False` (the default).

If you didn't know already, passing in `raw=True` to `DataFrame.apply` tells pandas to pass in numpy arrays, not pandas Series to the functions you pass into apply. Because, numba itself supports numpy arrays natively, in general, every function runnable with the `Python` engine, should also be runnable with the `numba` engine, as long as you stick to the [supported numpy features](https://numba.readthedocs.io/en/latest/reference/numpysupported.html) inside numba.

When `raw=False` is passed in or no `raw` parameter is passed in, we must "mock" the pandas `Series` object that would normally get passsed in, since numba doesn't natively support pandas DataFrames. This means that while most functions passed into apply with work with the numba engine out of the box with `raw=False`, some functions may require modifications, as the "mocked" DataFrame does not implement the entire pandas API.

### Supported features

To summarize the existing support as of pandas 2.2.0, the `numba` engine in df.apply supports:

- Numeric numpy arrays
- Series methods \*
  - In general, all methods that have a numpy equivalent (e.g. mean) are supported
  - Other more complex methods are generally unsupported.
- Indexing \*
  - Indexing with a scalar is supported with the numba engine, but
    indexing with a slice object or via fancy indexing is not supported.
- Basic binary operations
  - e.g. addition, subtraction, multiplication, and division
- Parallel apply
  - This is only supported when `raw=True`
  - Like other functions that support numba, you can pass in `parallel: True` inside the `engine_kwargs` dictionary argument to use apply in parallel.

\*: This indicates partial support

Because the numba engine is still very new and experimental, we don't support DataFrames containing Apache Arrow backed
arrays, datetime/timedelta arrays, or string arrays.

However, it is anticipated that these and other features will be added, as the numba engine matures and pickes up adoption.

Because of limitations within numba, the numba engine will not support:

- Any Python/numpy operations not supported by numba
  - It's important to note that numba only compiles a subset of valid Python code.
    Check out [the list of supported Python features](https://numba.readthedocs.io/en/stable/reference/pysupported.html) for more info.
- Object dtype arrays
- Generic Extension Arrays
- Mutation of the original pandas object pandas inside of your function
  - This is already discouraged inside of apply, but will not work at all with the numba engine,
    and may crash your program.

For these unsupported features, it is recommended that you use the `python` engine or find an alternative to `apply`.

## Performance

To understand the performance of the new numba engine, it's helpful to understand
the steps going on under the hood when you call apply, and the overhead that each step contributes to the runtime.

### Understanding the JIT process

The runtime of apply under numba consists of 4 parts

1. JIT compilation with numba
   - This stage will JIT the function that you pass in if it has not been JIT compiled yet, and cache it for future calls.
2. Unboxing the DataFrame
   - During this stage, the DataFrame is converted to a format recognizable to numba
     - This mostly involves extracting the numpy arrays backing the DataFrame, and then converting to the numba representation of a DataFrame.
       - When `raw=True`, conversion to the numba representation isn't necessary, as we operate on the numpy arrays instead.
3. Running the function
4. Boxing the DataFrame
   - This is the opposite of the unboxing phase, and during this phase, we pack the results of applying the function back into pandas objects.

Note that parts a, b, and d contribute to the overhead in running the function. Depending on the function you pass into apply, this overhead can be pretty significant.

We can see the impact of each one of these overheads in our benchmarks below.

### Performance Case Study

Here, we will look at the performance of the numba engine.
The DataFrame we will operate on will be long and narrow
(10,000 rows and 3 columns), and we will have a mix of randomly generated integers and floats.

We will perform 4 tests here on:

1. Analyzing overhead of the numba engine
2. Indexing performance of the numba engine
3. Analyzing performance of the numba engine on normalizing rows of a DataFrame
4. Comparing raw=True and raw=False, and analyzing the speedups provided by parallel execution with the numba engine when operating on the raw values of the DataFrame.

All tests are performed with numba 0.58.1.

<details>
    <summary>DataFrame Creation Code</summary>

```python
import pandas as pd
import numpy as np

np.random.seed(42)

size = int(10**4)

df = pd.DataFrame({"a": np.random.randn(size), "b": np.random.randint(0, size, size), "c": np.random.randn(size)})
```

</details>

```python
df
```

<div>
  <table>
    <thead>
      <tr>
        <th></th>
        <th>a</th>
        <th>b</th>
        <th>c</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>0</th>
        <td>0.496714</td>
        <td>1897</td>
        <td>1.214547</td>
      </tr>
      <tr>
        <th>1</th>
        <td>-0.138264</td>
        <td>5751</td>
        <td>0.855936</td>
      </tr>
      <tr>
        <th>2</th>
        <td>0.647689</td>
        <td>5150</td>
        <td>-0.533877</td>
      </tr>
      <tr>
        <th>3</th>
        <td>1.523030</td>
        <td>1697</td>
        <td>-0.592459</td>
      </tr>
      <tr>
        <th>4</th>
        <td>-0.234153</td>
        <td>5885</td>
        <td>0.355951</td>
      </tr>
      <tr>
        <th>...</th>
        <td>...</td>
        <td>...</td>
        <td>...</td>
      </tr>
      <tr>
        <th>9995</th>
        <td>1.301102</td>
        <td>9250</td>
        <td>-1.044473</td>
      </tr>
      <tr>
        <th>9996</th>
        <td>-1.998345</td>
        <td>7004</td>
        <td>0.121797</td>
      </tr>
      <tr>
        <th>9997</th>
        <td>-0.705317</td>
        <td>9198</td>
        <td>0.154088</td>
      </tr>
      <tr>
        <th>9998</th>
        <td>0.495766</td>
        <td>1220</td>
        <td>-0.495612</td>
      </tr>
      <tr>
        <th>9999</th>
        <td>0.644388</td>
        <td>4661</td>
        <td>-0.419253</td>
      </tr>
    </tbody>
  </table>
  <p>10000 rows × 3 columns</p>
</div>

#### Measuring compilation and boxing/unboxing overhead

First, to give an idea of how much overhead compilation and boing/unboxing creates,
we will use a simple function that returns the input Series without modification.

```python
>>> f = lambda x: x
```

```python
# Timing the compilation time
# To estimate this, we will use the numba engine on a very small DataFrames
>>> small_df = pd.DataFrame({"a": [1]})
>>> %time small_df.apply(f, engine="numba", axis=1)

CPU times: user 2.67 s, sys: 201 ms, total: 2.87 s
Wall time: 3.21 s
```

```python
# Notice how the compilation overhead disappears on the second run
# because of the caching of the compiled function
>>> %time small_df.apply(f, engine="numba", axis=1)

CPU times: user 1.31 ms, sys: 21 µs, total: 1.33 ms
Wall time: 1.33 ms
```

Now, let's measure the overhead of the boxing/unboxing of the input DataFrame.
To do this, we will compare the speed of apply with numba with raw=True and raw=False.

Although doing a raw apply on the DataFrame still does have some overhead (mainly due to converting the DataFrame into a 2D ndarray),
it is minimal compared to the total execution time.

```python
>>> df.apply(f, engine="numba", axis=1) # warmup run to avoid JIt compilation
>>> %timeit -n 20 df.apply(f, engine="numba", axis=1)

333 ms ± 29 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

```python
>>> %timeit df.apply(f, engine="numba", axis=1, raw=True)

307 µs ± 44.3 µs per loop (mean ± std. dev. of 7 runs, 1 loop each)
```

We can see here that the difference is several orders of magnitude.
This is because the unboxing process currently individually unboxes each resultant Series to a Python object
before concatenating them together to build the result DataFrame.

In future pandas releases, this can be optimized by concatenating the results of apply inside of the numba
engine (which would only require one final unobxing call for the concatenated DataFrame),
which should bring the speed of apply on Series in numba on par with the speed of
apply on the raw numpy arrays.

While the numba engine is a fair bit slower in this case, compared to the Python engin,

```python
>>> %timeit -n 20 df.apply(f, engine="python", axis=1)

185 ms ± 6.63 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

#### Indexing Performance

Here, we wil do a very simple test of selecting a column/row, followed by a more complex example
of taking the square of the difference of two columns.

```python
>>> f = lambda x: x['b']
>>> df.apply(f, engine="numba", axis=1) # warmup run to avoid JIT compilation
>>> %timeit -n 20 df.apply(f, engine="numba", axis=1)
>>> %timeit -n 20 df.apply(f, engine="python", axis=1)

20.6 ms ± 1.39 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
40.6 ms ± 1.19 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

```python
>>> f = lambda x: x[10]
>>> df.apply(f, engine="numba", axis=0) # warmup run to avoid JIT compilation
>>> %timeit -n 20 df.apply(f, engine="numba", axis=0)
>>> %timeit -n 20 df.apply(f, engine="python", axis=0)

1.17 ms ± 168 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
247 µs ± 18.6 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

```python
>>> # Something a little more advanced
>>> f = lambda x: (x['a'] - x['c']) ** 2
>>> %timeit -n 20 df.apply(f, engine="numba", axis=1)
>>> %timeit -n 20 df.apply(f, engine="python", axis=1)

25.5 ms ± 8.09 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
63.7 ms ± 3.33 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

#### Normalization example

NOTE: Because, numba only supports ddof=0,
we are not using the `std` method on a Series (since that defaults to ddof = 1).

```python
>>> f = lambda x: (x - x.mean()) / np.std(x.values)
>>> # Note: The Python engine takes a bit longer to run the apply, so we're
>>> # reducing the number of runs here.
>>> df.apply(f, engine="numba", axis=1) # warmup run to avoid JIT compilation
>>> %timeit -n 10 df.apply(f, engine="numba", axis=1)
>>> %timeit -n 10 df.apply(f, engine="python", axis=1)

349 ms ± 19.3 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
2.68 s ± 184 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

```python
f = lambda x: (x - x.mean()) / (np.std(x.values))
df.apply(f, engine="numba", axis=0) # warmup run to avoid JIT compilation
%timeit -n 20 df.apply(f, engine="numba", axis=0)
%timeit -n 20 df.apply(f, engine="python", axis=0)

The slowest run took 5.83 times longer than the fastest. This could mean that an intermediate result is being cached.
2.68 ms ± 1.71 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
2.93 ms ± 895 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

#### Performance comparison between raw=True/raw=False

We will now look at how performance differs with the numba engine when raw=True and raw=False.

We'll also look at when parallel apply can provide a speedup, compared to regular DataFrame functions.

First, let's take a look at the speed of our apply function when raw is False, to provide a baseline.

```python
>>> # Now on the raw data (ndarrays instead of Series)
>>> raw_f = lambda x: (x-x.mean()) / x.std()
>>> df.apply(f, engine="numba", axis=1, raw=False) # warmup run to avoid JIT compilation
>>> %timeit -n 20 df.apply(f, engine="numba", axis=1, raw=False)

415 ms ± 25.1 ms per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

And now, the raw performance.

Notice as with before how operating on raw values is much faster than operating on the Series itself.

```python
>>> df.apply(raw_f, engine="numba", axis=1, raw=True, engine_kwargs={"parallel": False}) # warmup to avoid JIT compilation
>>> %timeit -n 20 df.apply(raw_f, engine="numba", axis=1, raw=True, engine_kwargs={"parallel": False})

2.17 ms ± 32.5 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

Now, let's trying operating in parallel.

Here, we can see roughly a 5x speedup over just using raw.
(Again, this was performed on my 2019 Intel MacBook Pro with 6 cores.)

```python
>>> df.apply(raw_f, engine="numba", axis=1, raw=True, engine_kwargs={"parallel": True}) # warmup to avoid JIT compilation
>>> %timeit -n 20 df.apply(raw_f, engine="numba", axis=1, raw=True, engine_kwargs={"parallel": True})


OMP: Info #276: omp_set_nested routine deprecated, please use omp_set_max_active_levels instead.


345 µs ± 28.5 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

Finally, for comparison's sake, let's look at the Python performance with raw=True, and also the
time it takes for the vectorized equivalents.

```python
>>> %timeit -n 20 df.sub(df.mean(axis=1), axis=0).div(df.std(ddof=0, axis=1), axis=0)

3.66 ms ± 670 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

In this case, parallel apply with raw=True provided a good speedup, however,
this is not guaranteed to happen in all cases.

A good rule of thumb to follow is that if there already exists a numpy/pandas function
that does what you want to do already, you should use that, as it is hard for numba
to beat the optimized low-level routines in both of those libraries.

However, if your operation chains together a lot of these operations, numba may provide a pretty
good speedup. For example, in our normalization example above, we took the mean, did a subtraction,
took the standard deviation, and then did a division. Because numpy evaluates each one of these operations
eagerly, it may miss out on performance optimizations that the numba compiler is able to use, explaining the
performance improvement with numba above.

```python
>>> # Let's take a look at the performance of just a mean operation with numba
>>> # (both raw mode and parallel on)
>>> # and just with numpy/pandas

>>> f = lambda x: x.mean()
>>> df.apply(f, engine='numba', raw=True, engine_kwargs={'parallel': True}, axis=1) # warmup to avoid JIT compilation
>>> %timeit -n 20 df.apply(f, engine='numba', raw=True, engine_kwargs={'parallel': True}, axis=1)
>>> %timeit -n 20 df.mean(axis=1)
>>> %timeit -n 20 df.values.mean(axis=1)

181 µs ± 45.5 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
1.69 ms ± 72.9 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
93.4 µs ± 13.4 µs per loop (mean ± std. dev. of 7 runs, 20 loops each)
```

Here, we can see that although numba beats the pandas mean function (it's a bit slower than the numpy version because it does some extra work),
it loses to the numpy mean function, illustrating the point above.

## Conclusion

All in all, the numba engine will offer a faster way for pandas users to run their apply functions with minimal changes, for functions containing standard pandas operations (think indexing, arithmetic, and using numpy functions on the data) in pandas 2.2 and above.

It does this by "mocking" the Series object passed in to your function. This is necessary because numba code cannot access the methods on a
Series like Python code can - each numba equivalent must have either rewrite or wrap the logic behind the original method.

It also opens up the door to parallel `DataFrame.apply`, when operating on the raw values of the DataFrame, which is super exciting as this has been a highly requested feature in pandas over the years.

While many features/methods may be missing from the mocked Series object currently (such is the nature of mocking) and the numba engine in general, it's expected that these will slowly be added in as the numba engine is adopted, and from contributions from users like you!

## Acknowledgements

I'd like to thank [Matthew Roeschke](https://github.com/mroeschke) for reviewing my PRs, and the numba developers for
helping to answer my questions about numba.

I'd also like to thank [Ralf Gommers](https://github.com/rgommers) and [Marco Gorelli](https://github.com/MarcoGorelli)
for peer reviewing this blog post.

This work was supported by a grant from NASA to Pandas, scikit-learn, SciPy and NumPy under the NASA ROSES 2020 program.
