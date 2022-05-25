import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';
import { getCenteredIntroProps } from '../mappers/getCenteredIntroProps';
import { getColumnArticleProps } from '../mappers/getColumnArticleProps';
import { getLogosProps } from '../mappers/getLogosProps';
import { getProjectsProps } from '../mappers/getProjectsProps';
import { ComponentType, TBlokComponentProps } from '../types';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.CenteredIntro: {
      return getCenteredIntroProps(blok);
    }
    case ComponentType.ColumnArticle: {
      return getColumnArticleProps(blok);
    }
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    case ComponentType.Projects: {
      return getProjectsProps(blok);
    }
    default:
      return null;
  }
};
