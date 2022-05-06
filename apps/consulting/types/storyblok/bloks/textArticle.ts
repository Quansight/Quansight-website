import { TBlok } from '@quansight/shared/types';

import { ComponentType } from '../../../components/BlokProvider/types';

export type TTextArticleRawData = {
  component: ComponentType.TextArticle;
  header: string;
  text: string;
} & TBlok;
