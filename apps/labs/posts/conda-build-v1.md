---
title: 'conda-build Adds Support for v1 Recipes'
published: September 10, 2026
authors: [jakov-smolic]
description: " "
category: [Packaging]
featuredImage:
  src: 
  alt: ''
hero:
  imageSrc: 
  imageAlt: ''
---

Building Conda packages can be slow. Anyone who has spent time creating or maintaining packages
for Conda or conda-forge has encountered builds that can take a considerable amount of time.

Recent work on `conda-build` aims to improve that experience: `conda-build` now supports v1 recipes,
with builds powered by `rattler-build`.

## Motivation

For much of its history, `conda-build` has been the standard tool for building Conda packages.
In 2025, conda-forge[ introduced support for the v1 recipe format](https://conda-forge.org/blog/2025/02/27/conda-forge-v1-recipe-support/), bringing several improvements over the original one.

The traditional v0 `meta.yaml` format supports Jinja expressions, which can introduce complexity,
as parsing and processing these recipes often requires special handling.

The v1 recipe format uses pure YAML together with a standardized schema. This enables features
such as schema validation and editor autocomplete, while also making recipes easier to read,
maintain, and update over time.

Performance is another important consideration. `conda-build` can spend significant time
solving dependencies, creating isolated environments, and performing filesystem operations
which can introduce slowdowns.

`rattler-build` is the primary tool for building v1 recipes. It is built on the Rattler
ecosystem, which implements common Conda package management functionality in Rust. This allows
`rattler-build` to perform many operations significantly faster than `conda-build`.

## Bringing rattler-build to conda-build

The [Prefix.dev](https://prefix.dev/) team has been working on Python bindings for
`rattler-build`, exposed through `py-rattler-build`. This brought an opportunity to
integrate `rattler-build` directly into `conda-build`.

The implementation aims to preserve the existing `conda-build` workflow. The integration is
done entirely within the `conda-build` namespace and is built into the existing command-line interface.

When `conda-build` is invoked, it determines the recipe format being used and dispatches
the build to the appropriate backend. 

Build configuration works in much the same way as it does for v0 recipes. Many existing
command-line options and configuration settings are translated into their rattler-build
equivalents and passed through py-rattler-build.

`py-rattler-build` provides Python APIs for parsing, rendering, building, and testing
packages. Integrating those APIs into `conda-build` required translating `conda-build`
configuration settings into their `rattler-build` equivalents and passing them through
`py-rattler-build`. 

To accomplish this, the integration relies on Conda's existing configuration, which
combines settings from different sources such as `.condarc` files, environment variables
and command-line arguments.

The compatibility layer also handles other important aspects of the build such as:

- Surfacing errors through the existing `conda-build` interface
- Routing build output through Conda's logging system
- Handling variant and channel configuration
- Tracking the build status of recipes and outputs
- Running package tests
- Gathering and reporting build results
- Reusing the existing package upload workflow

Support also extends beyond package builds, as v1 recipes now work with the
`conda render` and `conda debug` commands as well.

## How to try it?

If you already use `conda-build`, getting started with v1 recipes should
feel familiar.  They can be built using the same command:

```shell
conda build path/to/recipe
```

To convert existing meta.yaml recipes to the new format, you can use the
[conda-recipe-manager](https://github.com/conda/conda-recipe-manager) tool. 

For more details on using v1 recipes with `conda-build`, see the
[ conda-build v1 recipes documentation](https://docs.conda.io/projects/conda-build/en/latest/user-guide/v1-recipes.html).

Because the two recipe formats differ in some important ways, converted recipes
should be carefully reviewed.
The[ rattler-build documentation](https://rattler-build.prefix.dev/dev/converting_from_conda_build/#converting-selectors)
describes some of these differences and provides guidance on migrating recipes.

## Conclusion

The Conda packaging ecosystem is gradually moving toward the v1 recipe standard.
By supporting v1 recipes directly in `conda-build`, package maintainers now have
a more flexible migration path: recipes can be updated to the new format independently
of the build tooling they use.

Maintainers can continue using `conda-build`, start adopting the v1 format, and
benefit from the performance improvements provided by `rattler-build`.

For package maintainers who have spent too much time waiting for builds to finish,
that can be a meaningful improvement.