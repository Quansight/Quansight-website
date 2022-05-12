import { teamPages } from './teamPages';

export const containsTeam = (slug: string): boolean => {
  return teamPages.some((teamPage) => slug.includes(teamPage));
};
