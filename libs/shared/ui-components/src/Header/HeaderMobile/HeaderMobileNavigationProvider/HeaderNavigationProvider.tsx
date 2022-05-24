import { FC } from 'react';

import { Placeholder } from '../../../Placeholder/Placeholder';
import {
  THeaderMobileNavigationProviderProps,
  TNavigationMobileLink,
  TNavigationDropdown,
} from '../types';
import { NavigationDropdown } from './NavigationDropdown';
import { NavigationMobileLink } from './NavigationMobileLink';

export const HeaderMobileNavigationProvider: FC<
  THeaderMobileNavigationProviderProps
> = ({ navigationItem, isNavigationOpen, setIsNavigationOpen }) => {
  switch (navigationItem.component) {
    case 'navigation-link':
      return (
        <NavigationMobileLink
          {...(navigationItem as TNavigationMobileLink)}
          setIsNavigationOpen={setIsNavigationOpen}
        />
      );
    case 'navigation-dropdown':
      return (
        <NavigationDropdown
          {...(navigationItem as TNavigationDropdown)}
          isNavigationOpen={isNavigationOpen}
          setIsNavigationOpen={setIsNavigationOpen}
        />
      );
    default:
      return <Placeholder componentName={navigationItem.component} />;
  }
};
