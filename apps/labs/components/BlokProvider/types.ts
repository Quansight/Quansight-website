import { TypeValuesUnion } from '@quansight/shared/types';
import {
  TCenteredIntroProps,
  TLogosProps,
} from '@quansight/shared/ui-components';

import { TColumnArticleProps } from '../ColumnArticle/types';
import { TProjectsProps } from '../Projects/types';

export enum ComponentType {
  CenteredIntro = 'centered-intro',
  ColumnArticle = 'column-article',
  Logos = 'logos',
  Projects = 'projects',
}

type TBlokComponentPropsMap = {
  [ComponentType.CenteredIntro]: TCenteredIntroProps;
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Logos]: TLogosProps;
  [ComponentType.Projects]: TProjectsProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
