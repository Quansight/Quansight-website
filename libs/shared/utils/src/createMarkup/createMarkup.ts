import { renderToStaticMarkup } from 'react-dom/server';

import { Storyblok } from '@quansight/shared/storyblok-sdk';
import { TRichText } from '@quansight/shared/types';

import { richTextBlokResolver } from './richTextBlokResolver/richTextBlokResolver';
import { TRichTextRawBlok } from './richTextBlokResolver/richTextRawBlok/richTextRawBlok';

export const createMarkup = (storyblokHTML: TRichText): { __html: string } => {
  Storyblok.setComponentResolver((_, blok: TRichTextRawBlok) => {
    const RichTextBlokResolver = richTextBlokResolver(blok);
    return renderToStaticMarkup(RichTextBlokResolver);
  });
  return {
    __html: Storyblok.richTextResolver.render(storyblokHTML),
  };
};
