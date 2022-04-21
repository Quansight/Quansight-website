import { FC } from 'react';

import { TTextArticleProps } from './types';

export const TextArticle: FC<TTextArticleProps> = ({ header, text }) => {
  return (
    <article
      className="
        px-[3.5rem] pt-[5.5rem] pb-[2rem] mx-auto
        md:grid md:grid-cols-[1fr,1fr] md:py-[8rem]
        lg:grid-cols-[6fr,7fr] lg:px-[13rem]
        max-w-layout
      "
    >
      <h2
        className="
          mb-[2.5rem] text-[4rem] font-extrabold leading-[4.9rem] md:text-[4.8rem] md:leading-[5.5rem]
           text-violet font-heading
        "
      >
        {header}
      </h2>
      <p className="text-[1.6rem] leading-[2.7rem] md:pl-[4rem] md:mt-[1rem]">
        {text}
      </p>
    </article>
  );
};
