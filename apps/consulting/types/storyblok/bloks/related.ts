import { TImage, TLink, TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

type TRelatedItem = {
  _uid: string;
  image: TImage;
  title: string;
  text: string;
  linkUrl: TLink;
};

export type TRelatedRawData = {
  component: ComponentType.Related;
  title: string;
  items: TRelatedItem[];
} & TBlok;
