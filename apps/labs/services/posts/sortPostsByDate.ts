import { TPostSummary } from '../../types/storyblok/bloks/posts';

export const sortPostsByDate = <T extends TPostSummary>(posts: T[]): T[] => {
  return posts.sort((postA, postB) => {
    const dateA = new Date(postA.meta.published).getTime();
    const dateB = new Date(postB.meta.published).getTime();

    return dateB - dateA;
  });
};
