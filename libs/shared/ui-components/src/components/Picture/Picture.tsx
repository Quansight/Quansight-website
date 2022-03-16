import { FC } from 'react';
import Image from 'next/image';

import { TPictureProps } from './types';

export const Picture: FC<TPictureProps> = ({
  imageSrc,
  imageAlt,
  ...props
}) => <Image src={imageSrc} alt={imageAlt} {...props} />;

export default Picture;
