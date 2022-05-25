import { TCenteredIntroRawData } from './centeredIntro';
import { TColumnArticleRawData } from './columnArticle';
import { TLogosRawData } from './logos';
import { TProjectsRawData } from './projects';

export type TRawBlok =
  | TCenteredIntroRawData
  | TColumnArticleRawData
  | TLogosRawData
  | TProjectsRawData;
