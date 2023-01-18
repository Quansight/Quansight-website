import { TypeValuesUnion } from '@quansight/shared/types';
import {
  TColumnArticleProps,
  TFormProps,
  THeroProps,
  TLogosProps,
  TStatuteProps,
  TTeaserProps,
  TTeamProps,
  TVideoProps,
} from '@quansight/shared/ui-components';

import { TBlogArticleProps } from '../BlogArticle/types';
import { TBoardProps } from '../Board/types';
import { TBoardListProps } from '../BoardList/types';
import { TCenteredIntroProps } from '../CenteredIntro/types';
import { TColumnsProps } from '../Columns/types';
import { TFeatureArticleProps } from '../FeatureArticle/types';
import { TFeaturesProps } from '../Features/types';
import { TIntertwinedArticleProps } from '../IntertwinedArticle/types';
import { TJobListProps } from '../JobList/types';
import { TRelatedProps } from '../Related/types';
import { TStickyNotesProps } from '../StickyNotes/types';
import { TTestimonialProps } from '../Testimonial/types';
import { TTextArticleProps } from '../TextArticle/types';

export enum ComponentType {
  BlogArticle = 'blog-article',
  Board = 'board',
  BoardList = 'board-list',
  CenteredIntro = 'centered-intro',
  ColumnArticle = 'column-article',
  Columns = 'columns',
  FeatureArticle = 'feature-article',
  Features = 'features',
  Form = 'form',
  Hero = 'hero',
  IntertwinedArticle = 'intertwined-article',
  JobList = 'job-list',
  Logos = 'logos',
  Related = 'related',
  Statute = 'statute',
  StickyNotes = 'sticky-notes',
  Team = 'team',
  Teaser = 'teaser',
  Testimonial = 'testimonial',
  TextArticle = 'text-article',
  Video = 'video',
}

type TBlokComponentPropsMap = {
  [ComponentType.BlogArticle]: TBlogArticleProps;
  [ComponentType.Board]: TBoardProps;
  [ComponentType.BoardList]: TBoardListProps;
  [ComponentType.CenteredIntro]: TCenteredIntroProps;
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Columns]: TColumnsProps;
  [ComponentType.FeatureArticle]: TFeatureArticleProps;
  [ComponentType.Features]: TFeaturesProps;
  [ComponentType.Form]: TFormProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.IntertwinedArticle]: TIntertwinedArticleProps;
  [ComponentType.JobList]: TJobListProps;
  [ComponentType.Logos]: TLogosProps;
  [ComponentType.Related]: TRelatedProps;
  [ComponentType.Statute]: TStatuteProps;
  [ComponentType.StickyNotes]: TStickyNotesProps;
  [ComponentType.Team]: TTeamProps;
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Testimonial]: TTestimonialProps;
  [ComponentType.TextArticle]: TTextArticleProps;
  [ComponentType.Video]: TVideoProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
