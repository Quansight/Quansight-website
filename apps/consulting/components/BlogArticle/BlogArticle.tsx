import { FC } from 'react';

import { BlogHeader } from './BlogHeader/BlogHeader';
import { BlogPost } from './BlogPost/BlogPost';
import { TBlogArticleProps } from './types';

export const BlogArticle: FC<TBlogArticleProps> = ({
  postTitle,
  publishedDate,
  postText,
  author,
}) => {
  return (
    <article className="px-[2rem] mx-auto sm:px-[6rem] lg:px-[10rem] xl:px-[25rem] max-w-layout">
      <BlogHeader
        postTitle={postTitle}
        publishedDate={publishedDate}
        author={author}
      />
      <BlogPost postText={postText} />
    </article>
  );
};
