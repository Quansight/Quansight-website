import { FC } from 'react';

import clsx from 'clsx';

import { TTeamMemberName } from './types';

export const TeamMemberName: FC<TTeamMemberName> = ({ name }) => (
  <h3 className="relative mb-[1rem] h-[5rem] md:h-[6rem]">
    <span
      className={clsx(
        'absolute bottom-0 left-0 w-full text-[1.8rem] font-extrabold leading-[2.6rem]',
        'md:text-[2.5rem] md:leading-[3rem]',
        'text-violet font-heading',
      )}
    >
      {name}
    </span>
  </h3>
);
