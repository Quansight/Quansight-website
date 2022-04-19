import { FC } from 'react';

import { JobListItem } from './JobListItem';

import { TJobListProps } from './types';

const url = 'https://boards-api.greenhouse.io/v1/boards/quansight/jobs';

export const JobList: FC<TJobListProps> = ({
  title,
  errorMessage,
  noOpeningsMessage,
}) => {
  return (
    <section className="flex flex-col justify-center items-center my-24 mx-auto xl:mt-52 xl:mb-24 max-w-layout">
      <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem] text-violet font-heading">
        {title}
      </h2>
      {/* {jobs.length > 0 ? (
      <ul className="flex flex-col gap-[4.3rem] text-center sm:w-full sm:max-w-[50rem] lg:max-w-[60rem] xl:max-w-[70rem]">
        {jobs.map((props) => (
          <JobListItem {...props} key={props.id} />
        ))}
      </ul>
    ) : (
      <p className="text-[2rem] font-normal leading-[3rem] text-black sm:text-[3rem]">
        No open positions
      </p>
    )} */}
    </section>
  );
};
