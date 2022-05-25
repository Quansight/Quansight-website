import { TImage, TRichText, TLink, TBlok } from '@quansight/shared/types';

export type TProjectItemProps = {
  title: string;
  image: TImage;
  shortDescription: TRichText;
  longDescription: TRichText;
  linkText: string;
  projectLink: TLink;
} & TBlok;

export type TProjectsProps = {
  projects: TProjectItemProps[];
};
