---
title: "Teaching NumPy's ufuncs new tricks"
authors: [iason-krommydas]
published: September 6, 2026
description: 'A recap of my Quansight internship working on NumPy internals: multi-output reductions and np.minmax, segmented reductions, and new gufuncs.'
category: [PyData ecosystem, Internship]
featuredImage:
  src: /posts/teaching-numpys-ufuncs-new-tricks/hero.png
  alt: 'NumPy logo surrounded by sketches of arrays.'
hero:
  imageSrc: /posts/teaching-numpys-ufuncs-new-tricks/hero.png
  imageAlt: 'NumPy logo surrounded by sketches of arrays.'
---

_**Note:** a good part of this post is about NumPy's internals, so it assumes some basic familiarity with C and there are C snippets throughout. I have commented those snippets line by line, so hopefully they are readable even if you do not write C yourself._

## Introduction

This summer, during my Quansight internship, I got to work on [NumPy](https://numpy.org), and in particular a lot on NumPy internals.
I had a few patches merged into NumPy in the past but this was my first deep dive into the codebase.
Most of this post is about the technical work: multi-output reductions, `np.minmax`, segmented reductions, and turning a few NumPy functions into generalized ufuncs.
Before getting to that though, here is the short story of how a physicist who used to hate programming ended up as a Quansight intern working on NumPy internals.

I am not a computer scientist or an engineer.
I am an impostor: a physicist.
I had never programmed before in my life until starting college, where my first two classes were in Java, and they were enough to convince me that I did not want to program ever again.
What changed my mind was a computational physics track a couple of years later, where the professor forced us to use a Unix-like operating system. The first time I used a terminal my mind was blown: "So to copy all the pdf files from one folder to another, you're telling me that I don't actually have to open a file explorer and manually select all the files? I can just do `cp source/*.pdf destination`? Wow!"

I ended up doing a PhD in High-Energy Physics, a field that collects petabytes of data per experiment per year, as a member of the [CMS](https://cms.cern) experiment at [CERN](https://home.cern). There I worked heavily with the [Scikit-HEP](https://scikit-hep.org) stack of tools.
I wanted to program more and I was also learning more about open source software, so I started cold-messaging people like "Hey, you maintain this tool, I'm a HEP student, I want to work on it". That is how I ended up becoming a maintainer of a few of those tools, most notably [Awkward Array](https://awkward-array.org) and [Coffea](https://coffea-hep.readthedocs.io).
Scikit-HEP is itself a member of [Scientific Python](https://scientific-python.org), so I gradually got more involved there too, while my love for programming and scientific computing was going up.
At [SciPy 2025](https://www.scipy2025.scipy.org) I hacked a bit on NumPy during the sprints and met [Nathan Goldbaum](https://github.com/ngoldbaum), who would become my mentor and who told me to apply for the Quansight internship program.
A year later, I was accepted into the 2026 Quansight internship cohort where I had the opportunity to work on NumPy!

## What new tricks did NumPy's ufuncs learn

During the internship, I got to work on a few things on NumPy as well as general maintenance like bug-fixing and triaging. The core larger projects I worked on were enabling multi-output reductions in NumPy and implementing a heavily requested `np.minmax` function as a follow-up, and implementing segmented reductions. Finally I worked on converting the internals of some functions into gufuncs to allow new features and/or boost performance.

Perhaps this paragraph did not make a lot of sense and there were some unknown words but everything will be explained in the rest of this post. To do so, we have to start by explaining how some NumPy internals work.

### What are NumPy's universal functions

NumPy has a concept of "universal functions" or "[ufuncs](https://numpy.org/doc/stable/user/basics.ufuncs.html)" for short.
Ufuncs are functions that operate on arrays in an element-wise fashion. They are "vectorized" and they take in a fixed number of inputs and produce a fixed number of outputs.
They also support broadcasting and typecasting and other standard features.
For example, [numpy.add](https://numpy.org/doc/stable/reference/generated/numpy.add.html#numpy.add) is a ufunc that takes two arrays as input arguments and writes to one output array whose elements are the element-by-element sums of the two input arrays.

```python
>>> import numpy as np
>>> x1 = np.array([[1,2],[3,4]])
>>> x2 = np.array([[5,6],[7,8]])
>>> np.add(x1, x2)
array([[ 6,  8],
       [10, 12]])
```

and as we mentioned earlier, broadcasting and typecasting are supported

```python
>>> integer_array = np.array([[1,2],[3,4]], dtype=np.int64)
>>> float_array = np.array([1.1,2.2], dtype=np.float64)
>>> np.add(integer_array, float_array)
array([[2.1, 4.2],
       [4.1, 6.2]])
```

where you can notice that `integer_array` is a 2x2 array of integers, while `float_array` is a single row of two doubles. NumPy upcasts the integers to doubles and broadcasts `float_array` to every row of `integer_array` to make the shapes match.

There are also [generalized ufuncs](https://numpy.org/doc/stable/reference/c-api/generalized-ufuncs.html#c-api-generalized-ufuncs) which are functions over arrays of elements.
They operate on a subarray-by-subarray basis instead of element-by-element.
We'll talk more about those later.

Everything else in this post is a variation on these loops, so it is worth going through the anatomy of one before we go any further.
Reductions and generalized ufuncs are implemented in NumPy in terms of what a loop is handed and how NumPy calls it.
However, none of that will make sense without seeing the plain element-wise case first.
So let's write one. This is an illustrative sketch of one of the `numpy.add` loops, the one for the `double` data type:

```c
void double_add_ufunc_loop(char **args, const npy_intp *dimensions,
                           const npy_intp *steps, void *data)
{
    /* Extract dimensions (number of elements to process) */
    npy_intp n = dimensions[0];

    /* Pointers to the start of input and output data buffers */
    char *in1_ptr = args[0];
    char *in2_ptr = args[1];
    char *out_ptr = args[2];

    /* Byte strides for moving to the next element in each array */
    npy_intp in1_step = steps[0];
    npy_intp in2_step = steps[1];
    npy_intp out_step = steps[2];

    /* Execute the element-wise addition */
    for (npy_intp i = 0; i < n; i++) {
        /* Cast pointers to double types and dereference */
        double in1_val = *(double *)in1_ptr;
        double in2_val = *(double *)in2_ptr;

        /* Do the addition and write it to the output data buffer */
        *(double *)out_ptr = in1_val + in2_val;

        /* Advance byte pointers by stride length */
        in1_ptr += in1_step;
        in2_ptr += in2_step;
        out_ptr += out_step;
    }
}
```

Let's break it down piece by piece. Every ufunc loop has the same signature:

```c
void double_add_ufunc_loop(char **args, const npy_intp *dimensions,
                           const npy_intp *steps, void *data)
```

NumPy does not hand the loop arrays, it hands it pointers to memory buffers alongside instructions on how to iterate over the buffers.
The `args` holds a pointer to the start of each operand's data buffer (the underlying data buffers of NumPy arrays), `dimensions` holds the number of elements along each dimension of the array, and `steps` says how to get from one element to the next in each operand.
The `data` is optional extra state a loop can be registered with, which we will not use here.

The first thing we need to do to implement a loop is read out how many elements this call has to process:

```c
npy_intp n = dimensions[0];
```

Note that this is not necessarily the size of the array. NumPy may split the work into chunks and call the loop several times, so `n` is just how much work this particular call was given.

Then the pointers to the data buffers, inputs first and then outputs:

```c
char *in1_ptr = args[0];
char *in2_ptr = args[1];
char *out_ptr = args[2];
```

Two inputs and one output, which is exactly the binary nature of `numpy.add`.
They are `char *` and not `double *` because the signature is the same for every ufunc and every data type, and it is the loop itself that knows these particular buffers hold doubles.

Next the strides, again one per operand:

```c
npy_intp in1_step = steps[0];
npy_intp in2_step = steps[1];
npy_intp out_step = steps[2];
```

A stride is how many _bytes_ to move forward to land on the next element of that operand, which is the other reason the pointers are `char *`, since adding a stride to a `char *` moves exactly that many bytes.
For a contiguous array of doubles the stride is just `sizeof(double)`, but an array can also be strided (a slice like `a[::2]` for example) or even broadcast, in which case the stride is `0` and the pointer keeps reading the same element. The loop cannot assume anything and just uses whatever it is given.

Finally the body, which walks all three buffers in lockstep:

```c
for (npy_intp i = 0; i < n; i++) {
    double in1_val = *(double *)in1_ptr;
    double in2_val = *(double *)in2_ptr;

    *(double *)out_ptr = in1_val + in2_val;

    in1_ptr += in1_step;
    in2_ptr += in2_step;
    out_ptr += out_step;
}
```

Each iteration casts the two input pointers to `double *` and dereferences them to get the current pair of values, adds them, writes the result through the output pointer, and then advances all three pointers by their strides to land on the next element.

Here is the whole loop in one picture, with a strided view as the second input so that the strides are visible:

![The three operands of the loop drawn as rows of cells, with a pointer at the current element of each row and an arrow for the stride to the next one. The first row shows a 4-element input array with a stride of one element, showing an arrow between two consecutive elements. The second input is a strided view, so its stride skips a cell. The third row is the output and shows the result computed from the elements of both arrays recovered according to their strides.](/posts/teaching-numpys-ufuncs-new-tricks/ufunc-loop-anatomy.svg)

NumPy's ufunc infrastructure does all the setup for the loop. Therefore, a set of loop implementations for different data types and some metadata about the operation is enough to create a ufunc. We did `double` here, which is `numpy.float64` in NumPy. To define a ufunc over more data types you need to define such loops for all the data types you want the loop to work on. For more information on how to create your own ufuncs, see the [Writing your own ufunc docs](https://numpy.org/devdocs/user/c-info.ufunc-tutorial.html).

### How NumPy does reductions

Now that we have explained the basics of ufunc internals, let's move into reductions and how NumPy does them.
Reductions are operations that collapse a dimension. For example, a summation is a reduction:

```python
>>> np.sum([1,2,3])
np.int64(6)
>>> np.sum([[1,2],[3,4]], axis=0)
array([4, 6])
>>> np.sum([[1,2],[3,4]], axis=1)
array([3, 7])
>>> np.sum([[1,2],[3,4]], axis=None)
np.int64(10)
>>> np.sum([[1,2],[3,4]], axis=(0, 1))
np.int64(10)
```

In the examples above, a 1-dimensional array is reduced down to a scalar, and a 2-dimensional array is reduced down to either a 1-dimensional array if one dimension is collapsed or a scalar if both are collapsed. But how does NumPy actually perform those operations?

One might think that there are specialized compiled kernels/loops (like the ufunc loops) to do reductions. It turns out all simple reductions in NumPy are actually using regular forward ufunc loops underneath, like the one we wrote earlier.
But how is this possible?
Reductions are a wrapper around a method of the ufunc called `reduce`, so `numpy.sum` is equivalent to `numpy.add.reduce`:

```python
>>> np.add.reduce([1,2,3])
np.int64(6)
```

Similarly, `numpy.prod` uses the `numpy.multiply` ufunc, `numpy.min` uses the `numpy.minimum` ufunc, and so on.

But how can the loop we wrote in C earlier be used to do a summation?
Let's consider summing a 1-dimensional array like `[1,2,3]` to get 6.
We need an accumulator to store the result.
For integers, the default initial value for reductions is 0, but you can also choose a different value.
Then we need to iterate over the array, adding elements and keeping a running sum in the accumulator.

```python
>>> arr = [1,2,3]
>>> accum = 0
>>> for i in arr:
...     accum += i
...
>>> accum
6
```

Can the `double_add_ufunc_loop` loop be used to do that?
If we set the `args[0]` input pointer to the accumulator location, and we set `args[2]` to be equal to `args[0]`, then that makes the output location the same as the first input pointer location and both become the accumulator location.
Then if we set `steps[0] = steps[2] = 0` and seed the accumulator with the value 0, we have an accumulator that starts at zero and does not move.
The loop now does exactly what we want.

Here is that wiring drawn out:

![The accumulator feeds the loop as args[0] with a stride of 0, the array feeds it as args[1] and walks forward, and the result is written back into the accumulator through args[2].](/posts/teaching-numpys-ufuncs-new-tricks/reduce-1d.svg)

And this is what NumPy does in the `reduce` method of ufuncs. To do summation in particular, it steers the `numpy.add` loop like this. Here the array being reduced has data buffer `data`, `n` elements, and a stride `stride` between elements:

```c
double add_reduce(double *data, npy_intp n, npy_intp stride)
{
    /* Seed the accumulator with the identity of `add`. */
    double accum = 0.0;

    /* The first input and the output are the *same* location: the accumulator.
     * Only the second input points into the array we are reducing. */
    char *args[3] = { (char *)&accum, (char *)data, (char *)&accum };

    /* The accumulator never moves, so its two strides are zero.
     * Only the second input walks forward through the array. */
    npy_intp steps[3] = { 0, stride, 0 };

    /* The loop has to process all n elements of the array */
    npy_intp dimensions[1] = { n };

    /* Run the very same element-wise loop we wrote earlier */
    double_add_ufunc_loop(args, dimensions, steps, NULL);

    /* The loop left the total sitting in the accumulator */
    return accum;
}

double arr[3] = {1.0, 2.0, 3.0};
double total = add_reduce(arr, 3, sizeof(double));   /* 6.0 */
```

Now for more than one dimension and for reducing over axes, the steering gets a little more complicated. For example, to do a reduction like this

```python
>>> arr
array([[0, 1, 2],
       [3, 4, 5],
       [6, 7, 8]])
>>> np.add.reduce(arr, axis=1)
array([ 3, 12, 21])
```

you can imagine that NumPy creates and seeds an accumulator for every row being reduced and calls the ufunc loop three times, once per row.

![A 3 by 3 array reduced along axis 1, with an arrow from each row to its own accumulator holding the row sum: 3, 12 and 21.](/posts/teaching-numpys-ufuncs-new-tricks/reduce-2d.svg)

Interested parties can read the [`PyUFunc_Reduce` function in the NumPy source code](https://github.com/numpy/numpy/blob/44dffc7ae68a48251e302e85d0308a98dcc41bf7/numpy/_core/src/umath/ufunc_object.c#L2661-L2722) to see how all the steering is done.

### The problem with multi-output reductions

But what if we want to accumulate multiple values at once as we slide over the array? As an example, someone might want to simultaneously accumulate the sum and the product of the elements of an array. Another common reduction pair is the minimum and maximum.

Here's where we run into a problem. So far, all the ufuncs we've mentioned that we can call `reduce` on took in two input arrays and returned one output array.
What happens if we try to call `reduce` on ufuncs that accept/return a different number of input/output arrays? This used to be the error:

```python
>>> import numpy as np
>>> np.divmod.reduce([1,2,3])
Traceback (most recent call last):
  File "<python-input-1>", line 1, in <module>
    np.divmod.reduce([1,2,3])
    ~~~~~~~~~~~~~~~~^^^^^^^^^
ValueError: reduce only supported for functions returning a single value
>>> np.frexp.reduce([1,2,3])
Traceback (most recent call last):
  File "<python-input-2>", line 1, in <module>
    np.frexp.reduce([1,2,3])
    ~~~~~~~~~~~~~~~^^^^^^^^^
ValueError: reduce only supported for binary functions
```

The `reduce` method is only supported for ufuncs that are 2-in/1-out.
Reducing means that there's some sort of comparison (min/max) or accumulation (sum/prod) between two arrays, so the two input limitation is intuitive in that sense.
The one output limitation is due to the fact that the reductions were implemented by re-using the forward ufunc loops: at the low level, a reduction that accumulates N values needs N accumulator locations (pointers) and one more pointer that slides over the reduced array, so the pointer aliasing trick we did for the `numpy.add` loop (where N = 1) only works when the loop is already `N + 1-in/N-out`.
A `2-in/N-out` loop only gives us two input pointers and N output pointers, so for more than one output there aren't enough input pointers to set equal to the N accumulator locations.

### np.minmax

A [long-requested feature](https://github.com/numpy/numpy/issues/9836) in NumPy has been a `numpy.minmax` reduction that returns the minimum and maximum value in a single pass.
That is structurally equivalent to

```python
def minmax(x, ...):
    return numpy.min(x, ...), numpy.max(x, ...)
```

but not performance-wise.

That is a reduction with two outputs. `numpy.min` uses the `numpy.minimum` loop that returns the element-wise minima of two arrays and `numpy.max` uses the `numpy.maximum` loop that returns the element-wise maxima of two arrays.
If we implemented a `numpy.minimummaximum` ufunc that returns the element-wise minima and maxima of two arrays in a single pass, we still couldn't implement `numpy.minmax`: such a ufunc is 2-input/2-output, so its `reduce` method wouldn't work.

Here is the problem in a picture: three things need to get into the loop and there are only two input pointers.

![The minimummaximum forward loop has two inputs and two outputs. acc_min and the array element x take the two inputs, and acc_max is left outside with no way in.](/posts/teaching-numpys-ufuncs-new-tricks/multi-output-problem.svg)

### Teaching ufuncs to do multi-output reductions

We could have treated `numpy.minmax` as a special case and implemented it using a gufunc or fully manually but we wanted to have all the nice features that ufunc reductions support (see [ufunc.reduce](https://numpy.org/devdocs/reference/generated/numpy.ufunc.reduce.html)), like the `axis`, `dtype`, `out`, `keepdims`, `initial`, and `where` arguments.
Therefore, we decided to add a mechanism to teach ufuncs to do multi-output reductions.

The idea is simple: if the forward loop cannot be steered into doing a reduction, then let the ufunc ship a second loop that is written as a reduction from the very beginning.
So, on top of its forward element-wise loop, a ufunc's loop implementation can now register an optional, dedicated _reduction loop_, and `reduce` will pick that one up and steer it instead of the forward one.

The first question is how many inputs and outputs such a loop should have.
Going back to the low level picture from the previous section, a reduction that accumulates N values needs the N current accumulators coming in, plus the one element that is currently being streamed in from the array being reduced. It produces the N updated accumulators.
That is an `N + 1-in/N-out` loop.
The nice thing about this convention is that for `N = 1` it collapses to `2-in/1-out`, which is exactly the shape of the classic forward loops that `reduce` has always been steering.
In other words, the way `numpy.add.reduce` has always worked is just the `N = 1` special case of the new signature, so the machinery needs only one code path and nothing had to change for the existing single-output ufuncs.

Concretely, such a loop is handed its data pointers and its strides in this order

```
[acc_0, ..., acc_N-1, x, out_0, ..., out_N-1]
```

where `x` is the element streamed in from the array being reduced, and each `out_i` points at the same memory as the matching `acc_i` and has the same stride as it.
It is the same aliasing trick we did for `numpy.add`, just done N times instead of once.
In fact, this is exactly the layout the `add_reduce` snippet from earlier was setting up: its `args` was `{ &accum, data, &accum }`, which is just `[acc_0, x, out_0]` for `N = 1`.
We will see the `N = 2` version of the same steering in the `minmax_reduce` example below.

Let's make this concrete with the `numpy.minimummaximum` ufunc we wished for in the previous section, a `2-in/2-out` ufunc that computes the element-wise minimum and maximum of two arrays in a single pass.
Its forward loop is the boring part and looks just like the `numpy.add` one, only with one more output pointer to keep track of (I'll write `min` and `max` for the scalar minimum and maximum of two numbers to keep the snippets short)

```c
void double_minimummaximum_ufunc_loop(char **args, const npy_intp *dimensions,
                                      const npy_intp *steps, void *data)
{
    /* Extract dimensions (number of elements to process) */
    npy_intp n = dimensions[0];

    /* Two input data buffers and now two output data buffers */
    char *in1_ptr = args[0];
    char *in2_ptr = args[1];
    char *min_ptr = args[2];
    char *max_ptr = args[3];

    /* Byte strides for moving to the next element in each array */
    npy_intp in1_step = steps[0];
    npy_intp in2_step = steps[1];
    npy_intp min_step = steps[2];
    npy_intp max_step = steps[3];

    /* Execute the element-wise minimum and maximum */
    for (npy_intp i = 0; i < n; i++) {
        /* Cast pointers to double types and dereference */
        double a = *(double *)in1_ptr;
        double b = *(double *)in2_ptr;

        /* Write the smaller one to the first output data buffer and the
         * larger one to the second */
        *(double *)min_ptr = min(a, b);
        *(double *)max_ptr = max(a, b);

        /* Advance byte pointers by stride length */
        in1_ptr += in1_step;
        in2_ptr += in2_step;
        min_ptr += min_step;
        max_ptr += max_step;
    }
}
```

which gives us the element-wise behavior we expect from a two-output ufunc

```python
>>> from numpy._core.umath import minimummaximum
>>> minimummaximum([2, 3, 4], [1, 5, 2])
(array([1, 3, 2]), array([2, 5, 4]))
```

and, as we discussed, this loop can never be steered into a `minmax` reduction: it only has two input pointers and we need three, two for the accumulators and one to walk the array.
So we write the reduction loop separately, with the `3-in/2-out` signature

```
(acc_min, acc_max, x) -> (min(acc_min, x), max(acc_max, x))
```

which in C is

```c
void double_minimummaximum_reduce_loop(char **args, const npy_intp *dimensions,
                                       const npy_intp *steps, void *data)
{
    /* Extract dimensions (number of elements to fold in) */
    npy_intp n = dimensions[0];

    /* The two accumulators and the element streamed in from the array */
    char *acc_min_ptr = args[0];
    char *acc_max_ptr = args[1];
    char *x_ptr       = args[2];

    /* The two updated accumulators */
    char *out_min_ptr = args[3];
    char *out_max_ptr = args[4];

    /* Byte strides for moving to the next element in each array */
    npy_intp acc_min_step = steps[0];
    npy_intp acc_max_step = steps[1];
    npy_intp x_step       = steps[2];
    npy_intp out_min_step = steps[3];
    npy_intp out_max_step = steps[4];

    /* Fold every element of the array into the two accumulators */
    for (npy_intp i = 0; i < n; i++) {
        /* Cast pointers to double types and dereference: the running
         * minimum and maximum so far, and the new element */
        double cur_min = *(double *)acc_min_ptr;
        double cur_max = *(double *)acc_max_ptr;
        double x       = *(double *)x_ptr;

        /* Write the updated accumulators to the output data buffers */
        *(double *)out_min_ptr = min(cur_min, x);
        *(double *)out_max_ptr = max(cur_max, x);

        /* Advance byte pointers by stride length */
        acc_min_ptr += acc_min_step;
        acc_max_ptr += acc_max_step;
        x_ptr       += x_step;
        out_min_ptr += out_min_step;
        out_max_ptr += out_max_step;
    }
}
```

Note that the loop advances the accumulator pointers by their strides just like it does for any other operand, and never assumes what those strides are.
That is on purpose: the loop only does what the pointers and the strides tell it to do, and it is the reduce machinery's job to alias the accumulators with the outputs and to decide how they are laid out.
Sometimes they are a single scalar per output that stays put and therefore has a stride of zero, and sometimes they are a whole row of accumulators that the loop walks over, depending on the memory layout of the array and the axis being reduced.
The loop does not have to care, exactly like the `numpy.add` forward loop does not have to care that `reduce` is pointing two of its operands at the same place.
The steering is then the same trick as the `add_reduce` snippet from before, only with two accumulators instead of one

```c
/* The (min, max) pair that `minmax` returns as a tuple in Python */
typedef struct { double min, max; } minmax_t;

minmax_t minmax_reduce(double *data, npy_intp n, npy_intp stride)
{
    /* `minimum`/`maximum` have no identity to seed with, so both
     * accumulators start at the first element of the array. */
    double accum_min = data[0];
    double accum_max = data[0];

    /* Each output is the *same* location as its matching accumulator.
     * The streamed input starts at the second element, since the first
     * one has already been consumed by the seeding above. */
    char *args[5] = {
        (char *)&accum_min, (char *)&accum_max, (char *)data + stride,
        (char *)&accum_min, (char *)&accum_max,
    };

    /* Neither accumulator moves, only the streamed input walks the array */
    npy_intp steps[5] = { 0, 0, stride, 0, 0 };

    /* One element has already been consumed by the seeding above */
    npy_intp dimensions[1] = { n - 1 };

    /* Run the reduction loop we wrote above */
    double_minimummaximum_reduce_loop(args, dimensions, steps, NULL);

    /* The loop left the results sitting in the two accumulators */
    return (minmax_t){ accum_min, accum_max };
}

double arr[5] = {3.0, 1.0, 4.0, 1.0, 5.0};
minmax_t res = minmax_reduce(arr, 5, sizeof(double));   /* res.min = 1.0, res.max = 5.0 */
```

and just like in the single-output case, reducing over an axis of a multi-dimensional array just means one pair of accumulators per output element instead of a single pair.

Here is the reduction loop with all of its inputs and outputs wired up:

![The minimummaximum reduction loop has three inputs, acc_min, acc_max and the array element x, and its two outputs are written back into acc_min and acc_max.](/posts/teaching-numpys-ufuncs-new-tricks/reduction-loop.svg)

A ufunc with more than one output can only be reduced if it registers such a reduction loop, and `reduce` then returns a tuple with one array (or scalar) per output.
The mechanism landed in [numpy/numpy#31816](https://github.com/numpy/numpy/pull/31816) and there is a [tutorial in the NumPy docs](https://numpy.org/devdocs/user/c-info.reduction-loop-tutorial.html) on how to add a reduction loop to your own ufunc.
For now `reduce` is the only ufunc method that works with more than one output, and I am working on teaching `reduceat` and `accumulate` the same trick in [numpy/numpy#32212](https://github.com/numpy/numpy/pull/32212) and [numpy/numpy#32213](https://github.com/numpy/numpy/pull/32213).

### np.minmax revisited

With the mechanism in place, `numpy.minmax` is a thin layer on top of it.
We added a fused `minimummaximum` ufunc that computes the element-wise minima and maxima of two arrays in a single pass, gave it loops for every dtype that `numpy.minimum` and `numpy.maximum` support, SIMD-accelerated for the integer and floating-point ones just like theirs are, and registered a reduction loop for it.
`numpy.minmax` is then essentially `minimummaximum.reduce`, and it returns the `(min, max)` tuple we were after

```python
>>> a = np.array([3, 1, 4, 1, 5, 9, 2, 6])
>>> np.minmax(a)
(np.int64(1), np.int64(9))
```

```python
>>> b = np.arange(9).reshape(3, 3)
>>> b
array([[0, 1, 2],
       [3, 4, 5],
       [6, 7, 8]])
>>> np.minmax(b, axis=None)
(np.int64(0), np.int64(8))
>>> np.minmax(b, axis=0)
(array([0, 1, 2]), array([6, 7, 8]))
>>> np.minmax(b, axis=1)
(array([0, 3, 6]), array([2, 5, 8]))
```

`numpy.minmax` landed in [numpy/numpy#32231](https://github.com/numpy/numpy/pull/32231).

### Segmented reductions

A segmented reduction is a reduction applied to consecutive chunks of an array instead of to the whole thing.
It is the natural operation on ragged data: if you have a bunch of variable-length lists flattened into a single array, plus an array of offsets telling you where each list starts and ends, then "the sum of each list" is a segmented sum.
That is how [Awkward Array](https://awkward-array.org) stores its data, it is also what the rows of a [CSR sparse matrix](<https://en.wikipedia.org/wiki/Sparse_matrix#Compressed_sparse_row_(CSR,_CRS_or_Yale_format)>) look like, and it is why pretty much every array library that touches this kind of data ends up with some version of the operation.

NumPy already has something close in `ufunc.reduceat`, which takes a single array of indices and reduces the slices between consecutive ones

```python
>>> a = np.arange(8)
>>> np.add.reduceat(a, [0, 2, 5])
array([ 1,  9, 18])
```

so here we got the sums of `a[0:2]`, `a[2:5]` and `a[5:]`.

That covers the common case but it does not cover segmented reductions in general, and the reason is that a single array of boundaries can only describe segments that are glued to each other.
Each segment ends exactly where the next one begins and the last one always runs to the end of the axis, so there is no way to leave elements of the array out of every segment.
Empty segments cannot be expressed either, and instead of raising, `reduceat` has a special case for that situation: if `indices[i] >= indices[i + 1]`, the i-th result is `array[indices[i]]`, a single unreduced element.
On top of that, out-of-bounds indices are an error, so you have to clip offsets that come from somewhere else before you can use them.

Here is ragged data running into all of that at once, three lists of which the second one is empty and the last element of the array belongs to none of them

```python
>>> a = np.arange(8)
>>> offsets = np.array([0, 3, 3, 7])
>>> np.add.reduceat(a, offsets[:-1])
array([ 3,  3, 25])
```

where the answer we wanted was `[3, 0, 18]`: the empty list should sum to `0` rather than to `a[3]`, and the last list should stop at index 7 instead of swallowing it.

So we added a new ufunc method, `segmented_reduce`, which takes the start and the stop offset of every segment separately

```python
>>> np.add.segmented_reduce(a, offsets[:-1], offsets[1:])
array([ 3,  0, 18])
```

The i-th result is simply `ufunc.reduce(array[starts[i]:stops[i]])` and the offsets behave exactly like the bounds of a slice, so negative offsets count from the end of the axis and out-of-bounds offsets are clipped instead of raising.
Segments are therefore allowed to skip elements, to overlap and to be empty. An empty segment gives the identity of the ufunc, or the `initial` value if one is passed (passing one is required for ufuncs like `numpy.maximum` that have no identity)

```python
>>> np.add.segmented_reduce(a, [1, 5], [3, 7])                  # skipping elements
array([ 3, 11])
>>> np.add.segmented_reduce(a, [0, 2], [5, 4])                  # overlapping
array([10,  5])
>>> np.maximum.segmented_reduce(a, [0, 4], [0, 8], initial=-1)  # an empty segment
array([-1,  7])
```

Choosing separate start and stop offsets instead of a single offsets array is what buys all of that: with one array the segments are back-to-back by construction, which is exactly the `reduceat` limitation. And a plain offsets array is still only a slice away, as `starts=offsets[:-1]` and `stops=offsets[1:]`.
[CCCL's `segmented_reduce`](https://nvidia.github.io/cccl/unstable/python/compute_api.html#cuda.compute.algorithms.segmented_reduce) makes the same choice with its `start_offsets_in` and `end_offsets_in` arrays, [PyTorch's `torch.segment_reduce`](https://docs.pytorch.org/docs/main/generated/torch.segment_reduce.html) takes lengths or a single array of offsets. [JAX's `jax.ops.segment_sum`](https://docs.jax.dev/en/latest/_autosummary/jax.ops.segment_sum.html) and [TensorFlow's `tf.math.segment_sum`](https://www.tensorflow.org/api_docs/python/tf/math/segment_sum) take segment ids instead, one integer per element saying which segment that element belongs to.
Segment ids are the more general representation, since they let you group arbitrary scattered elements of the array into the same segment, which start and stop offsets cannot: a segment has to be a contiguous run along the axis, and anything else has to be sorted or permuted first.
That is the one thing we give up, and in exchange we keep the `axis` argument, while CCCL works on 1-D buffers only and JAX and TensorFlow always segment along the first axis.

I am still working on `ufunc.segmented_reduce` in [numpy/numpy#32243](https://github.com/numpy/numpy/pull/32243), so the details of the API may still change.

## Turning functions into gufuncs

The last thing I worked on was generalized ufuncs, which we mentioned at the beginning of the post but never really explained.
A gufunc operates subarray-by-subarray instead of element-by-element, and what it operates on is described by a _signature_ like `(n),(n)->()` for an inner product.
The parentheses give the shape of the _core_ of each operand, so `(n)` means that operand contributes a 1-dimensional subarray of length `n` and `()` means it contributes a scalar. Every dimension that is not consumed by a core is looped over and broadcast, exactly like a plain ufunc broadcasts over everything (a plain ufunc is really just the `(),()->()` case).

The loop looks like the ufunc loops from before, except that `dimensions` now also carries the core lengths and `steps` carries the core strides on top of the outer ones.
Here is one for the signature `(n)->()`, the sum along the core axis

```c
void double_sum_gufunc_loop(char **args, const npy_intp *dimensions,
                            const npy_intp *steps, void *data)
{
    /* Extract dimensions: how many subarrays we were handed,
     * and how long the core dimension of each one is */
    npy_intp n_outer = dimensions[0];
    npy_intp n = dimensions[1];

    /* Pointers to the start of the input and output data buffers */
    char *in_ptr = args[0];
    char *out_ptr = args[1];

    /* Byte strides for moving to the next subarray */
    npy_intp in_step = steps[0];
    npy_intp out_step = steps[1];

    /* Byte stride for moving to the next element inside a subarray */
    npy_intp in_core_step = steps[2];

    /* Execute the summation, one subarray at a time */
    for (npy_intp i = 0; i < n_outer; i++) {
        /* Walk the core dimension of this subarray from its start */
        char *p = in_ptr;
        double total = 0.0;

        for (npy_intp j = 0; j < n; j++) {
            /* Cast the pointer to double, dereference and accumulate */
            total += *(double *)p;

            /* Advance by the core stride to the next element */
            p += in_core_step;
        }

        /* Write the sum of this subarray to the output data buffer */
        *(double *)out_ptr = total;

        /* Advance byte pointers to the next subarray */
        in_ptr += in_step;
        out_ptr += out_step;
    }
}
```

That inner loop is the whole point: the kernel sees an entire subarray at once, so you can still write operations that are not element-wise at all as a single pass in C, and they get broadcasting, dtype resolution, `out` and subclass handling from the ufunc machinery for free.
The [generalized ufunc API docs](https://numpy.org/doc/stable/reference/c-api/generalized-ufuncs.html#c-api-generalized-ufuncs) have the full rules for signatures and for what the loop is handed.

The first function I converted was `numpy.unwrap`, and there the motivation was [performance and the ability to preserve `ndarray` subclasses](https://github.com/numpy/numpy/issues/9959).
This function unwraps a signal by changing elements which have an absolute difference from their predecessor of more than `max(discont, period/2)` to their period-complementary values.
It is therefore a scan, since each output element depends on the running phase correction accumulated over the whole prefix of the array, so it can never be an element-wise ufunc. The existing implementation was written in Python and was using other NumPy functions. As a result, it used to allocate a handful of intermediate arrays for the differences, the modulo and the cumulative correction, and always returned a base `ndarray` instead of preserving `ndarray` subclasses (which ufuncs automatically handle).
As a gufunc it has the signature `(n),(),()->(n)`: the values have a core of length `n`, the `discont` and `period` parameters are scalars, and the output has the same core as the values. All of that becomes a single pass in C++ with no temporaries, and preserving `ndarray` subclasses came along as a bonus since the ufunc machinery handles that.

The other one, which I am still working on, is `numpy.searchsorted`, and there the motivation is features rather than speed.
It requires the sorted array to be 1-dimensional, so searching a batch of sorted rows means writing a Python loop over the rows.
Written as a gufunc with signature `(n),(m?)->(m?)`, the core dimension `n` is the sorted axis and everything else broadcasts, so N-dimensional input and batching fall out of the machinery. The `?` marks an optional dimension, which is how the scalar-key case keeps working.
What is still open is whether to expose an `axis` keyword at the Python level or to always search along the innermost axis and let people bring the axis they want to the end themselves.

`numpy.unwrap` became a gufunc in [numpy/numpy#31848](https://github.com/numpy/numpy/pull/31848), the mask-aware `numpy.ma.unwrap` was added in [numpy/numpy#32091](https://github.com/numpy/numpy/pull/32091), and `numpy.searchsorted` is being worked on in [numpy/numpy#32346](https://github.com/numpy/numpy/pull/32346).

## Wrapping up and what may come next

On the technical side, there is a clear list of things to finish.
The multi-output reduction mechanism currently only works with the `reduce` method, so the next step is teaching `reduceat` and `accumulate` to pick up the dedicated reduction loops too ([numpy/numpy#32212](https://github.com/numpy/numpy/pull/32212), [numpy/numpy#32213](https://github.com/numpy/numpy/pull/32213)). `segmented_reduce` also needs to be finalized in [numpy/numpy#32243](https://github.com/numpy/numpy/pull/32243).
After that, it is worth exploring what else the new reduction loops make possible. Anything that can be expressed as a reduction operation can now get its own dedicated single-pass loop, and computing the mean and the variance of an array in a single pass is one example that comes to mind.

On a personal note, this internship was a very valuable learning experience.
I came into it with essentially no C experience: I had read [_The C Programming Language_ (K&R)](https://en.wikipedia.org/wiki/The_C_Programming_Language) and the [Extending and Embedding the Python Interpreter](https://docs.python.org/3/extending/index.html) docs, and built a [small C extension](https://github.com/ikrommyd/tensor.c) to learn how C extensions are written, and that was about it. Getting to learn NumPy's internals was more valuable to me than I can express.
Through this work I also became a member of the NumPy triage team, and I will continue working on NumPy, hopefully becoming a maintainer one day.
