import { TBoardRawData } from './board';
import { TBoardListRawData } from './boardList';
import { TFeatureArticleRawData } from './featureArticle';
import { THeroRawData } from './hero';
import { TJobListRawData } from './jobList';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';
import { TTriptychRawData } from './triptych';

export type TRawBlok =
  | TBoardRawData
  | TBoardListRawData
  | TFeatureArticleRawData
  | THeroRawData
  | TJobListRawData
  | TStickyNotesRawData
  | TTeaserRawData
  | TTriptychRawData;
