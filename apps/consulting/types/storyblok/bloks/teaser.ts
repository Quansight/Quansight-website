import { TBaseBlok } from './base';
import { TImage, TLink } from '@quansight/shared/ui-components';

export type TTeaserRawData = {
  color: string;
  image: TImage;
  title: string;
  text: string;
  buttonText?: string;
  link?: TLink;
} & TBaseBlok;
