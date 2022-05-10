import { TBoardRawData } from './board';
import { TBoardListRawData } from './boardList';
import { TCenteredIntroRawData } from './centeredIntro';
import { TColumnsRawData } from './columns';
import { TFeatureArticleRawData } from './featureArticle';
import { TFeaturesRawData } from './features';
import { TFormRawData } from './form';
import { THeroRawData } from './hero';
import { TIntertwinedArticleRawData } from './intertwinedArticle';
import { TJobListRawData } from './jobList';
import { TRelatedRawData } from './related';
import { TStatuteRawData } from './statute';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';
import { TTestimonialRawData } from './testimonial';
import { TTextArticleRawData } from './textArticle';

export type TRawBlok =
  | TBoardRawData
  | TBoardListRawData
  | TCenteredIntroRawData
  | TColumnsRawData
  | TFeatureArticleRawData
  | TFeaturesRawData
  | TFormRawData
  | THeroRawData
  | TIntertwinedArticleRawData
  | TJobListRawData
  | TRelatedRawData
  | TStatuteRawData
  | TStickyNotesRawData
  | TTeaserRawData
  | TTestimonialRawData
  | TTextArticleRawData;
