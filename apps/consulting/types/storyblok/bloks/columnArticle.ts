import { TBlok, TRichText, TImage } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TColumnArticleRawData = {
  component: ComponentType.ColumnArticle;
  header: string;
  leftColumn: TRichText;
  rightColumn: TRichText;
  final: TRichText;
  image: TImage;
} & TBlok;
