import type { FC } from 'react';

import { md } from '../../utils/markdown';

export const ProjectSummary: FC<{ shortDescription: string }> = ({
  shortDescription,
}) => (
  <div
    className="my-[1.8rem] prose-p:leading-[2.1rem] text-black prose sm:col-start-1 sm:col-end-2"
    dangerouslySetInnerHTML={md(shortDescription)}
  />
);
