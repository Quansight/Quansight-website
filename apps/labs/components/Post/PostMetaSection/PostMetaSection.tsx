import React, { FC } from 'react';

import { TPostMeta } from '../../../types/storyblok/bloks/posts';
import { PostAuthor } from './PostAuthor/PostAuthor';

export type PostMetaSectionProps = Pick<
  TPostMeta,
  'author' | 'published' | 'title'
>;

export const PostMetaSection: FC<PostMetaSectionProps> = ({
  title,
  author,
  published,
}) => {
  return (
    <>
      <h2 className="mb-[5rem] text-[4.8rem] font-extrabold leading-[5.3rem] font-heading text-violet">
        {title}
      </h2>
      <p className="pb-[3rem] text-[1.4rem] leading-[2.7rem] text-black text-sans">
        Published {published}
      </p>
      <div className="mb-[5rem]">
        <PostAuthor authors={author} />
      </div>
    </>
  );
};
