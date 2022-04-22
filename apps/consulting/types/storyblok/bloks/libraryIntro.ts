import { TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TLibraryIntroRawData = {
  component: ComponentType.LibraryIntro;
  title: string;
  description: string;
} & TBlok;
