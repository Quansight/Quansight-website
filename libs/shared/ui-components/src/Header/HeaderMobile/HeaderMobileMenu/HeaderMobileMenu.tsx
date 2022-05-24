import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import { HeaderLogo } from '../../Common/HeaderLogo';
import { THeaderMobileMenuProps } from '../types';
import { HeaderMobileMenuButton } from './HeaderMobileMenuButton';

export const HeaderMobileMenu: FC<THeaderMobileMenuProps> = ({
  logo,
  isNavigationOpen,
  setIsNavigationOpen,
  variant,
}) => {
  const [menuBackground, setMenuBackground] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(0);
  const [isMenuVisible, setIsMenuVidible] = useState(true);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSetMenuBackground = (): void => {
      if (typeof window !== 'undefined') {
        const menuHeight = container.current?.clientHeight || 70;
        setIsMenuVidible(window.scrollY > menuVisibility ? false : true);
        setMenuBackground(window.scrollY >= menuHeight ? true : false);
        setMenuVisibility(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleSetMenuBackground);
    return () => window.removeEventListener('scroll', handleSetMenuBackground);
  }, [menuVisibility]);

  return (
    <div
      ref={container}
      className={clsx(
        'flex absolute z-40 justify-between items-center px-[2rem] pb-1 w-full transition-all motion-reduce:transition-none duration-300 ease-in-out',

        menuBackground
          ? variant === 'Quansight'
            ? 'bg-black'
            : 'bg-violet'
          : 'bg-transparent',
        isMenuVisible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      {logo && (
        <HeaderLogo
          imageSrc={logo.filename}
          imageAlt={logo.alt || ''}
          variant={variant}
        />
      )}
      <HeaderMobileMenuButton
        isMenuVisible={isMenuVisible}
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
    </div>
  );
};
