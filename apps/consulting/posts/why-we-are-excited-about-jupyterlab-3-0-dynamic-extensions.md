---
title: 'Why We Are Excited About JupyterLab 3.0 Dynamic Extensions!'
published: October 19, 2020
author: tony-fast
description: >
  At Quansight, we’ve been hosting a series of live streams that feature our talented open source developers talking about the software they contribute to and the communities around them. During a recent quirkshop our incredible JupyterLab developers got together to discuss the upcoming major version changes to JupyterLab. We discussed the toil that core developers are investing to improve the experience of JupyterLab not only for developers but for users as well.
category: [Jupyter, Open Source Software]
featuredImage:
  src: /posts/why-we-are-excited-about-jupyterlab-3-0-dynamic-extensions/lab_logo_tng.png
  alt: 'JupyterLab logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

**Co-authors:** Gonzalo Peña-Castellanos, Eric Charles, Eric Kelly

**At [Quansight][quansight site], we’ve been hosting a series of live streams
that feature our talented open source developers talking about the software they
contribute to and the communities around them. During a recent quirkshop our
incredible JupyterLab developers got together to discuss the upcoming major
version changes to [JupyterLab][jupyterlab docs]. We discussed the toil that
core developers are investing to improve the experience of JupyterLab not only
for developers but for users as well.**

See the [video of this quirkshop][quirkshop video].

The extension system is a central concept to JupyterLab; all of the features
(e.g., notebook editor, file browser, menus, and status bar elements) are
extensions that interface into the greater JupyterLab ecosystem. The core
extensions that ship with JupyterLab that establish the baseline JupyterLab
interface. Third-party community extensions can then be installed to enhance and
augment the user experience. This model allows for development to happen inside
the tool itself, and co-development to happen by the surrounding ecosystem.

Very soon, JupyterLab will be achieving a major milestone by upgrading from
version 2 to 3. The next few sections will highlight the impacts of this upgrade
from individual and organizational perspectives.

## JupyterLab Extensions Ecosystem

JupyterLab version 2 was a landmark in the interactive computing development phase. During its time, the extensions ecosystem flourished. There are now extensions for interacting with big data (e.g., [Dask][dask], [HoloViz][holoviz]), collaborating with others (e.g., [jupyter-videochat][jupyterlab videochat]), and [customizing styling][customizing styling]. These connections are possible only because JupyterLab connected modern, performant JavaScript with scientific computing interfaces that improved users’ abilities to communicate and collaborate. The development during this phase proved the extensibility of JupyterLab and its ability to serve as a foundation for creating custom interactive computing interfaces; this foundation allows it to fit the needs of different users, disciplines, and workflows.

Version 3 upgrades will save y’all’s and organization’s time and improve the quality of collaborative work.

## User impacts of version 3

As long-time Jupyter super users, the new changes to distributing JupyterLab extensions are particularly exciting. Currently, JupyterLab users are required to have a Node.js run-time in their environment in order to build and install JupyterLab extensions (written in TypeScript/JavaScript and providing different assets). This had to be performed every time a new extension was installed! In JupyterLab 3, an extension developer will package the JavaScript or CSS and ship that through PyPI with the prebuilt codes. This improvement applies broadly to the JupyterLab ecosystem because all of the components are extensions!

In JupyterLab 3, users will experience reduced installation times, and Python users will rely on a familiar installation pattern by using [pip][pip url].

## A familiar toolchain for Python

At some point, the Jupyter Python community got very wrapped up in JavaScript development. They said the browser was the future! This meant that already complicated installation and packaging issues became more complicated. A common problem in JupyterLab versions 1 and 2 was handling extensions. Users would have to install these packages from combinations of [npm][npm] and [PyPI][pypi] packages. Fortunately, we have [Conda][conda] to help with some of these concerns; but users still need [Node.js][nodejs] and [Python][python] environments to reap the benefits.



In JupyterLab 3, all of the packaging will be orchestrated by using pip, relying on PyPI alone. So, how did this come to be? Well, this could not have been achieved without advancements in [WebPack][webpack] version 5, the JavaScript library in charge of “bundling JavaScript files for usage in a browser” and the new [module federation][module federation] functionality. This functionality allows for a [JavaScript application][js app] to ship and load JavaScript modules on demand without having to pack it in the initial application bundle (a different Webpack build). This means we can now dynamically load extensions without the need for a build. This also means the possibility of using pip and PyPI packages to bundle the assets and place them in the right place for JupyterLab to load extensions. Since server-side extensions already depend on using Python, it was only natural to extend the use to also bundle the frontend extension assets.

Python users, those typically using IPython or [xeus-python][xeus] kernels, will only need a Python run-time to install packages!

## But what about my npm packages?

So, if you are an extension developer and already published npm packages, do you need to change things? Well, it depends. The previous method for installing npm packages will still work. And if you provide an extension that can be extended then you still need to provide an npm package.

If your extension does not provide extension points, the new JupyterLab version provides additional benefits, including faster installs and a single distribution point, namely as PyPI packages for users. Managing the publication of both npm and PyPI packages can be achieved with ease using Github Actions and Continuous Integration, but more on that in another post!

The fact that now JupyterLab can load different Webpack applications (JupyterLab Extensions), also opens the door for serving (frontend) extensions on Content Delivery Networks (CDNs) or your own private servers, so that installing an extension would effectively become as easy as enabling or disabling the fetching of assets from a given CDN!

If you are using Conda, then the extension installation process will also be simplified, as pip packages can be turned into Conda packages with ease.

## A reason to learn TypeScript

We’re primarily Python programmers who are also comfortable with distributing packages. We get excited about designing experiences in JupyterLab, but versions 1 and 2 required us to understand a new build system, npm, and Node.js. That became a chore and sapped motivation. Because of the changes in JupyterLab 3 we’re excited and happy to learn the necessary TypeScript and continue generating more user-facing applications. We can now use our more familiar PyPI workflows to distribute the finished work.

## Faster more compact Binders

[MyBinder][mybinder] is a critical service to the Jupyter community. It provides on-demand, interactive Jupyter experiences from GitHub repositories. There are a number of ways to define environments using Python, R, Conda, or Docker by using different configuration files. Conda has been, for some time, the most reliable system for installing JupyterLab extensions on MyBinder. But extensions have required a [postbuild][postbuild] step to include extensions in a binder, thereby increasing build and deploy times.

The version 3 changes in packaging now mean that a lot of deployment complexity is reduced. The fastest way to build and deploy a binder is to use pip rather than Conda. In JupyterLab version 3, it will be possible to install a novel JupyterLab experience on binder purely through pip (if all of the packages are available on the Python packaging index or on available VCS installations). It will reduce binder configuration complexity and accelerate testing of binder experiences; less time between binder deploys allows architects, users, and developers to iterate quicker.

## Time matters

Ultimately, the transition from JupyterLab 2 to 3 will improve organizational efficiencies. These upgrades are going to drastically reduce installation times and improve access for scientific Python developers. Users should find themselves being more productive with less downtime and improved interactive computing tools. In an organization that uses JupyterLab broadly, the compounding effects of the time savings will ultimately result in better communication through data and code.

## Closing remarks

In this post we wanted to highlight one of the features that in our opinion will drastically improve the user experience, however, there are other features coming with JupyterLab 3 including:
- Internationalization.
- Debugging.
- Single document mode, aka classic notebook mode.
- Table of contents for Notebooks.
- File browser filtering.

And many more! Please check the [changelog][changelog] and stay tuned for more information.

JupyterLab users will benefit greatly from the blood, sweat, and tears of the development team. Those of us at [Quansight][quansight site] would really like to thank the team for all their hard work and thoughtfulness.

Want more Jupyter? QHub is a new project from Quansight, read more about it in the [Quansight blog][qhub post].

[jupyterlab docs]: https://jupyterlab.readthedocs.io/
[quansight site]: https://quansight.com
[quirkshop video]: https://youtu.be/k8yKcPPO0Gs
[dask]: https://docs.dask.org/
[holoviz]: https://holoviz.org/
[jupyterlab videochat]: https://github.com/yuvipanda/jupyter-videochat
[cusomizing styling]: https://github.com/mauhai/awesome-jupyterlab#themes
[pip]: https://pip.pypa.io/
[npm]: https://www.npmjs.com/
[pypi]: https://pypi.org/
[conda]: https://docs.conda.io/en/latest/
[nodejs]: https://nodejs.org/
[python]: https://www.python.org/
[webpack]: https://webpack.js.org/
[module federation]: https://webpack.js.org/concepts/module-federation/
[js app]: https://dev.to/brandonvilla21/micro-frontends-module-federation-with-webpack-5-426
[xeus]: https://xeus-python.readthedocs.io/
[mybinder]: https://mybinder.org/
[postbuild]: https://www.npmjs.com/package/postbuild
[changelog]: https://jupyterlab.readthedocs.io/en/latest/getting_started/changelog.html#v3-0
[qhub post]: https://www.quansight.com/post/announcing-qhub
