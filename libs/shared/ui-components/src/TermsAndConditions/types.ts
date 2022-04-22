import { TRichText, TBlok } from '@quansight/shared/types';

export type TTermsAndConditionsSectionProps = {
  title: string;
  text: TRichText;
} & TBlok;

export type TTermsAndConditionsProps = {
  title: string;
  sections: TTermsAndConditionsSectionProps[];
};
