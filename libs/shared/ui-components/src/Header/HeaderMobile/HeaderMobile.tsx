import React, { FC, useEffect, useState, useRef } from 'react';

import { HeaderSkipLinks } from '../Common/HeaderSkipLinks';
import { HeaderMobileMenu } from './HeaderMobileMenu/HeaderMobileMenu';
import { HeaderMobileNavigation } from './HeaderMobileNavigation';
import { THeaderMobileProps } from './types';

export const HeaderMobile: FC<THeaderMobileProps> = ({
  logo,
  navigation,
  bookACallLinkText,
  skipLinksText,
  variant,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

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
    <div ref={container} className="sm:hidden">
      <HeaderSkipLinks skipLinksText={skipLinksText} />
      <HeaderMobileMenu
        logo={logo}
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
        variant={variant}
      />
      <HeaderMobileNavigation
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
        navigation={navigation}
        bookACallLinkText={bookACallLinkText}
        variant={variant}
      />
    </div>
  );
};
