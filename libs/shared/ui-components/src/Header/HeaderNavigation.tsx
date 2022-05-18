import { FC } from 'react';

import { HeaderNavigationProvider } from './HeaderNavigationProvider/HeaderNavigationProvider';
import { THeaderNavigationProps } from './types';

export const HeaderNavigation: FC<THeaderNavigationProps> = ({
  navigation,
}) => {
  return (
    <nav className="flex gap-8 justify-end items-center">
      {navigation.map((navigationItem) => (
        <HeaderNavigationProvider
          navigationItem={navigationItem}
          key={navigationItem._uid}
        />
      ))}
    </nav>
  );
};
