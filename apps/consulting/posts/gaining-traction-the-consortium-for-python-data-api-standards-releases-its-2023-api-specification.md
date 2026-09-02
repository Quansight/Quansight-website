---
title: 'Gaining Traction: The Consortium for Python Data API Standards Releases Its 2023 API Specification'
published: May 10, 2024
authors: [quansight]
description: "The recent revision of the array API standard marks another major milestone in the collective effort to achieve array interoperability across the Python data ecosystem. \nA recent post by Quansight Lab’s Athan Reines on the Data APIs blog shares updates on the consortium’s progress and plans for the future."
category: [PyData Ecosystem]
featuredImage:
  src: /posts/gaining-traction-the-consortium-for-python-data-api-standards-releases-its-2023-api-specification/The-Consortium-For-Python-Data-API-Standards-Releases-Its-2023-API-Specification-01.svg
  alt: 'Image of an illustration depicting the Consortium for Python Data API Standards, featuring abstract green characters representing collaboration on data access standards within the Python ecosystem.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Gaining Traction: The Consortium for Python Data API Standards Releases Its 2023 API Specification'
---

_The revision of the array API standard is now ready for adoption by conforming array libraries._

The recent revision of the array API standard marks another major milestone in the collective effort to achieve array interoperability across the Python data ecosystem.

A recent post by Quansight Labs’ Athan Reines on the [Data APIs blog](https://data-apis.org/blog/array_api_v2023_release/) shares updates on the consortium’s progress and plans for the future.

## What’s the Python Data APIs Consortium?

The Consortium for Python **[Data API Standards](https://data-apis.org/)** is a coalition of stakeholders from across the Scientific Python Ecosystem working together to create common rules and tools for how different Python libraries handle data. These libraries are used for tasks like data analysis, machine learning, and scientific computing.

By agreeing on standard ways to work with data, the Consortium aims to make it easier for developers to use multiple libraries together without running into compatibility issues. This helps improve collaboration and efficiency in the Python data ecosystem.

![Image of an illustration depicting the Consortium for Python Data API Standards, featuring abstract green characters representing collaboration on data access standards within the Python ecosystem.](/posts/gaining-traction-the-consortium-for-python-data-api-standards-releases-its-2023-api-specification/The-Consortium-For-Python-Data-API-Standards-Releases-Its-2023-API-Specification-01.svg)

> The 2023 release of the array API specification standardizes several key APIs necessary for facilitating adoption among array-consuming libraries and should help accelerate array interoperability within the Scientific Python Ecosystem.
>
> — Athan Reines, Senior Engineering Manager, Data APIs & Quansight Labs

## Standardizing Array Operations

The Array API Standard aims to standardize the fundamental building blocks of scientific computing: multi-dimensional arrays (tensors). Historically, working across different array libraries, such as NumPy, CuPy, PyTorch, JAX, and others, has been challenging due to divergent APIs and behavioral inconsistencies. The Consortium was established to facilitate coordination and provide a transparent process for standardizing array API design.

## Key Updates

The revision introduces several additions and improvements, including:

- Updates to type promotion rules and FFT API behavior to better align with the principle of requiring explicit user intent.
- Additions of several new APIs, including clip, copysign, cumulative_sum, hypot, maximum, minimum, and more, in response to feedback from downstream library maintainers.
- Formalization of a set of inspection APIs, allowing libraries to programmatically query array library capabilities, supported devices, data types, and other information. This capability is critical for downstream libraries, such as SciPy and scikit-learn, that need to support array objects from multiple libraries and devise mitigation strategies for varying hardware capabilities.

## Accelerating Adoption

On the adoption front, the past year has seen incredible progress:

- SciPy and scikit-learn have added experimental support for the Array API Standard, enabling CPU and GPU tensor support for their users.
- Major array libraries, such as NumPy, CuPy, PyTorch, and JAX, have continued pushing toward full compliance.
- Notably, the NumPy project has decided to adopt the Array API Standard in the main NumPy 2.0 namespace – a huge win for portability and a testament to the community’s belief in the standard.

## Facilitating Widespread Adoption

To further adoption, the Consortium has continued developing a comprehensive test suite for compliance testing and a compatibility layer to smooth over behavioral differences among libraries as they work toward full conformance.

Moving forward, the focus remains on driving widespread adoption and addressing gaps identified by downstream consumers. More robust tooling for compliance monitoring and increasing transparency around supported APIs and edge cases are key priorities.

The journey toward array interoperability has been a long one, but the 2023 revision shows how far we’ve come thanks to the relentless effort and coordination across the Python data community. We’re proud to be part of this collaborative effort and can’t wait to see what the future holds.

[Read the full post on the 2023 release](https://data-apis.org/blog/array_api_v2023_release/)

**Consortium members from Quansight & Quansight Labs:** Athan Reines, Ralf Gommers, Aaron Meurer, Matthew Barber, Marco Gorelli
