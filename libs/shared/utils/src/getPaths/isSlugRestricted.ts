import { restrictedSlugs } from './restrictedSlugs';

export const isSlugRestricted = (slug: string): boolean =>
  !restrictedSlugs.includes(slug);
