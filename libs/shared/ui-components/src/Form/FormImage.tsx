import { FC } from 'react';

import { Picture } from '../Picture/Picture';
import { TFormImageProps } from './types';

export const FormImage: FC<TFormImageProps> = ({ imageSrc, imageAlt }) => (
  <div className="hidden md:block md:w-1/2 lg:pl-[11rem]">
    <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={644} height={620} />
  </div>
);
