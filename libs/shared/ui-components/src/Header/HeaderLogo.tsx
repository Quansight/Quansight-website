import { FC } from 'react';

import { Picture } from '../Picture/Picture';
import { THeaderLogoProps } from './types';

export const HeaderLogo: FC<THeaderLogoProps> = ({ imageSrc, imageAlt }) => (
  <div className="relative w-20 h-10 bg-black">
    <Picture imageSrc={imageSrc} imageAlt={imageAlt} layout="fill" />
  </div>
);
