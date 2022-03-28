import {
  StickyNotes,
  Teaser,
  Hero,
  FeatureArticle,
} from '@quansight/shared/ui-components';

import { Board } from '../Board/Board';
import { JobOpenings } from '../JobOpenings/JobOpenings';

import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Board]: Board,
  [ComponentType.Hero]: Hero,
  [ComponentType.StickyNotes]: StickyNotes,
  [ComponentType.JobOpenings]: JobOpenings,
  [ComponentType.FeatureArticle]: FeatureArticle,
};
