import { StickyNotes, Teaser } from '@quansight/shared/ui-components';
import { Hero } from '@quansight/shared/ui-components';

import { Board } from '../Board/Board';

import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Board]: Board,
  [ComponentType.Hero]: Hero,
  [ComponentType.StickyNotes]: StickyNotes,
};
