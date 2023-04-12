import { createMarkup } from '@quansight/shared/utils';

import { TProjectSummaryProps } from './types';

export const ProjectSummary = ({ shortDescription }: TProjectSummaryProps) => (
  <div
    className="prose-p:leading-[2.1rem] prose my-[1.8rem] text-black sm:col-start-1 sm:col-end-2"
    dangerouslySetInnerHTML={createMarkup(shortDescription)}
  />
);
