import { TRichText, TImage, TBlok } from '@quansight/shared/types';
import { ComponentType } from '../../../components/BlokProvider/types';

type TIntertwinedArticleItem = {
  _uid: string;
  text: TRichText;
  image: TImage;
};

export type TIntertwinedArticleRawData = {
  component: ComponentType.IntertwinedArticle;
  title: string;
  sections: TIntertwinedArticleItem[];
  footer?: TRichText;
} & TBlok;
