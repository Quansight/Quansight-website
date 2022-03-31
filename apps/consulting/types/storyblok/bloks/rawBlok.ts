import { TBoardRawData } from './board';
import { TBoardListRawData } from './boardList';
import { TFeatureArticleRawData } from './featureArticle';
import { TFeaturesRawData } from './features';
import { THeroRawData } from './hero';
import { TJobListRawData } from './jobList';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | TBoardRawData
  | TBoardListRawData
  | TFeatureArticleRawData
  | TFeaturesRawData
  | THeroRawData
  | TJobListRawData
  | TStickyNotesRawData
  | TTeaserRawData;
