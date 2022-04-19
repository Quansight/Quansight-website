import { FC } from 'react';

import { JobListItem } from './JobListItem';

import { TJobListProps } from './types';

import { useJobList } from './utils/useJobList';
import { url } from './utils/config';

import { Loading } from './StateIndicators/Loading';
import { Message } from './StateIndicators/Message';

export const JobList: FC<TJobListProps> = ({
  title,
  errorMessage,
  noOpeningsMessage,
}) => {
  const { data, error } = useJobList(url);

  return (
    <section className="flex flex-col justify-center items-center my-24 mx-auto xl:mt-52 xl:mb-24 max-w-layout">
      <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem] text-violet font-heading">
        {title}
      </h2>
      {!error && !data && <Loading />}
      {error && !data && <Message message={errorMessage} />}
      {!error && data?.jobs?.length === 0 && (
        <Message message={noOpeningsMessage} />
      )}
      <ul className="flex flex-col gap-[4.3rem] text-center sm:w-full sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem]">
        {data?.jobs?.map((props) => (
          <JobListItem {...props} key={props.id} />
        ))}
      </ul>
    </section>
  );
};
