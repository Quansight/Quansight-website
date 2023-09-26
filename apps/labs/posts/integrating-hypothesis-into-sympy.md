---
title: 'Integrating Hypothesis into SymPy'
authors: [diane-tc]
published: September 20, 2023
description: 'Gives an introduction to the utility of hypothesis in SymPy'
category: [Property Based Testing]
featuredImage:
  src: /posts/integrating-hypothesis-into-sympy/blog_feature_org.png
  alt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
hero:
  imageSrc: /posts/integrating-hypothesis-into-sympy/blog_hero_var2.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.' 
---
This summer I interned at Quansight Labs with a focus of intergrating [Hypothesis](https://github.com/HypothesisWorks/hypothesis/) into the testing suit of [SymPy](https://github.com/sympy/sympy). The primary [pull request to add Hypothesis to the test infrastructure](https://github.com/sympy/sympy/pull/25428) to complete this was simple. The primary challenges lied thereafter: questions around the _utility of hypothesis_ and its appropriate usage arose. 

There are many ways to test your software : unit testing, regression testing, diff testing, and mutation testing are a few that come to mind. This blog post is for anyone interested in understanding the value of utilizing _property based testing_ in their software projects. The post  will be broken up into three parts:

* What is Property Based Testing?
* What is Hypothesis?
* Experience Integrating into SymPy

If you wish to follow the examples in the blog post, you will need to install Hypothesis via:

```bash
pip install hypothesis
```
# What is Property Based Testing?

Property based testing (PBT) is a technique where instead of testing individual test cases, you specify properties you which to hold true for a range of inputs. These properties are then tested against automatically generated test data. PBT uses logical properties over generated test data to facilitate broad, robust testing that can expose edge cases not easily found via traditional test cases.

PBT _shines_ when testing generic functions and libraries working across a wide range of possible inputs, where manually enumerating test cases is difficult but the behavior in question is easily testable. Examples include:

* Mathematical Operations
* String formatting
* Database migration
* Compression algorithms

Let's take a simple, concrete example. Say we want to ensure that after multiplying two polynomials together, the degree of the resulting polynomial is the sum of the degrees of the two polynomials. We could write a test case for this:

```python
from sympy.abc import x
def test_degree():
    f = Poly(x**2 + 1, x)
    g = Poly(x**3 + 1, x)
    h = f*g
    assert h.degree() == f.degree() + g.degree()
```
Notice, we are limited in how many various combinations of _f_ and _g_ we can test. It would be better if we could fix a property and have a library automatically generate interesting test cases and run them for us. We would no longer need to worry about thinking up input/output pairs. This would increase our **_trust_** in the implementation.

# What is Hypothesis?
 > [Hypothesis](https://hypothesis.readthedocs.io/en/latest/) is a Python library for creating unit tests which are simpler to write and more powerful when run, finding edge cases in your code you wouldn’t have thought to look for. It is stable, powerful and easy to add to any existing test suite.
> Now, let's test out the property above using Hypothesis:
  
  ```python
from hypothesis import given, strategies as st

@given(f = polys(), g = polys())
def test_degree(f, g):
    h = f * g
    assert h.degree() == f.degree() + g.degree()
```
Note, that here `polys()` is custom-built for sympy and generates a random polynomial with integer coefficeints. It is not a built-in Hypothesis strategy.

### How Hypothesis Works
Give Hypothesis the types of inputs you are expecting using the _@given_ decorator and it will automatically generate examples using the _strategies_ module. It will then use these examples to test and report the minimal failing inputs (if any). 

Hypothesis is able to come up with interesting inputs using a combination of smart generation, guiding metrics, and feedback loops. For example, the built-in stategies like `integers()` have default behaviors tuned for common useful values. That is, while some inputs are random, it also tries to choose cases that commonly cause errors (like 0 or NaN). Hypothesis is _adversarial_ in the way it chooses inputs to test against your function. 

Hypothesis comes with built-in strategy functions for common Python data types. In the example above, we accessed integers using `st.integers()`, but Hypothesis also gives you access to `floats()`, `booleans()`, `fractions()`, `dictionaries()`, and many more.


The full documentation for Hypothesis can be found [here](https://hypothesis.readthedocs.io/en/latest/index.html) and for a nice and robust introduction, check out this video from [PyCon 2019](https://youtu.be/KcyGUVzL7HA?si=lglSRamsWsY1YLIR).

Overall, Hypothesis is great at finding bugs and in general, writing tests as high level properties keeps your code consistent. 
### What Hypothesis is NOT

* Hypothesis cannot test black boxes, machine learning systems, simulations of complicated systems, or code with lots of state (e.g., things which depend on a database or talk to a network etc.). Hypothesis must receive an understanding of the input and output behavior that can be easily modelled.
  
* Hypothesis is **_not_** just a bug finder, it helps protect against _future_ bugs. Hypothesis disallows the existence of latent bugs which increases trust in the current implementation of whatever function is being tested. Hypothesis may also reveal weird design patterns. 

# Integrating Hypothesis into SymPy

SymPy is an ideal library for property based testing so integration was painless.

### What Has Changed in SymPy?

Hypothesis is now a required _testing_ dependency of SymPy. Property based tests can be created in the `test_hypothesis.py` file in respective tests directories more details in the [new contributor documentation](https://github.com/sympy/sympy/blob/master/doc/src/contributing/new-contributors-guide/writing-tests.md#hypothesis-testing)). An example testing file using hypothesis can be found in  [ntheory/tests](https://github.com/sympy/sympy/blob/master/sympy/ntheory/tests/test_hypothesis.py).
### Utilizing Hypothesis in SymPy

Hypothesis was able to find various bugs and code design flaws. Below I will highlight two:
* The [`resultant` function returning incorrect answers](https://github.com/sympy/sympy/issues/25406). While this bug ended up not needing to be resolved, it did  reveal the utility in having Hypothesis check [consistency between implementations](https://github.com/sympy/sympy/issues/25406#issuecomment-1652243538) of the same function.
  
* There were various issues with the lowest common multiple (LCM) function (notes in [issue#25624](https://github.com/sympy/sympy/issues/25624), [PR#25636](https://github.com/sympy/sympy/pull/25636), and [PR#25517](https://github.com/sympy/sympy/pull/25517#issuecomment-1714474991)), the biggest being when the LCM should make use of the integer implementation vs polynomial implementation (when the defined polynomial is essentially an integer).

# Acknowledgements

Thank you to my mentors [Aaron](https://github.com/asmeurer) and [Matthew](https://github.com/honno) for guidance during this project. Added thanks to [Melissa](https://github.com/melissawm) and the general internship program for their support. 
