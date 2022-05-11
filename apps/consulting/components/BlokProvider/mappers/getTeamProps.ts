import { TTeamRawData } from '../../../types/storyblok/bloks/team';
import { TTeamProps } from '../../Team/types';

export const getTeamProps = (blok: TTeamRawData): TTeamProps => ({
  variant: blok.variant,
  header: blok.header,
  role: blok.role,
});
