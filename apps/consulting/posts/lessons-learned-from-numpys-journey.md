---
title: 'Lessons Learned from NumPy’s Journey'
published: November 29, 2024
authors: [quansight]
description: 'A Conversation with Ralf Gommers Exploring Governance, Growth, and Open Source Insights'
category: [Numerical Computing]
featuredImage:
  src: /posts/lessons-learned-from-numpys-journey/Ralf-Gommers.png
  alt: "A snowy mountain landscape with a clear blue sky in the background. The text 'Lessons Learned from NumPy's Journey with Ralf Gommers' is prominently displayed, and an image of Ralf Gommers smiling is placed in the foreground."
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Lessons Learned from NumPy’s Journey'
---

![](/posts/lessons-learned-from-numpys-journey/QuansightLabs_logo_V2.png)

_A Conversation with Ralf Gommers Exploring Governance, Growth, and Open Source Insights_

In this insightful interview, Ralf Gommers, co-director of [Quansight Labs](https://labs.quansight.org/) and a key contributor to [NumPy](https://numpy.org/), discusses the importance of sustainability in open source projects. He highlights the balance between [community-driven efforts and corporate support](https://quansight.com/post/community-first-open-source-an-action-plan/) while addressing the environmental impact of software. By encouraging better practices, he sees an opportunity to make software more sustainable. Ralf also highlights the need for universities to teach essential software skills and foster collaboration within open source communities, empowering the next generation of developers.

In a recent conversation with Gareth Thomas on [The Inspiring Computing podcast](https://www.inspiringcomputing.com/2107763/episodes/15847633-an-insider-s-view-on-the-heart-of-numpy-a-conversation-with-ralf-gommers), Ralf reflects on his journey with open source, particularly his work with NumPy. He shares insights on the project’s governance model, the value of community funding, and strategies for sustaining long-term projects. This discussion explores how collaboration and informed practices can enhance the impact of open source, benefiting developers and the broader community alike. Listen to their full conversation [HERE](https://www.inspiringcomputing.com/2107763/episodes/15847633-an-insider-s-view-on-the-heart-of-numpy-a-conversation-with-ralf-gommers) (or on your preferred podcast platform), or read Ralf responses below.

[Watch the video](https://www.youtube.com/watch?v=M9JuePWPp-I)

**Q:** Can you share a bit about your journey to becoming a key influencer in scientific computing?

**Ralf:** I’m from the Netherlands, where I grew up and studied Applied Physics. I have no formal training in software engineering—I think I took one course in Pascal, which was incredibly boring, so I didn’t touch programming for a few years after. Then I went into research. I initially intended to get a job, but in the last year of my degree, I discovered that my research was actually very interesting. That’s when I started learning programming because I had to generate and analyze data.

At that time, there was no funding available in the Netherlands for new academic work, so I went to the UK for my PhD. I thought I would then get a job, but my professor encouraged me to apply for a postdoc position at MIT. It was the only one I applied to, and I didn’t expect to get it, but I did, and that took me to the US. Over time, I moved around and worked in a few other countries, gradually getting more involved in software engineering through my research. For example, I worked a lot with lasers, optics, and atomic physics, where precise control of experimental settings was required. This is how I basically taught myself programming.

Initially, I was using MATLAB, but when I moved and didn’t have a license, I quickly realized the drawbacks of relying on proprietary software. So, I decided to switch from Windows to Linux, from MATLAB to Python, and started using Vim as my editor. There were some unproductive and frustrating weeks, but I eventually got the hang of it.

That’s when I learned about Numeric, the predecessor to NumPy, which was still in development back then. All this software was new, written by a few people in academia, with minimal documentation. The only way to find answers was on a mailing list, which I joined to learn. At some point, there was a call for help, and I felt comfortable enough to get involved. Since then, throughout my various jobs, I’ve done more programming and continuously contributed to NumPy and SciPy since around 2009.

**Q:** That brings us to today. Can you briefly explain what Quansight Labs is, your role there?

**Ralf:** I joined Quansight in 2019; it was about a year old then, and since then, we’ve grown to about 65 people. We’re a small consulting company, so we make our money by consulting, mostly around the PyData stack. In addition to that, we have an open source lab called [Quansight Labs](https://labs.quansight.org/), which I started leading when I joined Quansight, and I’m now co-leading with [Tania Allard](https://github.com/trallard). I focus more on numerical work, while she focuses on Jupyter, accessibility, and DevOps. We both do a bit of packaging because [everyone needs packaging](https://quansight.com/packaging-environment-management/).

**Q:** Given your long history with programming, what led you to transition from being a volunteer contributor to making open source your career, particularly with NumPy?

**Ralf:** It was about solving a problem I was facing. I worked on NumPy for 10 years as a volunteer, and as the user base grew, the demands became more intense. My professional career also became more demanding, and it reached a point where it just wasn’t sustainable anymore. Many long-time open source maintainers face this issue. I had to decide whether to stop contributing or try to make it my job. Around that time, I met [Travis Oliphant](https://github.com/teoliphant), the CEO of Quansight, at a conference. We’d known each other digitally for a long time but hadn’t met in person until then. He had just started Quansight with the goal of supporting open source projects, even though he no longer actively contributes himself. He suggested that I lead [Quansight Labs](https://labs.quansight.org/) to shape it and figure out how to make community-driven open source more sustainable. My job is to make open source more sustainable and provide a home for maintainers to do impactful work for the community.

> My job is to make open source more sustainable and provide a home for maintainers to do impactful work for the community.
>
> — Ralf Gommers

**Q:** What lessons have you learned from NumPy’s journey, and would you advise others to follow a similar path or take different approaches?

**Ralf:** I think it’s actually very rare for someone to start a project intending to change the world or reach millions of users. Most success stories are accidental. It usually begins with a personal interest or a problem you want to solve because you think you can improve on existing solutions. When it starts working and gaining traction, the most important thing you can do is reflect and develop conscious strategies around it. One part of that is deciding what to work on and being careful not to expand the project’s scope too much, which is something we still struggle with in both NumPy and SciPy.

**Q:** What challenges did NumPy face regarding decision-making and governance, and how did formalizing its governance model help improve collaboration among maintainers?

**Ralf:** There was an implicit understanding among the few active maintainers and the larger group of people who interacted on the mailing list, even if they didn’t actively contribute, about how things worked. When you wanted to add a new feature, you had to propose it with a prototype implementation on the mailing list, there had to be some discussion, and there was this implicitly defined bar of usefulness. At some point, that system started to break down, and it became necessary to formalize how decisions were made, who got to make them, and how to handle disagreements. This was a problem for NumPy for a long time, especially after Travis (Oliphant) left. He built the original version, but the project evolved far beyond that with a small group of people who didn’t have all the context, and none of them were clearly the leader of the project. It was all about finding consensus among everyone who wanted to have a say, which often meant that contentious discussions about design would eventually just lose steam, and nothing would happen as a result. Putting in place a formal governance model helped, as did having the bandwidth to organize things like community calls every two weeks and funding for sprints where people could meet in person, which improved collaboration.

**Q:** When was the NumPy governance model formalized?

**Ralf:** NumPy started in 2005, and the governance model was instituted around 2017. It’s now about seven years old, but that was after a long period of just doing things with implicit understanding and no written rules.

**Q:** This standardization project has spilled over into other programs. How is NumPy leading standardization efforts to guide other projects and prevent reinventing the wheel?

**Ralf:** That’s effectively what has been happening since around 2015. The limitations of NumPy started becoming clear when the volume of Python users went up, and they had real needs for working with very large datasets and GPUs, which were becoming important for deep learning. NumPy doesn’t handle parallelism, distributed computing, or GPUs. So, people liked the NumPy API and its fundamental concepts, then they began copying it, making slight tweaks where needed, and creating versions that worked on GPUs, for example. Now, there are frameworks like [TensorFlow](https://www.tensorflow.org/), [PyTorch](https://pytorch.org/), [JAX](https://github.com/jax-ml/jax), [CuPy](https://cupy.dev/), and many others that all share similarities with NumPy but address its limitations.

One of the first projects I worked on when I joined [Quansight Labs](https://labs.quansight.org/) was trying to create a standardized subset of NumPy, which I called R-NumPy. I wrote a detailed email about the rationale behind it, hoping it could help standardize some of these efforts. However, it immediately got filibustered because one person didn’t like the word “standard,” arguing that it would harm NumPy’s development. So, I decided not to pursue it directly within NumPy but to take a step back. In mid-2020, I reached out to developers of all these other libraries and put together a consortium to see if we could standardize a common set of features and identify where different libraries diverged.

One of the big issues was that certain design decisions in NumPy, like how indexing an array works or type promotion rules, were hard to change without breaking compatibility for existing users. After a year and a half of work, we developed the first Python Array API standard. This standardization process was much harder and more work than I expected. But now, we have three versions of the standard, and it’s implemented by NumPy 2.0. We’ve bridged some of the gaps that didn’t work in NumPy but were needed by other libraries. It’s starting to gain traction, with libraries like SciPy, [scikit-learn](https://scikit-learn.org/), and [Xarray](https://xarray.dev/) implementing it. It addresses the fragmentation problem, where each library was doing slightly different things.

> After a year and a half of work, we developed the first Python Array API standard. This standardization process was much harder and more work than I expected. But now, we have three versions of the standard, and it's implemented by NumPy 2.0
>
> — Ralf Gommers

**Q:** How did you build a consortium in the open source community to bring together stakeholders who often work in silos?

**Ralf:** It was a combination of things. There were a few developers from other libraries that I knew personally. [We have a large team working on PyTorch at Quansight](https://quansight.com/pytorch-services/). Then, there were other libraries where I didn’t know anyone from, like TensorFlow or JAX. TensorFlow, for instance, is a large team at Google, but they tend to be a bit more insular, so that required active outreach to find someone and connect to the right person on that team.

Aside from that, there was a lot of effort involved in just running meetings, recording them, making meeting notes, and doing the stuff nobody really likes doing. Getting developers from each library to join a call every two weeks to talk about technical design issues was the easy part. But then came the harder part—writing a detailed spec, publishing a website with that spec, and checking every corner case to see if it worked for all the libraries.

For that, we needed some concerted effort, so we went through our corporate connections and asked for support. We reached out to companies that could benefit from this, like large finance companies or company-backed projects. We ended up with six funders, with Intel being the first to come on board. The TensorFlow team at Google also pitched in, along with a few others. Their support helped us manage the organizational efforts and the detailed work of writing the standard itself.

**Q:** Why did NumPy choose to standardize its build process using Meson, and what led to that decision?

**Ralf:** To me, building and packaging are like two sides of the same coin. You first have to build something into a binary, and then you have to put it somewhere so that everyone can use it. There’s a lot of complexity in the tools and standards around installs and environments to make Python packaging work smoothly and Python packaging is very challenging. It’s gotten a lot better over the years, but there are still plenty of challenges.

For a very long time, pretty much everyone was building their projects with [Distutils](https://docs.python.org/3.10/library/distutils.html), which is part of the Python standard library. When that didn’t really work, [Setuptools](https://setuptools.pypa.io/en/latest/) became the go-to extension of Distutils. But all of that was essentially monkey-patching on top of a flawed system or code. Meanwhile, NumPy had its own version of Distutils, which added better support for C++, Fortran, and things needed for numerical computing.

Then, with Python 3.10, the CPython team decided they didn’t want to maintain Distutils anymore. They deprecated it in 3.10 and removed it in 3.12. At that point, my initial reaction was to wait it out and see if Setuptools could absorb it. But after six months, it became clear that wasn’t happening.

So, I started experimenting with other approaches, and quickly narrowed it down to [Meson](https://mesonbuild.com/meson-python/) and [CMake](https://cmake.org/cmake/help/latest/module/FindPython.html). I knew that NumPy’s existing setup for numerical computing was better than what either of them had, so I’d have to contribute to those packages as well. Meson had better documentation, was written in Python, and felt nicer to work with compared to CMake’s C++ and its complex domain-specific language (DSL).

I decided to go with Meson and helped develop a package called [Meson-Python](https://mesonbuild.com/meson-python/) to create Python packages because Meson, while great for C++ and Fortran, didn’t have much built-in support for Python packaging. It took me about six months to get the first version up and running, starting with SciPy, since it was the hardest challenge. If it worked there, it would work everywhere else. The lockdown in the Netherlands during the pandemic gave me the time to focus on it, and I think that’s what helped me get it done in a reasonable timeframe.

**Q:** Would you recommend the Meson toolchain over CMake for large packages, or is it mainly suited to scientific libraries like NumPy and SciPy?

**Ralf:** I think people have their personal preferences, and I don’t think everything will end up using the same toolchain, which is a good thing. In the past, we had everything relying on Distutils, and it wasn’t great. Now, Python packaging has evolved to a place where if you need something better, you can build it, and there are standard hooks and ways to plug it in.

If you don’t have any compiled code, things are pretty straightforward—you’ve got at least five good choices, maybe more. If you do have compiled code or an older package, you might still be using the older toolchains, or you may have recently migrated, and then you’re set. If you’re starting a new project now, I’d say using Meson with Meson-Python or using CMake with scikit-build-core are both great options. You can’t really go wrong—they’re very similar, with different capabilities, but the choice mostly comes down to personal preference. Both are a huge improvement over what we had before.

I enjoy seeing new people use Meson-Python, and I try to help them quickly when they get stuck. My co-maintainer, [Daniele](https://github.com/dnicolodi), is the same, and the Meson team is quite responsive, so questions get answered quickly. But I also think it’s totally fine for people to use other tools like CMake, especially if that’s what they already know or if they have dependencies in C++.

> If you're starting a new project now, I'd say using Meson with Meson-Python or using CMake with scikit-build-core are both great options. You can't really go wrong—they're very similar, with different capabilities, but the choice mostly comes down to personal preference.
>
> — Ralf Gommers

**Q:** How do you encourage newcomers to start contributing to open source without feeling overwhelmed by technical details?

**Ralf:** That’s a tough question because I’d love to have more maintainers on my projects and see more people contributing to make open source software better. But I’m also aware that it can be challenging, especially when it’s not your full-time job. If you’re doing it in your spare time, it can start to take over your weekends, and that can be tough on your personal life.

I always recommend that people start by solving a problem they genuinely care about or enjoy working on. It could be fixing a bug or adding a new feature that doesn’t exist in the language or package they’re using. As long as you’re mindful of the time you spend and it stays fun, it’s worth doing more and learning more

**Q:** How do open source maintainers handle the shift from coding to community management as their projects grow in popularity?

**Ralf:** It’s definitely similar to what happens in a company. An open source project can grow beyond the control of the one person who started it, and at that point, the most critical skill for a project lead becomes connecting with other people and giving them the opportunity and permission to make the project their own. If you try to do it all yourself, it’s not sustainable, and it limits the growth of the project. The people who excel at community management and nurturing new contributors are often not the same people who started the project with deep technical skills.

**Q:** Do you believe the rise of generative AI, like ChatGPT, is leading to less community engagement, or is that concern overblown?

**Ralf:** We’ve actually been discussing the impact of code generated by ChatGPT and whether it’s a concern if that code ends up in pull requests. My take is that it’s not a big issue today, though it could be in the future. This is similar to what we saw years ago when people would go to places like MATLAB Central, grab some code that wasn’t properly licensed, and just translate it. Honestly, I don’t see a decline in engagement because of AI. The questions ChatGPT can answer are usually the types of questions I don’t want to spend my time answering. I want to engage with more complex, interesting questions, and we’re still far from the point where AI can handle those in a meaningful way.

**Q:** What’s your favorite feature or achievement in the recently released NumPy 2.0 that you’re particularly proud of?

**Ralf:** We were almost too tired to celebrate, but it was a major achievement. Getting the whole community aligned was quite a journey. If I think about the new features, we already talked about the Array API standard, which is a highlight for me personally. We finally got NumPy to adopt the standard, which is a big deal. Another aspect I’d like to mention is the effort put into reducing the binary size. That’s not something most users think about because it doesn’t show up in the documentation, but it’s actually super important.

I remember being on holiday in Norway in winter, on a train ride, and I started thinking about the environmental impact of not just me working on NumPy but of the project as a whole. I realized that by shaving off even one megabyte from a NumPy binary, we could save the equivalent of 200 intercontinental flights per year in terms of data transfer. The scale of this impact is surprising when you think about it—NumPy has about 200 million downloads a month, and the package itself is around 15 megabytes. That adds up to about 36 petabytes of data per year, which is significant from both an environmental and sustainability standpoint.

Reducing the binary size is a crucial task, and it involves technical work like identifying what can be reduced, optimized, reshaping or rewriting code more efficiently, or cutting out unnecessary parts entirely.

It’s definitely an ongoing mission to make it as small as possible, and there are multiple things in the pipeline that can help with that. For example, the x86 version of the NumPy package was over 15 megabytes, but the latest release for macOS is smaller. This is partly because it uses ARM architecture, and ARM instructions are smaller than x86 ones. Plus, Apple ships an Accelerate library, and I’ve been working with them to update it so that NumPy and SciPy can use it again. Right now, the macOS installer is down to 5 megabytes on PyPI for version 2.0, and I’m pretty confident I can reduce it to 3.5 megabytes next year.

> I realized that by shaving off even one megabyte from a NumPy binary, we could save the equivalent of 200 intercontinental flights per year in terms of data transfer.
>
> — Ralf Gommers

**Q:** How do you determine what to remove from the project without telemetry, especially when many open source projects rely on user feedback, and do you track documentation usage to guide these decisions?

**Ralf:** In NumPy 2.0, we did remove a lot of APIs, but most of those were just aliases, duplicates, or deprecated functionalities that we didn’t like for various reasons. We didn’t necessarily remove things just to make the package smaller; it’s often a performance-versus-size tradeoff. For example, if you add more Single Instruction/Multiple Data (SIMD) instructions, you can optimize for specific processors—not just an Intel x86 processor but even for a particular generation like Haswell. We ended up shipping multiple versions, even up to 15 different flavors for different CPUs, as part of OpenBLAS. But no one had really done a cost-benefit analysis on why we needed to ship all these different compiled versions of the same function. So after doing that, we could reduce it from 15 to 5 flavors.

**Q:** What are your thoughts on the trend of ‘Rustification’ in the Python ecosystem, particularly regarding comparisons like [pandas](https://pandas.pydata.org/) versus [Polars](https://pola.rs/)?

**Ralf:** If you have a new project and don’t have specific requirements that tie you to C or C++, [Rust](https://www.rust-lang.org/) is a great choice. It’s popular for good reasons, with excellent features and a developer experience I’d love to dive into if I had the time. However, for existing projects like NumPy or SciPy, transitioning to Rust is a massive undertaking. There’s too much legacy code, and some of Rust’s capabilities, like SIMD instructions, are not yet as mature. Plus, using foreign function interfaces in Rust can be tricky, especially if you’re dealing with old Fortran APIs, which might push you into unsafe territory.

**Q:** Should a new programmer, such as a university student, focus on learning Rust or C++, or is it better to follow their passion and learn one language before moving on to another?

**Ralf:** Both. I think you won’t be able to avoid learning C or C++ in the next decade. But you should also learn at least one modern language—Rust is a great choice. I’m also personally interested in [Zig](https://ziglang.org/); it’s excellent for cross-compilation and can even help create standalone Rust binaries. So, both Rust and Zig have their advantages, and they’re worth exploring if you want to stay current in the field.

**Q:** What patterns do you see emerging for enhancing open source sustainability, and what do you believe is the best way forward to help it flourish more rapidly?

**Ralf:** I don’t think anyone has the answer today, but it is an extremely important question. Open source runs the world nowadays, and a lot of it is community-driven. There’s also an increasing amount of company-backed open source, which has a very different feel because it often involves one company controlling a project or at least making most of the major decisions since they employ most of the maintainers.

**Q:** Is it viable for companies to allocate resources to open source projects by requiring employees to split their time between work and open source contributions?

**Ralf:** What I’ve observed is that community-driven projects often move a little slower, but they have many different voices shaping their design and direction, which can lead to longer lifespans. For instance, projects like Linux, NumPy, and a few other core PyData projects have endured for decades. To make open source projects more sustainable, we need a patchwork of volunteer work and funded efforts. Much of the work is done by volunteers because it’s enjoyable, they learn from it, or they value community connections. However, some of the more mundane or challenging tasks require funding and sustained effort. As a project gains popularity, the need for funding increases.

Security is another major concern; nobody really wants to be responsible for security breaches, so that’s an area that should definitely be funded. Companies that employ maintainers could offer them additional work time. For example, they could allocate one day a week for maintainers to focus on specific open source projects they believe in.

At [Quansight Labs](https://labs.quansight.org/), we follow a similar model, balancing work we believe is essential for the community with grant-funded initiatives. We have grants from NASA, a German government agency, and non-traditional funders like the Chan Zuckerberg imaging institute. Additionally, companies, whether large or small, often need to engage with someone directly because they can’t always approach a community. Having a variety of funding sources and durations is crucial so that no one person’s job or a project’s health is at risk if that person becomes unavailable.

> Companies that employ maintainers could offer them additional work time. For example, they could allocate one day a week for maintainers to focus on specific open source projects they believe in.
>
> — Ralf Gommers

**Q:** What role do you think universities and the government should play in fostering open source projects among passionate individuals who could start at a younger age?

**Ralf:** Yes, both probably. The government can help by providing funding and recognizing what’s important. As for universities, I think it’s a mistake to require all students to contribute to open source. This often leads to inexperienced individual students submitting low-quality pull requests, which increases the burden on maintainers. Instead, universities should focus on teaching how open source works, the mechanics behind it, and good practices, like using Git. Teaching students good habits with Git—like working with branches and writing clear commit messages—should be a basic expectation for anyone studying computer science, engineering, physics, or math.

**Q:** If people want to participate in an open source project, what’s the best way to do that?

**Ralf:** For both [NumPy](https://numpy.org/contribute/) and [SciPy](https://scipy.org/contribute/), we set up Slack workspaces because many people feel hesitant to ask for help publicly. You can join the Slack workspace and ask your questions there; we have dedicated channels for newcomers where some of the maintainers are available to assist.

![A snowy mountain landscape with a clear blue sky in the background. The text 'Lessons Learned from NumPy's Journey with Ralf Gommers' is prominently displayed, and an image of Ralf Gommers smiling is placed in the foreground.](/posts/lessons-learned-from-numpys-journey/Ralf-Gommers-1.png)

Thank you, Ralf. These answers highlight the significant challenges and opportunities within the open source community, emphasizing the need for sustainable practices and collaborative engagement. Ralf underscores the importance of community-driven projects and the role of various stakeholders, including companies and universities, in fostering a healthy ecosystem. By investing in the maintenance and security of open source projects and encouraging a diverse range of contributions, we can ensure their longevity and impact.

If you have further questions about making open source projects more sustainable or need guidance on effective community management, Quansight is here to help. Our team can assist with project management strategies, community engagement practices, and technical optimizations to enhance your open source initiatives. Reach out to us to learn more about how we can support your efforts.
