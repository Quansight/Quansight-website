import React, { FC } from 'react';

import Image from 'next/image';
import Link, { LinkProps } from 'next/link';

export type LinkWithArrowProps = LinkProps & { children: React.ReactNode };

export const LinkWithArrow: FC<LinkWithArrowProps> = ({
  children,
  ...restProps
}) => {
  return (
    <Link {...restProps} className="text-[1.4rem] font-normal leading-[2.7rem]">
      <span className="mr-[1rem]">
        <Image
          src="/arrow-left.svg"
          alt="Left arrow"
          aria-hidden
          width={10}
          height={10}
        />
      </span>
      {children}
    </Link>
  );
};
