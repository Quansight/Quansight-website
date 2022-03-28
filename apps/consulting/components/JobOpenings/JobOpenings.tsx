import { FC } from 'react';
import { TJobOpeningsProps } from './types';
import Link from 'next/link';

const JobOpenings: FC<TJobOpeningsProps> = ({ title, jobs }) => {
  return (
    <section className="flex flex-col justify-center items-center my-24">
      <h2 className="mb-[4.3rem] text-[4rem] font-extrabold leading-[4.9rem] text-violet font-heading">
        {title}
      </h2>
      {jobs.length > 0 ? (
        <ul className="flex flex-col text-center">
          {jobs.map(({ _uid, jobTitle, linkUrl, location, isRemote }) => (
            <li key={_uid}>
              <Link href={linkUrl}>
                <a>{jobTitle}</a>
              </Link>
              <div>
                <p>{location}</p>
                <p>Remote {isRemote ? 'OK' : 'NO'}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No open positions</p>
      )}
    </section>
  );
};

export default JobOpenings;
