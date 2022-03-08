import { Teaser, TTeaserProps } from '../components/Teaser/Teaser';
import { Feature, TFeatureProps } from '../components/Feature/Feature';

import { ComponentType } from '../types/storyblok/blok';
import { TypeValuesUnion } from '../types/helpers/TypeValuesUnion';

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Feature]: TFeatureProps;
};

export const blokMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Feature]: Feature,
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
