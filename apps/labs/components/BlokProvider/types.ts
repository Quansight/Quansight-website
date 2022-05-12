import { TypeValuesUnion } from '@quansight/shared/types';

import { TColumnArticleProps } from '../ColumnArticle/types';
import { TLogosProps } from '../Logos/types';

export enum ComponentType {
  ColumnArticle = 'column-article',
  Logos = 'logos',
}

type TBlokComponentPropsMap = {
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Logos]: TLogosProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
