import { createMarkup } from '@quansight/shared/utils';

import { TProjectDescriptionProps } from './types';

export const ProjectDescription = ({
  isDroprownExpanded,
  longDescription,
  title,
  linkUrl,
  linkText,
}: TProjectDescriptionProps) => (
  <div className="border-b border-b-gray-500 pb-[2.8rem] sm:col-start-1 sm:col-end-2 ">
    {isDroprownExpanded && (
      <div className="w-full">
        <div
          className="prose-p:leading-[2.1rem] prose mb-[4rem] text-black"
          dangerouslySetInnerHTML={createMarkup(longDescription)}
        />
        <a
          aria-label={`${title} project's page`}
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="text-violet border-b-violet border-b-2 text-[1.6rem] font-bold leading-[1.8rem]"
        >
          {linkText}
        </a>
      </div>
    )}
  </div>
);
