import { FC, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { THeaderSkipLinksProps } from '../types';

export const HeaderSkipLinks: FC<THeaderSkipLinksProps> = ({
  skipLinksText,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === '/#maincontent') {
      const mainContent = document.getElementById('maincontent');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
    }
  }, [router.asPath]);

  return (
    <Link href="#maincontent">
      <a> {skipLinksText}</a>
    </Link>
  );
};
