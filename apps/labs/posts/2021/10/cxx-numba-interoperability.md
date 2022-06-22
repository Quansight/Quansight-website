---
title: 'An efficient method of calling C++ functions from numba using clang++/ctypes/rbc'
published: October 19, 2021
author: pearu-peterson
description: 'An exploration of a method to call C++ libarary function from Numba compiled functions, i.e. python function that are decorated with "numba.jit(nopython=True)"'
category: [Beyond PyData, PyData Ecosystem]
featuredImage:
  src: /posts/2010/10/cxx-numba-interoperability/blog_feature_var2.svg
  alt: 'An illustration of brown and a white coming towards each other to pass a business card with the logo of Quansight Labs'
hero:
  imageSrc: /posts/2010/10/cxx-numba-interoperability/blog_hero_var2.svg
  imageAlt: 'An illustration of a black  hand holding up a microphone, with some graphical elements highlighting the top of the microphone'
---

The aim of this post is to explore a method of calling C++ library
functions from [Numba](http://numba.pydata.org/) [compiled
functions](https://numba.pydata.org/numba-doc/latest/user/jit.html#compiling-python-code-with-jit)
--- Python functions that are decorated with
`numba.jit(nopython=True)`.

While there exist [ways to wrap C++ codes to Python (see Appendix
below)](#appendix-a-list-of-pythoncc-connectivity-tools), calling
these wrappers from Numba compiled functions is often not as
straightforward and efficient as one would hope.The underlying problem for this inefficiency
is that the Python/C++ wrappers are designed to be called with Python
objects as inputs. For instance, with keeping in mind the aim of this post, a
call to a Numba compiled function would involve converting a Python
object to a low-level object, say, to some C/C++ equivalent intrinsic
type or structure, then converting it back to Python object to be
passed to the Python/C++ wrapper function. Then this wrapper function would convert the
Python object (again) to an equivalent C/C++ type object which can be
finally passed to the underlying C++ library function. The return
value of the C++ function would be transformed several times as well,
just in the opposite direction of the function's calling sequence. In
totality, all these object transformations may build up a considerable
overhead of calling otherwise highly efficient C++ library functions
from Python.

Another difficulty with calling C++ library functions from Numba
originates from the
[name-mangling](https://en.wikipedia.org/wiki/Name_mangling) that C++
compilers apply to function names in order to support function/method
overloadings as well as other relevant C++ language features. In
principle, one would be able to call such a C++ library function
directly from any Numba compiled function (using the
[numba.cfunc](https://numba.pydata.org/numba-doc/latest/user/cfunc.html)
feature) if one would knows how the C++ compiler transforms the
function name internally . However, the name-mangling algorithm is C++
compiler vendor dependent, and in practice, it would be hard to
predict the mangled name in a portable manner.

## cxx2py.py tool

In this post, we'll introduce a straightforward and efficient method
of calling C++ library functions from Numba compiled functions that
circumvents the name-mangling problem. The method is based on
determining the addresses of C++ library functions at runtime which
together with functions signatures are then used to set up a highly
efficient calling sequence. This method will require creating a small
C/C++ wrapper library that contains `extern "C"`-attributed
functions which return the addresses of C++ library functions and
can be easily called from Python using various techniques, here we use
[ctypes](https://docs.python.org/3/library/ctypes.html).

We provide here a Python script [cxx2py.py](https://raw.githubusercontent.com/Quansight/Quansight-website/public/posts/2021/10/cxx-numba-interoperability/cxx2py.py) that
auto-generates, from a user-supplied C++ header and source files, the
C/C++ wrapper library as well as a Python
[ctypes](https://docs.python.org/3/library/ctypes.html) wrapper
module. The Python module contains `ctypes` definitions of C++
library functions that Numba compiled functions are able to call
directly without requiring the expensive and redundant object
transformations mentioned above. An alternative to using `ctypes` in
the Python wrapper module would be to use the Numba [Wrapper Address
Protocol -
WAP](https://numba.pydata.org/numba-doc/latest/reference/types.html#wrapper-address-protocol-wap)
. Its usage should be considered if the
[ctypes](https://docs.python.org/3/library/ctypes.html) "C++
expressiveness" turns out to be insufficient.

Currently, the supported features in the `cxx2py.py` tool include:

- wrapping of C++ library functions with scalar inputs and return
  values,
- supporting C++ functions which may be defined inside C++ namespaces,
- supporting C++ functions which may be static class member functions.

The `cxx2py.py` tool can be extended to support other C++ features
such as:

- creating C++ class/struct instances from Python,
- passing C++ class/struct instances to-and-fro between languages,
- calling the methods of C++ class/struct instances,
- supporting pointer types as function inputs and return values,
- etc.

The `cxx2py.py` tool uses [CLang](https://clang.llvm.org/) to parse
C++ header files and to build the C/C++ wrapper shared library. It
also uses the [RBC - Remote Backend
Compiler](https://github.com/xnd-project/rbc/) to parse the signatures
of C++ functions for convenience.

## Example

As a prerequisite, let's create a
[Conda](https://docs.conda.io/en/latest/) environment as follows

```bash
$ conda create -n cxx2py-demo -c conda-forge numba rbc cxx-compiler clangdev
$ conda activate cxx2py-demo
```

We assume that the [cxx2py.py](https://raw.githubusercontent.com/Quansight/Quansight-website/public/posts/2021/10/cxx-numba-interoperability/cxx2py.py) script is copied to the
current working directory and is functional:

```bash
$ python cxx2py.py --help
usage: cxx2py.py [-h] [-m MODULENAME] [--clang-exe CLANG_EXE]
                 [--clang-ast-dump-flags CLANG_AST_DUMP_FLAGS]
                 [--clang-build-flags CLANG_BUILD_FLAGS]
                 [--clang-extra-flags CLANG_EXTRA_FLAGS]
                 [--build] [--verbose]
                 file [file ...]

Generate ctypes wrappers to C++ library functions

positional arguments:
  file                  C++ header/source file

optional arguments:
  -h, --help            show this help message and exit
  -m MODULENAME, --modulename MODULENAME
                        Python module name of ctypes wrappers (default: untitled)
  --clang-exe CLANG_EXE
                        Path to clang compiler (default: clang++)
  --clang-ast-dump-flags CLANG_AST_DUMP_FLAGS
                        Override flags to clang ast dump command (default:
                        '-Xclang -ast-dump -fsyntax-only -fno-diagnostics-color')
  --clang-build-flags CLANG_BUILD_FLAGS
                        Override flags to clang build shared library command
                        (default: '-shared -fPIC')
  --clang-extra-flags CLANG_EXTRA_FLAGS
                        Extra flags to clang command (default: '')
  --build               Build shared library (default: False)
  --verbose             Be verbose (default: False)
```

Next, let us consider the following C++ header and source file that we
will use as a model of a C++ library:

```c++
/* File: foo.hpp */
#include <iostream>
int foo(int a);

namespace ns {
  namespace ns2 {
    double bar(double x);
    class BarCls {
    public:
      BarCls(double a): a_(a) {}
      double get_a() { return a_; }
      static int fun() { return 54321; }
    private:
      double a_;
    };
  }
}

/* File: foo.cpp */
int foo(int a) {
  std::cout << "in foo(" << std::to_string(a) << ")" << std::endl;
  return a + 123;
}

namespace ns { namespace ns2 {
    double bar(double a) {
      std::cout << "in ns::ns2::bar(" << std::to_string(a) << ")" << std::endl;
      return a + 12.3;
    }
}}
```

We build a Python ctypes wrapper library using

```bash
$ python cxx2py.py -m libfoo foo.hpp foo.cpp --build
DONE

As a quick test, try running:

  LD_LIBRARY_PATH=. python -c "import untitled as m; print(m.__all__)"
```

that will create three files in the current directory:

```bash
$ ls *libfoo*
cxx2py_libfoo.cpp  libcxx2py_libfoo.so  libfoo.py
```

Notice that the generated [cxx2py_libfoo.cpp](https://raw.githubusercontent.com/Quansight/Quansight-website/public/posts/2021/10/cxx-numba-interoperability/cxx2py_libfoo.cpp) file
contains light-weight C functions for returning the addresses of C++
functions:

```c++
#include <memory>
#include <cstdint>
#include "foo.hpp"

extern "C" intptr_t get_foo_address() {
  /* int (int) */
  return reinterpret_cast<intptr_t>(std::addressof(foo));
}


extern "C" intptr_t get_ns__ns2__bar_address() {
  /* double (double) */
  return reinterpret_cast<intptr_t>(std::addressof(ns::ns2::bar));
}


extern "C" intptr_t get_ns__BarCls__fun_address() {
  /* int () */
  return reinterpret_cast<intptr_t>(std::addressof(ns::BarCls::fun));
}
```

The `cxx2py_libfoo.cpp` file is built into the shared library
`libcxx2py_libfoo.so` when `--build` flag is used.

Let's test the wrapper module [libfoo](https://raw.githubusercontent.com/Quansight/Quansight-website/public/posts/2021/10/cxx-numba-interoperability/libfoo.py) in Python:

```bash
$ export LD_LIBRARY_PATH=.  # this makes sure that ctypes is able to find the shared library
```

```python
$ python
>>> import libfoo
>>> libfoo.__all__
['foo', 'ns__ns2__bar', 'ns__BarCls__fun']
>>> libfoo.foo(5)
in foo(5)
128
>>> libfoo.ns__ns2__bar(1.2)
in ns::ns2::bar(1.200000)
13.5
>>> libfoo.ns__BarCls__fun()
54321
```

that is, the C++ library functions can be called directly from Python
thanks to [ctypes](https://docs.python.org/3/library/ctypes.html)!.

Moreover, the C++ library functions can be called from Numba compiled
functions. For example:

```python
>>> import numba
>>> @numba.njit
.def fun(x):
.    return libfoo.foo(x + 2)
...
>>> fun(5)
in foo(7)
130
```

# Summary

In this post, we outlined a method of calling C++ library functions
from Python with an emphasis on their usage from Numba compiled
functions with minimal overhead. While the provided tool
[cxx2py.py](https://raw.githubusercontent.com/Quansight/Quansight-website/public/posts/2021/10/cxx-numba-interoperability/cxx2py.py) currently supports only wrapping C++ functions
with scalar inputs and return values, it can be easily extended to
support other C++ features as well.

# Acknowledgements

I thank Breno Campos and Guilherme Leobas for discussions and for sharing
their expertise on the [LLVM Project](https://www.llvm.org/).

# Appendix: A list of Python/C/C++ connectivity tools

- [Boost.Python: C++ library with a IDL-like interface for binding C++ classes and functions to Python](https://www.boost.org/doc/libs/1_75_0/libs/python/doc/html/index.html)
- [cffi: C Foreign Function Interface for Python](https://cffi.readthedocs.io/en/latest/)
- [cppyy: Automatic Python-C++ bindings](https://cppyy.readthedocs.io/en/latest/)
- [ctypes: A foreign function library for Python](https://docs.python.org/3/library/ctypes.html)
- [Cython: C-Extensions for Python](https://cython.org/)
- [pybind11: Seamless operability between C++11 and Python](https://pybind11.readthedocs.io/en/latest/)
- [Python C/API: Extending and Embedding the Python Interpreter](https://docs.python.org/3/extending/index.html)
- [SIP: Python bindings generator to C or C++ libraries](https://www.riverbankcomputing.com/static/Docs/sip/introduction.html)
- [SWIG: Simplified Wrapper and Interface Generator](http://www.swig.org/)
