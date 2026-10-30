---
title: 'Important but not urgent issues in the age of AI'
published: September ??, 2026
authors: [marco-gorelli]
description: "Let's get things done"
category: [??]
featuredImage:
  src: 
  alt:
hero:
  imageSrc: 
  imageAlt:
---

We all get our important and urgent tasks done because, by definition, we have no choice. But what about the important but not urgent ones? Let's talk about why they're so valuable, and about how they're changing in the age of agentic programming.

## The Eisenhower matrix

If the intro paragraph sounded familiar to your, it may be because you've already encountered the concept of the _Eisenhower Matrix_. The idea is to subdivide your tasks by importance and urgency and then to act accordingly:

1. Important and urgent: do.
2. Important and not urgent: schedule.
3. Not important and urgent: delegate (at least, according to the original matrix...).
4. Not important and not urgent: delete.

I've never understood the third item on the list, but never mind, that's not what this article is about. Let's address the second one: important but not urgent tasks. And let's be honest - none of us spend enough time on them. We're either doing the important and urgent ones (because, no choice) or the unimportant and not urgent ones (because they're kind of easy and they give us the illusion of productivity).

Here's some examples of open source issues belonging to each category:

1. your tool silently does the wrong thing.
2. your test suite doesn't cover certain kinds of test data.
3. Not important and urgent: your code raises in a place where it shouldn't. Some users have noticed this and, although a workaround exists, they're demanding that this be fixed.
4. Not important and not urgent: you want to rewrite some tests to use `pytest.mark.parametrize` instead of iterating over the test cases within the test.

I'm fairly confident that most of us have spent more time than we're proud of addressing issues in the fourth category, and haven't given enough attention to those in the second one.

Lately, however, things have been changing. It's relatively easy to point an AI agent at a few GitHub of these issues and get it to fix them while you do other work. Fixing these important but not urgent issues is not longer a matter of "if I do this, I need to de-prioritise more impactful work". An agent can do it, you then check the results, and you ship them. The problems have already been formulated, and getting started is as easy as "Fix this issue: <>".

## The only useful agentic programming tip I ever received

> "Run your agent in a Docker container with read-only access to GitHub, and then skip permissions"

That's what Ralf Gommers told me. Once I tried it, I excitedly told others about it, only to realise that this is what nearly everyone was already doing. Turns out I was the one not keeping up with the times. Nonetheless, I think there are still people in my same boat, so I'll share my setup anyway in case it's useful to anyone (or, as will more likely be the case, in case anyone offers suggestions for improvement).

First off, I've got [Claude for open source](https://claude.com/contact-sales/claude-for-oss). Next, I have [Docker](https://www.docker.com/) installed on my (Windows) machine, but I do development using the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install). Finally, I have a [setup_docker skill](https://gist.github.com/MarcoGorelli/9950d3f3762768e15f77f53a86f3abde) saved at `~/.claude/skills/setup-docker/SKILL.md`. With all that in place, here's the steps I take when addressing some open source issues. Let's say for example that I'm working on [Narwhals](https://github.com/narwhals-dev/narwhals) so I'll use that as an example:

1. In GitHub, make a fine-grained token with access to my fork of the Narwhals repository. I give it read-only access to: issues, discussions, contents, actions, metadata, and pull requests.
2. I save the token in ` ~/.config/claude-docker/narwhals-dev.env` as `GH_TOKEN=<token goes here>`.
3. Inside my clone of a repo, run `claude` and then `/setup_docker`.
4. Once that's run, quite Claude, and run it again with `./run_docker.sh claude --dangerously-skip-permissions`. This allows me to tell it something like "fix issues #45, #47, and #48" without having to approve commands all the time whilst limiting the blast radius.

## Is this the end of "good first issue"s?

Perhaps. Some have argued at this makes it harder for new contributors to get into open source. There may be some truth here, although I've argued in the past that good first issues aren't a good way into open source anyway (see [stop browsing good first issues](https://labs.quansight.org/blog/dont-start-with-good-first-issues)).

Rather than looking for issues to fix, my general recommendation is to build things and solve problems. Along the way, you'll almost certainly encounter gaps in existing tools (in which case, perhaps try reporting them, and seeing if you can fix them?), or missing tools (in which case, perhaps you can try building them?). The one thing I need to emphasise is that, if you're contributing to someone else's project, it's essential you understand and take full responsibility for all the code you submit. If you're using an agent to write the code, that's fine, just make sure that also spend however long it takes interrogating the agent about every line of code it has changed until you fully understand every last detail. Furthermore, any written discussion should be written by you and you alone.

## Conclusion

We've looked at how agentic programming is helping to redefine what gets worked on in open source. I find it encouraging that it's helping us maintainers tackle important but not urgent issues without losing focus on higher-priority ones. There remain challenges with open source and AI interactions, but (from a purely technological standpoint, at least) I'm cautiously optimistic.

If you would like help with packaging, safety, or improving the open source ecosystem, we'd love to hear from you, [please get in touch](https://quansight.com/about-us/#bookacallform)!
