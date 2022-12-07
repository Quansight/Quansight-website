---
title: 'Panel/Holoviews Learning Aid'
published: December 14, 2020
author: adam-lewis
description: 'This notebook is designed to help you learn how to make apps in Panel in about 15 minutes. Screenshots of cell outputs are included for convenience below, but it is strongly recommended that you use the interactive Binder version (takes 1-2 minutes to load) or by cloning the repo and running locally.'
category: [Training]
featuredImage:
  src: /posts/panel-holoviews-learning-aid/panelholoviewsblog.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

This notebook is designed to help you learn how to make apps in panel in about
15 minutes. Screenshots of cell outputs are included for convenience below, but
it is **strongly** recommended that you use the [interactive Binder version][demo binder]
(takes 1-2 minutes to load) or clone the [repo][demo repo] and run the demo locally.

---

## Building a Web App with Panel and Holoviews

```python
import panel as pn
import holoviews as hv

from mortgage_calculator.layout import layout as mortgage_app

pn.extension()
```

## Sample App

**Try out the app below. It's a mortgage calculator app allowing you to see your
mortgage payment, amortization schedule, and principal paid over time.**

Note: For the app below to work in JupyterLab, you'll need to run
`jupyter labextension install @pyviz/jupyterlab_pyviz` in the terminal to
install the needed labextension. This is not needed if running in a Jupyter
notebook outside of JupyterLab.

```python
mortgage_app
```

![](/posts/panel-holoviews-learning-aid/panelholo-img-1.png)

The app above was built with Python, and without directly writing any CSS or
Javascript. Panel and Holoviews are a great way for data scientist or others to
build a web app. This learning aid is designed to demonstrate some common usage,
and encourage you to build your own app from there.

## Learning Aid

[demo binder]: https://mybinder.org/v2/gh/Quansight/panel-learning-aid/master?filepath=learning_aid.ipynb
[demo repo]: https://github.com/Quansight/panel-learning-aid
