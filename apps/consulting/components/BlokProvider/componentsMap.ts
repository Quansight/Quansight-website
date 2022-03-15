import { ComponentType } from './types';
import { Feature } from '../Feature/Feature';
import { Teaser } from '../Teaser/Teaser';
import { Board } from '../Board/Board';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Feature]: Feature,
  [ComponentType.Board]: Board,
};
