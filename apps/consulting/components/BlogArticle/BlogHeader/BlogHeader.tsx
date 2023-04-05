import { FC } from 'react';

import { TBlogHeaderProps } from '../types';
import { BlogHeaderAuthor } from './BlogHeaderAuthor';
import { BlogHeaderLink } from './BlogHeaderLink';
import { BlogHeaderPostData } from './BlogHeaderPostData';

export const BlogHeader: FC<TBlogHeaderProps> = ({
  postTitle,
  publishedDate,
  author,
}) => (
  <header className="mt-[5.8rem] mb-[7rem] sm:mt-[4.4rem] sm:mb-[4.1rem] xl:mt-[7.1rem]">
    <BlogHeaderLink />
    <BlogHeaderPostData postTitle={postTitle} publishedDate={publishedDate} />
    <BlogHeaderAuthor {...author} />
  </header>
);
