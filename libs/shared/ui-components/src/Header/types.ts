import { Dispatch, SetStateAction } from 'react';

import { Asset, Maybe } from '@quansight/shared/storyblok-sdk';
import { TBlok, TLink } from '@quansight/shared/types';

export enum LinkVariant {
  Navigation = 'navigation',
  Dropdown = 'dropdown',
}

export type TNavigationLink = {
  linkText: string;
  linkUrl: TLink;
  variant: string;
} & TBlok;

export type TNavigationDropdown = {
  buttonText: string;
  links: TNavigationLink[];
} & TBlok &
  TIsNavigationOpen;

type THeaderNavigationItem = TNavigationLink | TNavigationDropdown;

type THeaderNavigationItems = { navigation: THeaderNavigationItem[] };

type TIsNavigationOpen = { isNavigationOpen: boolean };

export type THeaderNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
} & TIsNavigationOpen;

export type THeaderNavigationProps = {} & THeaderBookingLinkProps &
  THeaderNavigationItems &
  TIsNavigationOpen;

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
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
} & TIsNavigationOpen;

export type THeaderMenuProps = { logo: Maybe<Asset> } & THeaderMenuButtonProps;

export type THeaderProps = {
  logo: Maybe<Asset>;
} & THeaderSkipLinksProps &
  THeaderBookingLinkProps &
  THeaderNavigationItems;
