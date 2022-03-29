import { FC } from 'react';
import { TJobListItem } from './types';
import Link from 'next/link';

export const JobListItem: FC<TJobListItem> = ({
  jobTitle,
  linkUrl,
  location,
  isRemote,
}) => (
  <li className="sm:flex sm:justify-between sm:items-center">
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
);
