import { ImageProps } from 'next/image';

export type TOnLoadingComplete = {
  naturalWidth: number;
  naturalHeight: number;
};

export type TPictureProps = {
  imageSrc: string;
  imageAlt: string;
  naturalDimensions?: boolean;
} & Omit<ImageProps, 'src'>;
