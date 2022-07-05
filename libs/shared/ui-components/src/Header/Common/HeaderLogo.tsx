import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { DomainVariant } from '@quansight/shared/types';

import { Picture } from '../../Picture/Picture';
import { THeaderLogoProps } from '../types';

export const HeaderLogo: FC<THeaderLogoProps> = ({ logo, domainVariant }) => (
  <Link href="/">
    <a
      aria-label="Go to home page"
      className={clsx(
        'relative shrink-0',
        domainVariant === DomainVariant.Quansight
          ? 'w-[20.7rem] h-[6.8rem] sm:w-[24.84rem] sm:h-[8.16rem] lg:w-[31.5rem] lg:h-[10.3rem]'
          : 'w-[27.3rem] h-[7.373rem] lg:w-[33.5rem] lg:h-[9.49rem]',
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
    </a>
  </Link>
);
