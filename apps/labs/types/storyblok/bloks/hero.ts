import { TImage, TBlok } from '@quansight/shared/types';
import {
  HeroVariant,
  HeroBackgroundVariant,
  TObjectFit,
} from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type THeroRawData = {
  image: TImage;
  title: string;
  variant: HeroVariant;
  subTitle?: string;
  component: ComponentType.Hero;
  objectFit?: TObjectFit;
  backgroundColor?: HeroBackgroundVariant;
  imageMobile?: TImage;
  objectFitMobile?: TObjectFit;
  imageTablet?: TImage;
  objectFitTablet?: TObjectFit;
  imageDesktop?: TImage;
  objectFitDesktop?: TObjectFit;
} & TBlok;
