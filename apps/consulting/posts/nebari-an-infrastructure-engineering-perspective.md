---
title: 'Nebari: An Infrastructure Engineering Perspective'
published: May 3, 2024
authors: [quansight]
description: 'Hear from Quansight’s Senior Infrastructure Engineer, Chuck McAndrew, on how Nebari has transformed the landscape for deploying data science operations.'
category: ['Infrastructure & HPC']
featuredImage:
  src: /posts/nebari-an-infrastructure-engineering-perspective/Nebari-An-Infrastructure-Engineering-Perspective.png
  alt: 'A stylized image of a lone bonsai tree growing on a wireframe platform'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Nebari: An Infrastructure Engineering Perspective'
---

Hear from **Quansight’s Senior Infrastructure Engineer, Chuck McAndrew**, on how Nebari has transformed the landscape for deploying data science operations.

In a recent conversation with Quansight’s Chuck McAndrew, we explore [Nebari’s](https://www.nebari.dev/) capabilities, underlying technologies, and impact on reducing operational complexities, thus democratizing data science for various organizational scales. From its humble beginnings running JupyterHub distributions to supporting an organization’s desire to leverage the latest in open source software for artificial intelligence (AI) with private data, Nebari has consistently raised the bar in advancing data science.

**Q:** Thanks for your time today, Chuck. Can you describe your initial reaction to discovering Nebari and how your professional background influenced that reaction?

**Chuck McAndrew:** _“The perspective I’m going to give you is from someone with a background in infrastructure engineering, who has been a System Administrator (SysAdmin) and has a history of running stuff in production. When I first learned about Nebari, my reaction was, ‘Wow! I wish I would have known about this ten years ago!’”_

## Understanding Nebari’s Unique Value

Nebari stands out as an opinionated distribution of JupyterHub, designed to streamline the deployment process and enhance collaborative efforts within data science teams. At its core, Nebari facilitates the collaborative use of JupyterLab notebooks. It also integrates critical features, such as conda-store for reproducible Python environments and a Jupyter scheduler for managing periodic data workflows.

**Q:** What does Nebari offer organizations that want to implement data science platforms but think they need more experience before starting?

**Chuck McAndrew:** _”Essentially, Nebari takes a lot of open source components and packages them together to give teams everything they need to get started. Many organizations have data science needs but lack the experience to build their own data science platforms. There are a lot of excellent open source tools out there, but deploying them in a way where they all work together smoothly takes considerable engineering investment. Nebari’s unique value proposition is that it lets teams focus on data science, not the operations workload of running these services.”_

## Key Features and Functionalities

Integrating these elements into Nebari addressed common challenges in deploying data science tools, emphasizing ease of use and operational efficiency:

1. JupyterHub: Web-based data science platform that leverages Jupyter Notebooks.
2. Conda-store: Consistent, shareable environments for dependency management.
3. Jupyter Scheduler: Automates batch data processes like ingestion and preprocessing.
4. Kubernetes: Managing containerized workloads across various cloud environments.

**Q:** Can you describe the problems Nebari addresses for distributed data science teams and the solutions it provides?

**Chuck McAndrew:** _“Nebari allows deploying to multiple public clouds. It can run on Amazon (AWS), Azure, or Google Cloud (GCP). It does this by leveraging [Kubernetes](https://kubernetes.io/) to orchestrate containerized workloads. If your goal is to do data science, you should be able to focus on that rather than learning how to run Kubernetes._

_“Nebari came about because our clients wanted JupyterHub running and shareable, reproducible Python environments so that distributed data science teams didn’t have different environments. They discovered everyone had these environments running on their laptop, and there were just all these inconsistencies. So, these clients wanted a central place for their team to work.”_

## From Traditional Models to Modern Infrastructure

The shift from physical servers and virtual machines to Kubernetes represents a significant evolution in system administration. Kubernetes introduces a dynamically managed resource model, making operations more resilient and responsive to changes in load.

**Q:** How did transitioning from physical servers to Kubernetes change how applications are deployed and managed?

**Chuck McAndrew:** _“Originally, we ran workloads on individual physical servers in data centers. You set systems up by hand, and if you needed to scale an application, there might have been a six-month lead time because you had to order more hardware. As a SysAdmin, I was literally installing the operating system on these servers before I could deploy my applications._

_“Later, we got to virtual machines (VM), which was far better. VMs allowed more efficient use of resources, more dynamic provisioning, and templates for repeatable configurations. However, this was still an imperative way of working. Your automation said what commands to run in what order. The power of Kubernetes is a switch to a declarative model. We write configurations that tell Kubernetes what we want running, and it figures out how to make sure that happens.”_

## Traditional vs. Modern Deployment

- Imperative/Physical and Virtual Servers: Manual setups and longer lead times when scaling.
- Declarative/Kubernetes and Containerization: Automated scaling and recovery, reducing dependency on manual intervention.

This transition highlights a move from a high-maintenance “Pets Model” to a low-maintenance “Cattle Model,” where the focus shifts from individual servers to clusters of resources managed automatically.

**Q:** What benefits does Kubernetes provide regarding scalability and deployment flexibility, particularly in relation to Nebari’s deployment capabilities?

**Chuck McAndrew:** _“In Kubernetes, things are more ephemeral. If there’s more load, things spin up automatically because you’ve told it to. If the load goes away, it spins back down. So, you never rely on any individual pod being present. All you care about is having these resources available; it’s Kubernetes’ job to figure out where and how to schedule them. It’s taking a lot of the manual work SysAdmin used to do and handling it for us. It’s now more of a declarative versus imperative process, and that’s the true value proposition of Kubernetes._

_“What’s also valuable to us is that this is now an industry standard. Azure, GCP, and AWS have all implemented Kubernetes as a managed service. There are also distributions of Kubernetes you can run in your data center, allowing us to deploy Nebari wherever our customers want it. If we can set up a Kubernetes cluster or use an existing one, we can deploy Nebari.”_

## The Role of Infrastructure-as-Code in Modern Deployments

Infrastructure-as-Code (IaC) has become a cornerstone of modern infrastructure management, allowing teams to automate and reproduce settings precisely. Nebari utilizes [Terraform](https://www.terraform.io/), a popular IaC tool, to ensure that infrastructure deployment is reproducible and auditable.

**Q:** What are some of the best software development practices applied to infrastructure management through IaC?

**Chuck McAndrew:** _“Cloud providers provision infrastructure by using application programming interfaces (APIs), which means you can write code to provision resources using these APIs. Terraform is one of the most common IaC languages and has providers for all the major public clouds. That means you can have a clear, deterministic infrastructure. When you want to change that infrastructure, you have all the software development best practices, like Version Control, Auditability, and Enhanced Security. If you mess something up, you can revert that change.”_

## Advantages of Infrastructure-as-Code

- Version Control: Facilitates tracking changes and rolling back if necessary.
- Auditability: Ensures transparency, enabling teams to track who made changes and when.
- Enhanced Security: Allows for automatic security assessments to prevent common errors.
- Operational Efficiency: Minimizes human errors associated with manual configurations.
- Reducing Environment Drift: Ensures all settings remain consistent, improving reliability.

By embedding IaC principles, Nebari simplifies complex processes, enabling teams to focus more on data science rather than infrastructure management.

**Q:** Can you explain the advantages of automating deployment processes with IaC, particularly in Nebari?

**Chuck McAndrew:** _“Nebari started by taking JupyterHub deployments and adding IaC around them. As someone who has worked on the operation side, I find it very challenging when the steps are manual. It’s easy for people to make mistakes; we’re inherently bad at doing the same thing repeatedly. Computers are good at doing the same thing over and over, and that’s why we write code. The computer will do that same thing all day without making mistakes, getting bored, or skipping steps.”_

## Nebari’s Impact on Data Science Accessibility

One of Nebari’s most significant contributions is its ability to lower the entry barriers to data science. By abstracting the complexities of infrastructure setup, Nebari allows teams with varying technical expertise to deploy and manage data science environments efficiently.

**Q:** How does Nebari facilitate the entry of teams into data science, especially those lacking in-depth infrastructure experience?

**Chuck McAndrew:** _“Our goal is to empower teams that want to get started with data science but don’t have the infrastructure experience to deploy everything themselves and wire the components together._

_“We didn’t know what environment our clients would want to run stuff in. We have clients who run in AWS, Azure, and GCP, as well as those who run it in their own Kubernetes deployments. Kubernetes gives us the ability to support all of those scenarios. By supporting all of those deployment models we’re lowering the barrier to entry for data science. We’re allowing people to start from where they are. If they’ve got a great Ops team that thoroughly understands Kubernetes, they can take Nebari and deploy it on their existing infrastructure. No problem. If they have people who know nothing about Kubernetes, that’s okay, too. Nebari can give them a turn-key environment in the public cloud. Nebari is a command-line interface (CLI) tool that wraps around everything. When you write a configuration file and ask Nebari to deploy it, it will generate all that IaC for you.”_

![Image of a lone tree growing on a digitized wave structure amidst a hazy background.](/posts/nebari-an-infrastructure-engineering-perspective/2024.5.3_Chuck_McAndrew_Nebari_Infrastructure3a-1536x516.png)

## Broadening the Data Science Landscape

## Guided Deployment Processes

Support for multiple clouds helps teams deploy on the cloud platform of their choice or even on-premises. This approach simplifies the operational aspect of data science projects and ensures that teams can leverage their existing infrastructure without extensive retraining or recruitment. However, that’s just the beginning.

**Q:** What steps does Nebari take to ensure users can deploy their data science environments, even if they’re unfamiliar with cloud credentials and configurations?

**Chuck McAndrew:** _“Nebari has a guided INIT function, where it’ll ask you questions. It will take the configurations you’ve handed it, and if you don’t know them, it will ask, ‘Do you want to do this? Do you want to do that? What would you like here? What domain do you want to deploy this to? What cloud do you want to deploy this to?’_

_“It will tell you, ‘If you want to deploy to AWS, here are the credentials you need…’ It really is a guided process._

_“Someone who has no idea what Kubernetes is can still create and deploy a Kubernetes cluster on a public cloud and give themselves somewhere to work. That is another value proposition that Nebari offers. As someone with an Ops background, that is exciting because it’s following all these best practices, but it’s not requiring that knowledge of the users.”_

## Extensibility and Flexibility in Deployment

The Nebari CLI offers a user-friendly interface that guides users through the configuration and deployment process. This out-of-the-box feature is helpful as your projects begin to scale.

**Q:** Can you explain the extensibility of Nebari for various data science needs?

**Chuck McAndrew:** _“It is highly extensible, so you don’t have the problem of, ‘Well, this works for a basic use case, but once we get more advanced, it doesn’t work.’ It’s very configurable and extensible right out of the box; it gives you something that works and lets people focus more on their business instead of spending time setting up infrastructure for the data science.”_

## Opinionated Systems and Streamlined Decision-Making

Nebari employs an opinionated approach to its system configuration, intentionally simplifying decisions for the end-user by pre-selecting settings and configurations likely to meet most teams’ broad needs. This design philosophy significantly reduces the complexity and time typically required to set up environments, enabling teams to focus more on their core data science tasks rather than on infrastructure management. By providing a robust default setup, Nebari effectively streamlines the initial deployment process while offering flexibility to adjust and fine-tune the system.

**Q:** What advantages does Nebari’s opinionated distribution provide in choosing the right technological solutions for different scenarios?

**Chuck McAndrew:** _“With any of this, decisions must be made. Sometimes, there are good decisions, and sometimes, bad ones. And sometimes, there are ‘it depends’ decisions, where, ‘This is appropriate for this, and that is appropriate for that,’ but neither is a wrong decision. It just depends on what situation you are in._

_“That can be very overwhelming when you’re starting, especially if you don’t have a lot of domain knowledge. An opinionated distribution makes some of those choices. They might say, ‘We know we will be running on Kubernetes. We know we’re going to be running on this or that cloud. We know we’re going to have these resources available. So given that, here is the best setup for most people under most circumstances.’”_

## Baked in Best Practices

Nebari offers extensive extensibility to cater to specialized needs. This flexibility is crucial for teams requiring integration with other tools or modifying existing workflows. For example, Nebari ships with [Argo Workflows](https://argoproj.github.io/workflows/) but allows teams to integrate other workflow engines if they better suit the project requirements. This adaptability ensures that Nebari can serve as a comprehensive platform for various data science applications, supporting a wide array of organizational needs without locking users into a rigid framework.

**Q:** How does Nebari balance providing default settings with the need for customization in response to specific user needs?

**Chuck McAndrew:** _“Nebari ships with Argo Workflows. Argo Workflows is common in the Kubernetes space, but not everyone agrees it’s the best workflow engine. One of the things we’re constantly reexamining is our opinions about Nebari. We are actively discussing whether Argo Workflows should be ‘baked’ into Nebari and shipped by default._

_“Right now, clients can add Airflow, but it would be in addition to Argo because we use Argo for some of the more core features. It may be better to move those core features into a Kubernetes native rather than an extension and allow a swappable workflow engine. I think, in general, that’s kind of the philosophy that we like best, give people some defaults that work well, but allow them to override those defaults when they have a special use case.”_

## Reducing Environment Drift and Enhancing Development Cycles

Nebari significantly helps maintain consistency across different deployment environments.

Environment drift often leads to issues when deploying applications to production, where discrepancies between test and production settings can cause unexpected failures. Using the same codebase to define infrastructure across environments, Nebari ensures that all settings remain consistent, reducing errors and improving reliability. Additionally, this approach aids in faster development cycles, as teams can be confident that their applications will perform as expected in production, mirroring the test results. This consistency is crucial for maintaining high-quality deployments and efficient development workflows.

**Q:** How does IaC address the issue of environment drift between development stages, such as from testing to production?

**Chuck McAndrew:** _“When talking about platform engineering, one of the main goals is to make the right thing easy. We call this ‘The Golden Path.’ IaC allows you to do that._

_“It also has a lot of advantages for the development cycle when you’re working with multiple environments. One big problem, traditionally, has been environments drifting in their configuration. You deploy something to your test environment, and everything runs perfectly. Then, you need to deploy it to production, and everything breaks. Why? It’s because you had different environments. At some point, someone changed the configuration in this environment because they needed to and forgot to update prod. That doesn’t happen with infrastructure-as-code because both environments are built off the same code.”_

![Image of a colorful Nebari logo on a black background, with the text "Your open source data science platform. Built for scale, designed for collaboration."](/posts/nebari-an-infrastructure-engineering-perspective/Nebari-1-1536x865.png)

## A Robust, Scalable, and User-Friendly Platform

Nebari represents a significant advancement in how data science teams deploy and manage their infrastructure. By integrating cutting-edge technologies like Kubernetes and embracing the principles of Infrastructure-as-Code, Nebari offers a robust, scalable, and user-friendly platform that caters to the needs of modern data science operations.

## Get Started

Not only does Nebari simplify the operational workload, but it also empowers teams to focus on the unique value propositions of their data science endeavors. With Nebari, the field of data science has become more accessible, allowing more organizations to harness the power of data-driven decision-making.

If your organization wants to enhance its data science capabilities without expensive operational overhead, consider turning to Nebari. Contact Quansight today to discover how Nebari can improve your data science and help you leverage the full potential of your data science investments.

## About Quansight

Quansight provides data science solutions and supports open source software projects like Nebari. With deep roots in the Python, data science, and machine learning communities, Quansight employs a team of expert data scientists, software engineers, and developers who work closely with clients to solve complex data challenges and drive innovation by leveraging the latest open source technologies. Quansight is dedicated to advancing the open source data science ecosystem and actively contributes to projects like Jupyter, NumPy, Pandas, and Dask. Quansight’s expertise includes building custom data platforms, developing AI/ML models, optimizing data pipelines, and delivering actionable insights to clients across various industries through training and implementation.

Ready to learn more? **We want to hear from you.**

{/_ TODO: manual conversion needed: widget=form.default _/}
