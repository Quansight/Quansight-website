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
    <div className="absolute inset-x-0 top-0 z-50 py-[2rem] max-w-full text-[1.6rem] font-extrabold  text-center text-white transition-transform motion-reduce:transition-none duration-300 ease-in-out -translate-y-full focus-within:translate-y-0 bg-violet">
      <Link href="#maincontent">
        <a className="pb-2 border-b-2 ">{skipLinksText}</a>
      </Link>
    </div>
  );
};
