import { PersonItem } from '@quansight/shared/storyblok-sdk';
import { TBlok } from '@quansight/shared/types';
import { TeamVariant, TeamRole } from '@quansight/shared/ui-components';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItem[];
} & TBlok;
