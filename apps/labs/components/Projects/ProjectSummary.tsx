import { FC } from 'react';

import { createMarkup } from '@quansight/shared/utils';

import { TProjectSummaryProps } from './types';

export const ProjectSummary: FC<TProjectSummaryProps> = ({
  shortDescription,
}) => (
  <div
    className="my-[1.8rem] prose-p:leading-[2.1rem] text-black prose sm:col-start-1 sm:col-end-2"
    dangerouslySetInnerHTML={createMarkup(shortDescription)}
  />
);
