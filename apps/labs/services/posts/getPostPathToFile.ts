import path from 'path';

import { POSTS_DIRECTORY_PATH } from '../api/posts/constants';

export const getPostPathToFile = (fileName: string): string =>
  path.join(process.cwd(), POSTS_DIRECTORY_PATH, fileName);
