import { TBaseBlok } from './base';

export enum HeroVariant {
  Large = 'large',
  Medium = 'medium',
}

export type THeroRawData = {
  title: string;
  variant: HeroVariant;
  subTitle?: string;
} & TBaseBlok;
