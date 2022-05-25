import { TImage, TRichText, TLink, TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

type TProjectItem = {
  _uid: string;
  title: string;
  image: TImage;
  shortDescription: TRichText;
  longDescription: TRichText;
  linkText: string;
  projectLink: TLink;
};

export type TProjectsRawData = {
  component: ComponentType.Projects;
  projects: TProjectItem[];
} & TBlok;
