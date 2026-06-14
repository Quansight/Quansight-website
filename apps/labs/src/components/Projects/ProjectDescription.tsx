import type { FC } from 'react';

import { md } from '../../utils/markdown';

type ProjectDescriptionProps = {
  isExpanded: boolean;
  longDescription: string;
  title: string;
  linkUrl: string;
  linkText: string;
};

export const ProjectDescription: FC<ProjectDescriptionProps> = ({
  isExpanded,
  longDescription,
  title,
  linkUrl,
  linkText,
}) => (
  <div className="pb-[2.8rem] border-b border-b-gray-500 sm:col-start-1 sm:col-end-2">
    {isExpanded && (
      <div className="w-full">
        <div
          className="mb-[4rem] prose-p:leading-[2.1rem] text-black prose"
          dangerouslySetInnerHTML={md(longDescription)}
        />
        <a
          aria-label={`${title} project's page`}
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
