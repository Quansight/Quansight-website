---
title: 'Recent Nebari Updates'
published: January 10, 2025
authors: [quansight]
description: 'New features, enhanced security, cost efficiency — read all about it.'
category: ['Infrastructure & HPC']
featuredImage:
  src: /posts/recent-nebari-updates/Nebari_Featured_Image.png
  alt: 'Recent Nebari Updates'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Recent Nebari Updates'
---

_New features, enhanced security, cost efficiency — read all about it._

Nebari is an open source platform that facilitates collaboration and streamlines data science operations. It offers a comprehensive environment for deploying data science tools and managing workflows, enabling teams to work together more effectively. Built to address the complexities of modern data-driven projects, Nebari empowers organizations with the tools they need to succeed in a collaborative, scalable, and secure environment.

We’re excited to unveil the latest updates to Nebari, meticulously designed to enhance the platform’s performance, simplify operations, and deliver measurable cost savings. These improvements make deployments more secure and user-friendly while showcasing our commitment to optimizing Nebari for real-world data science workflows.

Whether you’ve been a long-time user or are revisiting the platform, these advancements represent a significant leap forward. With these updates, Nebari continues to evolve as a robust, open source solution tailored to meet the demands of modern data science teams and enterprises alike.

_New to Nebari? [Here’s a quick overview](https://quansight.com/post/a-quick-overview-of-nebari/)_

## Smarter Scaling, Lower Costs

**50% Reduction in Fixed Costs**  
One of the key updates to Nebari involves optimizing default node configurations on the Google Cloud Platform (GCP). By transitioning to the cost-effective e2 machine family, we’ve achieved a 50% reduction in fixed costs for Nebari deployments on GCP. This change demonstrates our focus on providing scalable and efficient solutions while keeping operational expenses manageable.

**Dynamic Scaling Improvements**  
Expected to come in the January release ([See all releases HERE](https://github.com/nebari-dev/nebari/releases)), this upgrade improves resource isolation, addressing a critical bug preventing user and worker node groups from scaling down to zero instances when idle. Since node costs represent a significant portion of overall expenditures in Nebari deployments, this fix will result in substantial cost savings for affected users. By ensuring unused resources are deallocated dynamically, Nebari continues to offer a more efficient and cost-conscious approach to resource management.

## New Tools, Better Workflows

**JupyterHub Apps & Landing Page**  
JupyterHub Apps has a completely revamped Nebari landing page designed to improve navigation and enhance the user experience. This update provides a more intuitive interface and introduces new capabilities for deploying and managing applications directly within your environment.

With JupyterHub Apps, users can seamlessly deploy interactive applications such as dashboards, reports, and custom tools. These apps can be shared across teams for collaborative workflows or even made accessible to external stakeholders, expanding the range of use cases supported by Nebari. This feature empowers teams to move beyond standard Jupyter notebooks, enabling more flexible and streamlined sharing of data science outputs.

The redesigned landing page further emphasizes usability, providing quick access to resources, team-shared applications, and essential tools. By focusing on both functionality and aesthetics, this update ensures that Nebari continues to be a central hub for collaborative data science projects.

![Screenshot of the Nebari platform's home page showing the main dashboard. The interface includes a 'Quick Access' section with icons for JupyterLab, VSCode, and conda-store for Environments, along with a separate 'App Library' section featuring applications such as Panel, called 'Climatology,' and Bokeh called 'Function Explorer.' A navigation menu on the left lists services like JupyterLab, VSCode, Environments, Argo, Users, and Monitoring.](/posts/recent-nebari-updates/Nebari-image1.png)

## JupyterLab Gallery

The JupyterLab Gallery, introduced in Nebari 2024.7.1, offers a powerful new feature for users to seamlessly access and work with specific GitHub repositories directly within their Nebari environment. This functionality is particularly valuable for teams running interactive training sessions or collaborative projects, as it simplifies the process of sharing and managing company-specific repositories in Jupyter Notebooks.

By integrating with GitHub, the JupyterLab Gallery streamlines workflows, allowing users to quickly explore, clone, and interact with repositories without leaving the Nebari platform. This enhancement improves efficiency and fosters a more cohesive and collaborative experience for teams.

For a deeper look into the possibilities unlocked by JupyterLab Gallery and JupyterHub Apps, keep an eye out for an upcoming blog post on those topics by our DevRel team.

![](/posts/recent-nebari-updates/Nebari-Image2.png)

## Security Improvements

**JupyterHub 5.1.0**  
In 2024, Nebari underwent a significant upgrade, moving from JupyterHub 3.0.0 to 5.1.0. This transition introduced a range of new features and addressed critical security vulnerabilities, such as [GHSA-9x4q-3gxw-849f](https://github.com/jupyterhub/jupyterhub/security/advisories/GHSA-9x4q-3gxw-849f), ensuring a more secure and reliable user experience. By adopting the latest release of Nebari, users can take advantage of these improvements while protecting their environments against high-severity vulnerabilities.

**Fine-Grained User Permissioning**  
Security is further enhanced with Nebari’s support for fine-grained user permissions. This feature allows administrators to define more precise access controls, ensuring that users can only interact with resources and tools relevant to their roles. This capability improves security and simplifies collaboration by tailoring access to individual team members’ needs.

For more details on implementing fine-grained permissions in your environment, check out the [Nebari documentation](https://www.nebari.dev/docs/how-tos/fine-grained-permissions/).

By continually prioritizing security and user management, Nebari ensures that organizations can maintain robust, compliant, and efficient operations.

## Bug Fixes & Enhancements

**Memory Leak Resolution**  
One of the key updates addresses a memory leak issue in [conda-store](https://conda.store/), a critical component for managing environments in Nebari. This fix is included in the latest release of conda-store and is incorporated into Nebari 2024.11.2

By resolving this issue, the update ensures more efficient memory usage, reducing potential downtime and improving the overall stability of the platform.

**Ongoing Quality-of-Life Enhancements**  
In addition to resolving specific issues, the Nebari team has implemented numerous quality-of-life improvements to refine the user experience. These include fixes for minor bugs, optimizations to existing features, and streamlined workflows.

For a comprehensive overview of all fixes and updates, be sure to review the [full release notes](https://www.nebari.dev/docs/references/release/). These continuous improvements reflect Nebari’s commitment to delivering a stable, reliable, and user-friendly platform for data science teams.

[Watch the video](https://youtu.be/sQTQ_fg2avA?si=nPg30udEIKDzaQ5v)

## Let’s Upgrade Your Nebari Deployment

We’re here to help you take full advantage of these impactful updates. Whether you’re looking to upgrade your existing Nebari deployment or explore these new features in-depth, we’re ready to support you every step of the way.

If you haven’t experienced Nebari yet, now is the perfect time to see what it can bring to your organization. With its robust tools, seamless scalability, and commitment to open source collaboration, Nebari is built to meet the demands of modern data science teams. Explore how Nebari can enhance your workflows and enable smarter, more efficient operations.

Let’s build something amazing together.

Acknowledgements:

- Thank you to the entire [Nebari Contributors](https://github.com/nebari-dev/nebari/graphs/contributors) at Quansight and around the world
- Thanks to Quansight leadership for their direction and faith in our team
- Thanks to [Adam Lewis](https://github.com/Adam-D-Lewis) for helping to write most of this information
