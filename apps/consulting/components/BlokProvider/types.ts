import {
  TypeValuesUnion,
  TBlok,
  THeroProps,
} from '@quansight/shared/ui-components';
import { TFeatureProps } from '../Feature/Feature';
import { TTeaserProps } from '../Teaser/Teaser';
import { TBoardRawData } from '../../types/storyblok/bloks/board';

export enum ComponentType {
  Teaser = 'teaser',
  Feature = 'feature',
  Grid = 'grid',
  Board = 'board',
  Hero = 'hero',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Feature]: TFeatureProps;
  [ComponentType.Board]: TBoardRawData;
  [ComponentType.Hero]: THeroProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TConsultingBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
