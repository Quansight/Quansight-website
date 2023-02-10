// These are all of the Storyblok slugs that should not match pages/[slug]
// because they are matched to other pages. For example, Labs 'blog' is matched
// to apps/labs/pages/blog/index.tsx.
export const restrictedSlugs: string[] = [
  // Consulting
  'homepage',
  'about-us',
  'library',
  // Labs
  'home',
  'team',
  'blog',
];
