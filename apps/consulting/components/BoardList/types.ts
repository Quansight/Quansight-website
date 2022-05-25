export type TBoardListItemProps = {
  _uid?: string;
  title: string;
  text: string;
  linkTitle: string;
  linkUrl: string;
  imageSrc: string;
  imageAlt: string;
};

export type TBoardListProps = {
  grid: TBoardListItemProps[];
  linkTitle: string;
  linkUrl: string;
};
