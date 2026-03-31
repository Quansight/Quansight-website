import matter from 'gray-matter';

import { ArrayElementType } from '@quansight/shared/types';

import { TeamQuery } from '../../api';
import { TPostMeta } from '../../types/storyblok/bloks/posts';
import { getFileContent } from '../api/posts/getFileContent';
import { serializePostMeta } from './serializePost';

export const getPostMeta = (
  fileName: string,
  authors: Array<ArrayElementType<TeamQuery['PersonItems']['items']>> = [],
): TPostMeta => {
  const fileContent = getFileContent(fileName);
  const { data } = matter(fileContent);

  return serializePostMeta(data, authors);
};
