---
title: 'Interview: Launching Ragna, the Open Source RAG-based AI Orchestration Framework'
published: November 8, 2023
authors: [quansight]
description: 'Join us in a chat with Philip Meier, one of the core developers of Ragna, as we delve into its roots and development journey.'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/interview-launching-ragna-the-open-source-rag-based-ai-orchestration-framework/Interview-Launching-Ragna.jpg
  alt: 'Interview: Launching Ragna, the Open Source RAG-based AI Orchestration Framework'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Interview: Launching Ragna, the Open Source RAG-based AI Orchestration Framework'
---

Join us in a chat with Philip Meier, one of the core Ragna developers, as we delve into its roots and development journey.

![Image of Philip Meier, a core developer of Ragna](/posts/interview-launching-ragna-the-open-source-rag-based-ai-orchestration-framework/Philip-Meier-final-qf2ozx2vd0g1f7o2ab0snux69yo3odhjokimf69dgc.png)

Quansight [recently announced](/blog/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production) the release of [Ragna](https://ragna.chat/en/stable/), a new open source project that allows organizations to explore the power of Retrieval-Augmented Generation (RAG) based AI tools.

With an easy-to-use API for experimenting and built-in tools for crafting production-ready applications, Ragna can easily streamline the integration of [Large Language Models (LLMs)](https://en.wikipedia.org/wiki/Large_language_model) into your workflow.

This release is a significant step forward for Generative AI and the quest to obtain more precise information from queries with LLMs.

## Philip, Tell Us About Your Background and Your Role at Quansight.

I am a Senior Software Developer at Quansight. I started in electrical engineering then went into mechatronics, which is fairly detached from what I’m doing now. During my time working on my PhD, I fell in love with software engineering.

With that, I joined Quansight three years ago and since then I’ve been almost exclusively working in [PyTorch](https://github.com/pytorch/pytorch)—namely, Torchvision. I’m a core library maintainer there, but starting this year I ventured out from back-end library development and started doing projects that were more applied and client-facing.

## What Is Retrieval-Augmented Generation, a.k.a. (RAG)?

RAG is essentially about using [Large Language Models (LLMs)](https://en.wikipedia.org/wiki/Large_language_model), like the ones you’ve probably heard about in the media, such as ChatGPT and Bard. These LLMs are great, but they have a quirk—they sometimes provide answers to questions that are just plain wrong. This happens primarily because they’re trained on vast but static datasets.

RAG, short for Retrieval-Augmented Generation, is a machine learning technique that combines two cool things in natural language processing: retrieval and generation. It’s all about making language models better at tasks by searching a huge pile of data and then coming up with responses that actually make sense in context.

## Tell Us About Ragna. How It Works and the Problem It Solves.

Ragna is an open source project that is both a framework and an application for RAG use cases. It’s not a new LLM or a [vector database](https://en.wikipedia.org/wiki/Vector_database) but rather an orchestrator that makes everything work together.

Ragna is basically three parts. We have what’s called the lowest-level part which is basically a Python API built for experimentation. You have full control over the different components, while also having the option to only change the parts you want.

On top of this Python API, we’ve built a REST API that enables you to build your own RAG web apps or whatever other applications you have in mind that use RAG in the background.

And on top of that we have a web UI, which is what most new users will probably try out first. This is a _hands-off_ approach where you don’t need to know anything about RAG, but can just upload some documents and ask questions about them. This is for people who actually want to use the Ragna workflow to learn something about the documents and not just play with it to push the limits of what they currently do.

All of this together makes a RAG use case very accessible—that’s the point.

You can solve RAG with other tools as well—we don’t have a patent or hold on RAG, and this is not something that we have invented. But we do make it really easy. There are plenty of other tools that could also do RAG, but we are specialized in this.

We’ve built everything just with this one use case in mind and for that we are ahead of the game. We can shed a lot of weight basically because we don’t need to support multiple use cases at the same time.

## How Did This Idea Come To Be and What Was Your Role in Making It Happen?

Yeah, so that’s a crazy story. So, as I mentioned earlier, this year I started to venture into more applied projects and one in particular involved developing an application with a functionality similar to what Ragna has.

After the project ended, I spoke with a few colleagues in a group chat and said, “There’s no real business logic here; it’s all about orchestrating. Why isn’t there something like this in the ecosystem?”

They suggested I pitch it to Dharhas [Pothina], Quansight’s [CTO](/about-us), but due to scheduling, I wasn’t able to meet with him for over a week…but I was hooked on the idea and I started working on it outside of my regular work hours.

By the time I finally talked to Dharhas, I had a substantial part of what I wanted to achieve already done. Looking back, I realize it was just a small piece of what Ragna has become.

I pitched the idea to Dharhas, and he liked it, but he said, “We need to get Travis [Oliphant], Quansight’s [CEO,](/about-us) on board so we can authorize budget.” He told me to prepare some slides to explain the vision of Ragna.

I went to bed that night feeling pretty good about the whole thing. I’d put in some work and now it had potential.

The next morning, I woke up to a message from Dharhas. He hadn’t waited for my slides; he’d already talked to Travis, and they were on board. We had a budget, we had a team, and it was time to get started.

That was in August and here we are.

## What Were Some of the Challenges in Building Ragna?

I needed to learn so many concepts. This was all new and it felt like I was drinking from a firehose for two months, but this was needed to achieve my goal of making Ragna a well-engineered and easy-to-use application.

I think this was the main challenge and of course, time is always a challenge. Since this space is still pretty much in hype-mode, getting stuff done quickly is key because two weeks later someone else might have already swooped in and taken a lot of the stuff you’ve done.

## What Was Your Favorite Part About Building This Project?

Similar to my answer to the last question, it was learning along the way. I thrive with this kind of task where I learn something new every single day. This project was pretty much the definition of that for me.

## Why Did You Want To See This Project Open Sourced?

So, I have a two-fold answer to this.

The first one is that my baseline is to always open source everything that has no business logic to it. The whole reason this project started was that there was no business logic so why _wouldn’t_ we open source it?

The second answer is that Ragna is an orchestration tool that has general applicability and fills a gap in the ecosystem. We expect to use it and enhance it as we build solutions across several of Quansight’s clients and we hope to collaborate with the wider community in this space. All of this is enabled by the project being open source.

## Who Played a Pivotal Role in Developing Ragna, and How Did Quansight Contribute to the Project’s Success?

I couldn’t have done this in such a short amount of time without the support from Quansight. Quansight gave me a budget and a team and made space for me to spend time on this project by reducing my time on client projects.

At an executive level, Travis was really excited by the project and had confidence we could pull it off.

Dharhas was our executive sponsor and project lead and supported me in identifying team members for the project and providing direction.

There were four main contributors and several supporting colleagues who made this possible.

- Pavithra Eswaramoorthy for project management
- Pierre-Olivier Simonard implemented the UI work
- Smera Goel created the UX and UI design
- Irina Fumarel did the design and branding for the logo

Additionally, there was Chuck McAndrew who helped me deploy Ragna and Chris Ostrouchov who spent countless hours in video chats with me patiently explaining new concepts.

## What Key Open Source Projects Does Ragna Depend On?

Ragna relies on a variety of open source components, but I’ll spotlight the top three that play a crucial role in Ragna’s capabilities.

- [**Huey**](https://huey.readthedocs.io/en/latest/): Ragna employs Huey as its task queuing system to facilitate interactions between users and the vector database on the backend. Huey’s versatility streamlines operations, ensuring a consistent backend experience, whether in production or during local development.
- [**FastAPI**](https://fastapi.tiangolo.com/): For the REST API layer, Ragna utilizes FastAPI, a well-established framework within the Python ecosystem. FastAPI simplifies the process of creating a robust REST API by handling the majority of complex tasks, allowing developers to focus on their specific requirements.
- [**Panel**](https://panel.holoviz.org/index.html): Ragna’s UI components are built using Panel, a Python application framework developed by HoloViz. Panel’s latest release incorporates a chat widget with a chat box, significantly simplifying UI development and reducing the workload by about 80%. The chat widget serves as the core of Ragna’s user interface, requiring essential configuration for seamless operation.

## Where Do You Hope Ragna Goes From Here?

I hope Ragna gets a stable user base, that’s always the first step. People have to initially find a project useful in solving a problem they have. Once a user base exists, people will start finding rough edges they’d like to fix, then start contributing and improving the project.

From there, I hope a community forms around Ragna so we can have a sustainable way forward without the need for Quansight to drive it. In general, we’ve had a lot of interest in our recent launch so I’m really excited to see where it goes from here.

If anyone reading this is interested in helping out, we’d love to have you and appreciate your [contributions](https://github.com/Quansight/ragna/issues)!

## Get Started: ragna.chat

Want to take Ragna for a spin? Head to [ragna.chat](https://ragna.chat/en/stable/) to get started. You can install it for yourself in under 10 minutes.

```bash
pip install 'ragna[all]'  # Install ragna with all extensions

ragna init  # Initialize configuration

ragna ui  # Launch the web app
```

We’d love to hear your [thoughts and feedback](https://github.com/Quansight/ragna/discussions) and welcome all [contributions](https://github.com/Quansight/ragna/issues) to help improve Ragna.

## Exploring Generative AI? We Can Help.

If you’re using or just getting started with generative AI and need help building and deploying capabilities across your organization, Quansight can help. See our [LLM Services](/llm-services) for more information or get in touch with the button below.

[Contact Us](/llm-services#bookacallform)
