---
title: 'PyTorch Progress as a General-Purpose Array-Oriented Computational Backend'
published: May 31, 2024
authors: [quansight]
description: 'This post was created from Travis Oliphant’s keynote at PyTorch Conference 2023. The full recording is linked below. In recent'
category: [Artificial Intelligence]
featuredImage:
  src: /posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-fix.png
  alt: 'PyTorch Progress as a General-Purpose Array-Oriented Computational Backend'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'PyTorch Progress as a General-Purpose Array-Oriented Computational Backend'
---

_This post was created from Travis Oliphant’s keynote at PyTorch Conference 2023. The full recording is linked below._

In recent years, the landscape of scientific and engineering computing has undergone a transformative shift, propelled by advancements in array-oriented programming. At the heart of this evolution lies the SciPy, PyData, and SciPyData ecosystems, which have long relied on N-dimensional arrays and tensor operations to perform complex calculations. With foundational libraries like NumPy leading the way, domain experts have been able to write sophisticated algorithms using high-level tensor primitives for nearly three decades. As the demand for deep learning and other high-performance computing applications has surged, the ecosystem has expanded to include a multitude of array objects, culminating in the development of the Array API. This initiative, supported by Quansight and other key stakeholders, aims to standardize and simplify array computing across diverse hardware platforms. In the current environment, PyTorch has emerged as a practical deep-learning framework and a versatile backend for general-purpose array operations, promising seamless interoperability.

**Travis Oliphant**, the CEO of Quansight, is uniquely positioned to explain PyTorch’s progress as a general-purpose array-oriented computational backend due to his extensive contributions to the Python scientific computing community. He founded and developed key projects like NumPy and SciPy, which are fundamental to array-oriented programming, and has consistently driven the integration of these tools with modern machine learning frameworks. Under his leadership, Quansight has been at the forefront of standardizing array APIs and enhancing PyTorch’s interoperability with other scientific libraries, ensuring that his insights are deeply informed and relevant.

![](/posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-1.png)

## A Foundation for Data Science

**Travis:** “I’ve spent a long time in the world of scientific array computing. I started the SciPy project as a graduate student. Then, I wrote NumPy as a professor to give scientists the tools to do what they want. (Then others contributed to the stack.) Pandas came later, followed by Numba and Dask. Numba is a compiler, and Dask is a distributed array and data frame computing system. These libraries have been growing in the ecosystem, forming a foundation for science. One estimate says that 25% of all science is done with these tools. It’s an amazing statistic. Things like black holes and gravitational waves have been discovered (with the help of these tools).

“Around 2015-2016, deep learning libraries started to emerge. All of a sudden, this promise of incredible power from stitching a bunch of arrays together at scale, putting it on GPUs, and doing GPU calculations started to take over. Things like TensorFlow and PyTorch started to emerge and drive a lot of the discussion.”

![](/posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-3.png)

## Standardizing Data APIs

**Travis:** “For a long time now, we’ve shown diagrams (like the one above) in the community, showing how there’s a foundation of libraries that work together: NumPy and SciPy at the bottom and then TensorFlow and PyTorch at the top. As we’ve seen, PyTorch is becoming a central point in array computing. It’s no longer (at the surface). Essentially, PyTorch should be driving farther and farther down the stack. However, to do that, it has to be able to work with the existing libraries: scikit-learn, SciPy, any number of ML models, and so forth. They all want to use the power of the torch compile and the power to go to GPU and TPU, but how do we make that possible?”

![](/posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-4.png)

**Travis:** “We’ve been working on a [Data API standard](https://data-apis.org) for a while at [Quansight Labs](https://labs.quansight.org/). When I noticed this happening (long ago), I wrote NumPy to merge two array libraries, Numarray and Numeric, to help this fledgling community grow. Fast forward to 2016-2017, and the Array Community is fractured even more. The idea was to create an array and data frame standard and start working on that. We did it as a consortium, with Quansight Labs leading and many other folks sponsoring and helping, the focus being interoperability, allowing libraries to work together. The focus was on interoperability to make it easy for domain experts, people who just want to get their stuff done, to get code to run without worrying about which library, which hardware, and which stack to worry about; can they all work together well?”

![](/posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-5.png)

## Automatic Differentiation

**Travis:** “Many people have spent a lot of mental energy using the NumPy Array API, the NumPy API, and Pandas APIs, so people don’t have to learn a new user interface to do the minimally invasive computing they want on a GPU; this led to PyTorch as an Array API backend. Fortunately, we’ve been working with Meta for several years, and we have a large team working on PyTorch and helping connect it to the ecosystem of array computing, that is, SciPy and the PyData ecosystem. So, PyTorch is the right back end, making sure everything is compatible and the learning curve is shallow. That’s one of the reasons PyTorch grew in popularity; there wasn’t a significant learning curve for somebody already familiar with Python array processing. They could just plug PyTorch in.

“The features, though, are key: Make sure it works on CPU, GPU, and potential new hardware (out of the box). Automatic differentiation is a clear reason people like to see complex models built with PyTorch, making sure you can build an ecosystem where PyTorch stays focused on what it does well, allowing everything else to do what it does well.”

![](/posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-6.png)

**Travis:** “(The image above is) an example of what it means to have this data area, this backend, that allows you to specify inside scikit-learn and set the configuration to Array API dispatch. Once you do that and import Torch, you can have a Torch array and then pass that into a standard scikit-learn function, and it’ll know it can call PyTorch on the back end instead of Numpy. With minor changes to scikit-learn, small changes upstream, and this Array API compatibility library, you can quickly get your code running on PyTorch.

“So, that’s what we’re doing! We’re excited to continue with the interoperability.”

![](/posts/pytorch-progress-as-a-general-purpose-array-oriented-computational-backend/Travis-Oliphant_-PyTorch-Conference-Keynote-7.png)

As we look to the future, integrating PyTorch as a general-purpose array-oriented computational backend marks a significant milestone in the evolution of scientific computing. By adhering to the Array API standards and fostering interoperability with libraries like SciPy and scikit-learn, PyTorch enables a more cohesive and efficient ecosystem for researchers and engineers. This collaborative effort between Quansight and other contributors simplifies the development workflow. As array-oriented programming continues to drive innovation, the ongoing commitment to standardization and compatibility will aid the scientific community in tackling increasingly complex challenges with greater ease and precision.

Need to know more? Come see us at Quansight. We provide services to help you connect your hardware to PyTorch, use PyTorch more effectively, build generative AI, and perform large language model services.

[Watch the video](https://www.youtube.com/watch?v=aFal9-SJjGY)
