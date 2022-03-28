import { TJobOpeningsProps } from '../../JobOpenings/types';
import { TJobOpeningsRawData } from '../../../types/storyblok/bloks/jobOpenings';
import { getUrl } from '@quansight/shared/ui-components';

export const getJobOpeningsProps = (
  blok: TJobOpeningsRawData,
): TJobOpeningsProps => ({
  title: blok.title,
  jobs: blok.jobs.map(({ _uid, jobTitle, linkUrl, location, isRemote }) => ({
    _uid,
    jobTitle,
    linkUrl: getUrl(linkUrl),
    location,
    isRemote,
  })),
});
