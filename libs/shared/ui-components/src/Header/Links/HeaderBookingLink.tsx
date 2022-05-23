import { FC } from 'react';

import Link from 'next/link';

import { THeaderBookingLinkProps } from '../types';

export const HeaderBookingLink: FC<THeaderBookingLinkProps> = ({
  bookACallLinkText,
}) => (
  <Link href="/">
    <a className="inline-block py-[1.6rem] px-[4.4rem] mx-[2rem] mt-[6.8rem] text-[1.7rem] font-extrabold leading-[2.825rem] text-white bg-pink font-heading">
      {bookACallLinkText}
    </a>
  </Link>
);
