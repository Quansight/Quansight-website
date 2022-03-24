import { THeroProps, TTeaserProps } from '@quansight/shared/ui-components';
import { TypeValuesUnion } from '@quansight/shared/types';

import { TBoardProps } from '../Board/types';
import { TBoardListProps } from '../BoardList/types';
import { TFeatureArticleProps } from '../FeatureArticle/types';
import { TJobListProps } from '../JobList/types';
import { TStickyNotesProps } from '../StickyNotes/types';

export enum ComponentType {
  Board = 'board',
  BoardList = 'board-list',
  FeatureArticle = 'feature-article',
  Hero = 'hero',
  JobList = 'job-list',
  StickyNotes = 'sticky-notes',
}

type TBlokComponentPropsMap = {
  [ComponentType.Board]: TBoardProps;
  [ComponentType.BoardList]: TBoardListProps;
  [ComponentType.FeatureArticle]: TFeatureArticleProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.JobList]: TJobListProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
