import { FC, useEffect, useState } from 'react';

import { HeaderNavigation } from './HeaderNavigation';
import { HeaderMenu } from './Menu/HeaderMenu';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  navigation,
  bookACallLinkText,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  type KeyboardEvent = {
    isComposing: boolean;
    key: string;
  };

  useEffect(() => {
    const handleToggleNavigation = (kbdEvent: KeyboardEvent): void => {
      if (kbdEvent.isComposing) return;
      if (kbdEvent.key === 'Escape' || kbdEvent.key === 'Esc')
        setIsNavigationOpen(false);
    };

    if (isNavigationOpen) {
      document.body.classList.add('navbar-open');
      window.addEventListener('keydown', handleToggleNavigation);
    }
    if (!isNavigationOpen) {
      document.body.classList.remove('navbar-open');
      window.removeEventListener('keydown', handleToggleNavigation);
    }
  }, [isNavigationOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-20 text-white">
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
