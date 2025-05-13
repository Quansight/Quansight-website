---
title: 'There are lots of accessibility resources'
authors: [isabela-presedo-floyd]
published: June 06, 2025
description: 'Complications of having all these resources and methods to manage them.'
category: [Access-centered, OSS Experience]
featuredImage:
  src: /posts/there-are-lots-of-accessibility-resources/featured.png
  alt: 'An illustrated pile of articles covered with question marks, one is stamped with an accessibility symbol and another question mark.'
hero:
  imageSrc: /posts/there-are-lots-of-accessibility-resources/hero.png
  imageAlt: 'An illustrated pile of articles covered with question marks, one is stamped with an accessibility symbol and another question mark.'
---

## JupyterLab Accessibility Journey Part 6

## People tell me “there are lots of accessibility resources”

And there are, after all, lots of accessibility resources freely available for people to reference, learn from, and make change. As someone who has helped make more accessibility resources in the last few years, it’d be wrong of me to deny this. The [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG/) are public. Many academic institutions post articles about their compliance efforts for their staff and the rest of us to reference. Companies and freelancers alike make blog after blog post just like this one with actions people can take to make digital spaces more equitable for disabled people. There’s even a number of free conferences, talks, and learning events. I admire the knowledge sharing that so much of the community who cares about or works on accessibility prioritizes. I use it for my own work at Quansight Labs. I send it to others on a regular basis. The resources are out there. The resources are overflowing from the Internet, so the utopian age of perfect, shiny digital equality is nigh, right? 

To me, the complication is that “there are lots of accessibility resources” isn’t truly the end of the sentence.

## Finding them is hard

There are a lot of accessibility resources, but finding them is hard. I started learning about accessibility multiple jobs ago in a place where there were no other people who knew much about it. In fact, it ended up being my job to bring the research to develop best practices. Even though I was taking a magnifying glass to any and every lead I had, starting with very little knowledge meant it was several months before I actually found the Web Content Accessibility Guidelines. In hindsight this feels embarrassing, the sort of thing I hesitate to admit at all. Still, it’s true. Even one of the most cross-referenced, commonly linked, and law-influencing documents from an established institution like the [World Wide Web Consortium (W3C)](https://www.w3.org/) did not immediately appear in my reading of books and blogs and webpages. 

What does this mean for someone who is interested but doesn’t have the time (paid time for me, no less) to dig in? What does this mean for someone who can’t find any relevant resources at all? In cases where someone has more knowledge and sufficient time, endless searching can still be an issue. By the time I began working on JupyterLab I had a better foundation in accessibility than my first foray. I still found the challenge to hold true. Looking for more and more resources for more and more use cases, especially increasingly niche ones, did not get easier. 

Many of the approaches that helped me find accessibility resources are typical Internet searching tips combined with plain stubbornness. Starting with a variety of results -- say seven blog posts that appear with a keyword search for `real time collaboration accessibility` -- I would read them all and note what they had in common, terms they used that I did not know, specialized terms or jargon, and hunt down their sources. All of these things would get searched again, broadening and narrowing the net as needed to find resources better suited for the problem. Where possible, following an organization, author, or other name I recognized provided another angle for research. Of course, talking to people works well too, whether it’s finding people you can contact via your workplace, public office hours for accessibility professionals, or as research participants. 

## Figuring out what’s relevant is hard

There are a lot of accessibility resources, but figuring out what is relevant is hard. Even in cases where there’s an immediate feast of results to help with a certain problem, I’ve still faced the issue of finding what resources have promise for actual use in the circumstances I’m currently in. 

Like many other situations, this obstacle leaves me in a realm of questions. This resource talks about websites, does it apply to documents we’re making? This other one talks about documents, but will it work for a different file format? Working on JupyterLab and its many moving parts did not make this simpler; it only changed the nouns. JupyterLab has precedence for regression testing, but is it built in a way that can accommodate testing criteria for accessibility? Is it right to rely on automated accessibility testing at all? Can this existing test even work on a web application like JupyterLab? How would we do the manual testing this resource recommends? Is there something comparable for open source communities or volunteer organizations? 

Is this even a problem at all? Is this a solution? How do we know?

To summarize, there came a point when I knew how to find resources, plenty of them. I could filter through them, align them with goals, align them with software constraints, align them with teams and community members. Being left with anything to actually bring for further review was another obstacle. Relevance can be a challenge in many fields and the only actions that have helped me navigate it are preparation. Prepare by being clear on what you are searching for, committing to the scope of the problem you set out with, and having a list of constraints ahead of time. Examining the relevance of resources can also be a good group activity. People can use their different expertise to divide and conquer a larger list, and having to explain a proposal to others often helps everyone engage with the pros and cons more deeply. Plus it has the potential to increase the accessibility knowledge of everyone there, the sort of growth that can help make accessibility work more sustainable.

## Verifying them is hard

There are a lot of accessibility resources, but checking if they are reputable, evidence-based, and up-to-date is hard. It is (ironically) old news that the Internet has this problem, so perhaps it seems strange to call this out as relevant to accessibility work. The thing is, the amount of accessibility good intentions gone wrong I’ve seen in not even a decade harrows me. To draw from the same example, my first workplace foray into accessibility recommendations led me to `longdesc`, a (deprecated) HTML element for writing extended image descriptions for information-dense images like data visualizations or paintings. By the time I learned about it, it had already been deprecated; the article I learned about it from—a reliable source with input from disabled people and accessibility professionals—did not say `longdesc` was deprecated because it was not when that article was written. There was no foul play, not on my end or on the authors’. Luckily, the article had a clearly stated publishing date, I noticed it was several years old, and I already knew exactly where to look to check for deprecated HTML. Luck is the key word there; I am not okay with relying strictly on luck where real people’s experiences are on the line. 

Years later I found this same issue again and again, only with less clarity. Deprecation was easy to check, but mixed support for assistive technology, confident people with Non-Disclosure Agreements who can’t share research but do want to tell you what to do, and just plain differing opinions are the sort of things I faced working on JupyterLab accessibility. None of those have had such an easy answer no matter how many accessibility resources I have encountered along the way. 

As it is, I have not found verifying accessibility resources to be notably different from verifying other resources. Usual best practices apply like reviewing sources, checking publication date, cross-checking claims, weighing any conflicts of interest involved and avoiding them. With so many resources freely available, checking for counterarguments or other disagreements about a claim one party made is also relatively easy to do. These approaches can get you far, but there will come a point when the information needed to verify simply is not available even when the accessibility resources are. Where this has happened to me, the best thing to do was to save up these questions and build research around them with disabled people’s collaboration. This is exactly how projects like [Notebooks For All](https://github.com/Iota-School/notebooks-for-all/tree/main/user-tests#readme) and [JupyterLab Accessibility user testing](https://github.com/jupyter/surveys/tree/master/surveys/2023-05-jupyterlab-accessibility#readme) began. The second best thing to do was to not believe the hype; I wade through information searching for the solution that uses the least new, fancy, proprietary technology and start there (the answer on the web is nearly always to use HTML as prescribed). It remains important to check these least-hyped approaches are not just outdated, but the new, shiny, marketing-laden solutions are often not thoroughly tested at all. 

## Putting them into practice is hard

There are a lot of accessibility resources, but figuring out how to use them is hard. This obstacle might be the most broadly acknowledged.

So say you’ve

1. Found a perfect resource that explains the what and how of page structure that is compatible with a variety of assistive tech.
2. Figured out it is a relevant resource for your use case, the JupyterLab page structure, and uses the appropriate technology.
3. Verified that the resource is timely, adheres to international web standards, and works with your community’s own JupyterLab contributor expectations.

Wow. That was a lot. And now you crack it open to find that JupyterLab might be compatible with this standard, but it sure isn’t set up for it at the moment. And remaking this one segment will impact this other unrelated one that happens to be made from the same component, something no one might even notice until you get reports from the public. None of this is even mentioning the time it often takes to get a review on these changes, especially in spaces where few people have the accessibility expertise needed to review it. If all of the logistics go well, then a new problem appears: doing it wrong. Because it’s not very difficult or uncommon to have good intentions and still botch the implementation. And, in botching it, make the user experience even worse for disabled people.

Like the other sections, the struggle of putting a theory to practice can be a challenge in many contexts. Like the other sections, the difficulty is compounded by less time, expertise, and, in many cases, money prioritized in the case of digital accessibility. I can’t say that the above aren’t issues I’ve had in general projects, but the ones that have been the most challenging year after year are the accessibility ones. 

Handling the challenges associated with taking action based on accessibility resources fortunately benefit from starting with the same best practices as anything else; clarify scope with all parties involved, research thoughtfully, test proof-of-concepts, and get feedback early to cushion the most severe pitfalls. Because accessibility considerations are often new to communities, gathering people from the start to decide upon the success criteria and technical constraints for the change will help you develop awareness that can make getting review, testing, and feedback more approachable for all parties. Instead of having people tell you they don’t know what to review for, you will already have discussed the ultimate goal necessary for collaboration (and ideally published the notes on this for all to reference). 

Remember it is also easier for people to give feedback on something that exists than for them to make decisions based on hypotheticals, and this is doubly true when working on topics unfamiliar to them. Proof-of-concept work can be especially critical when accessibility feels like uncharted territory in a project. Others can review for the parts that they do have expertise in, share their reactions to seeing the work in action, and ask questions no matter how uncertain they may feel about other aspects. Proof-of-concepts can also be potentially tested with the actual audience: disabled people. This is the most surefire, if not the only, way to know that you aren’t making changes based on accessibility advice that doesn’t hold up to reality.

## Reasons for hope 

Just because “there are lots of accessibility resources” is a sentence with a number of endings doesn’t mean that it’s problems all the way down. The beginning of the sentence is still there, blossoming with decades of research and genuine care. That all these resources have been, are being, will be made means that people are still working towards a better world for disabled people. There is lots of information to fact-check against. There is lots of information to share with others and to build off of. There’s lots of information that can be used to improve accessibility right now.

I’d also argue that knowing what you don’t know is better than total ignorance. Ultimately, there is truth in the sheer amount of available accessibility resources, what is present as much as what is absent. The fact that I’m able to pinpoint the issues I’ve had and heard over the years is useful to me. It is often useful to other people and organizations I’ve worked with. It has often been the moment of opportunity.

I do not write this because I want to critique people who say there’s so many resources or those who explain why those resources don’t always help. I also do not write this to encourage people to be disheartened. I write this because it is real. Acknowledging the challenges that color this reality is the only way I know to suggest ways to overcome them, including the frustration, shame, and exhaustion I keep finding amongst people who care about accessibility long-term. Finding resources is hard, but we do find them. Figuring out what’s relevant is hard, but we do figure it out. Verifying them is hard, but we do verify them. And putting them into practice is hard, but I watch people do it every day. 

Because there are lots of accessibility resources, and I’m sure we’ll make more along the way to a digital world that actually works the way disabled people want and need it to. 
