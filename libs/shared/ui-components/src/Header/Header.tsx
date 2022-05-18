import { FC } from 'react';

import { HeaderLogo } from './HeaderLogo';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderSkipLinks } from './HeaderSkipLinks';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  skipLinksText,
  navigation,
}) => {
  return (
    <header>
      {skipLinksText && <HeaderSkipLinks skipLinksText={skipLinksText} />}
      {logo && (
        <HeaderLogo
          imageSrc={logo.filename}
          imageAlt={logo.alt ? logo.alt : ''}
        />
      )}
      {navigation && <HeaderNavigation navigation={navigation} />}
    </header>
  );
};

export default Header;
