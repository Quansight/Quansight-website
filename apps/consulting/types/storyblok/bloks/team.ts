import { TBlok } from '@quansight/shared/types';
import { PersonItem } from '@quansight/shared/storyblok-sdk';

import { ComponentType } from '../../../components/BlokProvider/types';
import { TeamVariant, TeamRole } from '@quansight/shared/ui-components';

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItem[];
} & TBlok;
