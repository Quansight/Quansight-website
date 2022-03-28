import {
  TypeValuesUnion,
  THeroProps,
  TTeaserProps,
  TStickyNotesProps,
} from '@quansight/shared/ui-components';
import { TBoardProps } from '../Board/Board';
import { TJobOpeningsProps } from '../JobOpenings/types';

export enum ComponentType {
  Teaser = 'teaser',
  Board = 'board',
  Hero = 'hero',
  StickyNotes = 'sticky-notes',
  JobOpenings = 'job-openings',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Board]: TBoardProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
  [ComponentType.JobOpenings]: TJobOpeningsProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
