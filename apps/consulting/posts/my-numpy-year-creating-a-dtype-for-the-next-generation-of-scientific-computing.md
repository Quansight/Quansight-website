---
title: 'My NumPy Year: Creating a DType for the Next Generation of Scientific Computing'
published: October 18, 2024
authors: [nathan-goldbaum]
description: 'First, I’ll start with a brief history of strings in NumPy to explain how strings worked before NumPy 2.0 and why it was a little bit broken.'
category: [Numerical Computing]
featuredImage:
  src: /posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/My_Numpy_Year.png
  alt: 'My NumPy Year: Creating a DType for the Next Generation of Scientific Computing'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'My NumPy Year: Creating a DType for the Next Generation of Scientific Computing'
---

![](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/Pandas_logo.svg.png)

_From no CPython C API experience to shipping a new DType in NumPy 2.0._

This project was a mix of challenges and learning as I navigated the CPython C API and worked closely with the NumPy community. I want to share a behind-the-scenes look at my work on introducing a new string DType in NumPy 2.0, mostly drawn from [a recent talk I gave at SciPy](https://www.youtube.com/watch?v=cUhP0OCSWsk). In this post, I’ll walk you through the technical process, key design decisions, and the ups and downs I faced. Plus, you’ll find tips on tackling mental blocks and insights into becoming a maintainer.

By the end, I hope you’re going to have the answers to these questions:

- What was wrong with NumPy string arrays before NumPy 2.0, and why did they need to be fixed?
- How did the community fund the work that fixed it?
- How did I become a NumPy maintainer in the midst of that?
- How did I start working on the project that helped fix NumPy strings?
- What cool new feature did I add to NumPy?

## A Brief History of Strings in NumPy

First, I’ll start with a brief history of strings in NumPy to explain how strings worked before NumPy 2.0 and why it was a little bit broken.

### String Arrays in Python 2

Let’s go back to Python 2.7 and look at how strings worked in NumPy before the Python 3 Unicode revolution. I actually compiled Python 2 in 2024 to make this post. It doesn’t build on my ARM Mac, but it does compile on Ubuntu 22.04. Python 2 `"strings"` were what we now call byte strings in Python 3 – arrays of arbitrary bytes with no attached encoding. NumPy string arrays had similar behavior.

```python
Python 2.7.18 (default, Jul  1 2024, 10:27:04)
>>> import numpy as np

>>> np.array(["hello", "world"])
array(['hello', 'world'], dtype='|S5')

>>> np.array(['hello', '☃'])
array(['hello', '\xe2\x98\x83'], dtype='|S5')
```

Let’s say you create an array with the contents `“hello", "world”`, you can see it gets created with the DType `“S5”`. So, what does that mean? It means it’s a Python 2-string array with five elements, five characters, or five bytes per array (characters and bytes are the same thing in Python 2).

It sort of works with Unicode if you squint at it. For instance, I wrote `'hello',` ‘☃’ and if you happen to know the UTF-8 bytes for Unicode `'snowman'`, it’s `'\xe2\x98\x83'`. So, it’s just taking the UTF-8 bytes from my terminal and putting them straight into the array.

![Diagram illustrating the memory layout of a NumPy string array. It shows two elements in the array: the first element contains the characters 'h', 'e', 'l', 'l', and 'o', and the second element contains encoded bytes represented as '\xe2', '\x98', '\x83', followed by two null bytes 'b\x00'. The array elements are labeled as 'arr[0]' and 'arr[1]'.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image1.png)

Here, we have the bytes in the Python 2 string array: the ASCII byte for `'h'`, the ASCII byte for `'e'`, and over in the second element of the array is the UTF-8 bytes for the Unicode snowman. It’s also important to know that for these fixed-width strings—if you don’t fill up the width of the array, it just adds zeros to the end, which are null bytes.

```python
>>> arr = np.array([u'hello', u'world'])
>>> arr
array([u'hello', u'world'], dtype='<U5')
```

Python 2 also had this Unicode type, where you could create an array with the contents `'hello', 'world'`, but as Unicode strings, and that creates an array with the DType `'U5'`. This works, and it’s exactly what Python 2 did with Unicode strings. Each character is a UTF-32 encoded character, so four bytes per character

![Diagram showing the memory layout of a NumPy string array using UTF-32 encoding. It displays two elements: 'arr[0]' contains the characters 'h', 'e', 'l', 'l', 'o', and 'arr[1]' contains the characters 'w', 'o', 'r', 'l', 'd'. Each character is represented with a prefix 'u' indicating Unicode representation. A detailed inset illustrates the UTF-32 encoding for the character 'h', represented as 'u'h'' with its corresponding byte sequence 'b'h\x00\x00\x00'.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image2.png)

### String Arrays in Python 3

```python
>>> arr = np.array(['hello', 'world'])
>>> arr
array(['hello', 'world'], dtype='<U5')
```

In Python 3, they made this the default since Python 3 strings are Unicode strings, and that was the pragmatic, easy decision, but I argue it was a bad decision—and here’s why:

```python
>>> arr.tobytes()
b'h\x00\x00\x00e\x00\x00\x00l\x00\x00\x00l\x00\x00\x00o\x00\x00\x00w\x00\x00\x00o\x00\x00\x00r\x00\x00\x00l\x00\x00\x00d\x00\x00\x00'
```

If we look at the bytes actually in the array, these are all ASCII characters, so they really only need one byte, which means there’s a bunch of zeros in the array that are just wasted. You’re using four times as much memory than is actually needed to store the array.

To make matters worse, string operations were slow, too. In a [blog post that a colleague of mine at Quansight Labs, Lysandros Nikolaou, wrote](https://labs.quansight.org/blog/numpy-string-ufuncs), he did a project where he rewrote the loops for UFunc operations using the fixed-width string DTypes (the “S” and “U” DTypes I mentioned earlier).

![Slide titled 'String operations were inefficient too!' The slide includes a blog post preview titled 'Writing fast string ufuncs for NumPy 2.0' by Lysandros Nikolaou, published on May 21, 2024, on labs.quansight.org. The slide also features two bar charts showing the performance speed-up of string operations for 1000-element arrays of 2-character strings and 2-element arrays of 1000-character strings. The operations measured include 'isalpha', 'add', 'find', and 'startswith', with speed-ups ranging from 4x to 492x. Additionally, a code snippet illustrates the process of calling corresponding string methods within a loop.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image3.png)

Before, it was written in C as a Python for-loop over the elements of the array. For each element of the array, it would create a scalar, call the string operation on that scalar, and then stuff the results into the result array. As you can imagine, that’s pretty slow. But by rewriting it to loop over the array buffer without accessing each item as a scalar, you can make it anywhere from 500 times faster for small two-element arrays or two to five times faster for longer strings

### Object Arrays

Another thing people have done, and what they’ve defaulted to because of these issues with Unicode strings in NumPy, is to use object arrays.

```python
>>> arr = np.array(
	['this is a very long string', np.nan, 'another string'],
	dtype=object
)
>>> arr
array(['this is a very long string', nan, 'another string'],
  	dtype=object)
```

You can create an array in NumPy with `dtype=object` and it stores the Python strings and Python objects that you put into the array directly. These are references to Python objects. If we call `np.isnan` on the second element of the array, you get back `np.True_` because the object is `np.nan`, and the other elements are python strings stored directly in the array.

```python
>>> arr = np.array(
	['this is a very long string', np.nan, 'another string'],
	dtype=object
)
>>> np.isnan(arr[1])
np.True_

>>> type(arr[0])
str
```

## Ecosystem-wide Technical Debt

However, the choice to go with object arrays as the default for string arrays is basically _ecosystem-wide technical debt_. For example, this has had a significant impact on pandas. If we create a pandas DataFrame with one column of names and look at that column, we will see that it’s actually backed by a NumPy object array. This has caused an enormous amount of pain for pandas over the years because object arrays are slow – somewhat of an unloved feature that can’t possibly work as efficiently or seamlessly as the rest of NumPy.

![Screenshot showing Pandas DataFrame code example and GitHub issues about string data types, including PDEP-10 and PDEP-15 proposals for string handling.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image4.png)

There was a proposal to replace the object string arrays with PyArrow strings ([PDEP-10](https://pandas.pydata.org/pdeps/0010-required-pyarrow-dependency.html)), which was accepted. However, since PyArrow is a big dependency, they are now trying to decide whether or not to make PyArrow a required dependency, and [PDEP-14](https://pandas.pydata.org/pdeps/0014-string-dtype.html) and [PDEP-15](https://pandas.pydata.org/about/roadmap.html) are follow-ups to this. It’s all mixed up, and there are now four or five different string DTypes in pandas, which is just kind of a mess.

![community-impact-astropy](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image5.png)

Another community impact example is Astropy. Astropy has something inside it called the [Unicode Sandwich](https://github.com/astropy/astropy/pull/5700). It generated a pull request with 66 comments. There is [another issue](https://github.com/astropy/astropy/issues/9614) that opened two years after this feature was added, and the person who wrote the original pull request commented, “I don’t know how to fix this. Why can’t NumPy just fix itself?” Astropy had to do a lot to work around NumPy’s bad Unicode string default.

The NumPy project was very much aware of this. In 2017, Julian Taylor proposed to the mailing list that the Python 3 four-byte UTF-32 encoding wasn’t great and something should be done about it. This generated [a lot of discussion](https://mail.python.org/archives/list/numpy-discussion@python.org/thread/MUNE4LOURC6BV63G4YQ2J42MBF5DJCM5/#H4BOHISULYF5PQT7R3TMPFC4RIN3M45N) (As you can see below).

![Screenshot of a threaded discussion on NumPy's mailing list about string array representation, showing multiple responses and nested replies from contributors.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/Python-Mailing-List-Numpy-Year-Nathan-Goldbaum2-1024x1024.png)

Out of this discussion, we added the need for a new string DType, something that works sort of like `'dtype=object'` but is type-checked to the [NumPy roadmap](https://numpy.org/neps/roadmap.html). We also discussed adding a variable-width string DType with UTF-8 encoding.

Three years later, not much had happened inside NumPy to fix the string DType situation, but lots of work was happening to improve NumPy’s DType infrastructure and make it possible to solve this issue and many other issues that could be solved by defining a new DType. When that work was starting to shape up in late 2019, when NASA had a funding opportunity through the [ROSES Grant](https://science.nasa.gov/wp-content/uploads/2024/04/roses24-ostfl.pdf), many projects across the ecosystem saw an opportunity to fix long-standing issues. Pandas, Scikit-learn, SciPy, and NumPy collectively proposed a grant with [Quansight Labs](https://labs.quansight.org/) leading it. Cal Poly San Luis Obispo, through Matt Haberland, and Los Alamos National Labs, through Tyler Reddy, were also involved. I’m not going to go through everything we did in this grant, but these were all big, fundamental improvements to these libraries. A lot of the maintenance for these libraries has been paid for out of these grants for the past few years. One of the things proposed in this grant was a variable-width string DType for NumPy.

![Career timeline showing progression from galaxy simulations to software engineering at Quansight, with programming languages and skills listed below each role.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image7.png)

## That’s Where I Come In

I want to back up and talk about myself for a minute. I have a PhD in astrophysics from UC Santa Cruz, where I did simulations of galaxies on supercomputers. The technical skills I learned from that were 1990s-style C++ and Python. After that, I did a postdoc and later became a research scientist at the University of Illinois, where I worked as a maintainer for the [yt project](http://yt-project.org). There, I learned a lot of scientific Python skills (particularly working with Cython) and open source maintainership skills. All that to say, when I came to NumPy, I wasn’t coming in from zero with no systems programming or maintainer experience.

After leaving academia in 2019, I did a batch at the [Recurse Center](http://recurse.com), where I worked on some Rust projects, so I have some Rust experience as well. Then, I came to work at Quansight, where I mostly worked on PyTorch. I learned a lot of modern C++ and pybind11 there, gaining some skills, though not necessarily a 100% overlap with what was needed for this project

![Email from Nathan to Ralf inquiring about software roles at Quansight, dated Oct 3, 2022, with a friendly greeting and brief message.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image8.png)

Two years later, after I initially left Quansight at the beginning of the pandemic, I was looking for a job again. I reached out to my manager, Ralf Gommers–a key contributor to NumPy–on the off chance that they might be looking for someone to do software work. It turned out they had this NASA grant and needed somebody to implement a variable-width string DType in NumPy. They also needed a U.S. citizen, as the funding was through the NASA grant—so there I was.

We needed to build a variable-width string DType in C using the NumPy C API and then ship it in NumPy. How do you actually do that?

## Getting Started and Getting Help

How do you get started on a big project like that, and how do you get help? Often, projects will have public channels where you can ask questions. NumPy has a [Slack channel](https://numpy.org/community/#slackhttpsnumpy-teamslackcom). Anybody can join, and anyone can ask questions. Often, projects will have some kind of channel like that—use it, that’s what it’s for.

![Screenshot of 'Getting Started and Getting Help' slide showing community engagement tips, with examples of async chat channels and Zoom meeting announcements for NumPy project.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image9.png)

Another nice thing is to look for interesting or project-relevant bugs—bugs that might be related to the code you’re going to touch later for the project. Try to fix them to get acclimated to the codebase. Another great thing that NumPy has, which I think other projects should adopt if they don’t, is regular face-to-face Zoom meetings. It’s so important to change someone from just a GitHub handle communicating through text to a human face with emotions. So many conflicts can be diffused just by talking to someone.

We had a face-to-face talk with Sebastian Berg, a NumPy maintainer, and Peyton Murray, who had been working on this project before me but had left to work on other things. I took over for him. We were discussing how to actually implement this

![Technical diagram showing NumPy array structure with pointers, featuring code example creating string array and memory layout showing size (28 bytes) and heap address pointing to data.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image10.png)

Above, here’s a diagram of what a string array in Python 3 looks like. If you want to access the second element of the array, you need to offset five UTF-32 characters into the array. You can usually just take the address of the zeroth element and add \*i\* times the size of an individual array element, and that gives you the \*i\*-th element of the array.

But with variable-width strings, you have to do something else unless you want to store the string data in two memory buffers, one storing the strings and another storing the offsets into the string data where each array element starts. The offsets array can be accessed just like a normal NumPy array.

The problem with that approach is that NumPy doesn’t offer a way to store data outside of the array buffer—there’s no concept of “sidecar storage” in NumPy.

![Technical diagram showing NumPy array structure with pointers, featuring code example creating string array and memory layout showing size (28 bytes) and heap address pointing to data.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image11.png)

The idea we came up with was to use an array of pointers. Each element of the array would hold a C struct that has a size and another pointer. The size tells you how big the heap allocation is, and the address is just the address of the heap allocation. If you dereference the pointer, it gives you the contents of the entry in the array.

So, the actual array buffer doesn’t contain any string data—it contains pointers to the actual string data. This is similar to how object arrays work, except instead of pointers to Python objects, they’re pointers to strings.

## Building A DType From Scratch

To actually build it, we decided to make a prototype. It’s good to work in a public repository but not necessarily in the main project repository since exploratory work can be noisy and attract unnecessary attention from developers who aren’t working on your project. People who are interested in the project can still subscribe to your repo, and you can still do code review, but it may not be as rigorous as if it were a real contribution. Making the barrier to commit code low is critical for exploratory coding like this.

It’s also important to ramp up the project slowly. I was learning the DType C API, so I built a `metadata dtype` first, which is just a float with a dict attached to it. It wraps a float, basically. Then I made an ASCII DType, which is like a fixed-width text DType but only stores ASCII text. These steps are in the direction of what I wanted to build but are simpler. After that, I started working on the real UTF-8 string DType.

As a side note, the NumPy 2.0 DType API makes it much easier to support different kinds of data. If you’ve ever felt like NumPy needed better support for custom data types and found it difficult, it’s now easier than it used to be. It’s also possible to write more complicated DTypes, like physical units, arbitrary-precision floats, or categorical DTypes. This is built into NumPy, so any library that works with NumPy arrays can use these DTypes

## Getting It Done

So, how did I actually get it done? This part is more about the emotional aspects of the project. These were real thoughts I had while working on this:

- “This is too hard.”
- “I’ll never be able to finish.”
- “I don’t know how to fix any of the unfixed issues.”
- “I don’t want to write code today.”
- “I don’t understand why this bug is happening.”
- “I asked a question to try to get some help, but the answer I got doesn’t make any sense.”

I’m saying these here because I think they don’t get talked about enough, but it’s completely normal to have these kinds of feelings

![Two cats lounging by a window with venetian blinds, featuring a black cat and a grey cat with speech bubbles expressing frustration: 'I'll never be able to finish' and 'This is too hard'.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image18.png)

## Ways Forward from Mental Blocks:

If you’re feeling stuck, how do you get through it?

- **Go for a walk:** Acknowledging that hard things are hard and that it’s okay to struggle helps.
- **Take notes:** It’s easy to forget useful things someone says during a conversation, so jot them down.
- **Talk to people:** There’s often resistance to asking for help, but it’s okay. It’s normal to reach out when you need guidance.
- **Improve your workflow:** If you’re stuck on a problem, work on improving your programming workflow. It’s not wasted time—it really does improve your efficiency in the long run.
- **Get support:** And here’s a personal note: I have cats—Phantom and Slater—because they helped me through some tough moments during this project.

## Debugging Tips

For me, using a debugger was crucial. This project would have been impossible if I hadn’t learned how to run Python under GDB and LLDB. Debugging is like conducting a little science experiment every time—you ask questions and get answers, testing your assumptions about the system.

![Screenshot of a debugging session in a terminal window showing Python code with LLDB debugger output, highlighting a breakpoint and stack trace in dark theme.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image13.png)

I also highly recommend [Julia Evans’ zine on debugging](https://jvns.ca/blog/2022/12/21/new-zine--the-pocket-guide-to-debugging/). If you’re looking for a resource to improve your debugging skills, start there.

## Joining the NumPy Community

NumPy is a community of maintainers, a community of people.

![Grid display showing portraits and names of NumPy project maintainers arranged in two panels, featuring contributors like Andrew Nelson, Charles Harris, and others](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image14.png)

How did I become part of that community? Becoming a maintainer is about becoming useful to the project. One thing people often don’t realize is that anybody can review code. You don’t have to be a maintainer to review someone else’s pull request. In fact, a great way to become a maintainer is by starting to review code. A good rule of thumb is for every pull request you submit, review one other pull request. This helps unblock the project since one of the main things slowing progress is a lack of code reviews.

You can also triage issues and answer questions to get more familiar with the library. It’s important to fix the bugs that are relevant to your project, but if you see a bug that’s affecting others and you can fix it, go ahead and fix it, even if it’s not directly related to your work. If it benefits the project as a whole, it’s worth doing.

Taking risks and making mistakes is a huge part of learning. You’re not going to learn anything if you don’t make mistakes. Try things, and if you do them wrong, that’s okay. Everybody makes mistakes publicly—it’s part of the process.

If you keep pushing yourself, eventually, your inability to merge code will slow you down enough that someone will notice and give you commit access. For me, it took about six months, but it can take longer for others, depending on the project. The key is to keep at it, and eventually, you’ll get there.

## A New NumPy String DType

So, the rest is about the new `npy_string_dtype`.

![Screenshot of an announcement post from Sebastian Berg dated May 29, 2023, welcoming Nathan Goldbaum as a new Maintainer to the steering council team.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image15.png)

In NumPy 2.0, there is a new string DType available: `'np.dtype.StringDType'`. It supports UTF-8 encoded variable-width strings. For example, you can have a Unicode emoji, and it’s reproduced exactly. This DType can store strings in NumPy 2.0, so when we call `'str_len()'` on the string, it gives the correct answer. Keep in mind that `'str_len()'` returns the length in bytes. It is, in fact, a ufunc. The string DType in NumPy 2.0 handles these new string formats, and it works with all the standard NumPy DTypes.

```python
>>> arr = np.array(
...    ["this is a very long string: 😎", "short string"],
...    dtype=StringDType())

>>> arr
array(['this is a very long string: 😎', 'short string'],
  	dtype=StringDType())

>>> np.strings.str_len(arr)
array([29, 12])

>>> isinstance(np.strings.str_len, np.ufunc)
True
```

## Handling Missing Data

One of the significant improvements is that it now supports missing data directly. You can create a string DType with this `‘na’` object parameter. If you specify the `'nan'` object, then the DType can represent missing data directly in the array. For example, you can call `'np.isnan()'` on an array, and it will return `'True'` for any entries that are `'nan'`. This is one of the major reasons why people preferred object string arrays over NumPy’s existing string data types. Adding first-class support for missing data in StringDType makes it much easier to transition existing codebases relying on object string arrays to use StringDType arrays.

```python
>>> dt = StringDType(na_object=np.nan)
>>> arr = np.array(["hello", nan, "world"], dtype=dt)
>>> arr[1]
nan
>>> np.isnan(arr[1])
True
>>> np.isnan(arr)
array([False,  True, False])
```

## Short String Optimization

Another cool feature is the short string optimization. For instance, if you have an array and the last entry is `‘hello`, `world’`, which only needs 11 bytes to store, the struct that holds the entry in the array is 16 bytes. So, instead of doing a separate heap allocation, NumPy can store small strings directly in the array buffer. This optimization avoids unnecessary heap allocations for smaller strings.

![Diagram explaining Short String Optimization in NumPy arrays, showing a 15-byte string buffer structure, flags, and size attributes. Code example demonstrates string array creation.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image16.png)

**NumPy**

I also want to mention that I didn’t write this feature alone. I proposed the NumPy Enhancement Proposal (NEP), and Warren came back with the code that implemented it for me. This is one of the great things about open source—you can propose an idea, and someone else can help make it a reality.

## Arena Allocator

Another exciting feature is the arena allocator. Instead of allocating string data randomly across the heap, the data lives directly on the DType instance attached to the array. For example, if the next-to-last entry in the array is ‘numpy is a very cool library,’ we store an offset into an arena allocation rather than storing an address. This allows all the contents of the array to be stored contiguously in memory. This contiguity enables optimizations like SIMD and GPU acceleration that wouldn’t be possible if the string contents were scattered randomly across memory.

![Technical diagram showing NumPy array memory layout with Arena Allocator, including heap address, size flags, and memory blocks. Code example shows string array creation.](/posts/my-numpy-year-creating-a-dtype-for-the-next-generation-of-scientific-computing/image17.png)

Like the short string optimization, Marten van Kerkwijk helped me immensely both with ideas as well as code that I would have had no idea how to write.

## My NumPy Year

I hope you’ve taken away that big projects are hard but absolutely doable. Scientific Python projects are very welcoming. My experience with NumPy—where I received a lot of help and advice—is not unusual. NumPy 2.0 brings a lot of exciting features, including the variable-width string DType that I worked on, which is the result of lots of hard work.

If you’ve made it this far, thank you for sticking with me through this journey! I hope this gives you a better sense of what goes into building something new in NumPy and how, with the right support and determination, big projects can come to life. We’re just getting started. If you have questions about any of the changes or how they might fit into your projects, don’t hesitate to reach out. Whether you’re curious about DTypes, interested in contributing, or just want to chat, I’d love to hear from you!
