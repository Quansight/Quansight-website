import { TBoardRawData } from './board';
import { TBoardListRawData } from './boardList';
import { TFeatureArticleRawData } from './featureArticle';
import { TFeaturesRawData } from './features';
import { THeroRawData } from './hero';
import { TIntertwinedArticleRawData } from './intertwinedArticle';
import { TJobListRawData } from './jobList';
import { TLogosRawData } from './logos';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | TBoardRawData
  | TBoardListRawData
  | TFeatureArticleRawData
  | TFeaturesRawData
  | THeroRawData
  | TIntertwinedArticleRawData
  | TJobListRawData
  | TStickyNotesRawData
  | TTeaserRawData
  | TLogosRawData;
