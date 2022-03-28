import { TLink, TBlok } from '@quansight/shared/ui-components';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TJobOpeningsRawData = {
  component: ComponentType.JobOpenings;
  title: string;
  jobs: {
    _uid: string;
    jobTitle: string;
    linkUrl: TLink;
    location: string;
    isRemote: boolean;
  }[];
} & TBlok;
