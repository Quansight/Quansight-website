import { PersonItems } from '@quansight/shared/storyblok-sdk';

import { TTeamRawData } from '../../../types/storyblok/bloks/team';
import { TTeamProps } from '../../Team/types';

export const getTeamProps = (
  blok: TTeamRawData,
  team: PersonItems,
): TTeamProps => ({
  variant: blok.variant,
  header: blok.header,
  role: blok.role,
  team: team,
});
