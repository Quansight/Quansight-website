import { ImageProps } from 'next/image';

export enum HeroVariant {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  LargeOverlapping = 'large-overlapping',
}

export type THeroProps = {
  variant: HeroVariant;
  title?: string;
  subTitle?: string;
  imageSrc: string;
  imageAlt: string;
  backgroundColor?: string;
  objectFit?: ImageProps['objectFit'];
};

export default THeroProps;
