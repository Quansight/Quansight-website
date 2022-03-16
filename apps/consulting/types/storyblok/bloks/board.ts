import { TBaseBlok } from './base';
import { TRichText } from '../richText';

export type TBoardRawData = {
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
  button_title: string;
  button_url: {
    cached_url: string;
  };
} & TBaseBlok;
