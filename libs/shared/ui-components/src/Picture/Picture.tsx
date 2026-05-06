import { CSSProperties, FC } from 'react';

import Image from 'next/image';

import { TPictureProps } from './types';

export const Picture: FC<TPictureProps> = ({
  imageSrc,
  imageAlt,
  width,
  height,
  layout,
  objectFit,
  objectPosition,
  priority,
  onLoadingComplete,
  className,
}) => {
  const objectStyle: CSSProperties = {};
  if (objectFit) objectStyle.objectFit = objectFit;
  if (objectPosition) objectStyle.objectPosition = objectPosition;

  if (layout === 'fill') {
    return (
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={priority}
        onLoadingComplete={onLoadingComplete}
        className={className}
        style={objectStyle}
      />
    );
  }

  const numericWidth = typeof width === 'string' ? parseInt(width, 10) : width;
  const numericHeight =
    typeof height === 'string' ? parseInt(height, 10) : height;

  let style: CSSProperties = objectStyle;
  if (layout === 'responsive') {
    style = { ...objectStyle, width: '100%', height: 'auto' };
  } else if (layout === 'fixed' && numericWidth && numericHeight) {
    style = {
      ...objectStyle,
      width: `${numericWidth}px`,
      height: `${numericHeight}px`,
    };
  } else if (numericWidth && numericHeight) {
    style = {
      ...objectStyle,
      aspectRatio: `${numericWidth} / ${numericHeight}`,
    };
  }

  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={numericWidth}
      height={numericHeight}
      priority={priority}
      onLoadingComplete={onLoadingComplete}
      className={className}
      style={Object.keys(style).length ? style : undefined}
    />
  );
};

export default Picture;
