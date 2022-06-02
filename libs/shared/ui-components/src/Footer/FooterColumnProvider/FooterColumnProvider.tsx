import { FC } from 'react';

import { Placeholder } from '../../Placeholder/Placeholder';
import {
  TFooterContactProps,
  TFooterNavigationProps,
  TFooterColumnProviderProps,
  TFooterSocialMediaProps,
  TFooterLogoProps,
} from '../types';
import { FooterContact } from './FooterContact';
import { FooterLogo } from './FooterLogo';
import { FooterNavigation } from './FooterNavigation';
import { FooterSocialMedia } from './FooterSocialMedia';

export const FooterColumnProvider: FC<TFooterColumnProviderProps> = ({
  data,
}) => {
  switch (data.component) {
    case 'footer-logo':
      return <FooterLogo {...(data as TFooterLogoProps)} />;
    case 'footer-navigation':
      return <FooterNavigation {...(data as TFooterNavigationProps)} />;
    case 'footer-contact':
      return <FooterContact {...(data as TFooterContactProps)} />;
    case 'footer-social-media':
      return <FooterSocialMedia {...(data as TFooterSocialMediaProps)} />;
    default:
      return <Placeholder componentName={data.component} />;
  }
};
