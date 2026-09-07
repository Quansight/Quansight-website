---
title: 'Building a GPU CI Service for conda-forge'
published: August 2, 2024
authors: [jaime-rodriguez-guerra]
description: "The recent revision of the array API standard marks another major milestone in the collective effort to achieve array interoperability across the Python data ecosystem. \nA recent post by Quansight Lab’s Athan Reines on the Data APIs blog shares updates on the consortium’s progress and plans for the future."
category: ['Infrastructure & HPC', Packaging]
featuredImage:
  src: /posts/building-a-gpu-ci-service-for-conda-forge/2024.8-building-a-gpu-ci-service-for-conda-forge-metrostar-quansight-thumb.png
  alt: 'Logos of MetroStar Systems, conda-forge, and Quansight, representing their collaboration.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Building a GPU CI Service for conda-forge'
---

![Image of the Quansight logo](/posts/building-a-gpu-ci-service-for-conda-forge/Quansight-logo-cropped.svg)

![](/posts/building-a-gpu-ci-service-for-conda-forge/MetroStar-logo.svg)

_How Quansight, MetroStar, an anonymous donor, and the conda-forge community came together to close one of conda-forge’s [oldest open issues](https://github.com/conda-forge/conda-forge.github.io/issues/63), dating back to 2016._

Python has become the cornerstone of modern AI and data science. In theory, there are thousands of scientific and numerical libraries written in Python that can be mixed and matched to solve complex problems. In practice, installing and using a set of Python libraries together can become quite complex.

At the heart of the issue is that many of the most powerful libraries in Python are wrappers around high-performance code written in languages like C++, Fortran, or Rust, and building compatible versions of all these libraries is hard to do in a decentralized ecosystem. For example, conda is an open source package management system and environment management system that has been under development for over a decade, and it solves many of the thorny problems required to build and distribute a consistent, compatible collection of libraries.

While conda provides the necessary tooling to build a consistent Python distribution, it’s insufficient on its own. This is where conda-forge comes in: conda-forge is a community-driven collection of conda packages maintained by more than 6,000 contributors around the world. It provides over 26,000 packages, distributes 2 million artifacts, and 2 billion downloads each month.

This is all done through a collaboration of volunteers with developer and infrastructure support from various organizations. To work at this scale, conda-forge has developed a largely automated build farm. This is important for two reasons: first, it reduces the burden of maintaining such an extensive collection of packages, but more importantly, it is a vital aspect of the trust and security of the conda-forge because all the steps from the source code to the final downloadable package are automated, traceable and verifiable.

A key enabler of this entire system is free continuous integration (CI) compute infrastructure provided by various cloud vendors to open source projects in general and conda-forge specifically. Without the donation of these CI resources, a community-run distribution like conda-forge would not be possible.

## How Conda-Forge Works

![Flowchart depicting the process in conda-forge from a new commit to package installation. The steps include: 1) New commit added to conda-forge repository on GitHub, 2) CI pipeline runs conda-build, 3) Package gets uploaded to Anaconda.org, and 4) User runs conda install.](/posts/building-a-gpu-ci-service-for-conda-forge/conda-forge-simple-500.png)

While conda-forge benefits from this largely automated build farm where maintainers can package their projects via CI pipelines, some projects still need to resort to the manual labor of volunteers. These projects can be divided into two groups:

1. Packages that use or require GPUs to run. GPUs in the cloud are very expensive to use, and they are not included in the free tiers available for open source projects.
2. Packages whose compilation requirements exceed the free quotas offered by Azure, Travis, or other CI providers (time-limited on smaller capacity servers). The limiting factor could be available disk space, CPU count, RAM, or duration.

While it’s true that many GPU packages can be built without an actual GPU present in the build machine, testing them on CI is a significant hurdle: the artifacts need to be downloaded and installed manually in a hardware environment equipped with a compatible GPU where the maintainers can run the tests.

For packages that cannot be built on CI due to resource limitations, the process is even more painful: the maintainers need to run the build scripts locally on their own machines. As per [CFEP-03](https://github.com/conda-forge/cfep/blob/main/cfep-03.md), this needs to be done in an isolated environment while keeping account of the build logs, which will be reviewed by yet another maintainer to ensure that the builds are sound and secure.

The net result of this situation was that updating these packages to the latest version was often delayed because of the extra effort required. This included popular packages like PyTorch, TensorFlow, Qt, or MongoDB, which added extra frustration to the end-user experience and an additional burden on the volunteer maintainers.

Both problems can be tackled with a single solution: a CI service that provides GPU builds and more generous resource quotas (including longer runtimes but also more RAM, disk, and CPU cores). There are no free services available that fulfill these requirements, and the paid tiers from cloud providers are prohibitively expensive for a community organization with no income.

The alternative would be to build a dedicated CI server for conda-forge. A donor approached conda-forge about donating GPUs to support this idea. As a distributed volunteer-run organization, conda-forge was unable to accept the GPUs, so they reached out to us to explore the possibility of Quansight hosting a CI service with the donated GPUs.

Quansight is a longtime supporter of conda-forge and has several core developers on staff in the conda and conda-forge communities. Trusted in the open source community and by the industry, we jumped at the opportunity to solve this long-standing problem. Any solution we created had to provide a performant, transparent, and secure product without imposing too much burden on the conda-forge infrastructure team while at the same time being sustainable cost-wise to maintain.

We learned many things along the way, which we will summarize in this blog post. Keep reading to discover how our engineers built the system, and join us on a journey of graphic cards, continuous integration, cloud platforms, and surprising details of high-performance hardware.

\*\*The collaboration between Quansight, MetroStar, a generous GPU donor, and the conda-forge community has lowered the barrier to contribution for key packages like PyTorch, TensorFlow, and Jaxlib, which are downloaded hundreds of thousands of times per month.

\*To see what the server enables the conda-forge team to do, check out these recent GitHub pull requests for [**PyTorch**](https://github.com/conda-forge/pytorch-cpu-feedstock/pull/238) and [**TensorFlow**](https://github.com/conda-forge/tensorflow-feedstock/pull/385)**.\*\*\***

> This finally solves the biggest pain point that's been plaguing us for years when it comes to heavyweight builds like PyTorch or TensorFlow — we know how to build those, but it couldn't be done by the free CI agents in the hard time cap of 6h. That meant every single build we published for those packages needed to be built by hand, which was an extreme bottleneck in keeping these packages up-to-date. Needless to say, I'm very excited that we can now wrangle with these behemoth packages without being forced to resort to local builds.
>
> — Axel Obermeier (@h-vetinari), conda-forge core team member

## Step 0: The plan

In late 2020, conda-forge contacted Quansight to study the possibility of hosting a CI service that provided access to some GPUs donated to the cause. Challenge accepted!

The idea looked very simple, after all:

1. Buy a beefy server and install the GPUs in it.
2. Install a cloud-oriented OS (there must be one, right?), and connect it to the internet.
3. Install a self-hosted CI service that allows to spin up VMs on demand.
4. Make sure it works reliably while ensuring public access.

How difficult can that be? Ha! You will find out in the following steps. Note that the steps detailed below do not follow a strict chronological order. Instead, it was an iterative process where we had to undo several improvements to fix an underlying issue. The write-up below simplifies the story, but for the sake of clarity and usefulness of this article, we’ll save you the pain (or joy!) of watching us suffer. Instead, we will just enumerate the challenges we faced and how we overcame or worked around them.

## Step 1: Secure the host machine

Six Tesla V100 GPUs were donated, but we needed a server to host them. We browsed HPC providers for suitable machines able to sustain the expected loads of a CI service.

We were in the market for a high amount of cores and a healthy amount of RAM and disk. The supply chains were understandably constrained back then (2021), so suitable configurations were not in stock for the foreseeable future.

We ended up settling for a ThinkMate GPX QT8-22E2-8GPU unit sporting 2 AMD EPYC 7352 24-Core CPUs and a healthy amount of RAM and disk space: 512 GB of DDR4 goodness, 1 TB of NVMe SSD and 8TB SATA SSD. That should be enough, right? Oh, what we finally did order, ended up being delayed by several months because of supply chain issues.

## Step 2: Find a data center to host our server

While buying the server, we also had to find a location to host it. This needed to happen parallel to the actual purchase so we could correctly specify the delivery address. These machines are not precisely portable, and we don’t want 50+ pounds (22+ kg) of metal dancing around the country.

We rented some space at a colocation company and had the server delivered. The staff had strong opinions on how the server should be configured and connected to their premises. Their support system sometimes involved a feedback loop of days between responses, which was not ideal while setting up the system. More on this below, but if you have to wait days just to connect a GPU to a different PCI lane, it becomes a frustrating experience where no one is to blame. The monthly fee added more frustration, considering it covered hosting and support.

Eventually, we decided to change data centers and partnered with MetroStar. We have worked with them before and enjoy a long-lasting contractual relationship. They kindly offered to host the server for free, including all the network traffic, with full admin access. This enabled a tighter feedback loop, allowing us to iterate faster on the server setup.

> Finding a data center to host the server was one of the most challenging, non-code problems conda-forge and Quansight had to solve. However, thanks to Metrostar, that problem became just a matter of plug-and-play. The full admin access to the team reduced the config iterations and allowed us to quickly configure everything we needed.
>
> — Filipe Pires Alvarenga Fernandes (@ocefpaf), conda-forge core team member

![View of Quansight's server setup at MetroStar's data center, showing multiple server racks and equipment](/posts/building-a-gpu-ci-service-for-conda-forge/datacenter.png)

## Step 3: Configure the server

Once the server arrived at MetroStar’s data center, we asked their IT team to install Ubuntu Server 22.04 and then provide us with the login details so we could connect remotely and install everything else.

MetroStar provided us with a VPN tunnel to access the server and the SSH credentials.

We had initially considered different self-hosted CI services, like [Drone.io](https://www.drone.io/) or CircleCI. However, after exploring the available options in detail, we realized these solutions did not satisfy our requirements (e.g., creating and starting isolated VMs for each job on demand). We [decided](https://github.com/conda-forge/conda-forge.github.io/issues/1272) to rely on an OpenStack installation paired with the Cirun.io service. A core design principle we were aiming for was to build a system that would be low maintenance both for Quansight engineers maintaining the system and for conda-forge folks using the system.

[OpenStack](https://www.openstack.org/) is an open source cloud software that lets you create on-demand virtual machines, storage, networks, etc., just like any commercial cloud provider like AWS or GCP. It is a very complex software to deploy and maintain, and there are a zillion ways to install OpenStack. It took us a few attempts to understand which one would suit our needs, as in the one which is most reliable and requires minimal ongoing maintenance work. We ended up choosing [Kolla-Ansible](https://docs.openstack.org/kolla-ansible/latest/), which provides production-ready containers and deployment tools for operating OpenStack.

Once you have your base OpenStack instance, you need to create some “flavors” that dictate what resources the VM will be assigned. Taking into account that conda-forge mostly runs on 2-CPU runners with ~6GB of RAM, we settled for the following (superior) configurations:

**CPU runners:**

**Name**

**vCPUs**

**RAM**

**Disk**

ci_medium

4

8GB

60GB

ci_large

4

12GB

60GB

ci_xlarge

4

32GB

60GB

ci_2xlarge

8

32GB

60GB

ci_4xlarge

8

64GB

60GB

**GPU runners:**

**Name**

**vCPUs**

**RAM**

**Disk**

**GPUs**

gpu_tiny

4

2GB

20GB

1x NVIDIA® Tesla V100

gpu_medium

4

8GB

50GB

1x NVIDIA® Tesla V100

gpu_large

4

12GB

60GB

1x NVIDIA® Tesla V100

gpu_xlarge

8

16GB

60GB

1x NVIDIA® Tesla V100

gpu_2xlarge

8

32GB

60GB

1x NVIDIA® Tesla V100

gpu_4xlarge

8

64GB

60GB

1x NVIDIA® Tesla V100

That should be enough to provide 12 concurrent runners at best or four at worst. These kinds of runners wouldn’t only allow folks to test their packages with GPUs but also enable larger projects like PyTorch or Tensorflow, whose build processes usually take longer than the 6h offered by Azure, to be built on public CI.

**NOTE – How we build the VM images:**  
Those VMs need an OS to boot. This is usually achieved with VM “images” not very different from the ones you might have used in VirtualBox or similar desktop solutions. To build these reliably, we use OpenStack’s [DiskImage-builder](https://docs.openstack.org/diskimage-builder/latest/).

The configuration files are available at [Quansight/open-gpu-server](https://github.com/Quansight/open-gpu-server/tree/main/vm-images). They are essentially Ubuntu images with a few things added on top, so they work on conda-forge right off the bat: Docker and some CLI essentials like zip.

The CPU images can be built on regular CI and uploaded to OpenStack. However, since the GPU images bundle the NVIDIA® GPU drivers, these need to be built on a runner with access to a unique type of GPU (a limitation imposed by the driver installers). As a result, we use the GPU runners, albeit configured with a CPU image, to build the GPU images. It’s a fun puzzle, isn’t it?

## Step 4: Expose the runners to the public Internet

Before we configured the OpenStack VMs as Github Actions runners, we needed to ensure that the OpenStack API is reachable from the public internet. MetroStar premises are behind a VPN, so we had to devise a reverse proxy to handle the requests. The reverse proxy uses [Traefik](https://traefik.io/traefik/) and is hosted on an e2-small instance on Google Cloud Platform. This is depicted in the figure below.

![Diagram showing the setup to expose the runners to the public Internet. The flow includes: Public Internet connecting to ci.quansight.dev, which uses Traefik on a Google Cloud e2-small instance. This instance has a whitelisted IP on the VPN, which connects to the GPU server on MetroStar's VPN.](/posts/building-a-gpu-ci-service-for-conda-forge/proxy-of-proxy.svg)

The VPN network also impacted how the VM image is preconfigured. We needed to adjust the MTU network configuration so that both the OS and Docker use the same value as imposed by the VPN. Otherwise, the Docker container would not have access to the internet.

## Step 5: Register the self-hosted runners in Github Actions via Cirun.io

We are getting closer! We have a server configured with OpenStack, with access to the Internet, and equipped to create VMs optimized for CI usage. What’s left? We need to register those VMs in the GitHub Actions configuration of conda-forge, and that’s it, right?

Unfortunately, it’s not that easy. Self-hosted runners in GitHub Actions are assumed to be always reachable, but we want our VMs to be ephemeral for security and robustness purposes. In other words, each build job should run on a freshly deployed VM that will be destroyed right after.

The solution to this problem is using a service like Cirun.io. Cirun is a Github app that connects to your Github repositories and spins CI runners on demand. When you push a new commit to your PR, GitHub sends this event to the configured apps, saying, “Hey, we have a new CI job!”. Cirun receives that event and sends a request to the configured backend, asking for a new runner. These backends are usually cloud providers like AWS or GCP, which provide an API that Cirun uses to provision a new cloud runner on the spot and configure it for usage with GitHub Actions. Once ready, Cirun exposes the runner to the repo, and Github picks it up to run the CI job.

Wonderful, isn’t it? We just need to configure Cirun to connect to our OpenStack instance and use their APIs to provision a new VM. The only problem is that Cirun didn’t have OpenStack integrations back then, so we had to create them. Fortunately, Cirun’s author, Amit, is part of the Quansight team, and we could simply ask him. We covered this as part of the Cirun internship program in 2021, where Amit mentored Nabin Nath to implement and test OpenStack integrations ([read the blog post!](https://nabin-nath.github.io/posts/aktech-labs-intern/#second-task)).

We thought adding OpenStack integration was all we needed, but soon enough, we realized how wrong we were. OpenStack is a full-fledged open source cloud framework, and with that comes the complexity of a cloud provider, which we should deploy and maintain. This is very different from conventional clouds like AWS and GCP, where everything just works magically; instead, we are responsible for everything: virtual machines, networking, storage, authentication…There are a million things that can go wrong, like running out of disk space, all the GPUs being taken, API not accessible, etc. It took us quite a while to figure out all (or most) of the failure cases to be able to implement specialized error handling and retry mechanisms based on those on top of what Cirun already provides.

![Diagram illustrating the workflow of Cirun integrating with GitHub and GPU servers. The process includes creating a workflow on GitHub, which triggers a runner VM creation request to the GPU server via Cirun. The runner VM is created in OpenStack, executes the workflow, and then the VM is destroyed upon completion. The workflow status is then sent back to GitHub.](/posts/building-a-gpu-ci-service-for-conda-forge/cirun-github.svg)

## Step 6: Prepare conda-forge for the Cirun runners

Once the OpenStack integrations were deployed to Cirun, we could start debugging our setup. Our initial configuration in conda-forge simply relied on connecting the Cirun app to the organization and enabling it in a [test repository](https://github.com/conda-forge/cf-autotick-bot-test-package-feedstock). We started stress-testing our setup with a couple of packages. You can even check our debugging journey in two PRs available in that repository: [OpenMM at #446](https://github.com/conda-forge/cf-autotick-bot-test-package-feedstock/pull/446) and [CuPy at #466](https://github.com/conda-forge/cf-autotick-bot-test-package-feedstock/pull/466).

Getting these PRs to pass involved adjusting the GitHub Actions workflows provided by conda-smithy to be compatible with the self-hosted runners provided by Cirun (see [#1703](https://github.com/conda-forge/conda-smithy/pull/1703), [#1794](https://github.com/conda-forge/conda-smithy/pull/1794), [#1795](https://github.com/conda-forge/conda-smithy/pull/1795), [#1809](https://github.com/conda-forge/conda-smithy/pull/1809), [#1812](https://github.com/conda-forge/conda-smithy/pull/1812)). It also revealed the MTU problems discussed above and the GPU passthrough issues you’ll read about below.

![A small tablet or display screen sits on a wooden surface, showing the interface for an "OpenGPU Server" with status bars indicating it's operational. On either side of the screen are two small figurines of armored guards. The scene is set against the background of a wall with decorative molding, giving it a home-like setting.](/posts/building-a-gpu-ci-service-for-conda-forge/amits-desk-scaled.jpg)

## Step 7: Debug GPU passthrough

Why was it so important to have a quick way of changing the physical aspects of the server? After all, once we had OpenStack running, it was just a matter of finding the right configuration for the GPU passthrough.

That’s what we thought, too. The motherboard has N PCIe lanes; just connect the GPUs to them, and the story is over, right? It turns out that there’s a little hardware detail we had not considered. IOMMU!

To be able to create virtual machines that have exclusive access to the hardware (GPU in this case), the CPU (and motherboard, BIOS, and firmware) must have support for AMD-Vi (or VT-d for Intel devices). This feature is enabled by an IOMMU (Input-Output Memory Management Unit). When you create a virtual machine (VM), it has a different address space than the host machine, which means that if the VM tries to access a physical device connected to the host machine via DMA (Direct memory access), it will access the wrong address. This is where IOMMU comes into play: it translates the device’s physical address on the host to the “physical” address on the VM.

When you enable IOMMU on the host machine, all the devices connected to the host get added to various groups, also known as IOMMU groups. In an ideal world, all the devices will have their own separate group, but in practice, this isn’t the case. This is due to the PCIe architecture:

![A hierarchical diagram showing the structure of computer memory. At the top are "CPU" and "Memory" boxes, connected to "Root Memory". From "Root Memory", two branches extend: one to "PCIe Endpoint" (labeled "IOMMU Group 32"), and another to a "Switch". The "Switch" further connects to two "PCIe Endpoint" boxes (labeled "IOMMU Group 19"). This diagram represents the memory and PCIe architecture of a computer system.](/posts/building-a-gpu-ci-service-for-conda-forge/PCIe.svg)

You can see in the figure above that two PCIe devices connected to a switch would have the same IOMMU group. Below is some sample code to get IOMMU groups for each NVIDIA® GPU.

```bash
$ cat iommu.sh
#!/bin/bash
for d in $(find /sys/kernel/iommu_groups/ -type l | sort -n -k5 -t/); do
    n=${d#*/iommu_groups/*}; n=${n%%/*}
    printf 'IOMMU Group %s ' "$n"
    lspci -nns "${d##*/}"
done;


$./iommu.sh | grep -i nvidia
```

```
IOMMU Group 19 27:00.0 3D controller [0302]: NVIDIA Corporation GV100GL [Tesla V100 PCIe 16GB] [10de:1db4] (rev a1)
IOMMU Group 19 28:00.0 3D controller [0302]: NVIDIA Corporation GV100GL [Tesla V100 PCIe 16GB] [10de:1db4] (rev a1)
IOMMU Group 32 44:00.0 3D controller [0302]: NVIDIA Corporation GV100GL [Tesla V100 PCIe 16GB] [10de:1db4] (rev a1)
IOMMU Group 75 a3:00.0 3D controller [0302]: NVIDIA Corporation GV100GL [Tesla V100 PCIe 16GB] [10de:1db4] (rev a1)
IOMMU Group 87 c3:00.0 3D controller [0302]: NVIDIA Corporation GV100GL [Tesla V100 PCIe 16GB] [10de:1db4] (rev a1)
IOMMU Group 87 c4:00.0 3D controller [0302]: NVIDIA Corporation GV100GL [Tesla V100 PCIe 16GB] [10de:1db4] (rev a1)
```

It took us a lot of debugging to realize that the motherboard is designed to group some PCIe lanes in the same IOMMU. This is problematic because, as we found out later, the GPU passthrough virtualization works by exposing full IOMMU lanes to the VMs, not GPUs per se. So, if you have two GPUs sharing one IOMMU lane, only one can actually be passed to the VM.

Sadly, the motherboard only offers 4 IOMMU channels, so we had to shuffle GPUs around to ensure that at least four of them were on PCIe lanes that didn’t share IOMMU channels. That still means two of our six GPUs are connected but completely idle.

Note: Different [virtualization products](https://www.nvidia.com/en-gb/data-center/buy-grid/) can split the physical GPUs into smaller virtual devices that can be exposed to the VMs regardless of the underlying motherboard IOMMU setup. We would like to explore this avenue in the future, but for now, we can at least offer four concurrent GPU runners.

## Step 7: Ensuring fair access

With a server that is able to provide at most four concurrent GPU runners, it’s not realistic to open access to everyone at once, even though conda-forge has over 20,000 feedstocks that build packages. There are also legal implications of liability and responsible use that we at Quansight need to handle correctly.

To circumvent these issues, we discussed the possibility of offering “opt-in CI services” for conda-forge, of which the GPU CI would be a part. The idea was to provide a mechanism in `conda-forge/admin-requests` where feedstock maintainers can request access to certain CI providers that are not enabled by default. Once reviewed and approved, some automation would allow the requested runners for that feedstock and configure Cirun accordingly. More technical details can be found at ‘conda-forge/admin-requests’ ([#767](https://github.com/conda-forge/admin-requests/pull/767), [#858](https://github.com/conda-forge/admin-requests/pull/858), [#866](https://github.com/conda-forge/admin-requests/pull/866), [#870](https://github.com/conda-forge/admin-requests/pull/870), [#876](https://github.com/conda-forge/admin-requests/pull/876), [#880](https://github.com/conda-forge/admin-requests/pull/880), [#901](https://github.com/conda-forge/admin-requests/pull/901), [#914](https://github.com/conda-forge/admin-requests/pull/914)) and ‘cirun/cirun-py’ ([#1](https://github.com/AktechLabs/cirun-py/pull/1)). This work was sponsored by a NumFOCUS Small Development Grant.

We also had to ensure that the users had read and agreed to the [terms of service](https://github.com/Quansight/open-gpu-server/blob/main/TOS.md) of the GPU CI server. Not without substantial legal consultation, we decided to establish a separate process where each Github user would apply for access over at [Quansight/open-gpu-server](https://github.com/Quansight/open-gpu-server). Once the request is approved, the list of authorized users is updated, and Cirun is able to validate their credentials and provision the runners.

Finally, we needed a way to monitor the availability of the server. We implemented an [OpenStatus.dev panel](https://ci-status.quansight.dev/), whose generous [Free Tier](https://www.openstatus.dev/pricing) already allows us to ping the server at specific endpoints and monitor the responses. The [conda-forge status page](https://conda-forge.org/status) can then query their public API. This way, we can receive alerts of service degradation before our users report potential incidents in the [issue tracker](https://github.com/Quansight/open-gpu-server/issues).

## Next steps

Right now, we are limited in the amount of runners we can expose concurrently. It’s unlikely that the CI jobs require a full physical GPU to successfully test their packages. Chances are that a small slice of the whole thing is sufficient. If we manage to obtain a license for virtual GPUs (vGPUs) and configure them successfully in OpenStack, we could have way more simultaneous GPU runners and serve conda-forge better.

We could also optimize the number of concurrent CPU runners by experimenting with the overcommit ratio, in other words, allowing one CPU core to be used by more than one VM simultaneously. Package building often has a significant IO component, so some CPUs might be sitting idle at times.

There have been some issues with starved runners as well. Some packages require a lot of memory to run their tests, and in those cases, the GitHub Actions Runner client ends up being killed by the kernel out of the memory pressure. We need to investigate the adequate configuration to preserve the Runner process and fail the job in a nice way instead of leaving the user clueless with no logs.

We would also like to fully automate the VM image build process. We have an initial prototype, but the workflows are not yet enabled in the repository. We’d like to similarly automate the reprovisioning of the OpenStack server. We would prefer to have an Infrastructure-as-code approach.

## Conclusions

Building a GPU CI service was trickier than we anticipated. We found a number of challenges along the way, from which we learned a lot. Several of those challenges stemmed from optimistically simplified mental models (e.g., “Just connect the GPUs to a server and install an open source CI system!”) and being unaware of important hardware details. It was a long journey, but now we have a stable, robust solution and are happy that conda-forge is now able to enjoy GPU builds. At the time of writing, six repositories have been configured to use the GPU CI server, amounting to over 300,000 build minutes.

We hope this blog post serves as a reference point for those groups that are investigating how to provision their own CI systems. Unless you already have the hardware around, for most small to medium-scale cases, Cirun configured with a cloud provider offers a cost-effective way of achieving the same or better result. There is no need to scan the market for good hardware deals, optimize IOMMU channels, connect via VPN networks, figure out how to build VM images, or whether the base OS is up-to-date.

## Acknowledgments

This journey is not one we at Quansight did alone. We received the support and help of many partners along the way, and we want to give them the space they deserve in this blog post.

- [MetroStar](https://www.metrostar.com/) for allowing us to colocate the server on their premises at no cost.
- Our anonymous GPU donor, for generously providing six V100 GPUs.
- [NumFOCUS](https://numfocus.org/) for funding the opt-in CI services integrations at conda-forge through their Small Development Grant program.
- The [conda-forge](https://conda-forge.org/) core team, with honorable mentions to Matthew Becker, Filipe Fernandes, and John Kirkham, for their continuous attention and availability for brainstorming possible solutions to this problem.
- The conda-forge community, as a whole, for their patience while we went through this adventure together.
- The many [Quansight](/) employees who participated in this project, especially the contributions of Amit, Isuru, Vini, and Chris, as well as Dharhas, for providing leadership.

## “Wait, I have questions!”

Consider this an opinionated FAQ section.

> Okay, that story is cute, but the thing is, I have a package at conda-forge that would benefit from testing on a GPU. What do I have to do?

Suppose that’s you right now; first, thanks for reading all the way through. These are the steps:

1. Request access to the GPU CI for your feedstock via [admin-requests](https://github.com/conda-forge/admin-requests). This only needs to happen once per feedstock.
2. Read and agree to the [terms of service](https://github.com/Quansight/open-gpu-server/blob/main/TOS.md) via [open-gpu-server](https://github.com/Quansight/open-gpu-server). Let the other maintainers in the feedstock know that if they haven’t yet done so, they also need to do this if they want their commits to run on this CI service.
3. Check the automated PR that your feedstock should have received, and adjust your recipe as necessary. Merge when it passes and profit!

> How does it really work? Cirun looks like magic.

Assuming Cirun is already enabled and correctly configured in your repository:

1. A user pushes one or more commits to a branch, which triggers a Github Actions workflow. GitHub emits an event with the workflow details, which also contains labels (from the “runs-on” param in the GitHub workflow file).
2. Cirun receives the event and validates the event payload against the configuration stored at ‘conda-forge/.cirun,’ which includes access control validations like:  
   a. GitHub team of the user  
   b. GitHub role of the user on the repository  
   c. If the user has accepted the TOS  
   d. If the user is authorized to trigger workflows for that event (e.g., a pull request)  
   e. If the labels are valid
3. If successful, this will return a runner configuration corresponding to the labels defined in the workflow. This contains attributes required to create a runner, like:  
   a. Cloud (OpenStack in this case)  
   b. Instance type  
   c. Machine image  
   d. Region
4. Using the runner configuration, Cirun will send a request to OpenStack to spin up the runner with all the user data required to provision the VM, like installing the GitHub [Actions Runner application](https://github.com/actions/runner).
5. In the meantime, GitHub has been waiting for a compatible runner to be available. After the provisioning is complete by OpenStack, the runner application will communicate to Github and start listening to jobs. Once there, it will pick up the triggered job created in step 1.

> Can you provide a list of references you found useful while working on this project?

- [Open-gpu-server repository](https://github.com/Quansight/open-gpu-server) (Contains documentation about our setup as well as configuration files.)
- [Cirun.io](https://cirun.io/) (Sets up Github Actions runners on demand.)
- [Kolla Ansible: production-ready containers and deployment tools for OpenStack](https://docs.openstack.org/kolla-ansible/latest/)
- [ArchLinux Wiki article](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#), [ProxMox article](<https://pve.proxmox.com/wiki/PCI(e)_Passthrough>), [OpenStack documentation](https://docs.openstack.org/nova/latest/admin/pci-passthrough.html) (For GPU passthrough.)
- [MTU problems with Docker](https://mlohr.com/docker-mtu/)
- [Traefik](https://traefik.io/traefik/)
- [DiskImage-builder](https://github.com/openstack/diskimage-builder)
