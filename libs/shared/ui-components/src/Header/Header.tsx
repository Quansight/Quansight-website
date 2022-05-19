import { FC, useState } from 'react';

import { HeaderLogo } from './HeaderLogo';
import HeaderMenuButton from './HeaderMenuButton';
import { HeaderNavigation } from './HeaderNavigation';
// import { HeaderSkipLinks } from './HeaderSkipLinks';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  // skipLinksText,
  navigation,
  bookACallLinkText,
}) => {
  const [toggleNavigation, setToggleNavigation] = useState(false);
  return (
    <header className="text-white bg-black">
      {/* {skipLinksText && <HeaderSkipLinks skipLinksText={skipLinksText} />} */}
      <div className="flex justify-between items-center px-8">
        {logo && (
          <HeaderLogo
            imageSrc={logo.filename}
            imageAlt={logo.alt ? logo.alt : ''}
          />
        )}
        <HeaderMenuButton
          toggleNavigation={toggleNavigation}
          setToggleNavigation={setToggleNavigation}
        />
      </div>
      {navigation && (
        <HeaderNavigation
          navigation={navigation}
          bookACallLinkText={bookACallLinkText}
        />
      )}
    </header>
  );
};

export default Header;
