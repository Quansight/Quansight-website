import { TypeValuesUnion } from '@quansight/shared/types';
import { TLogosProps } from '@quansight/shared/ui-components';
import { TColumnArticleProps } from '../ColumnArticle/types';

export enum ComponentType {
  ColumnArticle = 'column-article',
  Logos = 'logos',
}

type TBlokComponentPropsMap = {
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Logos]: TLogosProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
