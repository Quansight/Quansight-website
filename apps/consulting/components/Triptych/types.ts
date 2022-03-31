export type TTriptychColumnProps = {
  _uid?: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
};

export type TTriptychProps = {
  title: string;
  columns: TTriptychColumnProps[];
};
