import { ReactNode } from 'react';

import { TLinkData } from '@quansight/shared/types';

export type TLibraryLinkProps = {
  children: ReactNode;
  link: TLinkData;
  tabIndex?: number;
};
