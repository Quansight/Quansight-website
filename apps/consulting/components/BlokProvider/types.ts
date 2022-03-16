import { TypeValuesUnion, TBlok } from '@quansight/shared/ui-components';
import { TBoardRawData } from '../../types/storyblok/bloks/board';
import { TTeaserRawData } from '../../types/storyblok/bloks/teaser';

export enum ComponentType {
  Teaser = 'teaser',
  Board = 'board',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserRawData;
  [ComponentType.Board]: TBoardRawData;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;

export type TConsultingBlok<T = TBlokComponentProps> = TBlok<
  keyof typeof ComponentType,
  T
>;
