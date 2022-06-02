import { FC } from 'react';

import { HeaderLogo } from '../Common/HeaderLogo';
import { HeaderDesktopNavigation } from './HeaderDesktopNavigation';
import { THeaderDesktopProps } from './types';

export const HeaderDesktop: FC<THeaderDesktopProps> = ({
  logo,
  navigation,
  domainVariant,
}) => {
  return (
    <div className="hidden gap-[4.7rem] justify-between items-center sm:flex sm:px-[3.4rem] lg:gap-[13.7rem] xl:gap-[15.1rem] xl:px-[11.5rem]">
      <HeaderLogo logo={logo} domainVariant={domainVariant} />
      <HeaderDesktopNavigation
        navigation={navigation}
        domainVariant={domainVariant}
      />
    </div>
  );
};
