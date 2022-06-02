import { FC } from 'react';

import { Placeholder } from '../../../Placeholder/Placeholder';
import { THeaderLink, THeaderDropdown, LinkVariant } from '../../types';
import { THeaderMobileNavigationProviderProps } from '../types';
import { HeaderMobileDropdown } from './HeaderMobileDropdown';
import { HeaderMobileLink } from './HeaderMobileLink';

export const HeaderMobileNavigationProvider: FC<
  THeaderMobileNavigationProviderProps
> = ({ navigationItem, isNavigationOpen, setIsNavigationOpen }) => {
  switch (navigationItem.component) {
    case 'navigation-link':
      return (
        <HeaderMobileLink
          {...(navigationItem as THeaderLink)}
          linkVariant={LinkVariant.Navigation}
          setIsNavigationOpen={setIsNavigationOpen}
        />
      );
    case 'navigation-dropdown':
      return (
        <HeaderMobileDropdown
          {...(navigationItem as THeaderDropdown)}
          isNavigationOpen={isNavigationOpen}
          setIsNavigationOpen={setIsNavigationOpen}
        />
      );
    default:
      return <Placeholder componentName={navigationItem.component} />;
  }
};
