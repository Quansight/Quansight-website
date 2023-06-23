---
title: 'Design of the Versioned HDF5 Library'
published: September 29, 2020
author: [aaron-meurer]
description: "In this post, we'll go into detail on how the underlying design of the library works on a technical level. Versioned HDF5 is a library that wraps h5py and offers a versioned abstraction for HDF5 groups and datasets."
category: [PyData ecosystem]
featuredImage:
  src: /posts/design-of-the-versioned-hdf5-library/versioned-hdf5-design-2.svg
  alt: 'Example dataset made with Versioned HDF5'
hero:
  imageSrc: /posts/design-of-the-versioned-hdf5-library/blog_hero_var1.svg
  imageAlt: 'An illustration of a brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

In a [previous
post](https://labs.quansight.org/blog/introducing-versioned-hdf5), we
introduced the Versioned HDF5 library and described some of its features. In
this post, we'll go into detail on how the underlying design of the library
works on a technical level.

Versioned HDF5 is a library that wraps h5py and offers a versioned abstraction
for HDF5 groups and datasets. Versioned HDF5 works fundamentally as a
[copy-on-write](https://en.wikipedia.org/wiki/Copy-on-write) system. The basic
idea of copy-on-write is that all data is effectively immutable in the
backend. Whenever a high-level representation of data is modified, it is
copied to a new location in the backend, leaving the original version intact.
Any references to the original will continue to point to it.

At a high level, in a versioned system built with copy-on-write, all data in
the system is stored in immutable blobs in the backend. The immutability of
these blobs is often enforced by making them
[content-addressable](https://en.wikipedia.org/wiki/Content-addressable_storage),
where the blobs are always referred to in the system by a cryptographic hash
of their contents. Cryptographic hashes form a mapping from any blob of data
to a fixed set of bytes, which is effectively one-to-one, meaning if two blobs
have the same hash, they must be exactly the same data. This means that it is
impossible to mutate a blob of data in-place. Doing so would change its hash,
which would make it a different blob, since blobs are referenced only by their
hash.

Whenever data for a version is committed, its data is stored as blobs in the
backend. It may be put into a single blob, or split into multiple blobs. If it
is split, a way to reconstruct the data from the blobs is stored. If a later
version modifies that data, any blobs that are different are stored as new
blobs. If the data is the same, the blobs will also be the same, and hence
will not be written to twice, because they will already exist in the backend.

At a high level, this is how the git version control system works, for example
([this is a good talk](https://www.youtube.com/watch?v=lG90LZotrpo) on the
internals of git). It is also how versioning constructs in some modern
filesystems like APFS and Btrfs.

## Versioned HDF5 Implementation

In Versioned HDF5, this idea is implemented using two key HDF5 primitives:
chunks and virtual datasets.

In HDF5, datasets are split into multiple chunks. Each chunk is of equal size,
which is configurable, although some chunks may not be completely full. A
chunk is the smallest part of a dataset that HDF5 operates on. Whenever a
subset of a dataset is to be read, the entire chunk containing that dataset is
read into memory. Picking an optimal chunk size is a nontrivial task, and
depends on things such as the size of your L1 cache and the typical shape of
your dataset. Furthermore, in Versioned HDF5 a chunk is the smallest amount of
data that is stored only once across versions if it has not changed. If the
chunk size is too small, it would affect performance, as operations would
require reading and writing more chunks, but if it is too large, it would make
the resulting versioned file unnecessarily large, as changing even a single
element of a chunk requires rewriting the entire chunk. Versioned HDF5 does
not presently contain any logic for automatically picking a chunk size. The
[pytables
documentation](https://www.pytables.org/usersguide/optimization.html) has some
tips on picking an optimal chunk size.

Because chunks are the most basic HDF5 primitive, Versioned HDF5 uses them as
the underlying blobs for storage. This way operations on data can be as
[performant as
possible](https://labs.quansight.org/blog/versioned-hdf5-performance/).

[Virtual datasets](http://docs.h5py.org/en/stable/vds.html) are a special kind
of dataset that reference data from other datasets in a seamless way. The data
from each part of a virtual dataset comes from another dataset. HDF5 does this
seamlessly, so that a virtual dataset appears to be a normal dataset.

The basic design of Versioned HDF5 is this: whenever a dataset is created for
the first time (the first version containing the dataset), it is split into
chunks. The data in each chunk is hashed and stored in a hash table. The
unique chunks are then appended into a `raw_data` dataset corresponding to the
dataset. Finally, a virtual dataset is made that references the corresponding
chunks in the raw dataset to recreate the original dataset. When later
versions modify this dataset, each modified chunk is appended to the raw
dataset, and a new virtual dataset is created pointing to corresponding
chunks.

For example, say we start with the first version, `version_1`, and create a
dataset `my_dataset` with `n` chunks. The dataset chunks will be written into the
raw dataset, and the final virtual dataset will point to those chunks.

<img width="296pt" height="129pt" src="/posts/design-of-the-versioned-hdf5-library/versioned-hdf5-design-1.svg"/>

If we then create a version `version_2` based off `version_1`, and modify only
data contained in CHUNK 2, that new data will be appended to the raw dataset,
and the resulting virtual dataset for `version_2` will look like this:

<img width="515pt" height="153pt" src="/posts/design-of-the-versioned-hdf5-library/versioned-hdf5-design-2.svg"/>

Since both versions 1 and 2 of `my_dataset` have identical data in chunks other than
CHUNK 2, they both point to the exact same data in `raw_data`. Thus, the
underlying HDF5 file only stores the data in version 1 of `my_dataset` once, and
only the modified chunks from `version_2`'s `my_dataset` are stored on top of that.

All extra metadata, such as attributes, is stored on the virtual dataset.
Since virtual datasets act exactly like real datasets and operate at the HDF5
level, each version is a real group in the HDF5 file that is exactly that
version. However, these groups should be treated as read-only, and you should
never access them outside of the Versioned HDF5 API (see below).

## HDF5 File Layout

Inside of the HDF5 file, there is a special `_versioned_data` group that holds
all the internal data for Versioned HDF5. This group contains a `versions`
group, which contains groups for each version that has been created. It also
contains a group for each dataset that exists in a version. These groups each
contain two datasets, `hash_table`, and `raw_data`.

For example, consider a Versioned HDF5 file that contains two versions,
`version1`, and `version2`, with datasets `data1` and `data2`. Suppose also
that `data1` exists in both versions and `data2` only exists in `version2`.
The HDF5 layout would look like this

```
/_versioned_data/
├── data1/
│   ├── hash_table
│   └── raw_data
│
├── data2/
│   ├── hash_table
│   └── raw_data
│
└── versions/
    ├── __first_version__/
    │
    ├── version1/
    │   └── data1
    │
    └── version2/
        ├── data1
        └── data2
```

`__first_version__` is an empty group that exists only for internal
bookkeeping purposes.

The `hash_table` datasets store the hashes for each chunk of data, so that
duplicate data will not be written twice, and the `raw_data` dataset stores
the chunks for all versions of a given dataset. It is referenced by the
virtual datasets in the corresponding version groups in `versions/`. For
example, the chunks for the data `data1` in versions `version1` and `version2`
are stored in `_versioned_data/data1/raw_data`.

## Versioned HDF5 API

The biggest challenge of this design is that the virtual datasets representing
the data in each versioned data all point to the same blobs in the backend.
However, in HDF5, if a virtual dataset is written to, it will write to the
location it points to. This is at odds with the immutable copy-on-write
design. As a consequence, Versioned HDF5 needs to wrap all the h5py APIs that
write into a dataset to disallow writing for versions that are already
committed, and to do the proper copy-on-write semantics for new versions that
are being staged. Several classes that wrap the h5py Dataset and Group objects
are present in the `versioned_hdf5.wrappers` submodule. These wrappers act
just like their h5py counterparts, but do the right thing on versioned data.
The top-level `versioned_hdf5.VersionedHDF5File` API returns these objects
whenever a versioned dataset is accessed. They are designed to work seamlessly
like the corresponding h5py objects.

The Versioned HDF5 library was created by the [D. E. Shaw
group](https://www.deshaw.com/) in conjunction with
[Quansight](https://www.quansight.com/).

<img src="/posts/design-of-the-versioned-hdf5-library/black_logo_417x125.png" width="200" class="center"/>
