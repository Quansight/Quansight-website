import { THeroProps, TTeaserProps } from '@quansight/shared/ui-components';
import { TypeValuesUnion } from '@quansight/shared/config';
import { TBoardProps } from '../Board/Board';
import { TFeatureArticleProps } from '../FeatureArticle/types';
import { TJobListProps } from '../JobList/types';
import { TStickyNotesProps } from '../StickyNotes/types';

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
