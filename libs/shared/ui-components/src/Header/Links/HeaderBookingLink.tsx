import { FC } from 'react';

import Link from 'next/link';

import { THeaderBookingLinkProps } from '../types';

export const HeaderBookingLink: FC<THeaderBookingLinkProps> = ({
  bookACallLinkText,
}) => (
  <Link href="/">
    <a className="inline-block py-[1.6rem] px-[4.4rem] mx-[2rem] mt-[6.8rem] text-[1.7rem] font-extrabold leading-[2.825rem] text-white bg-pink font-heading">
      <div className="flex justify-between items-center">
        {bookACallLinkText}
        <span
          aria-hidden="true"
          className="inline-block ml-4 w-0 h-0 border-y-8 border-l-8 border-y-transparent border-y-solid border-l-solid"
        />
      </div>
    </a>
  </Link>
);
