---
title: 'Traitlets - an introduction & use in Jupyter configuration management'
published: August 30, 2020
author: matthias-bussonnier
description: 'You have probably seen Traitlets in applications, you likely even use it.
The package has nearly 5 million downloads on conda-forge alone. But, what is Traitlets?
In this post we'll answer this question along with where Traitlets came from,
its applications, and a bit of history.'
category: [PyData Ecosystem]
featuredImage:
  src: /posts/but-what-are-traitlets/feature.png
  alt: 'A code snippet demonstrating the flexibility of Traitlet.'
hero:
  imageSrc: /posts/but-what-are-traitlets/blog_hero_var2.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone'

---

You have probably seen Traitlets in applications, you likely even use it. The package has nearly 5 million downloads
on [conda-forge](https://anaconda.org/conda-forge/traitlets) alone.

# But, what is Traitlets ?

In this post we'll answer this question along with where Traitlets came from, its applications, and a bit of history.

## `traitlets` 5.0

`traitlets` 5.0 has recently been released; 5 years after the earliest versions of
`traitlets` 4.0. The latest and greatest 5.0 release brings
new features and a cleaner codebase while maintaining backward compatibility with 4.0.
This is a big upgrade to our interactive computing tools because Traitlets is used everywhere in Jupyter/IPython - for configuration, runtime type checking, widgets, and CLI parsing.

Traitlets is [a library](https://pypi.org/project/traitlets) that provides objects that
can expose individual configuration options in an intelligent way. They are used in almost all the Jupyter Projects.

Traitlets began as a pure Python implementation of the Enthought [Traits](https://pypi.org/project/traits/) library.
These libraries implement the object-oriented [trait pattern](https://en.wikipedia.org/wiki/Trait_(computer_programming)). Prior to 2015, `traitlets` was a part of the IPython (pre-jupyter) code base; then during ["The Big
Split"](https://blog.jupyter.org/the-big-split-9d7b88a031a7) it was moved to their own reusable package.

Both `traitlets` and `traits` addressed the challenge of using typed code in interactive Python [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop "read-eval-print-loop")s. They offer type checking, coercion and validation at run time.

### Traitlets for development

The general idea when developing with Traitlets is:

1. The developer defines a class-level attribute,

2. This class level attribute will automatically be converted into
    *a property-like* element with *runtime type and value checking*, *configurability* and
    *observable events and changes*.

Traitlets minimizes boilerplate for Python applications. Traitlets maintains a uniform
naming convention and helps your users configure their applications.

## A Traitlets usage example

We'll demonstrate the flexibility of Traitlets by configuring the `autocall`
traitlet/option of IPython from the command line interface, configuration
file, as well as observe effect of dynamically changing values.
Below is an excerpt of the [`IPython` main class](https://github.com/ipython/ipython/blob/aa2b54815c55c2f229de8c57e20a757d1b27ffd7/IPython/core/interactiveshell.py#L338-L359) that defines
IPython's `autocall` traitlet.

```python
from traitlets import SingletonConfigurable, Enum

class InteractiveShell(SingletonConfigurable):

    ...

    autocall = Enum((0,1,2), default_value=0, help=
        """
        Make IPython automatically call any callable object even if you didn't
        type explicit parentheses. For example, 'str 43' becomes 'str(43)'
        automatically. The value can be '0' to disable the feature, '1' for
        'smart' autocall, where it is not applied if there are no more
        arguments on the line, and '2' for 'full' autocall, where all callable
        objects are automatically called (even if no arguments are present).
        """
    ).tag(config=True)

    ...
```

Here, the `autocall` class attribute will be converted at instantiation to an
instance `property`, in particular an `Enum` whose values are ensured to be
either `0`,`1`, or `2`. Traitlets provides a number of utilities to decide
whether assigning incorrect values should raise an exception; or coerce to one
of the valid ones. Here a wrong assignment will fail:


```
$ ipython --no-banner

In [1]: ip = get_ipython()

In [2]: ip.autocall
Out[2]: 0

In [3]: ip.autocall = 5
...
TraitError: The 'autocall' trait of a TerminalInteractiveShell instance expected any of [0, 1, 2], not the int 5.
```


While type – and value – checking at runtime is a nice feature, most of these
options are usually user preferences. Traitlets provides a way to automatically
create configuration files with help, as well as command line arguments
parsing. The `autocall` traitlet has `help=` and `default_value`
strings that are tagged with `config=True`. This informs the current
application on how to automatically generate configuration files, decide on
the option name and document it. No need for the developer to spend time on
deciding on a configuration parameter name.


### A generated configuration file.

On a brand new machine with IPython installed you will find the following in
your default configuration file `~/.ipython/profile_default/ipython_config.py`,
referring to our `autocall` traitlet of previous section:

```python
...
## Make IPython automatically call any callable object even if you didn't type
#  explicit parentheses. For example, 'str 43' becomes 'str(43)' automatically.
#  The value can be '0' to disable the feature, '1' for 'smart' autocall, where
#  it is not applied if there are no more arguments on the line, and '2' for
#  'full' autocall, where all callable objects are automatically called (even if
#  no arguments are present).
#c.InteractiveShell.autocall = 0
...
```

You will recognize there the help string provided before, as well as the default
value.

If you update this file by uncommenting the last line and changing the value,
as you would expect, new instances of `InteractiveShell` will be instantiated
with this new default value.

Alternatively, Traitlets can also generate and parse command line arguments, so
`ipython --InteractiveShell.autocall=3` will take precedence over
configuration files and start IPython with this new option:

```
$ ipython --no-banner --InteractiveShell.autocall=2

In [1]: get_ipython().autocall
Out[1]: 2
```

It will display the same help if you try `ipython --help-all`:

```text
$ ipython --help-all
...
--InteractiveShell.autocall=<Enum>
    Make IPython automatically call any callable object even if you didn't type
    explicit parentheses. For example, 'str 43' becomes 'str(43)' automatically.
    The value can be '0' to disable the feature, '1' for 'smart' autocall, where
    it is not applied if there are no more arguments on the line, and '2' for
    'full' autocall, where all callable objects are automatically called (even
    if no arguments are present).
    Choices: any of [0, 1, 2]
    Default: 0
```

Adding a configuration option is thus a breeze, for example IPython can
reformat your code with [Black](https://github.com/psf/black) since [this pull
request](https://github.com/ipython/ipython/pull/11734/files). Beyond the logic
to actually do the reformatting, the complete diff to add the options to the CLI,
configuration file, and [automatic generation](https://github.com/ipython/traitlets/blob/3293530b6943b9522ae570e7ca29b30709a43567/traitlets/config/sphinxdoc.py#L1-L33) of [the option documentation](https://ipython.readthedocs.io/en/7.18.0/config/options/terminal.html#configtrait-TerminalInteractiveShell.autoformatter) in Sphinx
documentation is as follows:


```diff
@IPython/terminal/interactiveshell.py:98
Class TerminalInteractiveShell(InteractiveShell)
.snip ...
+     autoformatter = Unicode(None,
+        help="Autoformatter to reformat code.",
+        allow_none=True
+    ).tag(config=True)
```

If you have an application or library which potentially has a really large
number of configuration knobs and you want to isolate changes:
Traitlets can help you expose all of those cleanly to a user, without having to
think about the option name or writing the logic to set a default value.

Unlike many other libraries likes argparse or click, the listing of
configuration options is decentralized and lives on the object being
configured. And there is no differences between adding a configuration option
in the configuration file or at the command line interface.

# Configure what you do not yet know about

In an application with few parameters and only a couple of plugins it might be
relatively straightforward to provide options and CLI arguments; this becomes
harder when arbitrary plugins are involved and those plugins have arbitrary
configuration options you may or may not know about at startup time.

One good example is JupyterHub. JupyterHub has various plugins, one category of
which is Spawners. Spawners decide how notebook servers are started. You can
[use a custom spawner](https://jupyterhub.readthedocs.io/en/stable/reference/spawners.html#writing-a-custom-spawner),
and many institutions employ only minimal changes to the default Spawner to
accommodate their use case. A few of the common Spawners are `SystemDSpawner`,
`SlurmSpawner`, and `KubeSpawner`, each with their own parameters.

It is critical to make it as simple as possible to provide configuration
options and make them available from Jupyter Configuration files and from the
command line.

Using a custom Spawner is simple:

```python
c.JupyterHub.spawner_class = 'mypackage:MySpawner'
```

and Traitlets allows you to also arbitrarily configure `MySpawner` with

```python
c.MySpawner.mem_limit = '200G'
```

Traitlets is aware of class hierarchy, thus when `MySpawner` inherits from the
default Spawner, all `c.Spawner...` options will affect `MySpawner`, but
`c.MySpawner...` options will of course only affect `MySpawner`.

It is thus also easy to configure siblings differently; a good example is Terminal
IPython vs IPykernel (used in notebooks and lab). Both applications are subclasses
of `InteractiveShell`, namely `ZMQInteractiveShell` and `TerminalInteractiveShell`.

I can configure both with `c.InteractiveShell.attribute=`, or decide that only
terminal IPython will be affected via `c.TerminalInteractiveShell.attribute=`, I can also
target only notebook-like interfaces with `c.ZMQInteractiveShell.attribute=`;

On my own machine for example, `%matplotlib` is setup to be `inline` only for
kernels and not terminal.

Thus if you have an application or library with a number of plugins, and for
which configurability can be thought of as tree-like similar to a class
hierarchy, Traitlets can help you.


# Other functionalities

## Observability

Beyond the configurability part is observability; as we already had a great
type system with hooks, and sometimes you may want to mutate configuration of
a running application, traitlets allow you to observe values and propagate
them to other places.

To look at the above example with code reformatting, the reformatter can be
changed dynamically to a different one with the following:

```python

Class TerminalInteractiveShell(InteractiveShell)
...

    @observe('autoformatter')
    def _autoformatter_changed(self, change):
        formatter = change.new
        if formatter is None:
            self.reformat_handler = lambda x:x
        elif formatter == 'black':
            self.reformat_handler = black_reformat_handler
        else:
            raise ValueError
```

Observability is also what powers
[ipywidgets](https://ipywidgets.readthedocs.io/en/latest/examples/Widget%20Events.html?highlight=link#Linking-Widgets);
it allows dynamic binding of sliders, buttons and other controls to
visualisations.

This can be useful to glue together models, with parameters needing to be
synchronized and models needing to react to changes.


## Dynamic defaults

Traitlets supports [dynamic defaults](https://traitlets.readthedocs.io/en/stable/api.html#dynamic-default-values),
i.e. your default values may depend on some context (OS, Python version).

Configurations are by default Python scripts (but can be JSON), so user
config files can be shared across machines and have dynamic values.


## Context base configuration

Object configuration can also look at the creator of the object at instantiation
time.

```python
c.Foo.Bar.attr = 1
c.Qux.Bar.attr = 2
```

With the above, the `Bar` object created by `Foo` or by `Qux` will get different
default values. This is for example used by [nbconvert](https://github.com/jupyter/nbconvert)
to decide which options to activate depending on whether you do `--to=pdf`,
or `--to-html`

## Flags and aliases

Long flag names like `--InteractiveShell.debug=True` can be cumbersome to type.
That is why traitlets provide aliases and flags, so that `ipython --debug` will
set `debug=True` to enable logging on all classes supporting it while still
allowing you to tweak the login level used on a per-class basis.

# Limitations

Of course all this power doesn't come completely for free:

 - Your class and attribute names become part of your API
 - As configuration is loaded/read before any potential plugins are loaded, it is
   impossible to definitively detect typos or invalid configuration options.
 - Traitlets relies heavily on metaclasses, so it can add a construction cost to
   your objects and can be hard to debug.

# Conclusion

This was a short introduction to Traitlets. I hope it made it a little clearer
how the Jupyter configuration system works, and we are looking forward to see
how this can be used to adapt Jupyter to your work flow.

Are you struggling with a system that has too many configuration options? Do
you have a use case where you believe Traitlets can be useful? We'll be happy
to hear from you.

If you want to learn more, see [this JupyterCon 2018
talk](https://www.youtube.com/watch?v=_gYEVTaNuKU) and the [documentation](https://traitlets.readthedocs.io/).

Try the new 5.x version and let us know if you have questions.















