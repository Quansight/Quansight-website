import type { FC } from 'react';

import clsx from 'clsx';

type ButtonColor = 'violet' | 'white' | 'pink';

type ButtonLinkProps = {
  url: string;
  text: string;
  color?: ButtonColor;
  isFull?: boolean;
  isBordered?: boolean;
  isTriangle?: boolean;
};

export const ButtonLink: FC<ButtonLinkProps> = ({
  url,
  text,
  color = 'violet',
  isFull,
  isBordered,
  isTriangle,
}) => (
  <a
    href={url}
    className={clsx(
      'flex justify-start items-center py-4 px-12 w-fit text-[1.6rem] font-bold leading-[3.7rem]',
      color === 'pink' && 'text-pink',
      color === 'violet' && 'text-violet',
      color === 'white' && 'text-white',
      isFull && 'bg-violet',
      isBordered &&
        `border-2 border-solid ${color === 'violet' ? 'border-violet' : 'border-white'}`,
    )}
  >
    {text}
    {isTriangle && (
      <span
        className={clsx(
          'inline-block ml-4 w-0 h-0 border-y-8 border-l-8 border-y-transparent border-y-solid border-l-solid',
          color === 'pink' && 'border-l-pink',
          color === 'violet' && 'border-l-violet',
          color === 'white' && 'border-l-white',
        )}
      />
    )}
  </a>
);
