import { FC } from 'react';
import { TIntertwinedArticleProps } from './types';
import { createMarkup } from '@quansight/shared/utils';
import { IntertwinedArticleItem } from './IntertwinedArticleItem';

export const IntertwinedArticle: FC<TIntertwinedArticleProps> = ({
  title,
  sections,
  footer,
}) => {
  return (
    <article className="px-12 pt-[5.8rem] pb-[11.2rem] mx-auto sm:px-[4.8rem] xl:px-[18.5rem] max-w-layout">
      <h2 className="mb-[3.6rem] text-[4rem] font-extrabold leading-[4.9rem] sm:mb-[6.4rem] sm:text-[4.8rem] sm:text-center xl:mb-32 font-heading text-violet">
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
