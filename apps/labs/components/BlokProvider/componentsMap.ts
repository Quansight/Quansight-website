import { ColumnArticle } from '../ColumnArticle/ColumnArticle';
import { Logos } from '../Logos/Logos';
import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.ColumnArticle]: ColumnArticle,
  [ComponentType.Logos]: Logos,
};
