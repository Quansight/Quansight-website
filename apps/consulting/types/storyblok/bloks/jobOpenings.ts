import { TLink, TBlok } from '@quansight/shared/ui-components';
import { ComponentType } from '../../../components/BlokProvider/types';

type TJobRawData = {
  _uid: string;
  jobTitle: string;
  linkUrl: TLink;
  location: string;
  isRemote: boolean;
};

export type TJobOpeningsRawData = {
  component: ComponentType.JobOpenings;
  title: string;
  jobs: TJobRawData[];
} & TBlok;
