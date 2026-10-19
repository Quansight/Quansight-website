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
The work is still far from complete and the upcoming PEPs are still subject to change, but I believe that we have major progress, and things are looking better than before.
I would like to take this opportunity to explore how the design changed since we announced it first.

## One PEP, many PEPs

Originally we decided to pursue wheel variants as a single PEP.
The decision made sense at the time: it was a single, complete tested design.
You had to have all the bits to see how they fit together, and you had to implement it whole to provide the desirable user experience.
The problem is that when you try to cover everything at once: metadata, providers, plugin API, installing, building… the specification becomes very long and hard to process.
You lose the ability to see the forest for the trees.
We tried to resolve this by replacing the original rationale section (that was very hard to digest, given you had to kept cross-referencing it to the specification) with a combined overview-rationale, but that did not help much.
Besides, at this point it was even difficult for ourselves to keep updating the specification.

So split was clearly the way forward.
But how should we split it?
Smaller parts are easier to debate on their own merit, but they need to be linked to the high-level design.
Variant namespaces start truly making sense if you consider providers as governed independently.
We also needed to consider the risk that changes to the individual parts of the specification will require revisiting earlier PEPs.

We decided to make the first cut where providers started.
They were easily the most controversial part of the design, and attracted most of the discussion, making it hard to get feedback on the more fundamental aspects of wheel variants.
While the architecture cannot work without providers, it is entirely possible to treat them as a "black box"; specify where they fit into the design, and define an interface that a subsequent PEP will have to provide.
An additional advantage of this split is that a good foundation is universal: the provider model can change substantially, and still fit into it.

A logical place for the next cut was to split wheel building from consumption.
The providers PEP was limited to all the aspects needed to install wheels, leaving the bits specific to build backends out.

Finally, given the complexity of providers, we decided to further split the relevant PEP into two: a technical specification sufficient to build a working, secure solution, and a governance part providing a framework to combine security with good user experience.

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

Some aspects of the proposition could fit into more than one of the PEPs.
For example, the algorithm wheel selection could either be placed in the Package Format PEP, where it would operate on the data provided by the "black box" providers, in the Providers PEP, or even in a PEP of its own.
Our decision to include it in the first PEP was mostly prompted by the desire to keep the Providers PEP maximally focused.

At the time of writing, the Package Format part is provisionally accepted, and the Providers part is entering the discussion.
While the foundations remained the same, the specification has already changed a lot.
The current design is detailed in the published PEPs 825 and 850, and presented in more general terms in the updated PEP 817.
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

PEP 817 therefore introduced a different kind of providers: ones using static compatibility data embedded inside the wheel.
In this case, this metadata takes over the role of the plugin, eliminating the need to install a package and run third-party code.
For example, NumPy can be built against different BLAS/LAPACK libraries.
The specific library used is a property entirely internal to the wheel.
All variant properties defined this way are always supported, so the user can install a variant built against any library.

The two approaches could also be combined: a plugin could be queried at build time, and used to fill the static compatibility data in the built wheel.
The plugin serves as a single point where properties are defined, so they are used consistently across packages.
However, it is only used at build time, so it does not introduce any install-time overhead.

We have also introduced an "ABI Dependency Provider" as a special case.
It is a provider that can be used to create variants built against different dependency versions.
For example, binary compatibility requires that extensions built against a specific PyTorch version use the same version; by introducing per-version variants, a single package version can now easily support multiple PyTorch versions and the installer can select a wheel to match.
However, such a provider is quite complex to implement, as it needs to be integrated with the dependency resolver; we therefore made it optional and defined as a special case rather than tried to bend the plugin interface to make it work.
PEP 850 generalized this special case into a class of "built-in" providers, of which this provider is the only defined example so far.

## Variant metadata

The variant metadata changed as well.
It is a core part of the specification, carrying the mapping from labels to variant properties, the information on providers and variant property ordering.
It manifests inside the project's `pyproject.toml` file, as a JSON file inside the built wheel and as aggregated metadata on the index.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/format-evo.png"
    width="541" height="258" alt="TODO" />
  <figcaption>Fig. 2. The evolution of variant metadata</figcaption>
</figure>
</div>

Originally, the metadata used three top-level keys: `default-priorities` containing project-level property ordering data, `providers` describing the used provider plugins, and `variants` that was present only in JSON files and listed built variants.
In PEP 817, `$schema` was added to the JSON files that enabled versioning the metadata; PEP 825 explicitly specified semantic versioning, and provided the rules for changing the metadata format.
The current specification draft extends both `$schema` and `variants` to `pyproject.toml` as well, making the format entirely symmetric.

`default-priorities` used to specify the ordering information for namespaces, features and individual properties.
The first one was necessary, as only the project could determine what's more important to it.
The other two enabled overriding priorities coming from the providers themselves, and were added for completeness.
PEP 825 removed them, as they were adding unnecessary complexity without actually serving a feasible use case.

Along with providers, the provider information underwent a major transformation.
Each provider used to be described using up to four keys: `requires` specifying the packages necessary, `plugin-api` providing an override for the plugin's entry point, `enable-if` allowing plugins to be skipped based on environment markers, and `optional` to introduce opt-in plugins.
PEP 817 introduced a top-level `static-properties` key for providers based on static compatibility information, with mapping of namespaces to property sets.
It also added an `install-time` key to the provider dictionary; if set to `false`, the plugin would be queried when building the wheel, and `static-properties` will be added to the JSON file.
Since dictionaries in TOML and JSON could not reliably convey dictionary key order, `default-priorities.feature` would have to be used to specify the ordering of static features.

PEP 825 removed all the provider metadata; PEP 850 reintroduced it in a significantly changed form.
For a start, `enable-if` is gone entirely; we have realized that it is entirely redundant to skipping the plugins that weren't used to build a wheel for your platform.
`static-properties` was moved inside the provider information dictionary, removing unnecessary duplication of namespace keys, and made mutually exclusive with `requires`.
Once `default-priorities.feature` was removed from PEP 825, `feature-order` was added to the provider information to complement static property definitions.
`install-time` was removed as well; instead, `requires` is assumed to always imply an install-time plugin, and the current high-level draft uses a `build-requires` key in `pyproject.toml` (mutually exclusive with the other key) to facilitate build-time plugin querying.
Finally, the `builtin` key was added to indicate a built-in provider.

## Environment markers

The original specification introduced three environment markers that enabled making project dependencies conditional to the variant installed: `variant_properties`, `variant_features` and `variant_namespaces`.
We were also discussing the possibility of adding a marker that specifically matched against the variant label, and in PEP 817 we eventually added it as `variant_label`.

Furthermore, PEP 825 changed the behavior of `variant_properties` slightly.
Previously, the marker matched against all properties that the wheel was built with; now it matches against the subset of properties that are compatible with the system.
For example, if you provide a variant wheel supporting multiple GPUs, you can now introduce dependencies that will be used with a specific GPU only (previously, they would be always installed, irrespective of which GPU matched):

```
example-sm120-kernels; "nvidia :: sm_arch :: 120_real" in variant_properties
example-sm110-kernels; "nvidia :: sm_arch :: 110_real" in variant_properties
...
```


## TODO: changes to discuss

- 825: algorithm changes; repeat removed feature/value, change to multi-value, fallbacks
- 850: removed dynamic plugins

