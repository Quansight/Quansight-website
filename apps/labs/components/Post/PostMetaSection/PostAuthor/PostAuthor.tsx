import React, { FC } from 'react';

import { TPostMeta } from '../../../../types/storyblok/bloks/posts';
import { PostAuthorItem } from './PostAuthorItem';

export interface TPostAuthorProps {
  authors: TPostMeta['author'];
}

export const PostAuthor: FC<TPostAuthorProps> = ({ authors }) => {
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
