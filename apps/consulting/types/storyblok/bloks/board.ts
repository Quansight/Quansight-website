import { TRichText, TImage, TLink, TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

type TBoardGrid = {
  _uid: string;
  title: string;
  link_title: string;
  link: TLink;
  image: TImage;
};

export type TBoardRawData = {
  component: ComponentType.Board;
  title: string;
  description: TRichText;
  grid: TBoardGrid[];
  button_title: string;
  button_url: TLink;
} & TBlok;
