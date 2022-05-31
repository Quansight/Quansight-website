import { TBlok } from '@quansight/shared/types';
import { TeamVariant, TeamShape } from '@quansight/shared/ui-components';

import { PersonItem } from '../../../api/types/basic';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  role: string;
  team: PersonItem[];
  imagesShape: TeamShape;
} & TBlok;
