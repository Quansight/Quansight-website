import Image from 'next/image';

import { useDeviceSize, DeviceSizeVariant } from '@quansight/shared/utils';

import { TResponsiveImages } from './types';

export const HeroResponsiveImages = ({
  imageMobile,
  imageTablet,
  imageDesktop,
}: TResponsiveImages) => {
  const deviceSize = useDeviceSize();

  return (
    <>
      {deviceSize === DeviceSizeVariant.Mobile && (
        <Image
          src={imageMobile.imageSrc}
          alt={imageMobile.imageAlt}
          layout="fill"
          objectFit={imageMobile.objectFit || 'cover'}
          objectPosition="center"
        />
      )}
      {(deviceSize === DeviceSizeVariant.Tablet ||
        deviceSize === DeviceSizeVariant.TabletLarge) && (
        <Image
          src={imageTablet.imageSrc}
          alt={imageTablet.imageAlt}
          layout="fill"
          objectFit={imageTablet.objectFit || 'cover'}
          objectPosition="center"
        />
      )}
      {deviceSize === DeviceSizeVariant.Desktop && (
        <Image
          src={imageDesktop.imageSrc}
          alt={imageDesktop.imageAlt}
          layout="fill"
          objectFit={imageDesktop.objectFit || 'cover'}
          objectPosition="center"
        />
      )}
    </>
  );
};
