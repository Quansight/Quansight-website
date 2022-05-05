import { ARTICLES_DIRECTORY_SLUG } from './constants';

export const isSlugRestricted = (slug: string): boolean =>
  slug.includes(ARTICLES_DIRECTORY_SLUG);
