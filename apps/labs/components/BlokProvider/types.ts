import { TypeValuesUnion } from '@quansight/shared/types';
import {
  TCenteredIntroProps,
  TLogosProps,
} from '@quansight/shared/ui-components';

import { TColumnArticleProps } from '../ColumnArticle/types';

export enum ComponentType {
  CenteredIntro = 'centered-intro',
  ColumnArticle = 'column-article',
  Logos = 'logos',
}

type TBlokComponentPropsMap = {
  [ComponentType.CenteredIntro]: TCenteredIntroProps;
  [ComponentType.ColumnArticle]: TColumnArticleProps;
  [ComponentType.Logos]: TLogosProps;
};

export type TBlokComponentProps = TypeValuesUnion<TBlokComponentPropsMap>;
