import { readFile } from 'fs/promises';
import path from 'path';

import { POSTS_DIRECTORY_PATH } from '..';
import { TLocalCategories } from './types';

export const getLocalCategories = async (): Promise<TLocalCategories> => {
  try {
    const categories = await readFile(
      path.join(process.cwd(), POSTS_DIRECTORY_PATH, 'categories.json'),
    );

    return JSON.parse(categories.toString());
  } catch (error) {
    console.error(error);

    return [];
  }
};
