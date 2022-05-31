import { Dispatch, SetStateAction } from 'react';

import {
  THeaderLogoProps,
  THeaderNavigation,
  TDomainVariant,
  THeaderDropdown,
  THeaderLink,
} from '../types';

export type THeaderDesktopProps = THeaderLogoProps &
  THeaderNavigation &
  TDomainVariant;

export type THeaderDesktopNavigationProviderProps = {
  navigationItem: THeaderLink | THeaderDropdown;
};

export type THeaderDesktopNavigationProps = THeaderNavigation;

export type THeaderDesktopLinkProps = THeaderLink;

export type THeaderDesktopDropdownProps = THeaderDropdown;

export type THeaderDesktopDropdownLinkProps = {
  onDropdownClose: Dispatch<SetStateAction<boolean>>;
} & THeaderLink;
