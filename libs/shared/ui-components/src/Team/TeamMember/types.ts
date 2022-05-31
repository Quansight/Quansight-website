import { TImage } from '@quansight/shared/types';

import { TeamShape } from '../types';

export type TTeamMemberName = {
  firstName: string;
  lastName: string;
  displayName: string;
};

export type TTeamMemberImage = {
  image: TImage;
  shape: TeamShape;
};

export type TTeamMemberGithubNick = {
  githubNick?: string;
};

export type TTeamMemberProject = {
  name: string;
};

export type TTeamMemberProjects = {
  projects?: TTeamMemberProject[];
};

export type TTeamMember = {
  image?: TImage;
  role: string;
} & TTeamMemberName &
  TTeamMemberGithubNick &
  TTeamMemberProjects;

export type TTeamMemberComponent = {
  shape: TeamShape;
} & TTeamMember;
