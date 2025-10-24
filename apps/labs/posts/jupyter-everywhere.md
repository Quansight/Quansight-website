---
title: 'Jupyter Everywhere: empowering interactive computing for K-12 education' # not final
published: November 01, 2025
authors: [agriya-khetarpal] # ?[agriya-khetarpal, peyton-murray, michał-krassowski] how to add multiple authors?
description: 'The story of how Jupyter Everywhere is transforming K-12 education through interactive computing'
# "Jupyter" used to be a category for older blogs; it no longer is. "Interactive computing" could
# subsume it as well, if not "Jupyter". ig "Developer workflows" is not quite right... so for now:
category: ["OSS Experience"]
featuredImage:
  src: /posts/jupyter-everywhere/placeholder.png
  alt: placeholder
hero:
  # JE octopus logo here
  imageSrc: placeholder
  imageAlt: placeholder
---

# The Jupyter Everywhere story: empowering interactive computing for K-12 education
<!-- the title is tentative and not final -->

Hi! I am Agriya Khetarpal, a software engineer at Quansight PBC. In this blog post, I will share the story of how we built [Jupyter Everywhere](https://jupytereverywhere.org/), an innovative notebooks-based end-to-end application for K-12 education for high school students in the U.S.A., in collaboration with [Skew The Script](https://skewthescript.org/) and [CourseKata](https://coursekata.com/).

Jupyter Everywhere aims to make interactive computing accessible to students and educators, regardless of their technical background or resources. We stand on the shoulders of giants, leveraging the power of [JupyterLite](https://jupyterlite.readthedocs.io/en/latest/) and [WebAssembly (WASM)](https://webassembly.org/) – cutting-edge technologies that enable running Jupyter notebooks entirely in a web browser. Particularly, we harness [Pyodide](https://pyodide.org/en/stable/), a WASM-based distribution of Python with a rich scientific stack for executing data science and statistical computing code in a browser environment without the need to provision any server-side dependencies or deployments.

We'll discuss the challenges we faced, the features we implemented, and the lessons we learned while developing Jupyter Everywhere. I hope that this post will inspire educators, developers, and institutions to explore the potential of interactive computing in education, and to contribute to the open source ecosystems that make it all possible and worthwhile.

## Introduction

Jupyter notebooks have, since long, revolutionised the way we teach and learn programming, data science, and computational thinking. Their interactive nature allows users to experiment with code, visualise data, and document their thought processes in a single, top-down document format. However, the practice of setting up and maintaining Jupyter environments has proven to be a daunting task for educators, especially in K-12 settings where resources and technical expertise are often limited and not cut out for such endeavours.

## Navigating the complexities of the Jupyter user interface

Jupyter provides two traditional user interfaces: Jupyter Notebook, and JupyterLab, each with its own strengths and weaknesses. Jupyter Notebook offers a simple and straightforward interface, ideal for beginners and quick prototyping. On the other hand, JupyterLab provides a more powerful and flexible environment, catering to advanced users who require features like multi-document editing, integrated terminals, and extensibility through plugins.

However, both interfaces are designed with a certain level of technical proficiency in mind, especially for newcomers to programming and interactive computing. There are myriads of features and options that can overwhelm many a novice, leading to confusion and frustration. For K-12 educators and students, who may not have prior experience with Jupyter or programming in general, the learning curve associated with these interfaces is steeper than what is anticipated by an educational setting.

<!-- image of Jupyter user interface with a 75 degree diagonal slash through half of it, with the right half representing a graphic indicating complicated clockwork and gears? my idea is to show how Jupyter's UI can be compared to a pictorial representation of multiple knobs and switches -->

This is what drives Jupyter Everywhere's philosophy: to provide a simplified, user-friendly interface that abstracts away the complexities of Jupyter, while retaining its core functionalities with sensible defaults and features akin to an integrated development environment (IDE) tailored for educational use cases. For example, the Scratch programming language for children provides a visual programming interface that simplifies coding concepts, making it more accessible to young learners. Similarly, Skew The Script has strived to create an intuitive interface that feels playful (think: octopus mascot) yet powerful enough to run anything a student might want to throw at it. We have brought this to life by customising JupyterLite. Read on to find out how!

## Administrative and technical challenges in K-12 settings and high school districts

One of the primary challenges in high school districts is the lack of technical infrastructure and support for setting up and maintaining Jupyter environments, especially when dealing with a large number of students and educators. Many schools may not have dedicated IT staff or resources to manage JupyterHub installations, leading to potential downtime and an inconsistent user experience. A lot of this may be outsourced to third-party vendors who are experienced in setting up learning management systems (LMS) and JupyterHub instances, but this can be costly and may not always align with the specific needs of the school or district.
Additionally, ensuring that every student has access to the necessary software and libraries can be a logistical nightmare, especially when dealing with the fact that students are assigned a common set of hardware and needs to be configured in exactly the same way.

To think about JupyterHub in such settings is a no-go: it invites further complexity, requiring user authentication, server management, and resource allocation.

We attribute three key challenges that Jupyter Everywhere aims to address:
- Ensuring accessibility and ease of use for students and educators with varying levels of technical expertise.
- Simplifying the setup and maintenance of Jupyter environments, reducing burdens on school IT staffing.
- Prioritising security and privacy, especially when dealing with minors in educational settings, ensuring compliance with regulations such as the COPPA (Children's Online Privacy Protection Act), FERPA (Family Educational Rights and Privacy Act), and the SOPIPA (Student Online Personal Information Protection Act of the state of California). This includes safeguarding student data and ensuring secure access to educational resources.
- The lack of a database to store user data and notebooks grouped by accounts, such as by OAuth providers like Google or Microsoft. This is a limitation that needs to be circumvented by using alternative methods of notebook sharing and distribution, which we discuss later in this post.

## The story of Jupyter Everywhere

Here, we start describing our journey of building the application from the ground up, starting as a no-frills prototype to a full-fledged JupyterLite extension.

<!-- architecture diagram here -->

### Customising JupyterLite, and key features of Jupyter Everywhere

Jupyter Everywhere, as we mentioned earlier, is built on top of JupyterLite. JupyterLite is a distribution of JupyterLab that removes Jupyter's server-side components with standards for in-browser communication with language kernels either in JavaScript or compiled to WebAssembly (WASM), shims for server-side Jupyter APIs, and in-browser file systems for storing user content and settings.

Initially, we started developing the application as a JupyterLab extension, as opposed to a JupyterLite extension, in order to prototype the functionality we wanted to build at first: interacting with the file system and being able to download notebooks in various formats. This was because we wanted to get proofs-of-concept working as quickly as possible, and JupyterLab provided a more familiar development environment, eventually changing to JupyterLite once we had a better idea of the workflow we wanted to implement.

### Facilitating notebook sharing and distribution

Jupyter Everywhere aims to simplify the process of sharing and distributing notebooks among students and educators. Given the lack of a backend database to store user data and notebooks grouped by accounts, we had to devise alternative methods for notebook sharing. For this, our collaborators, CourseKata developed a sharing service that allows authentication via JWT (JSON Web Tokens). This sharing service allows authentication by virtue of various API endpoints to authenticate and refresh tokens, and to upload notebooks to a server. The server is connected to the Jupyter Everywhere frontend via a REST API. The notebook contents are stored in an AWS S3 bucket, with appropriate security measures to ensure that only authenticated users can upload and access notebooks. The database is a managed PostgreSQL instance that stores the notebook as IPYNB/JSON, with the sharing-related metadata, embedded as JSON fields in the "metadata" field of the notebook.

The sharing service provides two key features:
- Uploading notebooks to a server for storage and sharing
- Generating sharing IDs based on a hash of the current session and the notebook state, and readable IDs as a mnemonic for sharing purposes via a database of aquatic animal names and adjectives to make it more fun and engaging for students.

<!-- Add diagram from Adam's architecture-overview.md on Slack -->

#### Sharing notebooks via view-only links

As a result of the sharing service, we embedded a "Share" button in the Jupyter Everywhere interface. It connects to the sharing service API to upload the current notebook and generate a shareable link. This link can be shared with others, allowing them to view the notebook in a read-only mode without the ability to edit or modify its contents.

Initially, this was implemented using a dialogue that generated a sharing link with a password. The password would have to be shared separately with the recipient. However, to streamline the user experience, we later transitioned to generating view-only links that do not require a password. This change simplified the sharing process, making it easier for users to distribute their notebooks without the added step of managing or remembering passwords, which were being deemed unnecessary as the view-only links inherently restrict editing capabilities and access. It would also reduce the cognitive load on users by eliminating the need to remember or manage additional credentials, when just a link would suffice for viewing purposes.

Further on, later during the development process, we decided that it would be more user-friendly to generate friendlier URLs for sharing, as opposed to the default UUID-based URLs that are not easy to remember or share verbally, which the sharing service also generated initially. To achieve this, the sharing service implemented a system that generates human-readable IDs based on a combination of aquatic animal names and adjectives, creating memorable and engaging URLs for sharing notebooks. This approach not only enhances the user experience but also adds a fun element to the sharing process, making it more appealing for students and educators alike. We integrated the sharing service's response to use these "readable IDs" in the interface by default.

<!-- add image of share dialogue opened by clicking the "Share" button -->
<!-- alt text: The share dialogue in Jupyter Everywhere, opened by clicking the "Share" button in the toolbar, allowing users to generate view-only links for sharing their notebooks, and a "Copy link!" button to copy the generated link to the user's clipboard. -->

There is some nuance to this: the view-only links are generated by hashing the notebook contents and session information, meaning that if the notebook is modified, the "Share" button needs to be interacted with again, or the user needs to wait until the next Jupyter auto-save occurs – which has a cadence of thirty seconds by default. This means that the shared link always points to the latest _saved_ version of the notebook, i.e, a snapshot of it. Users need to be aware that they may need to re-share the link if they make changes to the notebook after sharing it.

Once the link is generated, users can share the link with others on any platform, such as email, messaging apps, or social media. Recipients can then click on the link to view the notebook in their web browser, without needing to install any additional software or create an account.

When a user opens a shared notebook link, they are presented with a read-only view of the notebook, where they can navigate through the cells, view outputs, and interact with any visualisations or widgets embedded in the notebook. However, they cannot modify the notebook's contents or execute any cells.

This was trickier to implement than we initially thought. At that time, JupyterLab did not allow starting a notebook without a kernel attached to it. Fortunately, Jupyter is a swiss-army knife of extensibility, and we were able to override the default behaviour of JupyterLab to allow opening a notebook in read-only mode without a kernel. This involved creating a custom notebook factory that would create a read-only notebook widget, and overriding the default kernel selection behaviour to prevent the user from selecting a kernel for the read-only notebook – by not instantiating a kernel at all.

<!-- A section on the problem of non-persistence in Jupyter Everywhere due to no user accounts + how we addressed it -->

#### Notebook downloads

Another method for sharing notebooks is via exporting them out of Jupyter Everywhere. This is facilitated by the built-in JupyterLite functionality to download notebooks in IPyNB format, which requires adding a button to the notebook panel toolbar.

However, we wanted to go a step further and allow users to download notebooks in PDF format as well. This is currently not supported out-of-the-box in JupyterLite. JupyterLab relies on server-side components to generate PDFs from notebooks, through the use of `nbconvert` and LaTeX, which generate high-quality PDFs suitable for printing and sharing. However, since Jupyter Everywhere runs entirely in the browser without any server-side components, this approach is not feasible.

Thus, we went forward with a custom approach for this, based on in-progress work in the JupyterLite community to add PDF export functionality using an in-browser PDF generation library called `jsPDF`.
<!-- link to jupyterlite draft PR for custom export plugin here -->

`jsPDF` is a JavaScript library that allows generating PDF documents directly in the browser, without the need for server-side processing. We integrated `jsPDF` into Jupyter Everywhere by creating a custom download button that would convert the current notebook into a PDF document using `jsPDF`, and then trigger a download of the generated PDF file. However, this functionality is still a work in progress, and there is work to be done w.r.t. improving the fidelity of the generated PDFs, especially for complex notebooks with rich visualisations, widgets, and typeset LaTeX content.

#### Uploading notebooks to Jupyter Everywhere

Since downloading notebooks is only half the story, you might ask – how does one upload notebooks, that might have been created elsewhere (whether in Jupyter Notebook, JupyterLab, or another JupyterLite instance, or Jupyter Everywhere itself), into Jupyter Everywhere?

Remember that Jupyter Everywhere does not have user accounts or a backend database to store user data and notebooks grouped by accounts. The frontend runs in what is termed as the "Simple Interface", or more technically, the "single-document mode" of JupyterLab, which we customise heavily by disabling and reimplementing Jupyter extensions to provide a more user-friendly experience. This means that there is no visible file browser or file management interface in Jupyter Everywhere, in favour of not adding unnecessary complexity.
<!-- link to simple interface docs in jupyter -->

This means that users need to upload notebooks manually into a JupyterLite instance, outside and prior to the Jupyter Everywhere session being instantiated. The main entry point for this is the Jupyter Everywhere landing page, where we've added an "Upload a Notebook" button that allows users to select a local IPyNB file from their computer, and upload it into the JupyterLite file system.

Here is a quick walkthrough of how it works behind the scenes.
<!-- add pictures -->

When the user clicks the "Upload a Notebook" button, a file input dialogue is opened, allowing the user to select a local IPyNB file from their computer. Once the file is selected and uploaded, we use a feature in modern browsers called the Web Storage API to store the contents of the uploaded notebook to a `localStorage` without interacting with the sharing service without the user's explicit consent.

We then redirect the user away from the Jupyter Everywhere landing page and to the JupyterLite application URL, appending a query parameter to the UUID of the uploaded notebook. This query parameter is then parsed by Jupyter Everywhere upon startup, and the notebook is read from the `localStorage` and written into the JupyterLite in-browser file system, allowing the user to open and interact with the uploaded notebook as if it were created in Jupyter Everywhere itself. The notebook is then removed from the `localStorage` to free up space, and no race conditions occur as the notebook is only read once during startup.

### Working with data files

#### The Files widget

When working with Jupyter notebooks, especially in data science and education contexts, it is common to work with data files such as CSV/TSV files, or images in various formats, whether local or remote. In a traditional Jupyter environment, these files can be easily uploaded to the server-side file system and accessed from within the notebook.

When building Jupyter Everywhere, we wanted to ensure that users could easily work with data files as well. Now, remember that we disabled the file browser drawer in Jupyter Everywhere to simplify the user interface, rendering it invisible. This meant that we had to find alternative ways for users to upload and access data files within their notebooks.

To do this, we implemented yet another plugin to re-implement browsing files, which we call the "Files" widget, extending Jupyter's `MainAreaWidget`. This widget provides an "add new" button that allows users to upload data files from their local computer into the JupyterLite in-browser file system. Once uploaded, the files are accessible from within the notebook, allowing users to read and manipulate data as needed.

<!-- various screenshots for files widget functionality sprinkled in between -->

The files are displayed as part of a grid, akin to that of a file browser on phones and desktop computers that implement viewing a file, displayed as a tile consisting of a placeholder and an associated filename.

While we started with bare-bones functionality, we soon realised that users would benefit from more features, such as the ability to delete the uploaded files, and download them back to their local computers. Another requirement that came up was the ability to rename files, as users might want to organise their data files better. This implied adding an "ellipsis" menu to each file tile, allowing users to perform actions such as renaming, deleting, and downloading files via a context menu that expands on clicking.

The Files widget is accessible via a sidebar tab in Jupyter Everywhere, allowing users to easily switch between their notebook and the Files widget. This design choice ensures that users can manage and visualise their data files without cluttering the main notebook interface, with the files being stored in the same in-browser file system as the notebooks themselves, through the use of JupyterLite's `ContentsManager` API that abstracts away file system operations regardless of the underlying storage mechanism.

#### The quest for being able to render uploaded files within the notebook interface

However, as seamlessly as we expected for it to work, we ran into a quirk: when uploading certain file types, such as images in PNG or JPEG format, the files would not render correctly when accessed from within the notebook in Markdown cells. After some investigation, we discovered that this was due to the way JupyterLite handled MIME types for certain file formats. To address this, we had to implement custom logic to ensure that the correct MIME types were set when uploading and accessing these files, ensuring that they rendered correctly within the notebook interface.

This took a few steps. First, we needed to investigate how JupyterLite handled MIME types for uploaded files, which we realised was done via the JupyterLab implementation via the `RenderMimeRegistry.UrlResolver` class. This class is not designed to handle custom resolution logic for files stored in the in-browser file system, so we had to extend it to add our own custom logic. This meant overriding the class to make it a "factory". In Jupyter, a "factory" is a design pattern that allows for the creation of objects without specifying the exact class of object that will be created. By making the `UrlResolver` a factory, we could inject our own custom logic for resolving URLs for files stored in the in-browser file system.

Once we were able to allow swaping the URL resolver with out own in JupyterLab, and the JupyterLab version that JupyterLite is based on was updated to support this, this was ported to JupyterLite pretty easily – the `resolveUrl` function for JupyterLite was updated to base64-encode the data for popular image file formats, allowing them to be rendered correctly within the notebook interface.

<!-- mention the PRs that addressed these issues upstream in the above paragraphs -->

#### Working with remote files within the notebook interface

Another common use case when working with Jupyter notebooks is the ability to access remote files, such as datasets hosted on public servers or cloud storage services. In a traditional Jupyter environment, users can easily download remote files using networking libraries like `requests` or `urllib`, or more advanced asynchronous counterparts like `aiohttp`, and then read them into their notebooks.

However, notebooks in JupyterLite rely on Pyodide and xeus-r to provide programmatic interfaces akin to the Python and R programming languages respectively. There are a few differences between these in-browser runtime environments and traditional Jupyter kernels running on a server.

<!-- discuss difference very briefly between Pyodide networking and Python networking here, link to Pyodide docs -->

For instance, Pyodide provides a built-in `pyodide.http` module that allows users to fetch remote files using the browser's native `fetch` API, which is asynchronous and non-blocking. This means that users can download remote files and read them into their notebooks without blocking the main thread of execution.

<!-- add some small parts about using pyodide.http, pyodide-http module for monkeypatching urllib, and urllib3 and urllib -->

For xeus-r and R, networking support was added in later versions. 
<!-- should we describe what changed in a sentence? -->

For the Pyodide kernel, we implemented a plugin in Jupyter Everywhere to call `pyodide_http.patch_all()` silently underneath when the kernel first starts up. For students and educators, this means that they can use familiar public APIs from scientific Python libraries, like the `pandas.read_csv()` function to read remote CSV files directly into their notebooks without needing to know the underlying implementation details.

### Run buttons next to code cells

Popularised by platforms like [Observable](https://observablehq.com/), Google Colaboratory, Kaggle Notebooks, and Deepnote, "Run" buttons next to code cells have become a common feature in modern interactive computing environments. These buttons provide a convenient way for users to execute individual code cells with a single click, without needing to navigate to the toolbar or use keyboard shortcuts.

However, Jupyter does not provide this functionality right away. <!-- link to nine-year old issue -->. 

<!-- describe our solution here and what it does in two paragraphs, and link to the PR -->

## A call to action for educators and institutions

<!-- A message to the world, unsure what I'd like to add here... -->

## What we learned from developing and deploying Jupyter Everywhere

1. Test early, and test well.
<!-- describe mocking saga and the infrastructure/deployments we used? -->
<!-- describe bug here with sharing a view-only notebook not working because it was not skipping calling the sharing service, which we did not recognise because we were using mocks -->
<!-- anything else? -->

2. User experience is paramount. Ask for feedback from educators and students, and iterate on the design based on their needs. Jupyter is fundamentally a tool for learning, but even it would be rendered useless if it were too difficult to use for a student or educator. Given that we deal with high school students, we have to be especially careful to ensure that the user experience is as intuitive and matches what someone with little to no programming experience, let along literate programming experience, would expect from a web application.

3. Do not be afraid to pivot. We initially started with a set approach to building Jupyter Everywhere, but we were carefully discerning of our inner instrincts and the feedback we received from our collaborators, and were not afraid to change our approach when necessary. This flexibility allowed us to adapt to changing requirements and deliver a product that truly met the needs of our users.
<!-- add point-wise description about toast notifications, leave confirmation dialogue, files tiles, sharing functionality, view-only notebooks, kernel and notebook URL parameters, separate URL for files widget, and all the things we did that were out of the scope of work -->

## Some achievements and future directions

Having a fully functional Jupyter environment that runs entirely in the browser is already a significant achievement. However, there is always room for improvement and expansion for future directions. Potential areas for future development could include:

<!-- Gotta describe the following: -->
- Per-cell stop buttons and full support for interrupting code execution for in-browser kernels
- Real-time collaboration in JupyterLite
- Improvements to the sharing service
- Improving PDF export functionality in JupyterLite using in-browser PDF generation libraries via JavaScript/WASM

## Acknowledgements

I, the author, am extremely grateful to have had this opportunity to work on Jupyter Everywhere. It is one of the most exciting end user applications of JupyterLite and WebAssembly that I have had the pleasure of contributing to, and considering that this was my first avenue into the world of Jupyter and programming in TypeScript, JavaScript, and React, I am pretty proud of what we have achieved as a team and how much I learned along the way, thanks to Michał Krassowski and Peyton Murray for their mentorship and guidance throughout the project. It feels amazing to see how far Jupyter has come in itself, and I believe there is no better way for me contribute to its growth than by building applications that align with my personal values of enhancing accessibility and driving education through technology.

We lay down our gratitude to the following individuals and organisations for their invaluable contributions to the development and success of Jupyter Everywhere:

- Jupyter ecosystem developers and maintainers
- JupyterLite developers and maintainers
- Educators and students who provided feedback during development, courtesy Skew The Script
- Gates Foundation https://www.gatesfoundation.org/about/committed-grants/2024/03/inv-067942 for their grant award to Skew The Script to support the development of Jupyter Everywhere
- The Scientific Python ecosystem
- The core developers and maintainers of Pyodide (how do I do this without sounding snobbish as I am a Pyodide maintainer myself?)
- CourseKata for their design and development of the sharing service, and infrastructure support for hosting Jupyter Everywhere on AWS
- The QuantStack team for their work on JupyterLite, the Xeus project, xeus-r https://blog.jupyter.org/r-in-the-browser-announcing-our-webassembly-distribution-9450e9539ed5

<!-- individuals here? -->

## References

[1] JupyterLite: https://jupyterlite.readthedocs.io/en/latest/

[2] Pyodide: https://pyodide.org/en/stable/

<!-- unsure of the inclusion of the following-->
<!-- [3] Skew The Script: https://skewthescript.org/ -->
<!-- [4] CourseKata: https://coursekata.com/ -->
<!-- and any more references as needed -->