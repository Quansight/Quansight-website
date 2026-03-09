import React, { FC } from 'react';

import { TPostMeta } from '../../../types/storyblok/bloks/posts';
import { PostAuthors } from './PostAuthors';

export type PostMetaSectionProps = Pick<
  TPostMeta,
  'authors' | 'published' | 'title'
>;

export const PostMetaSection: FC<PostMetaSectionProps> = ({
  title,
  authors,
  published,
}) => {
  return (
    <>
      <h1 className="mb-[5rem] text-[4.8rem] font-extrabold leading-[5.3rem] font-heading text-violet">
        {title}
      </h1>
      <p className="pb-[3rem] text-[1.4rem] leading-[2.7rem] text-black text-sans">
        Published {published}
      </p>
      <div className="mb-[5rem]">
        <PostAuthors authors={authors} />
      </div>
    </>
  );
};
