import { TImage, TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

type TFeature = {
  _uid: string;
  image: TImage;
  title: string;
  text: string;
};

export type TFeaturesRawData = {
  component: ComponentType.Features;
  title: string;
  columns: TFeature[];
} & TBlok;
