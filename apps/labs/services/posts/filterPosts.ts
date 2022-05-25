import { TPost } from '../../types/storyblok/bloks/posts';

export const filterPosts = (posts: TPost[], category: string): TPost[] => {
  return posts.filter((post) => {
    if (!category) {
      return true;
    }

    if (post.meta?.category) {
      return post.meta.category.includes(category);
    }

    return false;
  });
};
