import { FC } from 'react';

import { Placeholder } from '../../Placeholder/Placeholder';
import {
  THeaderNavigationProviderProps,
  TNavigationLink,
  TNavigationDropdown,
} from '../types';
import { NavigationDropdown } from './NavigationDropdown';
import { NavigationLink } from './NavigationLink';

export const HeaderNavigationProvider: FC<THeaderNavigationProviderProps> = ({
  navigationItem,
  isNavigationOpen,
}) => {
  switch (navigationItem.component) {
    case 'navigation-link':
      return <NavigationLink {...(navigationItem as TNavigationLink)} />;
    case 'navigation-dropdown':
      return (
        <NavigationDropdown
          {...(navigationItem as TNavigationDropdown)}
          isNavigationOpen={isNavigationOpen}
        />
      );
    default:
      return <Placeholder componentName={navigationItem.component} />;
  }
};
