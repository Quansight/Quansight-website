import { FC } from 'react';

import { TJobListItem } from './types';

export const JobListItem: FC<TJobListItem> = ({
  absolute_url,
  location,
  title,
}) => (
  <li className="sm:flex sm:justify-between sm:items-center">
    <a
      target="_blank"
      href={absolute_url}
      rel="noreferrer"
      className="text-[2rem] font-bold leading-[2.7rem] sm:text-left text-violet"
    >
      {title}
    </a>
    <p className="mt-8 text-[1.6rem] font-normal leading-[3rem] sm:mt-0 sm:text-left">
      {location.name}
    </p>
  </li>
);
