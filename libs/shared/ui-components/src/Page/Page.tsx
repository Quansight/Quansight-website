import { FC, ReactNode } from 'react';

import SbEditable from 'storyblok-react';

import { TBlok } from '@quansight/shared/types';

export type TPageProps = {
  data: unknown;
  children: (blok: unknown) => ReactNode;
};

export const Page: FC<TPageProps> = ({ data, children }) => {
  // usePreviewMode(preview);
  // const story = useStoryblok(data, preview);

  return data?.content?.body.map((blok: TBlok) => {
    return (
      <SbEditable content={blok} key={blok._uid}>
        {children(blok)}
      </SbEditable>
    );
  });
};
