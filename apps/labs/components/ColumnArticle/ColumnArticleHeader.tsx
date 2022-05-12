import { FC } from 'react';

import { TColumnArticleHeaderProps } from './types';

export const ColumnArticleHeader: FC<TColumnArticleHeaderProps> = ({
  header,
  level,
}) => {
  return <h2>{header}</h2>;
};
