import { TImage, TLink, TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';
import { ColumnsVariant } from '../../../components/Columns/types';

type TColumn = {
  _uid: string;
  image: TImage;
  title: string;
  text: string;
  linkText: string;
  linkUrl: TLink;
};

export type TColumnsRawData = {
  component: ComponentType.Columns;
  variant: ColumnsVariant;
  columns: TColumn[];
} & TBlok;
