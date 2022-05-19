import { Dispatch, SetStateAction } from 'react';

import { Asset, Maybe } from '@quansight/shared/storyblok-sdk';
import { TBlok, TLink } from '@quansight/shared/types';

export type THeaderProps = { logo: Maybe<Asset> } & THeaderSkipLinksProps &
  THeaderNavigationProps &
  TBookACallLinkLinkProps;

export type THeaderLogoProps = {
  imageSrc: string;
  imageAlt: string;
};

export type THeaderSkipLinksProps = {
  skipLinksText: string | null;
};

export type TBookACallLinkLinkProps = {
  bookACallLinkText: string | null;
};

export type THeaderMenuButtonProps = {
  toggleNavigation: boolean;
  setToggleNavigation: Dispatch<SetStateAction<boolean>>;
};

export type TNavigationLink = {
  linkText: string;
  linkUrl: TLink;
} & TBlok;

export type TNavigationDropdown = {
  buttonText: string;
  links: TNavigationLink[];
} & TBlok;

export type THeaderNavigationItem = TNavigationLink | TNavigationDropdown;

export type THeaderNavigationProps = {
  navigation: THeaderNavigationItem[];
} & TBookACallLinkLinkProps;

export type THeaderNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
};
