import { Teaser, Hero } from '@quansight/shared/ui-components';

import { Board } from '../Board/Board';
import { FeatureArticle } from '../FeatureArticle/FeatureArticle';
import { JobList } from '../JobList/JobList';
import { StickyNotes } from '../StickyNotes/StickyNotes';

import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Board]: Board,
  [ComponentType.Hero]: Hero,
  [ComponentType.StickyNotes]: StickyNotes,
  [ComponentType.JobList]: JobList,
  [ComponentType.FeatureArticle]: FeatureArticle,
};
