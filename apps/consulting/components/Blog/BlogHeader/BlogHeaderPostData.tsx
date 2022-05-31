import { FC } from 'react';

import { formatArticleDate } from '../../../utils/formatArticleDate/formatArticleDate';
import { TBlogHeaderPostDataProps } from '../types';

export const BlogHeaderPostData: FC<TBlogHeaderPostDataProps> = ({
  postTitle,
  publishedDate,
}) => {
  const articleDate = formatArticleDate(publishedDate);

  return (
    <section className="mb-[1.2rem] lg:mb-[3.7rem]">
      <h2 className="text-[3rem] font-extrabold leading-[5.3rem] sm:mb-[5.1rem] sm:text-[4.8rem] font-heading text-violet">
        {postTitle}
      </h2>
      {articleDate && (
        <p className="text-[1.4rem] font-normal leading-[2.7rem]">
          Published {articleDate}
        </p>
      )}
    </section>
  );
};
