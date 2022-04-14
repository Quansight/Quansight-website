import { TBlok, TRichText } from '@quansight/shared/types';

export type TFooterNavigationProps = {
  title: string;
  links: [];
} & TBlok;

export type TFooterContactProps = {
  title: string;
  contact: TRichText;
  buttonLink: {};
} & TBlok;

export type TFooterSocialMediaProps = {
  title: string;
  links: [];
} & TBlok;

export type TFooterCopyrightProps = {
  policyAndConditions: [];
  copyright: string;
};

export type TFooterProviderProps = {
  data: TFooterNavigationProps | TFooterContactProps | TFooterSocialMediaProps;
};

export type TFooterProps = {
  columns: (
    | TFooterNavigationProps
    | TFooterContactProps
    | TFooterSocialMediaProps
  )[];
  policyAndConditions: [];
  copyright: string;
} & TBlok;
