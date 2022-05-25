import { Logos } from '@quansight/shared/ui-components';

import { ColumnArticle } from '../ColumnArticle/ColumnArticle';
import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.ColumnArticle]: ColumnArticle,
  [ComponentType.Logos]: Logos,
};
