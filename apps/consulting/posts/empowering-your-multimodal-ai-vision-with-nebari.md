---
title: 'Empowering Your Multimodal AI Vision With Nebari'
published: December 20, 2024
authors: [dillon-roach]
description: 'As someone who loves to tinker with the latest open models,  I know the joy and hassle of getting from The Release Post to the first working inference call.'
category: [Artificial Intelligence, 'Infrastructure & HPC']
featuredImage:
  src: /posts/empowering-your-multimodal-ai-vision-with-nebari/2024.12-Empowering-Your-Multimodal-AI-Vision-With-Nebari-Dillon-Roach-Quansight-Consulting-Thumbnail.jpg
  alt: 'Empowering Your Multimodal AI Vision With Nebari'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Empowering Your Multimodal AI Vision With Nebari'
---

As someone who loves to tinker with the latest open models, I know the joy and hassle of getting from The Release Post to the first working inference call. As the scale and complexity of these tools grow, finding a flexible, cost-efficient environment to run them becomes critical. Even more so if you’re in charge of bringing these tools to the rest of your organization. So, when I recently read about two excellent new vision language models, I knew our company’s Nebari instance would be a great way to try them out.

![Group dinner scene in a warmly lit room with decorative ceilings and a large blank](/posts/empowering-your-multimodal-ai-vision-with-nebari/image1.jpg)

At this point, you’ve likely read quite a bit about Large Language Models (LLMs) – the ChatGPTs and the Llamas of the world. But, Vision Language Models (VLMs) haven’t had quite as much spotlight just yet. Until recently, the open models haven’t quite been up to the tasks you might want to throw at them in earnest. Another challenge is that they tend to lose their performance more quickly than LLMs as you run them with less precision, meaning you need more hardware to get them at their best. Thankfully, with a Nebari deployment, scaling your cloud compute to match your needs can be as simple as an edit to a config file.

If you’re unfamiliar, Nebari is an open source data science platform built for collaboration and scaling. While it might be more straightforward to simply call a pre-existing API for some new tools, they’re not always available, and you lose control over your data when you start to send things out. Nebari can take some time to initially configure and deploy, but once it’s there, it can make life much easier for your end-users. When I first went to test these new models, we didn’t have a pre-existing configuration that would handle the largest of the model’s requirements. A quick message to a colleague (after a dutiful request and a nod from management) and a configuration change later, I had the resources I needed to spin things up. Not a beat missed.

## The VLMs

The two new VLMs I mentioned wanting to try were [Molmo](https://molmo.allenai.org/blog), by Ai2, and [Aria](https://rhymes.ai/blog-details/aria-first-open-multimodal-native-moe-model)) from Rhymes AI.

Molmo currently comes in four flavors, but I stuck to their Molmo-7B-D-0924 (D for demonstration) model and the Molmo-72B-0924 chonk that ate up 150GB VRAM across eight L4 GPUs during inference and prompted the config change request. Molmo does a lot of things well, but the most fun has to be the ‘Point to X’ ability showcased above, where you can ask it to locate things with simple language requests. If you just need to find pre-defined object classes, it’s hard to beat something like a YOLO model with its speed and accuracy, but you can’t then ask it what that ‘thing’ happens to be next to or to filter by some extra criteria (No, only \*red\* shirts). And yes, it was able to find Waldo after a few tweaks to the prompt and image scaling – Don’t tell my 4-year-old.

To see how the model would hold up against some of nature’s camouflage, I grabbed a few ‘hidden animal’ images from the internet and asked the model to point to the hiding animal. The owl below is representative of how that went—it was often an easy task for the model. While it’s not fast and small enough to stick in your next pair of outdoor AR glasses, it might be up to the challenge of sorting through trail camera footage.

![A dense forest scene with tall trees and thick branches, showcasing how well nature’s camouflage blends with the environment. An owl, marked with a digitally added blue dot, is perched on a tree trunk, nearly indistinguishable from the surrounding textures and colors. This image demonstrates the challenge of detecting camouflaged animals, a task for visual language models (VLMs)](/posts/empowering-your-multimodal-ai-vision-with-nebari/image2.jpg)

The other new model, Aria, is benchmark-competitive with the Molmo-72B model while only having a total of 25.3B parameters. It is also a mixture of experts (MoE) architecture, which means only 3.9B of those parameters are actively used for each token generation. Practically, this means it’s smart and fast. It doesn’t point to objects on request (Waldo is simply ‘by the beach’), but it has long (64k tokens) multimodal input understanding, which allows it to do things like reason over videos, not just images.

## Kicking The Tires

So, the models are interesting and new, and having Nebari deployed makes taking them for a test run a breeze. But how smart are they really? Returning to the original image in the post, a photo from a recent company retreat, I prompted each model with the following:

![](/posts/empowering-your-multimodal-ai-vision-with-nebari/image3.jpg)

## PROMPT: "Describe what's happening in this picture."

Molmo-72B:

The image depicts a large dining room filled with people seated at long tables. The room has white walls and a ceiling with intricate red and gold designs. A large white projector screen is visible on one wall, and there’s a window with a brown frame on another wall.

The tables are covered with white tablecloths and set with white plates, silverware, and glasses. Bottles of water and candles are placed on the tables, adding to the formal atmosphere.

The diners are dressed casually, wearing various colored shirts. A man in a plaid shirt is pouring a drink, while others are engaged in conversation or looking around the room.

The scene suggests a social gathering or event, possibly a conference or company dinner. The atmosphere appears lively and convivial, with people enjoying each other’s company in this elegant setting.

It seems pretty accurate—with the amusing call-out to ‘a man in a plaid shirt’ (Hi Chuck); I haven’t tested the notion, but I imagine because he’s the apparent largest person, due to perspective, there are a lot more visual tokens taken up describing him and the model can’t help but make sure it’s included.

Let’s see what Aria thinks.

Aria:

The image depicts a group of people seated at tables in a well-decorated room, likely for a formal dinner or a conference meal. Everyone is engaged in conversation, and the tables are set with full place settings, including plates, water bottles, and glasses. There is a screen setup at one end of the room, suggesting that there may be a presentation or talk happening. The atmosphere is collaborative and social, with individuals enjoying the event in this elegant setting.

It’s similar, if a bit more concise. It even starts and ends with the same four words, which I found amusing. Both models use Visual Transformer (ViT)-based visual encoders, though they’re not the same.

It’s all well and fine to simply describe the image, but let’s see what the model can make of the information beyond what’s immediately apparent. We’ll be nice and make sure we give the models inductive reasoning questions since we all read [that paper](https://arxiv.org/abs/2408.00114) last August about how LLMs are vastly more capable of inductive vs deductive reasoning… Right?

## PROMPT: "This is a picture of a company dinner event. What field do they appear to work in?"

Molmo-72B:

The group appears to work in the tech industry. Several clues point to this:

Many attendees have the casual, smart-dressed look typical of tech professionals. You can spot people wearing hoodies, plaid shirts, and other Silicon Valley-style attire.

The setting looks like a startup or tech company office. There’s a large whiteboard on the wall, which is common in tech workplaces for brainstorming and project planning.

The age range of the attendees skews younger, which is characteristic of many tech companies.

The atmosphere seems collaborative and informal, fitting for a tech team gathering.

While it’s not possible to pinpoint the exact field within tech without more information, the overall vibe strongly suggests a tech industry company dinner or team event.

Do keep in mind that Molmo’s vision encoder, a variant of OpenAI’s CLIP, scored in the 54-63% range on age classification when it was originally bias tested. Still, I’ll take that ‘younger’ any day. Jokes aside, it was spot on for the larger industry identification, though interestingly, it saw a “large whiteboard” this time where it already saw “a large white projector screen” when I asked it to describe the picture. Of note, no conversation history was carried forward between the two requests.

Aria:

Based on the image, it is not immediately clear which specific field these individuals work in. However, certain details could provide some clues:

1. **Attire**: The group is dressed in casual to business casual attire, suggesting a professional setting.
2. **Table Setup**: Multiple glasses, plates, and bottles on the tables indicate a formal setting, possibly involving meals and discussions.
3. **Projector Screen**: The presence of a projector screen suggests presentations or discussions, which is common in corporate or organizational settings.

With these observations, it is likely that this company dinner event is for a corporate or professional organization, possibly in fields like technology, consulting, or any other sector where formal dinners and discussions are customary.

This description paints with somewhat broader strokes, but we are a technology consulting firm. Let’s give it a follow-up question and see how far it can go:

## PROMPT: "This is a picture of a company dinner event. What country do they appear to be in?"

Aria:

Based on the ambiance and decor, it appears to be a company dinner event in a western country, possibly Italy or Spain. The ornate ceiling with floral patterns and the presence of wine glasses suggest a European setting. The architecture and decor details, such as the mirrors and chandelier, are also typical of European dining establishments.

It was, in fact, Italy. Not too bad, though the details are a bit vague; I’m sure you’d find ‘the mirrors and chandelier” in plenty of spaces outside of Europe. Molmo, on the other hand, was quite sure it was the Netherlands or Germany because of the lettering it thought it saw on bottles.

## PROMPT: "Green text that reads Blue, on yellow paper."

It’s pretty clever, but let’s see if I can trip it with a trick fit for a dinner party card game:

![An image of yellow paper with the word BLUE written in green colored crayon](/posts/empowering-your-multimodal-ai-vision-with-nebari/blue1a.png)

Even Molmo-7B-D:

The letters in the image are green. The word “BLUE” is written in capital letters using a green crayon on a light brown or tan background.

Returning to the owl and the tree, I wondered how Molmo might deal with synthetic image content. To check this, I pulled up Flux tools and in-painted a small mouse on a limb above the owl. Molmo had no issue recognizing the mouse right away.

![A dense forest scene with tall trees and thick branches, showcasing how well nature’s camouflage blends with the environment. An owl, marked with a digitally added blue dot, is perched on a tree trunk, nearly indistinguishable from the surrounding textures and colors. Above the owl, also marked with a blue dot, is a mouse added to the image later. This image demonstrates the challenge of detecting camouflaged animals, a task for visual language models (VLMs).](/posts/empowering-your-multimodal-ai-vision-with-nebari/image4.jpg)

In the end, experimenting with these cutting-edge, open, vision language models was not just interesting, from a tech standpoint, but downright fun. Especially when I could sidestep the usual setup hassles thanks to [Nebari](https://www.nebari.dev/). I was expecting the latest models to perform well but was still surprised by just how good they are at this point. If you’re interested in exploring the latest open models without the overhead of setting up complicated configurations and infrastructure, I’d recommend giving Nebari a try. The project is open source, so you can deploy it on your own and choose the hardware you want to run it on. We’re happy to help with an initial deployment and configuration. It made my short adventure painless and might just be the solution you’ve been looking for.

As a simple demo for these models, I’ve put together an open repo [HERE](https://github.com/Quansight/genai-demo-audio-vlm) that includes a Conda environment, instructions, and a basic chat interface. For the smallest model load, you’ll need a CUDA/NVIDIA GPU with at least 16GB VRAM, up to 50+GB for Aria. If you really want to go large, you can download the Molmo-72B model and update the folder path in the app from the 7B version—it’ll work just fine.
