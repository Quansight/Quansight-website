import { TRichText } from './richTextTypes';

export type TBoard = {
  title: string;
  description: TRichText;
  grid: {
    _uid: string;
    title: string;
    link_title: string;
    link: {
      cached_url: string;
    };
    image: {
      alt: string;
      filename: string;
    };
  }[];
};
