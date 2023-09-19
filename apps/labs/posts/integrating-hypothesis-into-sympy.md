---
title: 'Integrating Hypothesis into Sympy'
authors: [diane-tchuindjo]
published: September 20, 2023
description: 'gives an introduction to the utility of hypothesis in sympy'
category: [Property Based Testing]
featuredImage:
  src: 
  alt: 
hero:
  imageSrc: 
  imageAlt: 
---
This summer I interned at Quansight Labs with a focus of intergrating [Hypothesis](https://github.com/HypothesisWorks/hypothesis/) into the testing suit of [Sympy](https://github.com/sympy/sympy). The primary [pull request](https://github.com/sympy/sympy/pull/25428) to complete this was simple. The primary challenges lied thereafter: questions around the _utility of hypothesis_ and its appropriate usage arose. 

There are many ways to test your software : unit testing, regression testing, diff testing, and mutation testing are a few that come to mind. This blog post is for anyone interested in understanding the value of utilizing _property based testing_ in their software projects. The post  will be broken up into three parts:

* What is Property Based Testing?
* What is Hypothesis?
* Experience Integrating into Sympy

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

Let's take a simple, concrete example. Say we want to ensure our implementation of the area of a circle is correct. We can test things out explicitly:

```python
import math
class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2
        
def test_circle_area():
    circle = Circle(2)
    assert circle.area() == approx(12.57)
```
Notice, we must know the answer to each test case _a priori_. It would be better if we could fix a property, in this case that the area of a circle is $\pi r^{2}$, and have a library automatically generate interesting test cases and run them for us. We would no longer need to worry about thinking up input/output pairs. This would increase our **_trust_** in the implementation.

# What is Hypothesis?

Lets test out the property above using Hypothesis:
  
  ```python
from hypothesis import given, strategies as st

@given(radius=st.integers())
def test_area_property(radius):
    circle = Circle(radius)
    assert circle.area() == approx(math.pi * radius**2)
```
### How Hypothesis Works
Give Hypothesis the types of inputs you are expecting using the _@given_ decorator and it will automatically generate examples using the _strategies_ module. It will then use these examples to test and report the minimal failing inputs (if any). 

Hypothesis is able to come up with interesting inputs using a combination of smart generation, guiding metrics, and feedback loops. For example, The built-in stategies like integers() have default behaviors tuned for common useful values. That is, while some inputs are random, it also tries to choose cases that commonly cause errors (like 0 or NaN). Hypothesis is _adversarial_ in the way it chooses inputs to test against your function. 

Hypothesis comes with built-in strategy functions for common Python data types. In the example above, we accessed integers using **_st.integers()_**, but Hypothesis also gives you access to floats(), booleans(), fractions(), dictionaries() etc.

Hypothesis also provides map and filter methods. For example, we could constraint our test above to only generate even radia via:

```python
@given(radius=st.integers(lambda x: x % 2 == 0))
def test_area_property(radius):
    circle = Circle(radius)
    assert circle.area() == approx(math.pi * radius**2)
```
The full documentation for Hypothesis can be found [here](https://hypothesis.readthedocs.io/en/latest/index.html) and for a nice and robust introduction, check out this video from [PyCon 2019](https://youtu.be/KcyGUVzL7HA?si=lglSRamsWsY1YLIR).

Hypothesis is great at finding bugs and in general, writing tests as high level properties keeps your code consistent. 
### What Hypothesis is NOT

* Hypothesis cannot test black boxes, machine learning systems, simulations of complicated systems, or code with lots of state (e.g., things which depend on a database or talk to a network etc.). Hypothesis must receive an understanding of the input and output behavior that can be easily modelled.
  
* Hypothesis is **_not_** just a bug finder, it helps protect against _future_ bugs. Hypothesis disallows the existence of latent bugs which increases trust in the current implementation of whatever function is being tested. Hypothesis may also reveal weird design patterns. 

# Integrating Hypothesis into Sympy

Sympy is an ideal library for property based testing so integration was painless.

### What Has Changed in Sympy?

Hypothesis is now a required _testing_ dependency of sympy.  Property based tests can be created in the _test_hypothesis.py_ file in respective tests directories (More on this [here](https://github.com/sympy/sympy/blob/master/doc/src/contributing/new-contributors-guide/writing-tests.md#hypothesis-testing)). An example PBT file can be found in  [ntheory/tests](https://github.com/sympy/sympy/blob/master/sympy/ntheory/tests/test_hypothesis.py)
### Utilizing Hypothesis in Sympy

Hypothesis was able to find various bugs and code design flaws. Below I will highlight two:
* The resultant function returning [incorrect answers](https://github.com/sympy/sympy/issues/25406). While this bug ended up not needing to be resolved, it did  reveal the utility in having Hypothesis check [consistency between implementations](https://github.com/sympy/sympy/issues/25406#issuecomment-1652243538) of the same function.
  
* There were various issues with the lowest common multiple function ([here](https://github.com/sympy/sympy/issues/25624), [here](https://github.com/sympy/sympy/pull/25636), and [here](https://github.com/sympy/sympy/pull/25517#issuecomment-1714474991)), the biggest being when the lcm should make use of the integer implementation vs polynomial implementation (when the defined polynomial is essentially an integer).

# Thank you

Thank you to my mentors Aaron and Matthew for guidance during this project. Added thanks to Melissa and the general internship program for their support. 
