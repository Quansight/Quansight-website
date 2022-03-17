import { ComponentType } from './types';

import { Teaser } from '@quansight/shared/ui-components';
import { Board } from '../Board/Board';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Board]: Board,
};
