import {
  TypeValuesUnion,
  THeroProps,
  TTeaserProps,
  TStickyNotesProps,
} from '@quansight/shared/ui-components';
import { TBoardProps } from '../Board/Board';

export enum ComponentType {
  Teaser = 'teaser',
  Board = 'board',
  Hero = 'hero',
  StickyNotes = 'sticky-notes',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Board]: TBoardProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
