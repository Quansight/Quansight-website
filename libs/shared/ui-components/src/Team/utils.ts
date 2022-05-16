import { PersonItem, Maybe } from '@quansight/shared/storyblok-sdk';

import { TeamRole } from './types';

export const filterTeam = (
  team: PersonItem[] = [],
  role: TeamRole,
): Maybe<PersonItem[]> => {
  const isRoleMatching = (member: Maybe<PersonItem>): boolean => {
    return member?.content?.role === role;
  };

  return team.filter(isRoleMatching);
};

export const getRandomMembers = (
  team: Maybe<PersonItem[]>,
  num: number,
): PersonItem[] | undefined => {
  const randomlySortedTeam = team?.sort(() => 0.5 - Math.random());

  return randomlySortedTeam?.slice(0, num);
};
