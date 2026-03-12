import { FC, ReactNode } from 'react';

import SbEditable from 'storyblok-react';

import { TBlok } from '@quansight/shared/types';

export type TPageProps = {
  data: { content: { body?: TBlok[] } };
  children: (blok: unknown) => ReactNode;
};

// storyblok-react types lack React 18 children support
const StoryblokEditable = SbEditable as unknown as FC<{
  content: TBlok;
  children: ReactNode;
}>;

export const Page: FC<TPageProps> = ({ data, children }) => {
  if (!data?.content?.body) {
    return null;
  }

  return (
    <>
      {data.content.body.map((blok: TBlok) => (
        <StoryblokEditable content={blok} key={blok._uid}>
          {children(blok)}
        </StoryblokEditable>
      ))}
    </>
  );
};
