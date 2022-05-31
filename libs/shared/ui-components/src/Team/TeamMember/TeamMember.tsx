import { FC } from 'react';

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

  return (
    <li className="box-border px-[1.25rem] w-1/2 md:mb-[3rem] md:w-1/5">
      <TeamMemberName
        firstName={firstName}
        lastName={lastName}
        displayName={displayName}
      />
      {image && <TeamMemberImage image={image} shape={shape} />}
      {githubNick && <TeamMemberGithub githubNick={githubNick} />}
      {projects && <TeamMemberProjects projects={projects} />}
    </li>
  );
};
