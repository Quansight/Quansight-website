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
} & TBlok;

export type THeaderNavigationItem = TNavigationLink | TNavigationDropdown;

export type THeaderNavigationItems = { navigation: THeaderNavigationItem[] };

export type THeaderNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
};

export type THeaderNavigationProps = {
  isNavigationOpen: boolean;
} & THeaderBookingLinkProps &
  THeaderNavigationItems;

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
  isNavigationOpen: boolean;
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
};

export type THeaderMenuProps = { logo: Maybe<Asset> } & THeaderMenuButtonProps;

export type THeaderProps = {
  logo: Maybe<Asset>;
} & THeaderSkipLinksProps &
  THeaderBookingLinkProps &
  THeaderNavigationItems;
