---
title: 'Working Across Panel and ipywidgets Ecosystems'
published: December 18, 2020
author: pamela-wadhwa
description: 'This notebook is designed to help you learn how to make apps in Panel in about 15 minutes. Screenshots of cell outputs are included for convenience below, but it is strongly recommended that you use the interactive Binder version (takes 1-2 minutes to load) or by cloning the repo and running locally.'
category: [Training]
featuredImage:
  src: /posts/working-across-panel-and-ipywidgets-ecosystems/panellogo4x3.png
  alt: 'Panel logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

This notebook is designed to help you learn how to make apps in Panel in about
15 minutes. Screenshots of cell outputs are included for convenience below, but
it is **strongly** recommended that you use the
[interactive Binder version][demo binder] (takes 1-2 minutes to load) or 
clone the [repo][demo repo] to run the demo locally.

---

[Panel][panel site] is a open-source Python library that makes it easy to build
interactive web apps and dashboards with flexible user-defined widgets. The
Panel library makes a broad range of widgets available. However, did you know
that you can also use widgets from the [ipywidgets][ipywidgets docs] library
with Panel seamlessly?

## What Are Widgets?

For our purposes, a widget is a component of a graphical user interface (GUI)
that enables easy interaction with the application (e.g., a drop-down menu for
selecting from a set of items or a slider for specifying a numeric value). Until
recently, GUI authors had to choose between strictly using Panel or strictly
using ipywidgets because each ecosystem had distinct widget patterns;
fortunately, that is no longer the case. The union of these ecosystems opens up
enormous possibilities for designing flexible GUIs (both in notebooks and in web
applications).

[demo binder]: https://mybinder.org/v2/gh/Quansight/panel-ipywidgets/HEAD
[demo repo]: https://github.com/Quansight/panel-ipywidgets
[ipywidgets docs]: https://ipywidgets.readthedocs.io/en/latest/
[panel site]: https://panel.holoviz.org/index.html
