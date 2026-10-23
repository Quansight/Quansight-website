---
title: 'A year into wheel variant work'
published: October 14, 2026
authors: [michal-gorny]
description: 'TODO'
category: [Packaging]
featuredImage:
  src: ""
  alt: ""
hero:
  imageSrc: ""
  imageAlt: ""
---

# A year into wheel variant work

Over a year ago, we have [announced a working prototype of wheel variant](/blog/python-wheels-from-tags-to-variants).
It was a major milestone that marked the transition from the initial experimentation stage into specification work.
The proto-PEP developed back then eventually became [PEP 817](https://peps.python.org/pep-0817/), originally including a lengthy specification part.
However, the subsequent discussion made us realize that the design itself is far too complex to be carried in a single PEP, and the specification part was moved into a series of documents starting with [PEP 825](https://peps.python.org/pep-0825/), while PEP 817 became a kind of high-level guide to the overall design.

Split wasn't the only change happening.
Between further experimentation and the discussion involved, the specification itself changed a lot as well.
Our aim was always to create a solution that will stand the test of time; find the right balance between complexity and user expectations.
The work is still far from complete and the upcoming PEPs are subject to change, but I believe that we made major progress, and things are looking better than before.
I would like to take this opportunity to explore how the design changed since we announced it first.

## One PEP, many PEPs

Originally we wanted to pursue wheel variants as a single PEP.
The decision made sense at the time: it was a complete tested design.
You needed all the bits to see how they fit together, and you had to implement it whole to get the desired user experience.
The problem is that when you try to cover everything at once: metadata, providers, plugin API, installing, building and so on, the specification becomes very long and hard to process.
You lose the ability to see the forest for the trees.
We tried to resolve this by replacing the original rationale section (which was hard to digest, given you had to keep cross-referencing it to the specification) with a combined overview-rationale, but that did not help much.
Besides, at this point even we were finding it difficult to apply updates to the specification.

So split was clearly the way forward.
But how should we have split it?
Smaller parts are easier to debate on their own merit, but they need to be linked to the high-level design somehow.
Variant namespaces start truly making sense if you consider providers as governed independently.
We also needed to consider the risk that changes to the individual parts of the specification will require revisiting earlier PEPs.

We decided to make the first cut where providers started.
They were easily the most controversial part of the design, and attracted most of the discussion, making it hard to get feedback on the more fundamental aspects such as the metadata format.
While the architecture cannot work without providers, it is entirely possible to treat them as a "black box"; specify where they fit into the design, and define an interface that a subsequent PEP will have to provide.
An additional advantage of this split is that a good foundation is universal: the provider model can change substantially, and still fit into it.

A logical place for the next cut was to split wheel building from consumption.
The providers PEP was limited to all the aspects needed to install wheels, leaving the bits specific to build backends out.

Finally, given the complexity of providers, we decided to further split the relevant PEP in two: a technical specification sufficient to build a working solution, and a governance part providing a framework to combine security with good user experience.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/peps.png"
    width="541" height="258" alt="TODO" />
  <figcaption>Fig. 1. The structure of PEPs</figcaption>
</figure>
</div>

We therefore settled on four PEPs so far:

1. Package Format ([PEP 825](https://peps.python.org/pep-0825/)): focused on changes to the wheel format and initial set of variant metadata.
2. Providers ([PEP 850](https://peps.python.org/pep-0850/)): extending the Package Format PEP with providers used to determine which variant properties are supported, defining the plugin API.
3. Building: extending the Providers PEP with build backend support, `pyproject.toml` format for variant metadata, build-time bits of the plugin API.
4. UX, maintainability, security and governance: covering the introduction strategy and maintenance of å community maintained repository of trusted variant providers.

Some aspects of the proposition could fit into different PEPs.
For example, the wheel selection algorithm could either be placed in the Package Format PEP, where it would operate on the data provided by the "black box" providers, in the Providers PEP, or even in a PEP of its own.
Our decision to include it in the first PEP was mostly prompted by the desire to keep the Providers PEP maximally focused.

At the time of writing, the Package Format part is provisionally accepted, and the Providers part is entering the discussion phase.
While the foundations remained the same, the specification already changed a lot.
The current design is detailed in the published PEPs 825 and 850, and presented in more general terms in the updated [PEP 817](https://peps.python.org/pep-0817/).
In the remainder of the post, I'd like to explore the differences from the [original specification published along the previous blog post](https://github.com/wheelnext/wheelnext/blob/a058c17c01856f439bee85c96ce498d24045afb8/docs/proposals/pepxxx_wheel_variant_support.md).

## Variant labels

Let's start with the variant label, the unique identifier added to the filename.
The early drafts of the specification actually used a variant hash, generated from a serialized form of the wheel's variant properties.
Later, an explicit human-written label of up to 8 characters was permitted as a more readable alternative to that.
By the time of the [initial PEP 817 draft](https://github.com/wheelnext/peps/blob/f81a8256fc4372ad1f166afa359a7f5f768ea144/peps/pep-0817.rst), variant hash was no longer part of the specification, but rather an implementation detail (since such a hash still constituted a valid label); the null variant no longer used `00000000` but a shorter `null` label.
PEP 825 removed the arbitrary length limitation, leaving the decision about filename length up to the package maintainers.
Finally, the current high-level design suggests defining all valid labels in `pyproject.toml`, rendering variant hashes entirely obsolete.

## Intermission: Providers

Providers are the core of variant wheels: they are used to determine which properties are compatible with one's system, and therefore which variant wheel will be installed.
The original specification was based entirely on plugins that were queried at install time.
While some use cases still require such an approach, we have realized that many can be solved with static metadata.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/provider-types.png"
    width="541" height="258" alt="TODO" />
  <figcaption>Fig. 2. Different provider types</figcaption>
</figure>
</div>

PEP 817 therefore introduced a different kind of providers: ones using static compatibility data embedded inside the wheel.
In this case, this metadata takes over the role of the plugin, eliminating the need to install a package and run third-party code.
For example, NumPy can be built against different BLAS/LAPACK libraries.
The specific library used is a property entirely internal to the wheel.
All variant properties defined this way are always supported, so the user can install a variant built against any library, looking only at the available variants rather than querying anything else about the system.

The two approaches can also be combined: a plugin can be queried at build time, and used to fill the static compatibility data in the built wheel.
The plugin serves as a single point where properties are defined, so they are used consistently across packages.
However, it is only used at build time, so it does not introduce any install-time overhead.

We have also introduced an "ABI Dependency Provider" as a special case.
It is a provider that can be used to create variants built against different dependency versions.
For example, binary compatibility requires that extensions built against a specific PyTorch version depend on the same version; by introducing per-version variants, a single package version can now easily support multiple PyTorch versions and the installer can select a wheel to match.
However, such a provider is quite complex to implement, as it needs to be integrated with the dependency resolver; we therefore made it optional and defined as a special case rather than tried to bend the plugin interface to make it work.
PEP 850 generalized this special case into a class of "built-in" providers, of which this provider is the only defined example so far.

## Variant metadata

Variant metadata carries the mapping from labels to variant properties, the provider information and variant property ordering.
It manifests inside the project's `pyproject.toml` file, as a JSON file inside the built wheel and as aggregated metadata on the index.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/format-evo.png"
    width="541" height="258" alt="TODO" />
  <figcaption>Fig. 3. The evolution of variant metadata</figcaption>
</figure>
</div>

Originally, the metadata used three top-level keys: `default-priorities` with project-level ordering data, `providers` describing the used provider plugins, and `variants` that was present only in JSON files and listed available variants.
In PEP 817, `$schema` was added to the JSON files that enabled versioning the metadata; PEP 825 made it use semantic versioning, and provided the rules for changing the metadata format.
The current specification draft extends both `$schema` and `variants` to `pyproject.toml` as well, making the format entirely symmetric.

`default-priorities` used to specify the ordering information for namespaces, features and individual properties.
The first one was necessary, as only the project could determine what's more important to it.
The other two enabled overriding priorities coming from the providers themselves, and were added for completeness.
PEP 825 removed them, as they were adding unnecessary complexity and we have not found a good use case justifying it.

Along with providers, the `providers` dictionary underwent a major transformation.
Each provider used to be described using up to four keys: `requires` specifying the packages providing the plugin, `plugin-api` providing an override for its entry point, `enable-if` allowing plugins to be skipped based on environment markers, and `optional` to introduce opt-in plugins.
PEP 817 introduced a top-level `static-properties` key for providers based on static compatibility information, with mapping of namespaces to property sets.
It also added an `install-time` key to the provider dictionary; if set to `false`, the plugin would be queried when building the wheel, and `static-properties` will be added to the resulting wheel.
Since dictionaries in TOML and JSON could not reliably convey dictionary key order, `default-priorities.feature` had to be used to specify the ordering of static features.

All the provider metadata was out of scope for PEP 825; PEP 850 changed it signficantly.
For a start, `enable-if` is gone entirely; we have realized that it is entirely redundant to skipping the plugins that weren't used to build a wheel for your platform.
`static-properties` was moved inside the provider information dictionary, removing unnecessary duplication of namespace keys, and made mutually exclusive with `requires`.
Once `default-priorities.feature` was removed from PEP 825, `feature-order` was added to the provider information to complement static property definitions.
`install-time` was removed as well; instead, `requires` is assumed to always imply an install-time plugin, and the current high-level draft uses a `build-requires` key in `pyproject.toml` (mutually exclusive with the other key) to facilitate build-time plugin querying.
Finally, the `builtin` key was added to indicate a built-in provider.

It's worth noting that in the latest design, the provider type is effectively defined by the presence of one of the mutually exclusive keys: `requires`, `static-properties`, `builtin` or `build-requires` (the last one only allowed in `pyproject.toml`).

## Metadata consistency

Variant metadata is exposed both inside each individual wheel, and in aggregated form in an index-level metadata file.
The latter file does not provide for per-wheel metadata, but rather requires that a single combination of values can satisfy all variant wheels built for a single project version.

The original specification recommended enforcing that both `default-priorities` and `providers` are exactly the same across all wheels.
While this assumption holds when all the wheels are built from a single `pyproject.toml`, it has been pointed out that it is needlessly limiting and it could cause issues if one builds additional kinds of variants later or wants to add variants built separately.
PEP 817 relaxed this requirement to permit "careful merging […], as long as no conflicting information is introduced, and the resolution results within a subset of variants do not change".
PEP 825 (and then PEP 850) went ever further, explicitly specifying consistency requirements for individual metadata keys, and providing an algorithm for merging them.

Variant wheels therefore permit building new variants for the same version, as long as their labels remain unique, and adding new providers, provided that they are added to the end of `default-priorities.namespace` list.
The crucial requirement is that each new set of wheels must build upon the previous namespace list; otherwise, it would be impossible to merge them in a reproducible way.

## Variant ordering

The specification provides not only for determining whether a particular variant can be installed, but also for selecting the most appropriate among the compatible wheels.
The algorithm provided for that remained mostly unchanged since the initial draft, although it has been rewritten multiple times in an effort to make it easier to comprehend.
PEP 825 is a culmination of that effort, combining a high-level overview, an example, a detailed algorithm and a pseudocode implementation.

Still, a few changes to the algorithm were made in PEP 825:

- `default-priorities.feature` and `default-priorities.property` were removed, making the feature and value ordering entirely provider-defined
- only the best compatible value for every feature is now used to order variants, rather than all compatible values
- for the pathological case when two variants evaluate to the same sorting key, a fallback ordering on variant label was added

## Environment markers

The original specification introduced three environment markers that enabled making project dependencies conditional to the variant installed: `variant_properties`, `variant_features` and `variant_namespaces`.
We were also discussing the possibility of adding a marker that specifically matched against the variant label, and in PEP 817 we eventually added it as `variant_label`.

PEP 825 changed the behavior of `variant_properties` slightly.
Previously, the marker matched against all properties that the wheel was built with; now it matches against the subset of properties that are compatible with the system.
For example, if you provide a variant wheel supporting multiple GPUs, you can now introduce dependencies that will be used only when the user has the specified GPU installed (previously, the markers for all GPUs supported by the wheel would match):

```
example-sm120-kernels; "nvidia :: sm_arch :: 120_real" in variant_properties
example-sm110-kernels; "nvidia :: sm_arch :: 110_real" in variant_properties
...
```

## Dynamic plugins are gone

The original design used two types of plugins: "static" and "dynamic".
In this context, "static" meant that the plugin queried the system and returned a fixed list of supported properties with no knowledge of the wheels being processed.
"Dynamic" plugins on the other hand acted directly on the list of properties obtained from the available wheels.

The NVIDIA provider was the original use case for dynamic plugins.
We wanted variant wheels to be able to express minimum and maximum CUDA versions supported.
However, the plugin couldn't reliably generate a list of all possible future CUDA versions.
Instead, the installer would pass the minimum and maximum versions specified in the wheels, and the plugin would indicate whether the requirements are met or not.

However, such a design was quite problematic.
Most importantly, you couldn't easily replace the plugin with static metadata.
If you wanted to generate such a replacement data automatically, you needed to specify all the properties that need to be covered.
If one package required CUDA 12.8 and another CUDA 12.9, you'd need to explicitly cover both versions, and update your static metadata whenever you find a package with a property you didn't test for.
For comparison, with "static" plugins you just had to query all the interesting plugins once and store their output; the resulting metadata would be compatible with all the packages using the plugin in the near future.

In the end, we have decided it's not worth it and removed "dynamic" plugins prior to PEP 817.
Formerly "static" plugins became the only kind of plugins defined, and eventually "static" became the term associated with truly static metadata.
The NVIDIA provider was rewritten to output a reasonably wide range of compatible minimum and maximum versions around the installed version, and will be updated whenever that range is no longer sufficient for the CUDA versions in use.

## Namespaces are no longer fixed

Up to PEP 817, the namespace used was fixed in every variant plugin.
If you used the NVIDIA provider plugin, you had to use `nvidia` namespace for its properties.
The x86-64 CPU plugin used `x86_64`, and so on.
Conversely, you couldn't use two different providers specifying the same namespace in a single project version.
The "ABI Dependency Provider" also used a reserved namespace.

PEP 850 relaxed that and made namespace a project-side identifier.
Plugins can still declare a recommended namespace identifier in their entry point, but it exists only for convenience in automatically updating `pyproject.toml`.
The project maintainers can use any namespace for any provider as they see fit, and the `providers` metadata is used to map it into an actual provider.

We also clarified that tools vendoring or reimplementing providers must match them on Python package names rather than namespaces used.

## Plugin API changes

All the changes also meant that the plugin API changed significantly.

Originally, the API defined two properties: `namespace` specifying the plugin's namespace, and `dynamic` specifying whether the plugin is "dynamic" or "static".
As PEP 817 removed the concept of dynamic plugins, it removed the `dynamic` property.
However, it introduced build-time plugins (called "AoT plugins" at the time), and consequently `is_aot_plugin` property.
PEP 850 removed fixed namespaces, and therefore the `namespace` property.
It also deferred build-time functionality into a subsequent PEP, removing `is_aot_plugin`.
The current plan is to reintroduce it as `all_properties_compatible`.
Yes, all the changes can feel a bit vertiginous, but if you look at the final specification, the API is probably cleaner than before.

The API also used to define two methods: `get_supported_configs()` that returned a list of properties compatible with the system, and `validate_property()` used to verify whether a particular property is valid to build a wheel with.
The first one had a quasi-optional `known_properties` argument that was used in dynamic plugins to pass the properties found in installable wheels.
PEP 817 removed this argument, and reversed the property validation logic; `validate_property()` was replaced by `get_all_configs()`, returning all valid properties for a given plugin.
The new approach was symmetric with `get_supported_configs()` and more efficient.
This part of the API did not change further, beyond being split between PEP 850 and the PEP following it for the build-time part.

