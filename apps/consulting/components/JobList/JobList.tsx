import { FC } from 'react';

import { JobListItem } from './JobListItem';

import { TJobListProps } from './types';

import { useFetch } from './utils/useFetch';
import { url } from './utils/config';

import { Loading } from './StateIndicators/Loading';
import { Message } from './StateIndicators/Message';

export const JobList: FC<TJobListProps> = ({
  title,
  errorMessage,
  noOpeningsMessage,
}) => {
  const { data, error } = useFetch(url);

  return (
    <section className="flex flex-col justify-center items-center my-24 mx-auto xl:mt-52 xl:mb-24 max-w-layout">
      <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem] text-violet font-heading">
        {title}
      </h2>
      {!data && <Loading />}
      {!error && data?.jobs?.length === 0 && (
        <Message message={noOpeningsMessage} />
      )}
      {error && <Message message={errorMessage} />}
      <ul className="flex flex-col gap-[4.3rem] text-center sm:w-full sm:max-w-[50rem] lg:max-w-[60rem] xl:max-w-[70rem]">
        {data?.jobs?.map((props) => (
          <JobListItem {...props} key={props.id} />
        ))}
      </ul>
    </section>
  );
};
