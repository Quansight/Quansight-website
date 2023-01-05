---
title: 'Building a Panel Pipeline'
published: May 14, 2021
author: pamela-wadhwa
description: 'Over a number of recent posts, we have given some examples of how to build dashboards using Panel and how to integrate widgets from Panel and ipywidgets into the same Panel app. These have all been one-stage examples, but you can actually use Panel to build a pipeline of stages with information carried over from one stage to the next. You can think of these stages as different pages on a website.'
category: [Data Visualization, Jupyter, Training]
featuredImage:
  src: /posts/building-a-panel-pipeline/panellogo4x3.png
  alt: 'Logo for the Panel project'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Data visualization of Paris city'
---

Over a number of recent posts, we have given some examples of
[how to build dashboards][qs panel dashboard post] using [Panel][panel site] and
[how to integrate widgets from Panel and ipywidgets][qs panel & ipywidgets post]
into the same Panel app. These have all been _one-stage_ examples, but you can
actually use Panel to build a
[_pipeline_ of stages][panel user guide: pipelines] with information carried
over from one stage to the next. You can think of these stages as different
pages on a website.

In this post, we present an example of a simple pipeline using Panel to
illustrate how easy it is to put in place.

## Instantiating the Pipeline

We start by importing Panel, then instantiating a Panel `Pipeline` object called `pipeline`. In this instance, we include the `inherit_params` parameter, setting it to `False`. If `inherit_params` is `True`, then parameters declared on consecutive stages are inherited. It will not matter in our simple example, but enabling inherited parameters across pipeline stages may be useful in some application contexts.

```python
import panel as pn

pn.extension()

pipeline = pn.pipeline.Pipeline(inherit_params=False)
```

## Building Stages

Next, we can add stages to the pipeline. To do so, we need to build the additional stages explicitly.

To construct a Panel pipeline, we need to create _parameterized classes_ (i.e., classes that inherit from the `param.Parameterized` class from the `Param` library). `Param` enables declarative programming in Python; that is, we can simply state facts about our parameters and then use them throughout our code. Within Panel apps, the `panel.depends` decorator function links parameter values to callback functions to update the state of the Panel app. In Panel pipelines, the `param.output` decorator function links computed values between successive stages. The parameters received at a given stage in a pipeline must be declared consistently to consume output from the previous stage.

In addition, we need a panel method in each stage of the pipeline to determine the layout of panes and widgets in the Panel app.

The class `Stage1` defined below displays a text input widget and a continue button. The text entered into `Stage1` is passed on to the next stage (`Stage2`). To do this, we define a string parameter `text` and an `output` method with the `param.output('text')` decorator. This indicates that `text` is the output of this stage.

Notice also that we include a boolean parameter ready to flag when the stage is complete and ready to proceed to the next stage. We will see how this is used later.

The `__init__` function instantiates each of the widgets we wish to use in the stage. Within the function, we instantiate a `TextInput` widget and a `continue_button`. The click of the `continue_button` is connected to a callback method `on_click_continue` defined within this class. Finally, the (variadic) keyword arguments `**params` are passed in as an input to enable passing keyword arguments between stages. The second stage will also need `**params` as an input to its `__init__` function to propagate those keyword arguments onward.

The `on_click_continue` function simply sets our `ready` attribute to `True`, which triggers the pipeline to move to the next stage.

Finally, the `panel` method is necessary to display this stage in the pipeline. Its main purpose is to return the layout of our page.

```python
import param

class Stage1(param.Parameterized):
    ready = param.Boolean(
        default=False,
        doc='trigger for moving to the next page',
    )

    text = param.String()

    def __init__(self, **params):
        super().__init__(**params)
        self.text_input = pn.widgets.TextInput(
            name='Text Input',
            placeholder='Enter a string here...'
        )
        self.continue_button = pn.widgets.Button(
            name='Continue',
            button_type='primary'
        )
        self.continue_button.on_click(self.on_click_continue)

    def on_click_continue(self, event):
        self.ready = True

    @param.output('text')
    def output(self):
        text = self.text_input.value
        return text

    def panel(self):
        return pn.Column(
            pn.WidgetBox(self.text_input, self.continue_button)
        )
```

The class `Stage2` is constructed to display a single line of static text (whatever text the user entered from `Stage1`). Notice we declare the attribute `text` as a `param.String` as before.

```python
class Stage2(param.Parameterized):
    text = param.String()

    def __init__(self, **params):
        super().__init__(**params)
        self.text_display = pn.widgets.StaticText(
            name='Previously, you typed ',
            value=self.text, font_size=20
        )

    def panel(self):
        return pn.Column(
            pn.WidgetBox(self.text_display, height=50),
        )
```

## Adding Stages to the Pipeline

Now that we have defined the classes `Stage1` and `Stage2`, we can insert instances of them into the `Pipeline` object `pipeline` instantiated above. To do so, we make two successive calls to the `add_stage` method of `pipeline`. The first call looks like this:

```python
pipeline.add_stage(
    name='Stage 1',
    stage=Stage1,
    ready_parameter='ready',
    auto_advance=True
)
```

The input arguments `name` and `stage` are mandatory. We chose the string identifier _'Stage 1'_ for `name` arbitrarily (but, of course, it makes sense to have it match the class `Stage1` passed into `stage`). We also make explicit reference to the attribute `ready` from the class `Stage1` in the `ready_parameter` argument. When adding a stage, we can specify the `ready_parameter` and set `auto_advance` to `True`; this makes the pipeline proceed to the next stage whenever the `ready_parameter` is triggered (which happens, for this class, when the callback method `on_click_continue` modifies the value of the attribute `ready`).

The next stage is added similarly:

```python
pipeline.add_stage(
    name='Stage 2',
    stage=Stage2,
)
```

After adding stages, we define the sequence of the stages by calling the `define_graph` method. The graph argument this method expects is a `dict` whose key-value pairs describe the adjacency relationships of successive stages in the pipeline (referenced by the strings _'String 1'_ and _'String 2'_ in this case).

```python
pipeline.define_graph(graph={'Stage 1': 'Stage 2'})
```

Finally, we wrap a Panel `Column` object around `pipeline.stage` to specify the layout of the pipeline. We bind the resulting object to the identifier `example_app`, and we also chain an invocation of the `servable` method to enable running `example_app` as a dashboard on a webserver using `panel serve`.

```python
example_app = pn.Column(pipeline.stage).servable()
```

## View the New Pipeline

Let's view our app and confirm it does what we expect:

```python
example_app
```

The first stage looks like this:

![](/posts/building-a-panel-pipeline/pipeline-img-1.png)

We can type in some sample text and click continue:

![](/posts/building-a-panel-pipeline/pipeline-img-2.png)

Our text will appear in stage 2:

![](/posts/building-a-panel-pipeline/pipeline-img-3.png)

This pipeline is about as simple as possible. The point here is to show how easy it is to put these pieces in place. We provide an example below that includes more complicated stages. We do everything just as above, but now, we insert different classes in place of `Stage1` and `Stage2`.

## A Pipeline with More Complicated Stages

We have built a custom two-stage Panel app for pre-processing NLP (Natural Language Processing) pipelines. Rather than showing the details of those two classes as above, we have stored them in separate Python files as modules. All we need to do is import those classes—`PreProcessor` and `Trainer`—and insert them into our pipeline as above.

```python
from app.api import PreProcessor   # Stage 1 
from app.test_train import Trainer # Stage 2
```

We construct the `Pipeline` object exactly as above. Instead of using strings like _'Stage 1'_ and _'Stage 2'_ to label the stages, we use more meaningful strings to describe the stages: _'Preprocess'_ and _'Training'_.

```python
import panel as pn

pn.extension()

pipeline = pn.pipeline.Pipeline(inherit_params=False)

pipeline.add_stage(
    name='Preprocess',
    stage=PreProcessor,
    ready_parameter='ready',
    auto_advance=True
)

pipeline.add_stage(
    name='Testing',
    stage=Trainer,
    ready_parameter='ready',
    auto_advance=True,
)

pipeline.define_graph(
    graph={'Preprocess': 'Testing'}
)

sentiment_app = pn.Column(pipeline.stage).servable()
```

And now we can view our new app:

```python
sentiment_app
```

The first stage consists of a page that includes several tabs. Each can be seen here:

![](/posts/building-a-panel-pipeline/pipeline-img-4.png)

![](/posts/building-a-panel-pipeline/pipeline-img-5.png)

![](/posts/building-a-panel-pipeline/pipeline-img-6.png)

![](/posts/building-a-panel-pipeline/pipeline-img-7.png)

![](/posts/building-a-panel-pipeline/pipeline-img-8.png)

After we select all the options available to us on the app, we click continue to reveal the _Train and Test_ page.

![](/posts/building-a-panel-pipeline/pipeline-img-9.png)

By clicking the _Train and Test_ button, the model is processed. We can then see the results of the model in the pane on the right-hand side.

![](/posts/building-a-panel-pipeline/pipeline-img-10.png)

## Final Thoughts

We hope this post on Panel Pipelines is enlightening. We can build more elaborate stages or pipelines with more than two stages. We can even have branching stages that depend on user input (e.g., clicking one button versus another button makes the pipeline proceed to different stages). It's quite flexible. We encourage you to try building a Panel pipeline app that can be useful in your work or daily life. Not only is it fun, but we think you'll find Panel makes it easy to put these stages into place!

For more information about getting started with Panel, check out the [Panel documentation][panel site] (and the section on [Panel Pipelines][panel user guide: pipelines]). There is an active [Panel community on Discourse][panel discourse site] as well.

[panel discourse site]: https://panel.holoviz.org/user_guide/Pipelines.html
[panel user guide: pipelines]: https://panel.holoviz.org/user_guide/Pipelines.html
[panel site]: https://panel.holoviz.org/
[qs panel & ipywidgets post]: https://www.quansight.com/post/working-across-panel-and-ipywidgets-ecosystems
[qs panel dashboard post]: https://www.quansight.com/post/quick-dashboarding-with-panel
