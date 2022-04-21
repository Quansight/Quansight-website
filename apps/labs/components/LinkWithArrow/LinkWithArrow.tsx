import React, { FC } from 'react';
import Link, { LinkProps } from 'next/link';
import Image from 'next/image';

export type LinkWithArrowProps = LinkProps;

export const LinkWithArrow: FC<LinkWithArrowProps> = ({
  children,
  ...restProps
}) => {
  return (
    <Link {...restProps}>
      <a className="text-[1.4rem] font-normal leading-[2.7rem]">
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
      </a>
    </Link>
  );
};
