import { TypeValuesUnion } from '@quansight/shared/types';
import { TLogosProps } from '@quansight/shared/ui-components';

import { TColumnArticleProps } from '../ColumnArticle/types';
import { TPageHeadingProps } from '../PageHeading/types';
import { TProjectsProps } from '../Projects/types';

export enum ComponentType {
  PageHeading = 'page-heading',
  ColumnArticle = 'column-article',
  Logos = 'logos',
  Projects = 'projects',
}

type TBlokComponentPropsMap = {
  [ComponentType.PageHeading]: TPageHeadingProps;
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Logos]: TLogosProps;
  [ComponentType.Projects]: TProjectsProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
