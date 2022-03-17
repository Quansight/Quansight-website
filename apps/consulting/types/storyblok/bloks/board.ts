import { TBlok } from '@quansight/shared/ui-components';

import { TRichText } from '../richText';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TBoardRawData = {
  component: ComponentType.Board;
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
} & TBlok;
