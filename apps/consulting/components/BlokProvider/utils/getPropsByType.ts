import { ComponentType, TBlokComponentProps } from '../types';

import { getBoardProps } from '../mappers/getBoardProps';
import { getHeroProps } from '../mappers/getHeroProps';
import { getListProps } from '../mappers/getListProps';
import { getStickyNotesProps } from '../mappers/getStickyNotesProps';
import { getJobListProps } from '../mappers/getJobListProps';
import { getFeatureArticleProps } from '../mappers/getFeatureArticleProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Board: {
      return getBoardProps(blok);
    }
    case ComponentType.Hero: {
      return getHeroProps(blok);
    }
    case ComponentType.List: {
      return getListProps(blok);
    }
    case ComponentType.StickyNotes: {
      return getStickyNotesProps(blok);
    }
    case ComponentType.JobList: {
      return getJobListProps(blok);
    }
    case ComponentType.FeatureArticle: {
      return getFeatureArticleProps(blok);
    }
    default:
      return null;
  }
};
