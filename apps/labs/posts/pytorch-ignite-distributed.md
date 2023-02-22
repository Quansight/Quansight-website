---
title: "Distributed Training Made Easy with PyTorch-Ignite"
author: victor-fomin
published: June 28, 2021
description: 'Writing agnostic distributed code that supports different platforms, hardware configurations (GPUs, TPUs) and communication frameworks is tedious. In this blog, we will discuss how PyTorch-Ignite solves this problem with minimal code change.'
category: [Machine Learning]
featuredImage:
  src: /posts/pytorch-ignite-distributed/ignite_logo_mixed.png
  alt: 'PyTorch-Ignite logo.'
hero:
  imageSrc: /posts/pytorch-ignite-distributed/ignite_logo_mixed.png
  imageAlt: 'PyTorch-Ignite logo.'
---

Authors: [François Cokelaer](https://github.com/fco-dv),
[Priyansi](https://github.com/Priyansi), [Sylvain
Desroziers](https://github.com/sdesrozis/), [Victor
Fomin](https://github.com/vfdev-5)

Writing [agnostic](https://en.wikipedia.org/wiki/Agnostic_(data))
[distributed
code](https://pytorch.org/tutorials/beginner/dist_overview.html) that
supports different platforms, hardware configurations (GPUs, TPUs) and
communication frameworks is tedious. In this blog, we will discuss how
[PyTorch-Ignite](https://pytorch.org/ignite/) solves this problem with
minimal code change.

**Contents**

- [Prerequisites](#prerequisites)
- [Introduction](#introduction)
- [🔥 Pytorch-Ignite Unified Distributed API](#-pytorch-ignite-unified-distributed-api)
  - [🔍 Focus on the helper `auto_*` methods:](#-focus-on-the-helper-auto_-methods)
- [Examples](#examples)
  - [PyTorch-Ignite - Torch native Distributed Data Parallel - Horovod - XLA/TPUs](#pytorch-ignite---torch-native-distributed-data-parallel---horovod---xlatpus)
- [Running Distributed Code](#running-distributed-code)
  - [With `torch.multiprocessing.spawn`](#with-torchmultiprocessingspawn)
  - [With Distributed launchers](#with-distributed-launchers)
    - [With torch.distributed.launch](#with-torchdistributedlaunch)
    - [With horovodrun](#with-horovodrun)
    - [With slurm](#with-slurm)
- [Closing Remarks](#closing-remarks)
  - [References](#references)
  - [Next Steps](#next-steps)


# Prerequisites

This blog assumes you have some knowledge about:

1.  [PyTorch's distributed
    package](https://pytorch.org/docs/stable/distributed.html#basics),
    the
    [backends](https://pytorch.org/docs/stable/distributed.html#backends)
    and [collective
    functions](https://pytorch.org/docs/stable/distributed.html#collective-functions)
    it provides. In this blog, we will focus on [distributed data
    parallel
    code](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html).
2.  [PyTorch-Ignite](https://pytorch.org/ignite/). Refer to this
    [blog](https://labs.quansight.org/blog/2020/09/pytorch-ignite/) for
    a quick high-level overview.

# Introduction

[PyTorch-Ignite's](https://github.com/pytorch/ignite)
[ignite.distributed](https://pytorch.org/ignite/distributed.html)
(`idist`) submodule introduced in version [v0.4.0 (July
2020)](https://github.com/pytorch/ignite/releases/tag/v0.4.0.post1)
quickly turns single-process code into its data distributed version.

Thus, you will now be able to run the same version of the code across
all supported backends seamlessly:

-   backends from native torch distributed configuration:
    [nccl](https://github.com/NVIDIA/nccl),
    [gloo](https://github.com/facebookincubator/gloo),
    [mpi](https://www.open-mpi.org/)
-   [Horovod](https://horovod.readthedocs.io/en/stable/) framework with
    `gloo` or `nccl` communication backend
-   XLA on TPUs via [pytorch/xla](https://github.com/pytorch/xla)

In this blog post we will compare PyTorch-Ignite's API with torch
native's distributed code and highlight the differences and ease of use
of the former. We will also show how Ignite's `auto_*` methods
automatically make your code compatible with the aforementioned
distributed backends so that you only have to bring your own model,
optimizer and data loader objects.

Code snippets, as well as commands for running all the scripts, are
provided in a separate
[repository](https://github.com/pytorch-ignite/idist-snippets).

Then we will also cover several ways of spawning processes via torch
native `torch.multiprocessing.spawn` and also via multiple distributed
launchers in order to highlight how Pytorch-Ignite's `idist` can handle
it without any changes to the code, in particular:

-   [torch.multiprocessing.spawn](https://pytorch.org/docs/stable/multiprocessing.html#torch.multiprocessing.spawn)
-   [torch.distributed.launch](https://pytorch.org/docs/stable/distributed.html#launch-utility)
-   [horovodrun](https://horovod.readthedocs.io/en/stable/running_include.html)
-   [slurm](https://slurm.schedmd.com/)

More information on launchers experiments can be found
[here](https://github.com/sdesrozis/why-ignite).

# 🔥 Pytorch-Ignite Unified Distributed API

We need to write different code for different distributed backends. This
can be tedious especially if you would like to run your code on
different hardware configurations. Pytorch-Ignite's `idist` will do all
the work for you, owing to the high-level helper methods.

## 🔍 Focus on the helper `auto_*` methods:

-   [auto_model()](https://pytorch.org/ignite/distributed.html#ignite.distributed.auto.auto_model)

This method adapts the logic for non-distributed and available
distributed configurations. Here are the equivalent code snippets for
distributed model instantiation:


<embed>
   <div>
      <table>
         <tr>
            <th style="text-align:center;">PyTorch-Ignite</th>
            <th style="text-align:center;">PyTorch DDP</th>
         </tr>
         <tr>
            <td colspan="2"> <img src="/posts/pytorch-ignite-distributed/ignite_vs_ddp_automodel.png"> </td>
         </tr>
         <tr>
            <td>&nbsp;</td>
         </tr>
         <tr>
            <th style="text-align:center;">Horovod</th>
            <th style="text-align:center;">Torch XLA</th>
         </tr>
         <tr>
            <td colspan="2"><img src="/posts/pytorch-ignite-distributed/horovod_vs_xla_automodel.png"> </td>
         </tr>
      </table>
   </div>
</embed>
| 

Additionally, it is also compatible with
[NVIDIA/apex](https://github.com/NVIDIA/apex)

``` python
model, optimizer = amp.initialize(model, optimizer, opt_level=opt_level)
model = idist.auto_model(model)
```

and [Torch native AMP](https://pytorch.org/docs/stable/amp.html)

``` python
model = idist.auto_model(model)

with autocast():
    y_pred = model(x)
```

-   [auto_optim()](https://pytorch.org/ignite/distributed.html#ignite.distributed.auto.auto_model)

This method adapts the optimizer logic for non-distributed and available
distributed configurations seamlessly. Here are the equivalent code
snippets for distributed optimizer instantiation:


<embed>
   <div>
      <table>
         <tr>
            <th style="text-align:center;">PyTorch-Ignite</th>
            <th style="text-align:center;">PyTorch DDP</th>
         </tr>
         <tr>
            <td colspan="2"> <img src="/posts/pytorch-ignite-distributed/ignite_vs_ddp_autooptim.png"> </td>
         </tr>
         <tr>
            <td>&nbsp;</td>
         </tr>
         <tr>
            <th style="text-align:center;">Horovod</th>
            <th style="text-align:center;">Torch XLA</th>
         </tr>
         <tr>
            <td colspan="2"><img src="/posts/pytorch-ignite-distributed/horovod_vs_xla_autooptim.png"> </td>
         </tr>
      </table>
   </div>
</embed>

| 

-   [auto_dataloader()](https://pytorch.org/ignite/distributed.html#ignite.distributed.auto.auto_dataloader)

This method adapts the data loading logic for non-distributed and
available distributed configurations seamlessly on target devices.

Additionally, `auto_dataloader()` automatically scales the batch size
according to the distributed configuration context resulting in a
general way of loading sample batches on multiple devices.

Here are the equivalent code snippets for the distributed data loading
step:


<embed>
   <div>
      <table>
         <tr>
            <th style="text-align:center;">PyTorch-Ignite</th>
            <th style="text-align:center;">PyTorch DDP</th>
         </tr>
         <tr>
            <td colspan="2"> <img src="/posts/pytorch-ignite-distributed/ignite_vs_ddp_autodataloader.png"> </td>
         </tr>
         <tr>
            <td>&nbsp;</td>
         </tr>
         <tr>
            <th style="text-align:center;">Horovod</th>
            <th style="text-align:center;">Torch XLA</th>
         </tr>
         <tr>
            <td colspan="2"><img src="/posts/pytorch-ignite-distributed/horovod_vs_xla_autodataloader.png"> </td>
         </tr>
      </table>
   </div>
</embed>


Note

Additionally, `idist` provides collective operations like `all_reduce`,
`all_gather`, and `broadcast` that can be used with all supported
distributed frameworks. Please, see [our
documentation](https://pytorch.org/ignite/distributed.html#ignite-distributed-utils)
for more details.

# Examples

The code snippets below highlight the API's specificities of each of
the distributed backends on the same use case as compared to the `idist`
API. PyTorch native code is available for DDP, Horovod, and for XLA/TPU
devices.

PyTorch-Ignite's unified code snippet can be run with the standard
PyTorch backends like `gloo` and `nccl` and also with Horovod and XLA
for TPU devices. Note that the code is less verbose, however, the user
still has full control of the training loop.

The following examples are introductory. For a more robust,
production-grade example that uses PyTorch-Ignite, refer
[here](https://github.com/pytorch/ignite/tree/master/examples/contrib/cifar10).

The complete source code of these experiments can be found
[here](https://github.com/pytorch-ignite/idist-snippets).

## PyTorch-Ignite - Torch native Distributed Data Parallel - Horovod - XLA/TPUs


<embed> 
   <div>
      <table>
         <tr>
            <th style="text-align:center; padding: 0;">
               <h3><b><u>PyTorch-Ignite</u></b></h3></th>
            <th style="text-align:center; padding: 0;">
               <h3><b><u>PyTorch DDP</u></b></h3></th>
         </tr>
         <tr>
            <td style="text-align:center; padding: 0;"> <a href="https://github.com/pytorch-ignite/idist-snippets/blob/master/ignite_idist.py"><h3>Source Code</h3></a> </th>
            <td style="text-align:center; padding: 0;"> <a href="https://github.com/pytorch-ignite/idist-snippets/blob/master/torch_native.py"><h3>Source Code</h3></a> </th>
         </tr>
         <tr>
            <td colspan="2"> <img src="/posts/pytorch-ignite-distributed/ignite_vs_ddp_whole.png"> </td>
         </tr>
         <tr>
            <th style="text-align:center;">
               <h3><b><u>Horovod</u></b></h3></th>
            <th style="text-align:center;">
               <h3><b><u>Torch XLA</u></b></h3></th>
         </tr>
         <tr>
            <td style="text-align:center;"> <a href="https://github.com/pytorch-ignite/idist-snippets/blob/master/torch_horovod.py"><h3>Source Code</h3></a> </th>
            <td style="text-align:center;"> <a href="https://github.com/pytorch-ignite/idist-snippets/blob/master/torch_xla_native.py"><h3>Source Code</h3></a> </th>
         </tr>
         <tr>
            <td> <img src="/posts/pytorch-ignite-distributed/horovod_whole.png"> </td>
            <td> <img src="/posts/pytorch-ignite-distributed/xla_whole.png"> </td>
         </tr>
      </table>
   </div>
</embed>


Note

You can also mix the usage of `idist` with other distributed APIs as
below:

``` python
dist.init_process_group(backend, store=..., world_size=world_size, rank=rank)

rank = idist.get_rank()
ws = idist.get_world_size()
model = idist.auto_model(model)

dist.destroy_process_group()
```

# Running Distributed Code

| PyTorch-Ignite's `idist` also unifies the distributed codes launching
  method and makes the distributed configuration setup easier with the
  [ignite.distributed.launcher.Parallel (idist
  Parallel)](https://pytorch.org/ignite/distributed.html#ignite.distributed.launcher.Parallel)
  context manager.
| This context manager has the capability to either spawn
  `nproc_per_node` (passed as a script argument) child processes and
  initialize a processing group according to the provided backend or use
  tools like `torch.distributed.launch`, `slurm`, `horovodrun` by
  initializing the processing group given the `backend` argument only in
  a general way.

## With `torch.multiprocessing.spawn`

In this case `idist Parallel` is using the native torch
`torch.multiprocessing.spawn` method under the hood in order to run the
distributed configuration. Here `nproc_per_node` is passed as a spawn
argument.

-   Running multiple distributed configurations with one code. Source:
    [ignite_idist.py](https://github.com/pytorch-ignite/idist-snippets/blob/master/ignite_idist.py):

``` bash
# Running with gloo
python -u ignite_idist.py --nproc_per_node 2 --backend gloo

# Running with nccl
python -u ignite_idist.py --nproc_per_node 2 --backend nccl

# Running with horovod with gloo controller ( gloo or nccl support )
python -u ignite_idist.py --backend horovod --nproc_per_node 2

# Running on xla/tpu
python -u ignite_idist.py --backend xla-tpu --nproc_per_node 8 --batch_size 32
```

## With Distributed launchers

PyTorch-Ignite's `idist Parallel` context manager is also compatible
with multiple distributed launchers.

### With torch.distributed.launch

Here we are using the `torch.distributed.launch` script in order to
spawn the processes:

``` bash
python -m torch.distributed.launch --nproc_per_node 2 --use_env ignite_idist.py --backend gloo
```

### With horovodrun

``` bash
horovodrun -np 4 -H hostname1:2,hostname2:2 python ignite_idist.py --backend horovod
```

Note

In order to run this example and to avoid the installation procedure,
you can pull one of PyTorch-Ignite's [docker image with pre-installed
Horovod](https://github.com/pytorch/ignite/blob/master/docker/hvd/Dockerfile.hvd-base).
It will include Horovod with `gloo` controller and `nccl` support.

``` bash
docker run --gpus all -it -v $PWD:/project pytorchignite/hvd-vision:latest /bin/bash
cd project
```

### With slurm

The same result can be achieved by using `slurm` without any
modification to the code:

``` bash
srun --nodes=2
     --ntasks-per-node=2 
     --job-name=pytorch-ignite 
     --time=00:01:00  
     --partition=gpgpu 
     --gres=gpu:2
     --mem=10G 
     python ignite_idist.py --backend nccl
```

or using `sbatch script.bash` with the script file `script.bash`:

``` shell
#!/bin/bash
#SBATCH --job-name=pytorch-ignite
#SBATCH --output=slurm_%j.out
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=2
#SBATCH --time=00:01:00
#SBATCH --partition=gpgpu
#SBATCH --gres=gpu:2
#SBATCH --mem=10G

srun python ignite_idist.py --backend nccl
```

# Closing Remarks

As we saw through the above examples, managing multiple configurations
and specifications for distributed computing has never been easier. In
just a few lines we can parallelize and execute code wherever it is
while maintaining control and simplicity.

## References

-   [idist-snippets](https://github.com/pytorch-ignite/idist-snippets/):
    complete code used in this post.
-   [why-ignite](https://github.com/sdesrozis/why-ignite): examples with
    distributed data parallel: native pytorch, pytorch-ignite, slurm.
-   [CIFAR10
    example](https://github.com/pytorch/ignite/tree/master/examples/contrib/cifar10)
    of distributed training on CIFAR10 with muliple configurations: 1 or
    multiple GPUs, multiple nodes and GPUs, TPUs.

## Next Steps

-   If you want to learn more about PyTorch-Ignite or have any further
    queries, here is our [GitHub](https://github.com/pytorch/ignite),
    [documentation](https://pytorch.org/ignite/) and
    [Discord](https://discord.com/invite/djZtm3EmKj).
-   PyTorch-Ignite is currently maintained by a team of volunteers and
    we are looking for more contributors. See
    [CONTRIBUTING.md](https://github.com/pytorch/ignite/blob/master/CONTRIBUTING.md)
    for how you can contribute.
-   Keep updated with all PyTorch-Ignite news by following us on
    [Twitter](https://twitter.com/pytorch_ignite) and
    [Facebook](https://facebook.com/PyTorch-Ignite-Community-105837321694508).
