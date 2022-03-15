import { FC } from 'react';
import clsx from 'clsx';

import { TButtonLinkProps } from './types';

export const ButtonLink: FC<TButtonLinkProps> = ({ isBordered, isTriangle, color, text, url }) => (
  <a 
    href={url} 
    className={clsx(
      'flex justify-start items-center py-3 px-9 w-fit text-base font-bold',
      color === 'violet' ? 'text-violet' : 'text-white',
      isBordered && `border-2 border-solid ${color === 'violet' ? 'border-violet' : 'border-white'}`
    )}
  >
    {text}
    { isTriangle && (
      <span className={clsx(
        'inline-block ml-2 w-0 h-0 border-y-8 border-l-8 border-y-transparent border-y-solid border-l-solid',
        color === 'violet' ? 'border-l-violet' : 'bordel-l-white'
      )}/>
    )}
  </a>
);
