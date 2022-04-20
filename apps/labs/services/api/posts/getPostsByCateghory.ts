import { TPost } from '../../../types/storyblok/bloks/posts';
import { getAllPosts } from './getAllPosts';

export const getPostsByCategory = async (
  category: string,
  slug: string,
): Promise<TPost[]> => {
  try {
    const allPosts = await getAllPosts();

    return allPosts.items.filter(
      (post) => post.slug !== slug && post.meta.category === category,
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};
