import { Storyblok } from '@quansight/shared/storyblok-sdk';
import { TRichText } from '../../types/storyblok/richTextTypes';

export const createMarkup = (storyblokHTML: TRichText): { __html: string } => {
  return {
    __html: Storyblok.richTextResolver.render(storyblokHTML),
  };
};
