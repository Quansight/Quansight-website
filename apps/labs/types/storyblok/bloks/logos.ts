import { TBlok, TLink, TImage } from '@quansight/shared/types';
import { LogosColors } from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TLogosRawData = {
  component: ComponentType.Logos;
  colorVariant: LogosColors;
  title: string;
  grid: TImage[];
  linkTitle: string;
  linkUrl: TLink;
} & TBlok;
