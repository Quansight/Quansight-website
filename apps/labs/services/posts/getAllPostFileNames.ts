import { readdirSync } from 'fs';
import path from 'path';

import { POSTS_DIRECTORY_PATH } from '../api/posts/constants';

export const postFileExtensionRegExp = /\.(md|mdx)$/;

export const getAllPostFileNames = (): string[] =>
  readdirSync(path.join(process.cwd(), POSTS_DIRECTORY_PATH)).filter(
    (fileName) => postFileExtensionRegExp.test(fileName),
  );
