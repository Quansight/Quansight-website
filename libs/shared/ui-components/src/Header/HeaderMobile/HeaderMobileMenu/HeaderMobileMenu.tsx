import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import { DomainVariant } from '@quansight/shared/types';

import { HeaderLogo } from '../../Common/HeaderLogo';
import { THeaderMobileMenuProps } from '../types';
import { HeaderMobileMenuButton } from './HeaderMobileMenuButton';

export const HeaderMobileMenu: FC<THeaderMobileMenuProps> = ({
  logo,
  isNavigationOpen,
  setIsNavigationOpen,
  domainVariant,
}) => {
  const [menuBackground, setMenuBackground] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSetMenuBackground = (): void => {
      if (typeof window !== 'undefined') {
        const menuHeight = container.current?.clientHeight || 70;
        setIsMenuVisible(window.scrollY < scrollPosition);
        setMenuBackground(window.scrollY >= menuHeight);
        setScrollPosition(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleSetMenuBackground);
    return () => window.removeEventListener('scroll', handleSetMenuBackground);
  }, [scrollPosition]);

  return (
    <div
      ref={container}
      className={clsx(
        'absolute z-40 flex w-full items-center justify-between px-[2rem] py-[0.5rem] transition-all duration-300 ease-in-out motion-reduce:transition-none',
        !menuBackground && domainVariant === DomainVariant.Quansight
          ? 'bg-transparent'
          : 'bg-black',
        isMenuVisible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <HeaderLogo logo={logo} domainVariant={domainVariant} />
      <HeaderMobileMenuButton
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
    </div>
  );
};
