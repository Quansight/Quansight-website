---
title: "What's New in SymPy 1.4"
published: May 5, 2019
authors: [aaron-meurer]
description: "SymPy 1.4 was released on April 9, 2019. In this post, I'd like to go over some of the highlights for this release."
category: [PyData ecosystem]
featuredImage:
  src: /posts/whats-new-in-sympy-14/blog_feature_org.png
  alt: 'An illustration of a brown and a dark brown hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/whats-new-in-sympy-14/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

As of November, 2018, I have been working at
[Quansight](https://www.quansight.com/), under the heading of [Quansight
Labs](https://labs.quansight.org). Quansight Labs is a public-benefit
division of Quansight. It provides a home for a "PyData Core Team" which
consists of developers, community managers, designers, and documentation
writers who build open-source technology and grow open-source communities
around all aspects of the AI and Data Science workflow. As a part of this, I
am able to spend a fraction of my time working on SymPy.
[SymPy](https://www.sympy.org/en/index.html), for those who do not know, is a
symbolic mathematics library written in pure Python. I am the lead maintainer
of SymPy.

SymPy 1.4 was released on April 9, 2019. In this post, I'd like to go over
some of the highlights for this release. The full release notes for the
release can be found on the [SymPy
wiki](https://github.com/sympy/sympy/wiki/Release-Notes-for-1.4).

To update to SymPy 1.4, use

```bash
conda install sympy
```

or if you prefer to use pip

```bash
pip install -U sympy
```

The SymPy 1.4 release contains over [500 changes from 38 different
submodules](https://github.com/sympy/sympy/wiki/Release-Notes-for-1.4#authors),
so I will not be going over every change, but only a few of the main
highlights. A [total of 104
people](https://github.com/sympy/sympy/wiki/Release-Notes-for-1.4#authors)
contributed to this release, of whom 66 contributed for the first time for
this release.

While I did not personally work on any of the changes listed below (my work
for this release tended to be more invisible, behind the scenes fixes), I did
do the release itself.

# Automatic LaTeX rendering in the Jupyter notebook

Prior to SymPy 1.4, SymPy expressions in the notebook rendered by default with their
string representation. To get `LaTeX` output, you had to call `init_printing()`:

![Code snippet in an interactive Jupyter session showing the usage of init_printing in SymPy 1.3 for LaTeX.](/posts/whats-new-in-sympy-14/sympy-1.3-notebook.png)

In SymPy 1.4, SymPy expressions now automatically render as LaTeX in the notebook:

![Code snippet in an interactive Jupyter session showing default LaTeX printing mode for SymPy expressions in version 1.4.](/posts/whats-new-in-sympy-14/sympy-1.4-notebook.png)

However, this only applies automatically if the type of an object is a SymPy
expression. For built-in types such as lists or ints, `init_printing()` is
still required to get LaTeX printing. For example, `solve()` returns a list,
so does not render as LaTeX unless `init_printing()` is called:

![Code snippet in an interactive Jupyter session showing the usage of init_printing for list objects in version 1.4.](/posts/whats-new-in-sympy-14/sympy-1.4-notebook-2.png)

`init_printing()` is also still needed if you want to change any of the
printing settings, for instance, passing flags to the `latex()` printer or
selecting a different printer.

If you want the string form of an expression for copy-pasting, you can use
`print`.

# Improved simplification of relational expressions

Simplification of relational and piecewise expressions has been improved:

```pycon
>>> x, y, z, w = symbols('x y z w')
>>> init_printing()
>>> expr = And(Eq(x,y), x >= y, w < y, y >= z, z < y)
>>> expr
x = y ∧ x ≥ y ∧ y ≥ z ∧ w < y ∧ z < y
>>> simplify(expr)
x = y ∧ y > Max(w, z)
```

```pycon
>>> expr = Piecewise((x*y, And(x >= y, Eq(y, 0))), (x - 1, Eq(x, 1)), (0, True))
>>> expr
⎧ x⋅y   for y = 0 ∧ x ≥ y
⎪
⎨x - 1      for x = 1
⎪
⎩  0        otherwise
>>> simplify(expr)
0
```

# Improved MathML printing

The MathML presentation printer has been greatly improved, putting it on par
with the existing Unicode and LaTeX pretty printers.

```pycon
>>> mathml(Integral(exp(-x**2), (x, -oo, oo)), 'presentation')
<mrow><msubsup><mo>&#x222B;</mo><mrow><mo>-</mo><mi>&#x221E;</mi></mrow><mi>&#x221E;</mi></msubsup><msup><mi>&ExponentialE;</mi><mrow><mo>-</mo><msup><mi>x</mi><mn>2</mn></msup></mrow></msup><mo>&dd;</mo><mi>x</mi></mrow>
```

If your [browser supports MathML](https://caniuse.com/#feat=mathml) (at the
time of writing, only Firefox and Safari), you should see the above
presentation form for `Integral(exp(-x**2), (x, -oo, oo))` below:

<math style={{display: 'block'}}>
<mrow><msubsup><mo>&#x222B;</mo><mrow><mo>-</mo><mi>&#x221E;</mi></mrow><mi>&#x221E;</mi></msubsup><msup><mi>&ExponentialE;</mi><mrow><mo>-</mo><msup><mi>x</mi><mn>2</mn></msup></mrow></msup><mo>&dd;</mo><mi>x</mi></mrow>
</math>

<br />

# Improvements to solvers

Several improvements have been made to the solvers.

```pycon
>>> eq = Eq((x**2 - 7*x + 11)**(x**2 - 13*x + 42), 1)
>>> eq
                2
               x  - 13⋅x + 42
⎛ 2           ⎞
⎝x  - 7⋅x + 11⎠               = 1
>>> solve(eq, x) # In SymPy 1.3, this only gave the partial solution [2, 5, 6, 7]
[2, 3, 4, 5, 6, 7]
```

The ODE solver, `dsolve`, has also seen some improvements. Two new hints have
been added.

`'nth_algebraic'` solves ODEs using `solve` by inverting the derivatives
algebraically:

```pycon
>>> f = Function('f')
>>> eq = Eq(f(x) * (f(x).diff(x)**2 - 1), 0)
>>> eq
⎛          2    ⎞
⎜⎛d       ⎞     ⎟
⎜⎜──(f(x))⎟  - 1⎟⋅f(x) = 0
⎝⎝dx      ⎠     ⎠
>>> dsolve(eq, f(x)) # In SymPy 1.3, this only gave the solution f(x) = C1 - x
[f(x) = 0, f(x) = C₁ - x, f(x) = C₁ + x]
```

`'nth_order_reducible'` solves ODEs that only involve derivatives of `f(x)`,
via the substitution $g(x)=f^\{(n)\}(x)$.

```pycon
>>> eq = Eq(Derivative(f(x), (x, 2)) + x*Derivative(f(x), x), x)
>>> eq
               2
  d           d
x⋅──(f(x)) + ───(f(x)) = x
  dx           2
             dx
>>> dsolve(eq, f(x))
                  ⎛√2⋅x⎞
f(x) = C₁ + C₂⋅erf⎜────⎟ + x
                  ⎝ 2  ⎠
```

# Dropping Python 3.4 support

This is the last release of SymPy to support Python 3.4. SymPy 1.4 supports
Python 2.7, 3.4, 3.5, 3.6, 3.7, and PyPy. What's perhaps more exciting is that
the next release of SymPy, 1.5, which will be released later this year, will
be the last version to support Python 2.7.

Our
[policy](https://github.com/sympy/sympy/wiki/Python-version-support-policy) is
to drop support for major Python versions when they reach their [End of
Life](https://devguide.python.org/#status-of-python-branches). In other words,
they receive no further support from the core Python team. Python 3.4 reached
its end of life on May 19 of this year, and Python 2.7 will reach its end of
life on January 1, 2020.

I have [blogged in the
past](https://www.asmeurer.com/blog/posts/moving-away-from-python-2/) on why I
believe it is important for library authors to be proactive in dropping Python
2 support, and since then [a large number of Python
libraries](https://python3statement.org) have either dropped support or
announced their plans to by 2020.

Having Python 2 support removed will not only allow us to remove a [large
amount of compatibility
cruft](https://github.com/sympy/sympy/blob/sympy-1.4/sympy/core/compatibility.py)
from our codebase, it will also allow us to use some Python 3-only features
that will clean up our API, such as [keyword-only
arguments](https://python-3-for-scientists.readthedocs.io/en/latest/python3_advanced.html#keyword-only-arguments),
[type
hints](https://python-3-for-scientists.readthedocs.io/en/latest/python3_features.html#function-annotations),
and [Unicode variable
names](https://python-3-for-scientists.readthedocs.io/en/latest/python3_features.html#unicode-variable-names).
It will also enable [several internal
changes](https://github.com/sympy/sympy/issues?q=is%3Aissue+is%3Aopen+label%3A"Dropping+Python+2")
that will not be visible to end-users, but which will result in a much cleaner
and more maintainable codebase.

If you are still using Python 2, I strongly recommend switching to Python 3,
as otherwise the entire ecosystem of Python libraries is soon going to stop
improving for you. Python 3 is already highly recommended for SymPy usage due
to several key improvements. In particular, in Python 3, division of two
Python `int`s like `1/2` produces the float `0.5`. In Python 2, it does
integer division (producing `1/2 == 0`). The Python 2 integer division
behavior can lead to very surprising results when using SymPy (imagine writing
`x**2 + 1/2*x + 2` and having the `x` term "disappear"). When using SymPy, we
[recommend](https://docs.sympy.org/latest/tutorial/gotchas.html#two-final-notes-and)
using rational numbers (like `Rational(1, 2)`) and avoiding `int/int`, but the
Python 3 behavior will at least maintain a mathematically correct result if
you do not do this. SymPy is also [already faster in Python
3](https://speed.python.org/comparison/?exe=12%2BL%2Bmaster%2C12%2BL%2B3.5%2C12%2BL%2B3.6%2C12%2BL%2B2.7&ben=666%2C667%2C669%2C668&env=1%2C2&hor=false&bas=none&chart=normal+bars)
due to things like `math.gcd` and `functools.lru_cache` being written in C,
and general performance improvements in the interpreter itself.

# And much more

These are only a few of the highlights of the hundreds of changes in this
release. The full release notes can be found on [our
wiki](https://github.com/sympy/sympy/wiki/Release-Notes-for-1.4). The wiki
also has the in progress changes for our next release, [SymPy
1.5](https://github.com/sympy/sympy/wiki/Release-Notes-for-1.5), which will be
released later this year. Our [bot](https://github.com/sympy/sympy-bot)
automatically collects release notes from every pull request, meaning SymPy
releases have very comprehensive and readable release notes pages. If you see
any mistakes on either page, feel free to edit the wiki and fix them.
