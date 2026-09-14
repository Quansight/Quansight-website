---
title: 'Introducing Lightweight Versions of GDAL and PDAL'
published: July 24, 2024
authors: [isuru-fernando]
description: 'Geocoding is the practice of taking in an address and assigning a latitude-longitude coordinate to it. Doing so for millions of rows can be an expensive and slow process, as it typically relies on paid API services. Learn how we saved our client time and money by leveraging open source tools and datasets for their geocoding needs.'
category: [Packaging]
featuredImage:
  src: /posts/introducing-lightweight-versions-of-gdal-and-pdal/Introducing-Lightweight-Versions-of-GDAL-and-PDAL.png
  alt: 'Introducing Lightweight Versions of GDAL and PDAL'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Introducing Lightweight Versions of GDAL and PDAL'
---

![](/posts/introducing-lightweight-versions-of-gdal-and-pdal/hobu-logo-2C.png)

_See how [Hobu](https://www.google.com/url?q=https://hobu.co/&sa=D&source=docs&ust=1721828383133768&usg=AOvVaw1y2fLe1mmVu83PXMG8fVgv) teamed with Quansight to fund the transition to a deferred plugin system in both GDAL and PDAL. The new architecture was implemented in GDAL 3.9.1 and PDAL 2.7.2._

The evolution of geospatial data processing has taken a significant step forward with the introduction of lightweight versions of the Geospatial Data Abstraction Library (GDAL) and the Point Data Abstraction Library (PDAL). This new architecture addresses the long-standing issue of dependency bloat, significantly improving solve times, download speeds, and overall package manageability for users. This post delves into the history, technical implementation, and benefits of this transition.

GDAL (Geospatial Data Abstraction Library) is a translator library for raster and vector geospatial data formats. Being a translator library supporting multiple different geospatial data formats, it has a lot of libraries as dependencies. For example The `hdf5` for HDF5 package format support. PDAL (Point Data Abstraction Library) is a library built on top of GDAL and has similar support for package formats.

## A Little Bit of History

conda-forge was started by a few people, including a couple of oceanographers, who wanted a way to distribute gdal easily. Hence `gdal-feedstock` is one of the first feedstocks to be made on conda-forge and was the 49th PR on staged-recipes. The initial commit to the `gdal-feedstock` which builds the conda package, only used a few packages, including `hdf4`, `hdf5`, , `postgresql`, `libnetcdf`, `kealib`.

Since then, more dependencies have been added to the gdal conda package and it has now grown to 113 direct and indirect dependencies (numbers based on macOS, JUL 2024). With the huge number of dependencies, the solve times and download times have increased, and images created from these conda packages are unwieldy.

This is where the partnership with Hobu and Quansight comes in to fund the transition to a deferred plugin system in both GDAL and PDAL. The new architecture was implemented in GDAL 3.9.1 and PDAL 2.7.2.

## Deferred C++ plugin loading

GDAL RFC 96 enables the support of deferred plugins. Plugins in GDAL support the various raster and vector geospatial data formats. These plugins are usually built into the core library, `libgdal.(dylib/so/dll)` , but RFC 96 introduced deferred plugins that build these plugins separately such that only the necessary plugin dependencies are needed.

For example, instead of HDF5 being a dependency of `libgdal.(dylib/so/dll)` , there’s a new `gdal\_HDF5.(dylib/so/dll)` which has an HDF5 dependency and is loaded by the libgdal core library.

This allows us to package the plugins as separate conda packages and therefore the core library can remain small while enabling full functionality of GDAL through these plugins. A nice feature of RFC 96 is that the core libgdal library will output a customizable error message when a plugin fails to load. For example when the hdf5 plugin is in a separate package called libgdal-hdf5, we can introduce an error message that says

You may install it with ‘conda install -c conda-forge libgdal-hdf5’.

This concept was first used for `libarrow/libparquet` dependency since it is a large dependency and especially because gdal supports four different major versions on conda-forge. By separating this dependency, only the plugin needs to be built for the four different arrow/parquet versions as opposed to the core libgdal library being built for the four different versions. The conda package for the plugin was called `libgdal-arrow-parquet` and depended on the core library conda package `libgdal` which included the rest of the plugins.

## libgdal-core and libgdal

In order to generalize the above strategy to more plugins, we are now introducing a `libgdal-core` conda package and more plugins as conda packages with all plugins (except arrow/parquet) being installable with `libgdal` . We also made the python bindings depend on `libgdal-core` instead of `libgdal` so that users can select the plugins that they need.

gdal conda packages

– `libgdal-core` – core C++ library  
– `libgdal` – core C++ library and all plugins  
– `gdal` – python library without the plugins

gdal plugin conda packages

– `libgdal-arrow-parquet` : `vector.arrow` and `vector.parquet` drivers as a plugin  
– `libgdal-fits` : `raster.fits` driver as a plugin  
– `libgdal-grib` : `raster.grib` driver as a plugin  
– `libgdal-hdf4` : `raster.hdf4` driver as a plugin  
– `libgdal-hdf5` : `raster.hdf5` driver as a plugin  
– `libgdal-jp2openjpeg` :`raster.jp2openjpeg` driver as a plugin  
– `libgdal-kea` : `raster.kea` driver as a plugin  
– `libgdal-netcdf`: `raster.netcdf` driver as a plugin  
– `libgdal-pdf`: `raster.pdf` driver as a plugin  
– `libgdal-postgisraster`: `raster.postgisraster` driver as a plugin  
– `libgdal-pg`: `vector.pg` driver as a plugin  
– `libgdal-tiledb` : `raster.tiledb` driver as a plugin  
– `libgdal-xls`: `vector.xls` driver as a plugin

`libgdal` has 113 direct/indirect dependencies, but `libgdal-core` has only 48 direct/indirect dependencies.

If you are missing plugins with the new split, you can install all the plugins by running:

```python
    conda install libgdal
```

To install all the plugins or install individual plugins:

```python
    conda install libgdal-hdf5
```

Currently only the python bindings `gdal` depend on `libgdal-core` and in the future more and more downstream packages of `libgdal` will depend on `libgdal-core` and individual plugins needed for their usage. Therefore we recommend either installing `libgdal` or explicitly installing the individual plugins.

We looked at the install times for `libgdal` vs `libgdal-core` on Github actions and `libgdal-core` was faster. We also noticed that `libboost-headers` was being pulled by `libkml` which is only needed for development. We split the `libkml` conda package into `libkml` and `libkml-devel` so that end users are not going to end up with the `libboost-headers` which has thousands of header files.

**OS**

**libgdal without KML split**

**libgdal with KML split**

**libgdal-core**

Windows

3m 8s

1m 6s

43s

Linux

28s

21s

16s

macOS

27s

22s

15s

Note that the timings are from a quick testing on Github actions and not formal benchmarking.

## libpdal and libpdal-core

Similar to `libgdal` and `libgdal-core` , we have introduced `libgdal` and `libgdal-core` conda packages. Previously the `pdal` conda package provided only the C++ library, but now it also provides the python package to match the `gdal` conda package.

pdal conda packages

– `libpdal-core` – core C++ library  
– `libpdal` – core C++ library and all plugins  
– `pdal-python` – python library without the plugins  
– `pdal` – python library and all plugins

pdal plugin conda packages

– `libpdal-trajectory` : `filters.trajectory` driver as a plugin  
– `libpdal-hdf` : `readers.hdf` driver as a plugin  
– `libpdal-tiledb`: `readers.tiledb`, `writers.tiledb` driver as a plugin  
– `libpdal-pgpointcloud`: `readers.pgpointcloud` driver as a plugin  
– `libpdal-draco` : `readers.draco`, `writers.draco` driver as a plugin  
– `libpdal-arrow`: `readers.arrow`, `writers.arrow` driver as a plugin  
– `libpdal-nitf`: `readers.nitf` driver as a plugin  
– `libpdal-e57`: `readers.e57`, `writers.e57` driver as a plugin  
– `libpdal-icebridge`: `readers.icebridge` driver as a plugin  
– `libpdal-cpd` : `filters.cpd` driver as a plugin

The shift to a deferred plugin system in GDAL and PDAL is a pivotal moment in geospatial data processing, offering a more efficient and streamlined approach to handling dependencies. By enabling the separation of core libraries and plugins, users can now enjoy faster installation times and a more manageable set of dependencies tailored to their specific needs. The collaboration between Hobu and Quansight has not only modernized these essential libraries but has also set a new standard for the development and distribution of geospatial tools.

## Acknowledgements

This work was funded by [Hobu, Inc](https://hobu.co/) in collaboration with Quansight, Inc.
