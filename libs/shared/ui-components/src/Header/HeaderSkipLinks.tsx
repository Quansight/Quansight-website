import { FC } from 'react';

import Link from 'next/link';

import { THeaderSkipLinksProps } from './types';

export const HeaderSkipLinks: FC<THeaderSkipLinksProps> = ({
  skipLinksText,
}) => {
  return (
    <Link href="#main">
      <a>{skipLinksText}</a>
    </Link>
  );
};
