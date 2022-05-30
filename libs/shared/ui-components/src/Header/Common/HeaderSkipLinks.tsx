import { FC } from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/router';

import { DomainVariant } from '@quansight/shared/types';

import { THeaderSkipLinksProps } from '../types';

export const HeaderSkipLinks: FC<THeaderSkipLinksProps> = ({
  skipLinksText,
  domainVariant,
}) => {
  const router = useRouter();

  const onSkipLinks = (): void => {
    const mainContent = document.getElementById('maincontent');
    router.push('#maincontent');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  };

  return (
    <div
      className={clsx(
        'absolute inset-x-0 top-0 z-50 py-[2rem] max-w-full text-[1.6rem] font-extrabold  text-center text-white transition-transform motion-reduce:transition-none duration-300 ease-in-out -translate-y-full focus-within:translate-y-0',
        domainVariant === DomainVariant.Quansight ? 'bg-black' : 'bg-violet',
      )}
    >
      <button onClick={onSkipLinks} className="pb-2 border-b-2 ">
        {skipLinksText}
      </button>
    </div>
  );
};
