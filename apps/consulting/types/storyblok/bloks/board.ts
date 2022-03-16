import { TBaseBlok } from './base';
import { TRichText, TImage, TLink } from '@quansight/shared/ui-components';

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
    image: TImage;
  }[];
  button_title: string;
  button_url: TLink;
} & TBaseBlok;
