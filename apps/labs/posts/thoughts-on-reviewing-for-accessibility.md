---
title: 'Checking for accessibility: thoughts and a checklist!'
author: [isabela-presedo-floyd]
published: June 06, 2022
description: 'A non-exhaustive but totally honest checklist
for accessibility review'
category: [Access-centered, OSS Experience]
featuredImage:
  src: /posts/thoughts-on-reviewing-for-accessibility/jlabaccess4_featured.png
  alt: 'Illustration of checkboxes with ticks and checkmarks'
hero:
  imageSrc: /posts/thoughts-on-reviewing-for-accessibility/jlabaccess4.png
  imageAlt: 'Illustration of checkboxes with ticks and checkmarks'
---

## JupyterLab Accessibility Journey Part 4

Remember how [my last post in this series](https://labs.quansight.org/blog/2021/09/not-a-checklist/)
called out accessibility as much more complex than a checklist? True to my
sense of humor, this blog post is now a checklist. Irony? I don’t know the
meaning of the word.

Okay, okay. But seriously, here's how we got here. When I’m not making
my own work, much of my time is spent reviewing other people’s work. Whether
it’s design files, code contributions, blog posts, documentation, or
who-knows-what-this-week, I often find myself asking questions and giving
feedback about accessibility in the review process. This has prompted multiple
people to ask me what it is I’m considering when I review for accessibility.
Enough people have now asked that I’ve decided to write something down -- and
it's turned into a checklist.

I’d like to remind readers everywhere that other people have [written](https://tetralogical.com/blog/2022/01/18/quick-accessibility-tests-anyone-can-do/)
[similar](https://www.a11yproject.com/checklist/)
[lists](https://webaim.org/standards/wcag/checklist)
in the past and probably will do so again in the future. This list gets
long quickly, so I’ve tried to keep each item short and link out for more information.

Without further ado, this is my non-exhaustive but totally honest checklist
for accessibility review.

### My review checklist

#### Text

- All-caps are used only when they are needed (like acronyms), not just
  for emphasis. Or all-caps are created with a text-transform property.
- [Text has high enough contrast for its size and weight](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum). Make sure to be aware of yellow, orange, and green especially; they tend to be tricky.
- [Information is not represented only by color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color). Adding label text or an icon are my most frequently recommended additions.
- [Links have appropriately descriptive names](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context)—-meaning you know where that link text will take you or why it is there.
- Are there headers or some kind of division? [Headers must follow a clearly ordered hierarchy](https://www.w3.org/WAI/tutorials/page-structure/headings/). For example, not skipping from Heading 1 to Heading 4 in HTML-based situations.
- Acronyms need to be defined, or at least linked to their source.
- Is the text written in a style appropriate for the audience? In most cases, it needs to use [plain language](https://www.plainlanguage.gov/guidelines/).
- Is any [language being unnecessarily gendered](https://developers.google.com/style/inclusive-documentation#gendered-language)? If it is, replace it. More on [inclusive language at 18F](https://content-guide.18f.gov/our-style/inclusive-language).
- Is necessary gendered language used correctly? Usually, this means don’t misgender people.
- Is there [language that unnecessarily assumes the reader’s ability](https://developers.google.com/style/inclusive-documentation#ableist-language)? If there is, replace it. An example could be assuming the reader can see with “As you can see…”
- If there is HTML, [all HTML tags are used as they were intended to be used](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML).
- If there are ARIA tags, are they necessary? Could this be avoided by using semantic HTML? [If ARIA tags are necessary, are they used correctly](https://html5accessibility.com/stuff/2020/11/07/not-so-short-note-on-aria-label-usage-big-table-edition/)?

#### Not-text

- [Non-text elements have high enough contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast). I prefer to check contrast on all, but at least be sure about interactive and informational areas. For example, buttons are interactive interfaces and status indicators are informational interfaces.
- [Information is not represented only by color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color). Adding label text or an icon are my most frequently recommended additions. (Yes, this is the same as the above Text section. It’s important so it’s here twice.)
- [All images need image descriptions of some kind](https://www.w3.org/WAI/tutorials/images/decision-tree/). On the internet, this is usually [alt text](https://en.wikipedia.org/wiki/Alt_attribute). All image descriptions need to match their surrounding context.
- [All videos need captions and/or transcriptions](https://www.w3.org/WAI/media/av/).
- All non-text media needs a text counterpart, or another way to get the information or interaction.
- [Don’t use flashing images](https://www.w3.org/WAI/WCAG21/Understanding/seizures-and-physical-reactions).
- [Don’t use red flashing images](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold#dfn-general-flash-and-red-flash-thresholds).
- Is there content that moves for longer than five seconds? There must be a way to pause/stop it.
- Don’t autoplay any content.
- How many emojis are there? [Don’t have more than three emojis in a row](https://www.perkinselearning.org/technology/blog/how-do-people-vision-impairments-use-emoji).
- Don’t use emojis to replace words, use them as additions.
- If I read a plain text or some other unstyled version of this non-text content, does it still make sense? Is all the same information available? You need to be able to answer “yes” to both those questions.

#### Interactions

- Can you complete all interactions with a mouse? Good.
- Can you complete all interactions with a keyboard? Fantastic.
- Can you complete all interactions with a touch screen? Wonderful.
- [Can a single task be completed with multiple input methods?](https://www.w3.org/WAI/WCAG21/Understanding/concurrent-input-mechanisms) It needs to be flexible. For example, can a task be completed switching between using the mouse and keyboard to navigate.
- Check all keyboard shortcuts to make sure they don’t conflict with others. This usually includes checking the operating system, browser, and possibly with different language keyboards. Because of the number of options, I want to acknowledge this can be a challenge to check but still worth exploring.
- Keyboard shortcuts need to be configurable/remappable.
- Keyboard shortcuts cannot be the only way to use a feature. There must be at least one other option.
- Keyboard shortcuts, in general, are better the fewer keys you have to press at once. Aim for no more than three. Consider how you have to move to hit the keys, and reconsider your choices if you feel like a contortionist.
- The tab order needs to make sense/follow visual reading order.
- All interactive areas need to be focusable.
- [Focus needs to be visible.](https://www.sarasoueidan.com/blog/focus-indicators/) Please, make it a good, high contrast, multi-background-considerate visible focus.
- What happens when you run whatever assistive tech you have available over it? Review expectations for that type of assistive tech and compare that the experience matches up. Please keep in mind that if you don’t use assistive tech every day, your experience will not be the same as someone who does.
- [Interactions must be designed to minimize user error](https://www.w3.org/WAI/WCAG21/Understanding/input-assistance). [If the interaction is a high stakes one, the user is warned or has extra protection surrounding the action](https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data).
- Have you never thought about this behavior from an accessibility perspective before? Go give it a search on the internet and bring up the question in your review. For example, if I've never thought about how code syntax highlighting information is communicated to a blind person, I can go start searching. I go from general to specific like "syntax highlighting and accessibility" to "blind developers and syntax highlighting." In the review, I may say "I wonder how syntax highlighting can be communicated without visuals" before summarizing the patterns I've found and linking to my sources.

#### All of the above and more

- Check for consistency. This could be anything from keeping the same name for a tool in documentation, consistent capitalization for text, or matching user interactions patterns across a piece of software.
- [Errors, warnings, or similar feedback info should not only inform users about what happened but also how to address what happened](https://accessibility.huit.harvard.edu/provide-helpful-error-messages).
- Does this collect user info in some way? If it does, it must only collect what is absolutely necessary. This information also needs to be secure long term.
- [Is there red? Is there green? Are these colors used together?](https://baselinehq.com/blog/colourblindness-information-ui-design-red-green-problems-tips-tricks.html) If these colors have meaning, find another color palette and/or additional method to convey that meaning.
- What configuration/settings options are available? Make sure they are accessible and ask yourself if there’s anything missing.
- Are there translations for this? If so, try translating it and check that the interface is responsive.
- Bonus points for [supporting mirroring for interfaces based on language](https://material.io/design/usability/bidirectionality.html).

### Extra notes by use case

#### Reviewing parts of software that won’t be user-facing

This might seem like an unusual place to be reviewing for accessibility since
I’m not a developer, but it’s good to consider accessibility for the support
of people who may work on this in the future. Making sure to use plain
language in doc strings, use consistent and specific language that matches
external documentation, and using appropriately descriptive names are a good
place to start. Your software’s architecture can be designed accessibly.

#### Reviewing parts of software that will be user-facing

Reviewing user-facing work is what I spend most of my time on, so
[My review checklist](#My-review-checklist) from above is the most accurate.
In this situation, it’s most helpful to review these things holistically.

This means I would recommend choosing a task common to users and then
completing it slowly while taking note of items on the checklist. In
JupyterLab, I could choose the task of opening a new notebook and writing in
the first cell. While I'm taking those actions, I'm switching between keyboard
and mouse, taking note of low-contrast parts of the Launcher, and finding that
the visible focus in inconsistent. While I could search for each of these
things one by one à la checklist, I will find blocking problems and the ways
they overlap by following the path of a user.

#### Reviewing documentation

Documentation is usually a combination of text with images or videos, so the
[Text](#Text) and [Non-text](#Non-text) sections will be a good place to
start. Consistency is especially key here, because the last thing you want
when people are exploring—for help or learning—is to be confused. Having a
style guide and community-agreed-upon language can be a great start.

#### Reviewing social media content

For social media, there are a lot of considerations depending on what you are
working with. In the wild, the main problem I run into is no descriptions for
non-text content. Whether it’s an absence (missing alt text, captions, or
transcription) or overload (flashing images, autoplay) there’s a lot of
opportunity for improvement in this space.

#### Reviewing anything with non-text media

Non-text media can be tricky to describe because it’s so open. Of course,
referring to the [Non-text](#Non-text) section above is a good start.
Because text can be transformed (meaning changed in size, read aloud,
translated, etc.), it’s usually the safest case. Still, don’t take that to
mean writing is the only way to convey information; accessibility is usually
best served by providing a variety of ways to interact! Please do experiment
with the ways you communicate, just be sure to include at least one surefire
accessible way (like a text version) along the way.

### Personal notes on being a reviewer

Reviewing is a critical part of ensuring that people work together in creating
quality things that solve the problem they set out to solve for people. I
believe being kind to both the author (by calling out what is well done and critiquing only the work and not the person) and the eventual users (by giving a
thorough review) is important. It’s a responsibility, and I find it’s
important to take accountability for it even in the lowest stake situations.

I’ve found that it’s worth calling out anything that catches your attention,
even if it’s not something you know how to solve yet. Commenting something
like “I wonder if x causes y problem?” and linking to a resource with
background information opens up discussion for everyone involved to learn.

I don’t know everything, you likely won’t either, and that’s fine. What I do
recommend is asking questions freely. I often find gaps in my knowledge by
asking if the main goals of WCAG (content is Perceivable, Operable,
Understandable, and Robust) are possible through different means. For example,
I ask myself things like

- Is this thing I’m reviewing perceivable if I can’t access it the way the person building it can?
- Is it operable in more than one way? Is it operable in different conditions, like with different lighting or if I only use one hand?
- Is it understandable if I asked a ten year old to summarize it or if I were to ask my parent? What about if I asked someone who’s never studied what I’m writing about?
- Is it robust, meaning it works with assistive tech and a range of other devices? Does it leave room for changes and improvements in the future?

Finally, please remember to build on work that’s already been done when
reviewing. You don’t need to handwrite a definition of visible
focus every time you have to explain it to someone; find a resource you like
(such as [Understanding WCAG](https://www.w3.org/WAI/WCAG21/Understanding/))
and link that when people ask you. This saves you time, energy, and helps us
all build a community where we’re learning from each other instead of
repeating the same work in isolation.

### What’s next?

Captioning! I’ve spent the past several months working on
[accessibility-focused events in the Jupyter orbit](https://blog.jupyter.org/jupyter-accessibility-workshops-wrap-up-8649dfe5f89),
and I learned many things in the quest for an accessible online event. I also
found myself constantly wishing for resources I couldn’t find, so the next
chapter in this series of JupyterLab accessibility learnings will aim to fill
those gaps.

Did I miss something in this checklist? Great! Please tell me (in the
comments) so I can update this post (with credit) and we can all be more
knowledgeable and diligent in reviewing for accessibility.
