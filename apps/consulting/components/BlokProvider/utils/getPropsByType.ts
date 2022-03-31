import { ComponentType, TBlokComponentProps } from '../types';

import { getBoardProps } from '../mappers/getBoardProps';
import { getBoardListProps } from '../mappers/getBoardListProps';
import { getFeatureArticleProps } from '../mappers/getFeatureArticleProps';
import { getHeroProps } from '../mappers/getHeroProps';
import { getJobListProps } from '../mappers/getJobListProps';
import { getStickyNotesProps } from '../mappers/getStickyNotesProps';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getTriptychProps } from '../mappers/getTriptychProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Board: {
      return getBoardProps(blok);
    }
    case ComponentType.BoardList: {
      return getBoardListProps(blok);
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
    case ComponentType.StickyNotes: {
      return getStickyNotesProps(blok);
    }
    case ComponentType.Teaser: {
      return getTeaserProps(blok);
    }
    case ComponentType.Triptych: {
      return getTriptychProps(blok);
    }
    default:
      return null;
  }
};
