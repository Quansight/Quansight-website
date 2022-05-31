import { Dispatch, SetStateAction } from 'react';

import {
  TDomainVariant,
  THeaderLogoProps,
  THeaderNavigation,
  THeaderLink,
  THeaderDropdown,
  LinkVariant,
} from '../types';

type TIsNavigationOpen = {
  isNavigationOpen: boolean;
};

type TSetIsNavigationOpen = {
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
};

export type THeaderMobileMenuButtonProps = TIsNavigationOpen &
  TSetIsNavigationOpen;

export type THeaderMobileMenuProps = THeaderMobileMenuButtonProps &
  THeaderLogoProps &
  TDomainVariant;

export type THeaderMobileNavigationProps = TBookingLinkProps &
  THeaderMobileMenuButtonProps &
  TDomainVariant &
  THeaderNavigation;

export type THeaderMobileProps = THeaderLogoProps &
  THeaderNavigation &
  TBookingLink &
  TDomainVariant;

export type THeaderMobileNavigationProviderProps = {
  navigationItem: THeaderLink | THeaderDropdown;
} & TIsNavigationOpen &
  TSetIsNavigationOpen;

export type THeaderMobileLinkProps = {
  linkVariant: LinkVariant;
} & THeaderLink &
  TSetIsNavigationOpen;

export type THeaderMobileDropdownProps = THeaderDropdown &
  TIsNavigationOpen &
  TSetIsNavigationOpen;

export type TBookingLink = { bookACallLinkText: string };

export type TBookingLinkProps = TDomainVariant &
  TSetIsNavigationOpen &
  TBookingLink;
