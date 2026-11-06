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

# A year into Wheel Variants work

Over a year ago, we [announced a working prototype of wheel variants](/blog/python-wheels-from-tags-to-variants).
It was a major milestone that marked the transition from the initial experimentation stage into specification work.
The proto-PEP developed back then became the first iteration of [PEP 817](https://peps.python.org/pep-0817/), one that included a lengthy specification part.
However, the subsequent discussion made us realize that the design itself is far too complex to be contained in a single PEP, and we moved and split the specification part a series of documents starting with [PEP 825](https://peps.python.org/pep-0825/).
PEP 817 then became a kind of high-level guide to the overall design.

The split wasn't the only thing happening.
Between further experimentation work and the discussion, the specification itself changed a lot as well.
From the very beginning, our aim was to create a solution that will stand the test of time; find the right balance between complexity and flexibility.
The work is still far from complete and the design can still change, but I believe that we have made major progress, and things are looking better than ever.
I would like to take this opportunity to explore how the design changed since we announced it first.

## One PEP, many PEPs

Originally we wanted to pursue wheel variants as a single PEP.
The decision made sense at the time: it was a complete tested design.
You needed all the bits to see how they fit together, and without all of them, you wouldn't be able to achieve the desired user experience.
The problem is that when you try to cover everything at once - metadata, providers, plugin API, installing, building, and so on -  the specification becomes very long and hard to process.
You lose the ability to see the forest for the trees.
We tried to resolve this by replacing the original rationale section (which had to be kept cross-referenced to the specification) with a combined overview-rationale, but that did not help much.
Besides, at this point even we were finding it difficult to update the specification, given that any change created a cluster of inconsistencies.

So splitting up the PEP was clearly the way forward.
But how should we have split it?
Smaller parts are easier to debate on their own merit, but they need to be linked to the high-level design somehow.
Variant namespaces start truly making sense if you consider providers as independently governed.
We also needed to consider the risk that changes to the individual parts of the specification may require revisiting earlier PEPs.

We decided to make the first cut where providers started.
They were easily the most controversial part of the design, and attracted most of the discussion, which in turn made it hard to get feedback on more fundamental aspects such as the metadata format.
While the architecture cannot work without providers, it is entirely possible to treat them as a "black box"; specify where they fit into the design, and define an interface that a subsequent PEP has to provide.
An additional advantage of this direction is that a good foundation is universal: the provider model can change substantially, and still fit into it.

A logical place for the next cut was to split wheel building from consumption.
The providers PEP was limited to all the aspects needed to install wheels, leaving the bits specific to build backends out.

Finally, given the complexity of providers, we decided to further split the relevant PEP in two: a technical specification sufficient to build a working solution, and a governance part providing a framework to combine security with good user experience.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/peps.png"
    width="491" height="258" alt="A diagram describing the PEP structure. To the left, PEP 817 (now umbrella) is shown, at full height. To the right, there is a wide Package Format block on the bottom. Above it and to the left, an arrow points at Providers block, and further upwards into Building block. To the right of Providers and Building blocks two arrows combine and point into UX, maintenance, security, governance block." />
  <figcaption>Fig. 1. The structure of Wheel Variants PEPs</figcaption>
</figure>
</div>

We therefore settled on five PEPs so far:

1. [PEP 817](https://peps.python.org/pep-0817/) as the umbrella PEP.
2. Package Format ([PEP 825](https://peps.python.org/pep-0825/)): focused on changes to the wheel format and the initial set of variant metadata.
3. Providers ([PEP 850](https://peps.python.org/pep-0850/)): extending the Package Format PEP with providers used to determine which variant properties are supported, defining the plugin API.
4. Building: extending the Providers PEP with build backend support, `pyproject.toml` format for variant metadata, build-time bits of the plugin API.
5. UX, maintainability, security and governance: covering the introduction strategy and maintenance of a community maintained repository of trusted variant providers.

Some aspects of the design could have fit into different PEPs.
For example, the wheel selection algorithm could either be placed in the Package Format PEP, where it would operate on the data provided by the "black box" providers, in the Providers PEP, or even in a PEP of its own.
Our decision to include it in the first PEP was mostly prompted by the desire to keep the Providers PEP maximally focused.

At the time of writing, the Package Format part is provisionally accepted, and the Providers part is entering the discussion phase.
While the foundations remained the same, the specification already changed a lot.
The current design is detailed in the published PEPs 825 and 850, and presented in more general terms in the updated [PEP 817](https://peps.python.org/pep-0817/).
In the remainder of the post, I'd like to explore the differences from the [original specification discussed in the previous blog post](https://github.com/wheelnext/wheelnext/blob/a058c17c01856f439bee85c96ce498d24045afb8/docs/proposals/pepxxx_wheel_variant_support.md).

## Variant labels

Let's start with the variant label, the unique identifier added to the filename.
The early drafts of the specification used a variant hash instead, created from a serialized form of the wheel's variant properties.
Later, an explicit human-written label of up to 8 characters was permitted as a more readable alternative to that.

By the time of the [initial PEP 817 draft](https://github.com/wheelnext/peps/blob/f81a8256fc4372ad1f166afa359a7f5f768ea144/peps/pep-0817.rst), the variant hash was no longer part of the specification. 
We had kept it as the default label in the implementation (since such a hash still constituted a valid label), though.
The null variant no longer used `00000000` but a shorter `null` label.

PEP 825 removed the arbitrary length limitation, leaving the decision about filename length up to the package maintainers.
The current high-level design suggests defining all valid labels in `pyproject.toml`, rendering variant hashes entirely obsolete.

## Intermission: Providers

Providers are the core of variant wheels: they are used to determine which properties are compatible with the user's system, and therefore which variant wheel will be installed.
The original specification was based entirely on plugins that were queried at install time.
While some use cases, hardware detection on the target machine in particular, still require such an approach, we have realized that many can be solved with static metadata.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/provider-types.png"
    width="650" height="348" alt="Side-by-side comparison of three provider types. First, the original plugin approach is shown, where plugin is used both at build time to validate properties, and at install time to check system compatibility. Then, build-time plugins approach: a plugin at build time to validate and fill static-properties, but at install time the wheel has compatibility info in static-properties. Finally, the static property approach defines static-properties in pyproject.toml for build time use, and again the wheel has compatibility info in static-properties at install time." />
  <figcaption>Fig. 2. Different provider types</figcaption>
</figure>
</div>

PEP 817 therefore introduced a different kind of providers: ones using static compatibility data embedded inside the wheel.
This metadata takes over the role of the plugin, eliminating the need to install a package and run third-party code.
For example, NumPy can be built against different BLAS/LAPACK libraries.
The specific library used is a property entirely internal to the wheel.
All such variant properties are always supported, so the user can install a variant built against any library, without obtaining any additional system information.

The two approaches can also be combined: a plugin can be queried at build time, and used to fill the static compatibility data in the built wheel.
The plugin provides a single location for defining properties, so they can be used consistently across different packages.
However, since it is only used at build time, it does not introduce any overhead or code that needs to be trusted at install time.

We have also introduced an "ABI Dependency Provider" as a special case.
It is a provider that can be used to create variants built against different dependency versions.
For example, extensions built against a specific PyTorch version require the same version at runtime.
Normally, this means that a single package version supports only one PyTorch version.
By introducing these "ABI variants", this version can now easily support multiple PyTorch versions and the installer can select a wheel matching your PyTorch installation.
However, the implementation of such a provider is inherently complex, as it needs to be integrated with the dependency resolver; we therefore made it optional and defined it as a special case rather than trying to bend the plugin interface to make it work.
PEP 850 generalized this special case into a class of "built-in" providers, of which this provider is the only defined example so far.

## Variant metadata

Variant metadata carries the mapping from labels to variant properties, the provider information and variant property ordering.
It can be found inside the project's `pyproject.toml` file, in a dedicated JSON file inside the built wheel, and as an aggregated metadata file on the index.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/format-evo.png"
    width="608" height="556" alt="A side-by-side comparison of the three versions of variant metadata: pre-PEP, original PEP 817 and PEP 825/850. The first row is empty in the pre-PEP version, and contains $schema (JSON only) in the two newer versions. The second row contains the default-priorities block. In the pre-PEP and PEP 817 version, it contains three keys: namespace, feature and property. In the PEP 825 version, the two latter keys are gone and only namespace remains. The third row contains the providers block, keyed on namespace. The pre-PEP version features requires, plugin-api, optional and enable-if keys. The original PEP 817 version adds install-time key. It also adds a static-properties block below. The PEP 850 version removes enable-if, replaces install-time with build-requires (TOML only), moves static-properties into the providers block and adds feature-order. Finally, the last row contains variants; in the pre-PEP and original PEP 817 version, it's JSON only, but it's present in all formats per PEP 825/850." />
  <figcaption>Fig. 3. The evolution of variant metadata</figcaption>
</figure>
</div>

Originally, the metadata used three top-level keys: `default-priorities` with project-level ordering data, `providers` describing the used provider plugins, and `variants` that listed available variants (only in JSON).
In PEP 817, `$schema` was added to the JSON files for versioning the metadata; PEP 825 specified the use of semantic versioning, and provided the rules for changing the metadata format.
The current specification draft extends `variants` to `pyproject.toml` as well, making the format more symmetric.

`default-priorities` used to specify the ordering information for namespaces, features and individual properties.
The first one was necessary, as only the project could determine what's more important to it.
The other two enabled overriding priorities coming from the providers themselves, and were added for completeness.
They were removed in PEP 825, as they were adding unnecessary complexity and we have not found a good use case justifying it.

Along with providers, the `providers` dictionary underwent a major transformation.
Each provider used to be described using up to four keys: `requires` specifying the packages providing the plugin, `plugin-api` providing an override for its entry point, `enable-if` allowing plugins to be skipped based on environment markers, and `optional` to introduce opt-in plugins.
PEP 817 introduced a top-level `static-properties` key for providers based on static compatibility information. 
It also added an `install-time` key to the provider dictionary; if set to `false` while `requires` was specified, the plugin would be queried when building the wheel, and `static-properties` will be added to the resulting wheel.
Since dictionaries in TOML and JSON could not reliably convey dictionary key order, `default-priorities.feature` had to be used to specify the ordering of static features.

All the provider metadata was out of scope for PEP 825; PEP 850 changed it signficantly.
For a start, `enable-if` is gone entirely; we have realized that it is entirely redundant and we can skip the plugins that weren't used to build a wheel for your platform instead.
`static-properties` was moved inside the provider information dictionary, removing unnecessary duplication of namespace keys, and made mutually exclusive with `requires`.
Once `default-priorities.feature` was removed from PEP 825, `feature-order` was added to the provider information to complement static property definitions.
`install-time` was removed as well; instead, `requires` is assumed to always imply an install-time plugin, and the current high-level draft uses a `build-requires` key in `pyproject.toml` (mutually exclusive with the other key) to facilitate build-time plugin querying.
Finally, the `builtin` key was added to indicate a built-in provider.

It's worth noting that in the latest design, the provider type is effectively defined by the presence of one of four the mutually exclusive keys: `requires`, `static-properties`, `builtin` or `build-requires` (the last one only allowed in `pyproject.toml`).

## Metadata consistency

To avoid growing the amount of exchanged metadata excessively while installing variant wheels, we decided that the index-level metadata file will not provide separate information for every variant wheel, but rather that metadata will be shared between all variants for a single package version.
This implied that the individual wheels carry consistent metadata – one that can be correctly and predictably combined for the index.

The original specification recommended enforcing that both `default-priorities` and `providers` are exactly the same across all wheels.
While this assumption holds when all the wheels are built from a single `pyproject.toml`, it has been pointed out that it is needlessly limiting and it could cause issues if one builds additional kinds of variants later or wants to combine variants built separately (common for deep learning libraries which support multiple types of accelerator hardware).
PEP 817 relaxed this requirement to permit "careful merging […], as long as no conflicting information is introduced, and the resolution results within a subset of variants do not change".
PEP 825 (and then PEP 850) went ever further, explicitly specifying consistency requirements for individual metadata keys, and providing an algorithm for merging them.

The current specification permits building new variants for the same version, as long as their labels remain unique, and adding new providers, as long as that they are added to the end of `default-priorities.namespace` list.
The crucial requirement is that each new set of wheels must build upon the previous list; otherwise, it would be impossible to merge them in a reproducible way.

## Variant ordering

It is not only necessary to determine whether a particular variant can be installed, but also to select the most appropriate among the compatible wheels.
The ordering and selection algorithm remained mostly unchanged since the initial draft, although it has been rewritten multiple times in an effort to make it easier to comprehend.
PEP 825 features a culmination of that effort, one that combines a high-level overview, an example, a detailed algorithm and a pseudocode implementation.

Still, a few changes to the algorithm were made in PEP 825:

- `default-priorities.feature` and `default-priorities.property` are gone, the feature and value ordering is now defined solely by the provider
- only the best compatible value for every feature is now used to order variants, rather than all compatible values
- for the pathological case when two variants evaluate to the same sorting key, the wheels are ordered lexically by their label

## Environment markers

The original specification introduced three environment markers: `variant_properties`, `variant_features` and `variant_namespaces`.
They made it possible to define dependencies specific to a variant while keeping the dependency list invariant across different wheels.
We were also discussing the possibility of adding a marker that specifically matched against the variant label, and in PEP 817 we eventually added it as `variant_label`.

PEP 825 changed the behavior of `variant_properties` slightly.
Previously, the marker matched against all properties that the wheel was built with; now it matches against the subset of properties that are compatible with the system.
For example, you can now build a wheel supporting multiple GPUs and introduce dependencies that will be installed only when one of them is actually present (previously, the markers for all GPUs supported by the wheel would match):

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
Instead, it would receive the bounds specified in the variant metadata of the wheels, and indicate whether the requirements are met or not.

However, such a design was problematic.
Most importantly, you couldn't easily replace the plugin with static metadata.
After all, you would need to know all the possible values up front, so we were back to square one.
If one package required CUDA 12.8 and another CUDA 12.9, you'd need to explicitly cover both versions, and update your static metadata whenever you find a package with a property you didn't cover before.
For comparison, with "static" plugins you just have to query all the interesting plugins once and store their output; the resulting metadata would be compatible with all the packages using these plugins, at least until a future version introduced new properties.

In the end, we decided that "dynamic" plugins are not worth the complexity introduced, and removed them prior to PEP 817.
Formerly "static" plugins became the only kind of plugins defined, and eventually "static" became the term associated with truly static metadata.
The NVIDIA provider was rewritten to output a reasonably wide range of compatible minimum and maximum versions around the installed version, and will be updated whenever that range is no longer sufficient for the CUDA versions in use.
This is similar to how macOS versions are treated by the `packaging` library, and should work fine in practice.

## Namespaces are no longer fixed

Up to PEP 817, every variant plugin specified the namespace used by its properties.
If you used the NVIDIA provider plugin, you had to use the `nvidia` namespace.
The x86-64 CPU plugin used `x86_64`, and so on.
Conversely, you couldn't use two different providers in a single project version if they used the same namespace.
The "ABI Dependency Provider" also used a reserved namespace.

PEP 850 relaxed this.
The namespace became solely a project-side identifier.
Plugins can still declare a recommended namespace identifier via their entry point, but it exists only for convenience and doesn't need to match the namespace actually used.
The project maintainers can use any namespace for any provider as they see fit, and the `providers` metadata maps it into an actual provider.
This eliminates an unnecessary constraint and eliminates the risk of two plugins incidentally choosing the same namespace.

We also clarified that tools vendoring or reimplementing providers must recognize them by the Python package names rather than the namespaces.

## Plugin API changes

All the provider changes also meant that the plugin API fluctuated.

<div style="text-align: center">
<figure style="width: auto; margin: 0 2em; display: inline-block; verticalAlign: top">
  <img src="/posts/a-year-into-wheel-variant-work/plugin-api.png"
    width="641" height="195" alt="A side-by-side comparison of the plugin API in the pre-PEP, original PEP 817 and PEP 850 + building version. The first row contains namespace attribute that is present in the two first versions, but removed in the PEP 850 version. The second row features the dynamic attribute that is only present in the pre-PEP version. The third row is missing in the pre-PEP version; in original PEP 817 version it contains is_aot_plugin, which is then replaced by all_properties_compatible. The fourth row contains get_supported_configs function across all versions, with an optional parameter in the pre-PEP version. The final row contains validate_config in the pre-PEP version, which is replaced by get_all_configs in the two later versions." />
  <figcaption>Fig. 4. The evolution of plugin API</figcaption>
</figure>
</div>

Originally, the API defined two properties: `namespace` specifying the plugin's namespace, and `dynamic` specifying whether the plugin was "dynamic" or "static".
PEP 817 removed the concept of dynamic plugins, and a boolean `dynamic` property along with it.
However, it introduced build-time plugins (called "AoT plugins" at the time), and consequently the `is_aot_plugin` property.
PEP 850 removed fixed namespaces, and therefore the `namespace` property.
It also deferred build-time functionality into a subsequent PEP, removing `is_aot_plugin`.
The current plan is to reintroduce it as a boolean `all_properties_compatible`.
Yes, all the changes can feel a bit hard to keep up with, but if you look at the final specification, the API is cleaner than before.

The API also used to define two methods: `get_supported_configs()` that returned a list of properties compatible with the system, and `validate_property()` used to verify whether a particular property is valid to build a wheel with.
The first one had a quasi-optional `known_properties` argument that accepted an union of all the properties found in available wheels.
PEP 817 removed this argument, and reversed the property validation logic; `validate_property()` was replaced by `get_all_configs()`, returning all valid properties for a given plugin.
The new approach is symmetric with `get_supported_configs()` and more efficient.
This part of the API did not change further, beyond being split between PEP 850 and the PEP following it for the build-time part.

## Build backends

The recommended build backend interface evolved as well.
PEP 817 did not recommend a specific interface, beyond requiring that variant wheels must not be produced unless explicitly enabled and that variant metadata can be expressed in `pyproject.toml`.
Our demonstration code required passing variant properties and variant label explicitly.
For example, a NumPy x86-64-v4 MKL wheel was produced via calling:

```bash
python -m build -w \
  -Cvariant=x86_64::level::v4 \
  -Cvariant=blas_lapack::provider::mkl \
  -Cvariant-label=x86_64_v4_mkl
```

whereas a null variant would be produced via:

```bash
python -m build -w -Cnull-variant
```

The current specification draft instead defines a complete recommended interface.
All available variants are expected to be defined in `pyproject.toml`, using the `variant.variants` table with the same semantics as in built wheels.
Rather than passing properties explicitly, one passes the variant label and the backend picks the metadata from that table.
As a result, the two commands above are simplified to, respectively:

```bash
python -m build -w -Cvariant-label=x86_64_v4_mkl
python -m build -w -Cvariant-label=null
```

## The security aspect

Unsurprisingly, the most controversial part of the whole proposal was the idea that providers would be external Python packages that could be installed and executed automatically.
We had anticipated this being a problem, we highlighted it in the PEP as needing to be solved, and listed a few suggested options to mitigate the issues.
We wanted to get more feedback before proposing something more specific, but unfortunately the lack of definite solution caused the discussion to quickly derail.

In the subsequent iterations, we managed to keep gathering feedback and to keep improving the security story.
We realized that "opt-out" is not an acceptable default, and instead focused on an "opt-in" approach with specific provisions for enabling the most popular plugins by default.
To keep things truly secure, we had to combine two goals: preventing completely arbitrary packages from being installed and executed as part of wheel installation, while also preventing the proposal from introducing security fatigue.
We reasoned: if we force users to opt-in to the providers needed to install commonly used packages, the users will eventually blanket enable all providers to avoid the hassle.
This would be the worst possible outcome.

We also learned that we mustn't defer deciding which plugins can be used by default to the tool maintainers entirely, or rely on a consensus being established implicitly.
Instead, we need to establish a central authority that will maintain the repository of vetted plugins, as well as clear requirements that these plugins must meet.
This is an important enough topic that it will be covered by a separate PEP, built upon the consensus from the [security of wheel variants discussion](https://discuss.python.org/t/security-of-wheel-variants/109569).

## Getting feedback

We aren't going to be the first to point out that PEP reviews are hard.
Konstantin Schütze who is working with us on wheel variants, already wrote a post about [Friction in the Python Packaging Standards Process](https://blog.schuetze.link/friction-in-packaging-peps/).
I can share a very similar impression.

Our early threads on discuss.python.org attracted a lot of attention, and quickly grew beyond manageable size.
Once more people started replying and commenting on different aspects of the proposal, it became increasingly hard to follow the individual subthreads and find consensus.
We reached the point when any new participant would need to spend significant time rereading the existing discussion; in some cases this lead to potentially interested parties not taking part.
In fact, a number of packaging tool maintainers have explicitly said that they are unable to follow DPO discussions, which required us to request their feedback separately.

While we received much constructive feedback, we have also seen many comments that were disruptive.
We have seen people who kept repeating the same points, without being mindful that repetitive comments don't add anything and make it harder for others to participate.
We have seen people posting claims about what the PEP proposed that simply weren't true, and others quickly taking the bait without actually verifying them.
All these contributed to confusion and frustration, and made it much harder to gather consensus.

However, things improved over time.
Splitting the PEPs made it easier to comprehend the proposal and to gather focused feedback, and therefore to improve the specification.
New people joined the effort and started actively contributing, both through the WheelNext organization and independently.

## What comes next?

[PEP 825](https://peps.python.org/pep-0825/) has been provisionally accepted.
[PEP 850](https://peps.python.org/pep-0850/) is currently under discussion.
We have the building PEP initially drafted already as well, and ready to send once PEP 850 settles.
We are also starting the work on the fourth PEP, which can be discussed in parallel with the building PEP.

`variantlib`, the demo bundle of provider plugins, build backends and example projects were already updated for the latest iteration of the specification.
`scikit-build-core` and `uv` are updating their preview features for wheel variant support.
We are also working on populating our test index with the updated wheels.

This looks like a lot, especially if you consider how much time it took from the initial PEP 817 draft to the provisional acceptance of PEP 825.
However, we have good reasons to believe that things will move faster from here on.
The foundations are in place, and the complete design was improved based on the feedback received so far.
We have significantly more experience in writing PEPs now, and hopefully the new ones will require fewer iterations.
The Python Packaging Council took their seats, and hopefully will eliminate the bottleneck in specification reviews.

Our goal is to have the complete specification approved and deployed in 2027.

## Acknowledgements

Many people have been involved in the Wheel Variants work.
I would like to thank them for all their work: the contributions to the specification and implementations, their feedback, support and encouragement.
Getting where we are took a lot of effort and persistence.

Thanks to [Red Hat](https://www.redhat.com) for funding Quansight's contributions to the Wheel Variants design. Red Hat is [shipping accelerator-enabled Python packages](https://wheelnext.dev/summits/2025_03/assets/WheelNext%20Community%20Summit%20-%2006%20-%20Red%20Hat.pdf), like PyTorch, as wheels in a virtual environment as part of [Red Hat AI](https://www.redhat.com/en/products/ai), and saw the importance of improving Python packaging for heterogeneous hardware, resulting in their support for the WheelNext initiative.
