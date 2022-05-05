import { FC, ReactNode } from 'react';

import SbEditable from 'storyblok-react';

import {
  PageItem,
  usePreviewMode,
  useStoryblok,
} from '@quansight/shared/storyblok-sdk';
import { TBlok } from '@quansight/shared/types';

export type TPageProps = {
  data: PageItem;
  preview: boolean;
  children: (blok: unknown) => ReactNode;
};

export const Page: FC<TPageProps> = ({ data, preview, children }) => {
  usePreviewMode(preview);
  const story = useStoryblok(data, preview);

  return story?.content?.body.map((blok: TBlok) => {
    return (
      <SbEditable content={blok} key={blok._uid}>
        {children(blok)}
      </SbEditable>
    );
  });
};
