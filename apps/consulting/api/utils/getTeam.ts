import { Api } from '@quansight/shared/storyblok-sdk';
import { ArrayElementType } from '@quansight/shared/types';

import { TeamDocument } from '../types/hooks';
import { TeamQuery } from '../types/operations';

export const getTeam = async (
  preview: boolean,
): Promise<Array<ArrayElementType<TeamQuery['PersonItems']['items']>>> => {
  const { data } = await Api.getTeamItem<TeamQuery>(TeamDocument, preview);
  return data.PersonItems.items;
};
