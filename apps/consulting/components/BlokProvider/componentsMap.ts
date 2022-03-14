import { ComponentType } from './types';
import { Feature } from '../Feature/Feature';
import { Teaser } from '../Teaser/Teaser';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Feature]: Feature,
};
