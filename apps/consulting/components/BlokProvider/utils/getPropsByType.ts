import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';
import { getBoardListProps } from '../mappers/getBoardListProps';
import { getBoardProps } from '../mappers/getBoardProps';
import { getCenteredIntroProps } from '../mappers/getCenteredIntroProps';
import { getColumnArticleProps } from '../mappers/getColumnArticleProps';
import { getColumnsProps } from '../mappers/getColumnsProps';
import { getFeatureArticleProps } from '../mappers/getFeatureArticleProps';
import { getFeaturesProps } from '../mappers/getFeaturesProps';
import { getFormProps } from '../mappers/getFormProps';
import { getHeroProps } from '../mappers/getHeroProps';
import { getIntertwinedArticleProps } from '../mappers/getIntertwinedArticleProps';
import { getJobListProps } from '../mappers/getJobListProps';
import { getLogosProps } from '../mappers/getLogosProps';
import { getRelatedProps } from '../mappers/getRelatedProps';
import { getStatuteProps } from '../mappers/getStatuteProps';
import { getStickyNotesProps } from '../mappers/getStickyNotesProps';
import { getTeamProps } from '../mappers/getTeamProps';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getTestimonialProps } from '../mappers/getTestimonialProps';
import { getTextArticleProps } from '../mappers/getTextArticleProps';
import { getVideoProps } from '../mappers/getVideoProps';
import { ComponentType, TBlokComponentProps } from '../types';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Board: {
      return getBoardProps(blok);
    }
    case ComponentType.BoardList: {
      return getBoardListProps(blok);
    }
    case ComponentType.CenteredIntro: {
      return getCenteredIntroProps(blok);
    }
    case ComponentType.ColumnArticle: {
      return getColumnArticleProps(blok);
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
    case ComponentType.Form: {
      return getFormProps(blok);
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
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    case ComponentType.Related: {
      return getRelatedProps(blok);
    }
    case ComponentType.Statute: {
      return getStatuteProps(blok);
    }
    case ComponentType.StickyNotes: {
      return getStickyNotesProps(blok);
    }
    case ComponentType.Team: {
      return getTeamProps(blok);
    }
    case ComponentType.Teaser: {
      return getTeaserProps(blok);
    }
    case ComponentType.Testimonial: {
      return getTestimonialProps(blok);
    }
    case ComponentType.TextArticle: {
      return getTextArticleProps(blok);
    }
    case ComponentType.Video: {
      return getVideoProps(blok);
    }
    default:
      return null;
  }
};
