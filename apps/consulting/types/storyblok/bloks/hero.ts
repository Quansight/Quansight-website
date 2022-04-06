import { TImage, TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export enum HeroVariant {
  Large = 'large',
  Medium = 'medium',
}

export type THeroRawData = {
  image: TImage;
  title: string;
  variant: HeroVariant;
  subTitle?: string;
  component: ComponentType.Hero;
} & TBlok;
