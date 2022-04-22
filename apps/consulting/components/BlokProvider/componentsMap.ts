import { Teaser, Hero } from '@quansight/shared/ui-components';

import { Board } from '../Board/Board';
import { BoardList } from '../BoardList/BoardList';
import { Columns } from '../Columns/Columns';
import { FeatureArticle } from '../FeatureArticle/FeatureArticle';
import { Features } from '../Features/Features';
import { IntertwinedArticle } from '../IntertwinedArticle/IntertwinedArticle';
import { JobList } from '../JobList/JobList';
import { LibraryIntro } from '../LibraryIntro/LibraryIntro';
import { Related } from '../Related/Related';
import { StickyNotes } from '../StickyNotes/StickyNotes';
import { Testimonial } from '../Testimonial/Testimonial';
import { TextArticle } from '../TextArticle/TextArticle';

import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.Board]: Board,
  [ComponentType.BoardList]: BoardList,
  [ComponentType.Columns]: Columns,
  [ComponentType.FeatureArticle]: FeatureArticle,
  [ComponentType.Features]: Features,
  [ComponentType.Hero]: Hero,
  [ComponentType.IntertwinedArticle]: IntertwinedArticle,
  [ComponentType.JobList]: JobList,
  [ComponentType.LibraryIntro]: LibraryIntro,
  [ComponentType.Related]: Related,
  [ComponentType.StickyNotes]: StickyNotes,
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Testimonial]: Testimonial,
  [ComponentType.TextArticle]: TextArticle,
};
