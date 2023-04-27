import { readFileSync } from 'fs';

import { getPostPathToFile } from './getPostPathToFile';

export const getFileContent = (fileName: string): string =>
  readFileSync(getPostPathToFile(fileName), 'utf-8');
