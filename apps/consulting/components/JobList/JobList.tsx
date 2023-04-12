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
      className="max-w-layout my-24 mx-auto flex flex-col items-center justify-center xl:mt-52 xl:mb-24"
      aria-live="polite"
      aria-busy={!error && !data ? 'true' : 'false'}
    >
      <h2 className="text-violet font-heading mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem]">
        {title}
      </h2>
      {!error && !data && <Loading />}
      {error && <Message message={errorMessage} />}
      {!error && data?.jobs?.length === 0 && (
        <Message message={noOpeningsMessage} />
      )}
      <ul className="flex flex-col gap-[6rem] px-20 text-center sm:w-full sm:max-w-[60rem] sm:px-0 lg:max-w-[70rem] xl:max-w-[80rem]">
        {data?.jobs?.map((props) => (
          <JobListItem {...props} key={props.id} />
        ))}
      </ul>
    </section>
  );
};
