import { FC } from 'react';
import { TJobOpeningsProps } from './types';
import Link from 'next/link';

const JobOpenings: FC<TJobOpeningsProps> = ({ title, jobs }) => {
  return (
    <section>
      <h2>{title}</h2>
      {jobs.length > 0 ? (
        <ul>
          {jobs.map(({ jobTitle, linkUrl, location, workType }, index) => (
            <li key={index}>
              <Link href={linkUrl}>
                <a>{jobTitle}</a>
              </Link>
              <div>
                <p>{location}</p>
                <p>{workType}</p>
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
