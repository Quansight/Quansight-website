import { FC } from 'react';

import clsx from 'clsx';

import { DomainVariant } from '@quansight/shared/types';

import { Picture } from '../../Picture/Picture';
import { THeaderLogoProps } from '../types';

export const HeaderLogo: FC<THeaderLogoProps> = ({ logo, domainVariant }) => (
  <div
    aria-hidden="true"
    className={clsx(
      'relative',
      domainVariant === DomainVariant.Quansight
        ? 'shrink-0 w-[20.7rem] h-[6.8rem] sm:w-[24.84rem] sm:h-[8.16rem] lg:w-[31.5rem] lg:h-[10.3rem]'
        : 'w-[27.3rem] h-[7.373rem]',
    )}
  >
    <Picture
      imageSrc={logo.filename}
      imageAlt={logo.alt}
      layout="fill"
      priority
    />
  </div>
);
