---
title: 'Captioning: A Newcomer’s Guide'
published: February 1, 2024
authors: [isabela-presedo-floyd]
description: 'What are those words on the bottom of your video screen and where do they come from?
Captioning’s normalization in the past several decades may seem like it would render those questions moot, but understanding more about captions means making more informed decisions about when, how, and why we make sure information is accessible.'
category: [Access-centered, OSS Experience]
featuredImage:
  src: /posts/captioning-a-newcomers-guide/blog_feature_1.png
  alt: 'An exclamation point and the word captions over a background pattern made of the lower contrast words captions, subtitles, and transcripts.'
hero:
  imageSrc: /posts/captioning-a-newcomers-guide/blog_hero_1.svg
  imageAlt: 'An exclamation point and the word captions over a background pattern made of the lower contrast words captions, subtitles, and transcripts.'
---

## JupyterLab Accessibility Journey Part 5

What are those words on the bottom of your video screen and where do they come from?

[Captioning’s normalization in the past several decades](https://en.wikipedia.org/wiki/Closed_captioning#History) may seem like it would render those questions moot, but understanding more about captions means making more informed decisions about when, how, and why we make sure information is accessible. And besides, captioning—like many accessibility needs—is not nearly as ubiquitous as it may seem. Plenty of things on and off the internet are uncaptioned even today.

In recent years, I’ve been a part of teams planning virtual events like the [Jupyter Accessibility workshops](https://www.youtube.com/playlist?list=PLUrHeD2K9CmkoRVi5tgQdTxJrh6G_IPRD) and [Jupyter community calls](https://www.youtube.com/playlist?list=PLUrHeD2K9Cmkoamm4NjLmvXC4Y6E1o8SP). A part of this journey has been traveling down the rabbit hole of captioning, and, let me tell you, I wish that rabbit hole had a map. Along the way I asked a lot of questions I struggled to find answers to that I’ve done my best to answer here and now.

This post is intended more as a reference than something that must be read end to end, so please navigate with the list below.

## What is this captioning stuff?

### What needs captioning? 

Captioning turns audio information in time-based media into textual, visual information. This means that things with audio can benefit from captioning. That could be an audio-only format like a podcast to an audio-visual video like a recording of conference talk. Depending on the situation, captions may also benefit video-only content like describing a tutorial video that doesn’t have voiceover. While captions can be applied to things that aren’t time-based, like a caption describing the trends on a static graph, that is not what this blog post will cover.

Because captioning is another avenue for presenting information, my recommendation is to use captioning to make sure 

1. All spoken, verbal information is captioned.
2. All audio information needed for context is represented in captions.

The [World Wide Web Consortium (W3C) kindly provides their own summary of what needs to be captioned](https://www.w3.org/WAI/media/av/captions/#checklist) based on the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG22/).

### What are subtitles, what are captions, what is a transcript? And what’s the difference?

I learned these words aren’t as interchangeable as I once thought!

[**Subtitles**](https://en.wikipedia.org/wiki/Subtitles) refer to text that captures audio information—especially spoken words—in time-based media, often shown at the bottom of a video screen and timed to match the audio. Subtitles can be used semi-flexibly since they might transcribe spoken words in the same language as the source, might deliver translations and localizations, or even additional notes. While subtitles can refer to things beyond verbal information in the source, that is notably less of the focus.

[**Captions**](https://en.wikipedia.org/wiki/Closed_captioning) refer to text that captures audio information—all types needed to understand the source material—in time-based media, often shown at the bottom of a video screen and timed to match the audio. By definition, captions are explicitly made in service of deaf and hard of hearing people (though they are available to all) and often need to describe more than spoken words as a result. A popular example is that captions would be expected to provide a mention of a sound effect that impacts the story along with the dialogue a character may respond to it with.

[**Transcripts**](https://en.wikipedia.org/wiki/Transcription_(linguistics)) refer to any time something spoken is turned into a written form. In the most literal use of this word, subtitles and captions are both also transcripts. Here, when I talk about transcripts I’m specifically referring to the process of turning verbal information into paragraph-style text information that is not timed to any audio. This kind of transcript would not appear on the screen of a video, for example, but rather might appear in paragraphs below the video or in a video description.

Of course, the above terms have lots of overlap and not everyone is using them exactly as they are defined. The Wikipedia page for captions also refers to the [HTML5 delineations for captions, subtitles, and descriptions](https://html.spec.whatwg.org/multipage/media.html#the-track-element) which has great explanations as well.

### What about automated captions? 

Automated captions are captions generated by some combination of [speech recognition software](https://en.wikipedia.org/wiki/Speech_recognition#People_with_disabilities). Nowadays, these are common on videos on the internet. They continue to be popular because they are often fast, low cost or free, and built-in to some video hosting platforms. 

Just like other applications of technology in the wild, automated captions reflect training biases that may weaken their results; in my experience captioning videos, I’ve seen them produce less accurate captions for non-U.S. accents, higher voices, and discussions with lots of field-specific terms. In many Jupyter meetings (Jupiter, the planet, as automated captioning likes to call it), we’re privileged to have a community that does all of these things at once and my automatically generated captions become gibberish in short order. These tools are many and are often being adjusted over time, so I would not be surprised if people have had very different experiences working with them. It is worth noting that the [W3C formally considers automatically generated captions insufficient](https://www.w3.org/WAI/media/av/captions/#automatic-captions-are-not-sufficient) and includes some great examples as to what can go wrong. Even if you want to use automated captioning, the responsible thing to do is to double check the results.

Of course, humans can struggle with transcribing in situations unfamiliar to them too! I still think it’s worth working with human captioners whenever possible. They are highly skilled and often handle confusing captions more gracefully and coherently than the sorts of embarrassing things I’ve seen automated captioners do on big, big screens at live conferences. 

### What are live captions? 

Live captions are exactly what their name implies: captions generated live, in real time, for a live event. You might find these on a live television program, on a newscast, or on a screen at a live event. 

There’s nothing especially different about the captions themselves, but they do require a skilled captioner transcribing at blistering speeds behind the scenes. Not all captioners are willing to caption live events and booking those that do requires thinking ahead. For more information on live captioning, refer to *What should I know about running an event with live captioning?* later in this post.

### Why should I caption things? 

Providing captions supports deaf and hard of hearing people in accessing the world around them, not to mention anyone else who may also benefit from transcribed audio for any number of reasons. If you can’t understand audio easily—because of disability, because of a noisy room, because you don’t have headphones, or because it’s in a language you are less confident in—captions matter. 

Like any accessibility accommodation, there are many reasons to persuade oneself and one’s managers and many others have explained more eloquently than I. Refer to the following:

* [Making A Strong Case For Web Accessibility — Actionable Steps To Get Buy-In from Todd Libby for Smashing Magazine](https://www.smashingmagazine.com/2021/07/strong-case-for-accessibility/#actionable-steps-to-get-buy-in)
* [The Business Case for Digital Accessibility from the W3C’s Web Accessibility Initiative](https://www.w3.org/WAI/business-case/)
* [Accessibility: It’s About People from the W3C’s Web Accessibility Initiative](https://www.w3.org/WAI/people/)
* [Introduction to Web Accessibility — Implementing Web Accessibility from WebAIM](https://webaim.org/intro/#implementing)

### Isn’t this just legal compliance?

What anyone is legally on the hook for making accessible depends on where the people making content are located, where the people interacting with the content are located, and what it is you are making. For example, if you are working on something used in educational settings in the U.S., there are legal standards. Less so (that I’m aware of) for something like an augmented reality video game. It’s important to consult the laws relevant to location and type of work to get this answer, and not rely on this blog post.

Even if you are in a situation where captioning is required by law, the difference between legal accessibility compliance and creating positive experience for disabled people can be vast, and is often the difference between inclusion and continued exclusion (even if approved by lawyers). Making a point to have accurate and comprehensive captions makes a big difference. And in situations where legal accessibility compliance is not required, this only becomes more true. It’s worth trying to caption right, not just throw words on the screen.

### Am I required to caption things? 

Ethically, my vote is in favor of providing captions where relevant. If you work with an organization that follows the Web Content Accessibility Guidelines (WCAG), [captioning is required](https://www.w3.org/TR/WCAG22/#time-based-media). 

Legally, this may be a requirement for certain organizations.  There are also many specific cases requiring captions you may not expect, like [rules about made-for-TV content on the Internet](https://www.fcc.gov/consumers/guides/captioning-internet-video-programming). Make sure to research thoroughly or consult an expert. 

As mentioned in *Why should I caption things?* the [W3C has also complied a list of business case arguments in favor of accessibility](https://www.w3.org/WAI/business-case/) accommodations such as captions.

### Are there criteria for this? 

As far as I know, there is not a singular standard for captioning content, file format, and styling that are used absolutely everywhere. However, there are only a few dominant ones. Once again, [WCAG covers this as “alternatives for time-based media”](https://www.w3.org/TR/WCAG22/#time-based-media) and navigating to the [Understanding articles](https://www.w3.org/WAI/WCAG22/Understanding/time-based-media.html) per guideline will provide you with examples of how and how not to caption.

A few more tips: 

* Follow the file format or other formatting relevant to where you are hosting the content. This ensures it behaves as expected. If you are hiring a captioner, know what service you will be hosting onahead of time so both sides can check they have the appropriate format and tech support.
* Represent content in captions as it is in the original audio. That is to say, don’t make corrections, add notes, or censor things only in the captions (for example). If things are corrected, noted, or censored in the source, that is the only time captions should reflect that.
* [W3C has brief styling guidelines for writing captions](https://www.w3.org/WAI/media/av/transcribing/#more-on-captions). Follow them.

## How can I make captioning happen?

### Can I caption things myself?

Technically, yes. If someone can understand the audio of the source well enough to dictate and describe it via text, they have what they need to write captions. Like renovating a professional restaurant with only the experience of having cooked in a personal kitchen back home, though, you may find yourself in over your head quickly. The professionals are professionals for a reason and have expertise that will produce stronger captions; I recommend working with captioners.

However, that doesn’t mean there’s nothing you can do. If it’s down to you doing captioning or no captions at all, here are a few ideas:

* Use an autogenerated caption service and review the entire (yes, entire) set of captions yourself. This has the benefit of formatting captioning files and getting you started so you aren’t working from scratch.
* If the source material hasn’t been produced yet, write a script and follow it accurately when recording audio. Then it becomes a matter of formatting your already written script into a [captioning file](https://www.w3.org/WAI/media/av/captions/#caption-file-format) and you’ll be set.
* Follow [W3C’s guidelines for What to Transcribe](https://www.w3.org/WAI/media/av/transcribing/#what-to-transcribe).


### You’ve convinced me hiring people to write captions is the best choice, what now?

First, identify what it is you need. For example, is this captioning for something you’ve already recorded or captioning for a live event? Do you actually need a transcript? Do you need subtitles in a different language than the source? All of these are different work and not all captioners or other captioning services offer the same things. But don’t worry if you don’t know all the terms of the field, just know what your source material is and communicate that clearly; professionals know how to steer you in the right direction.

Second, start researching and reaching out to captioners and captioning services. Depending on their training, where they are located, and other factors, captioners might refer to themselves with different terms; you’ll have more luck searching for the service you need—such as “live captioning for events”—than by looking for a job title. Asking around people you know who’ve run events can be the most effective way to search. In my experience, each potential captioner will have a slightly different contact method with slightly different information requested, so make sure to answer everything they ask for.

I also found that rates per amount of time captioned will be publicly available on the websites of larger captioning services that employ several captioners but not available on individual or small teams. However, asking for a rate or quote when reaching out to the individual or small teams works perfectly fine. Some services may also calculate rates based on something other than the amount of time to be captioned, especially for content that is more than a few hours or if there is a longer commitment involved, like if a company is looking to contract regular captioner for everything they make for social media marketing. 

Third, go about negotiations as you would for any other contracted service. Make sure to respect the captioners and listen to them when they tell you what they need and what is or is not feasible; they’re the experts and part of their job is guiding you to the proper support for your captioning needs. If you’ve decided to use an automatically generated captioning service, you likely will not get this guidance. Because automated captions will be processing your work in a different way than a human listening along, make sure to read the fine print (I’d doubly advise this for free automated captions).

### Are all people who can help me turn speech to text the same?

There are many people and services for transcribing captions and at least an equal amount of variety in the field. So no, they are often not the same. For example, in my search I met people who would only caption live and those who would only caption pre-recorded content and those that would do both. Knowing what kind of service you are looking for, reviewing the service listings of captioners you are reaching out to, and asking questions can help you find a match.

### How do I convince my team to make captioning a priority?

Advocating for captioning is awesome! The *Why should I caption things?* section earlier in this blog post provides ideas you could use to advocate to others.

### What about captioning in other languages than what the original content is in? 
Captions in a language other than the source material (or dub) are considered subtitles and are a beast of their own. For transparency, I haven’t had to hire someone to translate and subtitle so far and I do not know the intricacies of this process.

Where captioners or captioning services list their services, this is likely to be listed as subtitle translation. Some offer this as a single service, and some may require one of the steps—subtitling or translation—to have already been done so they can complete the process. As long as you are searching by service, you will be able to find the support you are looking for.

## What should I know about running an event with live captioning?

In addition to understanding more about captioning and how to work with external captioners, the following is what I wish I knew before running my first live captioned event.

* Put breaks in your schedule. The captioners need it, and your attendees are likely to appreciate it too. Ask your captioner how often they need breaks as this may depend on the method they use to transcribe. If you cannot put breaks in your schedule, you may have to alternate more than one captioner so they get the breaks they need; if this is the case you should work this out with your current captioner since it is someone they will have to work with.
* Word of mouth was by far the most helpful for finding reliable live captioning. Start asking people you have who run events. If a captioner replies they aren’t available, you may want to ask if they recommend anyone for you to contact instead.
* If you know someone in your community who had a good experience with a captioner, ask if they’d be willing to introduce you or pass on the contact info. The bonus is that these captioners might have more familiarity with the terms used in your community and better know how to caption them. I bring this up because this was really tricky with the many software homophones (and affinity for switching out or removing vowels in tech names) in captioning for events in software and scientific spaces.
* Make time to do a dry run of your event. Ask the if the captioner is interested in being involved in it and take the time to test out the tech support aspects. If they say they are not interested, accept that.
* Plan time ahead of your event to get the captioner set up and running. Test it before you have attendees watching.
* Ask your captioner they want the event materials ahead of time, and if so how much ahead of time? If they say they do not want materials ahead of time, accept that. This is likely to depend on the captioner’s preferences and their comfort level with the vocabulary in your field, so it’s best to let them decide but still good to offer.
* Leave ample time for scheduling a captioner. As soon as you have the go-ahead to hire a captioner, reach out with your event dates. Live captioners often schedule a lot of events and their calendars get booked fast.
* Remember to read your captioner’s terms. Whether this be the information needed to request scheduling or terms in the contract itself, take the time to read it. Everyone does things differently and live events are not when you want to handle surprises.
* Prepare your payment documents before the event. How and when payments happen will differ greatly on both the event runner and captioner sides, but you should be prepared all the same. It’s not professional to be scrambling all your paperwork after, and only after, the event.
