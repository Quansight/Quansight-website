import { restrictedSlugs } from './restrictedSlugs';

export const isSlugRestricted = (slug: string): boolean => {
  for (const restrictedSlug of restrictedSlugs) {
    if (slug.includes(restrictedSlug)) return false;
  }
  return true;
};
