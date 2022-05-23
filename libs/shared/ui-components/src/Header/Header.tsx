import { FC, useEffect, useState, useRef } from 'react';

import { HeaderNavigation } from './HeaderNavigation';
import { HeaderMenu } from './Menu/HeaderMenu';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  navigation,
  bookACallLinkText,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    // @ts-ignore
    const handleCloseNavigation = (event): void => {
      if (event.isComposing) return;
      if (container.current && !container.current.contains(event.target)) {
        setIsNavigationOpen(false);
      }
      if (event.key === 'Escape' || event.key === 'Esc')
        setIsNavigationOpen(false);
    };

    if (isNavigationOpen) {
      document.body.classList.add('navbar-open');
      window.addEventListener('keydown', handleCloseNavigation);
      document.addEventListener('focusin', handleCloseNavigation);
      return () => {
        window.removeEventListener('keydown', handleCloseNavigation);
        document.removeEventListener('focusin', handleCloseNavigation);
      };
    }

    if (!isNavigationOpen) {
      document.body.classList.remove('navbar-open');
    }
    return;
  }, [isNavigationOpen]);

  return (
    <header ref={container} className="fixed inset-x-0 top-0 z-20 text-white">
      <HeaderMenu
        logo={logo}
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
      <HeaderNavigation
        isNavigationOpen={isNavigationOpen}
        navigation={navigation}
        bookACallLinkText={bookACallLinkText}
      />
    </header>
  );
};
