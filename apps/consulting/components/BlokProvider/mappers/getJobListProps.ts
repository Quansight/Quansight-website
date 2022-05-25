import { TJobListRawData } from '../../../types/storyblok/bloks/jobList';
import { TJobListProps } from '../../JobList/types';

export const getJobListProps = (blok: TJobListRawData): TJobListProps => ({
  title: blok.title,
  errorMessage: blok.errorMessage,
  noOpeningsMessage: blok.noOpeningsMessage,
});
