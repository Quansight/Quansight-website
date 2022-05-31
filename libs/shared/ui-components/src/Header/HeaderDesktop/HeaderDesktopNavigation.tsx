import { FC } from 'react';

import clsx from 'clsx';

import { DomainVariant } from '@quansight/shared/types';

import { HeaderDesktopNavigationProvider } from './HeaderDesktopNavigationProvider/HeaderDesktopNavigationProvider';
import { THeaderDesktopNavigationProps } from './types';

export const HeaderDesktopNavigation: FC<THeaderDesktopNavigationProps> = ({
  navigation,
  domainVariant,
}) => {
  return (
    <nav
      className={clsx(
        domainVariant === DomainVariant.Quansight
          ? 'justify-start mt-[2.4rem]'
          : 'justify-end',
        'flex flex-wrap gap-x-[3rem] gap-y-[1.5rem] items-center  w-full xl:gap-[2.7rem] xl:justify-end',
      )}
    >
      {navigation.map((navigationItem) => (
        <HeaderDesktopNavigationProvider
          key={navigationItem._uid}
          navigationItem={navigationItem}
        />
      ))}
    </nav>
  );
};
