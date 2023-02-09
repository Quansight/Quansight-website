import { restrictedSlugs } from './restrictedSlugs';

export const isSlugRestricted = (slug: string): boolean => {
  return restrictedSlugs.some((restrictedSlug) =>
    new RegExp(restrictedSlug, 'i').test(slug),
  );
};
