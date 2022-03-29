import { TImage, TLink, TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

type TBoardListGrid = {
  _uid: string;
  image: TImage;
  title: string;
  text: string;
  linkTitle: string;
  linkUrl: TLink;
};

export type TBoardListRawData = {
  component: ComponentType.BoardList;
  grid: TBoardListGrid[];
  linkTitle: string;
  linkUrl: TLink;
} & TBlok;
