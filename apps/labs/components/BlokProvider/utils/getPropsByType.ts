import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';
import { getColumnArticleProps } from '../mappers/getColumnArticleProps';
import { getLogosProps } from '../mappers/getLogosProps';
import { ComponentType, TBlokComponentProps } from '../types';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.ColumnArticle: {
      return getColumnArticleProps(blok);
    }
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    default:
      return null;
  }
};
