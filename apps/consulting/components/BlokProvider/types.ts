import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';
import { TFeatureProps } from '../Feature/Feature';
import { TTeaserProps } from '../Teaser/Teaser';
import { TBoardProps } from '../Board/Board';

export enum ComponentType {
  Teaser = 'teaser',
  Feature = 'feature',
  Grid = 'grid',
  Board = 'board',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Feature]: TFeatureProps;
  [ComponentType.Board]: TBoardProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TConsultingBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
