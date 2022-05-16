import { Maybe } from 'graphql/jsutils/Maybe';

import { PersonItem, PersonComponent } from '@quansight/shared/storyblok-sdk';

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

export type TTeamMemberProps = {
  person: Maybe<PersonComponent> | undefined;
};

export type TTeamProps = {
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItem[];
};
