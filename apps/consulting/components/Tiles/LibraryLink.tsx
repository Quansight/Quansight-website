import { FC } from 'react';

import Link from 'next/link';

import { LinkTarget } from '@quansight/shared/types';

import { TLibraryLinkProps } from './types';

export const LibraryLink: FC<TLibraryLinkProps> = ({ link, children }) => {
  if (link.linkType === LinkTarget.Internal) {
    return (
      <Link href={link.linkUrl}>
        <a>{children}</a>
      </Link>
    );
  }
  return (
    <a href={link.linkUrl} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};
