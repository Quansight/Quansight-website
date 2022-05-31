import { FC } from 'react';

import { TeamDisplay } from '../types';
import { TeamMemberGithub } from './TeamMemberGithub';
import { TeamMemberImage } from './TeamMemberImage';
import { TeamMemberName } from './TeamMemberName';
import { TeamMemberProjects } from './TeamMemberProjects';
import { TTeamMemberComponent } from './types';

export const TeamMember: FC<TTeamMemberComponent> = (teamMember) => {
  const {
    firstName,
    lastName,
    displayName,
    image,
    githubNick,
    projects,
    shape,
  } = teamMember;

  const teamMemberName = `
    ${firstName}
    ${displayName === TeamDisplay.Full ? ` ${lastName}` : ''}
  `;

  return (
    <li className="box-border px-[1.25rem] w-1/2 md:mb-[3rem] md:w-1/5">
      <TeamMemberName name={teamMemberName} />
      {image && <TeamMemberImage image={image} shape={shape} />}
      {githubNick && <TeamMemberGithub nick={githubNick} />}
      {projects && <TeamMemberProjects projects={projects} />}
    </li>
  );
};
