---
title: 'Reverse-Geocoding in AWS Lambda: Save Time and Money Using Polars Plugins'
published: July 12, 2024
authors: [marco-gorelli]
description: 'Geocoding is the practice of taking in an address and assigning a latitude-longitude coordinate to it. Doing so for millions of rows can be an expensive and slow process, as it typically relies on paid API services. Learn how we saved our client time and money by leveraging open source tools and datasets for their geocoding needs.'
category: [PyData Ecosystem, Data Engineering]
featuredImage:
  src: /posts/reverse-geocoding-aws-lambda-using-polars-plugin/Reverse-Geocoding-AWS-Lambda-Save-Time-Money-Using-Polars-Plugins-Thumbnail-Marco-Gorelli-Quansight-Labs-Open-Source-scaled.jpg
  alt: 'A watercolor illustration of a polar bear plugging an electric plug into a wall socket, symbolizing the connection and power of using Polars for geocoding and reverse-geocoding tasks.'
hero:
  imageSrc: /posts/hero-paris.webp
  imageAlt: 'Reverse-Geocoding in AWS Lambda: Save Time and Money Using Polars Plugins'
---

## Reverse-Geocoding in AWS Lambda: Save Time and Money Using Polars Plugins

Geocoding is the practice of taking in an address and assigning a latitude-longitude coordinate to it. Doing so for millions of rows can be an expensive and slow process, as it typically relies on paid API services. Learn how we saved our client time and money by leveraging open source tools and datasets for their geocoding needs.

Our solution reduced their geocoding process from hours to minutes and their reverse geocoding process from unfeasibly expensive and slow to fast and cheap.

## What Is Geocoding and Reverse-Geocoding?

Geocoding answers questions such as:  
_Given the address: “17600 seneca spgs college station tx 77845”, what’s its latitude-longitude coordinate?_

Reverse-geocoding answers the reverse:  
_Given the coordinate (-30.543534, 129.14236), what address does it correspond to?_

Both are useful in several applications:

- Tracking deliveries
- Location tagging
- Point-of-interest recommendations

Our client needed to geocode and reverse-geocode millions of rows at a time. Geocoding was slow, and reverse-geocoding was unfeasibly expensive. To process ~7,000,000 rows:

- Geocoding would take ~2-3 hours and cost them ~$30,000 in yearly subscriptions (in addition to compute costs).
- Reverse geocoding was simply unfeasible: it would have taken them 35 hours and cost $35,000, so in practice, they would very rarely do it.

The solution we delivered them, on the other hand, was lightweight, cheap, and fast. To process the same number of rows:

- Geocoding: <10 minutes, without any subscription costs.
- Reverse geocoding: ~7-8 minutes, cost $5-6, lightweight enough to run on AWS Lambda.

We’re here to share our findings and give an overview of how we did it.

## Open-Source Geocoding: Single-Node Solution

Suppose we’re starting with a batch of addresses and need to geocode them. The gist of the solution we delivered is as follows:

- Take the client’s proprietary data and complement it with open source datasets (such as [OpenAddresses](https://openaddresses.io/) data).
- Preprocess it so it’s all in a standardized form. We’ll refer to this collection of data as our _lookup dataset_
- Join input addresses with our lookup dataset based on:
- Address number
- Road
- Zip code (if available, else city)

Whilst conceptually simple, we encountered several hurdles when implementing it. We’ll now tell how we overcame them.

## First Hurdle: Inconsistent Road Names

Road names vary between providers. For example, “Seneca Springs” might also appear as “Seneca Spgs.” We used the [libpostal](https://github.com/openvenues/libpostal)’s `expand\_address` function, as well as some hand-crafted logic, to generate multiple variants of each address (in both the input and the lookup dataset), thus increasing the chances of finding matches.

## Second Hurdle: Missing Zip Code and/or City

The OpenAddresses data contained all the information we needed, except that the zip code was missing for some rows. For such rows, we would do the following:

- Try to fill in the zip code by leveraging [GeoPandas’ spatial joins](https://geopandas.org/en/stable/gallery/spatial_joins.html) and freely available data on zip code boundaries
- Else:
  - If the lookup address had a city, try to join with the input addresses based on &lt;address number, road, city&gt;.
  - Else, use the [polars-reverse-geocode](https://github.com/MarcoGorelli/polars-reverse-geocode) Polars plugin to find the closest city to the coordinates in the lookup file and then join with the input addresses based on that.

The last option used a Polars plugin we developed specially for the client (who kindly allowed us to open source it). Using that plugin, it’s possible to do approximate reverse geocoding of millions of rows in just seconds.

## Third Hurdle: Going Out-Of-Memory

The amount of data we collected was several gigabytes—much more than our single-node 16GB RAM machine could handle. This is why our client was previously using a cluster to process it. However, we found this to be unnecessary because Polars’ lazy execution made it very easy for us not to have to load all the data at once.

By leveraging [Polars’ lazy execution and query](https://docs.pola.rs/user-guide/lazy/optimizations/) optimization, we were able to carry out the entire process on a single-node machine! The overall impact was enormous: the geocoding process went from taking hours to less than 10 minutes. This was fast and reliable enough that the client was able to discontinue a paid API service that was costing them ~$30,000 per year!

## Open-Source Reverse-Geocoding: AWS Lambda Is All You Need?

Thus far, we’ve talked about geocoding. What about the reverse process, reverse-geocoding? This is where the success story becomes even bigger: not only did our solution run on a single node, but it could also run on AWS Lambda, where memory, time, and package size are very constrained!

In order to describe our solution, we need to introduce the concept of [geohashing](https://en.wikipedia.org/wiki/Geohash). Geohashing involves taking a coordinate and assigning an alphanumeric string to it. A geohash identifies a region in space – the more digits you consider in the geohash, the smaller the area. For example, the geohash `9xe` stretches out across hundreds of miles and covers Wyoming entirely (plus parts of other states), whereas `9xejgxn` covers a very small amount of land and allows you to identify 3rd Street Shoshoni, Wyoming. Given a latitude and longitude coordinate, the geohash is very cheap to compute, and so it gives us an easy way to filter out irrelevant data from our lookup dataset.

Here’s a simplified sketch of the solution we delivered:

1. Start an AWS Lambda function `spawn-reverse-geocoder.` Read in the given coordinates, and compute the unique geohashes present in the dataset. Split the unique geohashes into batches of 10 geohashes each.
2. For each batch of 10 geohashes, start another AWS Lambda function (`execute-reverse-geocoder`), which takes all the data from our lookup dataset whose geohash matches any of the given geohashes and do a cross join. For each unique input coordinate, we only keep the row matching the smallest haversine distance between the input coordinate and the lookup address. Write the result to a temporary Parquet file.
3. Once all the `execute-reverse-geocoder` jobs have finished, concatenate all the temporary Parquet files into a single output file.

This solution is easy to describe – the only issue is that no common dataframe library has in-built functionality for computing geohashes, nor for computing distances between pairs of coordinates.

This is where one of Polars’ killer features, extensibility, came into play: if Polars doesn’t implement a function you need, you can always make a plugin that can do it for you. In this case, we used several plugins to adapt Polars to our needs:

- `polars-hash,` for computing geohashes
- `polars-distance,` for computing the distance between pairs of coordinates
- `polars-reverse-geocode,` for finding the closest state to a given coordinate

Our complete environment was composed of the following:

- Polars
- 3 Polars plugins
- `s3fs`
- `boto3` and `fsspec` for reading and writing cloud data

Not only did it all fit comfortably into the AWS Lambda 250MB package size limit, execution was also fast enough that we could reverse-geocode millions of coordinates from across the United States in less than 10 minutes, staying within the 10GB memory limit!

That’s the power of lazy execution and Rust. If you, too, would like custom Rust and/or Python solutions that can be easily and cheaply deployed for your use case, please contact Quansight Consulting.

## What We Can Do for You

By leveraging both open source datasets and open source tools, as well as our in-house expertise, we were able to save our client time and money on their geocoding and reverse-geocoding needs. We made the infeasible feasible. If you’d like customized solutions tailored to your business needs, delivered by open source experts, please [get in contact with Quansight](/open-source-services) today.

Contact us today: [connect@quansight.com](mailto:connect@quansight.com)
