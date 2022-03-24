import { TBoardRawData } from './board';
import { THeroRawData } from './hero';
import { TListRawData } from './list';
import { TTeaserRawData } from './teaser';
import { TJobListRawData } from './jobList';
import { TFeatureArticleRawData } from './featureArticle';
import { TStickyNotesRawData } from './stickyNotes';

export type TRawBlok =
  | TBoardRawData
  | THeroRawData
  | TListRawData
  | TTeaserRawData
  | TStickyNotesRawData
  | TJobListRawData
  | TFeatureArticleRawData;
