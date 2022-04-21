import { ComponentType, TBlokComponentProps } from '../types';

import { getBoardProps } from '../mappers/getBoardProps';
import { getBoardListProps } from '../mappers/getBoardListProps';
import { getColumnsProps } from '../mappers/getColumnsProps';
import { getFeatureArticleProps } from '../mappers/getFeatureArticleProps';
import { getFeaturesProps } from '../mappers/getFeaturesProps';
import { getHeroProps } from '../mappers/getHeroProps';
import { getIntertwinedArticleProps } from '../mappers/getIntertwinedArticleProps';
import { getJobListProps } from '../mappers/getJobListProps';
import { getRelatedProps } from '../mappers/getRelatedProps';
import { getStickyNotesProps } from '../mappers/getStickyNotesProps';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getTermsAndConditionsProps } from '../mappers/getTermsAndConditionsProps';
import { getTestimonialProps } from '../mappers/getTestimonialProps';
import { getTextArticleProps } from '../mappers/getTextArticleProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Board: {
      return getBoardProps(blok);
    }
    case ComponentType.BoardList: {
      return getBoardListProps(blok);
    }
    case ComponentType.Columns: {
      return getColumnsProps(blok);
    }
    case ComponentType.FeatureArticle: {
      return getFeatureArticleProps(blok);
    }
    case ComponentType.Features: {
      return getFeaturesProps(blok);
    }
    case ComponentType.Hero: {
      return getHeroProps(blok);
    }
    case ComponentType.IntertwinedArticle: {
      return getIntertwinedArticleProps(blok);
    }
    case ComponentType.JobList: {
      return getJobListProps(blok);
    }
    case ComponentType.Related: {
      return getRelatedProps(blok);
    }
    case ComponentType.StickyNotes: {
      return getStickyNotesProps(blok);
    }
    case ComponentType.Teaser: {
      return getTeaserProps(blok);
    }
    case ComponentType.TermsAndConditions: {
      return getTermsAndConditionsProps(blok);
    }
    case ComponentType.Testimonial: {
      return getTestimonialProps(blok);
    }
    case ComponentType.TextArticle: {
      return getTextArticleProps(blok);
    }
    default:
      return null;
  }
};
