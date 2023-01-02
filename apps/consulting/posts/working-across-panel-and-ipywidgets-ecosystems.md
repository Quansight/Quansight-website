---
title: 'Working Across Panel and ipywidgets Ecosystems'
published: December 18, 2020
author: pamela-wadhwa
description: 'This notebook is designed to help you learn how to make apps in Panel in about 15 minutes. Screenshots of cell outputs are included for convenience below, but it is strongly recommended that you use the interactive Binder version (takes 1-2 minutes to load) or by cloning the repo and running locally.'
category: [Training, Data Visualization, Jupyter]
featuredImage:
  src: /posts/working-across-panel-and-ipywidgets-ecosystems/panellogo4x3.png
  alt: 'Panel logo'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

_This notebook is designed to help you learn how to make apps in Panel in about
15 minutes. Screenshots of cell outputs are included for convenience below, but
it is **strongly** recommended that you use the
[interactive Binder version][demo binder] (takes 1-2 minutes to load) or 
clone the [repo][demo repo] to run the demo locally._

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

## Panel and ipywidgets demonstration

We'll show you an example in this notebook that uses widgets from ipywidgets within a Panel app. We are going to modify an example Panel app for exploring the autompg dataset (from the Panel website) by switching out the `Panel.ColorPicker` widget with the `ipywidgets.ColorPicker` widget. Just for fun, we'll also add in widgets from ipywidgets to change the size and shape of the markers in a scatter plot.

```python
import hvplot.pandas, panel, ipywidgets
from bokeh.sampledata.autompg import autompg
panel.extension()
```

`autompg` is a sample dataframe included with the Bokeh package. We can sample a few leading rows to see what the columns are.

```python
autompg.head()
```
![](/posts/working-across-panel-and-ipywidgets-ecosystems/ipywidgets-img-1.png)

## Widgets with Panel and hvPlot

The `hvplot` accessor enables simple ways to produce plots from the `autompg` dataframe. For instance, we can make a scatter plot using the `mpg` and `hp` features. We'll use the resulting plot as a template to develop a GUI for exploring the `autompg` dataset.

```python
autompg.hvplot.scatter('mpg','hp')
```

![](/posts/working-across-panel-and-ipywidgets-ecosystems/ipywidgets-img-2.png)

First, let's define a few Panel widgets to manipulate the preceding plot. The `Select` widgets `x_col` and `y_col` are drop-down menus to select numerical columns from the `autompg` dataframe for the horizontal and vertical axes of a scatter plot.

```python
# Define keyword argument 'options' for both Select widgets
cols = autompg.columns
opts = {'options': list(cols.drop(['origin', 'name']))}
print(opts)
```

{'options': ['mpg', 'cyl', 'displ', 'hp', 'weight', 'accel', 'yr']}

```python
# Define the relevant Panel widgets
x_col = Panel.widgets.Select(value='mpg', name='x', **opts)
y_col = Panel.widgets.Select(value='hp',  name='y', **opts)
```

## Widgets with ipywidgets
Next, let's define some widgets drawn from the ipywidgets library.

The first one, `color`, is used to choose the color of markers in the scatter plot.

```python
color = ipywidgets.widgets.ColorPicker(
    description='Pick a color',
    value='blue',
)
```

Next, the object, `size`, is instantiated as an `ipywidgets.IntSlider` for adjusting the marker size in the scatter plot.

```python
size = ipywidgets.IntSlider(
    value=7,
    min=0,
    max=50,
    step=1,
    description='Point size:',
    disabled=False,
    orientation='horizontal',
)
```

We can also create an object, `marker`, using `ipywidgets.Dropdown` to provide options for choosing different marker symbols in the scatter plot.

```python
marker = ipywidgets.Dropdown(
    options=list('*d^v><x'),
    value='*',
    description='Symbol:',
    disabled=False,
)
```

## Linking interactions in each ecosystem
We can now connect all the widget objects instantiated so far. In particular, the decorated function `autompg_plot` combines the Panel `Select` objects `x_col` and `y_col` together with the ipywidgets objects `color`, `size`, and `marker` to construct an explicit call to `autompg.hvplot.scatter`.

For context, the `Panel.depends` decorator wrapping `autompg_plot` produces a function that is revaluated whenever any of the specified widget objects (`x_col`, `y_col`, `color`, `size`, and `marker`) are changed by the user. As such, the resulting scatter plot is updated too.

```python
@panel.depends(x_col, y_col, color, size, marker)
def autompg_plot(x_col, y_col, color, size, marker):
    new_plot = autompg.hvplot.scatter(
        x_col, y_col, c=color,
        size=size, marker=marker
    )
    return new_plot
```

Finally, we can create a useful Panel app layout for the application. With the objects `Panel.Row` and `Panel.Column` nested as below, we will have a single row composed of a column of widgets on the left and the associated scatter plot on the right. More specifically, from top to bottom, the left-hand column has MarkDown text at the top, two drop-down menus beneath, then a color picker, a slider, and finally another drop-down menu at the bottom. Notice again that the Panel application combines widgets from both the ipywidgets and the Panel ecosystems.

```python
Panel.Row(
    Panel.Column(
        '## MPG Explorer', x_col, y_col,
        color, size, marker
    ), autompg_plot
)
```

![](/posts/working-across-panel-and-ipywidgets-ecosystems/ipywidgets-img-3.png)

## Conclusion

When building a Panel app or dashboard, embedding widgets from ipywidgets is just as simple as using Panel widgets only! This greatly broadens the number of widgets and different styling options available.

[demo binder]: https://mybinder.org/v2/gh/Quansight/panel-ipywidgets/HEAD
[demo repo]: https://github.com/Quansight/panel-ipywidgets
[ipywidgets docs]: https://ipywidgets.readthedocs.io/en/latest/
[panel site]: https://panel.holoviz.org/index.html
