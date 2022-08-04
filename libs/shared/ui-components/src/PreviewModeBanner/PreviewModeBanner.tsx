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
    <a
      className="underline transition-colors duration-200 hover:text-pink"
      href={`https://github.com/Quansight/Quansight-website/tree/${gitRef}`}
    >
      {gitRef}
    </a>
  );

  const className =
    'px-8 py-4 text-[1.5rem] text-black ' +
    (preview ? 'bg-[rgb(255,255,0)]' : 'bg-gray-50');

  return (
    <div className={className}>
      {preview ? (
        <details>
          <summary>
            This page is in content preview mode. You can see{' '}
            <strong>draft</strong> content.
          </summary>
          <ul className="list-disc list-inside">
            <li>
              {' '}
              {showExitPreviewLink && (
                <a
                  href="/api/exit-preview"
                  className="underline transition-colors duration-200 hover:text-pink"
                >
                  Exit content preview mode.
                </a>
              )}
            </li>
            <li>
              The page you are seeing may include code changes that have not yet
              been pushed to production. Be on the lookout for possible
              content/code conflicts.
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
          </ul>
        </details>
      ) : (
        <details>
          <summary>
            You are seeing only <strong>published</strong> content.
          </summary>
          <ul className="list-disc list-inside">
            <li>
              <a
                href="/api/enter-preview"
                className="underline transition-colors duration-200 hover:text-pink"
              >
                Enter content preview mode
              </a>{' '}
              to see draft content.
            </li>
            <li>
              Does not apply to Labs blog posts, since they exist outside of
              Storyblok. If you can see this banner, then the Labs blog posts
              should reflect the commit tree used to generate this instance of
              the website (usually a PR branch or the `develop` branch).
            </li>
            <li>
              The page you are seeing may include code changes that have not yet
              been pushed to production. Be on the lookout for possible
              content/code conflicts.
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
          </ul>
        </details>
      )}
    </div>
  );
};

export default PreviewModeBanner;
