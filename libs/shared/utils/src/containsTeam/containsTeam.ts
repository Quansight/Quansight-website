import { teamComponents } from './teamComponents';
import { teamPages } from './teamPages';

export const containsTeam = (slug: string): boolean => {
  return teamPages.some((teamPage) => slug.includes(teamPage));
};

export const isTeamComponent = (name: string): boolean => {
  return teamComponents.some((teamComponent) => name.includes(teamComponent));
};
