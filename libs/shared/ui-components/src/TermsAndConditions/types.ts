import { TRichText, TBlok } from '@quansight/shared/types';

export type TTermsAndConditionsParagraphProps = {
  title: string;
  text: TRichText;
} & TBlok;

export type TTermsAndConditionsProps = {
  title: string;
  paragraphs: TTermsAndConditionsParagraphProps[];
};
