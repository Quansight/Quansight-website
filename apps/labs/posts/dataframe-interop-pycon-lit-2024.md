---
title: 'Dataframe interoperability - what\'s been achieved, and what comes next?'
authors: [marcogorelli]
published: April 9, 2024
description: 'An overview of the dataframe landscape, and solution to the "we only support pandas" problem'
category: [PyData ecosystem]
featuredImage:
  src: /posts/dataframe-interop-pycon-lit-2024/narwhals_small.jpg
  alt: 'Narwhals logo'
hero:
  imageSrc: /posts/dataframe-interop-pycon-lit-2024/narwhals_small.jpg
  imageAlt: 'Narwhals logo'
---

# DataFrame Interoperability

I attended PyConLithuania 2024, and had a blast! I don't speak Lithuanian, and probably
neither did half the attendees. But - so long as we all stuck to a simple and clear subset
of the English language - we could all understand each other and exchange ideas. I actually
wanted to learn some Lithuanian in preparation for the event, but Duolingo didn't offer such
a course, and as a millenial, I was out of options.

Dataframes, like languages, have their similarities and differences. If you learn a bit of
Spanish, you might think that "estoy embarazado" means "I'm embarrassed", but it actually
means "I'm pregnant". Similarly, after learning a bit of pandas and Polars, you might
expect
```python
import pandas as pd
import polars as pd

print((3 in pd.Series([1,2,3])) == (3 in pl.Series([1,2,3])))
```
to print `'True'` - but no so! pandas checks if `3` is in the index, whereas Polars checks
if `3` is in the values.

This little prelude was just to establish two premises:

- writing dataframe-agnostic code is hard!
- a simple and clear common language can enable collaboration

## pandas are everywhere

There's a great array of diverse dataframes out there. And the way that data science libraries
have typically to such diversity is to support pandas.

![Image showing a meeting in which one person is dismissed for suggesting that a library other
than pandas might be supported](/posts/dataframe-interop-pycon-lit-2024/pandas_everywhere.png)


This is nice, but comes with four major problems:

- for non-pandas users, they're forced to repeatedly convert to-and-from pandas, which isn't
  ergonomic;
- for users starting with data on GPU, they need to copy to CPU;
- users working with lazy evaluation need to materialise their data;
- pandas become a de-facto required dependency everywhere.

Before talking about how to solve all 4, let's talk about how to solve at least one of them.

## The Dataframe Interchange Protocol

The general idea is "write your library using dataframe X, and then if a user comes along with
dataframe Y, then you use the interchange protocol to convert dataframe X to dataframe Y".

![Image showing a pumpkin being fed to someone through a funnel. The input to the funnel is labelled
"Dataframe X", and the output "Dataframe Y"](/posts/dataframe-interop-pycon-lit-2024/interchange.png)

Let's look at how to use it - here's how you can convert any dataframe to pandas
(so long as it implements the interchange protocol):

```python
import pandas as pd

df_pandas = pd.api.interchange.from_dataframe(df_any)
```

Similarly, to convert to Polars:

```python
import polars as pl

df_pandas = pl.from_dataframe(df_any)
```

Note that although the `from_dataframe` function is standardised,
where it appears in the API isn't, so there's no completely agnostic way
of round-tripping back to your starting dataframe class.

Nonetheless, does it work? Is it reliable?

- Converting to pandas: reliable enough after pandas 2.0.2, though may sometimes
  raise unnecessarily in some versions. It's already used by the `seaborn` and
  `plotly` dataframe libraries.
- Converting from pandas: unreliable, don't use it. There are cases when the results
  are literal nonsense. These have generally been fixed, and will be available in
  pandas 3.0+. For now, however, if you're using the interchange protocol to convert
  to anything other pandas, then you may want to proceed with great care.

So as of April 2024, the interchange protocol can be used as a standardised version
of `to_pandas`. Going back to the four problems with only supporting pandas, the
interchange protocol partially addresses the first one (so long as the user doesn't
expect their computation to round-trip back to their original class), but not the others.

Addressing all four points seems ambitious - is it even possible?

## And now for something completely different: Narwhals

Look at how happy this panda and polar bear looking, chilling out with their narwhal friend:

![Image showing a panda, a polar bear, and a narwhal chilling out in an office together]
(/posts/dataframe-interop-pycon-lit-2024/narwhals_small.png)

As you may have guessed from the image, Narwhals aims to bring pandas and Polars together.

The way you write dataframe-agnostic code using Narhwals is:

1. Use `narwhals.from_native` to wrap any dataframe in a Narwhals class.
2. Use the subset of the Polars API supported by Narwhals.
3. Use `narhwlas.to_native` to return the object to the user in its original class.

If you follow these steps, then congrats, your code will work seamlessly across pandas,
Polars, Modin, and cuDF. But most importantly, GPU code can stay on GPU, and lazy code
can stay lazy!

To see a complete example of Narwhals in action, its website features little tutorial:
https://marcogorelli.github.io/narwhals/basics/complete_example/.

## Did you get deja-vu? Does this remind you of Ibis?

A related project is Ibis, which [presents itself as a dataframe standard](https://voltrondata.com/resources/open-source-standards),
and dispatches to 20+ backends. Some differences with Narwhals are:

- Narwhals is ~1000 times lighter
- Narwhals only supports 4 backends, Ibis more than 20
- Narwhals is new, whereas Ibis is mature and production-ready

The first point is a major differentiator:
if your objective is to make your dataframe library dataframe-agnostic, and package size is a concern to you,
then Narwhals is currently (as of April 2024) a more realistic solution - Ibis alone (310 MB) would put you above
the AWS Lambda package size limit (250MB).

Note that the projects are not in competition and have different goals. 

## Where do we go from here?

I'd like to conclude with a wishlist of things I'd like to see happen in the next year:

- I'd like to see data science become more dataframe-agnostic.
- I'd like to see more libraries support Polars (and other dataframe libraries) natively, instead
  of converting to pandas as an intermediate step.
- I hope to see the Polars API become more widespread, as opposed to all libraries trying to imitate pandas.

There's actually one item on my wishlist. It's way more ambitious that the above ones, and I don't
know if we'll ever see it happen. However, I'm a dreamer, so that's not going to stop me from hoping:

- I hope to see Duolingo finally add a Lithuanian course to their catalog.

That's it from me, I look forward to revisiting this post in one year's time to see in which direction
data science has gone.
