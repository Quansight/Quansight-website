import { TImage, TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

type TColumn = {
  _uid: string;
  image: TImage;
  title: string;
  text: string;
};

export type TColumnsRawData = {
  component: ComponentType.Columns;
  columns: TColumn[];
} & TBlok;
