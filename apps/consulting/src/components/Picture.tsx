import type { CSSProperties, FC } from 'react';

type PictureProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: 'fill' | 'responsive' | 'fixed' | 'intrinsic';
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
  className?: string;
};

export const Picture: FC<PictureProps> = ({
  src,
  alt,
  width,
  height,
  layout,
  objectFit,
  objectPosition,
  className,
}) => {
  if (layout === 'fill') {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: objectFit ?? 'cover',
          objectPosition: objectPosition ?? 'center',
        }}
      />
    );
  }

  const style: CSSProperties = {};
  if (objectFit) style.objectFit = objectFit;
  if (objectPosition) style.objectPosition = objectPosition;
  if (layout === 'responsive') {
    style.width = '100%';
    style.height = 'auto';
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={Object.keys(style).length ? style : undefined}
    />
  );
};
