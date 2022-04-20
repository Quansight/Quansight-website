import { TJobListProps } from '../../JobList/types';
import { TJobListRawData } from '../../../types/storyblok/bloks/jobList';

export const getJobListProps = (blok: TJobListRawData): TJobListProps => ({
  title: blok.title,
  errorMessage: blok.errorMessage,
  noOpeningsMessage: blok.noOpeningsMessage,
});
