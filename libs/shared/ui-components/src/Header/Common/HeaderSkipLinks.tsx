import { FC } from 'react';

import { useRouter } from 'next/router';

import { THeaderSkipLinksProps } from '../types';

export const HeaderSkipLinks: FC<THeaderSkipLinksProps> = ({
  skipLinksText,
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
    <div className="absolute inset-x-0 top-0 z-50 max-w-full -translate-y-full bg-black py-[2rem]  text-center text-[1.6rem] font-extrabold text-white transition-transform duration-300 ease-in-out focus-within:translate-y-0 motion-reduce:transition-none">
      <button onClick={onSkipLinks} className="border-b-2 pb-2 ">
        {skipLinksText}
      </button>
    </div>
  );
};
