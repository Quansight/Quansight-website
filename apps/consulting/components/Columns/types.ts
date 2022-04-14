export type TColumnProps = {
  _uid?: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
};

export type TColumnsProps = {
  columns: TColumnProps[];
};
