import {
  TypeValuesUnion,
  THeroProps,
  TTeaserProps,
  TStickyNotesProps,
  TFeatureArticleProps,
} from '@quansight/shared/ui-components';
import { TBoardProps } from '../Board/Board';

export enum ComponentType {
  Teaser = 'teaser',
  Board = 'board',
  Hero = 'hero',
  StickyNotes = 'sticky-notes',
  FeatureArticle = 'feature-article',
}

type TBlokComponentPropsMap = {
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Board]: TBoardProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
  [ComponentType.FeatureArticle]: TFeatureArticleProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
