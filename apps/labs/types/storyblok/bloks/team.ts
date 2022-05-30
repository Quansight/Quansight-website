import { TBlok } from '@quansight/shared/types';
import { TeamVariant, TeamRole } from '@quansight/shared/ui-components';

import { PersonItem } from '../../../api/types/basic';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  role: TeamRole;
  team: PersonItem[];
} & TBlok;
