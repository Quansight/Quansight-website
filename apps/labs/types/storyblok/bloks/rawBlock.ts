import { TColumnArticleRawData } from './columnArticle';
import { TFormRawData } from './form';
import { THeroRawData } from './hero';
import { TLogosRawData } from './logos';
import { TPageHeadingRawData } from './pageHeading';
import { TProjectsRawData } from './projects';
import { TStatuteRawData } from './statute';
import { TTeamRawData } from './team';
import { TTeaserRawData } from './teaser';

export type TRawBlok =
  | TPageHeadingRawData
  | TColumnArticleRawData
  | TFormRawData
  | TLogosRawData
  | TProjectsRawData
  | TStatuteRawData
  | TTeamRawData
  | TTeaserRawData
  | THeroRawData;
