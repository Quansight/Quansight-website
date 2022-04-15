export enum ColumnsVariant {
  Columns = 'columns',
  Tiles = 'tiles',
}

type TVariant = {
  variant: ColumnsVariant;
};

export type TLinkProps = {
  linkText?: string;
  linkUrl?: string;
};

export type TImageProps = {
  imageSrc: string;
  imageAlt: string;
};

export type TColumnProps = {
  _uid?: string;
  title: string;
  text: string;
} & TImageProps &
  TLinkProps;

export type TColumnsProps = {
  variant: ColumnsVariant;
  columns: TColumnProps[];
};

export type TImageComponentProps = TVariant & TImageProps;

export type TColumnComponentProps = TVariant & TColumnProps;
