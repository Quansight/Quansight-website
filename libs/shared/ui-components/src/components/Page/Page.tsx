import { FC, ReactNode } from 'react';
import {
  PageItem,
  usePreviewMode,
  useStoryblok,
} from '@quansight/shared/storyblok-sdk';
import SbEditable from 'storyblok-react';

import { TBlok } from '../../types';

export type TPageProps = {
  data: PageItem;
  preview: boolean;
  children: (blok: unknown) => ReactNode;
};

export const Page: FC<TPageProps> = ({ data, preview, children }) => {
  usePreviewMode(preview);
  const story = useStoryblok(data, preview);

  return story?.content?.body.map((blok: TBlok<unknown>) => {
    return (
      // @ts-expect-error Block here is unknown.
      <SbEditable content={blok} key={blok._uid}>
        {children(blok)}
      </SbEditable>
    );
  });
};
