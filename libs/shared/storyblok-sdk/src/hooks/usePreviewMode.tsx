import { useEffect } from 'react';

import { useRouter } from 'next/router';

// The URL of the Storyblok iframe is like:
// https://quansight-consulting.vercel.app/testing-components?_storyblok=150968726
// &_storyblok_c=page
// &_storyblok_tk[space_id]=147759
// etc.
// - a bunch of query string parameters that all begin with `_storyblok`.
// So this is essentially checking if the site is loaded in
// the Storyblok editor preview iframe.
export const isStoryblok = (loc: { search: string }) =>
  loc.search.includes('_storyblok');

export const usePreviewMode = (
  // isPreviewMode comes from getStaticProps (Next.js preview mode feature)
  isPreviewMode: boolean,
): boolean => {
  const { reload } = useRouter();

  useEffect(() => {
    if (!isPreviewMode && isStoryblok(window.location)) {
      console.log('fetching /api/enter-preview then reloading');
      fetch(`/api/enter-preview`).then(reload);
    }
  }, [isPreviewMode, reload]);

  return isPreviewMode;
};
