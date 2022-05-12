import { PersonItems, PersonItem } from '@quansight/shared/storyblok-sdk';

import { TeamRole } from './types';

export const filterTeam = (team: PersonItems, role: TeamRole): PersonItem[] => {
  const isRoleMatching = (member: PersonItem): boolean => {
    return member.content.role === role;
  };

  return team.items.filter(isRoleMatching);
};

export const getRandomMembers = (
  team: PersonItem[],
  num: number,
): PersonItem[] => {
  const randomlySortedTeam = [...team].sort(() => 0.5 - Math.random());

  return randomlySortedTeam.slice(0, num);
};
