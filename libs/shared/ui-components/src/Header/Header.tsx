import React, { FC, useEffect, useState, useRef } from 'react';

import { HeaderNavigation } from './HeaderNavigation';
import { HeaderSkipLinks } from './Links/HeaderSkipLinks';
import { HeaderMenu } from './Menu/HeaderMenu';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  navigation,
  bookACallLinkText,
  skipLinksText,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyboardClose = (event: KeyboardEvent): void => {
      if (event.isComposing) return;
      if (event.key === 'Escape' || event.key === 'Esc')
        setIsNavigationOpen(false);
    };

    const handleFocusClose = (event: FocusEvent): void => {
      // @ts-ignore
      if (container.current && !container.current.contains(event.target)) {
        setIsNavigationOpen(false);
      }
    };

    if (isNavigationOpen) {
      document.body.classList.add('navbar-open');
      window.addEventListener('keydown', handleKeyboardClose);
      document.addEventListener('focusin', handleFocusClose);
      return () => {
        window.removeEventListener('keydown', handleKeyboardClose);
        document.removeEventListener('focusin', handleFocusClose);
      };
    }

    if (!isNavigationOpen) {
      document.body.classList.remove('navbar-open');
    }
    return;
  }, [isNavigationOpen]);

  return (
    <header ref={container} className="fixed inset-x-0 top-0 z-20 text-white">
      <HeaderSkipLinks skipLinksText={skipLinksText} />
      <HeaderMenu
        logo={logo}
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
      <HeaderNavigation
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
        navigation={navigation}
        bookACallLinkText={bookACallLinkText}
      />
    </header>
  );
};
