import { useEffect } from 'react';

import { useRouter } from 'next/router';

const isStoryblok =
  typeof window !== 'undefined' &&
  window.location.search.includes('_storyblok');

const isProduction = process.env['NODE_ENV'] === 'production';

export const usePreviewMode = (isPreviewMode: boolean): boolean => {
  const { reload } = useRouter();

  useEffect(() => {
    if (
      !isPreviewMode &&
      isStoryblok &&
      isProduction &&
      process.env['NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN']
    ) {
      fetch(
        `/api/enter-preview?token=${process.env['NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN']}`,
      ).then(reload);
    }
  }, [isPreviewMode, reload]);

  useEffect(() => {
    if (isPreviewMode && !isStoryblok) {
      fetch('/api/exit-preview').then(reload);
    }
  });

  return isPreviewMode;
};
