import { TTeamMember } from './TeamMember/types';
import { TTeamToDisplay, TeamDisplay } from './types';

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

export const checkNamesOverflow = (team: TTeamToDisplay): boolean | undefined =>
  team?.reduce((prevValue, { displayName, firstName, lastName }) => {
    const rawName =
      displayName === TeamDisplay.Full ? `${firstName} ${lastName}` : firstName;

    return rawName?.length <= 15 && prevValue === false ? false : true;
  }, false);
