import { TypeValuesUnion } from '@quansight/shared/types';
import {
  TColumnArticleProps,
  TFormProps,
  TLogosProps,
  TTeamProps,
  TStatuteProps,
  TTeaserProps,
  THeroProps,
} from '@quansight/shared/ui-components';

import { TPageHeadingProps } from '../PageHeading/types';
import { TProjectsProps } from '../Projects/types';

export enum ComponentType {
  PageHeading = 'page-heading',
  ColumnArticle = 'column-article',
  Form = 'form',
  Logos = 'logos',
  Projects = 'projects',
  Team = 'team',
  Teaser = 'teaser',
  Hero = 'hero',
  Statute = 'statute',
}

type TBlokComponentPropsMap = {
  [ComponentType.PageHeading]: TPageHeadingProps;
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Form]: TFormProps;
  [ComponentType.Logos]: TLogosProps;
  [ComponentType.Projects]: TProjectsProps;
  [ComponentType.Team]: TTeamProps;
  [ComponentType.Teaser]: TTeaserProps;
  [ComponentType.Hero]: THeroProps;
  [ComponentType.Statute]: TStatuteProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
