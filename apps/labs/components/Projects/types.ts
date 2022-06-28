import { Dispatch, SetStateAction } from 'react';

import { TRichText } from '@quansight/shared/types';

type TIsDropdownExpanded = {
  isDroprownExpanded: boolean;
};

type TSetIsDropdownExpanded = {
  setIsDropdownExpanded: Dispatch<SetStateAction<boolean>>;
};

type TProjectHeadline = {
  title: string;
};

type TProjectLogo = {
  imageSrc: string;
  imageAlt: string;
};

type TProjectSummary = {
  shortDescription: TRichText;
};

type TProjectDescription = {
  longDescription: TRichText;
  title: string;
  linkText: string;
  linkUrl: string;
};

export type TProjectItemProps = {
  _uid: string;
} & TProjectHeadline &
  TProjectLogo &
  TProjectSummary &
  TProjectDescription;

export type TProjectsProps = {
  projects: TProjectItemProps[];
};

export type TProjectHeadlineProps = {
  title: string;
} & TIsDropdownExpanded &
  TSetIsDropdownExpanded;

export type TProjectLogoProps = TProjectLogo & TIsDropdownExpanded;

export type TProjectDescriptionProps = TProjectDescription &
  TIsDropdownExpanded;

export type TProjectSummaryProps = TProjectSummary;
