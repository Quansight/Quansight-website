import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';
import { TFeatureProps } from '../Feature/Feature';
import { TTeaserProps } from '../Teaser/Teaser';

export enum ComponentType {
  Teaser = 'Teaser',
  Feature = 'feature',
  Grid = 'grid',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Feature]: TFeatureProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TConsultingBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
