import { DomainVariant, TImage, TLink, TBlok } from '@quansight/shared/types';

import { TBookingLink } from './HeaderMobile/types';

export type TDomainVariant = { domainVariant: DomainVariant };

export enum LinkVariant {
  Navigation = 'navigation',
  Dropdown = 'dropdown',
}

export type THeaderLink = {
  linkText: string;
  linkUrl: TLink;
  variant: string;
  queryParams?: string;
} & TBlok;

export type THeaderDropdown = {
  buttonText: string;
  links: THeaderLink[];
} & TBlok;

type THeaderNavigationItem = THeaderLink | THeaderDropdown;

export type THeaderNavigation = { navigation: THeaderNavigationItem[] };

export type THeaderLogoProps = {
  logo: TImage;
} & TDomainVariant;

export type THeaderSkipLinksProps = {
  skipLinksText: string;
};

export type THeaderProps = TBookingLink &
  TDomainVariant &
  THeaderLogoProps &
  THeaderNavigation &
  THeaderSkipLinksProps &
  TBlok;
