import { PersonItems } from '@quansight/shared/storyblok-sdk';
import { TImage } from '@quansight/shared/types';

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
  image: TImage;
  name: string;
};

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItems;
};
