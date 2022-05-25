import { TColumnArticleRawData } from './columnArticle';
import { TLogosRawData } from './logos';
import { TPageHeadingRawData } from './pageHeading';
import { TProjectsRawData } from './projects';

export type TRawBlok =
  | TPageHeadingRawData
  | TColumnArticleRawData
  | TLogosRawData
  | TProjectsRawData;
