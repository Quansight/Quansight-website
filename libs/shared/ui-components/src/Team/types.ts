import { PersonItems, Maybe, Asset } from '@quansight/shared/storyblok-sdk';

export enum TeamVariant {
  All = 'all',
  Spotlight = 'spotlight',
}

export enum TeamRole {
  Leadership = 'leadership',
  Team = 'team',
  Author = 'author',
}

export type TTeamMemberProps = {
  image: Maybe<Asset>;
  name: string | null;
};

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItems;
};
