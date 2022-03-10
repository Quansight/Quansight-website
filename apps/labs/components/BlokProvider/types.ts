import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';
import { TFeatureProps } from '../Feature/Feature';
import { TTeaserProps } from '../Teaser/Teaser';

export enum ComponentType {
  Teaser = 'teaser',
  Feature = 'feature',
  Grid = 'grid',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Feature]: TFeatureProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TLabsBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
