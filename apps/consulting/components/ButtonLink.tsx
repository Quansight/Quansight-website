import { FC } from 'react';
import clsx from 'clsx';

import { TButtonLinkProps } from '../types/components/ButtonLink';

export const ButtonLink: FC<TButtonLinkProps> = ({ isBordered, isTriangle, color, text, link }) => (
  <a 
    href={link.url} 
    className={clsx(
      `flex items-center justify-start w-fit px-9 py-3 font-bold text-base`,
      color === 'violet' ? 'text-violet' : 'text-white',
      isBordered && `border-2 border-solid border-${color}`
    )}
  >
    {text}
    { isTriangle && (
      <span className={clsx(
        'inline-block w-0 h-0 ml-2 border-y-solid border-y-8 border-y-transparent border-l-solid border-l-8',
        `border-l-${color}`
      )}/>
    )}
  </a>
);
