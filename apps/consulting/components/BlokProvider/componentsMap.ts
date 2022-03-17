import { ComponentType } from './types';

import { Teaser } from '@quansight/shared/ui-components';
import { Board } from '../Board/Board';
import { Hero } from '@quansight/shared/ui-components';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Board]: Board,
  [ComponentType.Hero]: Hero,
};
