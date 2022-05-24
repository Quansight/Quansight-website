import { Api } from '@quansight/shared/storyblok-sdk';

import { ArticleItem } from '../types/basic';
import { ArticleItemDocument } from '../types/hooks';
import {
  ArticleItemQuery,
  ArticleItemQueryVariables,
} from '../types/operations';

export const getArticleItem = async (
  params: ArticleItemQueryVariables,
): Promise<ArticleItem> => {
  const { data } = await Api.getArticleItem<
    ArticleItemQuery,
    ArticleItemQueryVariables
  >(ArticleItemDocument, params);
  return data.ArticleItem;
};
