import { TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TCenteredIntroRawData = {
  component: ComponentType.CenteredIntro;
  title: string;
  description: string;
} & TBlok;
