import { FC, useEffect, useState } from 'react';

import { isStoryblok } from '@quansight/shared/storyblok-sdk';

import type { TPreviewModeBannerProps } from './types';

// A thin full-width banner alert to display at the top of the page if the site
// is in Next.js preview mode.
export const PreviewModeBanner: FC<TPreviewModeBannerProps> = ({ preview }) => {
  const [showExitPreviewLink, setShowExitPreviewLink] = useState(true);
  useEffect(() => {
    // When inside the Storyblok visual editor, do not show the "exit preview"
    // link in the banner.
    if (isStoryblok(window.location)) {
      setShowExitPreviewLink(false);
    }
  }, [setShowExitPreviewLink]);

  // For safety and simplicity, do not allow preview mode banner in production,
  // only dev and preview/staging.
  if (process.env['NEXT_PUBLIC_VERCEL_ENV'] === 'production') {
    return null;
  }

  // Create link to the git branch that was used to build this instance of the
  // website.
  const gitRef = process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF'];
  const githubBranchLink = (
    <a
      className="hover:text-pink underline transition-colors duration-200"
      href={`https://github.com/Quansight/Quansight-website/tree/${gitRef}`}
    >
      {gitRef}
    </a>
  );

  const sharedBulletPoints = (
    <>
      <li>
        The page you are seeing may include code changes that have not yet been
        pushed to production. Be on the lookout for possible content/code
        conflicts.
      </li>
      <li>
        Git branch used to build the site:{' '}
        {gitRef
          ? githubBranchLink
          : 'Sorry, this info was not available at build time'}
        .
      </li>
      <li>
        You should never see this banner on production (quansight.com or
        labs.quansight.org)
      </li>
    </>
  );

  return (
    <div
      className={
        'fixed z-[100] px-8 py-4 text-[1.5rem] text-black ' +
        (preview ? 'bg-[rgb(255,255,0)]' : 'bg-gray-50')
      }
    >
      {preview ? (
        <details>
          <summary>Preview</summary>
          <ul className="list-inside list-disc">
            <li>
              This page is in content preview mode. You can see{' '}
              <strong>draft</strong> content.
            </li>
            <li>
              {showExitPreviewLink ? (
                <a
                  href="/api/exit-preview"
                  className="hover:text-pink underline transition-colors duration-200"
                >
                  Exit content preview mode.
                </a>
              ) : (
                <>
                  <span className="line-through">
                    Exit content preview mode.
                  </span>{' '}
                  (Exiting preview mode is not allowed when using Storyblok.)
                </>
              )}
            </li>
            {sharedBulletPoints}
          </ul>
        </details>
      ) : (
        <details>
          <summary>Preview</summary>
          <ul className="list-inside list-disc">
            <li>
              You are seeing only <strong>published</strong> content.
            </li>
            <li>
              <a
                href="/api/enter-preview"
                className="hover:text-pink underline transition-colors duration-200"
              >
                Enter content preview mode
              </a>{' '}
              to see draft content.
            </li>
            {sharedBulletPoints}
          </ul>
        </details>
      )}
    </div>
  );
};

export default PreviewModeBanner;
