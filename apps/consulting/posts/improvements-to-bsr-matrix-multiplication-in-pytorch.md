---
title: "Improvements to BSR Matrix Multiplication in PyTorch"
published: October 1, 2023
author: andrew-james
description: 'Quansight engineers have implemented several new kernels for matrix multiplication
involving sparse and dense arguments. These implementations, available in PyTorch 2.1,  offer a
significant performance improvement over those available in previous versions of PyTorch.'
category: [Open Source Software, PyTorch, Triton, GPU]
featuredImage:
  src: /posts/logos/pytorch_logo_large.png
  alt: 'The PyTorch logo, above the "PyTorch" project name in sans serif font. A stylized flame made from a single, thick orange line, with round bottom and single pointed top. There is a gap in the upper right of the line containing a circle with diameter equal to the line thickness.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

Quansight engineers have implemented several new kernels for matrix multiplication involving sparse
and dense arguments. These implementations, available in PyTorch 2.1, offer a significant
<<<<<<< HEAD
performance improvement over those available in previous versions of PyTorch.
=======
performance improvement over those available in previous versions of PyTorch. In addition, they have
the unique property that they are implemented using `triton`, however they are not the product of
`torch.compile`.

> > > > > > > 95e8e34 (Changes to make consulting blog build locally:)

In this post, we will discuss the results of this work and how it can be used.

## Sparse Layouts in PyTorch

PyTorch implements a total of 5 sparse layouts. Each layout has properties which make it more, or
less, suitable for a particular task. As an example, the coordinate format ([COO][pytorch-docs-coo])
can be used to incrementally build sparse tensors, with features allowing for individual element
<<<<<<< HEAD
access and updates to be more efficient. However for most mathematical operations [compressed
layouts][pytorch-docs-compressed], like compressed sparse row ([CSR][pytorch-docs-csr]), are a
better choice since they store specified elements with a more regular structure. This is what a
PyTorch tensor looks like using the CSR layout
=======
access and updates to be more efficient. However for most mathematical operations
[compressed layouts][pytorch-docs-compressed], like compressed sparse row
([CSR][pytorch-docs-csr]), are a better choice since they store specified elements with a more
regular structure. This is what a PyTorch tensor looks like using the CSR layout

> > > > > > > 95e8e34 (Changes to make consulting blog build locally:)

```python
>>> mat = torch.tensor([
    [0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0],
])
>>> mat.to_sparse_csr()
tensor(crow_indices=tensor([0, 1, 4, 5, 5, 8, 8]),
       col_indices=tensor([2, 0, 2, 4, 3, 0, 1, 4]),
       values=tensor([1, 1, 1, 1, 1, 1, 1, 1]),
       size=(6, 6),
       nnz=8,
       layout=torch.sparse_csr)
```

The block sparse row ([BSR][pytorch-docs-bsr]) layout is closely related to CSR, except that blocks
of values are stored. This affords many of the same advantages as the CSR layout, with the
additional feature that we can use vectorized instructions inside kernels operating on the values
Reusing the example above with the BSR layout we can see the similarities are clear

```python
>>> mat.to_sparse_bsr((2, 2))
tensor(crow_indices=tensor([0, 3, 4, 6]),
       col_indices=tensor([0, 1, 2, 1, 0, 2]),
       values=tensor([[[0, 0],
                       [1, 0]],
                        ...
                      [[1, 0],
                       [0, 0]]]),
      size=(6, 6), nnz=6, layout=torch.sparse_bsr)
```

There are some drawbacks to a block sparse layout; a key disadvantage is that we must fully
materialize a block if any value within it is non-zero. Larger blocks are generally better for
vectorized operations, but may lead to more zero-valued elements being stored. The example we have
used here demonstrates this well. In [Figure-1][#fig-1], we have this matrix with non-zero values in
yellow, and the 2x2 block size shown with the red grid. The large number of red blocks that contain
mostly zero values illustrates this matrix would be an example where BSR is less memory efficient.

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/blocksparse_2x2_matplot.png"
    name="fig-1"
    alt="A 6x6 grid of colored squares, zero and non-zero values indicated by color. Overlaid is a
    grid segregating the matrix into 9 2x2 blocks."
/>

## Matrix Multiplication with Sparse Tensors

In PyTorch, dense matrix multiplication in eager mode will usually forward to a high performance
math library (i.e. cuBLAS) that implements the [`GEMM`][cublas-docs-gemm] algorithm. Once we start
to involve sparse tensors the situation becomes more complex. We must have a different `GEMM`-like
operation for every pattern of sparse/dense arguments. Here we will focus on two forms involving
exactly one sparse argument:

- `C(Dense) += A(Sparse) @ B(Dense)` or **DSD**
- `C(Sparse) += A(Dense) @ B(Dense)` or **SDD**

where `@` is used to represent the matrix multiplication operation.

The DSD pattern is an operation with the same semantics as a dense matrix multiplication. If the
sparse argument were converted to dense, or all implicit zeros were materialized, the result should
be equivalent. The DSD pattern can be used to compute linear layers with sparse weights. This is a
function which is semantically equivalent to [`F.linear`][pytorch-docs-linear]

```python
def linear(x, W, b=None):
    tmp = (W @ x.mT).mT
    if b is not None:
        return tmp + b
    else:
        return tmp
```

In this case, the weights `W` can be stored using a BSR layout, provided the DSD matrix multiply is
supported. Note that `linear` is defined by `x@W^T` and above we have calculated the transpose of this
expression.

In contrast, the SDD pattern is not semantically equivalent to the dense-to-dense `GEMM`. In this
case the sparse tensor updated with the result of `A@B` also acts as a mask. In other words, the `C`
will keep its sparsity pattern, and this will be imposed on `A@B`. In PyTorch, we call this
operation [`torch.sparse.sampled_addmm`][pytorch-docs-sampled-addmm]. This operation is particularly
relevant for transformer models. It can be used to compute masked gradients for terms like `linear`
where during training we want to ensure that the sparsity pattern of `W` is preserved.

There exist BLAS-like libraries supporting sparse layouts, for example NVIDIA's
[cuSPARSE][cusparse-docs], and Intel's [MKL sparse API][mkl-docs-sparse-blas] . These options are
lacking some important features that are needed to make it practical to use sparse layouts in
machine learning applications. First, they typically perform poorly compared to dense matrix
multiply except when the sparsity is very high (&lt;<10% of the elements are specified). Second, many
of the operations are missing support for half precision data types, which is a feature used
frequently in learning applications.

In order to overcome the limitations, we have explored using the [Triton][triton] compiler to author
kernels. The `torch.compile` system introduced in PyTorch 2.0 uses Triton to generate GPU kernels.
We now have prototype implementations for `DSD` and `SDD` matrix multiplication using BSR layout
available in PyTorch 2.1.

## Benchmarks

We have evaluated the performance of new kernels. The performance is measured by speedup compared to
the dense implementation. Whenever the functionality exists in both pytorch 2.1 and 2.0, we show the
metrics for both versions. All experiments are performed on a single NVIDIA A100-80G GPU, using CUDA 11.8. We evaluated kernels using 2-dimensional tensors with
shape `(n, n)` (`n`=4096) for all tensor arguments. We report performance at different Sparsity (%).
This metric describes the fraction of elements which are implicitly zero, so a tensor with 90%
sparsity contains only 10% of the values compared to a dense tensor with the same shape.

### `sampled_addmm` (SDD)

Strictly speaking, a dense equivalent would involve the composition between matrix
multiplication and a masking operation. Here, we have chosen for the dense baseline a normal matrix
multiplication without masking since, in practice, the masking operation may not be used if the
inputs are not sparse, for example, when computing gradients. This gives us a harder target to hit,
but is a fair assessment.

A key detail on these figures is the sparsity ratio (horizontal axis) where the speedup (vertical
axis) crosses the 1.0 threshold, which is marked with a horizontal line labeled "1x". At this point
the sparse operation executes faster than the dense baseline. This quantity tells us how much
do we need to be able to prune to use sparsity without our model executing more slowly. Looking at
the results for [`float32`][#fig-2] data type,

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/sampled_addmm_float32_vs_dense.png"
    name="fig-2"
    alt="A plot displaying sparsity ratio (as a percentage) on the horizontal axis, and speedup over
    the dense baseline on the vertical.  There is a horizontal line marking the speedup ratio of 1.0
    above which the sparse subject takes less time to execute than the dense counterpart.  Three lines are
    plotted indicating block sizes used for the sparse tensor of 16, 32, and 64."
/>

we see some promising results. Using block sizes of 32 and 64, we cross the 1x threshold below 70%
sparsity. However, the smallest block size of 16 requires 90% sparsity to pass 1x. The small
block size is important as it offers more flexibility in the pruning stage as non-zero values can be
more dispersed, usually resulting in less accuracy loss.

Moving on to [half precision data types][#fig-3], we see much poorer performance compared to dense,
with the 1x threshold crossed only with the largest block size (64) and a sparsity greater than
90%. Requiring pruning to this degree is not practical. In most cases, pruning to this level will
result in unacceptable drops in accuracy.

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/sampled_addmm_half_vs_dense.png"
    name="fig-3"
    alt="A plot displaying sparsity ratio (as a percentage) on the horizontal axis, and speedup over
    the dense baseline on the vertical.  There is a horizontal line marking the speedup ratio of 1.0
    above which the sparse subject takes less time to execute than the dense counterpart.  Three lines are
    plotted indicating block sizes used for the sparse tensor of 16, 32, and 64."
/>

These results, albeit promising show there is still room for improvement. It is exciting to support
BSR layout for this operation, and we will continue to improve `sampled_addmm` as we work to make
sparsity a practical technique for transformer acceleration.

**Note**: Although cuSPARSE has added better support for this operation with BSR layout in CUDA 12,
we do not expose that interface in PyTorch yet.

### `bsr_dense_addmm` (DSD)

The DSD pattern has a direct translation to a dense matrix multiply, so here the experimental setup
does not require as much explanation. However, support for this type of sparse-dense matrix
multiplication already exists within PyTorch. In PyTorch 2.0 `BSR @ Dense` multiplication would
forward to cuSPARSE for float32, and to a custom implementation for half precision types. Here we
compare to both the dense baseline and these older implementations of the same operation.

Again, we will look at the performance for [`float32`][#fig-4] first. The plot compares the new
triton-based implementation to the one available in older versions of PyTorch. The triton backed
kernels show significant improvements over the previous version. A speedup near 2x is observed at
sparsity ratios near 50%. At high sparsity ratios, it exceeds 6x. This is a leap forward in terms of
raw sparse performance but we are primarily concerned with performance compared to the dense
baseline as this will determine if sparsity can be used without a performance penalty.

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/bsr_dense_mm_float32_vs_sparse.png"
    name="fig-4"
    alt="Two plots displaying sparsity ratio (as a percentage) on the horizontal axis, and speedup
    over the baseline on the vertical.  Three lines are plotted on both upper and lower plots
    indicating the block sizes used 16, 32, and 64."
/>

Comparison to the [dense baseline][#fig-5] is also very promising. Block sizes of 32 and 64 are
faster than dense for almost all sparsity ratios, and block size 16 crossing the 1x boundary at 70%
sparsity. The `float32` performance relative to the dense baseline for larger block sizes is
starting to approach ideal behavior. That is, when the sparse kernel does not have any overhead
associated with metadata lookups we could expect it to compute the result with a speedup
proportional to the inverse of the sparsity; at 80% sparsity only 1/5 of the tensor values are
specified and it should run about 5x faster. We are very close to this mark with ~3.5x and ~4.5x,
for block size 32 and 64 respectively.

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/bsr_dense_mm_float32_vs_dense.png"
    name="fig-5"
    alt="A plot displaying sparsity ratio (as a percentage) on the horizontal axis, and speedup over
    the dense baseline on the vertical.  There is a horizontal line marking the speedup ratio of 1.0
    above which the sparse subject takes less time to execute than the dense counterpart.  Three lines are
    plotted indicating block sizes used for the sparse tensor of 16, 32, and 64."
/>

Now we look at the performance for half precision data types. The new kernel provides between 20-50x
speedup over the [older sparse implementation][#fig-6]. While a speedup of this size is always a
notable result, we have known that the implementation supporting half precision data types would not
be optimal. However, as cuSPARSE did not support these data types a working implementation was
created by composing calls into the dense kernel for each sparse block. This approach suffers from a
significant penalty due to launching many CUDA kernels.

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/bsr_dense_mm_half_vs_sparse.png"
    name="fig-6"
    alt="A plot displaying sparsity ratio (as a percentage) on the horizontal axis, and speedup over
    the older sparse implementation on the vertical.  Three lines are plotted indicating block sizes
    used for the sparse tensor of 16, 32, and 64."
/>

Comparing performance for half precision to the [dense baseline][#fig-7] we see a clear win.
Using a block size of 64, the triton implementation begins to outperform the dense matrix multiply
at 60% sparsity. Unfortunately, this does not hold for smaller block sizes with 32 reach >1x
speedup above 80% sparsity, and block size 16 only passing this point above 90%.

<img src="posts/improvements-to-bsr-matrix-multiplication-in-pytorch/bsr_dense_mm_half_vs_dense.png"
    name="fig-7"
    alt="A plot displaying sparsity ratio (as a percentage) on the horizontal axis, and speedup over
    the older sparse implementation on the vertical.  There is a horizontal line marking the speedup
    ratio of 1.0 above which the sparse subject takes less time to execute than the dense
    counterpart.  Three lines are plotted indicating block sizes used for the sparse tensor of 16,
    32, and 64."
/>

We are encouraged by these results, but again there is more work to do. In particular, half
precision data types are lagging behind. Significant engineering efforts have gone into making the
cuBLAS dense matrix multiplication optimized for this case. Our team is up for the challenge and
will continue to close the gap for the sparse kernels provided by PyTorch!

## Try it out!

These kernels are not yet considered stable, and only some of the functionality is available through
PyTorch operators. They can all be found in the `torch.sparse._triton_ops` private submodule,
for the curious user who wants to experiment with these tools.

If you want to stick to the public features only, the `bsr_dense_mm` kernel is also fully integrated
with matrix multiply ops like `torch.mm` and `torch.addmm`. If you meet the following conditions:

- The RHS of the matrix multiply or `A` in `A@B`, `torch.mm(A, B)`, or `torch.addmm(C, A, B)` has
  BSR layout, and other tensors are dense.
- The device type is `cuda`
- The data type is `torch.float16`, or `torch.bfloat16`

then the work will be forwarded to the triton kernel!

## Conclusion

We have made some serious improvements to the usability of key features for BSR, but we are not
quite finished yet. These are only the first steps toward a larger goal, namely, making block sparse
layouts a first class technique for accelerating transformer workflows. With PyTorch 2.1 coming out,
it is a good time to take stock of where we are at, and we have come a long way, but there is plenty
of work left to do. We hope to improve on these kernels and add more in the upcoming months. We are
also working to enable pathways such that masking behavior for gradients can be accessed without
writing a custom autograd function or module.

This work would not have been possible without the close collaboration between Quansight, and Meta
within the PyTorch project. We thank Christian Puhrsch, Alban Desmaison, and Driss Guessous for
their support and feedback during research and implementation, and their continued support moving
forward.

[pytorch-docs-coo]: https://pytorch.org/docs/stable/sparse.html#sparse-coo-tensors
[pytorch-docs-compressed]: https://pytorch.org/docs/stable/sparse.html#sparse-compressed-tensors
[pytorch-docs-csr]: https://pytorch.org/docs/stable/sparse.html#sparse-csr-tensor
[pytorch-docs-bsr]: https://pytorch.org/docs/stable/sparse.html#sparse-bsr-tensor
[pytorch-docs-linear]: https://pytorch.org/docs/stable/generated/torch.nn.functional.linear
[pytorch-docs-sampled-addmm]: https://pytorch.org/docs/stable/generated/torch.sparse.sampled_addmm.html
[cusparse-docs]: https://docs.nvidia.com/cuda/cusparse/index.html
[triton]: https://openai.com/research/triton
[cublas-docs-gemm]: https://docs.nvidia.com/cuda/cublas/index.html#cublas-level-3-function-reference
[mkl-docs-sparse-blas]: https://www.intel.com/content/www/us/en/docs/onemkl/developer-reference-c/2023-2/inspector-executor-sparse-blas-execution-routines.html
