import { Teaser, Hero } from '@quansight/shared/ui-components';

import { Board } from '../Board/Board';
import { BoardList } from '../BoardList/BoardList';
import { FeatureArticle } from '../FeatureArticle/FeatureArticle';
import { JobList } from '../JobList/JobList';
import { StickyNotes } from '../StickyNotes/StickyNotes';
import { Triptych } from '../Triptych/Triptych';

import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.Board]: Board,
  [ComponentType.BoardList]: BoardList,
  [ComponentType.FeatureArticle]: FeatureArticle,
  [ComponentType.Hero]: Hero,
  [ComponentType.JobList]: JobList,
  [ComponentType.StickyNotes]: StickyNotes,
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Triptych]: Triptych,
};
