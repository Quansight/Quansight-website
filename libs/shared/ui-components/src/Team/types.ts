import { TTeamMember } from './TeamMember/types';

export enum TeamVariant {
  All = 'all',
  Spotlight = 'spotlight',
}

export enum TeamDisplay {
  Full = 'full',
  FirstName = 'first name',
}

export enum TeamShape {
  Square = 'square',
  Rectangle = 'rectangle',
}

export type TTeamToDisplay = TTeamMember[] | null | undefined;

export type TTeamMembers = {
  teamToDisplay: TTeamToDisplay;
  shape: TeamShape;
};

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  role: string;
  team: TTeamMember[];
  imagesShape: TeamShape;
};
