import { FC } from 'react';

import { JobListItem } from './JobListItem';

import { TJobListProps } from './types';

import { useFetch } from './utils/useFetch';
import { url } from './utils/config';

export const JobList: FC<TJobListProps> = ({
  title,
  errorMessage,
  noOpeningsMessage,
}) => {
  const { data, error } = useFetch(url);

  if (!data) return <p>Loading...</p>;
  if (data?.jobs?.length === 0)
    return (
      <p className="text-[2rem] font-normal leading-[3rem] text-black sm:text-[3rem]">
        {noOpeningsMessage}
      </p>
    );
  if (error)
    return (
      <p className="text-[2rem] font-normal leading-[3rem] text-black sm:text-[3rem]">
        {errorMessage}
      </p>
    );
  return (
    <section className="flex flex-col justify-center items-center my-24 mx-auto xl:mt-52 xl:mb-24 max-w-layout">
      <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem] text-violet font-heading">
        {title}
      </h2>
      <ul className="flex flex-col gap-[4.3rem] text-center sm:w-full sm:max-w-[50rem] lg:max-w-[60rem] xl:max-w-[70rem]">
        {data?.jobs?.map((props) => (
          <JobListItem {...props} key={props.id} />
        ))}
      </ul>
    </section>
  );
};
