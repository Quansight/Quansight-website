import { Theme } from '@quansight/shared/types';
import { TPictureProps } from '../Picture/types';

export type TLogosProps = {
  title: string;
  grid: TPictureProps[];
  linkTitle: string;
  linkUrl: string;
  theme: Theme;
};
