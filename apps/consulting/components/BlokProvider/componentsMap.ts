import { ComponentType } from './types';
import { Board } from '../Board/Board';
import { Hero } from '@quansight/shared/ui-components';

export const componentsMap = {
  [ComponentType.Board]: Board,
  [ComponentType.Hero]: Hero,
};
