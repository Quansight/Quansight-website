import { useState, useEffect } from 'react';

import { useMediaQuery } from 'react-responsive';

import {
  mobileSizeQuery,
  tabletSizeQuery,
  tabletLargeSizeQuery,
  desktopSizeQuery,
} from './constants';
import { DeviceSizeVariant } from './types';

export const useDeviceSize = (): string => {
  const [deviceSize, setDeviceSize] = useState('');

  const isMobile = useMediaQuery(mobileSizeQuery);
  const isTablet = useMediaQuery(tabletSizeQuery);
  const isTabletLarge = useMediaQuery(tabletLargeSizeQuery);
  const isDesktop = useMediaQuery(desktopSizeQuery);

  useEffect(() => {
    if (isMobile) setDeviceSize(DeviceSizeVariant.Mobile);
    if (isTablet) setDeviceSize(DeviceSizeVariant.Tablet);
    if (isTabletLarge) setDeviceSize(DeviceSizeVariant.TabletLarge);
    if (isDesktop) setDeviceSize(DeviceSizeVariant.Desktop);
  }, [isDesktop, isTabletLarge, isTablet, isMobile]);

  return deviceSize;
};
