import { TTeamProps } from '@quansight/shared/ui-components';

import { TTeamRawData } from '../../../types/storyblok/bloks/team';

export const getTeamProps = (blok: TTeamRawData): TTeamProps => ({
  variant: blok.variant,
  header: blok.header,
  role: blok.role,
  team: blok.team,
});
