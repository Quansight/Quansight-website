import { ReactNode } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { TBlok, TImage, TLink, TRichText } from '@quansight/shared/types';

export enum LinkTargetType {
  Story = 'story',
  Url = 'url',
}

type TFooterLinkWrapper = {
  linkUrl: TLink;
  queryString?: string;
};

export type TFooterLinkWrapperProps = {
  children: ReactNode;
  className?: string;
} & TFooterLinkWrapper;

export type TFooterLinkContentProps = {
  linkText: Maybe<string>;
  linkImage?: TImage;
};

type TFooterLink = TFooterLinkContentProps & TFooterLinkWrapperProps;

export type TFooterLinkProps = {
  className?: string;
} & TFooterLink;

type TFooterLinkRawData = TFooterLink & TBlok;

// Provider Bloks
export type TFooterLogoProps = {
  logoMobile: TImage;
  logoDesktop: TImage;
} & TBlok;

export type TFooterNavigationProps = {
  title: string;
  links: TFooterLinkRawData[];
} & TBlok;

export type TFooterContactProps = {
  title: string;
  contact: TRichText;
  buttonText: string;
  buttonLink: TLink;
} & TBlok;

export type TFooterSocialMediaProps = {
  title: string;
  links: TFooterLinkRawData[];
} & TBlok;

type TColumn =
  | TFooterNavigationProps
  | TFooterContactProps
  | TFooterSocialMediaProps
  | TFooterLogoProps;

export type TFooterColumnProviderProps = {
  data: TColumn;
};

export type TFooterCopyrightProps = {
  policyAndConditions: TFooterLinkRawData[];
  copyright: string | null;
};

export type TFooterProps = {
  columns: TColumn[];
  _uid: string | null;
  _editable: string | null;
  component: string | null;
} & TFooterCopyrightProps;
