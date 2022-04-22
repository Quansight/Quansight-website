import { TTermsAndConditionsSectionProps } from '@quansight/shared/ui-components';
import { TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TTermsAndConditionsRawData = {
  component: ComponentType.TermsAndConditions;
  title: string;
  sections: TTermsAndConditionsSectionProps[];
} & TBlok;
