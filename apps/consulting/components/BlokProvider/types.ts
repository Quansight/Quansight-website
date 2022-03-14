import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';
import { TFeatureProps } from '../Feature/Feature';
import { TTeaserProps } from '../Teaser/Teaser';
import { TQconsultingProps } from '../Qconsulting/Qconsulting';
import { TQconsultingItemProps } from '../QconsultingItem/QconsultingItem';

export enum ComponentType {
  Teaser = 'teaser',
  Feature = 'feature',
  Grid = 'grid',
  Qconsulting = 'qconsulting',
  QconsultingItem = 'qconsulting-item',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Feature]: TFeatureProps;
  [ComponentType.Qconsulting]: TQconsultingProps;
  [ComponentType.QconsultingItem]: TQconsultingItemProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TConsultingBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
