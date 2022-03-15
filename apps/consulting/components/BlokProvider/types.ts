import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';
import { TTeaserProps } from '@quansight/shared/ui-components';

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
