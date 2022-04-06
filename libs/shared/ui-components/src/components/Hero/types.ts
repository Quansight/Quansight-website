export enum HeroVariant {
  Medium = 'medium',
  Large = 'large',
}

export type THeroProps = {
  variant: HeroVariant;
  title: string;
  subTitle?: string;
  imageSrc: string;
  imageAlt: string;
};

export default THeroProps;
