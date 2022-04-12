import { THeroProps, TTeaserProps } from '@quansight/shared/ui-components';
import { TypeValuesUnion } from '@quansight/shared/types';

import { TBoardProps } from '../Board/types';
import { TBoardListProps } from '../BoardList/types';
import { TColumnsProps } from '../Columns/types';
import { TFeatureArticleProps } from '../FeatureArticle/types';
import { TFeaturesProps } from '../Features/types';
import { TIntertwinedArticleProps } from '../IntertwinedArticle/types';
import { TJobListProps } from '../JobList/types';
import { TStickyNotesProps } from '../StickyNotes/types';

export enum ComponentType {
  Board = 'board',
  BoardList = 'board-list',
  Columns = 'columns',
  FeatureArticle = 'feature-article',
  Features = 'features',
  Hero = 'hero',
  JobList = 'job-list',
  StickyNotes = 'sticky-notes',
  Teaser = 'teaser',
  IntertwinedArticle = 'intertwined-article',
}

type TBlokComponentPropsMap = {
  [ComponentType.Board]: TBoardProps;
  [ComponentType.BoardList]: TBoardListProps;
  [ComponentType.Columns]: TColumnsProps;
  [ComponentType.FeatureArticle]: TFeatureArticleProps;
  [ComponentType.Features]: TFeaturesProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.IntertwinedArticle]: TIntertwinedArticleProps;
  [ComponentType.JobList]: TJobListProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
  [ComponentType.Teaser]: TTeaserProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
