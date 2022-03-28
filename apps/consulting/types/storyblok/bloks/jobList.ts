import { TLink, TBlok } from '@quansight/shared/ui-components';
import { ComponentType } from '../../../components/BlokProvider/types';

type TJobListItemRawData = {
  _uid: string;
  jobTitle: string;
  linkUrl: TLink;
  location: string;
  isRemote: boolean;
};

export type TJobListRawData = {
  component: ComponentType.JobList;
  title: string;
  jobs: TJobListItemRawData[];
} & TBlok;
