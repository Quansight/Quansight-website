import { ImageProps } from 'next/image';
import { TImageProps } from '../../types/storyblok/imageProps';

export type TPictureProps = {
  image: TImageProps;
  width?: ImageProps['width'];
  height?: ImageProps['height'];
  layout?: ImageProps['layout'];
};
