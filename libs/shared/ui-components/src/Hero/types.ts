import { ImageProps } from 'next/image';

export enum HeroVariant {
  Small = 'small',
  Medium = 'medium',
  MediumOverlapping = 'medium-overlapping',
  Large = 'large',
  LargeOverlapping = 'large-overlapping',
}

export enum HeroBackgroundVariant {
  Black = 'black',
  White = 'white',
}

export type TCustomImage = {
  imageSrc: string;
  imageAlt: string;
  objectFit: ImageProps['objectFit'];
};

export type TResponsiveImages = {
  imageMobile: TCustomImage;
  imageTablet: TCustomImage;
  imageDesktop: TCustomImage;
};

export type THeroProps = {
  variant: HeroVariant;
  title?: string;
  subTitle?: string;
  imageSrc: string;
  imageAlt: string;
  backgroundColor?: string;
  objectFit?: ImageProps['objectFit'];
  imageMobile?: TCustomImage;
  imageTablet?: TCustomImage;
  imageDesktop?: TCustomImage;
};

export default THeroProps;
