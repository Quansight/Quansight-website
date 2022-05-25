export enum HeroVariant {
  Medium = 'medium',
  Large = 'large',
  LargeOverlapping = 'large-overlapping',
}

export type THeroProps = {
  variant: HeroVariant;
  title: string;
  subTitle?: string;
  imageSrc: string;
  imageAlt: string;
};

export default THeroProps;
