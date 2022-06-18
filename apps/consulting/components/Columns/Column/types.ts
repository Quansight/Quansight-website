import { ColumnsVariant } from '../types';

type TVariant = {
  variant: ColumnsVariant;
};

export type TColumnLinkProps = {
  linkText?: string;
  linkUrl?: string;
};

export type TColumnImageProps = {
  imageSrc: string;
  imageAlt: string;
};

export type TColumnProps = {
  _uid?: string;
  title: string;
  text?: string;
} & TColumnImageProps &
  TColumnLinkProps;

export type TColumnImageComponentProps = TVariant & TColumnImageProps;

export type TColumnComponentProps = TVariant & TColumnProps;
