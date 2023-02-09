---
title: "Working with pytest on PyTorch"
author: philip-meier
published: Jun 23, 2021
description: 'PyTorch has an extensive test suite with a lot of configuration options and auto-generated tests. Internally, PyTorch uses a TestCase class that is derived from unittest.TestCase. In the first part of the post we are going to explore how the auto-generation of tests works in the PyTorch test suite and how they are collected by pytest.'
category: [Machine Learning, Developer Workflows]
featuredImage:
  src: /posts/pytest-pytorch/blog_feature_var2.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/pytest-pytorch/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

```{=ipynb}
<details>
<summary>Prerequisites</summary>
<p>
```

To run the code in this post yourself, make sure you have
[`torch`](https://pypi.org/project/torch/),
[`ipytest>0.9`](https://pypi.org/project/ipytest/), and the plugin to be
introduced
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch)
installed.

    pip install torch 'ipytest>0.9' pytest-pytorch

Before we start testing, we need to configure
[`ipytest`](https://github.com/chmp/ipytest). We use the
[`ipytest.autoconfig()`](https://github.com/chmp/ipytest#ipytestautoconfig)
as base and add some [`pytest` CLI
flags](https://docs.pytest.org/en/stable/reference.html#command-line-flags)
in order to get a concise output.

``` python
import ipytest

ipytest.autoconfig(defopts=False)

default_flags = ("--quiet", "--disable-warnings")

def _configure_ipytest(*additional_flags, collect_only=False):
    addopts = list(default_flags)
    if collect_only:
        addopts.append("--collect-only")
    addopts.extend(additional_flags)
    
    ipytest.config(addopts=addopts)

def enable_pytest_pytorch(collect_only=False):
    _configure_ipytest(collect_only=collect_only)
    
def disable_pytest_pytorch(collect_only=False):
    _configure_ipytest("--disable-pytest-pytorch", collect_only=collect_only)
    
disable_pytest_pytorch()
```

```{=ipynb}
</p>
</details>
```

If you work on [PyTorch](https://pytorch.org) and like
[`pytest`](https://pytest.org) you may have noticed that you cannot run
some tests in the test suite using the default
[`pytest`](https://pytest.org) double colon syntax
`{MODULE}::TestFoo::test_bar`.

``` python
%%run_pytest[clean] {MODULE}::TestFoo::test_bar

from torch.testing._internal.common_utils import TestCase
from torch.testing._internal.common_device_type import instantiate_device_type_tests

class TestFoo(TestCase):
    def test_bar(self, device):
        assert False, "Don't worry, this is supposed to happen!"

    
instantiate_device_type_tests(TestFoo, globals(), only_for=["cpu"])
```

    1 warning in 0.01s

    ERROR: not found: /home/user/tmp35zsok9u.py::TestFoo::test_bar
    (no name '/home/user/tmp35zsok9u.py::TestFoo::test_bar' in any of [<Module tmp35zsok9u.py>])

If the absence of this very basic [`pytest`](https://pytest.org) feature
has ever been the source of frustration for you, you don\'t need to
worry anymore. By installing the
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) plugin
with

    pip install pytest-pytorch

or

    conda install -c conda-forge pytest-pytorch

you get the default [`pytest`](https://pytest.org) experience back even
if your workflow involves running tests from within your IDE!

``` python
enable_pytest_pytorch()
```

``` python
%%run_pytest {MODULE}::TestFoo::test_bar
                
pass
```

    F                                                                        [100%]
    =================================== FAILURES ===================================
    ___________________________ TestFooCPU.test_bar_cpu ____________________________

    self = <__main__.TestFooCPU testMethod=test_bar_cpu>, device = 'cpu'

        def test_bar(self, device):
    >       assert False, "Don't worry, this is supposed to happen!"
    E       AssertionError: Don't worry, this is supposed to happen!
    E       assert False

    <ipython-input-2-f22a5e9e7b30>:7: AssertionError
    =========================== short test summary info ============================
    FAILED tmpt8c1r46_.py::TestFooCPU::test_bar_cpu - AssertionError: Don't worry...
    1 failed, 1 warning in 0.17s

As you can see, with
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) enabled,
[`pytest`](https://pytest.org) ran the correct test but collected it
under a different name. In this post we are going to find out why this
is happening and what
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) does to
make your life easier.

## [PyTorch](https://pytorch.org) test generation

[PyTorch](https://pytorch.org) has an extensive test suite with a lot of
[configuration options and auto-generated
tests](https://github.com/pytorch/pytorch/wiki/Running-and-writing-tests-in-PyTorch-1.9).
Internally, [PyTorch](https://pytorch.org) uses a `TestCase` class that
is derived from
[`unittest.TestCase`](https://docs.python.org/3/library/unittest.html#unittest.TestCase).
In the first part of the post we are going to explore how the
auto-generation of tests works in the [PyTorch](https://pytorch.org)
test suite and how they are collected by [`pytest`](https://pytest.org).

In its default definition [PyTorch](https://pytorch.org)\'s `TestCase`
behaves exactly like its base class with regards to test collection.

``` python
disable_pytest_pytorch(collect_only=True)
```

``` python
%%run_pytest[clean] {MODULE}

from torch.testing._internal.common_utils import TestCase

class TestFoo(TestCase):
    def test_bar(self):
        pass

    def test_baz(self):
        pass
```

    tmpy90fpw2t.py::TestFoo::test_bar
    tmpy90fpw2t.py::TestFoo::test_baz

    2 tests collected in 0.04s

### Device parametrization

Most `TestCase`\'s use additional configuration, though. In
[PyTorch](https://pytorch.org), most operations can be performed on
other `device`\'s than the CPU, for example a GPU. Thus, to [not repeat
yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) by
writing the same test for multiple `device`\'s, the possible devices are
used as parameters for the test. In [PyTorch](https://pytorch.org) this
is done with the `instantiate_device_type_tests` function.

``` python
%%run_pytest[clean] {MODULE}

from torch.testing._internal.common_utils import TestCase
from torch.testing._internal.common_device_type import instantiate_device_type_tests

class TestFoo(TestCase):
    def test_bar(self, device):
        pass

    def test_baz(self, device):
        pass

    
instantiate_device_type_tests(TestFoo, globals(), only_for=["cpu", "cuda"])
```

    tmpyt_bxm9e.py::TestFooCPU::test_bar_cpu
    tmpyt_bxm9e.py::TestFooCPU::test_baz_cpu
    tmpyt_bxm9e.py::TestFooCUDA::test_bar_cuda
    tmpyt_bxm9e.py::TestFooCUDA::test_baz_cuda

    4 tests collected in 0.01s

As the name implies, `instantiate_device_type_tests` uses the passed
test case as template to instantiate new test cases from it for the
different `device`\'s. In this process the names of test cases as well
as its test functions are changed:

-   The test case is namespaced by postfixing the `device` name in
    uppercase letters (`TestFoo` ⟶ `TestFooCPU`)
-   Each test function is namespaced by postfixing the `device` name in
    lower case letters and an additional underscore as separator
    (`test_bar` ⟶ `test_bar_cpu`)

After the instatiation, the current tested `device` is supplied to each
test function.

We are glossing over many details here, two of which I should at least
mention:

1.  Although it looks like only the test functions need to be
    parametrized, the parametrized test cases perform different setup
    and teardown on a per-`device` basis.
2.  There are many decorators available that allow to adapt the `device`
    parametrization on a per-function basis.

### Data type parametrization

In the same spirit as the `device` parametrizations, most
[PyTorch](https://pytorch.org) operators support a [plethora of data
types](https://pytorch.org/docs/stable/tensor_attributes.html#torch-dtype)
(`dtype`\'s in short). We can parametrize a test function with the
`@dtypes` decorator, after which the `dtype` is available as parameter.
Note that we can only use the `@dtypes` decorator if templating is
enabled, which means that we have to use
`instantiate_device_type_tests`.

``` python
%%run_pytest[clean] {MODULE}

import torch

from torch.testing._internal.common_utils import TestCase
from torch.testing._internal.common_device_type import (
    instantiate_device_type_tests,
    dtypes,
)

class TestFoo(TestCase):
    @dtypes(torch.int32, torch.float32)
    def test_bar(self, device, dtype):
        pass

instantiate_device_type_tests(TestFoo, globals(), only_for="cpu")
```

    tmpttnibud4.py::TestFooCPU::test_bar_cpu_float32
    tmpttnibud4.py::TestFooCPU::test_bar_cpu_int32

    2 tests collected in 0.01s

Similar to the device parametrization, the `dtype` name is postfixed to
the name of the test function after the `device` (`test_bar` ⟶
`test_bar_cpu_float32`). Since there is no need for special setup or
teardown on a per-`dtype` basis, the test case is not instatiatied for
different `dtype`\'s (`TestFoo` ⟶ `TestFooCPU`).

Again, there are more decorators available for granular control, but
they go beyond the scope of this post.

### Operator parametrization

A recent addition to the [PyTorch](https://pytorch.org) test suite is
the `OpInfo` class. It carries the meta data of an operator such as
per-`device` supported `dtype`\'s or an optional reference function from
another library. Going through all options would facilitate a blog post
on its own, so we are going to stick to the basics here.

`OpInfo`\'s enable even less duplicated code. For example, the test
structure for checking an operator against a reference implementation is
operator-agnostic. To parametrize a test function, we use the `@ops`
decorator. We define our own `op_db` here, but in the
[PyTorch](https://pytorch.org) test suite there are pre-defined
databases, for different operator types such as unary or binary
operators. Again, note that we can only use the `@ops` decorator if
templating is enabled, which means that we have to use
`instantiate_device_type_tests`.

``` python
%%run_pytest[clean] {MODULE}

import torch

from torch.testing import _dispatch_dtypes
from torch.testing._internal.common_device_type import (
    instantiate_device_type_tests,
    ops,
)
from torch.testing._internal.common_methods_invocations import OpInfo
from torch.testing._internal.common_utils import TestCase

op_db = [
    OpInfo("add", dtypesIfCPU=_dispatch_dtypes([torch.int32])), 
    OpInfo("sub", dtypesIfCPU=_dispatch_dtypes([torch.float32])),
]

class TestFoo(TestCase):
    @ops(op_db)
    def test_bar(self, device, dtype, op):
        pass

instantiate_device_type_tests(TestFoo, globals(), only_for="cpu")
```

    tmpe119_vdl.py::TestFooCPU::test_bar_add_cpu_int32
    tmpe119_vdl.py::TestFooCPU::test_bar_sub_cpu_float32

    2 tests collected in 0.04s

In contrast to the `dtype`, the `op` name is placed before the `device`
identifier in the name of a test function (`test_bar` ⟶
`test_bar_add_cpu_int32`). Still, no special setup or teardown is needed
on a per-`op` basis, so the test case is only instantiated for the
`device` (`TestFoo` ⟶ `TestFooCPU`).

### [`pytest`](https://pytest.org) \"equivalent\"

From a [`pytest`](https://pytest.org) perspective, the
[PyTorch](https://pytorch.org) test generation is \"equivalent\" to
using the `@pytest.mark.parametrize` decorator. Of course this ignores
all the gory details, which makes it seem easier than it is. Still, it
might be a good mental analogy for someone coming from a
[`pytest`](https://pytest.org) background.

``` python
%%run_pytest[clean] {MODULE}

import pytest

import torch

@pytest.mark.parametrize("device", ["cpu"])
class TestFoo:
    @pytest.mark.parametrize("dtype", [pytest.param(torch.float32, id="float32")])
    @pytest.mark.parametrize("op", ["add", "sub"])
    def test_bar(self, device, dtype, op):
        pass
```

    tmp8_w7dn68.py::TestFoo::test_bar[add-float32-cpu]
    tmp8_w7dn68.py::TestFoo::test_bar[sub-float32-cpu]

    2 tests collected in 0.00s

So far we looked at the test generation in the
[PyTorch](https://pytorch.org) test suite and how the tests are
collected by [`pytest`](https://pytest.org). Although
[PyTorch](https://pytorch.org) uses a different parametrization scheme
than [`pytest`](https://pytest.org), it is 100% compatible. The problems
only materialize if you want select a specific test case or test
function rather than say a whole module or the complete test suite.

## [PyTorch](https://pytorch.org) test selection with [`pytest`](https://pytest.org)

As we observed above, [`pytest`](https://pytest.org)\'s default double
colon `::` notation, does not work on tests instantiated by
[PyTorch](https://pytorch.org)\'s test suite.

``` python
%%run_pytest[clean] {MODULE}::TestFoo::test_bar

from torch.testing._internal.common_utils import TestCase
from torch.testing._internal.common_device_type import instantiate_device_type_tests

class TestFoo(TestCase):
    def test_bar(self, device):
        pass
    
    def test_baz(self, device):
        pass

    
instantiate_device_type_tests(TestFoo, globals(), only_for=["cpu"])
```

    no tests collected in 0.01s

    ERROR: not found: /home/user/tmpg1b9f42o.py::TestFoo::test_bar
    (no name '/home/user/tmpg1b9f42o.py::TestFoo::test_bar' in any of [<Module tmpg1b9f42o.py>])

Equipped with the knowledge we gathered about the instantiation, it is
easy to see why this is happening.

``` python
%%run_pytest {MODULE}

pass
```

    tmpo9kwbe9q.py::TestFooCPU::test_bar_cpu
    tmpo9kwbe9q.py::TestFooCPU::test_baz_cpu

    2 tests collected in 0.01s

[`pytest`](https://pytest.org) searches for the test case `TestFoo` with
the test function `test_bar`, but can\'t find them, because
`instantiate_device_type_tests` renamed them to `TestFooCPU` and
`test_bar_cpu`. However, the test is selectable by its new, instantiated
name `{MODULE}::TestFooCPU::test_bar_cpu`

``` python
%%run_pytest {MODULE}::TestFooCPU::test_bar_cpu
                
pass
```

    tmp_i0_ha5r.py::TestFooCPU::test_bar_cpu

    1 test collected in 0.04s

From a convenience standpoint this is not optimal, because we need to
remember the naming scheme. Furthermore, we can only select a specific
parametrization rather than running a test case or a test function
against all available parametrizations. The usual way around this is to
rely on the [`pytest` `-k`
flag](https://docs.pytest.org/en/stable/reference.html#command-line-flags)
to do a pattern matching.

``` python
%%run_pytest {MODULE} -k "TestFoo and test_bar"
                
pass
```

    tmp633i_bea.py::TestFooCPU::test_bar_cpu

    1/2 tests collected (1 deselected) in 0.01s

In contrast to the default [`pytest`](https://pytest.org) practice we
need to include the names of the test case and test function in the
pattern rather than only the parametrization we want to select. This
brings its own set of problems with it, for example if test cases or
test functions use names that build on top of each other. Since the
selection pattern does not support regular expression matching, it can
get verbose and confusing.

``` python
%%run_pytest[clean] {MODULE} -k "TestFoo and not TestFooBar and test_spam and not test_spam_ham"

from torch.testing._internal.common_utils import TestCase
from torch.testing._internal.common_device_type import instantiate_device_type_tests

class TestFoo(TestCase):
    def test_spam(self, device):
        pass
    
    def test_spam_ham(self, device):
        pass

    
instantiate_device_type_tests(TestFoo, globals(), only_for="cpu")
    
    
class TestFooBar(TestCase):
    def test_spam(self, device):
        pass

instantiate_device_type_tests(TestFooBar, globals(), only_for="cpu")
```

    tmpzoevi0fu.py::TestFooCPU::test_spam_cpu

    1/3 tests collected (2 deselected) in 0.01s

### [`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch)

Introducing:
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch). After
its installation and without any configuration, we get the default
[`pytest`](https://pytest.org) experience back. Thus, even in
complicated naming situations we can simply select a test with the
double colon notation `{MODULE}::TestFoo::test_spam`

``` python
enable_pytest_pytorch(collect_only=True)
```

``` python
%%run_pytest {MODULE}::TestFoo::test_spam
                
pass
```

    tmpalkh4ddp.py::TestFooCPU::test_spam_cpu

    1 test collected in 0.05s

Of course we can still use the [`pytest` `-k`
flag](https://docs.pytest.org/en/stable/reference.html#command-line-flags)
to select a specific parametrization.

``` python
%%run_pytest[clean] {MODULE}::TestFoo::test_bar -k "cuda"

from torch.testing._internal.common_utils import TestCase
from torch.testing._internal.common_device_type import instantiate_device_type_tests

class TestFoo(TestCase):
    def test_bar(self, device):
        pass

    
instantiate_device_type_tests(TestFoo, globals(), only_for=["cpu", "cuda"])
```

    tmp6av_zpy3.py::TestFooCUDA::test_bar_cuda

    1/2 tests collected (1 deselected) in 0.02s

Handwaving over details
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) achieves
this by hooking into [`pytest`](https://pytest.org)\'s test collection
and performing the matching of the instantiated to the template name for
you. If that sounds intruiging, have a look at the [GitHub
repository](https://github.com/Quansight/pytest-pytorch).

### IDEs with [`pytest`](https://pytest.org) support

Another use case for
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) are
modern Python IDEs such as
[PyCharm](https://www.jetbrains.com/help/pycharm/pytest.html#run-pytest-test)
or
[VSCode](https://code.visualstudio.com/docs/python/testing#_run-tests)
with built-in [`pytest`](https://pytest.org) support. Within such an IDE
you can run a test by clicking a button next to its definition without
dropping into a terminal. Doing this, you also get the comfort of the
IDE including the debugger.

This feature relies on the test selection with the default
[`pytest`](https://pytest.org) syntax, which, as we have seen above,
does not work well with the [PyTorch](https://pytorch.org) test suite.
You could fiddle with your IDEs default test runner config or you could
simply install
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) to make
it work out of the box.

## Conclusion

In this post we took a look at how the [PyTorch](https://pytorch.org)
test suite auto-generates `device`-, `dtype`-, and even
operator-agnostic tests. Although it uses a different scheme than
[`pytest`](https://pytest.org), the tests can still be collected and run
by it. The compatibility breaks down, if one tries to use the default
[`pytest`](https://pytest.org) selection notation. To overcome this and
in turn enhance the developer experience we introduced the
[`pytest-pytorch`](https://github.com/Quansight/pytest-pytorch) plugin.
It can for example be used to regain out-of-the-box
[`pytest`](https://pytest.org) support in modern IDEs when working on
[PyTorch](https://pytorch.org).

