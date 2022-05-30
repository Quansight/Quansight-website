import { DomainVariant, TImage, TLink } from '@quansight/shared/types';
import { TBlok } from '@quansight/shared/types';

import { TBookingLinkProps } from './HeaderMobile/types';

export type TDomainVariant = { domainVariant: DomainVariant };

export enum LinkVariant {
  Navigation = 'navigation',
  Dropdown = 'dropdown',
}

export type THeaderLink = {
  linkText: string;
  linkUrl: TLink;
  variant: string;
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
} & TDomainVariant;

export type THeaderProps = TBookingLinkProps &
  TDomainVariant &
  THeaderLogoProps &
  THeaderNavigation &
  THeaderSkipLinksProps &
  TBlok;
