import { TColumnArticleRawData } from './columnArticle';
import { TFormRawData } from './form';
import { TLogosRawData } from './logos';
import { TPageHeadingRawData } from './pageHeading';
import { TProjectsRawData } from './projects';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | TPageHeadingRawData
  | TColumnArticleRawData
  | TFormRawData
  | TLogosRawData
  | TProjectsRawData
  | TTeaserRawData;
