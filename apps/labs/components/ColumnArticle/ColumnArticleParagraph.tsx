import { FC } from 'react';

import { TColumnArticleParagraphProps } from './types';

export const ColumnArticleParagraph: FC<TColumnArticleParagraphProps> = ({
  text,
}) => {
  return <p>{text}</p>;
};
