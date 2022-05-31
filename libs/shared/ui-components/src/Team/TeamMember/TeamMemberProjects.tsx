import { FC } from 'react';

import { TTeamMemberProjects } from './types';

export const TeamMemberProjects: FC<TTeamMemberProjects> = ({ projects }) => (
  <ul className="mt-[1rem]">
    {projects?.map((project) => (
      <li className="text-[1.4rem] leading-[2.5rem] text-black md:text-[1.6rem]">
        {project.name}
      </li>
    ))}
  </ul>
);
