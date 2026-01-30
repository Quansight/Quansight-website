import React, { FC } from 'react';

import { TPostMeta } from '../../../types/storyblok/bloks/posts';
import { PostAuthorItem } from './PostAuthorItem';

export interface TPostAuthorsProps {
  authors: TPostMeta['authors'];
}

export const PostAuthors: FC<TPostAuthorsProps> = ({ authors }) => {
  return (
    <div className="grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
      {authors.map((author, i) => (
        <div key={i}>
          <PostAuthorItem {...author} />
        </div>
      ))}
    </div>
  );
};
