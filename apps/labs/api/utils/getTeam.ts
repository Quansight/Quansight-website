import { Api } from '@quansight/shared/storyblok-sdk';

import { TeamDocument } from '../types/hooks';
import { TeamQuery } from '../types/operations';

export const getTeam = async (): Promise<TeamQuery> => {
  const { data } = await Api.getTeamItem<TeamQuery>(TeamDocument);
  return data;
};
