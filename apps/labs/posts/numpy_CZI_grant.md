---
title: 'A new grant for NumPy and OpenBLAS!'
published: November 14, 2019
author: ralf-gommers
description: "I'm very pleased to announce that NumPy and OpenBLAS just received a $195,000 grant from the Chan Zuckerberg Initiative, through its Essential Open Source Software for Science (EOSS) program!"
category: [Funding, PyData ecosystem]
featuredImage:
  src: /posts/numpy_CZI_grant/blog_feature_var2.png
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/numpy_CZI_grant/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

I'm very pleased to announce that NumPy and OpenBLAS just received a $195,000 grant from
the Chan Zuckerberg Initiative, through its
[Essential Open Source Software for Science](https://chanzuckerberg.com/rfa/essential-open-source-software-for-science/)
(EOSS) program! This is good news for both projects, and I'm particularly excited about
the types of activities we'll be undertaking, what this will mean in terms of growing
the community, and to be part of the first round of funded projects of this visionary program.

## The program

The [press release](https://chanzuckerberg.com/newsroom/chan-zuckerberg-initiative-awards-5-million-for-open-source-software-projects-essential-to-science/)
gives a high level overview of the program, and the
[grantee website](https://chanzuckerberg.com/eoss/proposals) lists the 32 successful applications.
Other projects that got funded include SciPy and Matplotlib (it's the very first
significant funding for both projects!), Pandas, Zarr, scikit-image, JupyterHub, and
Bioconda - we're in good company!

Nicholas Sofroniew and Dario Taborelli, two of the people driving the EOSS program, wrote
a blog post that's well worth reading about the motivations for starting this program and
the 42 projects that applied and got funded:
[The Invisible Foundations of Biomedicine](https://medium.com/@cziscience/4ab7f8d4f5dd).

## So what will we be doing?

For NumPy, we will be working on:

1. NumPy’s governance and organizational structure,
2. the numpy.org website,
3. high-level documentation aimed at new users and contributors, and
4. community outreach and mentoring of new team members.

This is driven by both the recognition that we need to better serve NumPy's
large number of beginner to intermediate level users, and that NumPy’s
sustainability depends on growing its core team and contributor community -
and in particular in areas other than code maintenance.

The OpenBLAS work will focus on addressing sets of key technical issues, in
particular thread-safety, AVX-512 and thread-local storage (TLS) issues. In
addition algorithmic improvements will be made in ReLAPACK (Recursive
LAPACK), which OpenBLAS is the main user of.

More details on our planned activities and deliverables can be found in
[the full proposal](https://figshare.com/articles/Proposal_NumPy_OpenBLAS_for_Chan_Zuckerberg_Initiative_EOSS_2019_round_1/10302167).

There were a couple of other motivations for focusing on governance, website,
documentation and community building activities. First, it was allowed -
which is already quite unusual. Most potential funders, whether they be
institutional science funders or companies, usually want to see a proposal
full of shiny new features. Often it's explicitly disallowed to propose
maintenance or community building. The people at the Chan Zuckerberg
Institute that put this program together clearly understand how scientific
open source software projects work and what their needs are, and they allowed
proposing any type of work that makes sense for a project. Simple, but
radical!

Second, I thought quite hard about what the best ways are of spending this
amount of funding effectively. Of the grant, $140,000 goes to NumPy - a lot
can be done with this, but it's also good to realize that it's about 10% of
the amount of funding that BIDS received for NumPy. And we'd like to have
more than 10% of the impact in the long term! In my
[SciPy'19 talk](https://www.slideshare.net/RalfGommers/inside-numpy-preparing-for-the-next-decade)
I attempted to quantify the impact of those BIDS grants. The vast majority of
those funds were used for (very much necessary) technical work, and it
increased the velocity of the projects by ~25-30%, and in addition it enabled
integrating some larger changes, like the `numpy.random` redesign. It seems
clear to me though that adding another 10% of similar activities, while valuable,
won't be transformative. On the other hand, focusing all our time
on growing the team and better serving new users and contributors may be -
we're aiming to enable more sustained contributions from more people, and in
areas like high-level documentation that are now under-developed.

Of the activities that we proposed back in July, some are already underway.
We have a small team working on redesigning the website, and through the
Google Season of Docs program we are working with a professional tech writer,
Anne Bonner, on a new beginner-friendly tutorial. This is great, in
particular because our proposal only got funded at the level of 80% of what
we asked for. So the deliverables that are in the proposal but we descoped
are likely to materialize anyway.

## The significance and current state of OpenBLAS

While NumPy has its struggles with finding maintainers, at least every user
knows what it is and (most of the time) appreciates it. OpenBLAS is in a harder
position - as a library for accelerated linear algebra it's fundamentally important
for NumPy (as well as for SciPy, Julia and R), but it's not visible to end users.
This is a main reason for why it has far fewer maintainers and contributors.
In fact, its bus factor is exactly one - over the last two years Martin
Kroeker, the main OpenBLAS maintainer, has >10x more commits than the next
most active contributors. For a project that's so important to all of
scientific computing, that's a worry. I'm quite happy that I was able to
collaborate with Martin on this grant proposal, and that he can now dedicate
some more time to OpenBLAS development.

If you're still fuzzy on what OpenBLAS is and does, imagine what would happen if
`np.dot` and every other linear algebra function ran 20x slower. Or, say,
your scikit-learn model would take 20x longer to run. There are alternatives
to OpenBLAS, but not many. Intel MKL is proprietary, so while it's a good
option for (for example) the NumPy shipped by Anaconda, MKL is not an option
for many redistributors (including NumPy itself, for its PyPI wheels and
conda-forge packages). BLIS is a newer library that provides accelerated BLAS
functions, but its companion libFlame for accelerated LAPACK is far from
ready for mainstream use. And the venerable ATLAS is stagnant, not as performant,
and suffered from the single-maintainer issue as well. So you may not know it,
but you're very likely relying on OpenBLAS!

OpenBLAS is fast, but it's also relatively unstable. NumPy releases are
often impacted by issues in an OpenBLAS function, and we need to be very
careful about which OpenBLAS version to use in the wheels we ship. This grant
will tackle some of the more important types of issues that we have run into
with NumPy. By extension, this will also help all other major users of OpenBLAS.

## Grant management - the money flow explained

I think it's quite important to be transparant with the community about how a grant
is managed and how we plan to spend the funds. The full $195,000 will go to NumFOCUS,
the fiscal sponsor of NumPy, with myself as the PI responsible for it. Of
that grant, $55,000 is reserved for the OpenBLAS work - NumFOCUS will
contract Martin for the bulk of that (there's some overhead NumFOCUS charges,
and we reserve some funds for being able to hire a student intern for
OpenBLAS work). The other $140,000 is for NumPy, and will be used for a
subcontract with Quansight to fund my time as well as hire a tech writer and web
designer at Quansight Labs. This is quite exciting to me - I'd love to see more
writers, web developers, graphic designers and community managers become part of
community open source projects, so this role at Labs is the first of hopefully many.

## Next steps

Today was announcement day, the real work starts now. First, I'll be figuring out
the logistics of the grant so we can start the work in time. Then on November 22-23
there's a NumPy sprint at BIDS where we will have 8-10 members of the NumPy team in
a room. That's a great opportunity to discuss many of the topics that we will be
working on - the NumPy roadmap, governance, community building, and website & documentation
work are all on the agenda. The official start date of the grant is December 1st.
Stay tuned - there's a lot more to come!
