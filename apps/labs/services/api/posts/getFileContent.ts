import { readFileSync } from 'fs';

import { getPostPathToFile } from '../../posts/getPostPathToFile';

export const getFileContent = (fileName: string): string =>
  readFileSync(getPostPathToFile(fileName), 'utf-8');
