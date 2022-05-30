import { FC, ReactNode } from 'react';

import SbEditable from 'storyblok-react';

import { TBlok } from '@quansight/shared/types';

export type TPageProps = {
  data: { content: { body?: TBlok[] } };
  children: (blok: unknown) => ReactNode;
};

// @ts-expect-error
export const Page: FC<TPageProps> = ({ data, children }) => {
  if (!data?.content?.body) {
    return null;
  }

  return data.content.body.map((blok: TBlok) => {
    return (
      <SbEditable content={blok} key={blok._uid}>
        {children(blok)}
      </SbEditable>
    );
  });
};
