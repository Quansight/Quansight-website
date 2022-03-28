import { TBlok } from '@quansight/shared/config';
import { ComponentType } from '../../../components/BlokProvider/types';

export enum HeroVariant {
  Large = 'large',
  Medium = 'medium',
}

export type THeroRawData = {
  title: string;
  variant: HeroVariant;
  subTitle?: string;
  component: ComponentType.Hero;
} & TBlok;
