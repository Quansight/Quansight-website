import { Api } from '@quansight/shared/storyblok-sdk';

import { ArticleItems } from '../types/basic';
import { ArticleItemsDocument } from '../types/hooks';
import { ArticleItemsQuery } from '../types/operations';

export const getArticleItems = async (): Promise<ArticleItems> => {
  const { data } = await Api.getArticleItems<ArticleItemsQuery>(
    ArticleItemsDocument,
  );
  return data.ArticleItems;
};
