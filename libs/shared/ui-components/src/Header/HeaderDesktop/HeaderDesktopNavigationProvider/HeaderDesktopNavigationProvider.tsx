import { FC } from 'react';

import { Placeholder } from '../../../Placeholder/Placeholder';
import { THeaderLink, THeaderDropdown } from '../../types';
import { THeaderDesktopNavigationProviderProps } from '../types';
import { HeaderDesktopDropdown } from './HeaderDesktopDropdown';
import { HeaderDesktopLink } from './HeaderDesktopLink';

export const HeaderDesktopNavigationProvider: FC<
  THeaderDesktopNavigationProviderProps
> = ({ navigationItem }) => {
  switch (navigationItem.component) {
    case 'navigation-link':
      return <HeaderDesktopLink {...(navigationItem as THeaderLink)} />;
    case 'navigation-dropdown':
      return <HeaderDesktopDropdown {...(navigationItem as THeaderDropdown)} />;
    default:
      return <Placeholder componentName={navigationItem.component} />;
  }
};
