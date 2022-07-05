import { ImageProps } from 'next/image';

import { TImage, TBlok } from '@quansight/shared/types';
import {
  HeroVariant,
  HeroBackgroundVariant,
} from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type THeroRawData = {
  image: TImage;
  title: string;
  variant: HeroVariant;
  subTitle?: string;
  component: ComponentType.Hero;
  objectFit?: ImageProps['objectFit'];
  backgroundColor?: HeroBackgroundVariant;
  imageMobile?: TImage;
  objectFitMobile?: ImageProps['objectFit'];
  imageTablet?: TImage;
  objectFitTablet?: ImageProps['objectFit'];
  imageDesktop?: TImage;
  objectFitDesktop?: ImageProps['objectFit'];
} & TBlok;
