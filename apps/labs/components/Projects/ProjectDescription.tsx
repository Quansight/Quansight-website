import { FC } from 'react';

import { createMarkup } from '@quansight/shared/utils';

import { TProjectDescriptionProps } from './types';

export const ProjectDescription: FC<TProjectDescriptionProps> = ({
  isDroprownExpanded,
  longDescription,
  title,
  linkUrl,
  linkText,
}) => (
  <div className="pb-[2.8rem] border-b border-b-gray-500 sm:col-start-1 sm:col-end-2 ">
    {isDroprownExpanded && (
      <div className="w-full">
        <div
          className="mb-[4rem] prose-p:leading-[2.1rem] text-black prose"
          dangerouslySetInnerHTML={createMarkup(longDescription)}
        />
        <a
          aria-label={`Go to the ${title} project's page`}
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[1.6rem] font-bold leading-[1.8rem] border-b-2 text-violet border-b-violet"
        >
          {linkText}
        </a>
      </div>
    )}
  </div>
);
