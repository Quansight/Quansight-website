import {
  TypeValuesUnion,
  THeroProps,
  TTeaserProps,
} from '@quansight/shared/ui-components';
import { TBoardProps } from '../Board/Board';

export enum ComponentType {
  Teaser = 'teaser',
  Board = 'board',
  Hero = 'hero',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Board]: TBoardProps;
  [ComponentType.Hero]: THeroProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
