import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '../../Picture/Picture';
import { THeaderLogoProps } from './types';

export const HeaderLogo: FC<THeaderLogoProps> = ({
  imageSrc,
  imageAlt,
  variant,
}) => (
  <div
    aria-hidden="true"
    className={clsx(
      'relative',
      variant === 'Quansight'
        ? 'w-[20.7rem] h-[6.8rem]'
        : 'w-[27.3rem] h-[7.373rem]',
    )}
  >
    <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" priority />
  </div>
);
