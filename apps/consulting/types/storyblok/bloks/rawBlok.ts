import { TBoardRawData } from './board';
import { TBoardListRawData } from './boardList';
import { TColumnsRawData } from './columns';
import { TFeatureArticleRawData } from './featureArticle';
import { TFeaturesRawData } from './features';
import { THeroRawData } from './hero';
import { TIntertwinedArticleRawData } from './intertwinedArticle';
import { TJobListRawData } from './jobList';
import { TRelatedRawData } from './related';
import { TStickyNotesRawData } from './stickyNotes';
import { TTeaserRawData } from './teaser';
import { TTermsAndConditionsRawData } from './termsAndConditions';
import { TTestimonialRawData } from './testimonial';
import { TTextArticleRawData } from './textArticle';

export type TRawBlok =
  | TBoardRawData
  | TBoardListRawData
  | TColumnsRawData
  | TFeatureArticleRawData
  | TFeaturesRawData
  | THeroRawData
  | TIntertwinedArticleRawData
  | TJobListRawData
  | TRelatedRawData
  | TStickyNotesRawData
  | TTeaserRawData
  | TTermsAndConditionsRawData
  | TTestimonialRawData
  | TTextArticleRawData;
