import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import { THeaderMenuProps } from '../types';
import { HeaderLogo } from './HeaderLogo';
import { HeaderMenuButton } from './HeaderMenuButton';

export const HeaderMenu: FC<THeaderMenuProps> = ({
  logo,
  isNavigationOpen,
  setIsNavigationOpen,
}) => {
  const [menuBackground, setMenuBackground] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(0);
  const [isMenuVisible, setIsMenuVidible] = useState(true);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSetMenuBackground = (): void => {
      if (typeof window !== 'undefined') {
        setIsMenuVidible(window.scrollY > menuVisibility ? false : true);
        const menuHeight = container.current?.clientHeight || 70;
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
        menuBackground ? 'bg-black' : 'bg-transparent',
        isMenuVisible ? 'translate-y-0' : 'translate-y-[-10rem]',
      )}
    >
      {logo && (
        <HeaderLogo imageSrc={logo.filename} imageAlt={logo.alt || ''} />
      )}
      <HeaderMenuButton
        isMenuVisible={isMenuVisible}
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
    </div>
  );
};
