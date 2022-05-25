import { TPictureProps } from '../Picture/types';

export enum LogosColors {
  White = 'white',
  Black = 'black',
}

export type TLogosGridProps = {
  grid: TPictureProps[];
};

export type TLogosProps = {
  colorVariant: LogosColors;
  title: string;
  linkTitle: string;
  linkUrl: string;
} & TLogosGridProps;
