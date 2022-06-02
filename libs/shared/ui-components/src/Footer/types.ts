import { TBlok, TImage, TLink, TRichText } from '@quansight/shared/types';

type LinkItem = {
  linkText?: string;
  linkImage?: TImage;
  linkUrl: TLink;
} & TBlok;

export type TFooterLogoProps = {
  logoMobile: TImage;
  logoDesktop: TImage;
} & TBlok;

export type TFooterNavigationProps = {
  title: string;
  links: LinkItem[];
} & TBlok;

export type TFooterContactProps = {
  title: string;
  contact: TRichText;
  buttonText: string;
  buttonLink: TLink;
} & TBlok;

export type TFooterSocialMediaProps = {
  title: string;
  links: LinkItem[];
} & TBlok;

export type TFooterCopyrightProps = {
  policyAndConditions: LinkItem[];
  copyright: string | null;
};

type TColumn =
  | TFooterNavigationProps
  | TFooterContactProps
  | TFooterSocialMediaProps
  | TFooterLogoProps;

export type TFooterColumnProviderProps = {
  data: TColumn;
};

export type TFooterProps = {
  columns: TColumn[];
  _uid: string | null;
  _editable: string | null;
  component: string | null;
} & TFooterCopyrightProps;
