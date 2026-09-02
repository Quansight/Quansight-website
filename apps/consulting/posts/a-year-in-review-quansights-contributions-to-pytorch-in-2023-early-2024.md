---
title: 'A Year in Review: Quansight’s Contributions to PyTorch in 2023 (& Early 2024)'
published: September 11, 2024
authors: [andrew-james]
description: '2023 will be remembered as the year when AI and LLMs took the world by storm. PyTorch took center stage during this revolution due to the rise of torch.compile. The combination of having a fully flexible eager execution model, paired with a compiler with a rather flexible tracer that is able to understand complex Python programs semantically, has certainly been one of the core components fueling these advances.'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/a-year-in-review-quansights-contributions-to-pytorch-in-2023-early-2024/1_VSQ0XEywxSgZBwW05GsZtw.png
  alt: 'PyTorch logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'A Year in Review: Quansight’s Contributions to PyTorch in 2023 (& Early 2024)'
---

2023 will be remembered as the year when AI and LLMs took the world by storm. PyTorch took center stage during this revolution due to the rise of `torch.compile`. The combination of having a fully flexible eager execution model, paired with a compiler with a rather flexible tracer that is able to understand complex Python programs semantically, has certainly been one of the core components fueling these advances.

In this post, we’ll go over different parts of the stack that make up `torch.compile` and different features that Quansight engineers have implemented this year, helping Meta engineers make `torch.compile` as fast, resilient, and flexible as it is today.

## A Radiography of torch.compile

torch.compile‘s[[1]](#Footnotes) value proposition is quite simple: Tag your model with `@torch.compile`, and your program will run faster.

This is quite an ambitious proposal. In a PyTorch model, you may have many different PyTorch operations scattered around your own code and other library code. Also, you may use external libraries like NumPy to perform some computations. Finally, you might use advanced Python constructions like generators or metaclasses to organize your code better. The implementation of models, and even more so modern ones, can be rather complex, so how does torch.compile achieve this?

![PyTorch Year in Review: Schematic showing the various layers of torch.compile and how a model is represented by each](/posts/a-year-in-review-quansights-contributions-to-pytorch-in-2023-early-2024/1_8rGO7TP6jQkgYXkntcjDAg.webp)

In this image, we see that `torch.compile` follows a three-step pipeline:

1. Dynamo: It is a Python tracer that symbolically executes the function and records the PyTorch functions that were executed into a list.
2. AOTAutograd: Takes this list and decomposes it into simpler operations (relu into max in the picture above). It also records the backward operations into the graph, hence the name.
3. Inductor: The compiler. It takes the output of AOTAutograd and figures out how to generate fast vectorized and parallelized C++ code for CPU and [Triton](https://github.com/triton-lang/triton) code for GPUs.

So, in plain words:

1. Dynamo crawls the model by emulating CPython’s execution and finds all the PyTorch computations, and stores it into a list (a linear graph of functions).
2. This graph is passed on to AOTAutograd, which simplifies it into a set of about 200 core operations.
3. Finally, Inductor generates the relevant code.

Now that we have some basic understanding of the parts that compose `torch.compile`, let’s delve into some of the most notable contributions that Quansight has made to these.

## Dynamo: The Python Tracer

**Library Support** Dynamo symbolically executes Python code and finds calls to PyTorch functions, and stores them in a graph. Now, there are many functions and external libraries that are not written in Python but are written as C-extensions of Python. As such, we cannot just simply expect Dynamo to be able to understand them. One line of work in Dynamo is to teach it how to handle new functions.

Quansight has helped to do so for three commonly used libraries:

- [NumPy](https://pytorch.org/docs/main/torch.compiler_faq.html#does-numpy-work-with-torch-compile)
- [torch.func](https://pytorch.org/docs/main/torch.compiler_faq.html#does-torch-func-work-with-torch-compile-for-grad-and-vmap-transforms)
- [TorchVision](https://pytorch.org/vision/stable/index.html)

**Composability** Even more interesting, perhaps, is that all these features can be mixed with the other features from PyTorch, like GPU execution or gradient computation, allowing you to [compute gradients through NumPy code](https://pytorch.org/docs/main/torch.compiler_faq.html#can-i-execute-numpy-code-on-cuda-and-compute-gradients-via-torch-compile) or execute it on GPU. Even features from torch.func can compose with NumPy support under `torch.compile`. For example, you can [vmap over your NumPy program!](https://github.com/pytorch/pytorch/issues/113751#issuecomment-1813213001)

**Tutorials** We mentioned in the previous section that Dynamo’s job is to trace through a model given some inputs and output a graph of the functions that were called. Well, this is just part of it. In reality, it also collects the necessary preconditions (a.k.a. guards) under which the graph can be reused, performs logical inference over these, and when it encounters a situation that is unsupported, it will fall back to eager execution. To learn about all these and more, you can read this [Dynamo introduction](https://pytorch.org/docs/main/torch.compiler_dynamo_overview.html). If you want to go even further, Quansight engineers put together a [Dynamo Deep-dive](https://pytorch.org/docs/main/torch.compiler_dynamo_deepdive.html) where we go into the details on how this part of `torch.compile` is implemented.

**Python Support** Dynamo symbolically executes a Python program, similar to CPython. Knowing this is easier said than done should not come as a surprise. Quansight engineers have helped extend Dynamo’s support for different Python features. In particular, they implemented generic support for dictionaries and pytree structures.

**Correctness** Integrating many different subsystems into a large system is often quite difficult to do correctly, even more so when there is some global state. This is no different in Dynamo. Dynamo tries to simplify symbolic expressions, trying to see when a set of symbolic expressions (axioms) implies a new one. This is a very difficult problem in general, so PyTorch implements a number of hand-written rules to try to make this problem tractable. Quansight engineers implemented a system that, using a theorem prover, would mathematically prove that these simplifications are indeed mathematically sound. They also added a full subsystem to debug errors emanating from these, which tend to be particularly challenging to debug.

## AOTAutograd: The C++ Tracer

Ahead of Time Autograd (AOTAutograd for short) takes the output graph from Dynamo. It does a number of things, like decomposing the graph given by Dynamo into simpler operations or computing the backward graph associated with it. For an introduction, see [this comment](https://dev-discuss.pytorch.org/t/how-does-torch-compile-work-with-autograd/1621/2) and the conversation underneath[[2].](#Footnotes)

**Decompositions** Quansight engineers took on the task of comprehensively implementing the remaining decomposition rules from complex operations into simpler ones, in a way that the compiler is able to generate efficient code. The vast majority of operations now have these rules defined, and improvements/simplifications continue to be made!

**Performance** Optimizations AOTAutograd is run on every compilation. As such, it is important for it to be fast enough so that it does not become the bottleneck of the computation. Quansight engineers identified a number of optimization opportunities that yielded a 10% speedup of torch.compile when using symbolic shapes (the default mode).

## Inductor: The Generic Compiler

Inductor is the actual compiler behind torch.compile. After Dynamo has captured the graph and AOTAutograd has simplified it, Inductor has the task of generating efficient code from this sequence of operations. Inductor implements a number of simplification passes, canonicalizing some sets of operations into others that are easier to process and computing ancillary information that will be later used to make some decisions.

**Indirect Indexing** Advanced indexing of the form `t[idx]` where `idx` is a tensor of indices is a rather common pattern in PyTorch, used to implement pooling operations or just rearrange a tensor. This is also called indirect indexing, as the indices are not static but come from a tensor. Quansight engineers have implemented a number of compiler passes that optimize this pattern:

- **Better Codegen:** Improved indirect indexing performance at large, improving the performance of some models by 10%.
- **Constant Propagation:** We perform aggressive constant propagation to turn indirect indexing into direct indexing when the inputs to the indirect indexing are statically known.
- **Index Wrapping:** We implemented index wrapping so that negative indices are properly wrapped.
- **Out-of-bounds Checks:** We codegen checks that ensure the indices are within bounds and avoid out-of-bounds reads and writes.
- **Value Range Analysis:** We implemented a value range analysis. This provides every scalar variable with a (potentially pessimistic) range of values that it may take. We use this to elide the wrapping and the out-of-bounds checks whenever we can prove that the variable is within bounds. This is now used throughout torch.compile as a tool to perform reasoning on different symbolic expressions.

**Welford Reduction** We implemented codegen to compute the mean and the variance (as used in BatchNorm) in one go via the Welford algorithm.

**Associative Scans** Associative scans similar to computing a cumulative sum were popularized by State Space Models (SSMs) like Mamba. The initial Mamba implementation was done in pure CUDA, leveraging CUB. Quansight implemented a generic `associative_scan` that takes an arbitrary associative pointwise function to allow the implementation of Mamba and generic SSMs in pure Python via `torch.compile.`

**Others** Other notable contributions were a reinplacement pass for scatter ops, which improved x2 the performance of llama inference on CPU; a generalized fusion algorithm for CPU, a fix for a catastrophic cancellation issue caused by the use of FMA operations by LLVM within softmax, and an lowering pathway allowing small-int indices to be stored for computing the derivatives of max-pool.

## Triton: The GPU Compiler

Quansight engineers had to go to an even lower level to fix some problems or propose new solutions to existing ones. [Triton](https://github.com/triton-lang/triton) is a GPU compiler that allows you to write efficient GPU code in a simple NumPy-like syntax. `torch.compile` generates Triton code when targeting the `device="cuda"`.

**Generic Reductions** We implemented a generic `tl.reduce` function that takes a lambda function with an associative operator as an input, and performs the reduction. This enabled the implementation of the Welford reduction discussed in the previous section.

**3xtf32 Optimization** For the last few generations, NVIDIA GPUs have had dedicated silicon to perform the very common matrix multiplication operation. These are called Tensor Cores. Tensor Cores do not natively support `float32`; they just support a lower-precision version called tf32. To compensate for this, CUTLASS engineers proposed a trick whereby, using 3 `tf32` multiplications, one could get better accuracy than `float32` and about a 2x speedup over the non-Tenor Core implementation. Quansight engineers implemented this trick natively in Triton.

**Support Multiple Inputs in Associative Scans**`tl.associative_scan` was implemented already accepting an associative operation as an input, but it had the limitation that this operation had to be a scalar operator. Quansight engineers generalized this to support operations that take multiple inputs and outputs to allow for the implementation of ops like `torch.cummax`.

**Assorted Optimizations** Quansight engineers improved several compiler passes within triton to speed up the codegen triton has for Welford reductions and for tl.device_assert used for the out-of-bound checks discussed above.

The foundation for all of the wonderful improvements that `torch.compile` has brought is the same PyTorch we have known for years, and work continues to maintain and improve these core systems. Feature development, performance optimization, and better engineering projects are still ongoing, with Quansight involved in a few key areas.

## Sparsity

PyTorch implements a variety of sparse layouts. Each layout represents a tensor, storing the values which are non-zero, in different ways. Using a sparse layout in the right situation can significantly reduce the memory required to store the weights of a model and, paired with well-engineered kernels, can also increase the computational performance of a model.

**Block-Sparse Matrix Multiply** A great balance of memory efficiency and computational performance can be found in block-sparse layouts[[3]](#Footnotes). We implemented [new kernels](https://quansight.com/post/pytorch-2-1-quansights-improvements-to-bsr-sparse-matrix-multiplication/) for block-sparse matrix multiply using Triton, which has over 10x performance improvement compared with the previous cuSPARSE backend and over 4x improvement over dense cuBLAS. Quansight engineers co-authored this [blog post](https://pytorch.org/blog/speeding-up-vits/) demonstrating the use of sparsity to achieve speedup without significant accuracy loss in a real application of vision transformers.

**S\*\***emi-Structured Sparsity\*\* This is a unique sparse layout that relies on hardware support. NVIDIA’s [Sparse Tensor Cores](https://developer.nvidia.com/blog/accelerating-inference-with-sparsity-using-ampere-and-tensorrt/) support a fine-grained sparsity pattern where a contiguous block of 4 values has only two non-zero. We worked to integrate kernels from CUTLASS into PyTorch, as well as the APIs for compression/decompression of tensors for structured sparsity.

## CUTLASS

[CUTLASS](https://github.com/nvidia/CUTLASS) is a C++ template library that allows the authoring of fast CUDA kernels and takes advantage of some of the latest hardware features of NVIDIA GPUS. Building off of the work integrating support for structured sparsity, Quansight continued working to bring features powered by CUTLASS to PyTorch.

**Mixed-Dtype Matrix Multiply** The majority of matrix multiply kernels in PyTorch expect inputs to have the same data type. However, supporting mixed width data types is important for quantization strategies where 8-bit integer weights and 16-bit floating point activations can be used together. We have worked to build on this to support additional data types and contribute new kernels to support different different widths.

**Inductor Support** Several of these features have also been added to the torch.compile execution pathway by adding codegen templates to inductor. This allows the compiler to generate a bespoke kernel on the fly, including epilogue fusion for your models using semi-structured sparsity.

## Torch Internals

PyTorch is well known for doing fast multi-dimensional array computations, automatic differentiation, supporting multiple device backends, and, of course, now an optimizing compiler. However, there is a vast library of internal systems that makes all of those things work and work well together supporting these user-facing features. Most won’t see these things if they aren’t working inside PyTorch, but we can take a quick peek under the hood to talk about some of the improvements made here.

**PyObject Preservation** Managing the lifetime of a PyTorch object is quite complex[[4]](#Footnotes). There is a reference counted `PyObject` owning a reference to a reference counted C++ object; sometimes, the C++ object needs to outlive the Python object, and sometimes it will be passed back to Python, allowing it to be resurrected. Tensor objects implement the PyObject Preservation pattern to support all these scenarios while allowing properties like subclass information, and dynamic attributes to be preserved. Tensor objects have supported this, but new needs motivated applying the pattern to Storage objects (how we represent the memory blob backing a tensor). Our team worked on this feature. If you are interested, this is not specific to PyTorch, and this [stand-alone repo](https://github.com/kurtamohler/pyobject-preservation) demonstrates how the pattern can be applied anywhere.

**Copy on Write (COW) Storage** PyTorch has several operators which conditionally return a view or copy. Take torch.resize, for example, will return a view if it can represent the result with regular strides, but in some cases, that is impossible (try to flatten out the transpose of a contiguous matrix). In these cases, a copy of the input is created with the new shape. In the age of torch.compile this is kind of unfortunate as it makes it difficult to predict the stride of an output from this operation. Instead, a future version of PyTorch will always create a copy, but to avoid any necessary overhead, that copy will be delayed until needed. The copy is needed when you try to write to the new tensor since a view would have the exact same observable behavior until one or the other is updated, hence the name. In PyTorch, Storage objects are referred to by tensors since many tensors can view or alias the same memory, so this is implemented at that level, rather than a modification on the Tensor object itself. Engineers from Quansight have added the COW Storage and are currently working on a simulation mode which will surface intelligent warnings when a program will have different behavior after the change goes through. This is critical since backward compatibility is not something that PyTorch breaks often, so the timeline for activating the change will begin once we have an adequate warning system in place.

## PyTorch Conference 2023

The last PyTorch conference had a strong representation from Quansight as a Platinum Sponsor. Mario Lezcano was invited to give one of the opening keynotes of the conference, showcasing the NumPy support within `torch.compile` implemented by Quansight engineers. We also presented two posters in the poster session, delving into the details of some of the features discussed above.

This was also a fantastic time to catch up with our Meta colleagues and a number of other consistent PyTorch contributors. We are attending again in 2024, so look for our booth and come say hi!

## Conclusion

This year’s post was a bit more technical than those of previous years[[5]](#Footnotes) since PyTorch has moved to the development of `torch.compile`, whose development, as that of any compiler, tends to be a bit more complex in nature. That being said, we hope this post helps showcase the type of work that’s performed by our engineers.

All this would not have been possible without the contributions from our fantastic team of PyTorch and ecosystem contributors: Peter Bell, Mario Lezcano, Andrew James, Pearu Peterson, Aleksandar Samardžić, Guilherme Leobas, Victor Fomin, Isuru Fernandez, Yukio Siraichi, Kurt Mohler, Philip Meier, Evgeni Burovski, and Kshiteej Kalambarkar.

The other part of the story comes from the great team of PyTorch and TorchVision engineers at Meta. Without their dedication and openness to collaboration, this work would not have been possible. In particular, we would like to thank Alban Desmaison, Edward Yang, Nikita Shulga, Richard Zou, Brian Hirsh, Christian Puhrsch, Jane Xu, Joel Schlosser, Nicolas Hug, Vincent Moens, Horace He, Michael Lazos, Elias Ellison, Shunting Zhang, Yanbo Liang, Bin Bao, Jason Ansel, Joe Isaacson, Peng Wu, Gregory Chanan, and Soumith Chintala. Thank you all for making this collaboration so fruitful and enjoyable.

## Footnotes

1. In this post, we are going to talk a fair bit about torch.compile. If you have never heard about it, consider reading [the following tutorial](https://pytorch.org/docs/main/torch.compiler_get_started.html) first. [↩︎](#1)
2. Much of this work is bleeding edge and rapidly evolving, and unfortunately, the internals of AOTAutograd have not yet been thoroughly documented… yet! [↩︎](#2)
3. The introduction of the [blog post](https://quansight.com/post/pytorch-2-1-quansights-improvements-to-bsr-sparse-matrix-multiplication/) goes into some detail on the different types of sparsity implemented in PyTorch. [↩︎](#3)
4. PyTorch Maintainer Ed Yang discusses this concept at length in this [excellent episode](https://pytorch-dev-podcast.simplecast.com/episodes/pyobject-preservation-q6sE1n7z) of the PyTorch Dev Podcast. [↩︎](#4)
5. Check out Quansight contributions to PyTorch in [2022](https://quansight.com/post/a-year-in-review-quansights-contributions-to-pytorch-in-2022/) and [2021](https://quansight.com/post/a-year-in-review-quansights-contributions-to-pytorch-in-2021/) if you missed them. [↩︎](#5)
