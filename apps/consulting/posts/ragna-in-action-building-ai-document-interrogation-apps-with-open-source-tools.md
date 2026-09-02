---
title: 'Ragna in Action: Building AI Document Interrogation Apps with Open Source Tools'
published: August 22, 2024
authors: [quansight]
description: 'A look at recent presentations on AI, RAG, and Ragna by Quansight’s staff. “For playing around, Generative AI is definitely'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/ragna-in-action-building-ai-document-interrogation-apps-with-open-source-tools/Ragna_in_Action.png
  alt: 'The image shows the logo for Ragna. It features a stylized Viking ship with a dragon figurehead and three round shields along the side. The sail is depicted as a reddish-orange sheet of paper with white lines representing text. Below the ship, the word "RAGNA" is written in a modern, bold font. This logo symbolizes Ragna’s role in navigating and harnessing the power of data and AI technology, much like a Viking ship exploring and conquering new territories. The words, Ragna In Action appear below.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Ragna in Action: Building AI Document Interrogation Apps with Open Source Tools'
---

_A look at recent presentations on AI, RAG, and Ragna by Quansight’s staff._

> For playing around, Generative AI is definitely cool. For asking serious questions about documents, which you're going to base your business on, I think you still need to do your research and work out how to put some guard rails on it.
>
> — Dharhas Pothina, Quansight CTO

Welcome to an exploration of [Ragna](https://ragna.chat/en/stable/), an open source framework tool developed at [Quansight](https://quansight.com/) for the experimentation and deployment of retrieval-augmented generation-based AI applications.

As machine learning continues to evolve, the need for accurate, contextually aware, and reliable information retrieval has increased. While powerful, traditional large language models (LLMs) may be limited by their training on static datasets, often resulting in outdated or irrelevant responses. Ragna addresses this challenge by integrating real-time data retrieval with generative AI capabilities, providing a flexible, open source framework for building applications.

Generative AI is fun to play around with but difficult to actually deploy within your business. You need to think differently from traditional software development. Exploration, iteration, and experimentation are key to success. Ragna’s significance has been guided, in part, by insights from Quansight’s CTO, Dharhas Pothina, and more directly by Philip Meier, a senior software developer at Quansight and one of the core Ragna developers. Their work on Ragna underscores its value as a framework for leveraging RAG.

> The idea for Ragna came up when we were working for a client, and we were doing our initial investigation of what we could use. We felt that you had two sides of the spectrum…We identified this hole in the middle where we want to have a good user experience, but still, we want to be able to configure stuff, and this is where Ragna came in.
>
> — Philip Meier, Ragna Developer Team Member

Ragna distinguishes itself by allowing developers to use the same components across Python, a REST API, and a web UI. Its versatile integration approach makes it easy to experiment with different components like LLMs and vector databases. At Quansight, we specialize in bringing these pieces together, providing a practical tool for developers and researchers.

By advocating for open source solutions and collaborative development, Quansight seeks to democratize access to AI tools and resources, making possible a broader range of participants to contribute to and benefit from technological advancements. Join us as we explore Ragna’s role in shaping the future of AI.

> If you have memories that are far into the past, it's very easy to ‘hallucinate;’ This is the term used for LLMs. That happens to us humans as well. Our brain just fills up the information and tries to make up information so we can answer questions. The RAG analogy would be, when someone tells you something and then asks you a question right after (which would be in your short-term memory), this is a lot easier for us humans to answer…and for LLMs as well.
>
> — Philip Meier, Ragna Developer Team Member

## An Explanation of Retrieval-Augmented Generation (RAG)

Retrieval-Augmented Generation, or RAG, represents a significant advancement in the capabilities of large language models (LLMs). At its core, RAG is a method that combines the strengths of retrieval-based systems with generative models to enhance the accuracy of AI-generated responses. LLMs, such as GPT-3 and GPT-4, are trained on massive but static datasets, which means their knowledge is limited to the information available up to the point of their training. This fixed nature often results in outdated or contextually incorrect answers when these models are queried about recent or specific information.

**Want to understand RAG? Read more about it here: **[Unveiling Ragna: An Open Source RAG-based AI Orchestration Framework Designed to Scale From Research to Production by Dharhas Pothina](https://quansight.com/post/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production/)\*\*\*\*

RAG addresses this limitation by introducing a two-step process: Retrieval and Generation.

The article Unveiling Ragna explains RAG’s two-step process. In the Retrieval step, the system searches a database to find relevant documents or passages that might contain the needed information. These retrieved texts are then fed into the Generation step, where a language model uses them to generate a precise and contextually relevant response. This combination allows the AI to leverage real-time data and specific context, significantly enhancing the accuracy and relevance of its outputs.

> LLMs have a fixed context size. This context size is a measure of how much data the LLM can ingest in a single prompt. If you have a vast number of documents and you want to ask questions about them, you can't just send all the documents to the LLM and ask questions about them. Even if you have an LLM that has a massive context size, you're still making it very hard for the LLM to answer your question. Imagine someone reads you three books and then asks you a single question afterward. It's really hard to figure out what is the relevant information here.
>
> — Philip Meier, Ragna Developer Team Member

## Ragna: Its Components, Purpose, and Development

Ragna is an open source framework developed by Quansight that leverages the principles of RAG to provide a flexible tool for building AI applications. The development of Ragna came from the need to create a transparent, extensible, and user-friendly framework that addresses the limitations of existing LLM tools. Quansight recognized that while many commercial intelligent retrieval solutions are effective, they often operate as black boxes, sometimes lacking transparency and configurability. This insight, in part, led to the creation of Ragna.

Ragna comprises several components that work together to facilitate the development of RAG-based applications:

1. **Python API for Experimentation:**  
   Ragna’s Python API allows developers to mix and match various components, such as LLMs and vector databases. This flexibility allows users to test different configurations and understand their effects on performance and accuracy. By providing fine-grained control over each component, Ragna makes it possible to explore and optimize AI models for specific use cases.
2. **REST API for Building Web Apps:**  
   In addition to the Python API, Ragna offers a REST API that allows developers to build custom web applications. This API wraps around the Python API, ensuring a consistent and scalable developer experience.
3. **Web UI for Ease of Use:**  
   Ragna includes a web-based graphical user interface (GUI), simplifying configuring and interacting with AI models. Through this interface, users can upload documents, select and configure LLMs, and chat with the models. The Web UI is an out-of-the-box solution for immediate use and a reference for building custom low-code web applications.

> One of the reasons we built this tool is our clients were trying to work out how much they could trust these models. They kept asking which vector database to use, which embedding model, and ‘how much can we trust it.’ If they asked the system a question about earnings and it made answers up, and their analysts use that to build a report, now they're in trouble.
>
> — Dharhas Pothina, Quansight CTO

## Purpose and Development of Ragna

The primary purpose of Ragna is to democratize access to current RAG capabilities by providing an effective and easy-to-use open source framework. Ragna addresses the challenges faced by organizations seeking to leverage AI for document interrogation, data analysis, and other complex tasks. Its design is accessible to a broader audience, enabling more organizations to benefit from this technology.

Quansight led the collaborative effort to develop Ragna, which involved contributions from several key team members and feedback from early adopters. The project was compelled by a commitment to open source principles, making sure Ragna remains transparent and extensible. By providing a framework for RAG applications, Ragna helps users conduct experimentation, optimize AI models, and deploy effective solutions that meet specific needs.

For instance, in his demonstration from PyData NYC, Dharhas Pothina highlighted how Ragna allows users to upload documents, choose different models, and configure various vector databases. This capability is vital for experimenting with different configurations and understanding the impact on performance and accuracy. Whether you’re working with OpenAI’s ChatGPT-4o, Anthropic’s Claude 3, or local LLMs, Ragna’s Python API gives you the tools to explore your models effectively.

[Watch the video](https://youtu.be/dhxRO6HdSh0?si=Irsq86cjjnGjfXmH)

## Build an AI Document Interrogation App in 30 Minutes

Dharhas demonstrated how easy it is to create a web app using Ragna’s REST API and [Panel](https://panel.holoviz.org/) (from which Ragna’s UI is built). Users can quickly build applications that leverage RAG to answer queries by simply uploading documents and selecting models. This capability is particularly valuable for organizations looking to deploy AI solutions that are easy to use without needing to get into the underlying code.

He then showcased Ragna’s Python API and Web UI by uploading financial documents from major US-based automobile manufacturers and queryed them to retrieve specific information. The interface not only provides the answers but also shows the source of the information, allowing users to verify the accuracy and trustworthiness of the responses. This transparency is crucial for guaranteeing the reliability of AI-generated content, especially in professional settings. The ease with which he set up this application underscored Ragna’s potential for rapid prototyping and deployment.

> One of the advantages of this RAG approach is that you have some sources, so you can see if it is making answers up or if it’s coming from somewhere else. What people often do is, when they give an LLM new information, they say, ‘Please only use this data.’ However, this is a statistical LLM; it's not a person you can reason with.
>
> — Dharhas Pothina, Quansight CTO

## Extensibility and Open Source Nature

Ragna’s architecture allows for easy integration of new models, databases, and other components. It was built with extensibility in mind, and this modularity makes sure that Ragna can evolve alongside advancements in AI technology, accommodating new tools and techniques as they emerge.

Another aspect that sets Ragna apart is its open source nature, which encourages collaboration. This approach can accelerate innovation and align with the principles of transparency and inclusivity championed by Quansight and our open source partners. Users are encouraged to contribute to Ragna’s development, share insights, and help shape its future.

## Step-by-Step Guide to Setting Up and Using Ragna

At PyData Global 2023, Philip Meier from Quansight presented a live demonstration. This session offered a detailed walkthrough of setting up and using Ragna, showcasing its capabilities for AI-driven document interrogation. Philip’s presentation underscored Ragna’s practical applications and potential to assist organizations in managing their documents.

Philip then addressed the [differences between Ragna and other RAG libraries](https://ragna.chat/en/stable/references/faq/#why-should-i-use-ragna-and-not-x), such as LangChain and LlamaIndex. He pointed out that while these libraries offer extensive integration options, they often come with significant complexity and hardcoded limitations. On the other hand, Ragna is designed for flexibility and ease of use.

Philip repeated his demonstration in April at PyCon DE, and Quansight’s Pavithra Eswaramoorthy also presented a Ragna demo at PyCon US in May. We will share the videos of those presentations when they become available. In the meantime, here are the abstracts from both of those conferences:

[-PyCon DE](https://2024.pycon.de/program/WPKRCT/)

–[PyCon US](https://us.pycon.org/2024/schedule/presentation/103/) [(VIDEO)](https://youtu.be/5siI6flge6g?si=oYmS91Gq_A-VmIVP)

**Read more: Launching Ragna:** [The Open Source RAG-based AI Orchestration Framework – an Interview with Philip Meier](https://quansight.com/post/interview-launching-ragna-the-open-source-rag-based-ai-orchestration-framework/)

## Quansight's Continued Expertise in This Space

Quansight’s role in developing Ragna highlights its thought leadership in the AI and data science communities. By creating an open source framework that addresses the limitations of existing tools, Quansight demonstrates a commitment to advancing RAG technology responsibly. Philip’s presentation showcased Ragna’s technical capabilities and reflected Quansight’s dedication to fostering an open and collaborative scientific computing ecosystem.

Through Ragna, Quansight provides a tool that aligns with its mission of promoting responsible innovation and scientific rigor. Ragna’s flexibility, transparency, and development demonstrate Quansight’s dedication to advancing the field of AI in a way that benefits both the industry and society at large.

Philip’s demonstration at PyData Global and Dharhas’s talk at PyData NYC showcased Ragna’s capabilities and Quansight’s leadership in the AI space. By providing a detailed walkthrough of setting up and using Ragna, illustrating practical applications, and highlighting its configurability and extensibility, they both made clear and compelling cases for its adoption in various organizational contexts. By identifying and addressing critical gaps in existing AI tools, Quansight has developed advanced, accessible, and user-friendly solutions. Ragna’s creation embodies this approach.

> One of the big things that came from the use cases of multiple clients was this idea that they had internal documents and wanted to ask someone to read them. Say they have 40 years of documents. No analyst can read, summarize, and understand all those documents. Wouldn't it be great if we could use LLMs to just ask a question like, ‘Which was the best business strategy,’ and it would magically give us the answer?
> Great idea, but very difficult to do in practice.
>
> — Dharhas Pothina, Quansight CTO

Quansight’s philosophy revolves around continuously identifying gaps in the Data Science landscape and developing open source solutions to bridge these gaps. This proactive approach makes sure that the tools and technologies we create are not only cutting-edge but also available to the broader community. Dharhas Pothina explains that the development of Ragna stemmed from the need to provide a transparent and customizable framework that could handle complex AI tasks without the limitations offered by black-box commercial solutions.

In his talk, Dharhas highlighted how Quansight’s consulting work often reveals opportunities for new open source packages. By leveraging its deep expertise in the PyData ecosystem, Quansight molds these insights into tangible solutions that benefit the entire AI community. This commitment to open source development is key to Quansight’s mandate of fostering innovation and collaboration in AI.

> What we're presenting is a tool for you to explore what works on your own data instead of having to rely on OpenAI, Anthropic, Mosaic, or any of the other companies. Those companies will let you upload a PDF and ask questions, but you don't know how they're generating the answer.
>
> — Dharhas Pothina, Quansight CTO

## Ragna and the Broader RAG Landscape

The future of Ragna and the broader RAG landscape is promising. As AI evolves, the need for tools that can dynamically integrate real-time data with generative models will only grow. Ragna is positioned to provide a platform that can adapt to new advancements in technology. Quansight’s commitment to continuous improvement and community engagement assures that Ragna will remain at the forefront of innovation, offering users the latest capabilities and best practices in RAG.

The broader RAG landscape is also set to expand, with increasing interest from academic, government, and industrial sectors. The ability to enhance generation with up-to-date and contextually relevant information opens new possibilities for applications across various fields, from finance and healthcare to education and beyond. Ragna’s role in this expansion will be helpful, as it provides the tools and framework for researchers and practitioners to explore and develop new RAG-based solutions.

> To really understand and have confidence in deploying something, you need to do your own research for your organization using your type of data. We're proposing that Ragna is a fully open source framework you can use, and we would love for people to help us develop it.
>
> — Dharhas Pothina, Quansight CTO

## An Invitation for the Community

We invite the global AI community to use Ragna. Your input is invaluable, whether you are a developer, researcher, or enthusiast. By participating in the use of Ragna, you can help shape the future of RAG technology, ensuring that it continues to meet the evolving needs of users worldwide.

Visit the [Ragna.chat](https://ragna.chat/en/stable/) to get started today.

Let’s work together to advance the field of AI, fostering a community that values transparency and responsible innovation. Ragna’s success depends on the collective efforts of its users and contributors, and we are excited to see how this collaboration will drive the next wave of AI advancements.

![The image shows the logo for Ragna. It features a stylized Viking ship with a dragon figurehead and three round shields along the side. The sail is depicted as a reddish-orange sheet of paper with white lines representing text. Below the ship, the word "RAGNA" is written in a modern, bold font. This logo symbolizes Ragna’s role in navigating and harnessing the power of data and AI technology, much like a Viking ship exploring and conquering new territories.](/posts/ragna-in-action-building-ai-document-interrogation-apps-with-open-source-tools/Ragna-logo-lockup-vertical-01.svg)
