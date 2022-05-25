export type TRelatedItemProps = {
  _uid?: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  linkUrl: string;
};

export type TRelatedProps = {
  title?: string;
  items: TRelatedItemProps[];
};
