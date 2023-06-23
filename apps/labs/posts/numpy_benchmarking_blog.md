---
title: 'NumPy Benchmarking'
published: November 03, 2021
author: [khushi-agrawal]
description: 'My work was majorly focused on providing performance benchmarks to NumPy in realistic situations. The target was to show the world that NumPy is efficient in handling quasi real-life situations too.'
category: [Developer workflows]
featuredImage:
  src: /posts/numpy_benchmarking_blog/feature.png
  alt: 'A word cloud with themes, open-source projects and people mentioned throughout the blog post. Each is stylized using a different font, most of them calligraphical.'
hero:
  imageSrc: /posts/numpy_benchmarking_blog/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

In this blog post, I'll be talking about my journey in Quansight.
I want to share all things I was involved in and accomplished.
What issues I faced, and most importantly, what were awesome life hacks I learned during this period.

First of all, I'd like to express my gratitude to the whole team
for allowing me to be a part of such a great team.
My work was majorly focused on providing performance benchmarks to NumPy in realistic situations.
The target was to show the world that NumPy is efficient in handling quasi real-life situations too.

The primary technical outcome of my work is available in the [numpy documentation](https://deploy-preview-461--numpy-preview.netlify.app/benchmark/).

<p align="center">
      <img src = "/posts/numpy_benchmarking_blog/journey.jpeg" alt = "A word cloud with themes, open-source projects and people mentioned throughout the blog post. Each is stylized using a different font, most of them calligraphical." />
</p>

## My Experience
My work was broadly divided majorly into the following categories:

- **N-Body Problem**: The [N-Body problem](https://en.wikipedia.org/wiki/N-body_problem) is one of the most famous
and universally accepted problems for benchmarking.
I was given this as a problem statement to work on the project.
I started my work with a theoretical understanding of the problem.
I took reference from [Pierre Augier](https://github.com/paugier/nbabel) remarkable work on
[n-body](https://github.com/paugier/nbabel) problem. I'd love to thank him.
It was a fun learning part for me to connect the scientific part with the programming world.
I implemented the N-Body problem in Python, C, and C++.

- **Compiled Methods**: This part was the most exciting part of the project.
I got introduced to various compiled methods like [Cython](https://cython.readthedocs.io/en/latest/),
[Pythran](https://pythran.readthedocs.io/en/latest/), [Numba](http://numba.pydata.org/), [Transonic](https://transonic.readthedocs.io/en/latest/).
It was the first time when I got to know about accelerators.
I visited their documentations, GitHub, and searched popular blogs about compiled methods.
I loved playing with them. I read the theory part, looked into the examples,
and implemented them in my editor. It was a great learning experience for me
to get familiar with compiled methods.
I implemented the jitted compilation mode in Pythran and Numba for benchmarking via Transonic's support.

- **Visualization**: I used the [Matplotlib](https://matplotlib.org/) library for visualizing the benchmarking results.
I tried various plots to verify which one suits best,
like scatter plots, box plots, line charts, the combination of the scatter plots and line charts, etc.
But these were not good to go.
Those plots either lacked clarity or were not capable of providing significant results.
We finalized decided on two bar charts, with different vertical scales to accomodate
the vastly different performance of Python vs the compiled methods.
We also normalized the data to show trends as the number of particles increased.

- **Model Optimization**: Model Optimization was one of the most exciting parts for me to work.
I like playing with codes. The main task was to ensure
we were obtaining similar results in all the implemented algorithms.
I revisited all the code I had executed earlier. At this stage,
I was able to find out errors in my code and had an idea to improve it.
The final aim was to achieve the same results in each step at a minimal time.
Steps I followed to attain it:

	- Initially, I played around with the library functions to check out which library function gave the best results.

	- I then turned my focus to reduce the number of loops.
And I'll say hats off to the *Vectorized Approach* of the NumPy.
NumPy achieved a speed of more than 10% faster than Python.
The compelling thing is the changing behavior of NumPy from
python-like performance to compiled-like performance.

	- The only task left was to verify whether we got the same results in all the cases.
Initially, I wanted to make my code as compact as possible.
Hence I focused on using more NumPy functions, but this, in turn,
led to a decrement in the readability of code and made my code more complex.
I learned that the structure of the code should be made easier to understand for the end-user.
The ultimate goal was to prove that NumPy performs well even without using its unique functions.

The following is the output of my work:

<img src = "/posts/numpy_benchmarking_blog/performance_benchmarking.png" alt = "A visual representation to compare the performance of NumPy with various languages like Python, C++, and accelerators like Numba, and Pythran." title = "Performance Benchmark; Number of Iterations: 50" />

--- TEASER END ---

## Relevant Links

- **The issue I worked on**: [#370](https://github.com/numpy/numpy.org/issues/370) Add content on performance (e.g., benchmarks, mention accelerators).

- **PR's**: [#461](https://github.com/numpy/numpy.org/pull/461), [#1](https://github.com/numpy/numpyorg-benchmarks/pull/1), [#2](https://github.com/numpy/numpyorg-benchmarks/pull/2)

- **The Repository**: [numpyorg-benchmarks](https://github.com/numpy/numpyorg-benchmarks), [numpy-benchmarks](https://github.com/khushi-411/numpy-benchmarks)

- **Issue**: The most interesting issue I faced was using the vectorized approach in Pythran's implementation. I mentioned that [here](https://github.com/khushi-411/numpy-benchmarks/issues/4).

## Other Technical Work

- **Benchmarking Environment**: I enjoy changing my OS and love to taste different environments.
But it was the first time I isolated a certain number of CPU cores for accurate benchmarking results.
I referred to the official documentation of [pypref](https://pyperf.readthedocs.io/en/latest/)
and visited more than ten blogs to understand the idea.
It was a fun learning part.

- **Git**: Getting familiar with various git commands was one of the most incredible things
I became comfortable with it while working at Quansight.

## Advice to the Beginners

- **Getting Familiar with the importance of the project**: I believe:
'To find joy in the work, the most important task is to know where it started from.'
Read the previous discussions made and know the reason for the importance of your project.
I started my work with its origin. I read the issue related to benchmarking,
articles, and other related work.
I visited benchmarking pages of other libraries, too, to get the idea.
Among which the [micro-benchmarks of NumPy](https://pv.github.io/numpy-bench/) using ASV are the best.
It's too lovely!

- **Search everything about your project in the first 3-4 days**: At this part,
you need to get familiar with all the possible dots of your project.
Look into as many related works of your project and examine
the positive and negative points of the proposed work.
Now it's high time to give structure to your project.
I was pretty much sure about my work.
After getting familiar with the problem statement,
I read various other proposed projects related to benchmarking.
A few of them were [initialcontiditions.org](http://initialconditions.org/),
[benchmarks game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/), [Julia's micro-benchmarks](https://julialang.org/benchmarks/);
there were a few more.
I agree that it took more than three days for me to complete,
but I learned specific life hacks, which I'm pretty sure
that I will implement in every project.
Make sure not to dig too deep into the topic.
First, know the width, then dive into the depth and
ensure that you are focusing on the subject.

- **Start working**: Here is where the journey starts.
The best way to express yourself is to present everything that you have completed.
Ask doubts as much as you can. But make sure that you have spent quality time in it.
I used to update my mentor Matti Picus each day about the progress of our work.
I am so glad to get such a responsive and understanding mentor.

- **Learn to prioritize things & make connections** (make sure to express yourself).
I learned to make connections with people being in Quansight.
It was my first professional experience.
I realized that the world is entirely different.
I still remember my first presentation (near about a year back) in my college.
I was not even able to speak up, but I worked on my communication skills.
I am pleased that within a few months, I interacted with such great personalities in The Quansight.
And I am pretty sure it will go on and on!

## My Next Step
Quansight has opened lots of great opportunities for me.
I aim to make myself more comfortable in resolving problems and bugs.
Soon, I am looking forward to contributing to other issues in NumPy and other Open Source Projects.
It was one of the best learning experiences for me.

## Acknowledgment
I want to thank [Quansight](https://github.com/Quansight-Labs)
for allowing me to work in such a great environment.
I am grateful to my mentors, [Matti Picus](https://github.com/mattip) and [Ralf Gommers](https://github.com/rgommers)
for all their guidance and support throughout the internship timeline.
I'd also like to thank [Melissa Weber Mendonça](https://github.com/melissawm) for sharing cool ideas about our project.

Special thanks to [Kushashwa Ravi Shrimali](https://github.com/krshrimali) and [Kshitij Kalambarkar](https://github.com/kshitij12345)
for sharing their cool learning tricks and life hacks.

Thanks to y'll! It was great interacting with y'll.
