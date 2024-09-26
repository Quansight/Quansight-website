---
title: "Adding support for LAPACK routines in stdlib"
authors: [pranav-goswami]
published: September 30, 2024
description: "Implementing LAPACK routines for numerical computation in web applications"
category: [stdlib, mathematics, linear-algebra, numerical-computing]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: "WIP"
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: "WIP"
---

# Adding support for LAPACK routines in stdlib

Hello, I am Pranav Goswami, a Computer Science graduate from IIT Jodhpur. I have been contributing to various open source organisations primarily LFortran and stdlib.

### About project

During the course of internship my goal was to add support for as many LAPACK routines to stdlib as possible.

<!-- ![alt text](image02.jpg) -->

<img src="/posts/implement-lapack-routines-in-stdlib/image02.jpg" alt="alt text" style="position:relative;left:10%;width:80%;height:400px;">

<br>

<!-- ![alt text](image.png) -->

<!-- < insert a graphic or gif where a stickman picks a package and drops to another place > -->

Now, it might seem what's tricky in that, just take existing Fortran implementation, translate it to javascript ( shh, via chatGPT? ), follow stdlib conventions, do benchmarking, add tests, documentation, etc and you are done. Sounds simple, but there is a catch or I say there are multiple catches, please read through the blog to get a detailed walkthrough.

### Motivation

Fortran has long been a foundational programming language for scientific computing, while JavaScript dominates the web ecosystem. I’ve observed various organizations attempting to compile Fortran codebases into WebAssembly (Wasm) for browser execution. This is where I believe stdlib is simplifying the process by offering APIs that enable execution directly via Node.js in a web environment. Leveraging the JavaScript standard library for direct execution on the web offers significant performance advantages, primarily by eliminating the need for implicit data transfers between WebAssembly (Wasm) and JavaScript. This approach also reduces the number of floating-point operations (FLOPs), and by keeping computations within JavaScript, higher performance is ensured. Additionally, these routines are beneficial for various IoT applications that lack Wasm support, making JavaScript an optimal choice in such contexts. This approach intrigues me, which is why I chose to explore it further.

<!-- More reasons of why this projecT:
1. Innvoation aspect: currently BLIS only supports BLAS
2. There can be performance advantages incomparision to copying data to Wasm and back to JS. If always can be in js, always better performance, as it is more native.
3. IoT and all where Wasm support is not there, this can be a good alternative.
4.  -->

## Walkthrough

LAPACK is vast, with approximately 1,700 routines, and implementing even 10% of them within a three-month timeframe is a significant challenge. I found that selecting the right package was, and still is, one of the most difficult tasks I encountered during my internship. It felt akin to being given a collection of coins with values like 1000, 100, 10, 5, and so on, and being asked to select as many as possible to maximize the total value. That essentially summarized my problem.


<!-- <div style="float:left;width:25%;">
<img src="/posts/implement-lapack-routines-in-stdlib/image-2.png" alt="alt text" style="width:auto;height:300px;">
</div> -->

<table>
  <tr>
    <td style="vertical-align: top; width: auto;">
      <!-- Image column -->
      <img src="/posts/implement-lapack-routines-in-stdlib/image-2.png" alt="alt text" style="width:1200px;height:300px;">
    </td>
    <td style="vertical-align: top; width: auto;">
      <!-- Text column -->
        <p>
            One day, I reviewed all the available LAPACK routines from netlib-lapack, categorizing them based on difficulty and dependencies. I compiled this information into a list, which can be found at lapack-tracker-issue. My original approach was to implement the routines in a depth-first manner for each package, which led to the creation of several dependency trees, prioritizing easier implementations.
        </p>
        <p>
            I quickly realized that the depth-first approach would not be feasible, as we did not have the luxury of years to develop and integrate the packages. Instead, I had a strict timeline of just three months to get up to speed, minimize code errors, automate certain processes, and still maintain a steady and positive pace in implementing the packages.
        </p>
        <p>
            After a discussion with Athan, we decided on a two-pronged strategy to avoid potential bottlenecks: (1) continue working in a depth-first approach to maintain progress while PRs are under review, and (2) focus on implementing packages that are leaf nodes in most dependency trees, thereby establishing a solid foundation for future development OR simply *pickup low hanging fruits* :)
        </p>
    </td>
  </tr>
</table>

## Challenges during Fortran to JS conversion

1. Supporting both `row-major` and `column-major`.


<table>
  <tr>
    <td style="vertical-align: top; width: auto;">
        <p>
            Fortran stores array elements in a column-major format, unlike C or JavaScript, which prefer row-major storage. Following the approach used in LAPACKE, we decided to introduce a new parameter, order, in each implementation to specify the storage layout. Based on the value of order, there would be distinct implementations and optimizations for each layout.
        </p>
        <p>
            The order we loop through multidimensional arrays can have a big impact on speed. Fortran is as said column-major, Meaning consecutive elements of a column are stored next to each other in memory, and we should loop through arrays in this order order of columns unlike conventional looping over rows.
        </p>
    </td>
    <td style="vertical-align: top; width: auto;">
      <img src="/posts/implement-lapack-routines-in-stdlib/image-3.png" alt="alt text" style="width:3200px;height:300px;">
    </td>
  </tr>
</table>

Let's illustrate this with an example. Consider a 2D array `A` of size `5x4`. To iterate over the array in row-major order, we would loop through the rows first, followed by the columns. In contrast, to iterate over the array in column-major order, we would loop through the columns first, followed by the rows. The code snippet below demonstrates this concept.

```javascript
var Float64Array = require( '@stdlib/array/float64' );
var A; var B; var i; var j;

/**
* 5x4 matrix
* [  1,  2,  3,  4 ],
* [  5,  6,  7,  8 ],
* [  9, 10, 11, 12 ],
* [ 13, 14, 15, 16 ],
* [ 17, 18, 19, 20 ]
*/

// row major
A = new Float64Array( [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ] );

// column major
B = new Float64Array( [ 1, 5, 9, 13, 17, 2, 6, 10, 14, 18, 3, 7, 11, 15, 19, 4, 8, 12, 16, 20 ] );

// iterate over A in cache optimal order
for ( i = 0; i < 5; i++ ) {
	for ( j = 0; j < 4; j++ ) {
		console.log( A[ ( i * 4 ) + j ] );
	}
}

// iterate over B in cache optimal order
for ( i = 0; i < 4; i++ ) {
	for ( j = 0; j < 5; j++ ) {
		console.log( B[ ( i * 5 ) + j ] );
	}
}
```

Thereby, we need to ensure that our implementations are optimized for both row-major and column-major orders. We employ various optimization techniques, such as loop tiling and cache optimization, to enhance performance. While some of these optimizations are already present in Fortran codes, simplifying the translation process, in most cases, we need to identify and implement these optimizations ourselves to achieve optimal performance.

<!-- <br>
<img src="/posts/implement-lapack-routines-in-stdlib/image-3.png" alt="alt text" style="position:relative;left:35%;width:30%;height:300px;"> -->

2. Supporting `ndarray` APIs

<table>
  <tr>
    <td style="vertical-align: top; width: auto;">
      <!-- Image column -->
      <img src="/posts/implement-lapack-routines-in-stdlib/ndarray.jpg" alt="alt text" style="width:2800px;height:300px;">
    </td>
    <td style="vertical-align: top; width: auto;">
      <!-- Text column -->
        <p>
            For packages that accept arrays as arguments, we developed a foundational, private version from which two distinct APIs are derived: one for the standard API and another for the ndarray API, both of which are available to end users.
        </p>
        <p>
            The final design was achieved through multiple iterations. The initial design included an `order` parameter, an array argument `A`, and `LDA`, which stands for the leading dimension of the array. Traditional BLAS APIs assume a contiguous row and column order.
        </p>
        <p>
            The `ndarray` APIs make no assumptions, allowing users the flexibility to define views over buffers in any desired manner. Consequently, we transitioned to a new design that accepts the order, the array argument `A`, `strideA1` (the stride of the first dimension of `A`), `strideA2` (the stride of the second dimension of `A`), and a final `offsetA` parameter, which serves as an index offset for `A`. In the final iteration, the `order` parameter was removed from the base implementation, as it can be easily inferred from the two stride values.
        </p>
        <p>
            With the plan set, I opened my first LAPACK pull request (PR), which introduced a JavaScript implementation for dlaswp. The dlaswp routine performs a series of row interchanges on a matrix A using pivot indices stored in IPIV. This PR revealed several challenges that arose during the conversion of the original Fortran implementation to JavaScript. Let’s delve into these challenges:
        </p>
    </td>
  </tr>
</table>


3. Understanding legacy fortran code

Let’s illustrate this with an example. Consider a function `add` that takes two arguments: `N`, representing the size of the array, and an array `A`, which returns the sum of its elements. Please find the code snippet below.

At first glance, it appears that the code is passing the `(i, j)th` element of `A` to `add`, making it seem incorrect. However, merely examining the code doesn't reveal whether `A(i, j:)`, `A(i:, j)`, `A(i:, j:)`, or a single array item is being referenced. In Fortran, `A(i, j)` represents a pointer to that location, allowing any of these combinations to be possible. This legacy behavior in Fortran is challenging to interpret and complicates translation to JavaScript. There’s an [active discussion](https://fortran-lang.discourse.group/t/matrix-index-pointer-confusion/8453) on Fortran-lang discourse addressing this issue. Similar legacy practices in Fortran further add to the complexity of converting code accurately to JavaScript.

```fortran
integer function add( N, A ) result(r)
    ! logic to compute sum of elements
end function

program main
    integer :: i, j, num, A( 5, 6 )
    integer :: res( 5 )
    do i = 1, 5
        do j = 1, 6
            ! num = compute elements to pass
            res( i ) = add( num, A( i, j ) )
        end do
    end do
end program
```

3. Optimization

At stdlib, we ensure that our implementations are optimized for both row-major and column-major orders. We employ various optimization techniques, such as loop tiling and cache optimization, to enhance performance. While some of these optimizations are already present in Fortran codes, simplifying the translation process, in most cases, we need to identify and implement these optimizations ourselves to achieve optimal performance.

---

Additionally, each stdlib package is designed to be independent, allowing users to install individual packages via `npm install <package>`, along with their dependencies in the `node_modules`. To support this modular approach, we conduct comprehensive testing, which includes writing tests for both the normal API and ndarray API, benchmarking their performance, defining and validating types, setting up a REPL environment, and providing a detailed README file with examples to guide users effectively.

Enough of these challenges! You may feel free to look at my open/merged PRs at [`pranav-PRs`](https://github.com/stdlib-js/stdlib/pulls/pranavchiku). The tracker is avilable at [`issue-2464`](https://github.com/stdlib-js/stdlib/issues/2464).

## How to call Fortran routines using JavaScript?

We leverage free-form Fortran code extensively to optimize the performance of various BLAS (Basic Linear Algebra Subprograms) and LAPACK (Linear Algebra Package) routines. In response, [Athan](https://www.linkedin.com/in/athanreines/) and I decided to document our methodology on [`How to Call Fortran Routines from JavaScript Using Node.js`](https://blog.stdlib.io/how-to-call-fortran-routines-from-javascript-with-node-js/).

## Fortran and C implementation

The initial focus on JavaScript implementations is part of a multi-phase approach. Implementing in JavaScript allows us to establish comprehensive documentation, testing, and benchmarking infrastructure. Once this foundation is in place, we can subsequently integrate C and Fortran implementations in a systematic manner. One of the other reasons for us not adding Fortran, specifically, was that we had not yet solved a build tooling issue to allow dynamic Fortran dependency resolution. Utilizing pure JavaScript fallbacks alongside robust testing and benchmarking infrastructure facilitated faster iterations in refining API design and implementation logic.

## Future plans & Conclusion


After the internship, I'll try to continue adding packages and if not atleast review PRs that affect the codebase which I worked on. With these, I would like to thank Quansight and Athan Reines for providing me with this opportunity. I learnt a lot, this was a long dream to work as an intern at Quansight and I am happy I fulfiled it. Extending my thanks to Melissa, she is an amazing cordinator, very friendly, joyful, thank you for spending time for us! Thank you all!


