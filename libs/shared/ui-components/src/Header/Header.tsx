import { FC, useEffect, useState } from 'react';

import clsx from 'clsx';

import HeaderMenuButton from './Buttons/HeaderMenuButton';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNavigation } from './HeaderNavigation';
// import { HeaderSkipLinks } from './HeaderSkipLinks';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  // skipLinksText,
  navigation,
  bookACallLinkText,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    if (isNavigationOpen) document.body.classList.add('navbar-open');
    if (!isNavigationOpen) document.body.classList.remove('navbar-open');
  }, [isNavigationOpen]);

  return (
    <header className="bg-red">
      {/* {skipLinksText && <HeaderSkipLinks skipLinksText={skipLinksText} />} */}
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
      {navigation && (
        <HeaderNavigation
          navigation={navigation}
          bookACallLinkText={bookACallLinkText}
          isNavigationOpen={isNavigationOpen}
        />
      )}
    </header>
  );
};

export default Header;
