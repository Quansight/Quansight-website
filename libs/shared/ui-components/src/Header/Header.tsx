import { FC } from 'react';

import clsx from 'clsx';

import { DomainVariant } from '@quansight/shared/types';
import { DeviceSizeVariant, useDeviceSize } from '@quansight/shared/utils';

import PreviewModeBanner from '../PreviewModeBanner/PreviewModeBanner';
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
  preview,
}) => {
  const deviceSize = useDeviceSize();
  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-20 mx-auto text-[#efefef] sm:absolute',
        domainVariant === DomainVariant.Quansight && 'bg-transparent',
        domainVariant === DomainVariant.Labs && 'bg-black',
      )}
    >
      {process.env['NEXT_PUBLIC_VERCEL_ENV'] !== 'production' && (
        <PreviewModeBanner preview={preview} />
      )}
      <div className="mx-auto max-w-layout">
        <HeaderSkipLinks skipLinksText={skipLinksText} />
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
      </div>
    </header>
  );
};
