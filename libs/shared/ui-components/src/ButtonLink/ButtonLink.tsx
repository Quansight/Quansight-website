import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

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
        'flex justify-start items-center py-4 px-12 w-fit text-[1.6rem] font-bold leading-[3.7rem]',
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
            'inline-block ml-4 w-0 h-0 border-y-8 border-l-8 border-y-transparent border-y-solid border-l-solid',
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
