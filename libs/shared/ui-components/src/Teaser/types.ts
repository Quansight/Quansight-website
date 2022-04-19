export enum TeaserColor {
  Green = 'green',
  Violet = 'violet',
  Pink = 'pink',
}

export type TTeaserProps = {
  color: TeaserColor;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  buttonText?: string;
  buttonLink?: string;
};

export default TTeaserProps;
