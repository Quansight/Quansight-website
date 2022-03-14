import { FC } from 'react';
import Image from 'next/image';

import { TPictureProps } from '../types/components/Picture';

export const Picture: FC<TPictureProps> = ({ image, ...props }) => (
  <Image src={image.filename} alt={image.alt} {...props} />
);
