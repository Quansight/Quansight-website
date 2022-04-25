import { Form, Hero, Statute, Teaser } from '@quansight/shared/ui-components';

import { Board } from '../Board/Board';
import { BoardList } from '../BoardList/BoardList';
import { CenteredIntro } from '../CenteredIntro/CenteredIntro';
import { Columns } from '../Columns/Columns';
import { FeatureArticle } from '../FeatureArticle/FeatureArticle';
import { Features } from '../Features/Features';
import { IntertwinedArticle } from '../IntertwinedArticle/IntertwinedArticle';
import { JobList } from '../JobList/JobList';
import { Related } from '../Related/Related';
import { StickyNotes } from '../StickyNotes/StickyNotes';
import { Team } from '../Team/Team';
import { Testimonial } from '../Testimonial/Testimonial';
import { TextArticle } from '../TextArticle/TextArticle';
import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.Board]: Board,
  [ComponentType.BoardList]: BoardList,
  [ComponentType.CenteredIntro]: CenteredIntro,
  [ComponentType.Columns]: Columns,
  [ComponentType.FeatureArticle]: FeatureArticle,
  [ComponentType.Features]: Features,
  [ComponentType.Form]: Form,
  [ComponentType.Hero]: Hero,
  [ComponentType.IntertwinedArticle]: IntertwinedArticle,
  [ComponentType.JobList]: JobList,
  [ComponentType.Related]: Related,
  [ComponentType.Statute]: Statute,
  [ComponentType.StickyNotes]: StickyNotes,
  [ComponentType.Team]: Team,
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Testimonial]: Testimonial,
  [ComponentType.TextArticle]: TextArticle,
};
