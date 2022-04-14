import { TBlok, TImage, TLink, TRichText } from '@quansight/shared/types';

type LinkItem = {
  linkText?: string;
  linkImage?: TImage;
  linkUrl: TLink;
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
} & TBlok &
  TFooterCopyrightProps;
