import { FC } from 'react';

import { TTextArticleProps } from './types';

export const TextArticle: FC<TTextArticleProps> = ({ header, text }) => {
  return (
    <article className="gap-[7rem] md:flex lg:px-[13rem] max-w-layout">
      <h2>{header}</h2>
      <p>{text}</p>
    </article>
  );
};
