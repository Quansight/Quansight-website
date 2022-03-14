import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';

import { TTeaserProps } from '../Teaser/types';

export enum ComponentType {
  Teaser = 'Teaser',
  Grid = 'grid',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
};

export type TBlokProviderProps = {
  blok: TConsultingBlok;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TConsultingBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
