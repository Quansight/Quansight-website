import { TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';
import { TeamVariant, TeamRole } from '@quansight/shared/ui-components';

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  role: TeamRole;
} & TBlok;
