import { TypeValuesUnion, THeroProps } from '@quansight/shared/ui-components';
import { TBoardProps } from '../Board/Board';

export enum ComponentType {
  Board = 'board',
  Hero = 'hero',
}

type TBlokComponentPropsMap = {
  [ComponentType.Board]: TBoardProps;
  [ComponentType.Hero]: THeroProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
