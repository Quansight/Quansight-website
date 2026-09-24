---
title: 'Introducing sphinx-benchmark: Why are my Sphinx docs builds taking so long?!'
authors: [aditi-juneja]
published: September 24, 2026
description: 'Introducing sphinx-benchmark: a Sphinx extension that breaks a documentation build down by event, handler, gap, function and call trees, so you can see which extension, theme, or part of the Sphinx build is slowing your docs down.'
category: [Developer workflows, Documentation, Internship, OSS Experience]
featuredImage:
  src: /posts/sphinx-benchmark/1_overview_page.png
  alt: 'Pie chart from the sphinx-benchmark HTML report showing how the time of a docs build is split between Sphinx events and the gaps between them'
hero:
  imageSrc: /posts/sphinx-benchmark/1_overview_page.png
  imageAlt: 'Pie chart from the sphinx-benchmark HTML report showing how the time of a docs build is split between Sphinx events and the gaps between them'
---

If you maintain a Scientific Python project, your documentation is probably built with [Sphinx](https://www.sphinx-doc.org/). NumPy, SciPy, Matplotlib, pandas, CPython and many others use it, and on a big project a full docs build takes anywhere from a few minutes to sometimes hours. That build runs on every pull request, every commit-- and across the ecosystem, all those repeated minutes of CI add up to real compute and energy. On [Sphinx's PyPI stats](https://pypistats.org/packages/sphinx) you can see that Sphinx gets installed more than 4 million times per week and most of those installations happen via CI docs runs. Yet when someone asks "why are my Sphinx docs builds taking so long?", at best, they get an educated guess. Until recently, there was no benchmarking suite or profiling setup, so most performance discussions relied on these educated guesses. But before anyone could make builds faster, we needed a tool that could replace this guessing.

Hi! I'm Aditi Juneja ([@Schefflera-Arboricola](https://github.com/Schefflera-Arboricola)), and I (mentored by [Melissa Weber Mendonça](https://github.com/melissawm) and [Agriya Khetarpal](https://github.com/agriyakhetarpal)) spent the last few months turning that educated guess into a concrete benchmarking report. The final result is [sphinx-benchmark](https://github.com/Schefflera-Arboricola/sphinx-benchmark), a Sphinx extension that tells you where the time in a docs build goes: which function, in which extension or theme or module. Spoiler alert: a few weeks after its first release, [@Cadair](https://github.com/Cadair) (a SunPy and Astropy maintainer) used it and was able to cut their docs build from 317 seconds to 190 seconds, i.e. 67% faster or ~40% shorter build!

This post covers how to use the sphinx-benchmark extension, what it measures, and a little bit about the development process and my internship experience, what's still missing, and what's next! So, hopefully there's something for everyone :)


## A little demo: sphinx-benchmark

1. Install it from [PyPI](https://pypi.org/project/sphinx-benchmark/) (`pip install sphinx-benchmark`). 
2. Add it to your `conf.py`, ideally first in the list so it starts timing as early as possible (`extensions = ["sphinx_benchmark", ...]`). 
3. Then build your docs as usual. When the build finishes, you get a `sphinx_benchmarks_<date>-<time>_<commit>.json` file in your docs directory (i.e. where the `conf.py` file lives). 
4. Run `sphinx-benchmark run html`, and a full HTML benchmark report in `./sphinx_benchmark_report/` will be created! 
5. Open `./sphinx_benchmark_report/index.html` and explore!

To make sense of the data in the benchmarking report you mainly need two Sphinx ideas, and that's about all the Sphinx internals this post needs, I think. (Side note: you can also try putting all the generated benchmarking output files into your AI model and letting it do all the work and point out possible optimisations.)

## Events, handlers and gaps

As Sphinx builds your docs, it announces what it's doing at fixed points: "the config is loaded", "this page has been read", "this page is about to be written", and so on. These announcements/notifications are called [events](https://www.sphinx-doc.org/en/master/extdev/event_callbacks.html). Extensions and themes plug into the build by registering functions, called handlers, that Sphinx runs whenever a particular event fires. If you've used hooks or callbacks anywhere else, it's the same idea. 

Example: below, the `_fix_canonical_url` handler will be run every time the `html-page-context` event gets fired during the docs build:

```python
app.connect("html-page-context", _fix_canonical_url)
```

<figure>
  <img src="/posts/sphinx-benchmark/sphinx-core-events-flow.png" alt="Flowchart from the Sphinx documentation of the order in which Sphinx's core events fire. Initialisation emits config-inited and builder-inited. Reading each added or changed document emits env-purge-doc, source-read, include-read, object-description-transform and doctree-read, followed by env-updated, env-get-updated and env-check-consistency. Writing emits write-started, then for each page doctree-resolved and html-page-context, with missing-reference and warn-missing-reference fired while resolving cross-references. The build ends with html-collect-pages and build-finished." />
  <figcaption style={{textAlign: "center"}}>Sphinx's core events, shown as blue boxes, and when they fire during a build (source: <a href="https://www.sphinx-doc.org/en/master/extdev/event_callbacks.html#core-events-overview">Sphinx documentation on core events</a>).</figcaption>
</figure>

Almost everything an extension does goes through these events, so sphinx-benchmark puts timers around them. It wraps Sphinx's event machinery so that every event emission and every handler call is timed, and it labels each handler by where it comes from: an extension (like `sphinx.ext.autodoc` or `numpydoc`), a theme (like `pydata_sphinx_theme`), Sphinx itself, or "unknown" (for example, a function in your `conf.py`). Events can also fire from inside other events, so it tracks the nesting and reports each event's own time without counting anything twice.

That alone answers a lot. In Matplotlib's build, a single handler, Sphinx-Gallery's `generate_gallery_rst`, took 415 of the 855 seconds, because that's where all the gallery examples get executed and built. In NumPy, `numpydoc`'s `mangle_docstrings` accounts for almost all of the time spent in `autodoc-process-docstring`. Note, all these benchmarking results are present [here](https://github.com/Schefflera-Arboricola/sphinx-benchmark/tree/main/benchmarking_outputs).

Then there's the part that surprised all of us: the **gaps**. Events are checkpoints, not phases, and a lot of work happens between two checkpoints with no event around it: parsing source files, resolving cross-references, writing HTML. sphinx-benchmark measures a gap as the time from one event ending to the next one starting, and groups gaps by the pair of events on either side. So `html-page-context -> doctree-resolved` on the gaps.html page means "the time between finishing one page's HTML context and starting to resolve the next page", added up over 2290 occurrences for the NumPy docs build (i.e. 121.89 seconds and 34.25% of total build time).

How much of a build sits in gaps? About half for Matplotlib and NetworkX, 84% for NumPy, and over 90% for pandas. So how do you benchmark these gaps? And if a single handler like `generate_gallery_rst` takes up 40-50% of the build time then how do you further profile and benchmark that? The next section answers all this!

## Looking more closely with sampling

Knowing that a handler takes 45% of your build time or that two minutes disappear between two events is useful, but it doesn't tell you what to fix/optimise. For that, sphinx-benchmark samples the entire build.

A background [daemon thread](https://docs.python.org/3/library/threading.html#threading.Thread.daemon) wakes up every millisecond (you can configure this sampling interval; 1 ms by default) and takes a snapshot of which function the docs build thread is running and which functions called it, and the whole function stack at that point in time (using [`sys._current_frames`](https://docs.python.org/3/library/sys.html#sys._current_frames)).

<figure>
  <p align="center">
    <img src="/posts/sphinx-benchmark/Eadweard_Muybridge-Sallie_Gardner_1878.png" alt="Eadweard Muybridge's 1878 photograph series The Horse in Motion: twelve numbered sepia frames in a three by four grid, each showing the silhouette of a jockey riding the horse Sallie Gardner at a different point of a single gallop stride across a track marked with vertical reference lines. The last frame shows the horse standing still." width="40%"/>
    <img src="/posts/sphinx-benchmark/Horse_in_Motion_Sallie_Gardner_animation.gif" alt="Looping animation made from Muybridge's Horse in Motion photographs: the separate still frames played in sequence show the horse and rider galloping continuously." width="40%"/>
  </p>
  <figcaption style={{textAlign: "center"}}>Muybridge's "The Horse in Motion" (1878): the still frames on the left, and the same frames played as an animation on the right. (Source: <a href="https://en.wikipedia.org/wiki/The_Horse_in_Motion">Wikipedia</a>)</figcaption>
</figure>

Think of snapshots (a.k.a. samples) as frames in a stop-motion animation (above): one snapshot is just a still picture, but multiple of them show you where the build spends its time. Each snapshot is then matched to whatever the build was inside at that moment (a handler, an event or a gap), so you get a call tree and a function-wise breakdown for every event, handler and gap, and for the whole build.

Here's what that shows for the `html-page-context -> doctree-resolved` gap in the NumPy build:

```bash
Inside the gap html-page-context -> doctree-resolved  -  16744 stack samples over 118.046156s
  Function                     Module                                Kind                Self(s)   % gap
  _last_modified_time          sphinx.util.osutil                    sphinx-internal   34.263277  29.03%
  _file_checksum               sphinx.builders.html._assets          sphinx-internal   17.709743  15.00%
  find_file_in_dirs            docutils.utils                        unknown           10.871188   9.21%
  HTMLParserTreeBuilder.feed   bs4.builder._htmlparser               unknown            5.929098   5.02%
  ...
```

Roughly 44% of that gap is Sphinx checking the modification times and checksums of static asset files while writing each HTML page. A regular profile of the whole build rarely hands you a lead that direct. Here it's easy to spot because the samples are already sorted by where in the build they were taken.

Keep in mind that these numbers are estimates derived from the collected samples, not exact measurements taken with `perf_counter()`. Sampling also adds a little overhead to the build process-- but you can play around with different values of the `sphinx_benchmark_sampling_interval` config to minimise that for your project's docs builds. Also, if you only want the event, handler and gap timings, set `disable_sampling = True` in your `conf.py`.

## The HTML report

The terminal tables are handy, but it's recommended to start with the HTML report. It has:

- an overview page with the build information and a pie chart of which events and gaps take up the build (it's also the featured image for this blog post!)

<figure>
  <img src="/posts/sphinx-benchmark/1_overview_page.png" alt="Overview page of the sphinx-benchmark HTML report for a NumPy 2.6.dev0 docs build. A warning banner says sphinx-benchmark forces a serial build. Under the heading &quot;Where the build time went&quot;, three totals read 355.870 seconds wall clock, 56.104 seconds inside events (15.77%) and 299.765 seconds outside any event (84.23%). A pie chart with a legend lists the largest slices: the gap html-page-context to doctree-resolved at 121.9 seconds (34.25%), the gap autodoc-process-docstring to object-description-transform at 51.1 seconds (14.35%), the gap doctree-resolved to html-page-context at 40.9 seconds (11.51%), followed by smaller events and gaps, and everything else under 1% each at 7.67%." />
  <figcaption style={{textAlign: "center"}}>The overview page for a NumPy docs build.</figcaption>
</figure>

- an events and handlers page, where you can click any event or handler to see every single call record and its call tree and a function-wise breakdown table
- a gaps page with the same information for every pair of events


<div style={{display: 'flex', justifyContent: 'space-between'}}>
  <figure style={{width: '48%', margin: 0}}>
    <img src="/posts/sphinx-benchmark/2_events_n_handlers_page.png" alt="Events and handlers page of the report. For the autodoc-process-docstring event (15.01 seconds own time, 4.22% of the build, 4251 emissions), a table lists its handlers: mangle_docstrings from the numpydoc extension took 14.29 seconds over 4251 calls, and _process_autodoc_docstrings from jupyterlite_sphinx took 0.35 seconds, plus 0.36 seconds of unaccounted overhead. Below it, the builder-inited event table shows process_generate_options from sphinx.ext.autosummary taking 11.04 seconds in a single call." width="100%"/>
    <figcaption style={{textAlign: "center"}}>the events and handlers page</figcaption>
  </figure>
  <figure style={{width: '48%', margin: 0}}>
    <img src="/posts/sphinx-benchmark/3_event_autodoc-process-docstring_page.png" alt="Detail page for the autodoc-process-docstring event with tabs for Emissions, Call tree and Function-wise breakdown. The Emissions tab shows a table of all 4251 recorded emissions sorted by own time, with columns for call number, start time, depth, parent event, duration, own time and percentage of the build. The slowest single emission took 0.69 seconds." width="100%"/>
    <figcaption style={{textAlign: "center"}}>one event's emissions (autodoc-process-docstring)</figcaption>
  </figure>
</div>
<div style={{display: 'flex', justifyContent: 'space-between'}}>
  <figure style={{width: '48%', margin: 0}}>
    <img src="/posts/sphinx-benchmark/4_call_tree_mangle_docstrings.png" alt="Call tree page for the mangle_docstrings handler: 14.29 seconds, estimated from 1429 stack samples at a 5 ms sampling interval. Boxes are coloured by where the code comes from: sphinx-internal, extension, theme, stdlib or other libraries. The tree runs from mangle_docstrings in numpydoc (100% of the handler) to get_doc_object in numpydoc (99.4%) to Environment.get_template in jinja2 (98.8%), showing that almost all of the handler's time is spent loading a Jinja template." width="100%"/>
    <figcaption style={{textAlign: "center"}}>call tree of a handler (mangle_docstrings)</figcaption>
  </figure>
  <figure style={{width: '48%', margin: 0}}>
    <img src="/posts/sphinx-benchmark/5_gap_summary_page.png" alt="Gaps between emissions page, explaining that the work between two event emissions, such as parsing and writing output, is not recorded per handler. A table lists each pair of events with total gap time, count, average gap and share of the build. The largest is html-page-context to doctree-resolved at 121.9 seconds over 2290 gaps (34.25%), then autodoc-process-docstring to object-description-transform at 51.1 seconds (14.35%) and doctree-resolved to html-page-context at 40.9 seconds (11.51%)." width="100%"/>
    <figcaption style={{textAlign: "center"}}>the gaps page</figcaption>
  </figure>
</div>


- a whole-build page with a call tree of the entire build, coloured by whether the build was inside a handler, inside an event, or in a gap; and a function-wise breakdown table for the entire build.

<figure>
  <video controls aria-label="Screen recording of the Whole build page of the sphinx-benchmark HTML report for a NumPy docs build. The call tree starts at main and build_main at 99.6% of the build, and the view pans across it. Hovering a light-blue handler box, EventManager.emit, shows a tooltip with its file path and 9.777 seconds total time. Most of the tree is pink, meaning time spent in gaps between events, such as Builder.write_documents at 190 seconds or 53.5% of the build. The recording ends on the Function-wise breakdown tab, a table led by _last_modified_time from sphinx.util.osutil at 40.4 seconds, 11.35% of the build.">
    <source
      src="/posts/sphinx-benchmark/6_whole_build_page.mp4"
      type="video/mp4"
    />
  </video>
  <figcaption style={{textAlign: "center"}}>Scrolling through the whole-build call tree of a NumPy docs build, then switching to its function-wise breakdown table.</figcaption>
</figure>

For more, please read [this guide](https://github.com/Schefflera-Arboricola/sphinx-benchmark/blob/main/benchmarking_outputs/README.md) on reading and understanding the benchmark outputs, which explains in detail every column and how each number is calculated.

## Before you trust the benchmarking numbers

- The extension forces a serial build: The extension records everything in the main process, so Sphinx falls back to a serial build even if you pass `-j auto`, and the extension warns you about it. So, your total build time will probably be longer than a parallel build.
- It measures wall-clock time: Network calls, caches and background processes all count. In two NumPy builds a day apart, the intersphinx extension took 1.9 seconds in one and 110 seconds in the other, just fetching inventories from other projects' docs over the network. Run it more than once before concluding anything. For this particular case of intersphinx, you can cache the `objects.inv` file.
- Sampling needs the GIL: On free-threaded Python the sampler switches itself off. Run with `PYTHON_GIL=1` to get call trees. 

The [limitations section of the README](https://github.com/Schefflera-Arboricola/sphinx-benchmark#limitationspain-points) lists some more "not-so-serious" things that are good to know before you dive into this!

## First win: SunPy's docs build, 40% shorter build (1.67x or 67% faster)

<figure>
  <img src="/posts/sphinx-benchmark/sunpy_theme_optimisation_PR_ss.png" alt="Screenshot of the merged pydata-sphinx-theme pull request 2477, &quot;Add a configuration option for which templates to skip empty checks&quot;, opened by Cadair. The description says they used the sphinx-benchmark tool to see how long sunpy's documentation took to build with the sunpy-sphinx-theme, and pastes the benchmark output: a build time of 317 seconds, with the html-page-context event taking 208.28 seconds of own time (65.70% of the build) over 701 emissions, and its handlers update_and_remove_templates and set_secondary_sidebar_items from pydata_sphinx_theme." />
  <figcaption style={{textAlign: "center"}}>Source: <a href="https://github.com/pydata/pydata-sphinx-theme/pull/2477">https://github.com/pydata/pydata-sphinx-theme/pull/2477</a></figcaption>
</figure>

Soon after the first release, [Stuart Mumford](https://github.com/Cadair) ran sphinx-benchmark on the SunPy docs. It showed a single theme handler, `update_and_remove_templates`, taking 206 of the 317 seconds inside `html-page-context`. The theme renders sidebar templates once just to check whether they're empty. SunPy's theme names its main navigation template differently from the parent theme, so the navigation was being rendered twice on every page.

He added an option to skip that check in [pydata-sphinx-theme#2477](https://github.com/pydata/pydata-sphinx-theme/pull/2477) and used it in [sunpy-sphinx-theme#332](https://github.com/sunpy/sunpy-sphinx-theme/pull/332). The build went from 317 to 190 seconds. Other projects using the SunPy theme, like Astropy, should also see a similar speedup in the coming days!

I didn't write that fix, and that's what I like most about it. The tool pointed at the right handler in the right event, and someone who knew their project fixed it in one PR-- and it reduced so much compute and energy consumption. And I hope more optimisations like this will be discovered throughout the ecosystem :)

## My development process and internship experience

This section mostly has my own experiences and the messy development process that led to the current state of this project-- so feel free to skip it :)

I had used Sphinx before as a contributor and maintainer, but I knew nothing about how it worked inside. My first couple of weeks were mostly reading and experimenting.

I surveyed the docs builds of 15 open-source projects (build times, extensions, themes, CI setups), then profiled the CPython docs build with some of the common profiling tools: [cProfile](https://docs.python.org/3/library/profile.html), [SnakeViz](https://jiffyclub.github.io/snakeviz/), [gprof2dot](https://github.com/jrfonseca/gprof2dot) and [VizTracer](https://github.com/gaogaotiantian/viztracer). They all worked, but none of them could tell me which _part_ of the build or which extension was responsible. A function-level profile of the build mostly gave me lower-level functions-- so it wasn't very useful. Sphinx's own [`sphinx.ext.duration`](https://www.sphinx-doc.org/en/master/usage/extensions/duration.html) only times the reading of each document. The closest thing to a call-tree/map was Chris Sewell's [sphinx-process-graph](https://github.com/chrisjsewell/sphinx-process-graph), which draws the build process as a graph but doesn't measure time-- and it wasn't generated fully automatically. So it was a stretch goal for us to be able to do that-- but we did it!

We went through the following versions:

1. **Phases from log messages.** Sphinx's build is often described in phases (see the diagram below), so my first proof of concept added timestamps to Sphinx's log messages and matched them to phases. It broke quickly: extensions that log very little, or run quietly, left big blind spots, and matching messages to phases was fragile.

<figure>
  <img src="/posts/sphinx-benchmark/build_phases.png" alt="Diagram of five boxes connected by arrows from left to right: Initialization, Reading, Consistency checks, Resolving, Writing." />
  <figcaption style={{textAlign: "center"}}>The phases of a Sphinx build. Source: <a href="https://www.sphinx-doc.org/en/master/extdev/index.html">https://www.sphinx-doc.org/en/master/extdev/index.html</a></figcaption>
</figure>

2. **Phases from events.** I turned it into a proper Sphinx extension and used events as the phase boundaries. This was more reliable, but the phases were a bit arbitrary, and some had no event clearly marking where they start or end.
3. **Events themselves.** Melissa and Agriya suggested dropping phases and reporting events directly, since events are clearly defined and phases aren't.
4. **Handlers and gaps.** Next, we wrapped each event's handlers to time them and label where they come from, tracked events that fire inside other events, and measured the gaps between events. A CLI and an HTML report made all of this more interactive and readable.
5. **Sampling.** The gaps were still a black box, so we needed to see what the build was doing between events. I played around with a few profilers to just profile in between events-- but then Claude suggested a better approach would be to have a background thread that regularly reads the gap's current call stack using Python's [`sys._current_frames()`](https://docs.python.org/3/library/sys.html#sys._current_frames). And then I decided to expand that sampling logic to the entire build process, so that the expensive handlers could also be further broken down function-wise and then we could also get complete call trees!

Put together, points 3 to 5 are what sphinx-benchmark is today. You can see the evolution of the benchmarking results [here](https://github.com/Schefflera-Arboricola/sphinx-benchmark/blob/main/benchmarking_outputs/past_benchmarks.md)-- how they grew more and more detailed as my understanding grew deeper!

Along the way I asked many downstream maintainers for feedback, in various Discord and Slack groups, at Quansight's internal QShare, on the [sphinx-dev mailing list](https://groups.google.com/g/sphinx-dev/c/R492a_Fsdvw) and in [Sphinx's GitHub Discussions](https://github.com/sphinx-doc/sphinx/discussions/14652), and it all helped shape the extension. For example, the minimum Sphinx version dropped from 9 to 8.2 because Lucas Colley (from SciPy) and Kayce Basques (from the pigweed.dev project) communicated it as a pain-point. And any feedback is most welcome :)

For more, you can find my weekly updates and notes from the internship [here](https://github.com/Schefflera-Arboricola/blogs/tree/main/sphinx/Quansight-OS-Internship-2026).

Side-note: the CLI and the HTML report were mostly written with AI assistance, with me reviewing and iterating on them. That let me spend my time on the extension's design, the benchmarking approaches and the measurement side, where all the tricky decisions were. And, AI was also used to write this blog that you are reading right now :)

Personal note: One more thing I learned. Asking for help has always been hard for me (you'll know if you've read my previous [blogs](https://github.com/Schefflera-Arboricola/blogs)). I used to think I had to show up with the perfect questions: the "I tried A, expected B, got C, and my guess is D" format. But, towards the end of the internship I realised that you don't have to come with a bunch of "perfect" questions to meetings but instead it's the time that you spend with the mentors that helps-- seeing how an experienced person thinks, how they decide what to try, what not to try, and what to prioritise. And you get all that when you ask your mentors somewhat vague, open-ended questions, and where I'm stuck and what I'm unsure about, and then let them help me by think it all through with me. But, I'm not suggesting here to come unprepared for your meetings or ask questions that are too vague-- keeping it balanced is what I meant.

## What's next?

[sphinx-benchmark 0.2.0](https://pypi.org/project/sphinx-benchmark/) is out, but it's still in the early stages of development, so expect bugs (and please report them!) and changes without any deprecation cycles. The big open to-dos are:

- Parallel builds: Supporting `-j` means collecting timings from worker processes and keeping sampling correct alongside them ([#4](https://github.com/Schefflera-Arboricola/sphinx-benchmark/issues/4)).
- Benchmark different Scientific Python projects and based on those benchmarks implement some optimisations in some high-impact projects i.e. projects that are widely used like pydata-sphinx-theme or Sphinx itself.
- Free-threaded Python support for sampling ([#31](https://github.com/Schefflera-Arboricola/sphinx-benchmark/issues/31)).
- Improve the sphinx-benchmark CLI ([#6](https://github.com/Schefflera-Arboricola/sphinx-benchmark/issues/6)).
- And many more open issues: https://github.com/Schefflera-Arboricola/sphinx-benchmark/issues

Lastly, I'd love to have more users, contributors, maintainers and a community around this project-- and thereby make it better! So, I've proposed moving this project into the sphinx-doc GitHub organisation [here](https://github.com/sphinx-doc/sphinx/discussions/14652), so it can get the attention of the people who can actually act on what the extension finds. If you'd find that useful, a comment there helps. I'm also looking into ways to get this extension under the [sphinx-contrib](https://github.com/sphinx-contrib) org. And talks have been going on between my mentors and [Quansight-Labs'](https://github.com/Quansight-Labs) "Owners" (on GitHub) about whether this project could be added there to get more traction. (So if you are reading this in the future and some of the links don't work then try changing the org name.) Also, I'm planning to submit talk proposals to some of the upcoming conferences to spread the word!

## Call to action for maintainers

If your project has docs built with Sphinx, consider trying this sphinx-benchmark extension on your project and sharing your results with your community (or with me, if you like :)). If the report shows you something surprising (or something wrong), [open an issue on GitHub](https://github.com/Schefflera-Arboricola/sphinx-benchmark/issues). And if you're curious what your CI minutes cost in energy, [CodeCarbon](https://codecarbon.io/) is a nice way to find out (Agriya shared this with me).

## "Thank you"s!

A big thank you to my mentors, Melissa and Agriya. This project started out open-ended, and a lot of what I learned came from their guidance, insights and support at every step of the way :) Thanks also to Stuart Mumford, Kayce Basques and everyone else who tried the extension and shared their results and feedback, and to the Quansight team for all the support and this opportunity :)


Thank you for reading till the end :)
