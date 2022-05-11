import { PersonItems } from '@quansight/shared/storyblok-sdk';

export enum TeamVariant {
  All = 'all',
  Spotlight = 'spotlight',
}

export enum TeamRole {
  Leadership = 'leadership',
  Team = 'team',
  Author = 'author',
}

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItems;
};
