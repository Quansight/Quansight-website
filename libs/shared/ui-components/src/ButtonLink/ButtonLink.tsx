import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { TButtonLinkProps, ButtonColor } from './types';

export const ButtonLink: FC<TButtonLinkProps> = ({
  isFull,
  isBordered,
  isTriangle,
  color = ButtonColor.Violet,
  text,
  url,
}) => (
  <Link href={url}>
    <a
      className={clsx(
        'flex w-fit items-center justify-start px-12 py-4 text-[1.6rem] font-bold leading-[3.7rem]',
        color === ButtonColor.Pink && 'text-pink',
        color === ButtonColor.Violet && 'text-violet',
        color === ButtonColor.White && 'text-white',
        isFull && `bg-violet`,
        isBordered &&
          `border-2 border-solid ${
            color === ButtonColor.Violet ? 'border-violet' : 'border-white'
          }`,
      )}
    >
      {text}
      {isTriangle && (
        <span
          className={clsx(
            'border-y-solid border-l-solid ml-4 inline-block h-0 w-0 border-y-8 border-l-8 border-y-transparent',
            color === ButtonColor.Pink && 'border-l-pink',
            color === ButtonColor.Violet && 'border-l-violet',
            color === ButtonColor.White && 'bordel-l-white',
          )}
        />
      )}
    </a>
  </Link>
);

export default ButtonLink;
