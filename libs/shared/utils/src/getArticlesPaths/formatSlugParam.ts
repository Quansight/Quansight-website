import { ARTICLES_DIRECTORY_SLUG } from './constants';

export const formatSlugParam = (slug: string): string =>
  String(slug?.replace(ARTICLES_DIRECTORY_SLUG, ''));
