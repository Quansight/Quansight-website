---
title: 'Introduction to Design in Open Source'
published: November 18, 2020
author: isabela-presedo-floyd
description: "This blog post is a conversation between two contributors, sharing their observations, experiences, and their hope for a stronger collaboration between design and development in open source."
category: [Developer workflows, OSS Experience]
featuredImage:
  src: /posts/design_in_open_source/blog_feature_var2.svg
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/design_in_open_source/blog_hero_org.svg
  imageAlt: 'An illustration of a white hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

## Designers should be a good fit for open source

*This blog post is a conversation. Portions lead by Tim George are marked with
**TG**, and those lead by Isabela Presedo-Floyd are marked with **IPF**.*

**TG:** When I speak with other designers, one common theme I see concerning why
they chose this career path is they want to make a difference in the world. We
design because we imagine a better world and we want to help make it real. Part
of the reason we design as a career is we're unable to go through life without
designing; we're always thinking about how things are and how they could be
better. This ethos also exists in many open-source communities. It seems like it
ought to be an ideal match.

So what's the disconnect? I'm still exploring that myself, but after a few years
in open source I want to share my observations, experiences, and hope for a
stronger collaboration between design and development. I don't think I have a
complete solution, and some days I'm not even sure I grasp the entire problem.
What I hope is to say that which often goes unsaid in these spaces: design and
development skills in open source coexist precariously.

## Why design might be missing in open source

**TG:** If you're looking for a quick and singular answer, it might be best
summed up by a quote from Marshal McLuhan in his book The Medium is the Message:
"We shape our tools, then our tools shape us." GitHub has become the place where
many open-source projects exist. GitHub (I don't want to suggest that it is the
only place open source exists, just that it's the only place where I've been
involved with open source) is also designed first and foremost with code
contributions in mind. The ripple effect is that the people and the project will
similarly center around code and it will take effort to use the tool in a way it
is not designed to support. While it has a number of features that support
design input, it doesn't integrate directly with design tools, and design
artifacts aren't tracked in the git history in any meaningful way. Unless, of
course, the designer is directly committing code, but then the design process
still isn't accurately reflected, only the outcome of it.

**IPF:** That may be one theory as to the problem's root, but it's certainly not
the only explanation. Because the question of missing skills in open source
could be the source of many blog posts, I've narrowed it down to a list. Here
are some other thoughts I've had or heard floating about (like in
[this discussion](https://discourse.opensourcedesign.net/t/difficulties-of-design-in-open-source/787/19))
explaining the absence of design in this space:

- Designers might be unaware of open source.
- Designers might be wary of working in public. ("You want me to post my
horrible first draft somewhere anyone could see it forever?")
- Some open-source communities don't want or need conventional design.
- Some open-source communities might not welcome different skill sets.
- Designers have a history of being underpaid or not paid for their work; we
  are often encouraged to be wary of working for free, especially if it's not
  for a group/project/product we've heard of.
- As has been mentioned about code and documentation, lots of what is needed
  most in open-source projects is not the clear or glamourous design work that
  might draw in designers. There are mostly question marks and maintenance
  work.
- This type of work lacks recognition in design communities.

And here are some issues we'll tackle below:

- An open-source community might be relatively unaware of design and what it
  can mean in practice.
- Lack of design talent and design literacy is common in open-source projects.
  Designers are likely to be teaching as they work, which means more work.
- Open-source projects tend to lack community recognition beyond what's tied to
  code.

**TG:** For many (most) open-source projects, designers are not a part of the
founding team. The infrastructure used to support many (most) open-source
projects was not made for designers. Many people who work in open source have
backgrounds that have given them limited interaction with design work. This
isn't intended as a gripe so much as a statement of facts because if we aren't
in agreement about this then the rest of this post doesn't make sense. What
these facts mean is that doing design work for open-source projects is unusual,
has a high barrier to entry, and sometimes doesn't feel like design at all. If
this is all sounding vague and nebulous, you're right. Welcome to navigating
design in open source!

## Breaking it Down

### Design literacy

**IPF:** One person wants a light yellow icon on a white background.¹ One person
wants the warning text written in all caps.² One person thinks this specific
feature should use interactions that don't match the ones used everywhere else.³
It's not malicious, but it represents differing goals and knowledge that need to
be united to move forward in a collaborative environment. If any of this doesn't
seem like a problem, that's why we're here.

Disconnects between a design team and anyone else on a project are not unique to
open source. Designing often alone and outnumbered by people who might not know
what you are talking about is where open source hits harder. Designers present
new information in this space, and so they constantly bear the burden of proof
to explain every move. They usually bear this alone. While it can be very
fulfilling to know you are helping people learn a new perspective, it detracts
time and energy from design itself.

### Community Trust and Recognition

**TG:** A developer decides to contribute to their favorite open-source project
for the first time. On the PR, there's one person who keeps asking them lots of
questions, attaching a lot of images, and requesting changes. They sound like
they understand the project, but they don't have the contributor tag and there
isn't any record of them working directly with the project. In fact, there's
barely anything at all on their GitHub profile. Who could it be? Probably a
designer.

**IPF:** In my experience, communities have always been welcoming of design
work, so this scenario usually ends well. Still, it exposes exactly how the
value system (trust and reputation) that drives a lot of open-source work fails
people who do non-development work (not only design) in this field. Personally,
I'm grateful that people tend to trust my word when I say I'm a designer, or
that there have always been developers in the communities I've worked with
willing to vouch for me if needed. However, it still is extra time and work
siphoning energy from the design, and continues a greater trend of lack of
trackable credit for design work.

## Coordination and Product Direction

**TG:** None of this is to say that design contributions are not welcome in
open source, in fact I've personally found the opposite to be true. But at its
core, open source is, and has generally been, focused on generating code. This
focus is a choice, and this choice has impacts on the community, governance,
direction, and more. Given the constraints that go into a decentralized team,
often working on different priorities, it can be difficult to know in what
direction the project is heading. This process often generates useful software
that's technically sound, after all, as Vincent Van Gogh said, "Great things are
done by a series of small things being brought together." Open source does a
wonderful job of improving large complex software systems by iterating on
bite-sized pieces, but this work often comes in spurts when maintainers have
time and inspiration.

Great design, on the other hand, is often the product of a well-defined vision.
Steve Jobs was famous for saying, "Design is not what it looks like and feels
like, it's how it works." But we don't often have the luxury, as designers, of
designing how it works, we're asked to pick up wherever the project is, with no
guarantee of impact in the area we are working on.

It can be hard to invest in a thorough design process if you're not sure
what's going to be developed next, or ever. And if you do take that chance and
invest in a design, there's an uncomfortably high chance you're missing the mark
of what the maintainer thinks the next big steps of their project are, (possibly)
documented only in their mind. If members of a project don't intentionally take
time to prioritize design, it can be easier to just merge changes directly into
the code base and see how the community likes it, as opposed to putting
significant amounts of time into design. Many features that end up in
open-source software are the result of one or two software developers writing
the code and offering it directly to the project, while even the most well
executed design still needs to be coded. It often happens that the solution
that's working now, is the priority over the solution that might work better,
*if* it is even built.

**IPF:** Because features are often already or mostly built by the time they are
revealed to the team (designers included), they have also already been
designed—intentionally or not—by the people who built that feature. This process
works against involving designer perspectives where they might be most helpful
or impactful: when initially solving the problem.

## To a brighter future

**TG:** In my experience, which is mostly in Jupyter-related projects, design
input is desired, and well received. Different projects, depending on size and
scope, have different understandings of, and interest in, design. If designers
are going to make a larger impact on open-source projects, committers need to
understand the value of design beyond simply "making things look good." Many
open-source initiatives would benefit from a visual overhaul, especially of the
type that leans into consistent looks for similar interactions throughout the
software. This is usually the limit of other contributors' expectations of
designers, but that's just scratching the surface of the problems we've worked
through so far, and what we're capable of in the future.

**IPF:** At the beginning, we mentioned imagining a better world as a part of
being a designer, and imagining a healthier open-source experience is no
exception! Changing the collaboration process is a good first step.

**TG:** As a Human-Computer Interaction practitioner, I always strive to
understand "why" a problem exists before I decide what to do about it. There's a
lot of "what" and "how" in open-source development. Oftentimes, a scientist or
developer simply solves the problem they have. But if we take some time to walk
through the design process and understand more about why the question arose and
who else has the problem, we can get to the core issue, and design both a
solution and an interface for it in a way that is knowledgeable of the problem as
well as the people trying to solve it. In essence, we build software that the user
can partner with to process data, instead of building a tool that accomplishes a
single task.

**IPF:** But if designers are brought in just at the review or UI decision
stage, as they often are, it can be a little late to start asking "why" with so
much work already done. The ideal answer is to bring designers in early,
preferably as early as when the problem is discovered. This currently isn't
possible, there are still so few designers in this space and so many problems to
be solved. The mainstream field of User Experience Design describes two
overarching duties for designers in any environment: creating new features
(discovering what's useful), and refining software (to make what's useful
better). How often do I get to deep dive into either of these directions?
Rarely. Creating new features is more likely to be driven by developer
inspiration, while refinement usually must rely on external standards and
comparable software experiences to make up for the resources open-source
projects don't often have. So what might be the path forward? Stop only trying
to lean into what designers think they do best and work with open source's
strengths of innovation and pushing technical limitations.

**TG:** This brings us back to a foundational aspect of open source, mainly,
open-source software is built on trust and relationships between contributors.
Design in open source has to be a two-way street. Developers need to be open to
digging in and understanding the problem from its source, and designers need to
be willing to put in the work to understand the technical limitations of the
technology that's being utilized to build the software. Fortunately this gives
designers and developers a place to meet in the middle (and that place will
almost always be GitHub). I've had a number of experiences where simply
asking hard questions has helped developers to better understand why they're
solving that problem at all. At the same time, there have been hundreds of
solutions I have conceived of that just aren't yet possible to implement.
Getting involved early, and understanding what the limitations are is a great
way to help existing teams integrate design into their process.

**IPF**: Want to hear us talk more about this? Tim and I had a conversation
with Ani Krishnan and Tony Fast
[here](https://www.youtube.com/watch?v=3SBwb8ppz5I).

---
¹ Wondering what's wrong with this scenario? Yellow and white is a low contrast
combination that makes it hard to see the icon. It also fails accessibility
contrast standards.

² All caps aren't recommended. Depending how it's implemented, it can be an
accessibility concern, too.

³ A common goal of interface design is to teach users via interaction patterns.
Inconsistency is confusing and can break user trust both short and long term.
