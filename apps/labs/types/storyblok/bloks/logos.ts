import { TBlok, TLink, TImage } from '@quansight/shared/config';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TLogosRawData = {
  component: ComponentType.Logos;
  title: string;
  grid: TImage[];
  linkTitle: string;
  linkUrl: TLink;
} & TBlok;
