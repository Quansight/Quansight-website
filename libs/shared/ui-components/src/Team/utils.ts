import { TTeamMember } from './TeamMember/types';

export const filterTeam = (
  team: TTeamMember[] = [],
  role: string,
): TTeamMember[] | null => {
  const isRoleMatching = (member: TTeamMember): boolean => {
    return member?.role === role;
  };

  return team.filter(isRoleMatching);
};

export const getRandomMembers = (
  team: TTeamMember[] | null,
  num: number,
): TTeamMember[] | undefined => {
  const randomlySortedTeam = team?.sort(() => 0.5 - Math.random());

  return randomlySortedTeam?.slice(0, num);
};
