import { FC } from 'react';

import Link from 'next/link';

import { TFooterLinkWrapperProps, LinkTargetType } from '../types';
import { getLinkHref } from './utils/getLinkHref';
import { prefixSlug } from './utils/prefixSlug';

export const FooterLinkWrapper: FC<TFooterLinkWrapperProps> = ({
  linkUrl,
  queryString,
  children,
  ...props
}) => {
  switch (linkUrl?.linktype) {
    case LinkTargetType.Story:
      return (
        <Link
          href={getLinkHref(prefixSlug(linkUrl.cached_url), queryString)}
          {...props}>
          {children}
        </Link>
      );
    case LinkTargetType.Url:
      return (
        <a
          {...props}
          href={getLinkHref(linkUrl?.url, queryString)}
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      );
    default:
      return null;
  }
};
