import { FC } from 'react';

import { createMarkup } from '@quansight/shared/utils';

import { IntertwinedArticleItem } from './IntertwinedArticleItem';
import { TIntertwinedArticleProps } from './types';

export const IntertwinedArticle: FC<TIntertwinedArticleProps> = ({
  title,
  sections,
  footer,
}) => {
  return (
    <article className="max-w-layout mx-auto px-12 py-[5.8rem] sm:px-[4.8rem] xl:px-[18.5rem]">
      <h2 className="font-heading text-violet mb-[3.6rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-[6.4rem] sm:text-center sm:text-[4.8rem] xl:mb-32">
        {title}
      </h2>
      {sections.map((props) => (
        <IntertwinedArticleItem {...props} key={props._uid} />
      ))}
      {footer && (
        <div
          className="mx-auto mt-28 max-w-[87.3rem] text-[1.6rem] leading-[2.7rem] sm:text-center"
          dangerouslySetInnerHTML={createMarkup(footer)}
        />
      )}
    </article>
  );
};
