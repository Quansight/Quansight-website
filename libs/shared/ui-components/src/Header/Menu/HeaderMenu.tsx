import { FC } from 'react';

import { THeaderMenuProps } from '../types';
import { HeaderLogo } from './HeaderLogo';
import { HeaderMenuButton } from './HeaderMenuButton';

export const HeaderMenu: FC<THeaderMenuProps> = ({
  logo,
  isNavigationOpen,
  setIsNavigationOpen,
}) => (
  <div className="flex absolute z-40 justify-between items-center px-[2rem] pb-1 w-full">
    {logo && (
      <HeaderLogo
        imageSrc={logo.filename}
        imageAlt={logo.alt ? logo.alt : ''}
      />
    )}
    <HeaderMenuButton
      isNavigationOpen={isNavigationOpen}
      setIsNavigationOpen={setIsNavigationOpen}
    />
  </div>
);
