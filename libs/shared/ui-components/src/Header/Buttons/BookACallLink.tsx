import { FC } from 'react';

import Link from 'next/link';

import { TBookACallLinkLinkProps } from '../types';

export const BookACallLink: FC<TBookACallLinkLinkProps> = ({
  bookACallLinkText,
}) => {
  return (
    <Link href="/">
      <a className="inline-block py-[1.6rem] px-[4.4rem] mt-[6.8rem] text-[1.7rem] font-extrabold leading-[2.825rem] text-white bg-pink font-heading">
        {bookACallLinkText}
      </a>
    </Link>
  );
};
