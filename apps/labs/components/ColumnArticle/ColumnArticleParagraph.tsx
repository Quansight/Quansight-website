import { FC } from 'react';

import { TColumnArticleParagraphProps } from './types';

export const ColumnArticleParagraph: FC<TColumnArticleParagraphProps> = ({
  text,
}) => (
  <p className="my-[3rem] text-[1.6rem] leading-[2.7rem] text-black">{text}</p>
);
