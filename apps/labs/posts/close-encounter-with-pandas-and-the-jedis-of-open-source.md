---
title: 'Close Encounter with pandas and the Jedis of open source'
published: Novermber 1, 2022
author: dennis-chukwunta
description: 'Learning from awesome mentors and contributing to pandas open source' 
category: [Community, Developer workflows, OSS Experience, PyData ecosystem]
featuredImage:
  src: /posts/close-encounter-with-pandas-and-the-jedis-of-open-source/blog_hero_lightsaber.jpg
  alt: 'An illustration of a hand holding up a lightsaber, with some graphical elements highlighting the glowing plasma and a pandas face'
hero:
  imageSrc: /posts/close-encounter-with-pandas-and-the-jedis-of-open-source/blog_hero_lightsaber.jpg
  imageAlt: 'An illustration of a hand holding up a lightsaber, with some graphical elements highlighting the glowing plasma and a pandas face'
---
(The opening crawl) A long time ago (2008) in a [company](https://www.aqr.com/) far, far away…

…pandas was created. Come 2009 it was open-sourced and it's currently, and 
actively, being supported by a community of like-minded individuals around the 
world who contribute their valuable time and energy to help make open-source pandas possible.

This is a blog about my journey as an intern for Quansight contributing to the 
Pandas Library and my interactions with the "*Force-sensitive*" mentors and 
maintainers that made the journey a success. 

Featuring mentors like 
[Noa Tamir](https://github.com/noatamir) as Noa, [Aaron Meurer](https://github.com/asmeurer) as Aaron, 
[Jaime Rodríguez-Guerra](https://github.com/jaimergp) as Jaime, and 
[Melissa Weber Mendonça](https://github.com/melissawm) as Melissa.

### The opening

There will only be a journey with first being a captain to navigate. Melissa is the captain of this voyage and one 
of the incredible developers from Quansight Labs that is responsible for organizing the internship this year. She 
introduced us to the team, broke down the internship timeline and I got to know my project, pandas, as well as 
mentors, Noa and Aaron.

The need for a padawan to have a mentor was apparent immediately. Setting up the environment was not as 
straightforward as creating a virtual environment and installing packages from requirements.txt. Building the 
environment with the pip package manager required that some packages be installed on my local machine as a 
pre-requisite. Not knowing what these packages were meant that I had to keep bumping into dependency issues. From 
missing packages like Postgres, Cython, to an hdf5 nut that was a little hard to crush. I talked with my mentor, 
Noa, and discovered she uses an M1 mac just like I did. With her guidance, I checked out other alternatives on the 
pandas documentation. I discovered that the conda package manager was better equipped to handle setting up the 
environment and building the package locally. Further discussions with my mentor, Aaron, filled in the gap in my 
knowledge about the various missing packages and revealed the solution to fix it.

### Standing up to pandas

I wasted no time in jumping straight to the issues I was assigned. This was a mistake. These issues were related 
to pandas standardization (like consistency in how pandas handle empty inputs, removing the `inplace` argument from 
most of pandas operations, and consistency for pandas column names and more) but, as I am new to the project,  I 
found most of the issues overwhelming. So many discussions have been made on the issues but not much of a general 
consensus on how they should be tackled. Luckily for me, I didn't need to have midichlorians to contribute and, 
most of all, I had mentors. Noa suggested that I tackle simpler issues to familiarize myself with the project and 
learn the steps required to make contributions to pandas.

Three issues and three pull requests later, I learned about building the Cython library every time I pulled new 
changes from remote origin, how to always do pre-commit, how to write proper tests, how to submit issues and pull 
requests, and how to document fixes.

### Comments, tests, and a table

> Being a developer is more than just typing code

Having been involved in other internships, with the most recent being the [MLH Fellowship](https://fellowship.mlh.io) 
and [Outreachy](https://www.outreachy.org/), I had to write a significant amount of code which was my 
metric for measuring a developer at the time. This idea nursed a little bit of doubt in me as an intern 
who was doing more reading and communicating rather than writing code. But luckily "*being a developer is 
more than just typing code*", paraphrasing Malissa's comment when I made a pseudo-complaint about my 
internship experience thus far (bearly a month in at the time).

Since most people working on open-source projects are usually not paid to make contributions, there are 
lots of features to be implemented, tests to be performed and documentation to write. Noa mentioned that 
part of being a maintainer was doing actual maintenance and this involves things like "testing all pandas 
operations with empty inputs and documenting the findings", "improving the documentation for some 
operation or method" or "writing an internal documentation for a feature".

There was a need to understand what was expected and having read the already cold discussion on the issue 
to maintain consistency for panda's operation on empty inputs, It turned out though that there haven't 
been many tests written on empty inputs and some of the results are a little unpredictable. For example, given

```python
    import pandas as pd

    empty_df = pd.DataFrame({"a": [], "b": []})
    gb = empty_df.groupby("a", group_keys=True)
    group = getattr(gb, "b")
    group.apply("sum") # Returns an empty series, which is understandable since the group is empty.
    # But trying to get a sample of an empty group, returns an error
    group.sample() # Returns ValueError: need at least one array to concatenate

```
Making this discovery was only possible because my mentors had advised me to create a list of pandas 
operations and tested them with empty inputs. It was really brilliant because it gave a very clear picture 
of the various inconsistencies in handling empty inputs and allowed for interest in the issue to be 
rekindled. Here's a cutout from the table showing some GroupBy methods acting on empty dataframes.

| Method    | Example                                                                                                                                                   | Return                                                           |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| apply()   | # Create a single row dataframe d = {'root_id': [], 'side': []} df = pd.DataFrame(data=d)   df.groupby(['root_id'])   .apply(lambda x: x['side'].iloc[0]) | IndexError : single positional indexer is  out-of-bounds         |
| take()    | df = pd.DataFrame({'a': [], 'b': []}) df.groupby('a').take([0])                                                                                           | IndexError : single positional indexer is  out-of-bounds         |
| sample()  | df = pd.DataFrame({'a': [], 'b': []}) df.groupby('a').sample()                                                                                            | ValueError:  need at least one array to concatenate              |
| boxplot() | df.groupby('a').boxplot()                                                                                                                                 | ValueError : Number of columns must be a positive integer, not 0 |


### Gaining an audience with pandas' Jedi Council

Communicating these findings was the next challenge. There wasn't a clear 
understanding for me of what consistency needed to be maintained. I 
created a few issues, made some pull requests, and got very few responses 
and comments. More discussion was needed. Noa, being an excellent 
communicator, secured an audience with some pandas maintainers and after a 
few comments from maintainers like [Joris Van den Bossche](https://github.com/jorisvandenbossche), 
[Richard Shadrach](https://github.com/rhshadrach) and [JHM Darbyshire](https://github.com/attack68), 
a better picture on what is expected and the best approach to fixing the issue was painted.

### Debugging, ain't like dusting crops

One of the most exciting parts of my internship has been learning how experienced developers went about 
debugging and solving problems. Jaime held a live-coding section where he did exactly that with a project 
he was working on for conda forge. It was an issue with errors on the CI (continuous integration) that 
wasn't reproducible on his local machine. He had a list of hypotheses and he meticulously updated this 
list as new information was presented from each fix he attempted. It was obvious that "*the force is strong 
with this one*" and I had so much fun learning and laughing at both the situation and his jokes (he's a 
very funny jedi 😆). 

Aaron had a very particular way of seeing a problem and accessing a possible solution. It involved looking 
at how other packages handled similar problems, trying out examples (using toys as Noa once mentioned), 
and debugging using the python debugger, PuDB. This was a new tool for me as I previously had to rely on 
using print statements or the VS code debugger (which was pretty much a hit-or-miss with every 
configuration for a new project). After just one live session with him and an [article](https://asmeurersympy.wordpress.com/2010/06/04/pudb-a-better-python-debugger/) 
written by him back in 2010 that I found on the internet, I was equipped with a newfound power for 
improving productivity. Instead of having a bunch of print statements that don't necessarily show you the 
state of the program during execution and the call stack, I can simply just add breakpoints and pass the *—-pudb* flag when calling the program and have access to all those information. Awesome!😎

### A UDF, a regression, and a fix

Most of the operations that had inconsistencies with empty inputs were quite easy to fix once the general consensus 
was for an empty DataFrame/Series to be returned if the input is empty (and not an error message), but this didn't 
fix the case for UDFs (user-defined functions).

```python
    import pandas as pd

    empty_df = pd.DataFrame({"a": [], "b": []})
    gb = empty_df.groupby("a", group_keys=True)
    group = getattr(gb, "b")
	  # Given the UDF
	  def last_value(gb):
        return gb.values[-1]
    
    # The inconsistency
	  group.agg("sum") # Returns an empty Series
	  # But
	  group.apply(last_value) # Returns IndexError
```
This was a regression issue. Further investigation revealed that as at pandas 1.4 this issue did not exist. In 
other to maintain consistency I needed to know the particular update to blame for this behavior. Aaron suggested I 
check out git bisect. It uses binary search to find the commit that introduced a bug. Really cool. 🤓

> Understanding the problem is more than half the solution

After a few conversations and making a few suggested fixes, a solution that maintained consistency with the older 
version and passed all tests for the current version was selected. The fix was easy; if the groups_key equals zero 
it means the input was empty and if the function being called on the group isn't one of these aggregate functions 
*("mad", "skew", "sum", "prod")* then the function won't be called. Proper tests were written (revisioned several 
times to properly convey the fix and cover all known corner cases) and the fix was merged.

### Internal documentation, the journey ahead, and a new hope

The last few weeks of my internship were interrupted by some unforeseen events. An unfortunate encounter with some 
corrupt law enforcement officers (a daily struggle in my country) and an immediate mandate to return back to school 
(thrust me straight into exams) after seven months of industrial strike action. Fortunately for me, through the 
help of my mentors, I got an extension on my internship (more time to focus on writing this blog and closing all 
open issues). I am working on writing internal documentation for GroupBy. GroupBy is a big part of pandas and this 
issue proved to be tougher than I thought as internal documentation requires some background knowledge of the 
thought process adopted at the time when a feature was been implemented (these are usually hinted at with comments 
in the code but still they aren't always sufficient in providing clarity).

The internship might have come to an end, with me writing this blog, but the journey from Tatooine is only just 
beginning. I intend to maintain a relationship with my mentors at Quansight and the maintainers at pandas.

It really has been a journey of enlightenment, knowledge, fun, connection, growth, and Force Awakening. 

I have a greater appreciation now for maintainers in Open Source and I hope to become a major maintainer myself someday. *"It's like poetry, they rhythm"*.😉

### Closing credits - Everyone gets a medal

Condensing my internship experience into this blog post hasn't really been a breeze. So many activities and lesson 
learned has been left out. The weekly activities like Qshare, where developers discuss on what they are working on, 
internship share, where interns discuss on their progress, issues, and limitations and so many other activities 
that promote connection, collaboration, and a sense of community. I had such a great time meeting the people that 
contribute to improving the PyData ecosystem.

My special thanks to all the members and staff of Quansight Labs and the pandas maintainers. It really has been an 
incredible experience being part of the community.
