import { TImage, TLink, TBlok } from '@quansight/shared/ui-components';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TBoardListRawData = {
  component: ComponentType.BoardList;
  grid: {
    _uid: string;
    image: TImage;
    title: string;
    text: string;
    linkTitle: string;
    linkUrl: TLink;
  }[];
  linkTitle: string;
  linkUrl: TLink;
} & TBlok;
