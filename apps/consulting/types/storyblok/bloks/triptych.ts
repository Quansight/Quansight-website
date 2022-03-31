import { TImage, TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

type TTriptychColumn = {
  _uid: string;
  image: TImage;
  title: string;
  text: string;
};

export type TTriptychRawData = {
  component: ComponentType.Triptych;
  title: string;
  columns: TTriptychColumn[];
} & TBlok;
