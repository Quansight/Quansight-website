---
title: 'PyCon US 2023 - An action-packed week'
published: June 28, 2023
author: lysandros-nikolaou
description: "In this post I'm sharing my experience of traveling to the US for PyCon US 2023"
category: [Community, OSS Experience]
featuredImage:
  src: /posts/quansight-at-scipy2019/blog_feature_org.png
  alt: 'An illustration of a brown and a white hand coming towards each other to pass a business card with the logo of Quansight Labs.'
hero:
  imageSrc: /posts/quansight-at-scipy2019/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

A few weeks ago, I had the great opportunity of traveling to Salt Lake City,
UT to attend the biggest worldwide Python conference, PyCon US. After about
20 hours of traveling from Berlin to Utah through Frankfurt and Denver, I arrived
at one of the conference hotels on Tuesday evening with just enough time to rest
before a week full of summits, talks, volunteering, and talking to great people.

First item on the agenda on Wednesday was the Language Summit, an annual all-day
gathering of CPython core developers, triagers, documentarians, and guests working
on various Python implementations or projects that are closely related to them
such as HPy. The discussions centered around the C API, the GIL and all of the
work toward removing it, and how to recognize, prevent and tackle burnout. I won’t
go into too much detail, but anyone that’s interested can read [Alex Waygood’s blog
posts on the Language Summit](https://pyfound.blogspot.com/2023/05/the-python-language-summit-2023_29.html).
He really did an amazing job in summing up all of the talks and discussions. I will,
however, mention one personal highlight from the Language Summit. Before the first
talk, Pablo Galindo Salgado, Python 3.10 & 3.11 release manager and fellow compiler
front-end co-conspirator, went up to the podium and, in front of everyone, merged
[PR #102855](https://github.com/python/cpython/pull/102855), the implementation of
PEP 701, which marked a significant milestone in our work toward standardizing and
improving f-strings.

The next few days passed by quickly. On Thursday I attended the opening reception.
It was the first time we got to see the expo hall with all the different companies
and sponsors of PyCon US, which also included [Quansight](https://quansight.com/) and
our sister company [OpenTeams](https://www.openteams.com/). Friday was the first day
of talks. It started off with a great keynote on how to go about talking to people by
Ned Batchelder. It really helped me put into perspective a lot of my own open-source
interactions and how to guard against common pitfalls when engaging with open source
communities. After that and for the rest of the day I attended a lot of exciting
talks on topics ranging from WASM and PyScript to Python 3.11’s specializing
adaptive interpreter. I’m also very happy that, this year, for the first time,
I volunteered as a session chair. This session included three amazing presentations
on mutation testing by Dave Aronson, molecular simulation by Iván Pulido, and one
of the killer-features of Python 3.12, the per-interpreter GIL by Eric Snow.

Saturday was another first for me. Attending the [Mentored Sprints for Diverse
Beginners](https://mentored-sprints.netlify.app/), an event that aims at introducing
open-source to anyone that might be facing barriers while contributing. This event
was an incredible experience. It included working together with three people that
were interested in opening their first PR to CPython. At the end of the event,
they’d all succeeded in doing so, which marked a very successful day. I also attended
the Steering Council panel, the Diversity & Inclusion Panel, and, of course, the
one-of-its-kind keynote on Python expertise (or rather the lack thereof) by James
Powell. A round of talks followed, on topics such as WASM (yes, WASM again), syntactic
sugar in Python, and object-oriented programming. In the evening, it was time for
the PyLadies Auction. One of the most fun moments in all of PyCon, the PyLadies
Auction is a unique event that aims to bring people together in supporting [PyLadies](https://pyladies.com/).

Sunday, like any last day of a conference, was a bit bitter-sweet. Everyone was
excited to attend the last round of talks and keynotes, but, at the same time, a
bit sad that the main part of the conference was slowly coming to an end. Yes,
some people were going to stay around for the sprints the following week, but the
sound of all the people rushing to their talks, talking with each other and having
fun is not the same. The day started with a round of lightning talks and an
eye-opening keynote by Margaret Mitchell on data, bias, and all the things we should
be watching out for in the AI era, and it ended with three truly special keynotes.
In the first one, Carol Willing talked about Python’s global network and how there are
three basic elements to it: connection, communication, and scale. The second one was
Deb Nicholson’s update on the PSF and the giving of Community Service Awards. The
last talk of the day, which also marked the end of the 20th PyCon US, was a trip down
memory lane by Guido van Rossum, who told us stories about the first Python conferences,
the ones that started it all.

The following three days were mostly about coming together to sprint on a variety of
projects. A lot of different projects were part of the event this year, one of them
being CPython. During the three days I was there, I spent most of my time working on
PEP 701-related firefighting and (mostly unsuccessfully) mentoring some awesome people
to contribute to CPython. A personal highlight during these three days was witnessing
Russel Keith-Magee managing sprinters on some of the projects he created, such as
[BeeWare](https://beeware.org/). The amount of preparation, mentoring, encouragement
toward beginners, and recognition of contributors with stickers and applause was a
true learning experience.

For all of the great keynotes, talks, summits and sprints, there’s one aspect of PyCon
that really is irreplaceable, the hallway track! The ability to talk to Python greats,
meet old open-source friends and get to know new awesome people alike, really is what
makes this conference the unforgettable experience it is. A big thanks to all of the
people that made me enjoy this conference so much and, of course, to Quansight for
sponsoring me and enabling me to be there!


> I don't know about the rest of you... I came for the language, but I stayed for the community.
_~ Brett Cannon_
