import { TBlok, TImage, TLink } from '@quansight/shared/types';
import { TeaserColor } from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TTeaserRawData = {
  component: ComponentType.Teaser;
  color: TeaserColor;
  image: TImage;
  title: string;
  text: string;
  buttonText?: string;
  link?: TLink;
} & TBlok;
