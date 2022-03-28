import { FC } from 'react';
import { TJobOpeningsProps } from './types';
import Link from 'next/link';

const JobOpenings: FC<TJobOpeningsProps> = ({ title, jobs }) => (
  <section className="flex flex-col justify-center items-center my-24 mx-auto xl:mt-52 xl:mb-24 max-w-layout">
    <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-32 sm:text-[4.8rem] text-violet font-heading">
      {title}
    </h2>
    {jobs.length > 0 ? (
      <ul className="flex flex-col gap-[4.3rem] text-center sm:w-full sm:max-w-[50rem] lg:max-w-[60rem] xl:max-w-[70rem]">
        {jobs.map(({ _uid, jobTitle, linkUrl, location, isRemote }) => (
          <li key={_uid} className="sm:flex sm:justify-between sm:items-center">
            <Link href={linkUrl}>
              <a className="text-[2rem] font-bold leading-[2.7rem] text-violet">
                {jobTitle}
              </a>
            </Link>
            <div className="mt-8 text-[1.6rem] font-normal leading-[3rem] sm:mt-0">
              <p>{location}</p>
              <p>Remote {isRemote ? 'OK' : 'NO'}</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-[2rem] font-normal leading-[3rem] text-black sm:text-[3rem]">
        No open positions
      </p>
    )}
  </section>
);

export default JobOpenings;
