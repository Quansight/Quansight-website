import {
  PersonItems,
  PersonItem,
  Maybe,
} from '@quansight/shared/storyblok-sdk';

import { TeamRole } from './types';

export const filterTeam = (
  team: PersonItems,
  role: TeamRole,
): Maybe<PersonItem>[] => {
  const isRoleMatching = (member: Maybe<PersonItem>): boolean => {
    return member && member.content ? member.content.role === role : false;
  };

  return team.items ? team.items.filter(isRoleMatching) : [];
};

export const getRandomMembers = (
  team: Maybe<PersonItem>[],
  num: number,
): Maybe<PersonItem>[] => {
  const randomlySortedTeam = team
    ? [...team].sort(() => 0.5 - Math.random())
    : [];

  return randomlySortedTeam.slice(0, num);
};
