import { TBoardRawData } from './board';
import { TFeatureArticleRawData } from './featureArticle';
import { THeroRawData } from './hero';
import { TJobListRawData } from './jobList';
import { TListRawData } from './list';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | TBoardRawData
  | TFeatureArticleRawData
  | THeroRawData
  | TListRawData
  | TJobListRawData
  | TStickyNotesRawData
  | TTeaserRawData;
