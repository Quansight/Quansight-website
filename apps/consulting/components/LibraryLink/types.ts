import { ReactNode } from 'react';

import { TLinkData } from '../../types/storyblok/bloks/libraryProps';

export type TLibraryLinkProps = {
  children: ReactNode;
  link: TLinkData;
  tabIndex?: number;
};
