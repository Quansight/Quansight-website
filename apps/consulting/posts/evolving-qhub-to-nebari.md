---
title: 'Evolving QHub to Nebari: Your Open Source Data Science Platform 🪴'
published: December 21, 2022
author: pavithra-eswaramoorthy
description: >
  We’re excited to announce a new chapter for Nebari, formerly known as QHub, as it evolves into an independent, community-led project, with a fresh new look!
category: [Jupyter, Open Source Software]
featuredImage:
  src: /posts/evolving-qhub-to-nebari/5-nebari-logo.png
  alt: 'Nebari logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

**Co-authors:** Tania Allard, Brian Skinn, Dharhas Pothina

---

We’re excited to announce a new chapter for Nebari, formerly known as QHub, as
it evolves into an independent, community-led project, with a fresh new look!

Since its launch nearly two years ago, Quansight has been incubating and
developing Nebari—a fully open source collaboration platform for data science
and research teams. What started as a proof-of-concept has become a trusted
platform by many teams, both within Quansight and in the broader community.

In this blog post, we share Nebari’s journey, what this milestone involves, and
why it is important to us.

<img
src="/posts/evolving-qhub-to-nebari/1-nebari-banner.svg"
width="750px"
alt="Nebari logo mark with the tagline: Your open source data science platform. Built for scale, designed for collaboration."
/>

## What Is Nebari?

Nebari is a quick-to-setup JupyterHub-based platform, where data science teams
can work and collaborate effectively.

You can set up (both configure and deploy) Nebari for your team with a single
YAML file, on [any major public cloud provider][nebari core repo] or your [local
HPC cluster][qhub-hpc repo]. Nebari has been developed with a DevOps-first
mindset, and it comes with
[several tools & integrations pre-configured][nebari homepage], including Dask
for scalability, reproducible environments, and features for sharing dashboards,
so that your team can use it out-of-the-box.

<img
src="/posts/evolving-qhub-to-nebari/2-nebari-cloud-architecture.svg"
width="975px"
alt="Nebari overview sequence showing deploying from nebari-config.yaml file, to the automatic setup of JupyterHub and cloud resources, to the live Nebari instance open to &quot;Server Options&quot;. The setup shows several cloud providers (AWS, GCP, Azure, or Digital Ocean) managed with a Docker container registry. We deploy JupyterHub with Dask and conda-store on these cloud resources using Kubernetes. The whole system is managed by Terraform."
/>

So why do we need yet another JupyterHub distribution? Deploying and maintaining
data science and research infrastructure remains a challenging task, especially
for small teams without dedicated infrastructure staff. Nebari aims to remove
some of this deployment overhead while integrating DevOps best practices,
scalable distributed computing, and reliable environment and dependency
management out-of-the-box. We spent the last few years solving these challenges
to bring Nebari to its current state, and we hope the community can build from
this foundation to make Nebari even better!

## Company-Backed to Community-Driven

Incubating Nebari at Quansight for the past two years allowed us to iterate on
new features and improve the project quickly. We used Nebari for a number of
client projects and internally at Quansight (as a means of real-life
[dogfooding][dogfooding @ wik]), which helped us catch and fix issues,
experiment with several integrations for a diverse range of use cases, and
configure what we like to call “sane defaults.”

Nebari has been completely open source since day one, though to date it has been
primarily developed by Quansight. We believe it has reached a maturity level
where a community-first approach to Nebari’s development and governance is
essential for its long-term sustainability. This is a core part of [Quansight’s
mission of “Building a Sustainable Open Source Ecosystem”][quansight about us].

## Governance That Supports Our Community

The first step in moving to a community-driven model is adopting a governance
structure and a license that puts our community first. It’s important to
explicitly state and codify our community values and practices to truly embrace
the spirit of open source software. We are working on a light, yet sustainable
set of policies to foster a healthy community around Nebari.

By doing so, we will enable a diverse set of stakeholders and community
participants to engage with and set the direction for the project. Also, having
a more transparent and community-first governance model will allow us to better
interact with other projects in the open source ecosystem, and ensure
improvements are regularly contributed to the upstream (all those open source
projects upon which Nebari is built on).

We care deeply about accessibility and inclusion: our roadmap highlights
initiatives in these areas, and we have a strong Code of Conduct to ensure these
standards are upheld. We understand that open source contributions go beyond
writing code, and our contributing guidelines accordingly include paths for all
forms of contributions. As one example, we’re documenting and updating our
day-to-day workflows, from decision-making to infrastructure details to allow
contributors to get involved in all aspects of the project. Our policy documents
encourage contributing back to upstream libraries whenever possible, reinforcing
our commitment to the open source community.

![A browser window showing Nebari documentation's "Community" page open to the "How to contribute" section. It highlights the different ways to contribute including code maintenance, community coordination, website design, UI/UX, technical documentation, and much more!](/posts/evolving-qhub-to-nebari/3-nebari-how-to-contribute.png)

We’re grateful for the opportunity to learn from other open source software
(OSS) communities and their governance policies to create a strong foundation
for Nebari’s next chapter. We took great inspiration from the JupyterHub, NumPy,
Kubernetes, Bokeh, and Gatsby JS communities, to name but a few.

Structurally, Nebari is now an independent organization, hosted on [GitHub as
nebari-dev][nebari github org] and licensed under a permissive [BSD 3-Clause
license held by the Nebari development team][nebari license]. Our governance
documents are in the [nebari-dev/governance repository][nebari governance repo]
and the [community section of our documentation][nebari community docs]. These
documents are a work in progress and will continue to evolve with the project
and its community.

## New Name and Brand

With this new chapter, we realized that the name “QHub” no longer captured the
essence of the project. We selected the name “Nebari,” which is a Japanese word
that describes the roots of a Bonsai tree that are visible above the surface of
the soil.

“Nebari” was [originally proposed][nebari name proposal comment] by [Pamphile
Roy][pamphile github profile]. In his own words:

> Bonsai is really an art and lifestyle for some people. Growing a Bonsai
> requires knowledge, patience, time, and care. It's a long-term relationship
> you need to have with your tree. During its long life, you will add features
> (pruning, orientation, dead wood, change branch orientations, etc.) and
> oversee its growth on a daily basis. All this to have a strong and healthy
> tree. I think this is what we can wish for a product, API, etc. Grow, yes, but
> with planning/vision/users in mind which all take time to reflect upon. Then
> you will have a strong product which corresponds to something, someone.

_~ Pamphile Roy, Software Engineer at Quansight, and core developer of SciPy_

Nebari captured everything we wanted the project to be: opinionated, yet
flexible, reliable, and ever-growing. Nurturing an OSS project is pretty much
like gardening, so the team loved this name and concept straight away.

The next step was to define a visual identity to capture this concept. Here are
some early concept ideas for the new logo, all of which try to bridge the ideas
of Bonsai and clouds (a nod to cloud computing):

<img
src="/posts/evolving-qhub-to-nebari/4-nebari-concept-composite.jpg"
width="900px"
alt="(Upper Left) Hand-drawn tree trunk(s) in the clouds, along with a concept for Nebari's logo where the base of N creates a root structure underneath it. (Upper Right) Concept for Nebari's logo. The word &quot;NEBARI&quot;  has a tree over it. the tree has lots of branches and leaves, and some with clouds behind it. Below the word, we see the tree's root structure. (Bottom) Different ideas for the font styles. Nebari is written by hand in block letters, types of cursives, and many more ways."
/>

The amazing [Irina Fumarel][irina website] took these ideas and created the
current Nebari logo:

<img
src="/posts/evolving-qhub-to-nebari\5-nebari-logo-tbcrop.png"
width="750px"
alt="Nebari logo. The symbol shows purple trunk and branches, with green capsule-shaped leaves, and a yellow circle at the top."
/>

The [Nebari colors and fonts][nebari design theme] were chosen to be accessible
to a wide audience and to stay consistent across various mediums like data
visualizations, documentation themes, graphics, and more. All our design assets
are publicly available at [nebari-dev/nebari-design][nebari design repo], and we
will soon add the design guidelines and a broader color palette!

## How Far We Have Come, and What’s Next

Nebari has come a long way since its [official launch in 2020]announcing qhub
post! It currently supports all major cloud providers: Amazon Web Services
(AWS), Google Cloud Provider (GCP), Azure, and Digital Ocean; as well as local
HPC clusters.

In preparation for the rename and change of governance, we spent the last few
months focusing on improving the user and developer experiences. For example, we
did a complete documentation re-write and re-structure. Nebari now follows the
[Diátaxis][diataxis site] framework, and has a new website built using
Docusaurus and hosted at [nebari.dev][nebari homepage].

We updated Nebari’s command line interface (CLI) using Typer and Rich for a
better user experience. We also created a new “Guided Init” wizard for new users
to deploy Nebari more quickly and with less friction. You can learn more about
these changes in the blog post
[Developing a Typer CLI for Nebari][nebari typer cli post] by Asmi Jafar, a
Quansight Labs intern, who worked on this feature.

We improved integrations like Keycloak for better access and resource management
and added new ones like Visual Studio Code and Grafana monitoring for
convenience.

<img
src="/posts/evolving-qhub-to-nebari/6-nebari-help.png"
width="850px"
alt="Nebari's CLI showing the output of nebari --help command. The options, commands, and additional commands are displayed distinctly in separate boxes, with accessible colors to differentiate the command from their descriptions."
/>

In the coming months, we will continue to focus on Nebari’s community and
governance documents. We want to add more guidelines for maintainers and more
contributing paths that involve little to no code. We are actively improving and
expanding the documentation, and making our integrations more robust.

You can keep up with Nebari’s progress by keeping track of our
[detailed roadmap][nebari governance repo] on GitHub!

## Join Our Community!

This milestone wouldn’t be possible without numerous contributors who worked on
Nebari over the years, continued support from the Quansight team, and feedback
from the broader open source community. We are immensely grateful to you!

<img
src="/posts/evolving-qhub-to-nebari/7-nebari-contributor-graph.png"
width="875px"
alt="GitHub contributor commit history for Nebari. It shows a steady flow of commits from March 2020 till November 2022. The activity in the first half of this period is bursty, while the second half is lower but more consistent."
/>

We’ve started hosting [bi-weekly meetings][nebari community meetings info] to
give all community members, including users, contributors, and maintainers, a
chance to collaborate and share ideas. We invite you to come by and say _hi_.

Try out Nebari, and let us know how it goes. We look forward to seeing you in
our community spaces!

export const GoButton = ({text}) => {
return (

<div class='flex justify-center'>
<button
className='py-2 px-8 mt-6 w-fit text-[1.8rem] font-bold leading-[3.7rem] text-white bg-violet'
onClick={() => {window.open('https://nebari.dev?utm_medium=web&utm_source=quansight-com&utm_content=post-evolving-qhub', '_blank');}}>

{text} &nbsp; &#9654;

</button>
</div>
)
}

<GoButton text="Get Started: nebari.dev" />

[announcing qhub post]: https://quansight.com/post/announcing-qhub
[diataxis site]: https://diataxis.fr/
[dogfooding @ wik]: https://en.wikipedia.org/wiki/Eating_your_own_dog_food
[irina website]: https://irinafumarel.ro/
[nebari community docs]: https://www.nebari.dev/docs/community/
[nebari community meetings info]: https://www.nebari.dev/docs/community#community-meetings
[nebari core repo]: https://github.com/nebari-dev/nebari
[nebari design repo]: https://github.com/nebari-dev/nebari-design
[nebari design theme]: https://www.compai.pub/v1/theme/59f11df0f1e0bd488afb0fd67f5df15b5305b8c7d7e889e8b638e6cb8aca321f
[nebari github org]: https://github.com/nebari-dev
[nebari governance repo]: https://github.com/nebari-dev/governance
[nebari homepage]: https://www.nebari.dev
[nebari license]: https://github.com/nebari-dev/governance/blob/main/LICENSE
[nebari name proposal comment]: https://github.com/nebari-dev/nebari/discussions/964#discussioncomment-1984965
[nebari typer cli post]: https://labs.quansight.org/blog/nebari-typer-cli
[pamphile github profile]: https://github.com/tupui
[qhub-hpc repo]: https://github.com/Quansight/qhub-hpc
[quansight about us]: https://quansight.com/about-us
