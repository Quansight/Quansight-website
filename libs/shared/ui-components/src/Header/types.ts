import { Dispatch, SetStateAction } from 'react';

import { Asset, Maybe } from '@quansight/shared/storyblok-sdk';
import { TBlok, TLink } from '@quansight/shared/types';

export enum LinkVariant {
  Navigation = 'navigation',
  Dropdown = 'dropdown',
}

export type TNavigationLink = {
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
  linkText: string;
  linkUrl: TLink;
  variant: string;
} & TBlok;

export type TNavigationDropdown = {
  buttonText: string;
  links: TNavigationLink[];
} & TBlok &
  TNavigationOpen;

type THeaderNavigationItem = TNavigationLink | TNavigationDropdown;

type THeaderNavigationItems = { navigation: THeaderNavigationItem[] };

type TNavigationOpen = {
  isNavigationOpen: boolean;
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
};

export type THeaderNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
} & TNavigationOpen;

export type THeaderNavigationProps = THeaderBookingLinkProps &
  THeaderNavigationItems &
  TNavigationOpen;

export type THeaderLogoProps = {
  imageSrc: string;
  imageAlt: string;
};

export type THeaderSkipLinksProps = {
  skipLinksText: Maybe<string>;
};

export type THeaderBookingLinkProps = {
  bookACallLinkText: Maybe<string>;
};

export type THeaderMenuButtonProps = {
  isMenuVisible: boolean;
} & TNavigationOpen;

export type THeaderMenuProps = {
  logo: Maybe<Asset>;
} & TNavigationOpen;

export type THeaderProps = {
  logo: Maybe<Asset>;
} & THeaderSkipLinksProps &
  THeaderBookingLinkProps &
  THeaderNavigationItems;
