---
title: 'Generative AI: Made Possible by a Mountain of Open Source'
published: October 9, 2023
authors: [quansight]
description: 'Many of today’s emerging generative AI products and tools would not be possible without a vast array of open source tools and open source communities upon which generative AI is built.'
category: [Artificial Intelligence, Open Source Software]
featuredImage:
  src: /posts/generative-ai-made-possible-by-a-mountain-of-open-source/Generative-AI.jpg
  alt: 'Generative AI: Made Possible by a Mountain of Open Source'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Generative AI: Made Possible by a Mountain of Open Source'
---

ChatGPT, Claude, Bard, WatsonX and many other products and tools would not be possible without a vast array of open source tools and open source communities upon which generative AI is built.

## Introduction

Last year, the successes of generative AI in image, audio, and language production revolutionized the way people perceive technology and its capabilities. This came into broad focus as OpenAI’s ChatGPT hit the mainstream. From Google’s internal “code red” as the company analyzed a potential threat to how people search the internet to other large tech companies scrambling to release AI models of their own—the response was unprecedented and for many, unexpected.

Since OpenAI’s breakthrough, there’s been a maelstrom of innovation with hundreds of generative AI products, tools, and projects being created to offer AI-supported services for everything from writing to image generation, to code creation to video production and beyond.

And while the famous names like ChatGPT, Claude, Bard, and WatsonX are those that most people know, many people don’t recognize that these products and tools would not be possible without a vast array of open source tools and open source communities upon which generative AI is built.

In this post, we have two goals: the first is to emphasize the immense open source foundations of generative AI. The second is to highlight Quansight’s depth of expertise both in AI/ML tools and generative AI technologies in particular, and in the open source scientific computing space in general. To do this, we created the diagram below.

## The Diagram: Generative AI Is Built on Open Source

This diagram illustrates the myriad of open source technologies underlying modern generative AI. As we explore the various levels in the diagram, we want to make clear that we’re not suggesting the tools on each level are _directly dependent_ on all of the tools at lower levels. Instead, we are calling out how the tools, models, and products at each level are dependent on _some_ projects in the categories of each layer beneath it, even if they’re not dependent on the _specific_ projects we mention.

In particular, since Quansight is a scientific Python consultancy, we’ve focused heavily on Python tools and libraries often used together for AI/ML applications, and we’ve marked in the diagram the projects that we maintain or have significant expertise with. But, the ecosystem of open source underlying generative AI is much broader than we can possibly show in one diagram.

**Starting from the bottom row of the diagram and moving upward:**

- **Programming Languages**: At the bottom of the diagram are programming languages: the tools humans use to write any code at all. Software at large, not only generative AI, is dependent on having high-quality, usable languages.
- **Scientific Computing Tools**: The next level of the diagram contains tools built to perform assorted scientific, engineering, and mathematical tasks. These tools are the functional building blocks of more complex tools and code. We’ve included mostly Python tools here because of our Python specialization, plus the Javascript-based Jupyter platform that can be used to write code in a variety of languages, but there are scientific tools out there written in numerous languages.
- **General ML Tools**: The third level of the diagram includes tools whose purpose is specifically to develop AI/ML applications, whether that’s the “traditional ML” of scikit-learn (decision trees, gradient boosting, k-means, etc.) or the deep learning of PyTorch and TensorFlow. These tools are the ‘generalists’ that embody a core AI/ML development platform.
- **Domain-Specific ML & Related Tools**: When we reach the fourth layer, we start to identify ‘specializations’ in the tooling—narrowing to a purposeful focus on a certain kind of data, whether text, images, audio, or some other category. These categories are sufficiently different that it’s necessary to develop dedicated tools for each. This is the last row where you can usually count on all of the projects being open source.
- **Foundation Models**: The next layer of the stack contains the large foundation models themselves; examples include GPT and Llama-2 for text, DALL-E-3 and Stable Diffusion for images, and AudioCraft and Voicebox for audio. We’re also starting to see ‘hybrid’ models able to process and generate mixed content. This layer represents the union of data and code: the various models often use similar architectures, but their phenomenal properties are more a product of the massive datasets used to train them.
- **Commercial Applications**: These are the ‘luxury hotels’ that the public is generally aware of—the tools that can do the amazing things that we’ve come to expect from generative AI. Very few of the tools on this level are open source; they’re nearly always commercial, paid products—but, again, they couldn’t exist without the mountain of freely-available open source projects they sit atop.

## Quansight's Expertise Across the Stack

We proudly stand at the forefront of expertise across the Python Generative AI stack. Our involvement extends to key projects, such as maintaining NumPy and SciPy, being PyTorch maintainers, and having expertise with foundation models. We encompass a broad spectrum, from using and enhancing models to managing data, building MLOps pipelines, and optimizing infrastructure.

We are also the creators of Nebari, a versatile tool that configures and manages essential elements like cloud instances, containers, Kubernetes, and UI platforms, ensuring a streamlined experience. In particular, Nebari can be used to set up your own generative AI system, allowing you to customize it how you need and not send your data to third party services.

Key elements of our expertise at each level of the diagram are:

- **Programming Languages**: Quansight’s particular expertise is in Python and Javascript (in the context of our work in the Jupyter ecosystem), though we also have expertise in compiled languages like C and C++.
- **Scientific Computing Tools**: We currently employ 25+ maintainers across the PyData stack, and numerous Quansight staff contribute regularly to open source. Check out the [Quansight Labs Team page](https://labs.quansight.org/team) to see a list of the projects we contribute to and maintain.
- **General ML Tools**: On this level, far and away we’re most deeply involved with PyTorch. We currently have the largest PyTorch contributor team outside Meta and Microsoft, and we’ve been contributing to the core of the project since 2019. This expertise lets us build and accelerate client projects with high efficiency: we know how the PyTorch internals work, because we helped build them.
- **Domain-Specific ML & Related Tools**: We develop expertise with many of these domain-specific tools as part of the natural progression of our broader work with PyTorch. One project with which we have particular expertise is torch-vision, a computer-vision package for PyTorch: two of the top five torch-vision maintainer-contributors are Quansight staff.
- **Foundation Models**: We’ve spent a great deal of time working with and keeping up to speed on a variety of foundation models, mostly large language models (LLMs) in the text-processing space.
- **Commercial Applications**: A core subset of Quansight’s business offerings is focused on helping our clients build and host their own generative AI tools based on best-in-class foundation models, affording them increased customizability, significantly reduced costs, and dramatically improved data privacy. These in-house solutions also insulate our clients from unpredictable licensing, pricing, or other changes made by third-party vendors.

## Our Philosophy on OSS Sustainability

Here at Quansight, we believe open source is not just the foundation of generative AI but is the very bedrock of essentially all modern software and technology—underpinning everything from the internet to smartphones and beyond. We believe this so strongly, in fact, that we wrote a book—[Open Source For Dummies](https://www.openteams.com/open-source-for-dummies/)—on open source and its importance in the modern world.

However, achieving sustainability in open source is a challenge that necessitates business model innovation. The free and open nature of open source software is a key element of its success, but the development and maintenance of open source is _not_ free: maintainers have to make a living, and if they’re not paid to do that maintenance work it can lead very quickly to overload and burnout, especially for projects at the foundations that become widely popular without clear sponsorship

Quansight and Quansight Labs are at the forefront of addressing these challenges and driving sustainability within the open source ecosystem. In fact, open source sustainability is the key reason why we created Quansight Labs: linking our paid consulting work to support for maintainers of key projects on this generative AI mountain. We’re in the company of many teams working to build sustainable open source models, including our sister company [OpenTeams](https://openteams.com) and others like [NumFOCUS](https://numfocus.org), [Tidelift](https://tidelift.com), [Anaconda](https://anaconda.com), the [Apache Foundation](https://apache.org), and the [Linux Foundation](https://linuxfoundation.org). Working toward open source sustainability is a critical element of who we are.

## Conclusion

If you’re looking for expertise on any level of the OSS mountain range that builds up to generative AI on the peaks, reach out and start leveraging the power of open source generative AI in your business.

Or, if you’re interested in talking further about open source sustainability, we want to hear from you, too! We will point you to additional information and resources to help you connect your company sustainably with open source communities.

[Get in Touch](https://quansight.com/about-us/#bookacallform)
