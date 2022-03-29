import { TRichText } from '@quansight/shared/ui-components';

export type TBoardItemProps = {
  _uid?: string;
  title: string;
  linkTitle: string;
  linkUrl: string;
  imageSrc: string;
  imageAlt: string;
};

export type TBoardButtonProps = {
  buttonTitle: string;
  buttonUrl: string;
};

export type TBoardProps = {
  title: string;
  description: TRichText;
  grid: TBoardItemProps[];
  button: TBoardButtonProps;
};
