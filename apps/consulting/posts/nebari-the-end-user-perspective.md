---
title: 'Nebari: The End-User Perspective'
published: April 19, 2024
authors: [quansight]
description: 'Hear from Quansight’s Kim Pevey on empowering data science teams with collaboration and efficiency. Nebari is emerging as a significant'
category: ['Infrastructure & HPC']
featuredImage:
  src: /posts/nebari-the-end-user-perspective/Kim-Pevey-Thumbnail-01-1.png
  alt: "The image shows a photo of Kim Pevey, and the Nebari and Quansight's logo."
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Nebari: The End-User Perspective'
---

Hear from Quansight’s Kim Pevey on empowering data science teams with collaboration and efficiency.

[Nebari](https://www.nebari.dev/) is emerging as a significant player in data science platforms, particularly for those invested in utilizing Jupyter and related technologies in a team setting. Kim Pevey, a Senior Software Engineer at Quansight and a core member of the Nebari team, recently sat down with us to discuss Nebari from an end-user perspective. Pevey has spent a significant amount of time understanding Nebari’s impact on the daily lives of data science teams.

## But First, What Is Nebari?

Developed as open source software, Nebari redefines how data science teams operate. It is an opinionated JupyterHub platform explicitly designed for quick setup and to enhance collaboration across teams by providing a shared workspace where data, environments, and resources can be accessed and managed collectively.

## Core Features of Nebari

1. Collaboration Tools:

Nebari excels in facilitating teamwork. It offers a structured platform where data scientists can coalesce around shared goals, accessing and manipulating data collaboratively. This functionality is vital for teams spread across different geographies or working in different time zones, ensuring everyone stays on the same page regardless of their location and computing abilities.

2. Environment Management:

The platform comes with a robust, standalone open source environment management tool called [conda-store](https://conda.store/). This tool allows users to flexibly create and share environments while providing administrators control over them. This level of control is crucial for maintaining the integrity and security of the platform’s data and resources.

3. Extensibility Through Extensions:

Nebari supports an extension framework, allowing teams to customize and enhance their workspace with additional features. This extensibility makes Nebari a versatile open source tool that can adapt to the specific needs of different projects and teams. According to Kim Pevey, “Being able to customize individual deployments of Nebari through extensions allows teams to innovate and iterate outside formal contributions to the OS project. The outcome may be a custom, private extension for your team, or you may be interested in submitting it to be maintained under the Nebari umbrella.”

## Practical Usage and Administration

## Interface and Deployment

Walking us through the setup, Pevey states, “the Nebari homepage marks the start of the Nebari deployment. This deployment [shown in the image below] is currently hosted on Google Cloud Platform (GCP), leveraging cloud computing services for scalable data storage, analytics, and machine learning. “We also support deployment on Azure, Digital Ocean, AWS, and an on-prem option called [Nebari-Slurm](https://github.com/nebari-dev/nebari-slurm).”

The back-end operations, crucial for maintaining and updating the deployment, are managed through a GitOps approach. This method allows even those who are not DevOps experts to make configuration changes and quickly redeploy the environment, using GitHub repositories to manage these deployments.

![Image of KEYCLOAK logo](/posts/nebari-the-end-user-perspective/Image_b-Kim_Pevey_Interview_Nebari_End_User_Perspective-1024x226.jpg)

## Authentication and Initial Access

Access to Nebari begins by signing in, typically via Keycloak—an open source identity and access management solution—and via Google Authentication. “Keycloak can (also) work with your existing identity provider services such as GitHub, Auth0, and many others.” This step ensures that all interactions within the platform are secure and that only authorized users can access the resources.

It’s important to remember that, as an open source resource, Nebari is continually evolving.

![A screenshot of a website homepage showing a selection of services available on the website. The top section of the website displays the username and the text “Home”. Below that is a pinned section titled “Services”. The services listed are JupyterLab, VSCode, Environments, and Argo. A search bar is located at the bottom of the pages.](/posts/nebari-the-end-user-perspective/Image_c-Kim_Pevey_Interview_Nebari_End_User_Perspective-1024x493.jpg)

## User Experience and Navigation

The Nebari home screen provided by ‘[JHub Apps](https://github.com/nebari-dev/jhub-apps),’ sometimes referred to as ‘App Launcher,’ serves as a central navigation point for all features and tools within the platform. This interface has been subject to recent redesigns to enhance user experience and functionality, with ongoing updates that reflect the platform’s evolving nature.

“The App Launcher feature is new.” Pevey continues, “We’ve done significant design work in the past few months and are implementing new designs all the time. This interface is meant to be the central landing spot for easy access to everything on the platform.”

![A screenshot of a row of navigation buttons with the words "Argo, Users, Environments, Monitoring, VSCode" written on them. The word "Monitoring" is highlighted in blue, indicating it is the selected option.](/posts/nebari-the-end-user-perspective/Image_d-Kim_Pevey_Interview_Nebari_End_User_Perspective-1024x223.jpg)

## Initial Features Offered by Nebari

## Argo Workflows

Nebari integrates [Argo workflows](https://argo-workflows.readthedocs.io/en/latest/) for workflow orchestration. This tool helps create pipelines, schedule jobs, and more by enabling the definition and management of complex data science workflows in a YAML specification. It supports parallel and conditional task execution, optimizing computational resource utilization. Argo’s compatibility with tools like MLflow and GitOps practices further extends its utility in automating and streamlining data science operations within Nebari, focusing on efficiency and minimizing infrastructure overhead.

## User Management

Administrators can add, remove, and manage platform users by controlling visibility, permissions, and activities within user groups. Nebari’s user management feature integrates role-based access control (RBAC) and supports user grouping, facilitating granular permissions aligned with organizational structures. The admin interface, provided by the open source tool [Keycloak](https://www.keycloak.org/), is streamlined for ease of use, allowing administrators to manage roles and permissions efficiently.

## Environment and Version Control with conda-store

A standout feature of Nebari is its environment management system, [conda-store](https://conda.store/). This system reliably manages conda environments with auto-generated artifacts (like lock-files and pinned YAML specifications). Conda-store provides a historical record of the environments, enabling users to roll back to previous versions if needed. This functionality is particularly beneficial for troubleshooting and maintaining the stability of data science projects.

## Shared Environments

Conda-store also facilitates the sharing of environments, allowing users to collaborate directly within the platform. Simply sharing a notebook with a colleague is not enough if they don’t have the same environment you used to run it. Sharing environments through conda-store from within the platform makes it easier to collaborate on projects without the usual hurdles of environment compatibility.

![The image shows the interface of a package manager or environment manager tool. On the left, there is a list of environments such as "kcpenvy", "dask-rebuild", "dask-tutorial-updated", "env1", "env2", "examples", "goat", "goats", and "graphio_app". Each environment has metadata displayed including build dates and times, with some marked as "Available" and one marked as "Active". In the center panel, there is information about the "env1" environment, including requested packages like "click", "ipykernel", and "rich". There are also options to log out and close the "testtest" window.](/posts/nebari-the-end-user-perspective/Image_e-Kim_Pevey_Interview_Nebari_End_User_Perspective-1024x490.jpg)

## Innovative Use Cases and Further Developments

## Panel Apps and Collaboration

Pevey highlighted a use case where Nebari was instrumental in enabling a small team to collaborate effectively with other teams working on a large project. Using Nebari to create and share [Panel](https://panel.holoviz.org/) apps—an interactive web app—they could quickly disseminate knowledge and tools among team members, enhancing productivity and collaboration.

In conclusion, Pevey added, “I need to mention two things. One is that we also have [MLflow](https://mlflow.org/). MLflow allows us to visualize the status of models, such as machine learning (ML) and Artificial Intelligence (AI) models. That will be important to any AI discussion.

“Another value-add is the sharing of apps (as seen in the example above). We can create apps of various types, including Panel, Bokeh, Streamlit, Voila, Ploty Dash, and Gradio. We can also deploy a custom command for an arbitrary web page from Nebari. Technically, JupyterLab is deployed in the same way. In the next few weeks, we will add more fine-grained permissions to share apps with particular teams or individuals.”

It’s important to note that the deployed apps can be made public to anyone with a link on the internet, further enabling teams to work with external stakeholders.

![The image shows the Nebari platform's home screen, which allows users to create and manage applications. The main sections are: Services sidebar with options like Argo, Users, Environments, and Monitoring. "My Apps" area displaying two existing apps: Jupyter and Gradio (an AI/ML framework). "Shared Apps" area which is currently empty. A "Create New App" modal dialog with fields to configure a new app, including: Display Name and Description Option to upload a Thumbnail file Framework dropdown to select technology like Panel, Bokeh, Streamlit, etc. Environment Variables field Spawner Profile selection Option to Allow Public Access Cancel and Submit buttons The interface allows users to launch services like JupyterLab and Gradio apps, as well as create new applications by specifying details like the framework, environment variables, and access permissions.](/posts/nebari-the-end-user-perspective/Image_f-Kim_Pevey_Interview_Nebari_End_User_Perspective-1024x510.jpg)

## Future Prospects

Looking ahead, Nebari will introduce more refined permission settings for sharing applications, enhancing the granularity with managed access and collaboration. This feature will be particularly useful for teams needing strict control over who can see and modify different parts of a project.

Nebari stands out as a robust platform for data science, offering extensive tools for collaboration, environment management, and version control. Its integration with major cloud services and its commitment to open source principles make it appealing for teams looking to streamline their data science workflows. As it continues to evolve, Nebari is poised to become an indispensable tool in the arsenal of data science teams aiming for efficiency and innovation in their projects.

If you’re a data science team looking to streamline workflows, improve collaboration, and enhance your projects, consider Nebari your go-to platform. To learn more about Nebari, conda-store, or our general consulting capabilities, contact us at [connect@quansight.com](mailto: connect@quansight.com).
