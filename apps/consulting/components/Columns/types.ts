import { TColumnProps } from './Column/types';

export enum ColumnsVariant {
  Columns = 'columns',
  Tiles = 'tiles',
}

export type TColumnsProps = {
  variant: ColumnsVariant;
  columns: TColumnProps[];
};
