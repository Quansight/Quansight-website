import { TRichText, TImage, TLink, TBlok } from '@quansight/shared/config';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TBoardRawData = {
  component: ComponentType.Board;
  title: string;
  description: TRichText;
  grid: {
    _uid: string;
    title: string;
    link_title: string;
    link: TLink;
    image: TImage;
  }[];
  button_title: string;
  button_url: TLink;
} & TBlok;
