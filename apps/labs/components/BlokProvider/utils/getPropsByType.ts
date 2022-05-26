import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';
import { getColumnArticleProps } from '../mappers/getColumnArticleProps';
import { getFormProps } from '../mappers/getFormProps';
import { getLogosProps } from '../mappers/getLogosProps';
import { getPageHeadingProps } from '../mappers/getPageHeadingProps';
import { getProjectsProps } from '../mappers/getProjectsProps';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { ComponentType, TBlokComponentProps } from '../types';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.PageHeading: {
      return getPageHeadingProps(blok);
    }
    case ComponentType.ColumnArticle: {
      return getColumnArticleProps(blok);
    }
    case ComponentType.Form: {
      return getFormProps(blok);
    }
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    case ComponentType.Projects: {
      return getProjectsProps(blok);
    }
    case ComponentType.Teaser: {
      return getTeaserProps(blok);
    }
    default:
      return null;
  }
};
