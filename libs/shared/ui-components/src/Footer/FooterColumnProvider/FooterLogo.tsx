import { FC, useState, useEffect } from 'react';

import { DeviceSizeVariant, useDeviceSize } from '@quansight/shared/utils';

import { Picture } from '../../Picture/Picture';
import { TFooterLogoProps } from '../types';

export const FooterLogo: FC<TFooterLogoProps> = ({
  logoMobile,
  logoDesktop,
}) => {
  const [logo, setLogo] = useState(logoMobile);
  const deviceSize = useDeviceSize();

  useEffect(() => {
    const currentLogo =
      deviceSize === DeviceSizeVariant.Desktop ? logoDesktop : logoMobile;

    setLogo(currentLogo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceSize]);

  return (
    <div className="relative top-0 w-[23.9rem] h-[6.455rem] sm:w-[22.6rem] sm:h-[6.104rem]">
      <Picture imageSrc={logo.filename} imageAlt={logo.alt} layout="fill" />
    </div>
  );
};
