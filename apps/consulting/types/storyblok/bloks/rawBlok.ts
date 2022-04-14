import { TBoardRawData } from './board';
import { TBoardListRawData } from './boardList';
import { TColumnsRawData } from './columns';
import { TFeatureArticleRawData } from './featureArticle';
import { TFeaturesRawData } from './features';
import { THeroRawData } from './hero';
import { TIntertwinedArticleRawData } from './intertwinedArticle';
import { TJobListRawData } from './jobList';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | TBoardRawData
  | TBoardListRawData
  | TColumnsRawData
  | TFeatureArticleRawData
  | TFeaturesRawData
  | THeroRawData
  | TIntertwinedArticleRawData
  | TJobListRawData
  | TStickyNotesRawData
  | TTeaserRawData;
