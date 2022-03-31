export type TFeatureProps = {
  _uid?: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
};

export type TFeaturesProps = {
  title?: string;
  columns: TFeatureProps[];
};
