import { TPictureProps } from '@quansight/shared/ui-components';

export type TLogosGridProps = {
  grid: TPictureProps[];
};

export type TLogosProps = {
  title: string;
  linkTitle: string;
  linkUrl: string;
} & TLogosGridProps;
