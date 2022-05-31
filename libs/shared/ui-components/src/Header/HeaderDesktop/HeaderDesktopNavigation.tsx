import { FC } from 'react';

import { HeaderDesktopNavigationProvider } from './HeaderDesktopNavigationProvider/HeaderDesktopNavigationProvider';
import { THeaderDesktopNavigationProps } from './types';

export const HeaderDesktopNavigation: FC<THeaderDesktopNavigationProps> = ({
  navigation,
}) => {
  return (
    <nav className="flex flex-wrap gap-x-[3rem] gap-y-[1.5rem] justify-start items-center mt-[2.4rem] w-full xl:gap-[2.7rem] xl:justify-end">
      {navigation.map((navigationItem) => (
        <HeaderDesktopNavigationProvider
          key={navigationItem._uid}
          navigationItem={navigationItem}
        />
      ))}
    </nav>
  );
};
