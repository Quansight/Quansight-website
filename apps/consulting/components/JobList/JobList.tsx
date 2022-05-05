import { FC } from 'react';

import { JobListItem } from './JobListItem';
import { Loading } from './StateIndicators/Loading';
import { Message } from './StateIndicators/Message';
import { TJobListProps } from './types';
import { url } from './utils/config';
import { useJobList } from './utils/useJobList';

export const JobList: FC<TJobListProps> = ({
  title,
  errorMessage,
  noOpeningsMessage,
}) => {
  const { data, error } = useJobList(url);

  return (
    <section
      className="flex flex-col justify-center items-center my-24 mx-auto xl:mt-52 xl:mb-24 max-w-layout"
      aria-live="polite"
      aria-busy={!error && !data ? 'true' : 'false'}
    >
      <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem] text-violet font-heading">
        {title}
      </h2>
      {!error && !data && <Loading />}
      {error && <Message message={errorMessage} />}
      {!error && data?.jobs?.length === 0 && (
        <Message message={noOpeningsMessage} />
      )}
      <ul className="flex flex-col gap-[6rem] px-20 text-center sm:px-0 sm:w-full sm:max-w-[60rem] lg:max-w-[70rem] xl:max-w-[80rem]">
        {data?.jobs?.map((props) => (
          <JobListItem {...props} key={props.id} />
        ))}
      </ul>
    </section>
  );
};
