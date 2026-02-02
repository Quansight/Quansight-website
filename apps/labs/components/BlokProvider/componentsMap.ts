import {
  ColumnArticle,
  Form,
  Hero,
  Logos,
  Statute,
  Team,
  Teaser,
  Video,
} from '@quansight/shared/ui-components';

import { PageHeading } from '../PageHeading/PageHeading';
import { Projects } from '../Projects/Projects';
import { ComponentType } from './types';

export const componentsMap = {
  [ComponentType.PageHeading]: PageHeading,
  [ComponentType.ColumnArticle]: ColumnArticle,
  [ComponentType.Form]: Form,
  [ComponentType.Logos]: Logos,
  [ComponentType.Projects]: Projects,
  [ComponentType.Team]: Team,
  [ComponentType.Teaser]: Teaser,
  [ComponentType.Hero]: Hero,
  [ComponentType.Statute]: Statute,
  [ComponentType.Video]: Video,
};
