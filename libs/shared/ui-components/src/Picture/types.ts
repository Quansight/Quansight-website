export type TObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

export type TPictureLayout = 'fill' | 'responsive' | 'intrinsic' | 'fixed';

export type TPictureProps = {
  imageSrc: string;
  imageAlt: string;
  width?: number | string;
  height?: number | string;
  layout?: TPictureLayout;
  objectFit?: TObjectFit;
  objectPosition?: string;
  priority?: boolean;
  onLoadingComplete?: (img: HTMLImageElement) => void;
  className?: string;
};
