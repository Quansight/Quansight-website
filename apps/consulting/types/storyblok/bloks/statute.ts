import { TStatuteSectionProps } from '@quansight/shared/ui-components';
import { TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TStatuteRawData = {
  component: ComponentType.Statute;
  title: string;
  sections: TStatuteSectionProps[];
} & TBlok;
