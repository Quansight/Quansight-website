import { ARTICLES_DIRECTORY_SLUG } from './constants';

export const formatSlugParam = (slug: string | null): string =>
  slug ? String(slug?.replace(ARTICLES_DIRECTORY_SLUG, '')) : '';
