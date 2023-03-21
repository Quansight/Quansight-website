import { ARTICLES_DIRECTORY_SLUG } from './constants';

export const isSlugForPost = (slug: string): boolean =>
  slug.startsWith(ARTICLES_DIRECTORY_SLUG);
