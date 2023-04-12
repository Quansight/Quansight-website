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
        'flex w-full flex-wrap items-center gap-x-[3rem] gap-y-[1.5rem] xl:justify-end xl:gap-[2.7rem]',
        domainVariant === DomainVariant.Quansight
          ? 'mt-[2.4rem] justify-start'
          : 'justify-end',
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
