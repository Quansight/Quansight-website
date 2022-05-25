import { CenteredIntro, Logos } from '@quansight/shared/ui-components';

import { ColumnArticle } from '../ColumnArticle/ColumnArticle';
import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.CenteredIntro]: CenteredIntro,
  [ComponentType.ColumnArticle]: ColumnArticle,
  [ComponentType.Logos]: Logos,
};
