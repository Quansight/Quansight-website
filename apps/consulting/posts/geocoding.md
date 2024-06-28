---
title: 'Saving time and money using Polars, Polars plugins, and open source data'
published: June 28, 2024
author: marco-gorelli
description: 'Geocoding is the process of taking in an address and assigning a
latitude-longitude pair to it. Doing so for millions of rows can be expensive
and time-consuming. Learn about how we delivered a solution to a client, and
what it unlocked for them!'
category:
  [
    Open Source Software,
    Scalable Computing,
  ]
featuredImage:
  src: /posts/geocoding/featured.jpg
  alt: ''
hero:
  imageSrc: /posts/geocoding/hero.jpg
  imageAlt: 'Image of a bear putting a plug into the wall'
---

Geocoding is the practice of taking in an address and assigning a latitude-longitude coordinate
to it. Doing so for millions of rows can be an expensive and slow process, as it
typically relies on paid API services. Learn about how we saved a client time and
money by leveraging open source tools and datasets for their geocoding needs.

Our solution took their geocoding process from taking hours to taking minutes,
and their reverse-geocoding process from being unfeasibly expensive and slow to
being fast and cheap.

## What are geocoding and reverse-geocoding?

Geocoding answers the question:

> Given address "152 West Broncho Avenue, Texas, 15203", what's its latitude-longitude
  coordinate?

Reverse-geocoding answers the reverse:

> Given the coordinate (-30.543534, 129.14236), what address does it correspond to?

Both are useful in several applications:

- tracking deliveries;
- location tagging;
- point-of-interest recommendations.

Our client needed to geocode and reverse-geocode millions
of rows at a time. Geocoding was slow, and reverse-geocoding
unfeasibly expensive. To process ~7,000,000 rows:

- Geocoding would take ~2-3 hours and cost them $32,100
  in yearly subscriptions (in addition to compute costs).
- Reverse geocoding was simply unfeasible: it would have taken
  them 35 hours and cost $35,000, so in practice they would very rarely do it.

The solution we delivered them, on the other hand, was lightweight, cheap, and fast.
To process the same number of rows:

- Geocoding: <10 minutes, without any subscription costs.
- Reverse geocoding: ~7-8 minutes, cost $5-6, lightweight enough to run on AWS Lambda.

We're here to share our findings, and to give an overview of how we did it.

## Open-source geocoding: single-node solution

Suppose we're starting with a batch of addresses
and need to geocode them. The gist of the solution we delivered is:

- take the client's proprietary data and complement it with open source
  datasets (such as [OpenAddresses](https://openaddresses.io/) data).
  Preprocess it so it's all in a standardised form. We'll refer to this
  collection of data as our _lookup dataset_.
- join input addresses with our lookup dataset, based on:
  - address number
  - road
  - zip code (if available, else city)

Whilst conceptually simple, we encountered several hurdles when implementing it. We'll
now tell about how we overcame them.

### First hurdle: inconsistent road names

Road names vary between providers. For example, "west broncho avenue" might also appear
as:

- w. broncho ave
- west broncho
- w. broncho avenue
- w. broncho

We used the [libpostal](https://github.com/openvenues/libpostal)'s `expand_address` function,
as well as some hand-crafted logic, to generate multiple variants of each address (in both the input
and the lookup dataset), thus increasing the chances of finding matches.

### Second hurdle: some addresses in the lookup didn't have a zip code, and possibly neither a city

The OpenAddresses data contained all the information we needed, except that for some rows the zip code
was missing. For such rows, we would do the following:

- Try to fill in the zip code by leveraging
  [GeoPandas' spatial joins](https://geopandas.org/en/stable/gallery/spatial_joins.html)
  and freely available data on zip code boundaries
- else:
  - If the lookup address had a city, then try to join with the input addresses based on
    <address number, road, city>.
  - Else, use the [polars-reverse-geocode](https://github.com/MarcoGorelli/polars-reverse-geocode)
    Polars plugin to find the closest city to the coordinates in the lookup file, and then join
    with the input addresses based on that.

The last option used a Polars plugin which we developed specially for the client (who kindly allowed
us to open source it). Using that plugin, it's possible to do approximate reverse geocoding of
millions of rows in just seconds. We have expertise in a variety of areas at Quansight - including Rust!
- so please reach out to https://quansight.com/ to learn more about what we
can do for you.

### Third hurdle: going out-of-memory

The amount of data we collected was several gigabytes in size - much more than what our single-node
16GB RAM machine could handle, which is why our client was previously using a cluster to process
it. However, we found this to be unnecessary, because Polars' lazy execution made it very easy for
us to not have to load in all the data at once.

By leveraging [Polars' lazy execution and query optimisation](https://docs.pola.rs/user-guide/lazy/optimizations/),
we were able to carry out the entire process on a single-node
machine! The overall impact was enormous: the geocoding process went from taking hours, to
less than 10 minutes. This was fast and reliable enough that the client was able to discontinue
a paid API service of theirs, which was costing them ~$30,000 per year!

## Open-source reverse-geocoding: AWS Lambda is all you need?

Thus far, we've talked about geocoding. What about the reverse process, reverse-geocoding?
This is where the success story becomes even bigger: not only did our solution run on a single
node, it could actually run on AWS Lambda, where memory, time, and package size are all very
constrained!

In order to describe our solution, we need to introduce the concept of [geohashing](https://en.wikipedia.org/wiki/Geohash).
Geohashing involves taking a coordinate and assigning an alphanumeric string to it. A geohash identifies
a region in space - the more digits you consider in the geohash, the smaller the area. For example,
the geohash `9xe` stretches out across hundres of miles and covers Wyoming entirely (plus parts of
other states), whereas `9xejgxn` covers a very small amount of land and allows you to idenfity
3rd Street Shoshoni, Wyoming. Given a latitude and longitude coordinate, the geohash
is very cheap to compute, and so it gives us an easy way to filter out irrelevant data from our
lookup dataset.

Here's a simplified sketch of the solution we delivered:

1. Start an AWS Lambda function `spawn-reverse-geocoder`.
   Read in the given coordinates, and compute the unique geohashes present in the dataset.
   Split the unique geohashes into batches of 10 geohashes each.
2. For each batch of 10 geohashes, start another AWS Lambda function (`execute-reverse-geocoder`)
   which takes all the data from our lookup dataset whose geohash matches any of the given geohashes,
   and do a cross join. For each unique input coordinate, we only keep the row matching the smallest
   haversine distance between the input coordinate and the lookup address. Write the result
   to a temporary Parquet file.
3. Once all the `execute-reverse-geocoder` jobs have finished, concatenate all the temporary Parquet
   files which they wrote into a single output file.

This solution is easy to describe - the only issue is that no common dataframe library has in-built
functionality for computing geohashes, nor for computing distances between pairs of coordinates.
This is where one of Polars' killer features (extensibility) came into play: if Polars doesn't implement
a function you need, you can always make a plugin that can do it for you. In this case, we used several
plugins to adapt Polars to our needs:

- `polars-hash`, for computing geohashes
- `polars-distance`, for computing the distance between pairs of coordinates
- `polars-reverse-geocode`, for finding the closest state to a given coordinate

Our complete environment was composed of:

- Polars
- 3 Polars plugins
- `s3fs`, `boto3`, and `fsspec` for reading and writing cloud data

Not only did it all fit comfortably into the AWS Lambda 250MB package size limit, execution was also
fast enough that we could reverse-geocode millions of coordinates from across the United States in
less than 10 minutes, staying within the 10GB memory limit!

That's the power of lazy execution and Rust. If you too would like custom Rust and/or Python
solutions for your use case, which can be easily and cheaply deployed, please contact
Quansight Consulting.

## What we did for Datum, and what we can do for you

By leveraging both open source datasets and open source tools, as well our in-house expertise,
we were able to save our client time and money for their geocoding and reverse-geocoding needs.
We made the infeasible feasible. If you'd like customised solutions tailored to your business needs,
delivered by open source experts, please [get in contact with Quansight](https://quansight.com/open-source-services/)
today.

