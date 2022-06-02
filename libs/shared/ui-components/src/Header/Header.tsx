import { FC } from 'react';

import { DeviceSizeVariant, useDeviceSize } from '@quansight/shared/utils';

import { HeaderSkipLinks } from './Common/HeaderSkipLinks';
import { HeaderDesktop } from './HeaderDesktop/HeaderDesktop';
import { HeaderMobile } from './HeaderMobile/HeaderMobile';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  bookACallLinkText,
  domainVariant,
  logo,
  navigation,
  skipLinksText,
}) => {
  const deviceSize = useDeviceSize();
  return (
    <header className="fixed inset-x-0 top-0 z-20 mx-auto text-white sm:absolute max-w-layout">
      <HeaderSkipLinks
        skipLinksText={skipLinksText}
        domainVariant={domainVariant}
      />
      {deviceSize === DeviceSizeVariant.Mobile && (
        <HeaderMobile
          logo={logo}
          navigation={navigation}
          bookACallLinkText={bookACallLinkText}
          domainVariant={domainVariant}
        />
      )}
      {deviceSize !== DeviceSizeVariant.Mobile && (
        <HeaderDesktop
          logo={logo}
          navigation={navigation}
          domainVariant={domainVariant}
        />
      )}
    </header>
  );
};
