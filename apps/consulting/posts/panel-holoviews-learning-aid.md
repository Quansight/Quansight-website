---
title: 'Panel/Holoviews Learning Aid'
published: December 14, 2020
author: adam-lewis
description: 'This notebook is designed to help you learn how to make apps in Panel in about 15 minutes. Screenshots of cell outputs are included for convenience below, but it is strongly recommended that you use the interactive Binder version (takes 1-2 minutes to load) or by cloning the repo and running locally.'
category: [Training, Data Visualization, Jupyter]
featuredImage:
  src: /posts/panel-holoviews-learning-aid/panelholoviewsblog.png
  alt: ''
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

<base target="_blank" />

_This blog post is adapted from a notebook designed to help you learn how to
make apps in panel in about 15 minutes. Screenshots of cell outputs are included
for convenience below, but it is **strongly** recommended that you use the
[interactive Binder version][demo binder] (takes 1-2 minutes to load) or clone
the [repo][demo repo] and run the demo locally._

---

## Building a Web App With Panel and Holoviews

```python
import panel as pn
import holoviews as hv

from mortgage_calculator.layout import layout as mortgage_app

pn.extension()
```

### Sample App

**Try out the app below. It's a mortgage calculator app allowing you to see your
mortgage payment, amortization schedule, and principal paid over time.**

_Note: For the app below to work in JupyterLab, you'll need to run
`jupyter labextension install @pyviz/jupyterlab_pyviz` in the terminal to
install the needed Labs extension. This is not needed if running in a Jupyter
notebook outside of JupyterLab._

```python
mortgage_app
```

![](/posts/panel-holoviews-learning-aid/panelholo-img-1.png)

The app above was built with Python, and without directly writing any CSS or
Javascript. Panel and Holoviews are a great way for data scientists or others to
build a web app. This learning aid is designed to demonstrate some common usage,
and encourage you to build your own app from there.

## Learning Aid

Several sections follow below demonstrating key knowledge used to build the app above.

1. Background
2. Building the App Backbone
3. HoloViews Plots
4. Closing Notes

### 1. Background

#### Prototyping in Jupyter

Panel and Holoviews are nice because they integrate well with Jupyter notebooks
and Jupyterlab. You can build your app and display it interactively in
Jupyterlab to speed up development. For this to work however, make sure to:

1. If running in JupyterLab, run
   `jupyter labextension install @pyviz/jupyterlab_pyviz` in the terminal to
   install the needed labextension if you didn't above. This is not needed if
   running in a Jupyter notebook outside of JupyterLab.
2. Run `import panel as pn` and `pn.extension()` at the top of the notebook.

After doing so, you should be all set to prototype the app within JupyterLab.

#### Panel Basics

Panel has 3 main components: panes, widgets, and panels.

- **Panes** wrap external viewable items, like markdown, plots, gifs, and even
  video.
- **Widgets** are used to manipulate your app - think sliders, file selectors,
  password inputs, etc.
- **Panels** are used to arrange panes and widgets. The 4 main types of panels
  are `Row`, `Column`, `Tabs`, and `GridSpec`.

Take a look at more examples of panes, widgets, and panels (layouts) at the
[Panel Reference Gallery][panel gallery]. You can also learn about what
parameters each widget supports by clicking on a particular widget from there.

### 2. Building the App Backbone

First, let's make a widget by running the code below.

```python
radio_button = pn.widgets.RadioButtonGroup(
    options=["a", "b", "c"], value="a", name="radio_buttons"
)
radio_button
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-2.png"
width="400px"
/>

When choosing a widget for your app, try to choose a widget made for the
applicable datatype (`string`, `float`, `int`, `set`, etc.). This will greatly
reduce the amount of custom input validation you'll need to do. Also notice that
you can manipulate widgets in the UI or in code.

```python
radio_button.value = "b"
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-3.png"
width="400px"
/>

#### Making a Sample Layout

We combine a widget and some markdown panes with a `Column` panel in the next cell.

```python
# Markdown Pane
radio_button_display = pn.pane.Markdown(f"Radio Button Value: {radio_button.value}")

# Combine Panes and Widget in the Column panel
layout = pn.Column("## My Radio Button App", radio_button, radio_button_display)
layout
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-4.png"
width="400px"
/>

You'll notice the display doesn't update when a different radio button is
pressed. To update we need to make a function to call when a specific widget's
value is modified.

_Note: Panel has four different API's. This learning aid uses the callback API,
which is the lowest level of the four and gives the most control._

```python
# Defines the function to call when Radio Box is updated.
def update(event):
    if event.obj is radio_button:
        radio_button_display.object = f"Radio Button Value: {radio_button.value}"


# Run the update function when the "value" parameter of radio_button widget changes.
radio_button.param.watch(update, "value")

# Now the display updates when the button is pressed.
layout
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-5.png"
width="400px"
/>

_Be careful about running the above cell multiple times. Doing so will attach
multiple function callbacks to the radio button, and the app may not behave as
expected. Restarting the kernel and rerunning the cells will fix this._

You may be wondering why the `if` statement in the update function is needed. In
this simple example, it's not. However, as we add more widgets I've found it's
nice to have a single update function for all widgets in order to more precisely
specify the order in which pane updates need to happen as well as share
intermediate results computed during the update function.

### 3. Holoviews Plots

The app above could serve as the start of many, many apps, but how exactly do we
update plots based on widgets instead of just some text? It's pretty simple, we
just replace the Markdown pane with a HoloViews pane. The Panel HoloViews pane
is a wrapper around Holoviews plots. Other plotting libraries (matplotlib,
plotly, etc.) are supported as well, but I'll be demonstrating with Holoviews
plots.

```python
# Define some sample data and import holoviews
from bokeh.sampledata.autompg import autompg
import holoviews as hv

# show data sample
autompg.sample(2)
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-6.png"
width="650px"
/>

A complete tutorial of plotting in Holoviews is beyond the scope of this
learning aid. For this example, just know that
`hv.Scatter(dataframe, kdims="x_column", vdims="y_column")` will produce a
scatter plot. The [HoloViews documentation][holoviews documentation] can be
consulted for additional specifics.

```python
hv.Scatter(data=autompg, kdims="mpg", vdims="weight").opts(
    tools=["hover"], size=6, title="Example Scatter Plot"
)
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-7.png"
width="550px"
/>

Let's make an app which toggles the axes of the plot. First we'll make the radio
buttons to toggle the axis.

```python
radio_opts = [col for col in autompg.columns if col not in {"origin", "name"}]
auto_mpg_radio_x = pn.widgets.RadioButtonGroup(options=radio_opts, value="mpg")
auto_mpg_radio_y = pn.widgets.RadioButtonGroup(options=radio_opts, value="mpg")
auto_mpg_radio_x
```

<img
src="/posts/panel-holoviews-learning-aid/panelholo-img-8.png"
width="550px"
/>

Now let's set up the layout of the plot.

```python
auto_plot = pn.pane.HoloViews(
    object=None, sizing_mode="stretch_width"
)  # empty plot initially

layout = pn.Column(
    "## Auto MPG App",
    pn.Row("#### x-axis:", auto_mpg_radio_x),
    pn.Row("#### y-axis:", auto_mpg_radio_y),
    auto_plot,
    sizing_mode="stretch_width",
)
```

Next, let's configure the plot to update when the widget values are changed.

```python
def autompg_plot(x_axis, y_axis):
    return hv.Scatter(data=autompg, kdims=x_axis, vdims=y_axis).opts(
        tools=["hover"], size=6, max_width=750
    )


def auto_mpg_update(event):
    if event.obj is auto_mpg_radio_x:
        auto_plot.object = autompg_plot(auto_mpg_radio_x.value, auto_mpg_radio_y.value)
    if event.obj is auto_mpg_radio_y:
        auto_plot.object = autompg_plot(auto_mpg_radio_x.value, auto_mpg_radio_y.value)


# Run the update function when the "value" parameter of radio_button widget changes.
for widget in [auto_mpg_radio_x, auto_mpg_radio_y]:
    widget.param.watch(auto_mpg_update, "value")
# trigger initial plot update
auto_mpg_radio_y.value = "cyl"

layout
```

![](/posts/panel-holoviews-learning-aid/panelholo-img-9.png)

_Be careful about running the above cell multiple times. Doing so will attach
multiple function callbacks to the radio button, and the app may not behave as
expected. Restarting the kernel and rerunning the cells will fix this._

### 4. Closing Notes

After you build an app, you'll want to deploy the app so others can view it.
Deployment is beyond the scope of this learning aid, but the
[Panel server deployment documentation][panel server docs] covers a variety of
deployment scenarios. MyBinder is useful for apps that are for demonstration
purposes only. If you want to see how your app would look deployed by itself,
then you can run `app.show()` in the notebook, and a new browser tab will open
up with the app served on it. Run the cell below to see it in action.

```python
layout.show()  # You won't be able to view this from binder, but will be able to if running locally.
```

Now that you have a simple app to start from, keep going and build your own!

If you liked this article, check out this Panel article on <a
href="/post/working-across-panel-and-ipywidgets-ecosystems"
target="_self">Working Across Panel and ipywidgets Ecosystems</a>!

[demo binder]: https://mybinder.org/v2/gh/Quansight/panel-learning-aid/master?filepath=learning_aid.ipynb
[demo repo]: https://github.com/Quansight/panel-learning-aid
[holoviews documentation]: https://holoviews.org/getting_started/Introduction.html
[panel gallery]: https://panel.holoviz.org/reference/index.html
[panel server docs]: https://panel.holoviz.org/user_guide/Server_Deployment.html
