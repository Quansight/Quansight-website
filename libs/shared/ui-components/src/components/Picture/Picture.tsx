import { FC, useState } from 'react';
import Image from 'next/image';

import { TOnLoadingComplete, TPictureProps } from './types';

export const Picture: FC<TPictureProps> = ({
  imageSrc,
  imageAlt,
  naturalDimensions = false,
  onLoadingComplete,
  ...props
}) => {
  const [imageSizes, setImageSizes] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
  });

  const handleOnLoadingComplete = (params: TOnLoadingComplete): void => {
    if (onLoadingComplete) {
      onLoadingComplete(params);
    }

    if (naturalDimensions) {
      setImageSizes(params);
      console.log(params);
    }
  };

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={imageAlt}
      {...(naturalDimensions
        ? { width: imageSizes.naturalWidth, height: imageSizes.naturalHeight }
        : {})}
      onLoadingComplete={handleOnLoadingComplete}
    />
  );
};

export default Picture;
