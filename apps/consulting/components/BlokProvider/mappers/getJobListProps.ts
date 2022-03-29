import { TJobListProps } from '../../JobList/types';
import { TJobListRawData } from '../../../types/storyblok/bloks/jobList';
import { getUrl } from '@quansight/shared/ui-components';

export const getJobListProps = (blok: TJobListRawData): TJobListProps => ({
  title: blok.title,
  jobs: blok.jobs.map(({ _uid, jobTitle, linkUrl, location, isRemote }) => ({
    _uid,
    jobTitle,
    linkUrl: getUrl(linkUrl),
    location,
    isRemote,
  })),
});
