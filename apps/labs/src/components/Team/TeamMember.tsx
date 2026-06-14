import type { FC } from 'react';

import { TeamMemberGithub } from './TeamMemberGithub';
import { TeamMemberImage } from './TeamMemberImage';
import { TeamMemberName } from './TeamMemberName';
import { TeamMemberProjects } from './TeamMemberProjects';

type TeamShape = 'square' | 'rectangle';

export type TeamPerson = {
  firstName: string;
  lastName: string;
  displayName: 'full' | 'firstName';
  role: string;
  image: string;
  imageAlt: string;
  githubNick?: string;
  projects?: string[];
};

type TeamMemberProps = TeamPerson & { shape: TeamShape };

export const TeamMember: FC<TeamMemberProps> = ({
  firstName,
  lastName,
  displayName,
  image,
  imageAlt,
  githubNick,
  projects,
  shape,
}) => {
  const name = displayName === 'full' ? `${firstName} ${lastName}` : firstName;

  return (
    <li className="box-border px-[1.25rem] w-1/2 md:mb-[3rem] md:w-1/5">
      <TeamMemberName name={name} />
      {image && (
        <TeamMemberImage image={image} imageAlt={imageAlt} shape={shape} />
      )}
      {githubNick && <TeamMemberGithub nick={githubNick} />}
      {projects && projects.length > 0 && (
        <TeamMemberProjects projects={projects} />
      )}
    </li>
  );
};
