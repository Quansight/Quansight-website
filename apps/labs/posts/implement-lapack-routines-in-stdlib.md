---
title: "Adding support for LAPACK routines in stdlib"
authors: [pranav-goswami]
published: September 30, 2024
description: "Implementing LAPACK routines for numerical computation in web applications"
category: [Stdlib, Mathematics, Linear Algebra, Numerical Computing, Internship]
featuredImage:
  src: /posts/hello-world-post/featured.png
  alt: "WIP"
hero:
  imageSrc: /posts/hello-world-post/hero.jpeg
  imageAlt: "WIP"
---

# Adding support for LAPACK routines in stdlib

Hello, I am [Pranav Goswami](https://github.com/pranavchiku), a Computer Science graduate from IIT Jodhpur. I have been contributing to various open source organisations primarily [LFortran](https://github.com/lfortran/lfortran) and [stdlib](https://github.com/stdlib-js/stdlib).

### About project

During the course of internship my goal was to add support for as many LAPACK routines to stdlib as possible.


<img src="/posts/implement-lapack-routines-in-stdlib/image02.jpg" alt="alt text" style="position:relative;left:10%;width:80%;height:400px;">

<br>

Now, it might seem what's tricky in that, just take existing Fortran implementation, translate it to javascript ( shh, via chatGPT? ), follow stdlib conventions, do benchmarking, add tests, documentation, etc and you are done. Sounds simple, but there is a catch or I say there are multiple catches, please read through the blog to get a detailed walkthrough.

### Motivation

Fortran has long been a foundational programming language for scientific computing, while JavaScript dominates the web ecosystem. I’ve observed various organizations attempting to compile Fortran codebases into WebAssembly (Wasm) for browser execution. This is where I believe stdlib is simplifying the process by offering APIs that enable execution directly via Node.js in a web environment. Leveraging the JavaScript standard library for direct execution on the web offers significant performance advantages, primarily by eliminating the need for implicit data transfers between WebAssembly (Wasm) and JavaScript. This approach also reduces the number of floating-point operations (FLOPs), and by keeping computations within JavaScript, higher performance is ensured. Additionally, these routines are beneficial for various IoT applications that lack Wasm support, making JavaScript an optimal choice in such contexts. This approach intrigues me, which is why I chose to explore it further.

## Fortran and C implementation

A common question that arises is why Fortran and C implementations are necessary when the initial goal was to translate the project to JavaScript. This approach is part of a broader, multi-phase strategy. The JavaScript implementation serves as the foundation, allowing us to interface with Fortran and C, leveraging their performance advantages. We also support various accelerators based on the user’s operating system, such as Apple’s accelerator framework, and utilize multithreading capabilities.

Since Fortran is not universally supported across all environments, we maintain C implementations as well. This not only facilitates the creation of WebAssembly (Wasm) binaries, which can be used in browser environments, but also simplifies integration with individual packages. While Wasm support is not a primary goal, it remains a viable option.

Implementing the core functionality in JavaScript allows us to establish a comprehensive framework for documentation, testing, and benchmarking. With this solid groundwork, we can then systematically integrate the Fortran and C implementations. One challenge specific to Fortran was resolving build tooling issues that would allow dynamic dependency resolution, which delayed its integration.

In the interim, pure JavaScript fallbacks, supported by robust testing and benchmarking, enable rapid iterations and refinements of the API design and implementation logic, paving the way for future incorporation of Fortran and C components.

## Walkthrough

LAPACK is vast, with approximately 1,700 routines, and implementing even 10% of them within a three-month timeframe is a significant challenge. I found that selecting the right package was, and still is, one of the most difficult tasks I encountered during my internship. It felt akin to being given a collection of coins with values like 1000, 100, 10, 5, and so on, and being asked to select as many as possible to maximize the total value. That essentially summarized my problem.


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

With the plan set, I opened my first LAPACK pull request (PR), which introduced a JavaScript implementation for dlaswp. The dlaswp routine performs a series of row interchanges on a matrix A using pivot indices stored in IPIV. This PR revealed several challenges that arose during the conversion of the original Fortran implementation to JavaScript. Let’s delve into these challenges:

## Challenges during Fortran to JS conversion

1. Supporting both `row-major` and `column-major`.

Fortran stores array elements in a `column-major` format, unlike C or JavaScript, which prefer `row-major` storage. Following the approach used in LAPACKE, we decided to introduce a new parameter, order, in each implementation to specify the storage layout. Based on the value of order, there would be distinct implementations and optimizations for each layout. The order we loop through multidimensional arrays can have a big impact on speed. Fortran is as said `column-major`, Meaning consecutive elements of a column are stored next to each other in memory, and we should loop through arrays in this order order of columns unlike conventional looping over rows.

<br>
<img src="/posts/implement-lapack-routines-in-stdlib/image-3.png" alt="alt text" style="position:relative;left:15%;width:70%;height:50%;">

<br>


Let's illustrate this with an example. Consider a 2D array A of arbitrary size. We have implemented a function that copies the entire contents of matrix A into another matrix B. In `row-major` order iteration, we traverse the array by iterating over each row first, and within each row, we loop through the columns. On the other hand, in `column-major` order iteration, we loop through each column first, followed by the rows within that column. The code snippet below presents a cache-efficient implementation of the `dlacpy` function specifically optimized for `row-major` order traversal.

```javascript
/**
* Copies all of a matrix `A` to another matrix `B`.
*
* @private
* @param {NonNegativeInteger} M - number of rows in matrix `A`
* @param {NonNegativeInteger} N - number of columns in matrix `A`
* @param {Float64Array} A - input matrix
* @param {integer} strideA1 - stride of the first dimension of `A`
* @param {integer} strideA2 - stride of the second dimension of `A`
* @param {NonNegativeInteger} offsetA - starting index for `A`
* @param {Float64Array} B - output matrix
* @param {integer} strideB1 - stride of the first dimension of `B`
* @param {integer} strideB2 - stride of the second dimension of `B`
* @param {NonNegativeInteger} offsetB - starting index for `B`
* @returns {Float64Array} `B`
*/
function dlacpy( M, N, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, offsetB ) { // eslint-disable-line max-len
	var da0;
	var da1;
	var db0;
	var db1;
	var S0;
	var S1;
	var ia;
	var ib;
	var i0;
	var i1;

	S0 = N;
	S1 = M;
	da0 = strideA2;
	da1 = strideA1 - ( S0*strideA2 );
	db0 = strideB2;
	db1 = strideB1 - ( S0*strideB2 );

	// Set the pointers to the first indexed elements in the respective matrices...
	ia = offsetA;
	ib = offsetB;

	// Iterate over the matrix dimensions...
	for ( i1 = 0; i1 < S1; i1++ ) {
		for ( i0 = 0; i0 < S0; i0++ ) {
			B[ ib ] = A[ ia ];
			ia += da0;
			ib += db0;
		}
		ia += da1;
		ib += db1;
	}
	return B;
}
```

Now, let's examine the plot below, which depicts the relationship between the rate of copying elements and the array size for both `row-major` and `column-major` orders. The plot shows that for smaller arrays, the copying rates for both orders are comparable. However, as the array size increases, the rate of copying for `row-major` order becomes significantly faster than that of `column-major` order. This performance boost is a result of the cache-optimization techniques employed in the implementation, which minimize the number of cache misses in `row-major` order, leading to enhanced efficiency for larger arrays.

> Rate vs Size plot: `row-major` vs `column-major` order 

<br>
<img src="/posts/implement-lapack-routines-in-stdlib/rate-vs-size-row-vs-column.png" alt="alt text" style="position:relative;left:25%;width:50%;height:50%;">

<br>

Next stepl involves fixint the the iteration order first to `row-major` and then to `column-major` and compare how increasing the number of rows and columns affects the rate of copying elements from one matrix to another. Intuitively, one might expect that increasing the number of elements in a row would reduce the rate of copying, due to the limited cache size. Let's see if this intuition holds.

From Figure 2(b), it is evident that increasing the row size has a more pronounced impact on the copying rate after a certain threshold. This is due to the limited cache size, resulting in a lower rate for larger row sizes when compared to increasing the column size. On the other hand, Figure 2(a) shows no significant difference in the copying rate when increasing the row or column size in the `column-major` order. This is because `column-major` order experiences more frequent cache misses compared to `row-major` order, regardless of whether the size increase is in the rows or columns, leading to lower efficiency overall for both small and large sizes.

<br>
<img src="/posts/implement-lapack-routines-in-stdlib/combined-increasing-size-row-col.png" alt="alt text" style="position:relative;left:25%;width:50%;height:50%;">

<br>

Thereby, we need to ensure that our implementations are optimized for both `row-major` and `column-major` orders. We employ various optimization techniques, such as loop tiling and cache optimization, to enhance performance. While some of these optimizations are already present in Fortran codes, simplifying the translation process, in most cases, we need to identify and implement these optimizations ourselves to achieve optimal performance.

> `dlacpy` function with loop interchanged optimized for `column-major` order

With the following diff, we can interchange the loops to optimize the `dlacpy` function for `column-major` order.

```diff
@@ -233,12 +233,12 @@ function dlacpy( M, N, A, strideA1, strideA2, offsetA, B, strideB1, strideB2, of
        var i0;
        var i1;
 
-       S0 = N;
-       S1 = M;
-       da0 = strideA2;
-       da1 = strideA1 - ( S0*strideA2 );
-       db0 = strideB2;
-       db1 = strideB1 - ( S0*strideB2 );
+       S0 = M;
+       S1 = N;
+       da0 = strideA1;
+       da1 = strideA2 - ( S0*strideA1 );
+       db0 = strideB1;
+       db1 = strideB2 - ( S0*strideB1 );
 
        // Set the pointers to the first indexed elements in the respective matrices...
        ia = offsetA;
```

<br>
<img src="/posts/implement-lapack-routines-in-stdlib/column-major-optimized.png" alt="alt text" style="position:relative;left:25%;width:50%;height:50%;">

<br>

It is evident that the optimized `dlacpy` function for `column-major` order is significantly faster ( almost 5x ) than the `row-major` order, as shown in the plot above. This optimization is crucial for enhancing performance, especially when dealing with large arrays.

2. Supporting `ndarray` APIs

For packages that accept arrays as arguments, we developed a foundational, private version from which two distinct APIs are derived: one for the standard API and another for the ndarray API, both of which are available to end users. The final design was achieved through multiple iterations. The initial design included an `order` parameter, an array argument `A`, and `LDA`, which stands for the leading dimension of the array. Traditional BLAS APIs assume a contiguous row and column order. The `ndarray` APIs make no assumptions, as shown in figure ndarray 1(A) below, allowing users the flexibility to define views over buffers in any desired manner. Consequently, we transitioned to a new design that accepts the order, the array argument `A`, `strideA1` (the stride of the first dimension of `A`), `strideA2` (the stride of the second dimension of `A`), and a final `offsetA` parameter, which serves as an index offset for `A`. In the final iteration, the `order` parameter was removed from the base implementation, as it can be easily inferred from the two stride values.


Let's now understand `ndarray` API using an example of LAPACK routine `dlacpy` that copies a matrix `A` to a matrix `B`. The function definition looks like:

```javascript
function dlacpy( M, N, A, offsetA, strideA1, strideA2, B, offsetB, strideB1, strideB2 );
```
<br>
<img src="/posts/implement-lapack-routines-in-stdlib/ndarray-example.png" alt="alt text" style="position:relative;left:25%;width:50%;height:50%;">

<br>

Suppose you want to copy the matrix A to B using the ndarray API, as illustrated in the graphic above. This operation is not feasible with conventional LAPACK/BLAS APIs, but you can easily achieve it by running the dlacpy function with the following arguments:

```javascript
B = dlacpy( 5, 4, A, 8, 2, 1, B, 10, 2, 5 );
```

Not only just this, you may also support accessing elements in reverse order like:

```javascript
B = dlacpy( 5, 4, A, 8, 2, 1, B, -10, -2, B.length - 6 );
```

Additionally, you can also support accessing elements in reverse order, such as:

```javascript
/*
[ 999, 999, 999, 999, 999 ]
[  20, 999,  18, 999,  12 ]
[ 999, 999, 999, 999, 999 ]
[  10, 999,   4, 999,   2 ]
[ 999, 999, 999, 999, 999 ]
*/
```

3. Understanding legacy fortran code

Let’s illustrate this with an example. Consider a function `add` that takes two arguments: `N`, representing the size of the array, and an array `A`, which returns the sum of its elements. Please find the code snippet below.

```fortran
integer function add( M, N, A ) result(r)
    ! logic to compute sum of elements
end function

program main
    integer :: i, j, num, A( 4, 3 )
    integer :: res( 4 )
    do i = 1, 4
        do j = 1, 3
            ! num = compute elements to pass
            res( i ) = add( M, N, A( i, j ) )
        end do
    end do
end program
```

At first glance, it appears that the code is passing the `(i, j)th` element of `A` to `add`, making it seem incorrect. However, merely examining the code doesn't reveal whether `A(i, j:)`, `A(i:, j)`, `A(i:, j:)`, or a single array item is being referenced. In Fortran, `A(i, j)` represents a pointer to that location, allowing any of these combinations to be possible. This legacy behavior in Fortran is challenging to interpret and complicates translation to JavaScript. There’s an [active discussion](https://fortran-lang.discourse.group/t/matrix-index-pointer-confusion/8453) on Fortran-lang discourse addressing this issue. Similar legacy practices in Fortran further add to the complexity of converting code accurately to JavaScript.

More specifically, let us examine two additional implementations of the add function in Fortran, where the function computes the sum of elements across a row and a column.

- `add` function to compute sum of elements over a row

```fortran
integer function add( N, A ) result(r)
  integer, intent(in) :: N
  integer, dimension( N ), intent(in) :: A
  integer :: i
  r = 0
  do i = 1, N
      r = r + A( i )
  end do
end function
```

- `add` function to compute sum of elements over a column

```fortran
integer function add( M, A ) result(r)
  integer, intent(in) :: M
  integer, dimension( M ), intent(in) :: A
  integer :: i
  r = 0
  do i = 1, M
      r = r + A( i )
  end do
end function
```

If we attempt to convert these functions to JavaScript while assuming a column-major order, it is crucial to ensure that the logic is accurately translated to prevent any inconsistencies.

<br>

<img src="/posts/implement-lapack-routines-in-stdlib/challenge-fortran.png" alt="alt text" style="position:relative;left:25%;width:50%;height:50%;">

<br>

The definition of the add function will include two additional arguments: offsetA and strideA.

```javascript
function add( M, N, A, offsetA, strideA );
```

- JS translation of program considering `add` function to compute sum of elements over a row

```javascript
function main() {
  var i; var j; var num; var A; var res;
  A = new Float64Array( 4*3 );
  res = new Float64Array( 4 );
  for ( i = 0; i < 4; i++ ) {
    for ( j = 0; j < 3; j++ ) {
      // num = compute elements to pass
      res[ i ] = add( 3, A, offsetA + ( i * 4 ), 3 );
    }
  }
}
```

- JS translation of program considering `add` function to compute sum of elements over a column

```javascript
function main() {
  var i; var j; var num; var A; var res;
  A = new Float64Array( 4*3 );
  res = new Float64Array( 4 );
  for ( i = 0; i < 4; i++ ) {
    for ( j = 0; j < 3; j++ ) {
      // num = compute elements to pass
      res[ i ] = add( 4, A, offsetA + i * 3, 1 );
    }
  }
}
```

Thereby, understanding legacy Fortran code is crucial to accurately translating it to JavaScript, ensuring that the logic is correctly implemented to avoid discrepancies.

3. Optimization

At stdlib, we ensure that our implementations are optimized for both row-major and column-major orders. We employ various optimization techniques, such as loop tiling and cache optimization, to enhance performance. While some of these optimizations are already present in Fortran codes, simplifying the translation process, in most cases, we need to identify and implement these optimizations ourselves to achieve optimal performance.

---

Additionally, each stdlib package is designed to be independent, allowing users to install individual packages via `npm install <package>`, along with their dependencies in the `node_modules`. To support this modular approach, we conduct comprehensive testing, which includes writing tests for both the normal API and ndarray API, benchmarking their performance, defining and validating types, setting up a REPL environment, and providing a detailed README file with examples to guide users effectively.

Enough of these challenges! You may feel free to look at my open/merged PRs at [`pranav-PRs`](https://github.com/stdlib-js/stdlib/pulls/pranavchiku). The tracker is avilable at [`issue-2464`](https://github.com/stdlib-js/stdlib/issues/2464). All the code related to benchmarking and testing done for this blog can be found at [Pranavchiku/QS-blog](https://github.com/pranavchiku/QS-blog).

## How to call Fortran routines using JavaScript?

We leverage free-form Fortran code extensively to optimize the performance of various BLAS (Basic Linear Algebra Subprograms) and LAPACK (Linear Algebra Package) routines. In response, [Athan](https://www.linkedin.com/in/athanreines/) and I decided to document our methodology on [`How to Call Fortran Routines from JavaScript Using Node.js`](https://blog.stdlib.io/how-to-call-fortran-routines-from-javascript-with-node-js/).

## Future plans & Conclusion

After the internship, I'll try to continue adding packages and if not atleast review PRs that affect the codebase which I worked on. With these, I would like to thank Quansight and Athan Reines for providing me with this opportunity. I learnt a lot, this was a long dream to work as an intern at Quansight and I am happy I fulfiled it. Extending my thanks to Melissa, she is an amazing cordinator, very friendly, joyful, thank you for spending time for us! Thank you all!

