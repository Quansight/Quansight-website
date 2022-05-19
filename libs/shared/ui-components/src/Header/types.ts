import { Dispatch, SetStateAction } from 'react';

import { Asset, Maybe } from '@quansight/shared/storyblok-sdk';
import { TBlok, TLink } from '@quansight/shared/types';

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
  isNavigationOpen: boolean;
} & TBookACallLinkLinkProps;

export type THeaderNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
};

export type THeaderLogoProps = {
  imageSrc: string;
  imageAlt: string;
};

export type THeaderSkipLinksProps = {
  skipLinksText: Maybe<string>;
};

export type TBookACallLinkLinkProps = {
  bookACallLinkText: Maybe<string>;
};

export type THeaderMenuButtonProps = {
  isNavigationOpen: boolean;
  setIsNavigationOpen: Dispatch<SetStateAction<boolean>>;
};

export type THeaderProps = {
  logo: Maybe<Asset>;
  navigation: THeaderNavigationItem[];
} & THeaderSkipLinksProps &
  TBookACallLinkLinkProps;
