import React, { FC } from 'react';

import { TPostMeta } from '../../../../types/storyblok/bloks/posts';
import { PostAuthorItem } from './PostAuthorItem';

export interface TPostAuthorsProps {
  authors: TPostMeta['authors'];
}

export const PostAuthors: FC<TPostAuthorsProps> = ({ authors }) => {
  return (
    <>
      {authors.map((author, i) => (
        <div key={i}>
          <PostAuthorItem {...author} />
        </div>
      ))}
    </>
  );
};
