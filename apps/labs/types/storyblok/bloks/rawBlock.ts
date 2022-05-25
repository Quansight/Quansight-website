import { TCenteredIntroRawData } from './centeredIntro';
import { TColumnArticleRawData } from './columnArticle';
import { TLogosRawData } from './logos';

export type TRawBlok =
  | TCenteredIntroRawData
  | TColumnArticleRawData
  | TLogosRawData;
