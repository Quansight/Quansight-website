import { readdirSync } from 'fs';
import path from 'path';

import { POSTS_DIRECTORY_PATH } from '../api/posts/constants';

export const getPostsDirectory = (): string[] =>
  readdirSync(path.join(process.cwd(), POSTS_DIRECTORY_PATH));
