import { FC } from 'react';

import { createMarkup } from '@quansight/shared/utils';

import { TBlogPostProps } from '../types';

export const BlogPost: FC<TBlogPostProps> = ({ postText }) => {
  return <div dangerouslySetInnerHTML={createMarkup(postText)} />;
};
