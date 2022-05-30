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
        ? 'w-[20.7rem] h-[6.8rem]'
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
