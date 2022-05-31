import { TImage } from '@quansight/shared/types';

import { TeamShape } from '../types';

export type TTeamMemberName = {
  name: string;
};

export type TTeamMemberImage = {
  image: TImage;
  shape: TeamShape;
};

export type TTeamMemberGithubNick = {
  nick: string;
};

type TTeamMemberProject = {
  name: string;
};

export type TTeamMemberProjects = {
  projects: TTeamMemberProject[];
};

export type TTeamMember = {
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  image?: TImage;
  githubNick?: string;
  projects?: TTeamMemberProject[];
};

export type TTeamMemberComponent = {
  shape: TeamShape;
} & TTeamMember;
