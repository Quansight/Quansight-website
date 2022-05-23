import { FC } from 'react';

import { Picture } from '../../Picture/Picture';
import { THeaderLogoProps } from '../types';

export const HeaderLogo: FC<THeaderLogoProps> = ({ imageSrc, imageAlt }) => (
  <div aria-hidden="true" className="relative w-[20.7rem] h-[6.8rem]">
    <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
  </div>
);
