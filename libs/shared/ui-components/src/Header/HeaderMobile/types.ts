import { Dispatch, SetStateAction } from 'react';

import { Asset, Maybe } from '@quansight/shared/storyblok-sdk';
import { TBlok, TLink } from '@quansight/shared/types';

import { THeaderSkipLinksProps } from '../Common/types';

export type TNavigationMobileLink = {
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
  linkText: string;
  linkUrl: TLink;
  variant: string;
} & TBlok;

export type TNavigationDropdown = {
  buttonText: string;
  links: TNavigationMobileLink[];
} & TBlok &
  TNavigationOpen;

type THeaderNavigationItem = TNavigationMobileLink | TNavigationDropdown;

type THeaderNavigationItems = { navigation: THeaderNavigationItem[] };

type TNavigationOpen = {
  isNavigationOpen: boolean;
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
};

export type THeaderMobileNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
} & TNavigationOpen;

export type THeaderMobileNavigationProps = THeaderMobileBookingLinkProps &
  THeaderNavigationItems &
  TNavigationOpen;

export type THeaderMobileBookingLinkProps = {
  bookACallLinkText: Maybe<string>;
};

export type THeaderMobileMenuButtonProps = {
  isMenuVisible: boolean;
} & TNavigationOpen;

export type THeaderMobileMenuProps = {
  logo: Maybe<Asset>;
} & TNavigationOpen;

export type THeaderMobileProps = {
  logo: Maybe<Asset>;
} & THeaderSkipLinksProps &
  THeaderMobileBookingLinkProps &
  THeaderNavigationItems;
