---
title: "`metadsl`: A Framework for Domain Specific Languages in Python"
author: saul-shanabrook
published: May 31, 2019
description: 'metadsl is meant to be a place to come together to build a framework for DSLs in Python. It provides a way to seperate the user experience from the the specific of execution, to enable consistency and flexibility for users. In this post, I will go through an example of creating a very basic DSL.'
category: [Beyond PyData]
featuredImage:
  src: /posts/metadsl/blog_feature_org.svg
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/metadsl/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

Hello, my name is Saul Shanabrook and for the past year or so I have
been at Quansight exploring the array computing ecosystem. This started
with working on the [xnd project](https://xnd.io/), a set of low level
primitives to help build cross platform NumPy-like APIs, and then
[started](https://github.com/saulshanabrook/moa)
[exploring](https://github.com/saulshanabrook/moa) Lenore Mullin\'s work
on a mathematics of arrays. After spending quite a bit of time working
on an integrated solution built on these concepts, I decided to step
back to try to generalize and simplify the core concepts. The trickiest
part was not actually compiling mathematical descriptions of array
operations in Python, but figuring out how to make it useful to existing
users. To do this, we need to meet users where they are at, which is
with the APIs they are already familiar with, like `numpy`. The goal of
[`metadsl`](https://github.com/quansight-labs/metadsl) is to make it 
easier to tackle parts of this problem seperately so that we can
collaborate on tackling it together.

## Libraries for Scientific Computing

Much of the recent rise of Python\'s popularity is due to its usage for
scientific computing and machine learning. This work is built on
different frameworks, like Pandas, NumPy, Tensorflow, and scikit-learn.
Each of these are meant to be used from Python, but have their own
concepts and abstractions to learn on top of the core language, so we
can look at them as Domain Specific Languages (DSLs). As the ecosystem
has matured, we are now demanding more flexibility for how these
languages are executed. Dask gives us a way to write Pandas or NumPy and
execute it across many cores or computers, Ibis allows us to write
Pandas but on a SQL database, with CuPy we can execute NumPy on our GPU,
and with Numba we can optimize our NumPy expession on a CPU or GPU.
These projects prove that it is possible to write optimizing compilers
that target varying hardware paradigms for existing Python numeric APIs.
However, this isn\'t straightforward and these projects success is a
testament to the perserverence and ingenuity of the authors. We need to
make it easy to add reusable optimizations to libraries like these, so
that we can support the latest hardware and compiler optimizations from
Python. [`metadsl`](https://github.com/quansight-labs/metadsl) is meant
to be a place to come together to build a framework for DSLs in Python.
It provides a way to seperate the user experience from the the specific
of execution, to enable consistency and flexibility for users. In this
post, I will go through an example of creating a very basic DSL. It will
not use the `metadsl` library, but will created in the same style as
`metadsl` to illustrate its basic principles.

## A simple DSL

We will create a simple language allowing you to add and multiply
numbers and check if they are equal or greater than each other. The
values will either be Python integers/booleans or strings representing
abstract variables. We can represent our operations as Python functions,
because they all take in some number of arguments and return a value:

``` python
def add(a, b):
    ...

def mult(a, b):
    ...

def equal(a, b):
    ...

def gt(a, b):
    ...
```

We can also represent our constructors as functions:

``` python
def from_int(i):
    ...

def from_str(s):
    ...
```

But what types should these functions return? Our goal here is build up
the computation before we decide how to execute it, so each expression
is defined by the operation and its arguments:

``` python
import dataclasses
import typing

@dataclasses.dataclass
class Expression:
    function: typing.Callable
    arguments: typing.Tuple
    
    def __repr__(self):
        return f"{self.function.__qualname__}({', '.join(map(repr, self.arguments))})"
```

We can create an expression that adds the two variables `"a"` and `"b"`:

``` python
a = Expression(from_str, ("a",))
b = Expression(from_str, ("b",))

Expression(add, (a, b))
```

    add(from_str('a'), from_str('b'))

It would be more natural to be able to call the functions themselves to
build up expressions. So let\'s rewrite the functions so they return
expressions:

``` python
def from_str(s):
    return Expression(from_str, (s,))

def add(a, b):
    return Expression(add, (a, b))

add(from_str("a"), from_str("b"))
```

    add(from_str('a'), from_str('b'))

You might notice that we are actually repeating ourselves a bit here. In
each function, we repeat the function name and the argument names.
Instead of having to do this for each function, which is error prone,
tendious, and ugly, we can create a decorator that does it for us. We
create a decorator called `expression` that takes in the initial
function and returns a new one that creates an `Expression` object with
that function and the arguments passed in:

``` python
import functools

def expression(fn):

    @functools.wraps(fn)
    def expression_inner(*args, fn=fn):
        return Expression(fn, args)

    return expression_inner
```

Now we can rewrite our expression functions with this decorator in a
concise way:

``` python
@expression
def add(a, b):
    ...

@expression
def mult(a, b):
    ...

@expression
def equal(a, b):
    ...

@expression
def gt(a, b):
    ...
    
@expression
def from_int(i):
    ...

@expression
def from_str(s):
    ...
```

We now have a concise way of defining operations that has a Pythonic
API:

``` python
mult(from_str("a"), from_str("b"))
```

    mult(from_str('a'), from_str('b'))

## Adding Typing

Now we can build up these expressions naturally, but there are some
expressions that should not be allowed, for example:

``` python
some_bool = equal(from_str("a"), from_str("b"))

mult(some_bool, some_bool)
```

    mult(equal(from_str('a'), from_str('b')), equal(from_str('a'), from_str('b')))

We don\'t want to allow multiplying booleans in our language, only
numbers. So this brings us to *types*. Types gives us an explicit and
succinct way to restrict all the possible expressions to a subset that
we consider meaningful or valid. Simple types can\'t eliminate all
errors (like dividing by zero), but they can give us some guide posts
for what is allowed. They also provide us with a mental model of our
domain. So how do we add types? Let\'s subclass `Expression` for the two
types we have defined.

``` python
class Boolean(Expression):
    pass

class Number(Expression):
    pass
```

Now we can also define our operations as Python\'s dunder methods,
allowing us to use the `+` and `*` infix operators instead of requiring
functions. However, you might notice that now our `expression` function
is no longer valid. We don\'t want to return an `Expression` anymore,
but either a `Boolean` or `Number`. So we can rewrite our `expression`
function to first take in an `expression_type` argument, then return a
decorator for that expression type:

``` python
def expression(expression_type):

    def expression_inner(fn, fn=fn, expression_type=expression_type):
        @functools.wraps(fn)
        def expression_inner_inner(*args, fn=fn):
            return expression_type(fn, args)

        return expression_inner_inner

    return expression_inner
```

And we can add our dunder methods to the types:

``` python
class Number(Expression):
    @expression(Number)
    def __add__(self, other: Number) -> Number:
        ...
    
    @expression(Number)
    def __mul__(self, other: Number) -> Number:
        ...
    
    @expression(Boolean)
    def __eq__(self, other: Number) -> Boolean:
        ...

    @expression(Boolean)
    def __gt__(self, other: Number) -> Boolean:
        ...
    
    @staticmethod
    @expression(Number)
    def from_int(i: int) -> Number:
        ...

    @staticmethod
    @expression(Number)
    def from_str(s: str) -> Number:
        ...
```

``` python
(Number.from_int(10) + Number.from_str("A")) == Number.from_int(10)
```

    Number.__eq__(Number.from_int(10), Number.__add__(Number.from_int(10), Number.from_str('A')))

## Next Steps

So now we have created a lightweight way to represent this DSL in Python
that supports static type analysis by MyPy (or other tools). The
`Expression` class we have defined here is conceptual core of `metadsl`.
On top of this, `metadsl` provides:

-   A type safe way to define replacements on this graph and a system to
    apply replacements repeatedly to allow execution/compilation. This
    would allow us to actually evaluate this DSL in some way or optimize
    it.
-   A way to create \"wrapper\" classes that also build up expression
    graphs, but can take in regular Python objects. This would allow us
    to add an `Number` to an `int`, instead of first having to call
    `from_int` on it.

We are working towards representing the full NumPy API faithfully to
support translating it to other APIs, like that of Torch or Tensorflow,
and also optimize it with the [Mathematics of Arrays
formalism](https://labs.quansight.org/blog/2019/04/python-moa-tensor-compiler/).
We are actively looking for other projects that this effort would be
useful for and welcome any collaboration. Feel free to raise an issue on
our Github repo, or reach our to me directly at `saul@quansight.com` to
set up a time to chat more in depth. Nothing here is set in stone. It is
just a couple of ideas that we have found useful as we explore this
space. While it is by no means a complete solution we hope it can be a
meeting place to grow this concept to suit the needs of the Python
community.

