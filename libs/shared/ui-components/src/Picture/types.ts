import { ImageProps } from 'next/image';

export type TPictureProps = {
  imageSrc: string;
  imageAlt: string;
  width?: ImageProps['width'];
  height?: ImageProps['height'];
  layout?: ImageProps['layout'];
  objectFit?: ImageProps['objectFit'];
  priority?: ImageProps['priority'];
  onLoadingComplete?: ImageProps['onLoadingComplete'];
};
