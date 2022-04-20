import { TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TJobListRawData = {
  component: ComponentType.JobList;
  title: string;
  errorMessage: string;
  noOpeningsMessage: string;
} & TBlok;
