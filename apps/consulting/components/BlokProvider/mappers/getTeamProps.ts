import { TTeamRawData } from '../../../types/storyblok/bloks/team';
import { TTeamProps } from '@quansight/shared/ui-components';

export const getTeamProps = (blok: TTeamRawData): TTeamProps => ({
  variant: blok.variant,
  header: blok.header,
  role: blok.role,
  team: blok.team,
});
