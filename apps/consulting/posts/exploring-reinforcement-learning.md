---
title: 'Exploring Reinforcement Learning'
published: October 28, 2021
author: dillon-roach
description: 'Reinforcement learning, a type of machine learning, can tackle a wide range of complex issues. Some of the applications include autonomous driving, robotics, trading strategies, healthcare treatment policy, warehouse management, strategic game theory, and many others. The list goes on long enough that one might be tempted to see the technology as magic. If you have big challenges in need of novel solutions, then this post is for you.'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/exploring-reinforcement-learning/reinf_learn_preview.webp
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

[Reinforcement learning][reinforcement learning], a type of machine learning,
can tackle a wide range of complex issues. Some of the applications include
autonomous driving, robotics, trading strategies, healthcare treatment policy,
warehouse management, strategic game theory, and many others. The list goes on
long enough that one might be tempted to see the technology as magic. If you
have big challenges in need of novel solutions, then this post is for you.

![](/posts/exploring-reinforcement-learning/reinf_learning.png)

Arthur C. Clark penned three adages in the '60s and '70s that became known as
his three laws. If you read many tech blogs, you probably know the third law,
which reads

> Any sufficiently advanced technology is indistinguishable from magic.

The author of said blog is usually quoting this line while standing in awe
before an impressive new tool or research development. And rightly so; there are
many technological marvels these days. Here, however, we want to take the line
with a different inflection:

> At the heart of some seemingly magical feats lies technology - developed,
> practiced, and understood.

Reinforcement learning is one such case. At the core of this technology is a
simple objective: given a set of observations, produce actions that return the
greatest reward. Depending on the implementation, the reward can be short-term,
long-term, or cooperative with other trained reinforcement learning models. From
this basic concept we get a wide array of applications:

- [Multiple agent cooperation - Hide and seek][emergent tool use]
- [Efficient and targeted COVID-19 border testing][covid19 border testing]
- [Aircraft traffic control][aircraft traffic control]
- [Fully autonomous race cars][deepracer]
- [Datacenter cooling and industrial control][data center rl]
- [Game strategy][alphago summit]
- [Manufacturing dispatching][manufacturing dispatching]

In each of these examples, the [computer agent(s)][intelligent agent] is the
core code that perceives the environment, takes action, and learns from it. A
given agent will start knowing very little about tasks set out before it. It
will have a list of available actions it is allowed to take, a set of things in
the environment to pay attention to, and a reward function it is attempting to
maximize. As the agent explores and experiences the environment, the
observations and actions associated with each experience generate rewards to
facilitate learning. There may be a [host of tricks][rl intro2] employed to
optimize learning speeds, focus on growth over near-sighted solutions,
generalize learning, and so on, but they all share a common learning cycle:

1. Observe the environment (state variables)
2. Predict and execute the best action based on past experience
3. Calculate a reward based on the outcome of the action
4. Update the agent’s brain (neural network) to improve future actions

![](/posts/exploring-reinforcement-learning/reinf_learn_diagram_rescale.svg)

This cycle of observe-act-evaluate-learn is repeated many times during a single
learning episode. After each episode, the environment is reset, but the agent
retains its previous experiences. With each new episode, the agent tries
different actions, explores different aspects of the environment, and continues
to learn.

As an example, imagine our robot (agent) from the picture above is tasked with
picking up toys in a child’s room; we’ll say the robot knows how to move and
pick up objects, but doesn’t yet know what the toys are or what should be done
with them. The robot will likely progress through learning like this:

1. It wanders aimlessly until it happens upon a toy and receives a reward.
2. Because of that learned experience, it will start to find toys faster.
3. It continues to explore by picking things up and putting them down.
4. It learns that placing toys in the toy box earns a higher reward, and the
   faster it performs this action, the higher the reward.
5. It continues to perform actions that earn the highest reward, but once in a
   while, it tries something new.
6. It continues to perform actions until its efficiency and accuracy no longer
   increase substantially.

Depending on the complexity of the environment and the agent's goals, the agent
may learn everything it needs to know in relatively short order. In more complex
cases, the agent may need much more experience to come to reasonable solutions.
For example, in the [OpenAI hide and seek study][emergent tool use] mentioned
above, they trained on hundreds of millions of episodes - billions of
time-steps. In the larger, more complex cases, the architecture of the learning
pipeline becomes significant itself.

To be clear, this is not an exhaustive search where the computer simply
brute-forces every possible action/environment combination and returns the best
it found - that is possible with certain small-scale scenarios, but would be
dauntingly expensive, and often impossible, for large scenarios requiring
exploration of countless (infinite) combinations. Instead, successful
reinforcement learning algorithms use various techniques to learn optimal action
policies in comparatively short order. In other words, they learn to fill the
gaps between what they have experienced and what they have not, a.k.a inference.

So far you've learned some fundamental concepts of reinforcement learning. If
you would like to work toward a deeper understanding, we are preparing
[a few tutorials][practical rl course] to help you make your own models and gain
practical insight into reinforcement learning. By following the tutorials, you
will help a robot ant learn to walk and accomplish tasks. We hope these help you
feel empowered to implement reinforcement learning on your own.

[reinforcement learning]: https://en.wikipedia.org/wiki/Reinforcement_learning
[emergent tool use]: https://openai.com/blog/emergent-tool-use/
[covid19 border testing]: https://www.nature.com/articles/s41586-021-04014-z
[aircraft traffic control]: https://web.stanford.edu/class/aa228/reports/2019/final103.pdf
[deepracer]: https://aws.amazon.com/deepracer/
[data center rl]: https://deepmind.com/blog/article/safety-first-ai-autonomous-data-centre-cooling-and-industrial-control
[alphago summit]: https://www.deepmind.com/research/highlighted-research/alphago/the-future-of-go-summit
[manufacturing dispatching]: https://arxiv.org/abs/1910.02035
[intelligent agent]: https://en.wikipedia.org/wiki/Intelligent_agent
[rl intro2]: https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html
[practical rl course]: https://github.com/Quansight/Practical-RL
