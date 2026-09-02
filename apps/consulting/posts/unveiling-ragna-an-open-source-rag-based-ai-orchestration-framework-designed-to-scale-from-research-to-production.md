---
title: 'Unveiling Ragna: An Open Source RAG-based AI Orchestration Framework Designed to Scale From Research to Production'
published: October 31, 2023
authors: [dharhas-pothina]
description: 'Announcing Ragna, a new open source project from Quansight designed to allow organizations to explore the power of Retrieval-Augmented Generation (RAG) based AI tools.'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production/Unveiling-Ragna.jpg
  alt: 'Unveiling Ragna: An Open Source RAG-based AI Orchestration Framework Designed to Scale From Research to Production'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Unveiling Ragna: An Open Source RAG-based AI Orchestration Framework Designed to Scale From Research to Production'
---

![Image of the Ragna logo](/posts/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production/Ragna-logo-1000x500px-qeor71cpw39xlo1x886bdkcazk03vytxhmpyd5epiw.jpg)

Today, we are announcing the release of Ragna, a new open source project from Quansight designed to allow organizations to explore the power of Retrieval-Augmented Generation (RAG) based AI tools. Ragna provides an intuitive API for quick experimentation and built-in tools for creating production-ready applications allowing you to quickly leverage Large Language Models (LLMs) for your work.

At its core, Ragna is an extensible queue-backed framework that provides:

- A **Python API designed for experimentation** that allows you to mix and match the different components of a RAG model (LLMs, vector databases, tokenization strategies, embedding models, etc.) to see their effects on performance and accuracy.
- A **REST API that allows you to build RAG-based web applications** or query from other clients like Slack, Mattermost, etc. It wraps around the Python API and provides a consistent developer experience to scale quickly.
- A fully featured [Panel](https://panel.holoviz.org/)-based **GUI to select and configure LLMs**, upload documents, and chat with the LLM. For use as an out-of-the-box solution or as a reference to build custom low-code web applications.

Ragna currently ships with pre-built extensions for OpenAI, MosaicML, Anthropic, and local LLMs as well as the Chroma and LanceDB vector databases.

In this post, we explain what Retrieval-Augmented Generation is, how it can enable AI assistants to produce more accurate answers to queries, and why yet another tool was needed to make this happen.

{/_ TODO: manual conversion needed: widget=video.default (self-hosted video) _/}

Get started at [ragna.chat](https://ragna.chat/)!

## All About RAGs

Over the last year, Quansight has been helping clients explore the exciting and rapidly evolving world of generative AI, and one idea that has consistently excited people is the prospect of employing an AI assistant to inquire about extensive in-house document collections. The notion of being able to tap into the wealth of knowledge contained within these documents without the arduous task of reading each one is compelling.

However, foundational LLMs are trained on massive _but static_ datasets, and they do not have access to the information contained within your collection of documents. Questions you ask will either be unanswerable or be answered with a [_hallucination_](<https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)>). We need a mechanism to augment the LLMs with the new information from the documents.

![Screenshot of OpenAI's ChatGPT (GPT-3.5). Query: "What is the Ragna Framework?" Response: "As of my last knowledge update in January 2022, I am not aware of any widely known or established framework or technology called the Ragna Framework". ChatGPT continues to elaborate on potential reasons for unawareness.](/posts/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production/chatgpt-what-is-ragna-framework.png)

_ChatGPT has no idea what our new Ragna Framework is._

There are two primary methods for supplying a LLM with fresh data. The first approach involves presenting the data alongside a specific question and directing the LLM to exclusively focus on the provided data. This method falls under the category of _prompt engineering_. The second technique involves _fine-tuning_ or adjusting the LLM’s parameters through additional training on the new data. Both of these approaches come with their respective challenges. Incorporating data into the prompt is constrained by the limited space available for text in the prompt (approximately 3,000 words for ChatGPT 3.5), making it suitable only for very small datasets. Fine-tuning demands a substantial volume of data, necessitates the use of expensive GPUs, and still carries the risk of producing hallucinations due to the substantial “weight” of the considerably larger original training dataset.

The RAG approach is a combination of a retrieval model and a generative model, and it can be viewed as a tailored variation of prompt engineering. Instead of attempting to include the entire text from a collection of documents in the prompt, it involves conducting a similarity search to pinpoint the segments of text that are most probable to house the answer to the posed question. Subsequently, this smaller subset of text is incorporated into the prompt along with directions to exclusively focus on the provided text.

To understand how this works, let’s define some terminology:

**Tokenization** – involves breaking down a piece of text, such as a document or query, into individual units called tokens. Tokens are typically words, subwords, or other linguistic units.

**Embedding Models** – are neural network-based models designed to convert discrete tokens (words or subwords) into dense, continuous vector representations. These vector representations are called embeddings and capture semantic information about the tokens.

**Vector Databases** – are specialized databases designed to store data in vector format. The primary purpose of a vector database is to enable efficient and fast similarity searches to allow for quick retrieval of documents or text passages that are most similar to a given query or vector.

**Similarity Search** – is the process of comparing a query vector (representing a question or query) with vectors stored in the vector database to find the most similar documents or passages. Various mathematical measures, such as cosine similarity or Euclidean distance, are used to assess similarity.

![RAG](/posts/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production/RAG-qeoi6yk0m2kml5u7t8lpnrxxfrquhgcvtd5m1tswkm.png)

The diagram illustrates a series of steps that lead from a query to an answer, as outlined below:

- Tokenize the documents, apply an embedding model, and store the results in a vector database.
- Tokenize the query and apply the embedding model.
- Utilize similarity search to extract text passages from the vector database that closely match the query.
- Insert the identified text passages into a prompt, along with the query and specific instructions to concentrate solely on the provided text.
- Dispatch the prompt to the LLM to generate a response.
- Return the response and also the list of the text passages from which the answer was derived, allowing for accuracy verification.

## So, Why a New Tool? Aren’t There Plenty Already Out There?

We did not set out to build a new tool; rather, our primary focus was on developing AI capabilities for our clients. However, as we assisted them in navigating the AI landscape, it became evident that a significant gap existed in the ecosystem.

On one side, there are numerous commercial players offering document query tools, but these solutions are both costly and lacking transparency. The inner workings of these tools are hidden, and there is the added problem of vendor lock-in.

On the other side, we encountered enthusiast tools such as LangChain and Llama Index, which have gained immense popularity (our initial investigations began with LangChain). These tools were excellent for initial exploration of a wide array of AI capabilities when using default settings. However, they quickly became inadequate when fine-grained control over components was required. This was typically due to the many layers of abstractions necessary to accommodate “all” AI use cases.

As Quansight accumulated experience in developing RAG applications for diverse clients, certain common needs became apparent:

- Out-of-the-box UI for initial experimentation
- Programmatic and flexible research tools, not tied to a specific model or workflow
- Options to swiftly build and deploy prototype applications for various use cases
- Pathway to transition to production applications without the need for a complete code overhaul

Ragna was conceived to bridge this gap in the ecosystem, serving as a fully open source framework for constructing RAG-based AI applications that seamlessly scale from research and prototyping to production.

![Code editors (JupyterLab) can interface with Ragna's Python API, and web UIs and third-party integrations (Slack) can interface with the REST API which wraps around the Python API. The APIs use task queues and workers to connect to asssistants (LLMs) like OpenAI's GPT and Source Storages (Vector databases) like Chroma. The APIs also have access to a SQL database and object storage to track the user session.](/posts/unveiling-ragna-an-open-source-rag-based-ai-orchestration-framework-designed-to-scale-from-research-to-production/ragna-architecture-qeoic0wqnsa4axasb9m1ogxpc0jhclpcgqt59y8plu.png)

## Get Started: ragna.chat

You can install and try out Ragna for yourself in under 10 minutes, and check out the documentation at [ragna.chat](https://ragna.chat/en/latest/) to learn more.

```bash
pip install 'ragna[all]'  # Install ragna with all extensions

ragna init  # Initialize configuration

ragna ui  # Launch the web app
```

Ragna is an early-stage open source project that has a long way to go. We’d love to hear your [thoughts and feedback](https://github.com/Quansight/ragna/discussions), and [welcome all contributions](https://github.com/Quansight/ragna/issues) to help improve Ragna.

## Exploring Generative AI? We Can Help.

If you need someone to help you explore generative AI, build and deploy capabilities across your organization, Quansight can help. See our [LLM Services](https://quansight.com/llm-services/) for more information or get in touch with the button below.

Thanks for reading! ⛵

[Contact Us](https://quansight.com/llm-services/#bookacallform)
