import { FC } from 'react';
import clsx from 'clsx';

import { TeamMember } from './TeamMember';

import { TeamVariant, TTeamProps } from './types';

export const Team: FC<TTeamProps> = ({ variant, header, people }) => (
  <section>
    <h2>{header}</h2>
    <ul className="flex">
      {people.map((props) => (
        <TeamMember {...props} key={props._uid} />
      ))}
    </ul>
  </section>
);
