import { FC } from 'react';

import {
  TFooterContactProps,
  TFooterNavigationProps,
  TFooterProviderProps,
  TFooterSocialMediaProps,
} from '../types';

import { Placeholder } from '../../Placeholder/Placeholder';
import FooterNavigation from './FooterNavigation';
import FooterContact from './FooterContact';
import FooterSocialMedia from './FooterSocialMedia';

export const FooterProvider: FC<TFooterProviderProps> = ({ data }) => {
  switch (data.component) {
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
