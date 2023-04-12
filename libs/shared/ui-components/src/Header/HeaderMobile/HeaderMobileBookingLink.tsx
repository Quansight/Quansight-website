import { FC } from 'react';

import { useRouter } from 'next/router';

import { DomainVariant } from '@quansight/shared/types';
import { BOOK_A_CALL_FORM_ID } from '@quansight/shared/utils';

import { TBookingLinkProps } from './types';

export const HeaderMobileBookingLink: FC<TBookingLinkProps> = ({
  bookACallLinkText,
  domainVariant,
  setIsNavigationOpen,
}) => {
  const router = useRouter();

  const onButtonClick = (): void => {
    setIsNavigationOpen(false);
    const url =
      domainVariant === DomainVariant.Quansight
        ? `/about-us#${BOOK_A_CALL_FORM_ID}`
        : `/#${BOOK_A_CALL_FORM_ID}`;

    router.push(url);
  };

  return (
    <button
      onClick={onButtonClick}
      className="bg-pink font-heading mx-[2rem] mt-[6.8rem] inline-block px-[4.4rem] py-[1.6rem] text-[1.7rem] font-extrabold leading-[2.825rem] text-white"
    >
      <div className="flex items-center justify-between">
        {bookACallLinkText}
        <span
          aria-hidden="true"
          className="border-y-solid border-l-solid ml-4 inline-block h-0 w-0 border-y-8 border-l-8 border-y-transparent"
        />
      </div>
    </button>
  );
};
