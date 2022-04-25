import { TRichText, TBlok } from '@quansight/shared/types';

export type TStatuteSectionProps = {
  title: string;
  text: TRichText;
} & TBlok;

export type TStatuteProps = {
  title: string;
  sections: TStatuteSectionProps[];
};
