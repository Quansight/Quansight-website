import { restrictedSlugs } from './restrictedSlugs';

export const isSlugRestricted = (slug: string): boolean => {
  for (const restrictedSlug of Object.values(restrictedSlugs)) {
    if (slug === restrictedSlug) return false;
  }
  return true;
};
