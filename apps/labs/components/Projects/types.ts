import { TRichText } from '@quansight/shared/types';

export type TProjectItemProps = {
  _uid: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  shortDescription: TRichText;
  longDescription: TRichText;
  linkText: string;
  linkUrl: string;
};

export type TProjectsProps = {
  projects: TProjectItemProps[];
};
