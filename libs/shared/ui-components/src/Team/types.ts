// import { PersonItem } from '@quansight/shared/storyblok-sdk';

export enum TeamVariant {
  All = 'all',
  Spotlight = 'spotlight',
}

export enum TeamDisplay {
  Full = 'full',
  FirstName = 'first name',
}

export enum TeamRole {
  Leadership = 'leadership',
  Team = 'team',
  Author = 'author',
}

export type TTeamMemberProjectProps = {
  name: string;
};

export type TPersonItem = {
  firstName: string;
  lastName: string;
  displayName: TeamDisplay;
  image: {
    filename: string;
    alt?: string;
  };
};

export type TTeamMember = {
  firstName: string;
  lastName: string;
  displayName: string;
  image?: {
    filename: string;
    alt?: string;
  };
  role: string;
};

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: TTeamMember[];
};
