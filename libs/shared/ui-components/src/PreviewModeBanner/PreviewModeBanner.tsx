import { FC, useEffect, useState } from 'react';

import { isStoryblok } from '@quansight/shared/storyblok-sdk';

import type { TPreviewModeBannerProps } from './types';

// A thin full-width banner alert to display at the top of the page if the site
// is in Next.js preview mode.
export const PreviewModeBanner: FC<TPreviewModeBannerProps> = ({ preview }) => {
  const [showExitPreviewLink, setShowExitPreviewLink] = useState(true);
  useEffect(() => {
    if (isStoryblok(window.location)) {
      setShowExitPreviewLink(false);
    }
  }, [setShowExitPreviewLink]);

  // For safety and simplicity, do not allow preview mode banner in production,
  // only dev and preview/staging.
  if (process.env['NEXT_PUBLIC_VERCEL_ENV'] === 'production') {
    return null;
  }

  const gitRef = process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF'];
  const githubBranchLink = (
    <a href={`https://github.com/Quansight/Quansight-website/tree/${gitRef}`}>
      {gitRef}
    </a>
  );

  const className =
    'py-2 text-xl text-center text-black ' +
    (preview ? 'bg-[rgb(255,255,0)]' : 'bg-green');

  return (
    <div className={className}>
      {preview ? (
        <>
          This page is in content preview mode. You can see published{' '}
          <strong>and unpublished</strong> content
          {gitRef && <> against git branch {githubBranchLink}</>}.{' '}
          {showExitPreviewLink && (
            <a
              href="/api/exit-preview"
              className="underline transition-colors duration-200 hover:text-pink"
            >
              Exit content preview mode.
            </a>
          )}
        </>
      ) : (
        <>
          You are seeing only <strong>published</strong> content
          {gitRef && <> against git branch {githubBranchLink}</>}.{' '}
          <a
            href="/api/enter-preview"
            className="underline transition-colors duration-200 hover:text-pink"
          >
            Enter content preview mode
          </a>{' '}
          to see published and unpublished content.
        </>
      )}
    </div>
  );
};

export default PreviewModeBanner;
