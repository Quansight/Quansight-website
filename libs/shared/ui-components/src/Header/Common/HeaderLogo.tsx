import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { DomainVariant } from '@quansight/shared/types';

import { Picture } from '../../Picture/Picture';
import { THeaderLogoProps } from '../types';

export const HeaderLogo: FC<THeaderLogoProps> = ({ logo, domainVariant }) => (
  <Link
    href="/"
    aria-label="Go to home page"
    className={clsx(
      'relative shrink-0',
      domainVariant === DomainVariant.Quansight
        ? 'h-[6.8rem] w-[20.7rem] sm:h-[8.16rem] sm:w-[24.84rem] lg:h-[10.3rem] lg:w-[31.5rem]'
        : 'h-[7.373rem] w-[27.3rem] lg:h-[9.49rem] lg:w-[33.5rem]',
    )}
  >
    <Picture
      aria-hidden="true"
      imageSrc={logo.filename}
      imageAlt={logo.alt}
      layout="fill"
      objectFit="contain"
      priority
    />
  </Link>
);
