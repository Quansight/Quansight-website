import { FC } from 'react';

import Link from 'next/link';

import { TBookACallLinkLinkProps } from './types';

export const BookACallLink: FC<TBookACallLinkLinkProps> = ({
  bookACallLinkText,
}) => {
  return (
    <Link href="/">
      <a>{bookACallLinkText}</a>
    </Link>
  );
};
