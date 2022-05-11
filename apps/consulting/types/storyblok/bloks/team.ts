import { TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';
import { TeamVariant, TeamRole } from '../../../components/Team/types';

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  role: TeamRole;
} & TBlok;
