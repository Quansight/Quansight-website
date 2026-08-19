import { getCollection } from 'astro:content';

import type { PostSummary } from '../components/Blog/BlogList';

export const getPublishedPosts = async (): Promise<PostSummary[]> => {
  const allPosts = await getCollection('posts');
  const allPeople = await getCollection('people');

  const peopleBySlug = Object.fromEntries(allPeople.map((e) => [e.id, e.data]));

  return allPosts
    .filter((p) => p.data.published)
    .sort(
      (a, b) =>
        new Date(b.data.published).getTime() -
        new Date(a.data.published).getTime(),
    )
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      published: post.data.published,
      authors: post.data.authors
        .map((s) => {
          const p = peopleBySlug[s];
          return p ? `${p.firstName} ${p.lastName}` : s;
        })
        .join(', '),
      featuredImage: post.data.featuredImage,
      categories: post.data.category,
    }));
};
