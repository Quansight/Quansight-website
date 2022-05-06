import { TBlok } from '@quansight/shared/types';
import { TStatuteSectionProps } from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TStatuteRawData = {
  component: ComponentType.Statute;
  title: string;
  sections: TStatuteSectionProps[];
} & TBlok;
