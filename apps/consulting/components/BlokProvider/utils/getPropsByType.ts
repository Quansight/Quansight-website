import { ComponentType, TBlokComponentProps } from '../types';

import { getBoardProps } from '../mappers/getBoardProps';
import { getFeatureArticleProps } from '../mappers/getFeatureArticleProps';
import { getHeroProps } from '../mappers/getHeroProps';
import { getJobListProps } from '../mappers/getJobListProps';
import { getListProps } from '../mappers/getListProps';
import { getStickyNotesProps } from '../mappers/getStickyNotesProps';
import { getTeaserProps } from '../mappers/getTeaserProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Board: {
      return getBoardProps(blok);
    }
    case ComponentType.FeatureArticle: {
      return getFeatureArticleProps(blok);
    }
    case ComponentType.Hero: {
      return getHeroProps(blok);
    }
    case ComponentType.JobList: {
      return getJobListProps(blok);
    }
    case ComponentType.List: {
      return getListProps(blok);
    }
    case ComponentType.StickyNotes: {
      return getStickyNotesProps(blok);
    }
    case ComponentType.Teaser: {
      return getTeaserProps(blok);
    }
    default:
      return null;
  }
};
