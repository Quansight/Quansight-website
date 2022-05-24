import { ReactNode } from 'react';

import { FooterItem, HeaderItem } from '@quansight/shared/storyblok-sdk';
import { DomainVariant } from '@quansight/shared/types';

export type TLayoutProps = {
  children: ReactNode;
  footer: FooterItem;
  header: HeaderItem;
  variant: DomainVariant;
};
