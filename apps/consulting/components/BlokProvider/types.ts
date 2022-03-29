import {
  TypeValuesUnion,
  THeroProps,
  TTeaserProps,
  TStickyNotesProps,
  TFeatureArticleProps,
} from '@quansight/shared/ui-components';
import { TBoardProps } from '../Board/Board';
import { TJobListProps } from '../JobList/types';

export enum ComponentType {
  Teaser = 'teaser',
  Board = 'board',
  Hero = 'hero',
  StickyNotes = 'sticky-notes',
  JobList = 'job-list',
  FeatureArticle = 'feature-article',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Board]: TBoardProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
  [ComponentType.JobList]: TJobListProps;
  [ComponentType.FeatureArticle]: TFeatureArticleProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
