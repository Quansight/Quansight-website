import { FC } from 'react';

import Link from 'next/link';

import { TLibraryLinkProps } from './types';
import { LinkTarget } from './types';

export const LibraryLink: FC<TLibraryLinkProps> = ({ link, children }) => {
  switch (link.linkType) {
    case LinkTarget.Internal:
      return (
        <Link href={link.linkUrl}>
          <a>{children}</a>
        </Link>
      );
    case LinkTarget.External:
      return (
        <a href={link.linkUrl} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    default:
      return (
        <Link href={link.linkUrl}>
          <a>{children}</a>
        </Link>
      );
  }
};
