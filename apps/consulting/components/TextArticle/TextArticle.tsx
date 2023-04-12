import { FC } from 'react';

import { TTextArticleProps } from './types';

export const TextArticle: FC<TTextArticleProps> = ({ header, text }) => {
  return (
    <article
      className="
        max-w-layout mx-auto px-[3.5rem] pb-[2rem]
        pt-[5.5rem] md:grid md:grid-cols-[1fr,1fr]
        md:py-[8rem] lg:grid-cols-[6fr,7fr]
        lg:px-[13rem]
      "
    >
      <h2
        className="
          font-heading text-violet mb-[2.5rem] text-[4rem] font-extrabold
          leading-[4.9rem] md:text-[3.8rem]
          md:leading-[4.8rem]
        "
      >
        {header}
      </h2>
      <p className="text-[1.6rem] leading-[2.7rem] md:mt-[1rem] md:pl-[4rem]">
        {text}
      </p>
    </article>
  );
};
