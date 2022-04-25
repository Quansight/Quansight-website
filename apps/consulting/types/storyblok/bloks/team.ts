import { TImage, TBlok } from '@quansight/shared/types';
import { TeamVariant } from '../../../components/Team/types';
import { ComponentType } from '../../../components/BlokProvider/types';

type TTeamMember = {
  _uid: string;
  image: TImage;
  name: string;
};

export type TTeamRawData = {
  component: ComponentType.Team;
  variant: TeamVariant;
  header: string;
  people: TTeamMember[];
} & TBlok;
