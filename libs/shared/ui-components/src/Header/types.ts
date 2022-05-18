import { Asset, Maybe } from '@quansight/shared/storyblok-sdk';
import { TBlok, TLink } from '@quansight/shared/types';

export type THeaderProps = { logo: Maybe<Asset> } & THeaderSkipLinksProps &
  THeaderNavigationProps;

export type THeaderLogoProps = {
  imageSrc: string;
  imageAlt: string;
};

export type THeaderSkipLinksProps = {
  skipLinksText: string | null;
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
};

export type THeaderNavigationProviderProps = {
  navigationItem: THeaderNavigationItem;
};
