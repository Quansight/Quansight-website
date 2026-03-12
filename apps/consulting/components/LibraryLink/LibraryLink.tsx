import { FC } from 'react';

import Link from 'next/link';

import { LinkTarget } from '../../types/storyblok/bloks/libraryProps';
import { TLibraryLinkProps } from './/types';

export const LibraryLink: FC<TLibraryLinkProps> = ({
  link,
  children,
  tabIndex = 0,
}) => {
  if (link.linkType === LinkTarget.Internal) {
    return (
      <Link href={link.linkUrl} tabIndex={tabIndex}>
        {children}
      </Link>
    );
  }
  return (
    <a tabIndex={tabIndex} href={link.linkUrl} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};
