import { TypeValuesUnion } from '@quansight/shared/types';
import {
  TFormProps,
  TLogosProps,
  TTeamProps,
  TTeaserProps,
  THeroProps,
} from '@quansight/shared/ui-components';

import { TColumnArticleProps } from '../ColumnArticle/types';
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
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
